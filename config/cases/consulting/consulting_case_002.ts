import { CaseMetadata } from '../types';

export const consultingCase002: CaseMetadata = {
  caseId: 'consulting_case_002',
  trackId: 'consulting',
  title: 'FastDrop Delivery Delays',
  description:
    'FastDrop is a same-day grocery delivery company operating in 7 major US cities. Over the past 4 months, delivery delays have increased significantly and repeat order rates have declined. Diagnose the operational issue and recommend a priority action.',
  scenarioType: 'business_performance',
  tags: ['operations', 'delivery', 'capacity-planning', 'logistics'],
  probeSlotIds: [
    'ps_problem_structuring',
    'ps_hypothesis_driven_thinking',
    'ps_analytical_thinking',
    'ps_client_communication',
    'ps_decision_recommendation',
  ],
  level: 2,
};
