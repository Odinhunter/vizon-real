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

// ─── Constants ──────────────────────────────────────────────────────────────

const MBB_BENCHMARK = 85;
const BEHAVIORAL_BENCHMARK = 70;

// ─── Skill labels ───────────────────────────────────────────────────────────

const SKILL_LABELS: Record<string, string> = {
  problem_structuring: 'Structuring',
  hypothesis_driven_thinking: 'Hypothesis Thinking',
  analytical_thinking: 'Analytical Thinking',
  client_communication: 'Client Communication',
  decision_recommendation: 'Decision & Recommendation',
};

function getSkillLabel(skillId: string): string {
  return SKILL_LABELS[skillId] ?? skillId
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Narrative templates ────────────────────────────────────────────────────

const SKILL_NARRATIVES: Record<string, Record<SkillAssessment, string>> = {
  problem_structuring: {
    ABOVE_THRESHOLD: 'Strong ability to decompose ambiguous problems into structured frameworks. Your structuring instincts align with top-tier consulting expectations.',
    NEAR_THRESHOLD: 'Demonstrates competent structuring ability that approaches the benchmark. With targeted practice on MECE decomposition, this skill can become a clear strength.',
    BELOW_THRESHOLD: 'Structuring ability shows promise but falls short of the consulting benchmark. Focus on building repeatable frameworks for common problem types.',
    CRITICAL_GAP: 'Significant gap in problem structuring — a foundational consulting skill. Prioritize structured thinking exercises and case practice to build this capability.',
  },
  hypothesis_driven_thinking: {
    ABOVE_THRESHOLD: 'Demonstrates a clear hypothesis-first approach, testing and refining assumptions efficiently. This is a differentiating strength in consulting interviews.',
    NEAR_THRESHOLD: 'Shows emerging hypothesis-driven instincts. Strengthening the habit of leading with a hypothesis before diving into analysis will push this above threshold.',
    BELOW_THRESHOLD: 'Tendency toward data-gathering before forming hypotheses. Consulting requires leading with a point of view — practice forming early hypotheses and testing them.',
    CRITICAL_GAP: 'Lacks a hypothesis-driven approach, which is a core differentiator in consulting. Focus on building the muscle of forming and testing hypotheses early.',
  },
  analytical_thinking: {
    ABOVE_THRESHOLD: 'Excellent analytical capabilities with strong quantitative reasoning and pattern recognition. Your analysis stands out as a core strength.',
    NEAR_THRESHOLD: 'Solid analytical foundation approaching the consulting benchmark. Sharpening quantitative reasoning and synthesis will cement this as a strength.',
    BELOW_THRESHOLD: 'Analytical thinking needs development to meet consulting standards. Focus on quantitative reasoning, data interpretation, and drawing actionable insights.',
    CRITICAL_GAP: 'Major gap in analytical thinking — the primary consulting capability. Intensive practice on quantitative reasoning and case math is essential.',
  },
  client_communication: {
    ABOVE_THRESHOLD: 'Clear, executive-ready communication style with strong framing and concision. Your communication would resonate well in client-facing settings.',
    NEAR_THRESHOLD: 'Communication is clear and competent, approaching professional consulting standards. Refining executive presence and concision will push this forward.',
    BELOW_THRESHOLD: 'Communication style needs refinement for consulting contexts. Focus on leading with the answer, structuring responses top-down, and being more concise.',
    CRITICAL_GAP: 'Communication falls significantly below consulting expectations. Prioritize pyramid-structured responses and practicing concise, insight-led delivery.',
  },
  decision_recommendation: {
    ABOVE_THRESHOLD: 'Strong ability to synthesize analysis into clear, defensible recommendations. You demonstrate the conviction expected at top firms.',
    NEAR_THRESHOLD: 'Shows good instincts for making recommendations but occasionally hedges. Building confidence in committing to a position under uncertainty will help.',
    BELOW_THRESHOLD: 'Recommendations tend to be tentative or insufficiently supported. Practice making bold, evidence-backed recommendations even with incomplete data.',
    CRITICAL_GAP: 'Struggles to commit to clear recommendations — a critical consulting output. Focus on building the habit of synthesizing analysis into decisive action items.',
  },
};

function getSkillNarrative(skillId: string, assessment: SkillAssessment): string {
  return SKILL_NARRATIVES[skillId]?.[assessment]
    ?? `Skill ${getSkillLabel(skillId)} assessed as ${assessment.replace(/_/g, ' ').toLowerCase()}.`;
}

// ─── Recommendation templates ───────────────────────────────────────────────

const SKILL_RECOMMENDATIONS: Record<string, { title: string; description: string }> = {
  problem_structuring: {
    title: 'Build Repeatable Structuring Frameworks',
    description: 'Practice MECE decomposition on 2-3 new problems daily. Start with common consulting archetypes (profitability, market entry, operations) and build muscle memory for clean issue trees.',
  },
  hypothesis_driven_thinking: {
    title: 'Lead with Hypotheses, Not Data Collection',
    description: 'Before every analysis, write down your hypothesis in one sentence. Track how often you confirm vs. pivot. This trains the consulting habit of being "hypothesis-driven, not data-driven."',
  },
  analytical_thinking: {
    title: 'Sharpen Quantitative Reasoning',
    description: 'Work through market sizing and case math problems daily. Focus on estimation accuracy, identifying the right metrics, and connecting quantitative findings to strategic implications.',
  },
  client_communication: {
    title: 'Practice Top-Down, Insight-Led Communication',
    description: 'Record yourself answering case questions and review for concision. Lead every response with the answer, then support with 2-3 structured reasons. Eliminate filler and hedging language.',
  },
  decision_recommendation: {
    title: 'Commit to Clear Recommendations Under Uncertainty',
    description: 'In every practice case, force yourself to make a definitive recommendation with 60% of the data. State your recommendation, the key evidence, risks, and next steps — in that order.',
  },
};

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

// ─── Archetype classification ────────────────────────────────────────────────

interface ArchetypeTemplate {
  id: string;
  name: string;
  description: string;
  tagline: string;
}

const ARCHETYPE_TEMPLATES: Record<string, ArchetypeTemplate> = {
  pressure_performer: {
    id: 'pressure_performer',
    name: 'The Pressure Performer',
    description: 'You thrive under increasing complexity, delivering stronger performance as case difficulty escalates — a rare and highly valued trait in consulting.',
    tagline: 'RISES UNDER PRESSURE',
  },
  structured_analyst: {
    id: 'structured_analyst',
    name: 'The Structured Analyst',
    description: 'Your instinct to decompose problems into clean frameworks is your defining edge — structured thinkers anchor high-performing case teams.',
    tagline: 'TOP 15% STRUCTURERS',
  },
  hypothesis_driver: {
    id: 'hypothesis_driver',
    name: 'The Hypothesis Driver',
    description: 'You lead with hypotheses rather than data collection, testing and refining assumptions efficiently — the hallmark of experienced consultants.',
    tagline: 'HYPOTHESIS-FIRST THINKER',
  },
  analytical_powerhouse: {
    id: 'analytical_powerhouse',
    name: 'The Analytical Powerhouse',
    description: 'Your quantitative reasoning and pattern recognition stand out as elite-level capabilities that drive insight generation.',
    tagline: 'ELITE ANALYTICAL DEPTH',
  },
  communicator: {
    id: 'communicator',
    name: 'The Communicator',
    description: 'Your ability to frame insights clearly and communicate with executive presence is a differentiating strength in client-facing roles.',
    tagline: 'CLIENT-READY PRESENCE',
  },
  balanced_generalist: {
    id: 'balanced_generalist',
    name: 'The Balanced Generalist',
    description: 'Your evenly distributed skill profile shows versatility across all consulting dimensions — a strong foundation for any engagement type.',
    tagline: 'VERSATILE ALL-ROUNDER',
  },
};

function classifyArchetype(skills: SkillDetail[], overallTrajectory: TrajectoryPattern): CandidateArchetype {
  const sorted = [...skills].sort((a, b) => b.score - a.score);
  const topTraits = sorted.slice(0, 2).map((s) => s.label);
  const top1Id = sorted[0]?.skillId;
  const top2Ids = sorted.slice(0, 2).map((s) => s.skillId);

  // Check Pressure Performer first (trajectory-based)
  if (overallTrajectory === 'IMPROVING') {
    // Verify L3 avg > L1 avg
    const l1Scores = skills.flatMap((s) => s.stageScores.filter((ss) => ss.stage === 1).map((ss) => ss.score));
    const l3Scores = skills.flatMap((s) => s.stageScores.filter((ss) => ss.stage === 3).map((ss) => ss.score));
    const l1Avg = l1Scores.length > 0 ? l1Scores.reduce((a, b) => a + b, 0) / l1Scores.length : 0;
    const l3Avg = l3Scores.length > 0 ? l3Scores.reduce((a, b) => a + b, 0) / l3Scores.length : 0;
    if (l3Avg > l1Avg) {
      return { ...ARCHETYPE_TEMPLATES.pressure_performer, topTraits };
    }
  }

  // Structured Analyst: top 2 include problem_structuring AND (analytical_thinking OR client_communication)
  if (
    top2Ids.includes('problem_structuring') &&
    (top2Ids.includes('analytical_thinking') || top2Ids.includes('client_communication'))
  ) {
    return { ...ARCHETYPE_TEMPLATES.structured_analyst, topTraits };
  }

  // Hypothesis Driver: hypothesis_driven_thinking is #1
  if (top1Id === 'hypothesis_driven_thinking') {
    return { ...ARCHETYPE_TEMPLATES.hypothesis_driver, topTraits };
  }

  // Analytical Powerhouse: analytical_thinking is #1 AND score >= 75
  if (top1Id === 'analytical_thinking' && sorted[0].score >= 75) {
    return { ...ARCHETYPE_TEMPLATES.analytical_powerhouse, topTraits };
  }

  // Communicator: client_communication is #1
  if (top1Id === 'client_communication') {
    return { ...ARCHETYPE_TEMPLATES.communicator, topTraits };
  }

  // Balanced Generalist: fallback (also matches if std dev < 6)
  return { ...ARCHETYPE_TEMPLATES.balanced_generalist, topTraits };
}

// ─── MBB Firm Fit ────────────────────────────────────────────────────────────

const FIRM_WEIGHTS: Record<string, Record<string, number>> = {
  McKinsey: {
    problem_structuring: 1.3,
    hypothesis_driven_thinking: 1.5,
    analytical_thinking: 1.1,
    client_communication: 0.8,
    decision_recommendation: 0.9,
  },
  BCG: {
    problem_structuring: 1.0,
    hypothesis_driven_thinking: 1.1,
    analytical_thinking: 1.5,
    client_communication: 1.0,
    decision_recommendation: 1.0,
  },
  Bain: {
    problem_structuring: 1.0,
    hypothesis_driven_thinking: 0.9,
    analytical_thinking: 1.1,
    client_communication: 1.2,
    decision_recommendation: 1.5,
  },
};

function computeFirmFit(skills: SkillDetail[]): FirmFit[] {
  return Object.entries(FIRM_WEIGHTS).map(([firm, weights]) => {
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
  totalQuestions: number
): DiagnosticReport {
  // Base scores from existing scoring engine
  const skillScores = aggregateSkillScores(skillEvidence);
  const trackScore = calculateTrackScore(skillScores, skillConfigs);
  const behavioralScores = aggregateBehavioralSignals(behavioralEvidence);

  // Verdict
  const verdict = classifyVerdict(trackScore);

  // Per-skill analysis
  const skills: SkillDetail[] = skillConfigs.map((config) => {
    const score = skillScores[config.skillId] ?? 0;
    const gap = score - MBB_BENCHMARK;
    const assessment = classifySkillAssessment(gap);
    const entries = skillEvidence[config.skillId] ?? [];
    const trajectory = classifyTrajectory(entries);
    const stageScores = computeStageScores(entries);
    const narrative = getSkillNarrative(config.skillId, assessment);

    return {
      skillId: config.skillId,
      label: getSkillLabel(config.skillId),
      score,
      benchmark: MBB_BENCHMARK,
      gap,
      weight: config.weight,
      assessment,
      trajectory,
      stageScores,
      narrative,
    };
  });

  // Quick stats
  const skillsAboveBenchmark = skills.filter((s) => s.score >= MBB_BENCHMARK).length;
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
      const template = SKILL_RECOMMENDATIONS[s.skillId];
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
  const archetype = classifyArchetype(skills, overallTrajectory);
  const firmFit = computeFirmFit(skills);
  const pressureResilience = computePressureResilience(skills);
  const percentile = estimatePercentile(trackScore);

  return {
    trackScore,
    verdict,
    benchmark: MBB_BENCHMARK,
    metadata: {
      trackName,
      questionsCount: totalQuestions,
      benchmark: MBB_BENCHMARK,
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
