/**
 * Skill selection logic for the diagnostic engine.
 *
 * Determines which skill should be probed next based on how many probes
 * have already been completed for each skill in the active session.
 *
 * Evidence sufficiency is read from session.skillEvidence — the single source
 * of truth for completed probe scores. The legacy session.observedSignals field
 * is not used for selection.
 *
 * This function does NOT:
 * - Interpret correctness or quality of answers
 * - Calculate scores or readiness
 * - Select specific questions or probes
 * - Make career-specific assumptions
 */

import { DiagnosticSession, SkillId } from './diagnosticSession';

/**
 * Per-skill configuration consumed by the engine for selection and scoring.
 */
export interface SkillConfig {
  /**
   * Unique identifier for the skill.
   */
  skillId: SkillId;

  /**
   * Minimum number of probe completions required before this skill is
   * considered sufficiently evidenced for adaptive selection purposes.
   *
   * For required-slot flows, this controls when the engine stops
   * prioritizing a skill for optional probe slots.
   */
  minProbes: number;

  /**
   * Relative weight for this skill in the track score calculation.
   *
   * Weights are relative, not absolute — they are normalized across
   * the skill set when computing the weighted track score.
   * Higher weight = greater contribution to the overall track score.
   */
  weight: number;
}

/**
 * Career track configuration consumed by the engine.
 * Minimal contract required for skill selection and score weighting.
 */
export interface CareerTrackConfig {
  /**
   * Unique identifier for the track.
   */
  trackId: string;

  /**
   * Human-readable name for the track.
   */
  name: string;

  /**
   * Skills that must be probed for this track.
   * Order determines deterministic probe selection priority.
   */
  skills: SkillConfig[];
}

/**
 * Determines the next skill to probe based on probe completion counts.
 *
 * Returns:
 * - The first skillId that has fewer completed probes than its minProbes threshold
 * - null if all skills meet their minProbes requirement
 *
 * Decision is deterministic: walks the configured skill list in order and
 * returns the first skill that has not yet met its minimum probe count.
 */
export function selectNextProbe(
  session: DiagnosticSession,
  track: CareerTrackConfig
): SkillId | null {
  for (const skill of track.skills) {
    const completedProbes = session.skillEvidence[skill.skillId]?.length ?? 0;
    if (completedProbes < skill.minProbes) {
      return skill.skillId;
    }
  }
  return null;
}
