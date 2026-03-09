/**
 * Session-level step orchestrator with 3-case progressive escalation.
 *
 * This layer sits above DiagnosticFlow and handles case-to-case transitions.
 * DiagnosticFlow only knows about a single case's probe slots.
 * This module manages the session's progression across cases (stages 1–3).
 *
 * Escalation is handled here (not in DiagnosticFlow) because:
 * - DiagnosticFlow is case-scoped and should not know about multi-case sessions.
 * - This function returns an updated session without recursion so the caller
 *   controls the execution loop.
 */

import { DiagnosticSession, DiagnosticStatus } from './diagnosticSession';
import {
  DiagnosticStep,
  DiagnosticCase,
  getNextDiagnosticStep,
} from './DiagnosticFlow';
import { allCases, getRandomCaseForLevel } from '@/config/cases';
import type { Probe, ContextLevel } from '@/config/probes/types';
import type { ProbeSlot } from './selectProbeForSlot';

/**
 * Resolves the next diagnostic step within the current session.
 *
 * If the current case still has slots to process, delegates to DiagnosticFlow.
 * If the current case is complete and more stages remain, escalates to the next case.
 * If all 3 stages are complete, marks the session COMPLETE.
 *
 * Does NOT call itself recursively — the caller should re-invoke after escalation.
 */
export async function runDiagnosticSessionStep(
  session: DiagnosticSession,
  probes: Probe[]
): Promise<{
  session: DiagnosticSession;
  step: DiagnosticStep;
}> {
  const caseMeta = allCases.find(
    (c) => c.caseId === session.currentCaseId
  );
  if (!caseMeta) {
    throw new Error(
      `Case not found for currentCaseId: ${session.currentCaseId}`
    );
  }

  // Build DiagnosticCase from metadata, mapping case level to context level
  const caseDef: DiagnosticCase = {
    caseId: caseMeta.caseId,
    probeSlots: caseMeta.probeSlotIds.map((slotId) =>
      slotIdToProbeSlot(slotId, caseMeta.level)
    ),
  };

  const step = getNextDiagnosticStep(caseDef, session, probes);

  // Current case still has work — return step for caller to execute
  if (step.type !== 'complete') {
    return { session, step };
  }

  // Current case is complete — check if we can escalate
  if (session.caseStage < 3) {
    const nextStage = (session.caseStage + 1) as 1 | 2 | 3;
    const nextCase = getRandomCaseForLevel(session.careerTrackId, nextStage);

    // Return escalated session — caller should re-invoke to get next step
    const escalatedSession: DiagnosticSession = {
      ...session,
      caseStage: nextStage,
      currentCaseId: nextCase.caseId,
      caseHistory: [...session.caseHistory, nextCase.caseId],
      currentSlotIndex: 0,
    };

    const nextCaseMeta = allCases.find(
      (c) => c.caseId === nextCase.caseId
    )!;

    const nextCaseDef: DiagnosticCase = {
      caseId: nextCaseMeta.caseId,
      probeSlots: nextCaseMeta.probeSlotIds.map((slotId) =>
        slotIdToProbeSlot(slotId, nextCaseMeta.level)
      ),
    };

    const nextStep = getNextDiagnosticStep(
      nextCaseDef,
      escalatedSession,
      probes
    );

    return {
      session: escalatedSession,
      step: nextStep,
    };
  }

  // All 3 stages complete — mark session done
  return {
    session: {
      ...session,
      status: DiagnosticStatus.COMPLETE,
    },
    step: { type: 'complete' },
  };
}

/**
 * Maps a probeSlotId string to a ProbeSlot definition.
 *
 * Convention: slot IDs follow the pattern "ps_<skillId>".
 * Context level is derived from the case level: 1→low, 2→medium, 3→high.
 */
function slotIdToProbeSlot(slotId: string, caseLevel: 1 | 2 | 3): ProbeSlot {
  const skillId = slotId.replace(/^ps_/, '');
  const levelMap: Record<1 | 2 | 3, ContextLevel> = {
    1: 'low',
    2: 'medium',
    3: 'high',
  };

  return {
    slotId,
    required: true,
    targetSkill: skillId,
    contextLevel: levelMap[caseLevel],
  };
}
