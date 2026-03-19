import { CaseMetadata } from '../types';

/**
 * Level 3 finance case: Growth equity deal structuring for an agentic AI company.
 * Tests multi-step valuation, return analysis (MoM/IRR), downside sensitivity,
 * and deal structure comparison with preferred return mechanics.
 */
export const financeCase003: CaseMetadata = {
  caseId: 'finance_case_003',
  trackId: 'finance',
  title: 'Cognify AI Growth Equity Investment',
  description:
    'Growth equity deal evaluation of an agentic AI SaaS company, requiring ARR-based valuation, multi-step return analysis (MoM/IRR), downside scenario modeling, and deal structure comparison with preferred return mechanics.',
  scenarioType: 'investment_evaluation',
  tags: [
    'growth-equity',
    'saas',
    'agentic-ai',
    'deal-structuring',
    'arr-valuation',
  ],
  probeSlotIds: [
    'ps_financial_signal_interpretation',
    'ps_investment_thesis_formation',
    'ps_capital_allocation_judgment',
    'ps_risk_sensitivity_reasoning',
    'ps_investment_recommendation_clarity',
  ],
  level: 3,
};
