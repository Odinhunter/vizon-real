/**
 * Handles a completed diagnostic step by applying deterministic session mutation
 * and buffering the probe response for batch AI extraction at session completion.
 *
 * AI extraction no longer happens per-probe. Instead, all responses are collected
 * in session.pendingResponses and sent to the AI in a single batch call once the
 * session reaches COMPLETE. This gives the model full session context and cuts
 * API calls from 15 to 1.
 */

import { DiagnosticSession, PendingResponse } from './diagnosticSession';
import { DiagnosticStep } from './DiagnosticFlow';
import {
  ApplyStepPayload,
  applyDiagnosticStepResult,
} from './applyDiagnosticStepResult';

/**
 * Applies the step result deterministically and appends the probe response
 * to pendingResponses for later batch extraction.
 */
export async function handleDiagnosticStepCompletion(
  session: DiagnosticSession,
  step: DiagnosticStep,
  payload: ApplyStepPayload,
  context: {
    caseContext: string;
    probeQuestion: string;
    scoringGuidance: string;
    exhibitContext: string;
    format: 'free_text' | 'mcq_plus_reasoning' | 'multi_select_plus_reasoning';
    options?: { id: string; text: string }[];
  } = {
    caseContext: '',
    probeQuestion: '',
    scoringGuidance: '',
    exhibitContext: '',
    format: 'free_text',
  }
): Promise<DiagnosticSession> {
  const updatedSession = applyDiagnosticStepResult(session, step, payload);

  if (step.type !== 'probe') {
    return updatedSession;
  }

  const rawResponse =
    typeof payload.rawResponse === 'string'
      ? payload.rawResponse
      : JSON.stringify(payload.rawResponse ?? '');

  const pending: PendingResponse = {
    skillId: step.probe.skillId,
    probeId: step.probe.probeId,
    caseStage: updatedSession.caseStage,
    contextLevel: step.variant.contextLevel,
    caseContext: context.caseContext,
    probeQuestion: context.probeQuestion,
    scoringGuidance: context.scoringGuidance,
    exhibitContext: context.exhibitContext,
    format: context.format,
    options: context.options,
    selectedOptionId: payload.selectedOptionId,
    selectedOptionIds: payload.selectedOptionIds,
    rawResponse,
  };

  return {
    ...updatedSession,
    pendingResponses: [...updatedSession.pendingResponses, pending],
  };
}
