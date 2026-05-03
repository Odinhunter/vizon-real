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
  totalCases: number;
  probesPerCase: number;
  probes: Probe[];
  engineTrack: CareerTrackConfig;
  cases: CaseMetadata[];
}

export const trackRegistry: Record<string, TrackRegistryEntry> = {
  consulting: {
    trackId: 'consulting',
    totalCases: 3,
    probesPerCase: 5,
    probes: consultingProbes,
    engineTrack: consultingEngineTrack,
    cases: consultingCases,
  },
  finance: {
    trackId: 'finance',
    totalCases: 3,
    probesPerCase: 5,
    probes: financeProbes,
    engineTrack: financeEngineTrack,
    cases: financeCases,
  },
  analytics: {
    trackId: 'analytics',
    totalCases: 3,
    probesPerCase: 5,
    probes: analyticsProbes,
    engineTrack: analyticsEngineTrack,
    cases: analyticsCases,
  },
};

export function getTrackEntry(trackId: string): TrackRegistryEntry | undefined {
  return trackRegistry[trackId];
}

export interface TrackShape {
  totalCases: number;
  probesPerCase: number;
  totalProbes: number;
}

/**
 * Returns the session shape (case count × probes per case) for a track.
 * Exposed separately so client components can receive just the shape via
 * server-side prop pass-through, without bundling the full registry.
 */
export function getTrackShape(trackId: string): TrackShape | undefined {
  const entry = trackRegistry[trackId];
  if (!entry) return undefined;
  return {
    totalCases: entry.totalCases,
    probesPerCase: entry.probesPerCase,
    totalProbes: entry.totalCases * entry.probesPerCase,
  };
}

export const supportedTrackIds: string[] = Object.keys(trackRegistry);
