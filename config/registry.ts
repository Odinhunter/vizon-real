/**
 * Central track registry — single source of truth for track→{probes, engineTrack, cases}.
 *
 * Adding a new track requires one new entry here.
 * API routes and engine consumers import from this file only.
 */

import type { Probe } from './probes/types';
import type { CareerTrackConfig } from '@/engine/selectNextProbe';
import type { CaseMetadata } from './cases/types';

import { consultingProbes } from './probes/consultingProbes';
import { financeProbes } from './probes/financeProbes';
import { analyticsProbes } from './probes/analyticsProbes';

import { consultingEngineTrack } from './engineTracks/consulting';
import { financeEngineTrack } from './engineTracks/finance';
import { analyticsEngineTrack } from './engineTracks/analytics';

import { consultingCases, financeCases, analyticsCases } from './cases';

export interface TrackRegistryEntry {
  trackId: string;
  probes: Probe[];
  engineTrack: CareerTrackConfig;
  cases: CaseMetadata[];
}

export const trackRegistry: Record<string, TrackRegistryEntry> = {
  consulting: {
    trackId: 'consulting',
    probes: consultingProbes,
    engineTrack: consultingEngineTrack,
    cases: consultingCases,
  },
  finance: {
    trackId: 'finance',
    probes: financeProbes,
    engineTrack: financeEngineTrack,
    cases: financeCases,
  },
  analytics: {
    trackId: 'analytics',
    probes: analyticsProbes,
    engineTrack: analyticsEngineTrack,
    cases: analyticsCases,
  },
};

export function getTrackEntry(trackId: string): TrackRegistryEntry | undefined {
  return trackRegistry[trackId];
}

export const supportedTrackIds: string[] = Object.keys(trackRegistry);
