/**
 * Diagnostic API route (MVP).
 *
 * This is MVP in-memory session storage.
 * Sessions are lost on server restart.
 * Replace with a database in production.
 */

import { NextRequest, NextResponse } from 'next/server';
import { DiagnosticSession } from '@/engine/diagnosticSession';
import { initializeDiagnosticSession } from '@/engine/initializeSession';
import { runDiagnosticSessionStep } from '@/engine/runDiagnosticSessionStep';
import { handleDiagnosticStepCompletion } from '@/engine/handleDiagnosticStepCompletion';
import { getRandomCaseForLevel } from '@/config/cases';
import { getTrackEntry, supportedTrackIds } from '@/config/registry';
import { getCaseContent, getProbeContent, getProbeExhibit, serializeExhibitForAI } from '@/content/index';
import { DiagnosticStep } from '@/engine/DiagnosticFlow';
import { applyDiagnosticStepResult } from '@/engine/applyDiagnosticStepResult';
import { generateDiagnosticResult, calculateProbeScore, type Difficulty } from '@/engine/scoring';
import { DiagnosticStatus } from '@/engine/diagnosticSession';
import { batchExtractSignals } from '@/lib/ai/batchExtractSignals';

// MVP: in-memory session store. Replace with database in production.
const sessions = new Map<string, DiagnosticSession>();

// Track the last step per session so we can pass it to handleDiagnosticStepCompletion
const pendingSteps = new Map<string, DiagnosticStep>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'start') {
      return handleStart(body);
    }

    if (action === 'answer') {
      return handleAnswer(body);
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleStart(body: { trackId?: string }) {
  const { trackId } = body;

  if (!trackId) {
    return NextResponse.json(
      { error: 'Missing trackId' },
      { status: 400 }
    );
  }

  if (!supportedTrackIds.includes(trackId)) {
    return NextResponse.json(
      { error: `Unsupported trackId: ${trackId}` },
      { status: 400 }
    );
  }

  const trackEntry = getTrackEntry(trackId);
  if (!trackEntry) {
    return NextResponse.json(
      { error: `No configuration found for trackId: ${trackId}` },
      { status: 500 }
    );
  }

  const initialCase = getRandomCaseForLevel(trackId, 1);
  const session = initializeDiagnosticSession(trackId, initialCase.caseId);

  // Get the first step
  const result = await runDiagnosticSessionStep(session, trackEntry.probes);

  sessions.set(result.session.sessionId, result.session);

  if (result.step.type === 'probe') {
    pendingSteps.set(result.session.sessionId, result.step);
  }

  return NextResponse.json({
    sessionId: result.session.sessionId,
    trackId,
    step: serializeStep(result.step, result.session.currentCaseId),
    caseStage: result.session.caseStage,
    currentCaseId: result.session.currentCaseId,
  });
}

async function handleAnswer(body: {
  sessionId?: string;
  rawResponse?: unknown;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
}) {
  const { sessionId, rawResponse, selectedOptionId, selectedOptionIds } = body;

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const lastStep = pendingSteps.get(sessionId);
  if (!lastStep) {
    return NextResponse.json(
      { error: 'No pending step to answer' },
      { status: 400 }
    );
  }

  const trackEntry = getTrackEntry(session.careerTrackId);
  if (!trackEntry) {
    return NextResponse.json(
      { error: `No probes configured for trackId: ${session.careerTrackId}` },
      { status: 500 }
    );
  }

  // Build context strings to store alongside the response for batch extraction
  const caseContent = getCaseContent(session.currentCaseId);
  const probeContent = lastStep.type === 'probe' ? getProbeContent(lastStep.variant?.variantId ?? '') : null;
  const variantId = lastStep.type === 'probe' ? lastStep.variant?.variantId ?? '' : '';
  const exhibit = variantId ? getProbeExhibit(session.currentCaseId, variantId) : null;
  const caseContext = caseContent
    ? `Company: ${caseContent.company}\nRole: ${caseContent.role}\nSituation: ${caseContent.situation}\nTask: ${caseContent.problemStatement}`
    : '';
  const probeQuestion = probeContent?.question ?? '';
  const scoringGuidance = probeContent?.scoringGuidance ?? '';
  const probeFormat = probeContent?.format ?? 'free_text';
  const probeOptions = probeContent?.options;
  const exhibitContext = exhibit ? serializeExhibitForAI(exhibit) : '';

  // Buffer the response — no AI call happens here. Extraction is batched at session completion.
  let updatedSession: DiagnosticSession;
  try {
    updatedSession = await handleDiagnosticStepCompletion(
      session,
      lastStep,
      { rawResponse, selectedOptionId, selectedOptionIds },
      { caseContext, probeQuestion, scoringGuidance, exhibitContext, format: probeFormat, options: probeOptions }
    );
  } catch (err) {
    console.error('Step completion failed, falling back to deterministic mutation:', err);
    updatedSession = applyDiagnosticStepResult(session, lastStep, { rawResponse });
  }

  pendingSteps.delete(sessionId);

  const result = await runDiagnosticSessionStep(updatedSession, trackEntry.probes);

  sessions.set(sessionId, result.session);

  if (result.step.type === 'probe') {
    pendingSteps.set(sessionId, result.step);
  }

  // On completion: run the single batch AI extraction call, apply scores, generate result
  let diagnosticResult = undefined;
  if (result.session.status === DiagnosticStatus.COMPLETE) {
    let finalSession = result.session;
    const pendingResponses = result.session.pendingResponses ?? [];

    if (pendingResponses.length > 0) {
      try {
        const extractions = await batchExtractSignals(pendingResponses);

        // Apply each extraction to skillEvidence and behavioralEvidence
        let skillEvidence = { ...finalSession.skillEvidence };
        let framing = [...finalSession.behavioralEvidence.framing_quality];
        let confidence = [...finalSession.behavioralEvidence.reasoning_confidence];
        let clarity = [...finalSession.behavioralEvidence.communication_clarity];

        for (let i = 0; i < extractions.length; i++) {
          const extraction = extractions[i];
          const pending = pendingResponses[i];
          const probeScore = calculateProbeScore(
            extraction.signal_strength,
            extraction.response_quality,
            pending.contextLevel as Difficulty
          );
          const existing = skillEvidence[pending.skillId] ?? [];
          skillEvidence[pending.skillId] = [
            ...existing,
            { score: probeScore, caseStage: pending.caseStage },
          ];
          framing.push(extraction.behavioral_signals.framing_quality);
          confidence.push(extraction.behavioral_signals.reasoning_confidence);
          clarity.push(extraction.behavioral_signals.communication_clarity);
        }

        finalSession = {
          ...finalSession,
          skillEvidence,
          behavioralEvidence: {
            framing_quality: framing,
            reasoning_confidence: confidence,
            communication_clarity: clarity,
          },
        };
      } catch (err) {
        console.error('Batch extraction failed — returning zero scores:', err);
      }
    }

    diagnosticResult = generateDiagnosticResult(
      finalSession.skillEvidence,
      finalSession.behavioralEvidence,
      trackEntry.engineTrack.skills
    );
  }

  return NextResponse.json({
    sessionId,
    step: serializeStep(result.step, result.session.currentCaseId),
    caseStage: result.session.caseStage,
    currentCaseId: result.session.currentCaseId,
    status: result.session.status,
    ...(diagnosticResult !== undefined && { result: diagnosticResult }),
  });
}

/**
 * Serializes a DiagnosticStep for the API response.
 * Includes the probe exhibit (if any) so the client can render it alongside the question.
 * caseId is required to look up case-specific exhibits.
 */
function serializeStep(step: DiagnosticStep, caseId: string) {
  if (step.type === 'probe') {
    const exhibit = getProbeExhibit(caseId, step.variant.variantId);
    const probeContent = getProbeContent(step.variant.variantId);
    return {
      type: 'probe',
      probeId: step.probe.probeId,
      skillId: step.probe.skillId,
      probeType: step.probe.probeType,
      variantId: step.variant.variantId,
      contextLevel: step.variant.contextLevel,
      format: probeContent?.format ?? 'free_text',
      options: probeContent?.options ?? null,
      exhibit,
    };
  }

  if (step.type === 'skip') {
    return {
      type: 'skip',
      slotId: step.slot.slotId,
    };
  }

  return { type: 'complete' };
}
