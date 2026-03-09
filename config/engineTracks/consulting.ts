import type { CareerTrackConfig } from '@/engine/selectNextProbe';

export const consultingEngineTrack: CareerTrackConfig = {
  trackId: 'consulting',
  name: 'Consulting',
  skills: [
    {
      skillId: 'problem_structuring',
      minProbes: 1,
      weight: 1.0, // foundational — tests basic diagnostic framing
    },
    {
      skillId: 'hypothesis_driven_thinking',
      minProbes: 1,
      weight: 1.2, // differentiating — separates structured from reactive thinkers
    },
    {
      skillId: 'analytical_thinking',
      minProbes: 1,
      weight: 1.3, // core — primary consulting capability
    },
    {
      skillId: 'client_communication',
      minProbes: 1,
      weight: 0.9, // important but secondary to analytical rigor at this stage
    },
    {
      skillId: 'decision_recommendation',
      minProbes: 1,
      weight: 1.1, // key output — tests ability to commit under uncertainty
    },
  ],
};
