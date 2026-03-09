/**
 * Consulting v1 Probe Registry (pure configuration).
 *
 * Probes are abstract diagnostic intents, not questions or cases.
 * They describe what evidence the engine should seek, not how to ask for it.
 *
 * Variants represent increasing contextual complexity to enrich signals over time.
 * They are not pass/fail difficulty levels and do not imply correctness.
 *
 * This registry is consumed by later layers that:
 * - select a probe based on skill needs,
 * - choose an appropriate variant,
 * - and map it to a concrete prompt or interaction.
 */

import type { Probe, SignalCategory, ProbeVariant } from './types';

// Re-export for backwards compatibility with any direct consumers
export type { SignalCategory, ProbeVariant };
export type ConsultingProbe = Probe;

export const consultingProbes: Probe[] = [
  {
    probeId: 'probe_problem_structuring',
    skillId: 'problem_structuring',
    probeType: 'problem_framing',
    description:
      'Observes how a candidate decomposes an ambiguous business situation into structured components.',
    primarySignals: ['problem_understanding', 'thought_structure'],
    secondarySignals: ['analytical_depth', 'judgment_decision'],
    variants: [
      {
        variantId: 'problem_structuring_low_context',
        contextLevel: 'low',
        description:
          'A single objective with minimal constraints to test basic framing and structure.',
      },
      {
        variantId: 'problem_structuring_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple objectives and constraints that require prioritization and structured trade-offs.',
      },
      {
        variantId: 'problem_structuring_high_context',
        contextLevel: 'high',
        description:
          'Conflicting stakeholder goals and incomplete information to test structured navigation.',
      },
    ],
  },
  {
    probeId: 'probe_hypothesis_driven_thinking',
    skillId: 'hypothesis_driven_thinking',
    probeType: 'hypothesis_prioritization',
    description:
      'Observes how a candidate forms testable hypotheses, prioritizes what to test first, and reasons directionally before analysis.',
    primarySignals: ['thought_structure', 'judgment_decision'],
    secondarySignals: ['problem_understanding', 'analytical_depth'],
    variants: [
      {
        variantId: 'hypothesis_driven_thinking_low_context',
        contextLevel: 'low',
        description:
          'Single objective with minimal ambiguity to assess basic hypothesis formation.',
      },
      {
        variantId: 'hypothesis_driven_thinking_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple plausible hypotheses requiring prioritization under limited time.',
      },
      {
        variantId: 'hypothesis_driven_thinking_high_context',
        contextLevel: 'high',
        description:
          'Conflicting signals and constraints to test directional reasoning before analysis.',
      },
    ],
  },
  {
    probeId: 'probe_analytical_thinking',
    skillId: 'analytical_thinking',
    probeType: 'analysis_synthesis',
    description:
      'Observes how a candidate reasons from inputs to insights using logic and analysis.',
    primarySignals: ['analytical_depth', 'thought_structure'],
    secondarySignals: ['problem_understanding', 'judgment_decision'],
    variants: [
      {
        variantId: 'analytical_thinking_low_context',
        contextLevel: 'low',
        description:
          'Clear inputs with a straightforward analytical path to assess basic reasoning flow.',
      },
      {
        variantId: 'analytical_thinking_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple data points with competing interpretations to test synthesis and prioritization.',
      },
      {
        variantId: 'analytical_thinking_high_context',
        contextLevel: 'high',
        description:
          'Ambiguous signals with time pressure to assess depth without overfitting.',
      },
    ],
  },
  {
    probeId: 'probe_client_communication',
    skillId: 'client_communication',
    probeType: 'executive_messaging',
    description:
      'Observes how a candidate translates analysis into clear, executive-ready communication.',
    primarySignals: ['thought_structure', 'judgment_decision'],
    secondarySignals: ['problem_understanding', 'engagement_effort'],
    variants: [
      {
        variantId: 'client_communication_low_context',
        contextLevel: 'low',
        description:
          'Single message to a general stakeholder to test clarity and structure.',
      },
      {
        variantId: 'client_communication_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple stakeholders with different priorities to test message tailoring.',
      },
      {
        variantId: 'client_communication_high_context',
        contextLevel: 'high',
        description:
          'High-stakes update requiring concise framing, trade-off explanation, and next steps.',
      },
    ],
  },
  {
    probeId: 'probe_decision_recommendation',
    skillId: 'decision_recommendation',
    probeType: 'recommendation_rationale',
    description:
      'Observes how a candidate makes a decision and supports it with a structured rationale.',
    primarySignals: ['judgment_decision', 'thought_structure'],
    secondarySignals: ['analytical_depth', 'problem_understanding'],
    variants: [
      {
        variantId: 'decision_recommendation_low_context',
        contextLevel: 'low',
        description:
          'Limited options with clear trade-offs to assess baseline decision framing.',
      },
      {
        variantId: 'decision_recommendation_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple viable options with partial information to test structured recommendation.',
      },
      {
        variantId: 'decision_recommendation_high_context',
        contextLevel: 'high',
        description:
          'Conflicting objectives and incomplete evidence to assess decision clarity under uncertainty.',
      },
    ],
  },
];
