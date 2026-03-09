import type { CareerTrackConfig } from '@/engine/selectNextProbe';
import { consultingEngineTrack } from './consulting';
import { financeEngineTrack } from './finance';
import { analyticsEngineTrack } from './analytics';

export const engineTracksById: Record<string, CareerTrackConfig> = {
  consulting: consultingEngineTrack,
  finance: financeEngineTrack,
  analytics: analyticsEngineTrack,
};