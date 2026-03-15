'use client';

import dynamic from 'next/dynamic';
import type { DiagnosticReport } from '@/lib/api/diagnosticClient';

const DiagnosticResults = dynamic(
  () => import('@/components/diagnostic/DiagnosticResults'),
  { ssr: false }
);

const MOCK_RESULT: DiagnosticReport = {
  trackScore: 78,
  verdict: 'BELOW_THRESHOLD',
  benchmark: 85,
  percentile: 42,
  metadata: {
    trackName: 'Consulting',
    questionsCount: 15,
    benchmark: 85,
    strongestSkill: { label: 'Structuring', score: 91 },
    weakestSkill: { label: 'Quantitative Reasoning', score: 58 },
  },
  quickStats: {
    skillsAboveBenchmark: 1,
    totalSkills: 6,
    trajectoryPattern: 'IMPROVING',
    consistencyScore: 74,
  },
  coverage: { total: 6, assessed: 6 },
  skills: [
    {
      skillId: 'structuring',
      label: 'Structuring',
      score: 91,
      benchmark: 85,
      gap: 6,
      weight: 0.2,
      assessment: 'ABOVE_THRESHOLD',
      trajectory: 'CONSISTENT',
      stageScores: [
        { stage: 1, score: 88 },
        { stage: 2, score: 92 },
        { stage: 3, score: 93 },
      ],
      narrative: 'Demonstrates exceptional ability to decompose complex problems into MECE frameworks. Consistently identifies the right dimensions for analysis and builds logical issue trees that drive toward actionable insights.',
    },
    {
      skillId: 'hypothesis_driven',
      label: 'Hypothesis-Driven Thinking',
      score: 82,
      benchmark: 85,
      gap: -3,
      weight: 0.2,
      assessment: 'NEAR_THRESHOLD',
      trajectory: 'IMPROVING',
      stageScores: [
        { stage: 1, score: 74 },
        { stage: 2, score: 83 },
        { stage: 3, score: 89 },
      ],
      narrative: 'Shows strong capacity to form and test hypotheses iteratively. Initial hypotheses are well-grounded and refined effectively as new information emerges across case stages.',
    },
    {
      skillId: 'synthesis',
      label: 'Synthesis & Insight',
      score: 79,
      benchmark: 85,
      gap: -6,
      weight: 0.15,
      assessment: 'BELOW_THRESHOLD',
      trajectory: 'CONSISTENT',
      stageScores: [
        { stage: 1, score: 77 },
        { stage: 2, score: 80 },
        { stage: 3, score: 80 },
      ],
      narrative: 'Capable of drawing meaningful conclusions from data. Synthesizes information across exhibits well but could push further to generate non-obvious "so what" insights.',
    },
    {
      skillId: 'communication',
      label: 'Communication & Framing',
      score: 76,
      benchmark: 85,
      gap: -9,
      weight: 0.15,
      assessment: 'BELOW_THRESHOLD',
      trajectory: 'IMPROVING',
      stageScores: [
        { stage: 1, score: 68 },
        { stage: 2, score: 78 },
        { stage: 3, score: 82 },
      ],
      narrative: 'Communication is clear and structured. Framing has improved notably across cases, with later responses showing stronger executive-level articulation and action-oriented language.',
    },
    {
      skillId: 'creativity',
      label: 'Creative Problem Solving',
      score: 71,
      benchmark: 85,
      gap: -14,
      weight: 0.1,
      assessment: 'CRITICAL_GAP',
      trajectory: 'DECLINING',
      stageScores: [
        { stage: 1, score: 78 },
        { stage: 2, score: 70 },
        { stage: 3, score: 65 },
      ],
      narrative: 'Shows flashes of creative thinking in early stages but tends to fall back on conventional approaches under pressure. Could benefit from deliberately exploring second-order effects and lateral analogies.',
    },
    {
      skillId: 'quantitative',
      label: 'Quantitative Reasoning',
      score: 58,
      benchmark: 85,
      gap: -27,
      weight: 0.2,
      assessment: 'CRITICAL_GAP',
      trajectory: 'DECLINING',
      stageScores: [
        { stage: 1, score: 65 },
        { stage: 2, score: 57 },
        { stage: 3, score: 52 },
      ],
      narrative: 'Quantitative analysis is the primary development area. Struggles with multi-step calculations and interpreting numerical exhibits under time pressure. Recommendations focus heavily on building this foundational skill.',
    },
  ],
  behavioralSignals: [
    { dimension: 'framing', label: 'Executive Framing', score: 80, benchmark: 85, assessment: 'BELOW_THRESHOLD' },
    { dimension: 'confidence', label: 'Confidence & Conviction', score: 74, benchmark: 85, assessment: 'CRITICAL_GAP' },
    { dimension: 'clarity', label: 'Clarity of Expression', score: 77, benchmark: 85, assessment: 'BELOW_THRESHOLD' },
  ],
  recommendations: [
    {
      priority: 1,
      title: 'Build Quantitative Fluency Through Daily Practice',
      description: 'Dedicate 20 minutes daily to mental math drills and multi-step estimation problems. Focus on chart/exhibit interpretation under timed conditions.',
    },
    {
      priority: 2,
      title: 'Sustain Creative Thinking Under Pressure',
      description: 'Practice brainstorming frameworks that force lateral thinking — e.g., analogies from other industries, second-order effects, and "what if" scenarios — especially in later case stages.',
    },
    {
      priority: 3,
      title: 'Sharpen the "So What" in Synthesis',
      description: 'After each analysis, force yourself to articulate one non-obvious implication. Move beyond summarizing data to generating actionable strategic insights.',
    },
  ],
  archetype: {
    id: 'structured_analyst',
    name: 'The Structured Analyst',
    description: 'You lead with framework-first thinking and systematic decomposition. Your approach mirrors the classic McKinsey problem-solving methodology — disciplined, exhaustive, and logically rigorous.',
    topTraits: ['Structuring', 'Hypothesis-Driven Thinking'],
    tagline: 'TOP 15% STRUCTURERS',
  },
  firmFit: [
    { firm: 'McKinsey', fitPercent: 84 },
    { firm: 'BCG', fitPercent: 76 },
    { firm: 'Bain', fitPercent: 71 },
  ],
  pressureResilience: {
    score: 72,
    dropFromBaseline: -6,
    pattern: 'MODERATE_DROP',
    perCaseAverage: [
      { stage: 1, score: 78 },
      { stage: 2, score: 76 },
      { stage: 3, score: 72 },
    ],
    skillHeatmap: [
      { skillId: 'structuring', label: 'Structuring', scores: [88, 92, 93] },
      { skillId: 'hypothesis_driven', label: 'Hypothesis-Driven', scores: [74, 83, 89] },
      { skillId: 'synthesis', label: 'Synthesis', scores: [77, 80, 80] },
      { skillId: 'communication', label: 'Communication', scores: [68, 78, 82] },
      { skillId: 'creativity', label: 'Creative Problem Solving', scores: [78, 70, 65] },
      { skillId: 'quantitative', label: 'Quantitative', scores: [65, 57, 52] },
    ],
  },
};

export default function PreviewResultsPage() {
  return (
    <DiagnosticResults
      result={MOCK_RESULT}
      trackId="consulting"
      onRestart={() => window.location.reload()}
    />
  );
}
