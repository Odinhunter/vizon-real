/**
 * Deterministic scoring engine for the diagnostic pipeline.
 *
 * All functions here are pure: no I/O, no randomness, no AI calls.
 * AI extraction supplies raw signal measurements; this module converts
 * them into scores through explicit, auditable arithmetic.
 *
 * Scoring pipeline:
 *   probe response
 *   → AI extraction (signal_strength, response_quality, behavioral_signals)
 *   → calculateProbeScore()       → probe_score ∈ [0, 1]
 *   → aggregateSkillScores()      → skill_score ∈ [0, 100] per skill (trajectory-weighted)
 *   → calculateTrackScore()       → track_score ∈ [0, 100] (skill-weighted)
 *   → aggregateBehavioralSignals() → behavioral dimensions, always isolated from scores
 *
 * Core invariants:
 * - AI never assigns scores. AI only measures signal_strength and response_quality.
 * - Behavioral signals never influence probe, skill, or track scores.
 * - Difficulty rewards higher-context performance without compounding input uncertainty.
 * - Later case stages carry more weight: L3 evidence outweighs L1 in skill aggregation.
 * - All intermediate values are clamped to valid ranges before conversion.
 */

import type { ContextLevel } from '@/config/probes/types';
import type { SkillConfig } from './selectNextProbe';
import type { SkillProbeEntry } from './diagnosticSession';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Difficulty of the probe as presented to the candidate.
 * Maps directly from the variant's contextLevel.
 */
export type Difficulty = ContextLevel;

/**
 * Accumulated behavioral observations across all probe responses in a session.
 * Aggregated separately and never used in skill or track scoring.
 */
export interface BehavioralEvidence {
  framing_quality: number[];
  reasoning_confidence: number[];
  communication_clarity: number[];
}

/**
 * Final result produced once a session reaches COMPLETE status.
 */
export interface DiagnosticResult {
  /** Overall track readiness score, 0–100. Skill-weighted. */
  trackScore: number;
  /** Per-skill scores, 0–100 each. Stage-weighted across the 3 case levels. */
  skillScores: Record<string, number>;
  /** Behavioral dimension scores, 0–100 each. Isolated from skill/track scores. */
  behavioralScores: {
    framing: number;
    confidence: number;
    clarity: number;
  };
  /** How many of the expected skills were actually assessed. */
  coverage: {
    total: number;     // expected skill count for the track
    assessed: number;  // skills with at least one completed probe
  };
}

// ─── Formula constants ────────────────────────────────────────────────────────

/**
 * Signal weight in the probe score base formula.
 * signal_strength is the primary observable — does the target skill show up?
 */
const SIGNAL_WEIGHT = 0.65;

/**
 * Response quality weight in the probe score base formula.
 * response_quality modulates the signal — how clearly was it expressed?
 */
const QUALITY_WEIGHT = 0.35;

/**
 * Additive bonus per difficulty tier, applied after the weighted base score.
 *
 * Using an additive bonus (not a multiplier) keeps the formula linear and
 * avoids compounding two sub-1 AI estimates. The bonus is small enough that
 * it only matters at the margins — a mediocre response stays mediocre.
 *
 * Maximum possible probe_score = 1.0 base + 0.10 bonus = 1.10 → clamped to 1.0.
 * In practice this only clips truly perfect high-difficulty responses.
 */
const DIFFICULTY_BONUS: Record<Difficulty, number> = {
  low: 0.00,
  medium: 0.05,
  high: 0.10,
} as const;

/**
 * Stage weights for trajectory-aware skill aggregation.
 *
 * L3 (pressure scenario) carries twice the weight of L1 (baseline).
 * This rewards consistent performance under increasing ambiguity and
 * penalizes candidates who degrade as difficulty escalates.
 */
const STAGE_WEIGHTS: Record<1 | 2 | 3, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
} as const;

// ─── Probe scoring ────────────────────────────────────────────────────────────

/**
 * Computes a single probe score from AI-extracted measurements.
 *
 * Formula:
 *   base  = 0.65 × signal_strength + 0.35 × response_quality
 *   curved = base^1.3 (power curve that compresses middling scores downward)
 *   score = clamp(curved + difficulty_bonus, 0, 1)
 *
 * The power curve (exponent 1.3) makes scoring tougher:
 * - 0.5 base → 0.41 curved (mediocre stays clearly below midpoint)
 * - 0.7 base → 0.63 curved (good but not inflated)
 * - 0.9 base → 0.87 curved (excellent stays near the top)
 * This prevents middling AI extractions from producing passing scores.
 *
 * signal_strength is primary (0.65); response_quality acts as an expression modifier (0.35).
 */
export function calculateProbeScore(
  signalStrength: number,
  responseQuality: number,
  difficulty: Difficulty
): number {
  const base = SIGNAL_WEIGHT * signalStrength + QUALITY_WEIGHT * responseQuality;
  const curved = Math.pow(base, 1.3);
  return clamp(curved + DIFFICULTY_BONUS[difficulty], 0, 1);
}

// ─── Skill scoring ────────────────────────────────────────────────────────────

/**
 * Aggregates all probe scores per skill into a 0–100 skill score.
 *
 * Uses stage-weighted averaging so that L3 evidence (pressure scenario)
 * contributes more than L1 evidence (baseline). This captures the
 * trajectory dimension: a candidate who improves under pressure scores
 * higher than one who degrades, even if their simple average is identical.
 *
 * Stage weights: L1=1.0×, L2=1.5×, L3=2.0×
 * Skills with no evidence return 0.
 */
export function aggregateSkillScores(
  skillEvidence: Record<string, SkillProbeEntry[]>
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [skillId, entries] of Object.entries(skillEvidence)) {
    if (entries.length === 0) {
      result[skillId] = 0;
      continue;
    }

    let weightedSum = 0;
    let totalWeight = 0;

    for (const entry of entries) {
      const stageWeight = STAGE_WEIGHTS[entry.caseStage];
      weightedSum += entry.score * stageWeight;
      totalWeight += stageWeight;
    }

    const avg = weightedSum / totalWeight;
    result[skillId] = Math.round(clamp(avg, 0, 1) * 100);
  }

  return result;
}

// ─── Track scoring ─────────────────────────────────────────────────────────────

/**
 * Computes the overall track readiness score as a skill-weighted average.
 *
 * Each skill contributes proportionally to its configured weight.
 * Skills absent from skillScores are excluded (they contribute nothing).
 * Returns 0 if no skills have scores.
 */
export function calculateTrackScore(
  skillScores: Record<string, number>,
  skillConfigs: SkillConfig[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const config of skillConfigs) {
    const score = skillScores[config.skillId];
    if (score === undefined) continue;
    weightedSum += score * config.weight;
    totalWeight += config.weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(weightedSum / totalWeight);
}

// ─── Behavioral aggregation ───────────────────────────────────────────────────

/**
 * Aggregates behavioral evidence into per-dimension scores on a 0–100 scale.
 *
 * Computed independently from all skill and track scoring.
 * Must never be factored into probe, skill, or track scores.
 */
export function aggregateBehavioralSignals(
  evidence: BehavioralEvidence
): DiagnosticResult['behavioralScores'] {
  return {
    framing: toHundred(evidence.framing_quality),
    confidence: toHundred(evidence.reasoning_confidence),
    clarity: toHundred(evidence.communication_clarity),
  };
}

// ─── Result generation ────────────────────────────────────────────────────────

/**
 * Produces the complete diagnostic result from accumulated session evidence.
 *
 * Requires the track's skill configuration to compute weighted track scores
 * and accurate coverage reporting.
 *
 * Call this once the session reaches COMPLETE status.
 */
export function generateDiagnosticResult(
  skillEvidence: Record<string, SkillProbeEntry[]>,
  behavioralEvidence: BehavioralEvidence,
  skillConfigs: SkillConfig[]
): DiagnosticResult {
  const skillScores = aggregateSkillScores(skillEvidence);
  const trackScore = calculateTrackScore(skillScores, skillConfigs);
  const behavioralScores = aggregateBehavioralSignals(behavioralEvidence);

  const total = skillConfigs.length;
  const assessed = skillConfigs.filter(
    (s) => (skillEvidence[s.skillId]?.length ?? 0) > 0
  ).length;

  return {
    trackScore,
    skillScores,
    behavioralScores,
    coverage: { total, assessed },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

/** Averages a number array and converts from [0, 1] to [0, 100]. */
function toHundred(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = sum(values) / values.length;
  return Math.round(clamp(avg, 0, 1) * 100);
}
