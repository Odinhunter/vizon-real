import { CaseMetadata } from '../types';

/**
 * Level 1 analytics case focused on product activation analysis.
 * Tests single-metric interpretation and basic decomposition without
 * requiring cross-dataset synthesis or causal reasoning.
 */
export const analyticsCase001: CaseMetadata = {
  caseId: 'analytics_case_001',
  trackId: 'analytics',
  title: 'Declining Day-7 Activation on a Consumer Mobile App',
  description:
    'A consumer mobile app sees a 16-point drop in Day-7 activation rate over two months. The candidate must interpret engagement funnel data, decompose the problem, and form a directional diagnosis without a full data pull.',
  scenarioType: 'product_analytics',
  tags: ['activation', 'funnel-analysis', 'mobile', 'early-diagnostic'],
  probeSlotIds: [
    'ps_data_interpretation',
    'ps_problem_decomposition',
    'ps_statistical_reasoning',
    'ps_insight_synthesis',
    'ps_analytical_communication',
  ],
  level: 1,
};
