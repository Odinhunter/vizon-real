import { CaseMetadata } from '../types';

/**
 * Level 2 finance case: PE acquisition evaluation of a German EV manufacturer.
 * Tests valuation mechanics, EBITDA growth modeling, MoM/ROIC calculation, and downside sensitivity.
 */
export const financeCase002: CaseMetadata = {
  caseId: 'finance_case_002',
  trackId: 'finance',
  title: 'AutoNova AG Investment Evaluation',
  description:
    'Private equity acquisition evaluation of a mid-sized German EV manufacturer, requiring entry/exit valuation, EBITDA growth projection, MoM calculation, and downside scenario analysis.',
  scenarioType: 'investment_evaluation',
  tags: [
    'private-equity',
    'valuation',
    'ev-manufacturer',
    'lbo-lite',
    'germany',
  ],
  probeSlotIds: [
    'ps_financial_signal_interpretation',
    'ps_investment_thesis_formation',
    'ps_capital_allocation_judgment',
    'ps_risk_sensitivity_reasoning',
    'ps_investment_recommendation_clarity',
  ],
  level: 2,
};