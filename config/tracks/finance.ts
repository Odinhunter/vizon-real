/**
 * Finance Track Configuration
 *
 * Defines skill ordering and evidence sufficiency logic.
 * Mirrors consulting structure but finance-specific.
 */

export const financeTrack = {
  trackId: 'finance',
  skills: [
    {
      skillId: 'problem_structuring',
      minimumEvidence: 1,
    },
    {
      skillId: 'hypothesis_driven_thinking',
      minimumEvidence: 1,
    },
    {
      skillId: 'analytical_thinking',
      minimumEvidence: 1,
    },
    {
      skillId: 'client_communication',
      minimumEvidence: 1,
    },
    {
      skillId: 'decision_recommendation',
      minimumEvidence: 1,
    },
  ],
};