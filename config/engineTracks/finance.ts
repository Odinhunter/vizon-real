import type { CareerTrackConfig } from '@/engine/selectNextProbe';

export const financeEngineTrack: CareerTrackConfig = {
  trackId: 'finance',
  name: 'Finance',
  skills: [
    {
      skillId: 'financial_signal_interpretation',
      minProbes: 1,
      weight: 1.3, // foundational — all finance work starts with reading signals correctly
    },
    {
      skillId: 'investment_thesis_formation',
      minProbes: 1,
      weight: 1.2, // core — thesis quality is the primary differentiator
    },
    {
      skillId: 'capital_allocation_judgment',
      minProbes: 1,
      weight: 1.1, // important — tests incremental return reasoning
    },
    {
      skillId: 'risk_sensitivity_reasoning',
      minProbes: 1,
      weight: 1.0, // important — downside awareness is table stakes
    },
    {
      skillId: 'investment_recommendation_clarity',
      minProbes: 1,
      weight: 1.1, // key output — buy/hold/sell must be defensible and clear
    },
  ],
};
