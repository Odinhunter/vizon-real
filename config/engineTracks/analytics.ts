import type { CareerTrackConfig } from '@/engine/selectNextProbe';

export const analyticsEngineTrack: CareerTrackConfig = {
  trackId: 'analytics',
  name: 'Data Analytics',
  skills: [
    {
      skillId: 'data_interpretation',
      minProbes: 1,
      weight: 1.3, // foundational — pattern reading underlies all analytics work
    },
    {
      skillId: 'problem_decomposition',
      minProbes: 1,
      weight: 1.1, // structural — scoping analytical questions correctly
    },
    {
      skillId: 'statistical_reasoning',
      minProbes: 1,
      weight: 1.2, // differentiating — separates rigorous from intuitive analysts
    },
    {
      skillId: 'insight_synthesis',
      minProbes: 1,
      weight: 1.1, // core — translating data into actionable meaning
    },
    {
      skillId: 'analytical_communication',
      minProbes: 1,
      weight: 0.9, // important but secondary to analytical substance at this stage
    },
  ],
};
