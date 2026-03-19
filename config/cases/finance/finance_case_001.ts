import { CaseMetadata } from '../types';

/**
 * Level 1 finance case: PE investment evaluation of a premium coffee chain expansion.
 * Tests unit economics reasoning, ROIC calculation, and investment judgment.
 * This is metadata only — financial data lives in case content layer.
 */
export const financeCase001: CaseMetadata = {
  caseId: 'finance_case_001',
  trackId: 'finance',
  title: 'BrewCo Café Chain Investment',
  description:
    'Private equity investment evaluation of a premium coffee chain expanding from 50 to 120 stores across Southeast Asia, requiring unit economics analysis, ROIC calculation, and risk assessment.',
  scenarioType: 'investment_evaluation',
  tags: [
    'private-equity',
    'unit-economics',
    'store-expansion',
    'coffee-chain',
    'southeast-asia',
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