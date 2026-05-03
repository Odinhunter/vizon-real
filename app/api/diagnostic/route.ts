/**
 * Diagnostic API route.
 *
 * Session state is persisted to the database (DiagnosticRun.sessionStateJson)
 * so sessions survive server restarts.
 * Individual probe responses are stored in the ProbeResponse table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { applyRateLimit, diagnosticStartLimiter, diagnosticAnswerLimiter, diagnosticCheckLimiter } from '@/lib/rateLimit';
import { DiagnosticSession } from '@/engine/diagnosticSession';
import { initializeDiagnosticSession } from '@/engine/initializeSession';
import { runDiagnosticSessionStep } from '@/engine/runDiagnosticSessionStep';
import { handleDiagnosticStepCompletion } from '@/engine/handleDiagnosticStepCompletion';
import { allCases, getRandomCaseForLevel } from '@/config/cases';
import { getTrackEntry, supportedTrackIds } from '@/config/registry';
import { getCaseContent, getProbeContent, getProbeExhibit, serializeExhibitForAI } from '@/content/index';
import { DiagnosticStep } from '@/engine/DiagnosticFlow';
import { applyDiagnosticStepResult } from '@/engine/applyDiagnosticStepResult';
import { calculateProbeScore, type Difficulty } from '@/engine/scoring';
import { analyzeResults } from '@/engine/analyzeResults';
import { DiagnosticStatus } from '@/engine/diagnosticSession';
import { batchExtractSignals } from '@/lib/ai/batchExtractSignals';
import { generatePersonalizedFeedback } from '@/lib/ai/generatePersonalizedFeedback';

// ── Session state validation ──────────────────────────────────────────────────

/**
 * Guards the parsed sessionStateJson blob before any field access.
 * Only checks fields that are actually dereferenced in this file — not a full deep validation.
 */
function isValidSessionState(obj: unknown): obj is DiagnosticSession {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.sessionId === 'string' && s.sessionId.length > 0 &&
    typeof s.careerTrackId === 'string' && s.careerTrackId.length > 0 &&
    typeof s.currentCaseId === 'string' && s.currentCaseId.length > 0 &&
    (s.caseStage === 1 || s.caseStage === 2 || s.caseStage === 3) &&
    typeof s.status === 'string' &&
    Array.isArray(s.pendingResponses) &&
    typeof s.skillEvidence === 'object' && s.skillEvidence !== null && !Array.isArray(s.skillEvidence) &&
    typeof s.behavioralEvidence === 'object' && s.behavioralEvidence !== null &&
    Array.isArray((s.behavioralEvidence as Record<string, unknown>).framing_quality) &&
    Array.isArray((s.behavioralEvidence as Record<string, unknown>).reasoning_confidence) &&
    Array.isArray((s.behavioralEvidence as Record<string, unknown>).communication_clarity)
  );
}

/**
 * Guards the parsed pendingStepJson blob before field access.
 * For probe steps, ensures probe and variant sub-objects are present.
 */
function isValidPendingStep(obj: unknown): obj is DiagnosticStep {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const s = obj as Record<string, unknown>;
  if (typeof s.type !== 'string') return false;
  if (s.type === 'probe') {
    return (
      typeof s.probe === 'object' && s.probe !== null &&
      typeof s.variant === 'object' && s.variant !== null
    );
  }
  return s.type === 'skip' || s.type === 'complete';
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blocked = applyRateLimit(diagnosticCheckLimiter, session.user.id);
  if (blocked) return blocked;

  const { searchParams } = new URL(req.url);

  // Feedback polling: GET /api/diagnostic?sessionId=<id>
  const sessionId = searchParams.get('sessionId');
  if (sessionId) {
    const run = await prisma.diagnosticRun.findUnique({ where: { sessionId } });
    if (!run || run.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (run.status !== 'COMPLETE' || !run.resultJson) {
      return NextResponse.json({ personalizedFeedbackReady: false });
    }
    let result;
    try {
      result = JSON.parse(run.resultJson);
    } catch {
      return NextResponse.json({ personalizedFeedbackReady: false });
    }
    const ready = Array.isArray(result?.answerFeedback) && result.answerFeedback.length > 0;
    return NextResponse.json({ personalizedFeedbackReady: ready, result: ready ? result : undefined });
  }

  // In-progress session check: GET /api/diagnostic?trackId=<id>
  const trackId = searchParams.get('trackId');
  if (!trackId) {
    return NextResponse.json({ error: 'Missing trackId or sessionId' }, { status: 400 });
  }

  const run = await prisma.diagnosticRun.findFirst({
    where: { userId: session.user.id, trackId, status: 'IN_PROGRESS' },
    orderBy: { startedAt: 'desc' },
  });

  if (!run || !run.sessionStateJson || !run.pendingStepJson) {
    return NextResponse.json({ inProgressSession: null });
  }

  let diagSession: DiagnosticSession;
  try {
    const parsed = JSON.parse(run.sessionStateJson);
    if (!isValidSessionState(parsed)) {
      return NextResponse.json({ inProgressSession: null });
    }
    diagSession = parsed;
  } catch {
    return NextResponse.json({ inProgressSession: null });
  }

  const probeNumber = (diagSession.currentSlotIndex ?? 0) + 1;

  return NextResponse.json({
    inProgressSession: {
      sessionId: run.sessionId,
      trackId: run.trackId,
      caseStage: diagSession.caseStage as 1 | 2 | 3,
      probeNumber,
      startedAt: run.startedAt.toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Rate limit by user ID, per action type
    const limiterKey = session.user.id;
    if (action === 'start') {
      const blocked = applyRateLimit(diagnosticStartLimiter, limiterKey);
      if (blocked) return blocked;
      return handleStart(body, session.user.id);
    }

    if (action === 'answer') {
      const blocked = applyRateLimit(diagnosticAnswerLimiter, limiterKey);
      if (blocked) return blocked;
      return handleAnswer(body, session.user.id);
    }

    if (action === 'resume') {
      const blocked = applyRateLimit(diagnosticCheckLimiter, limiterKey);
      if (blocked) return blocked;
      return handleResume(body, session.user.id);
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Diagnostic API error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
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

  // Abandon any pre-existing in-progress sessions for this user+track
  await prisma.diagnosticRun.updateMany({
    where: { userId, trackId, status: 'IN_PROGRESS' },
    data: { status: 'ABANDONED', pendingStepJson: null },
  });

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
    isLastProbe: computeIsLastProbe(result),
  });
}

async function handleAnswer(body: {
  sessionId?: string;
  rawResponse?: unknown;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
}, userId: string) {
  const { sessionId, selectedOptionId, selectedOptionIds } = body;
  let { rawResponse } = body;

  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  // Input validation: cap rawResponse size to prevent DB/memory abuse
  if (typeof rawResponse === 'string' && rawResponse.length > 10_000) {
    rawResponse = rawResponse.slice(0, 10_000);
  } else if (rawResponse != null && typeof rawResponse !== 'string') {
    const serialized = JSON.stringify(rawResponse);
    if (serialized.length > 10_000) {
      return NextResponse.json({ error: 'Response too large' }, { status: 400 });
    }
  }

  // Validate option IDs
  if (selectedOptionId != null && (typeof selectedOptionId !== 'string' || selectedOptionId.length > 20)) {
    return NextResponse.json({ error: 'Invalid option selection' }, { status: 400 });
  }
  if (selectedOptionIds != null) {
    if (!Array.isArray(selectedOptionIds) || selectedOptionIds.length > 10 ||
        selectedOptionIds.some((id: unknown) => typeof id !== 'string' || (id as string).length > 20)) {
      return NextResponse.json({ error: 'Invalid option selections' }, { status: 400 });
    }
  }

  // Load session state from DB. version is used below as the optimistic-lock guard.
  const run = await prisma.diagnosticRun.findUnique({
    where: { sessionId },
  });

  if (!run || !run.sessionStateJson) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Ownership check — prevent users from submitting to other users' sessions
  if (run.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (run.status !== 'IN_PROGRESS') {
    return NextResponse.json({ error: 'Session is not in progress' }, { status: 400 });
  }

  if (!run.pendingStepJson) {
    return NextResponse.json(
      { error: 'No pending step to answer' },
      { status: 400 }
    );
  }

  let diagSession: DiagnosticSession;
  let lastStep: DiagnosticStep;
  try {
    const parsedSession = JSON.parse(run.sessionStateJson);
    const parsedStep = JSON.parse(run.pendingStepJson);
    if (!isValidSessionState(parsedSession) || !isValidPendingStep(parsedStep)) {
      console.error('Corrupted session state for session:', sessionId);
      return NextResponse.json({ error: 'Corrupted session state' }, { status: 400 });
    }
    diagSession = parsedSession;
    lastStep = parsedStep;
  } catch {
    console.error('Corrupted session state for session:', sessionId);
    return NextResponse.json({ error: 'Corrupted session state' }, { status: 400 });
  }

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

  // Persist probe response + session state in a single transaction guarded by an optimistic lock.
  // Two concurrent answer submissions for the same session would otherwise read identical state,
  // both compute their own next state, and the second write would silently clobber the first.
  // The WHERE { sessionId, version: run.version } update matches zero rows on the loser, throwing P2025.
  const responseText = lastStep.type === 'probe'
    ? (typeof rawResponse === 'string'
      ? rawResponse
      : rawResponse != null ? JSON.stringify(rawResponse) : null)
    : null;

  try {
    await prisma.$transaction(async (tx) => {
      if (lastStep.type === 'probe') {
        const currentResponseCount = await tx.probeResponse.count({
          where: { diagnosticRunId: run.id },
        });

        await tx.probeResponse.create({
          data: {
            diagnosticRunId: run.id,
            probeId: lastStep.probe.probeId,
            skillId: lastStep.probe.skillId,
            variantId: lastStep.variant.variantId,
            sequenceNumber: currentResponseCount + 1,
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

      await tx.diagnosticRun.update({
        where: { sessionId, version: run.version },
        data: {
          sessionStateJson: JSON.stringify(result.session),
          pendingStepJson: result.step.type === 'probe' ? JSON.stringify(result.step) : null,
          version: { increment: 1 },
        },
      });
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: update WHERE matched no row → version moved → another writer won the race.
      // P2002: unique(diagnosticRunId, sequenceNumber) violated → another writer claimed our slot.
      if (err.code === 'P2025' || err.code === 'P2002') {
        return NextResponse.json(
          { error: 'Session was modified by another request. Please retry.' },
          { status: 409 }
        );
      }
    }
    throw err;
  }

  // ── Phase 1: batch extraction + scoring (synchronous — required for scores) ──
  let diagnosticResult = undefined;
  if (result.session.status === DiagnosticStatus.COMPLETE) {
    let finalSession = result.session;
    const pendingResponses = result.session.pendingResponses ?? [];

    let extractions: Awaited<ReturnType<typeof batchExtractSignals>> | null = null;

    if (pendingResponses.length > 0) {
      try {
        extractions = await batchExtractSignals(pendingResponses, diagSession.careerTrackId);

        let skillEvidence = { ...finalSession.skillEvidence };
        let framing = [...finalSession.behavioralEvidence.framing_quality];
        let confidence = [...finalSession.behavioralEvidence.reasoning_confidence];
        let clarity = [...finalSession.behavioralEvidence.communication_clarity];

        const extractionByIndex = new Map(extractions.map(e => [e.probe_index, e]));

        const extractionUpdates: {
          sequenceNumber: number;
          signalStrength: number;
          responseQuality: number;
          framingQuality: number;
          reasoningConfidence: number;
          communicationClarity: number;
          probeScore: number;
        }[] = [];

        for (let i = 0; i < pendingResponses.length; i++) {
          const extraction = extractionByIndex.get(i + 1);
          if (!extraction) {
            console.warn(`[batch-extraction] No result for probe_index ${i + 1} — skipping`);
            continue;
          }
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
              where: { diagnosticRunId: run.id, sequenceNumber: update.sequenceNumber },
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
        throw new Error('Unable to complete analysis. Please try again later.');
      }
    }

    diagnosticResult = analyzeResults(
      finalSession.skillEvidence,
      finalSession.behavioralEvidence,
      trackEntry.engineTrack.skills,
      trackEntry.engineTrack.name,
      pendingResponses.length,
      diagSession.careerTrackId
    );

    // Persist base result immediately — client can render scores without waiting for phase 2
    await prisma.diagnosticRun.update({
      where: { sessionId },
      data: {
        status: 'COMPLETE',
        resultJson: JSON.stringify(diagnosticResult),
        trackScore: diagnosticResult.trackScore,
        verdict: diagnosticResult.verdict,
        sessionStateJson: null,
        pendingStepJson: null,
        completedAt: new Date(),
      },
    });

    // ── Phase 2: personalized feedback (fires after response is sent) ──────────
    // after() runs once the HTTP response is flushed. The client receives the
    // base scored result immediately and polls GET /api/diagnostic?sessionId=
    // to hydrate narratives, recommendations, archetype paragraph, per-answer
    // feedback, and case summaries when they are ready (~10-15s later).
    if (extractions && pendingResponses.length > 0) {
      const capturedResult = diagnosticResult;
      const capturedExtractions = extractions;
      const capturedPending = pendingResponses;
      const capturedTrackId = diagSession.careerTrackId;
      const capturedSessionId = sessionId;

      after(async () => {
        try {
          const personalized = await generatePersonalizedFeedback(
            capturedResult.skills,
            capturedPending,
            capturedExtractions,
            capturedResult.trackScore,
            capturedResult.benchmark,
            capturedResult.archetype.name,
            capturedResult.archetype.topTraits,
            capturedTrackId
          );

          if (!personalized) return;

          const enrichedResult = {
            ...capturedResult,
            skills: capturedResult.skills.map((skill) => ({
              ...skill,
              narrative: personalized.skillNarratives[skill.skillId] ?? skill.narrative,
            })),
            recommendations: personalized.recommendations.length > 0
              ? personalized.recommendations
              : capturedResult.recommendations,
            archetype: {
              ...capturedResult.archetype,
              feedback: personalized.archetypeFeedback || undefined,
            },
            answerFeedback: personalized.answerFeedback,
            caseSummaries: personalized.caseSummaries,
          };

          await prisma.diagnosticRun.update({
            where: { sessionId: capturedSessionId },
            data: { resultJson: JSON.stringify(enrichedResult) },
          });
        } catch (err) {
          console.error('[phase-2] Personalized feedback failed — base result remains:', err);
        }
      });
    }
  }

  return NextResponse.json({
    sessionId,
    step: serializeStep(result.step, result.session.currentCaseId),
    caseStage: result.session.caseStage,
    currentCaseId: result.session.currentCaseId,
    status: result.session.status,
    isLastProbe: computeIsLastProbe(result),
    ...(diagnosticResult !== undefined && { result: diagnosticResult }),
  });
}

async function handleResume(body: { sessionId?: string }, userId: string) {
  const { sessionId } = body;
  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const run = await prisma.diagnosticRun.findUnique({ where: { sessionId } });

  if (!run || !run.sessionStateJson || !run.pendingStepJson) {
    return NextResponse.json({ error: 'Session not found or has no pending step' }, { status: 404 });
  }

  if (run.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (run.status !== 'IN_PROGRESS') {
    return NextResponse.json({ error: 'Session is not in progress' }, { status: 400 });
  }

  let diagSession: DiagnosticSession;
  let pendingStep: DiagnosticStep;
  try {
    const parsedSession = JSON.parse(run.sessionStateJson);
    const parsedStep = JSON.parse(run.pendingStepJson);
    if (!isValidSessionState(parsedSession) || !isValidPendingStep(parsedStep)) {
      return NextResponse.json({ error: 'Corrupted session state' }, { status: 400 });
    }
    diagSession = parsedSession;
    pendingStep = parsedStep;
  } catch {
    return NextResponse.json({ error: 'Corrupted session state' }, { status: 400 });
  }

  const probeNumber = (diagSession.currentSlotIndex ?? 0) + 1;
  const stepResult = { session: diagSession, step: pendingStep };

  return NextResponse.json({
    sessionId: run.sessionId,
    trackId: run.trackId,
    step: serializeStep(pendingStep, diagSession.currentCaseId),
    caseStage: diagSession.caseStage as 1 | 2 | 3,
    currentCaseId: diagSession.currentCaseId,
    probeNumber,
    isLastProbe: computeIsLastProbe(stepResult),
  });
}

/**
 * Returns true when the step being returned is the very last probe of the session
 * (slot N of N in case stage 3). The client uses this to show the analysis loading
 * screen while the final submission is in-flight, without needing to count probes itself.
 */
function computeIsLastProbe(result: { session: DiagnosticSession; step: { type: string } }): boolean {
  if (result.step.type !== 'probe' || result.session.caseStage !== 3) return false;
  const caseMeta = allCases.find(c => c.caseId === result.session.currentCaseId);
  if (!caseMeta) return false;
  const slotIndex = result.session.currentSlotIndex ?? 0;
  return slotIndex === caseMeta.probeSlotIds.length - 1;
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
