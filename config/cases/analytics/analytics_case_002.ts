import { CaseMetadata } from '../types';

/**
 * Level 2 analytics case focused on conflicting revenue signals.
 * Tests cross-metric synthesis and statistical validity assessment
 * under competing interpretations.
 */
export const analyticsCase002: CaseMetadata = {
  caseId: 'analytics_case_002',
  trackId: 'analytics',
  title: 'Mixed Revenue Signals at a B2B SaaS Product',
  description:
    'A B2B SaaS product shows strong new ARR growth but declining net revenue retention. The candidate must reconcile conflicting revenue metrics, assess which signals are leading indicators, and form a defensible view on business health.',
  scenarioType: 'saas_analytics',
  tags: ['revenue-analysis', 'nrr', 'arr', 'b2b', 'conflicting-signals'],
  probeSlotIds: [
    'ps_data_interpretation',
    'ps_problem_decomposition',
    'ps_statistical_reasoning',
    'ps_insight_synthesis',
    'ps_analytical_communication',
  ],
  level: 2,
};
