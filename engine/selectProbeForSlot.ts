/**
 * Probe selection for a single probe slot.
 *
 * This function is separate from the core engine to keep probe registry concerns
 * and slot constraints isolated from diagnostic scoring or interpretation logic.
 *
 * It preserves controlled adaptivity by:
 * - honoring slot intent (target skill + context level),
 * - using engine-selected skill needs,
 * - and deterministically choosing a probe + variant without inference.
 *
 * It does NOT interpret performance, correctness, or readiness.
 * It only selects a probe intent and an allowed variant.
 */

import type { Probe, ContextLevel } from '@/config/probes/types';
import { DiagnosticSession, SkillId } from './diagnosticSession';

export type { ContextLevel };

/**
 * A probe slot defines intent and bounds (not a specific probe).
 */
export interface ProbeSlot {
  /**
   * Unique identifier for this slot within a diagnostic case.
   */
  slotId: string;
  /**
   * Whether this slot must be filled even if it doesn't align with engine needs.
   */
  required: boolean;
  /**
   * The skill this slot is intended to probe.
   */
  targetSkill: SkillId;
  /**
   * The maximum context complexity allowed for this slot.
   */
  contextLevel: ContextLevel;
}

/**
 * A resolved probe selection for a slot.
 */
export interface ProbeSelection {
  probe: Probe;
  variant: Probe['variants'][number];
}

const CONTEXT_ORDER: ContextLevel[] = ['low', 'medium', 'high'];

/**
 * Selects a probe + variant to fill a probe slot.
 *
 * Returns null when an optional slot does not align with the engine's next skill.
 * Required slots must resolve unless the probe registry is malformed.
 */
export function selectProbeForSlot(
  slot: ProbeSlot,
  session: DiagnosticSession,
  probes: Probe[],
  engineNextSkill: SkillId | null
): ProbeSelection | null {
  // Rule 1 — Slot–Skill Alignment
  if (!slot.required && slot.targetSkill !== engineNextSkill) {
    return null;
  }

  // Rule 2 — Probe Selection (one probe per skill in v1)
  const probe = probes.find(p => p.skillId === slot.targetSkill);
  if (!probe) {
    if (slot.required) {
      throw new Error(
        `Probe registry missing probe for required skill: ${slot.targetSkill}`
      );
    }
    return null;
  }

  // Rule 3 — Variant Selection (prefer exact context level, fall back to lower)
  const level = selectAllowedContextLevel(probe, slot.contextLevel);
  if (!level) {
    if (slot.required) {
      throw new Error(
        `No probe variant available at or below context level: ${slot.contextLevel}`
      );
    }
    return null;
  }

  const candidates = probe.variants.filter(v => v.contextLevel === level);

  // Rule 4 — Avoid Duplicate Variant Reuse when possible
  const usedVariantIds = getUsedVariantIds(session, probe.probeId);
  const unused = candidates.find(v => !usedVariantIds.has(v.variantId));
  const variant = unused ?? candidates[0];

  // Rule 5 — Required slots must resolve (handled above via errors)
  return { probe, variant };
}

/**
 * Select the most specific allowed context level for this slot.
 * Never escalates beyond the slot's contextLevel.
 */
function selectAllowedContextLevel(
  probe: Probe,
  slotLevel: ContextLevel
): ContextLevel | null {
  const slotIndex = CONTEXT_ORDER.indexOf(slotLevel);
  if (slotIndex < 0) return null;

  const available = new Set(probe.variants.map(v => v.contextLevel));

  // Prefer exact match
  if (available.has(slotLevel)) {
    return slotLevel;
  }

  // Fall back to nearest lower level
  for (let i = slotIndex - 1; i >= 0; i -= 1) {
    const lower = CONTEXT_ORDER[i];
    if (available.has(lower)) {
      return lower;
    }
  }

  return null;
}

/**
 * Returns the set of probe variant IDs already used in this session for a given probe.
 *
 * The session may carry probe history via a separate layer. If not present,
 * we assume no variants have been used yet.
 */
function getUsedVariantIds(
  session: DiagnosticSession,
  probeId: string
): Set<string> {
  type ProbeUse = { probeId: string; variantId: string };
  const history = (session as { probeHistory?: ProbeUse[] }).probeHistory ?? [];

  return new Set(
    history.filter(h => h.probeId === probeId).map(h => h.variantId)
  );
}
