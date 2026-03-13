import { CaseMetadata } from '../types';

export const consultingCase001: CaseMetadata = {
  caseId: 'consulting_case_001',
  trackId: 'consulting',
  title: 'FitLife Gym Profit Decline',
  description:
    'FitLife is a regional gym chain with 20 locations across India. Over the past 6 months, overall company profits have fallen by 18% despite stable membership prices. Diagnose the root cause and recommend a priority action.',
  scenarioType: 'business_performance',
  tags: ['profit-decline', 'unit-economics', 'consumer', 'gym'],
  probeSlotIds: [
    'ps_problem_structuring',
    'ps_hypothesis_driven_thinking',
    'ps_analytical_thinking',
    'ps_client_communication',
    'ps_decision_recommendation',
  ],
  level: 1,
};
