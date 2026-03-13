/**
 * Diagnostic API route.
 *
 * Session state is persisted to the database (DiagnosticRun.sessionStateJson)
 * so sessions survive server restarts.
 * Individual probe responses are stored in the ProbeResponse table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { DiagnosticSession } from '@/engine/diagnosticSession';
import { initializeDiagnosticSession } from '@/engine/initializeSession';
import { runDiagnosticSessionStep } from '@/engine/runDiagnosticSessionStep';
import { handleDiagnosticStepCompletion } from '@/engine/handleDiagnosticStepCompletion';
import { getRandomCaseForLevel } from '@/config/cases';
import { getTrackEntry, supportedTrackIds } from '@/config/registry';
import { getCaseContent, getProbeContent, getProbeExhibit, serializeExhibitForAI } from '@/content/index';
import { DiagnosticStep } from '@/engine/DiagnosticFlow';
import { applyDiagnosticStepResult } from '@/engine/applyDiagnosticStepResult';
import { calculateProbeScore, type Difficulty } from '@/engine/scoring';
import { analyzeResults } from '@/engine/analyzeResults';
import { DiagnosticStatus } from '@/engine/diagnosticSession';
import { batchExtractSignals } from '@/lib/ai/batchExtractSignals';
import { generatePersonalizedFeedback } from '@/lib/ai/generatePersonalizedFeedback';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'start') {
      return handleStart(body, session.user.id);
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

async function handleStart(body: { trackId?: string }, userId: string) {
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
  const diagSession = initializeDiagnosticSession(trackId, initialCase.caseId);

  // Get the first step
  const result = await runDiagnosticSessionStep(diagSession, trackEntry.probes);

  // Persist full session state + pending step to DB
  await prisma.diagnosticRun.create({
    data: {
      userId,
      trackId,
      sessionId: result.session.sessionId,
      status: 'IN_PROGRESS',
      sessionStateJson: JSON.stringify(result.session),
      pendingStepJson: result.step.type === 'probe' ? JSON.stringify(result.step) : null,
    },
  });

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

  // Load session state from DB
  const run = await prisma.diagnosticRun.findUnique({
    where: { sessionId },
    include: { _count: { select: { responses: true } } },
  });

  if (!run || !run.sessionStateJson) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (!run.pendingStepJson) {
    return NextResponse.json(
      { error: 'No pending step to answer' },
      { status: 400 }
    );
  }

  const diagSession: DiagnosticSession = JSON.parse(run.sessionStateJson);
  const lastStep: DiagnosticStep = JSON.parse(run.pendingStepJson);

  const trackEntry = getTrackEntry(diagSession.careerTrackId);
  if (!trackEntry) {
    return NextResponse.json(
      { error: `No probes configured for trackId: ${diagSession.careerTrackId}` },
      { status: 500 }
    );
  }

  // Build context strings to store alongside the response for batch extraction
  const caseContent = getCaseContent(diagSession.currentCaseId);
  const probeContent = lastStep.type === 'probe' ? getProbeContent(lastStep.variant?.variantId ?? '') : null;
  const variantId = lastStep.type === 'probe' ? lastStep.variant?.variantId ?? '' : '';
  const exhibit = variantId ? getProbeExhibit(diagSession.currentCaseId, variantId) : null;
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
      diagSession,
      lastStep,
      { rawResponse, selectedOptionId, selectedOptionIds },
      { caseContext, probeQuestion, scoringGuidance, exhibitContext, format: probeFormat, options: probeOptions }
    );
  } catch (err) {
    console.error('Step completion failed, falling back to deterministic mutation:', err);
    updatedSession = applyDiagnosticStepResult(diagSession, lastStep, { rawResponse });
  }

  const result = await runDiagnosticSessionStep(updatedSession, trackEntry.probes);

  // Persist individual probe response to DB
  if (lastStep.type === 'probe') {
    const responseText = typeof rawResponse === 'string'
      ? rawResponse
      : rawResponse != null ? JSON.stringify(rawResponse) : null;

    await prisma.probeResponse.create({
      data: {
        diagnosticRunId: run.id,
        probeId: lastStep.probe.probeId,
        skillId: lastStep.probe.skillId,
        variantId: lastStep.variant.variantId,
        sequenceNumber: run._count.responses + 1,
        caseId: diagSession.currentCaseId,
        caseStage: diagSession.caseStage,
        contextLevel: lastStep.variant.contextLevel,
        format: probeFormat,
        rawResponse: responseText,
        selectedOptionId: selectedOptionId ?? null,
        selectedOptionIds: selectedOptionIds ? JSON.stringify(selectedOptionIds) : null,
      },
    });
  }

  // Update session state + pending step in DB
  await prisma.diagnosticRun.update({
    where: { sessionId },
    data: {
      sessionStateJson: JSON.stringify(result.session),
      pendingStepJson: result.step.type === 'probe' ? JSON.stringify(result.step) : null,
    },
  });

  // On completion: run the single batch AI extraction call, apply scores, generate result
  let diagnosticResult = undefined;
  if (result.session.status === DiagnosticStatus.COMPLETE) {
    let finalSession = result.session;
    const pendingResponses = result.session.pendingResponses ?? [];

    let extractions: Awaited<ReturnType<typeof batchExtractSignals>> | null = null;

    if (pendingResponses.length > 0) {
      try {
        extractions = await batchExtractSignals(pendingResponses);

        // Apply each extraction to skillEvidence and behavioralEvidence
        let skillEvidence = { ...finalSession.skillEvidence };
        let framing = [...finalSession.behavioralEvidence.framing_quality];
        let confidence = [...finalSession.behavioralEvidence.reasoning_confidence];
        let clarity = [...finalSession.behavioralEvidence.communication_clarity];

        // Collect extraction data to update ProbeResponse records
        const extractionUpdates: {
          sequenceNumber: number;
          signalStrength: number;
          responseQuality: number;
          framingQuality: number;
          reasoningConfidence: number;
          communicationClarity: number;
          probeScore: number;
        }[] = [];

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

          extractionUpdates.push({
            sequenceNumber: i + 1,
            signalStrength: extraction.signal_strength,
            responseQuality: extraction.response_quality,
            framingQuality: extraction.behavioral_signals.framing_quality,
            reasoningConfidence: extraction.behavioral_signals.reasoning_confidence,
            communicationClarity: extraction.behavioral_signals.communication_clarity,
            probeScore,
          });
        }

        // Backfill AI extraction results onto ProbeResponse records
        await Promise.all(
          extractionUpdates.map((update) =>
            prisma.probeResponse.updateMany({
              where: {
                diagnosticRunId: run.id,
                sequenceNumber: update.sequenceNumber,
              },
              data: {
                signalStrength: update.signalStrength,
                responseQuality: update.responseQuality,
                framingQuality: update.framingQuality,
                reasoningConfidence: update.reasoningConfidence,
                communicationClarity: update.communicationClarity,
                probeScore: update.probeScore,
              },
            })
          )
        );

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
        console.error('Batch extraction failed:', err);
        throw new Error(
          `AI analysis failed: ${err instanceof Error ? err.message : 'unknown error'} — please retry`
        );
      }
    }

    diagnosticResult = analyzeResults(
      finalSession.skillEvidence,
      finalSession.behavioralEvidence,
      trackEntry.engineTrack.skills,
      trackEntry.engineTrack.name,
      pendingResponses.length
    );

    // Generate personalized feedback using AI (second call)
    if (extractions && pendingResponses.length > 0) {
      try {
        const personalized = await generatePersonalizedFeedback(
          diagnosticResult.skills,
          pendingResponses,
          extractions,
          diagnosticResult.trackScore,
          diagnosticResult.benchmark,
          diagnosticResult.archetype.name,
          diagnosticResult.archetype.topTraits
        );

        if (personalized) {
          // Patch skill narratives + archetype feedback
          diagnosticResult = {
            ...diagnosticResult,
            skills: diagnosticResult.skills.map((skill) => ({
              ...skill,
              narrative: personalized.skillNarratives[skill.skillId] ?? skill.narrative,
            })),
            recommendations: personalized.recommendations.length > 0
              ? personalized.recommendations
              : diagnosticResult.recommendations,
            archetype: {
              ...diagnosticResult.archetype,
              feedback: personalized.archetypeFeedback || undefined,
            },
          };
        }
      } catch (err) {
        console.error('Personalized feedback generation failed, using templates:', err);
      }
    }

    // Persist completed run to DB with denormalized fields
    await prisma.diagnosticRun.update({
      where: { sessionId },
      data: {
        status: 'COMPLETE',
        resultJson: JSON.stringify(diagnosticResult),
        trackScore: diagnosticResult.trackScore,
        verdict: diagnosticResult.verdict,
        sessionStateJson: JSON.stringify(finalSession),
        pendingStepJson: null,
        completedAt: new Date(),
      },
    });
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
