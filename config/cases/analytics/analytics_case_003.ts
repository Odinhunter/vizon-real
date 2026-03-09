import { CaseMetadata } from '../types';

/**
 * Level 3 analytics case focused on demand signal conflict in a marketplace.
 * Tests causal inference, cross-side demand analysis, and executive-level
 * synthesis under high ambiguity.
 */
export const analyticsCase003: CaseMetadata = {
  caseId: 'analytics_case_003',
  trackId: 'analytics',
  title: 'Conflicting Demand Signals at a Two-Sided Marketplace',
  description:
    'A two-sided marketplace shows growing supply-side engagement but stagnating demand-side conversion. The candidate must reason across sides, identify whether signals indicate structural imbalance or measurement artifacts, and communicate a prioritized diagnosis to a skeptical executive audience.',
  scenarioType: 'marketplace_analytics',
  tags: [
    'marketplace',
    'two-sided',
    'demand-supply-balance',
    'causal-inference',
    'executive-communication',
  ],
  probeSlotIds: [
    'ps_data_interpretation',
    'ps_problem_decomposition',
    'ps_statistical_reasoning',
    'ps_insight_synthesis',
    'ps_analytical_communication',
  ],
  level: 3,
};
