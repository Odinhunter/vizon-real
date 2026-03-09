/**
 * Diagnostic session mutation handler.
 *
 * This module centralizes all session state mutations so that:
 * - mutations are explicit and auditable,
 * - replay and debugging are possible from a clear history,
 * - interpretation and scoring remain deferred to later stages.
 *
 * It ONLY records executed steps and advances slot progression.
 * It does NOT interpret performance, extract signals, or decide next steps.
 */

import { DiagnosticSession } from './diagnosticSession';
import { DiagnosticStep } from './DiagnosticFlow';

export type ProbeHistoryEntry = {
  probeId: string;
  variantId: string;
  slotId: string;
};

export type ResponseEntry = {
  slotId: string;
  probeId: string;
  variantId: string;
  rawResponse?: unknown;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
};

export type ApplyStepPayload = {
  rawResponse?: unknown;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
};

/**
 * Applies the result of a completed diagnostic step to the session.
 *
 * This is the ONLY place where DiagnosticSession state is mutated.
 * It records what happened and advances the session index, but does not
 * interpret the response or determine the next action.
 */
export function applyDiagnosticStepResult(
  session: DiagnosticSession,
  step: DiagnosticStep,
  payload: ApplyStepPayload
): DiagnosticSession {
  const currentSlotIndex =
    typeof (session as { currentSlotIndex?: number }).currentSlotIndex ===
    'number'
      ? (session as { currentSlotIndex?: number }).currentSlotIndex!
      : 0;

  const probeHistory =
    (session as { probeHistory?: ProbeHistoryEntry[] }).probeHistory ?? [];

  const responses =
    (session as { responses?: ResponseEntry[] }).responses ?? [];

  if (step.type === 'probe') {
    const probeHistoryEntry: ProbeHistoryEntry = {
      probeId: step.probe.probeId,
      variantId: step.variant.variantId,
      slotId: step.slot.slotId,
    };

    const responseEntry: ResponseEntry = {
      slotId: step.slot.slotId,
      probeId: step.probe.probeId,
      variantId: step.variant.variantId,
      rawResponse: payload.rawResponse,
      selectedOptionId: payload.selectedOptionId,
      selectedOptionIds: payload.selectedOptionIds,
    };

    return {
      ...session,
      probeHistory: [...probeHistory, probeHistoryEntry],
      responses: [...responses, responseEntry],
      currentSlotIndex: currentSlotIndex + 1,
      currentSkillId: step.probe.skillId,
    };
  }

  if (step.type === 'skip') {
    return {
      ...session,
      currentSlotIndex: currentSlotIndex + 1,
      probeHistory,
      responses,
    };
  }

  // step.type === 'complete' -> no changes
  return {
    ...session,
    probeHistory,
    responses,
    currentSlotIndex,
  };
}
