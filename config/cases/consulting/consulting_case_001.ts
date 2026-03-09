import { CaseMetadata } from '../types';

export const consultingCase001: CaseMetadata = {
  caseId: 'consulting_case_001',
  trackId: 'consulting',
  title: 'Profit Decline at a Regional Gym Chain',
  description:
    'FitLife, a 20-location gym chain, has seen profits fall 18% over 6 months despite stable prices. Diagnose the root cause and recommend a priority action.',
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
