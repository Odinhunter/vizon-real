import { CaseMetadata } from '../types';

/**
 * Level 1 finance case focused on public market investment reasoning.
 * Tests security-level evaluation without requiring technical modeling.
 * This is metadata only — financial data lives in case content layer.
 */
export const financeCase001: CaseMetadata = {
  caseId: 'finance_case_001',
  trackId: 'finance',
  title: 'Initiating Coverage on Lumina Fitness Technologies',
  description:
    'Public equity-style investment evaluation of a connected fitness company transitioning from pandemic-driven growth to normalized demand, requiring assessment of earnings quality, valuation, and balance sheet risk.',
  scenarioType: 'security_investment_analysis',
  tags: [
    'equity-research',
    'valuation',
    'earnings-quality',
    'subscription-transition',
    'balance-sheet-risk',
  ],
  probeSlotIds: [
    'ps_financial_signal_interpretation',
    'ps_investment_thesis_formation',
    'ps_capital_allocation_judgment',
    'ps_risk_sensitivity_reasoning',
    'ps_investment_recommendation_clarity',
  ],
  level: 1,
};