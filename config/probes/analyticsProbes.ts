/**
 * Analytics v1 Probe Registry (pure configuration).
 *
 * Probes are abstract diagnostic intents, not questions or cases.
 * They describe what evidence the engine should seek, not how to ask for it.
 */

import type { Probe } from './types';

export const analyticsProbes: Probe[] = [
  {
    probeId: 'probe_data_interpretation',
    skillId: 'data_interpretation',
    probeType: 'data_pattern_reading',
    description:
      'Observes how a candidate reads patterns from datasets and draws meaningful directional conclusions.',
    primarySignals: ['analytical_depth', 'problem_understanding'],
    secondarySignals: ['thought_structure', 'judgment_decision'],
    variants: [
      {
        variantId: 'data_interpretation_low_context',
        contextLevel: 'low',
        description:
          'Single dataset with clear patterns to assess baseline interpretation.',
      },
      {
        variantId: 'data_interpretation_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple datasets requiring cross-metric pattern recognition.',
      },
      {
        variantId: 'data_interpretation_high_context',
        contextLevel: 'high',
        description:
          'Conflicting datasets requiring disambiguation and assumption surfacing.',
      },
    ],
  },
  {
    probeId: 'probe_problem_decomposition',
    skillId: 'problem_decomposition',
    probeType: 'analytical_scoping',
    description:
      'Observes how a candidate scopes and decomposes an analytical question into tractable sub-problems.',
    primarySignals: ['thought_structure', 'problem_understanding'],
    secondarySignals: ['analytical_depth', 'judgment_decision'],
    variants: [
      {
        variantId: 'problem_decomposition_low_context',
        contextLevel: 'low',
        description:
          'Single well-defined question to assess basic decomposition structure.',
      },
      {
        variantId: 'problem_decomposition_medium_context',
        contextLevel: 'medium',
        description:
          'Broad question with multiple valid decomposition paths requiring prioritization.',
      },
      {
        variantId: 'problem_decomposition_high_context',
        contextLevel: 'high',
        description:
          'Ambiguous question with competing framings requiring scoping decisions under constraints.',
      },
    ],
  },
  {
    probeId: 'probe_statistical_reasoning',
    skillId: 'statistical_reasoning',
    probeType: 'statistical_inference',
    description:
      'Observes how a candidate applies statistical thinking to identify trends, evaluate sample validity, and reason about causation.',
    primarySignals: ['analytical_depth', 'thought_structure'],
    secondarySignals: ['problem_understanding', 'judgment_decision'],
    variants: [
      {
        variantId: 'statistical_reasoning_low_context',
        contextLevel: 'low',
        description:
          'Single trend in clean data to assess baseline statistical interpretation.',
      },
      {
        variantId: 'statistical_reasoning_medium_context',
        contextLevel: 'medium',
        description:
          'Sample validity and representativeness concerns requiring structured reasoning.',
      },
      {
        variantId: 'statistical_reasoning_high_context',
        contextLevel: 'high',
        description:
          'Correlation-vs-causation tension requiring explicit causal inference reasoning.',
      },
    ],
  },
  {
    probeId: 'probe_insight_synthesis',
    skillId: 'insight_synthesis',
    probeType: 'insight_generation',
    description:
      'Observes how a candidate synthesizes analytical findings into actionable insights.',
    primarySignals: ['judgment_decision', 'analytical_depth'],
    secondarySignals: ['thought_structure', 'engagement_effort'],
    variants: [
      {
        variantId: 'insight_synthesis_low_context',
        contextLevel: 'low',
        description:
          'Single clear implication requiring direct synthesis from data.',
      },
      {
        variantId: 'insight_synthesis_medium_context',
        contextLevel: 'medium',
        description:
          'Cross-metric synthesis requiring integration of multiple findings.',
      },
      {
        variantId: 'insight_synthesis_high_context',
        contextLevel: 'high',
        description:
          'Conflicting interpretations requiring trade-off reasoning and a defensible synthesis.',
      },
    ],
  },
  {
    probeId: 'probe_analytical_communication',
    skillId: 'analytical_communication',
    probeType: 'findings_communication',
    description:
      'Observes how a candidate communicates analytical findings clearly to different audiences.',
    primarySignals: ['thought_structure', 'judgment_decision'],
    secondarySignals: ['problem_understanding', 'engagement_effort'],
    variants: [
      {
        variantId: 'analytical_communication_low_context',
        contextLevel: 'low',
        description:
          'Single finding presented to a general audience to assess basic clarity.',
      },
      {
        variantId: 'analytical_communication_medium_context',
        contextLevel: 'medium',
        description:
          'Mixed technical and non-technical audience requiring audience-adapted framing.',
      },
      {
        variantId: 'analytical_communication_high_context',
        contextLevel: 'high',
        description:
          'Executive briefing requiring confident framing with explicit caveats and uncertainty.',
      },
    ],
  },
];
