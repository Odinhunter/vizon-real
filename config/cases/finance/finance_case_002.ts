import { CaseMetadata } from '../types';

export const financeCase002: CaseMetadata = {
  caseId: 'finance_case_002',
  trackId: 'finance',
  title: 'Overleveraged Balance Sheet at a Regional Retail Chain',
  description:
    'A regional retail chain faces rising debt service costs and tightening covenants while navigating a softening consumer environment.',
  scenarioType: 'credit_analysis',
  tags: ['early-diagnostic', 'leverage', 'retail'],
  probeSlotIds: [
    'ps_financial_signal_interpretation',
    'ps_investment_thesis_formation',
    'ps_capital_allocation_judgment',
    'ps_risk_sensitivity_reasoning',
    'ps_investment_recommendation_clarity',
  ],
  level: 2,
};