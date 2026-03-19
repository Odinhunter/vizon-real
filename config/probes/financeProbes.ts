/**
 * Finance v1 Probe Registry (MVP scaffolding).
 *
 * Mirrors ConsultingProbe structure to maintain engine compatibility.
 * These are structural placeholders — real finance probes will be richer.
 */

import type { Probe } from './types';

export const financeProbes: Probe[] = [
  {
    probeId: 'probe_financial_signal_interpretation',
    skillId: 'financial_signal_interpretation',
    probeType: 'financial_signal_analysis',
    description:
      'Observes how a candidate interprets multi-year financial signals and identifies directional trends.',
    primarySignals: ['analytical_depth', 'problem_understanding'],
    secondarySignals: ['thought_structure', 'judgment_decision'],
    variants: [
      {
        variantId: 'financial_signal_low_context',
        contextLevel: 'low',
        description:
          'Single-year financial snapshot to assess baseline interpretation.',
      },
      {
        variantId: 'financial_signal_medium_context',
        contextLevel: 'medium',
        description:
          'Multi-year financial performance with mixed signals.',
      },
      {
        variantId: 'financial_signal_high_context',
        contextLevel: 'high',
        description:
          'SaaS metrics decomposition — identifying ARR-based enterprise value drivers.',
      },
    ],
  },
  {
    probeId: 'probe_investment_thesis',
    skillId: 'investment_thesis_formation',
    probeType: 'investment_thesis_formation',
    description:
      'Observes how a candidate forms a directional investment view from available data.',
    primarySignals: ['thought_structure', 'judgment_decision'],
    secondarySignals: ['analytical_depth', 'problem_understanding'],
    variants: [
      {
        variantId: 'investment_thesis_low_context',
        contextLevel: 'low',
        description:
          'Limited financial inputs to form an initial directional view.',
      },
      {
        variantId: 'investment_thesis_medium_context',
        contextLevel: 'medium',
        description:
          'Financial and competitive context requiring structured thesis framing.',
      },
      {
        variantId: 'investment_thesis_high_context',
        contextLevel: 'high',
        description:
          'Dual-lever value creation thesis — ARR growth and margin expansion in SaaS.',
      },
    ],
  },
  {
    probeId: 'probe_capital_allocation',
    skillId: 'capital_allocation_judgment',
    probeType: 'capital_allocation_reasoning',
    description:
      'Observes how a candidate reasons about capital deployment and incremental return trade-offs.',
    primarySignals: ['analytical_depth', 'judgment_decision'],
    secondarySignals: ['thought_structure', 'problem_understanding'],
    variants: [
      {
        variantId: 'capital_allocation_low_context',
        contextLevel: 'low',
        description:
          'Single investment option with clear incremental return logic.',
      },
      {
        variantId: 'capital_allocation_medium_context',
        contextLevel: 'medium',
        description:
          'Two competing investment uses requiring comparative return reasoning.',
      },
      {
        variantId: 'capital_allocation_high_context',
        contextLevel: 'high',
        description:
          'Multi-step return analysis — entry valuation, exit ARR, MoM, and IRR evaluation.',
      },
    ],
  },
  {
    probeId: 'probe_risk_assessment',
    skillId: 'risk_sensitivity_reasoning',
    probeType: 'risk_sensitivity_analysis',
    description:
      'Observes how a candidate articulates downside risks and scenario sensitivity.',
    primarySignals: ['judgment_decision', 'analytical_depth'],
    secondarySignals: ['thought_structure', 'engagement_effort'],
    variants: [
      {
        variantId: 'risk_assessment_low_context',
        contextLevel: 'low',
        description:
          'Single key risk factor requiring structured explanation.',
      },
      {
        variantId: 'risk_assessment_medium_context',
        contextLevel: 'medium',
        description:
          'Multiple risk drivers requiring prioritization.',
      },
      {
        variantId: 'risk_assessment_high_context',
        contextLevel: 'high',
        description:
          'Downside scenario — growth slowdown and multiple compression impact on returns.',
      },
    ],
  },
  {
    probeId: 'probe_investment_recommendation',
    skillId: 'investment_recommendation_clarity',
    probeType: 'investment_recommendation',
    description:
      'Observes how a candidate forms and defends a structured investment recommendation.',
    primarySignals: ['judgment_decision', 'thought_structure'],
    secondarySignals: ['analytical_depth', 'problem_understanding'],
    variants: [
      {
        variantId: 'investment_recommendation_low_context',
        contextLevel: 'low',
        description:
          'Limited data requiring clear buy/hold/sell framing.',
      },
      {
        variantId: 'investment_recommendation_medium_context',
        contextLevel: 'medium',
        description:
          'Financial and competitive inputs requiring structured justification.',
      },
      {
        variantId: 'investment_recommendation_high_context',
        contextLevel: 'high',
        description:
          'Deal structure comparison — standard equity vs. preferred return mechanics.',
      },
    ],
  },
];