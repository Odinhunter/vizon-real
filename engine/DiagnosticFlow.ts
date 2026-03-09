/**
 * DiagnosticFlow orchestrator.
 *
 * This module coordinates the execution of a diagnostic case by:
 * - iterating through probe slots,
 * - consulting the engine for skill needs,
 * - resolving probes and variants,
 * - and returning the next actionable diagnostic step.
 *
 * Orchestration is kept separate from probe selection so that:
 * - slot sequencing remains explicit and auditable,
 * - probe selection logic stays reusable across contexts,
 * - and scoring/interpretation never leaks into control flow.
 *
 * This module does NOT:
 * - interpret correctness or performance,
 * - mutate session state,
 * - select specific prompts or UI content.
 */

import { engineTracksById } from '@/config/engineTracks';
import type { Probe } from '@/config/probes/types';
import { DiagnosticSession, SkillId } from './diagnosticSession';
import {
  ProbeSlot,
  ProbeSelection,
  selectProbeForSlot,
} from './selectProbeForSlot';
import { selectNextProbe } from './selectNextProbe';

/**
 * A diagnostic case defines the ordered probe slots to execute.
 */
export type DiagnosticCase = {
  caseId: string;
  probeSlots: ProbeSlot[];
};

/**
 * The next action the diagnostic runner should take.
 */
export type DiagnosticStep =
  | {
      type: 'probe';
      slot: ProbeSlot;
      probe: Probe;
      variant: Probe['variants'][number];
    }
  | {
      type: 'skip';
      slot: ProbeSlot;
    }
  | {
      type: 'complete';
    };

/**
 * Determines the next diagnostic step for a case.
 */
export function getNextDiagnosticStep(
  caseDef: DiagnosticCase,
  session: DiagnosticSession,
  probes: Probe[]
): DiagnosticStep {
  const slotIndex = getCurrentSlotIndex(session);

  // No slots remaining
  if (slotIndex >= caseDef.probeSlots.length) {
    return { type: 'complete' };
  }

  const slot = caseDef.probeSlots[slotIndex];

  // Resolve track configuration dynamically
  const trackConfig =
    engineTracksById[
      session.careerTrackId as keyof typeof engineTracksById
    ];

  if (!trackConfig) {
    throw new Error(
      `No engine track config found for ${session.careerTrackId}`
    );
  }

  // Consult engine for the next skill that needs evidence
  const engineNextSkill: SkillId | null = selectNextProbe(
    session,
    trackConfig
  );

  // Attempt to resolve this slot to a probe + variant
  const resolved: ProbeSelection | null = selectProbeForSlot(
    slot,
    session,
    probes,
    engineNextSkill
  );

  if (resolved) {
    return {
      type: 'probe',
      slot,
      probe: resolved.probe,
      variant: resolved.variant,
    };
  }

  return { type: 'skip', slot };
}

/**
 * Reads the current slot index from session state.
 */
function getCurrentSlotIndex(session: DiagnosticSession): number {
  const { currentSlotIndex } = session as { currentSlotIndex?: number };
  return typeof currentSlotIndex === 'number' ? currentSlotIndex : 0;
}
