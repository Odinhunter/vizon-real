/**
 * Server-side analysis engine that transforms raw session evidence
 * into a rich DiagnosticReport. Pure function — no I/O, no AI calls.
 *
 * Imports scoring primitives from engine/scoring.ts and enriches them
 * with gap analysis, trajectory tracking, narrative generation, and
 * prioritized recommendations.
 */

import type { SkillProbeEntry } from './diagnosticSession';
import type { BehavioralEvidence } from './scoring';
import type { SkillConfig } from './selectNextProbe';
import type {
  DiagnosticReport,
  VerdictTier,
  SkillAssessment,
  TrajectoryPattern,
  SkillDetail,
  BehavioralSignal,
  Recommendation,
  CandidateArchetype,
  FirmFit,
  PressureResilience,
  ResiliencePattern,
} from '@/lib/api/diagnosticClient';
import {
  aggregateSkillScores,
  calculateTrackScore,
  aggregateBehavioralSignals,
} from './scoring';
import { getTrackAnalysisConfig } from './trackAnalysisConfig';

// ─── Constants ──────────────────────────────────────────────────────────────

const BENCHMARK = 85;
const BEHAVIORAL_BENCHMARK = 70;

// ─── Classification helpers ─────────────────────────────────────────────────

function classifyVerdict(trackScore: number): VerdictTier {
  if (trackScore >= 88) return 'STRONG_CANDIDATE';
  if (trackScore >= 82) return 'ABOVE_THRESHOLD';
  if (trackScore >= 70) return 'BORDERLINE';
  if (trackScore >= 55) return 'BELOW_THRESHOLD';
  return 'SIGNIFICANT_GAP';
}

function classifySkillAssessment(gap: number): SkillAssessment {
  if (gap >= 5) return 'ABOVE_THRESHOLD';
  if (gap >= -4) return 'NEAR_THRESHOLD';
  if (gap >= -10) return 'BELOW_THRESHOLD';
  return 'CRITICAL_GAP';
}

function classifyTrajectory(entries: SkillProbeEntry[]): TrajectoryPattern {
  const byStage: Record<number, number[]> = {};
  for (const e of entries) {
    (byStage[e.caseStage] ??= []).push(e.score);
  }

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const l1 = byStage[1] ? avg(byStage[1]) : null;
  const l3 = byStage[3] ? avg(byStage[3]) : null;

  if (l1 === null || l3 === null) return 'INSUFFICIENT_DATA';
  const delta = (l3 - l1) * 100; // convert to 0-100 scale
  if (delta > 5) return 'IMPROVING';
  if (delta < -5) return 'DECLINING';
  return 'CONSISTENT';
}

function computeStageScores(entries: SkillProbeEntry[]): { stage: 1 | 2 | 3; score: number }[] {
  const byStage: Partial<Record<1 | 2 | 3, number[]>> = {};
  for (const e of entries) {
    (byStage[e.caseStage] ??= []).push(e.score);
  }

  const result: { stage: 1 | 2 | 3; score: number }[] = [];
  for (const s of [1, 2, 3] as const) {
    const arr = byStage[s];
    if (arr && arr.length > 0) {
      result.push({ stage: s, score: Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) });
    }
  }
  return result;
}

// ─── Firm Fit (generic, driven by track config weights) ──────────────────────

function computeFirmFit(skills: SkillDetail[], firmWeights: Record<string, Record<string, number>>): FirmFit[] {
  return Object.entries(firmWeights).map(([firm, weights]) => {
    let weightedSum = 0;
    let totalWeight = 0;
    for (const skill of skills) {
      const w = weights[skill.skillId] ?? 1.0;
      weightedSum += skill.score * w;
      totalWeight += w;
    }
    const fitPercent = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    return { firm, fitPercent };
  });
}

// ─── Pressure Resilience ─────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computePressureResilience(skills: SkillDetail[]): PressureResilience {
  // Build skill × case heatmap
  const skillHeatmap = skills.map((skill) => {
    const stageMap: Partial<Record<1 | 2 | 3, number>> = {};
    for (const ss of skill.stageScores) {
      stageMap[ss.stage] = ss.score;
    }
    return {
      skillId: skill.skillId,
      label: skill.label,
      scores: [stageMap[1] ?? 0, stageMap[2] ?? 0, stageMap[3] ?? 0] as [number, number, number],
    };
  });

  // Per-case averages across all skills
  const stageAverages: { stage: 1 | 2 | 3; score: number }[] = ([1, 2, 3] as const).map((stage) => {
    const scores = skillHeatmap.map((s) => s.scores[stage - 1]);
    const validScores = scores.filter((s) => s > 0);
    const avg = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
    return { stage, score: avg };
  });

  // Drop from baseline
  const l1Avg = stageAverages.find((s) => s.stage === 1)?.score ?? 0;
  const l2Avg = stageAverages.find((s) => s.stage === 2)?.score ?? 0;
  const l3Avg = stageAverages.find((s) => s.stage === 3)?.score ?? 0;
  const dropFromBaseline = l3Avg - l1Avg; // negative = drop

  // Resilience score: base 70, reward improvement, penalize drops
  // Also factor in L2→L3 trajectory (did they recover or continue declining?)
  const l2ToL3Drop = l3Avg - l2Avg;
  // Primary factor: L1→L3 change. Secondary: L2→L3 trend (weights recovery)
  const primaryAdjustment = dropFromBaseline * 1.8;
  const secondaryAdjustment = l2ToL3Drop * 0.7;
  const score = clamp(Math.round(70 + primaryAdjustment + secondaryAdjustment), 0, 100);

  // Pattern classification — tighter thresholds
  let pattern: ResiliencePattern;
  if (dropFromBaseline >= 3) pattern = 'RESILIENT';
  else if (dropFromBaseline >= -5) pattern = 'MODERATE_DROP';
  else if (dropFromBaseline >= -12) pattern = 'DEGRADES';
  else pattern = 'COLLAPSES';

  return {
    score,
    dropFromBaseline,
    pattern,
    perCaseAverage: stageAverages,
    skillHeatmap,
  };
}

// ─── Percentile Estimation ───────────────────────────────────────────────────

function estimatePercentile(trackScore: number): number {
  const raw = 1 / (1 + Math.exp(-0.15 * (trackScore - 82)));
  return clamp(Math.round(raw * 98) + 1, 1, 99);
}

// ─── Behavioral signal helpers ──────────────────────────────────────────────

const BEHAVIORAL_LABELS: Record<string, string> = {
  framing: 'Framing Quality',
  confidence: 'Reasoning Confidence',
  clarity: 'Communication Clarity',
};

// ─── Main function ──────────────────────────────────────────────────────────

export function analyzeResults(
  skillEvidence: Record<string, SkillProbeEntry[]>,
  behavioralEvidence: BehavioralEvidence,
  skillConfigs: SkillConfig[],
  trackName: string,
  totalQuestions: number,
  trackId = 'consulting'
): DiagnosticReport {
  const config = getTrackAnalysisConfig(trackId);

  function getSkillLabel(skillId: string): string {
    return config.skillLabels[skillId] ?? skillId
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  function getSkillNarrative(skillId: string, assessment: SkillAssessment): string {
    return config.skillNarratives[skillId]?.[assessment]
      ?? `Skill ${getSkillLabel(skillId)} assessed as ${assessment.replace(/_/g, ' ').toLowerCase()}.`;
  }

  // Base scores from existing scoring engine
  const skillScores = aggregateSkillScores(skillEvidence);
  const trackScore = calculateTrackScore(skillScores, skillConfigs);
  const behavioralScores = aggregateBehavioralSignals(behavioralEvidence);

  // Verdict
  const verdict = classifyVerdict(trackScore);

  // Per-skill analysis
  const skills: SkillDetail[] = skillConfigs.map((cfg) => {
    const score = skillScores[cfg.skillId] ?? 0;
    const gap = score - BENCHMARK;
    const assessment = classifySkillAssessment(gap);
    const entries = skillEvidence[cfg.skillId] ?? [];
    const trajectory = classifyTrajectory(entries);
    const stageScores = computeStageScores(entries);
    const narrative = getSkillNarrative(cfg.skillId, assessment);

    return {
      skillId: cfg.skillId,
      label: getSkillLabel(cfg.skillId),
      score,
      benchmark: BENCHMARK,
      gap,
      weight: cfg.weight,
      assessment,
      trajectory,
      stageScores,
      narrative,
    };
  });

  // Quick stats
  const skillsAboveBenchmark = skills.filter((s) => s.score >= BENCHMARK).length;
  const allScoreValues = skills.map((s) => s.score);
  const mean = allScoreValues.length > 0 ? allScoreValues.reduce((a, b) => a + b, 0) / allScoreValues.length : 0;
  const variance = allScoreValues.length > 0
    ? allScoreValues.reduce((sum, v) => sum + (v - mean) ** 2, 0) / allScoreValues.length
    : 0;
  const stddev = Math.sqrt(variance);
  const consistencyScore = Math.max(0, Math.round(100 - stddev * 2));

  // Overall trajectory from L1 avg vs L3 avg across all skills
  const allEntries = Object.values(skillEvidence).flat();
  const overallTrajectory = classifyTrajectory(allEntries);

  // Behavioral signals
  const behavioralDimensions: { key: keyof typeof behavioralScores; dimension: string }[] = [
    { key: 'framing', dimension: 'framing' },
    { key: 'confidence', dimension: 'confidence' },
    { key: 'clarity', dimension: 'clarity' },
  ];

  const behavioralSignals: BehavioralSignal[] = behavioralDimensions.map(({ key, dimension }) => {
    const score = behavioralScores[key];
    const gap = score - BEHAVIORAL_BENCHMARK;
    return {
      dimension,
      label: BEHAVIORAL_LABELS[key] ?? dimension,
      score,
      benchmark: BEHAVIORAL_BENCHMARK,
      assessment: classifySkillAssessment(gap),
    };
  });

  // Recommendations — from weakest skills
  const sortedByGap = [...skills].sort((a, b) => a.gap - b.gap);
  const recommendations: Recommendation[] = sortedByGap
    .slice(0, 3)
    .filter((s) => s.gap < 5) // only recommend for skills not already strong
    .map((s, i) => {
      const template = config.skillRecommendations[s.skillId];
      return {
        priority: i + 1,
        title: template?.title ?? `Improve ${s.label}`,
        description: template?.description ?? `Focus on developing ${s.label.toLowerCase()} to close the gap to the benchmark.`,
      };
    });

  // Metadata
  const strongest = skills.reduce((a, b) => (a.score >= b.score ? a : b), skills[0]);
  const weakest = skills.reduce((a, b) => (a.score <= b.score ? a : b), skills[0]);

  const total = skillConfigs.length;
  const assessed = skillConfigs.filter(
    (s) => (skillEvidence[s.skillId]?.length ?? 0) > 0
  ).length;

  // Advanced analytics
  const archetype = config.classifyArchetype(skills, overallTrajectory);
  const firmFit = computeFirmFit(skills, config.firmWeights);
  const pressureResilience = computePressureResilience(skills);
  const percentile = estimatePercentile(trackScore);

  return {
    trackScore,
    verdict,
    benchmark: BENCHMARK,
    metadata: {
      trackName,
      questionsCount: totalQuestions,
      benchmark: BENCHMARK,
      strongestSkill: { label: strongest.label, score: strongest.score },
      weakestSkill: { label: weakest.label, score: weakest.score },
    },
    quickStats: {
      skillsAboveBenchmark,
      totalSkills: skills.length,
      trajectoryPattern: overallTrajectory,
      consistencyScore,
    },
    skills,
    behavioralSignals,
    recommendations,
    coverage: { total, assessed },
    archetype,
    firmFit,
    pressureResilience,
    percentile,
  };
}
