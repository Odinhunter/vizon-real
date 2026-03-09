import { CaseMetadata } from '../types';

export const financeCase003: CaseMetadata = {
  caseId: 'finance_case_003',
  trackId: 'finance',
  title: 'Contested Acquisition of a SaaS Platform by a PE Sponsor',
  description:
    'A PE sponsor evaluates a contested acquisition of a high-growth SaaS platform with mixed unit economics and divergent valuation signals.',
  scenarioType: 'investment_analysis',
  tags: ['early-diagnostic', 'M&A', 'SaaS'],
  probeSlotIds: [
    'ps_financial_signal_interpretation',
    'ps_investment_thesis_formation',
    'ps_capital_allocation_judgment',
    'ps_risk_sensitivity_reasoning',
    'ps_investment_recommendation_clarity',
  ],
  level: 3,
};