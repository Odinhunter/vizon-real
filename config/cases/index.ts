// Cases are organized by track for scalability.
// Each track maintains independent escalation structure.

/**
 * Case registry and selection for diagnostics.
 *
 * MVP: random selection from available cases matching track and level.
 * Can later be upgraded to seeded deterministic selection, rotation,
 * or user-history-aware matching.
 */

import { CaseMetadata } from './types';
import { consultingCase001 } from './consulting/consulting_case_001';
import { consultingCase002 } from './consulting/consulting_case_002';
import { consultingCase003 } from './consulting/consulting_case_003';
import { financeCase001 } from './finance/finance_case_001';
import { financeCase002 } from './finance/finance_case_002';
import { financeCase003 } from './finance/finance_case_003';
import { analyticsCase001 } from './analytics/analytics_case_001';
import { analyticsCase002 } from './analytics/analytics_case_002';
import { analyticsCase003 } from './analytics/analytics_case_003';

export const consultingCases: CaseMetadata[] = [
  consultingCase001,
  consultingCase002,
  consultingCase003,
];

export const financeCases: CaseMetadata[] = [
  financeCase001,
  financeCase002,
  financeCase003,
];

export const analyticsCases: CaseMetadata[] = [
  analyticsCase001,
  analyticsCase002,
  analyticsCase003,
];

// Unified lookup for cross-track case resolution.
export const allCases: CaseMetadata[] = [
  ...consultingCases,
  ...financeCases,
  ...analyticsCases,
];

// Track-based case selection enables multi-track scalability.
const casesByTrack: Record<string, CaseMetadata[]> = {
  consulting: consultingCases,
  finance: financeCases,
  analytics: analyticsCases,
};

/**
 * Selects a random case matching the given track and escalation level.
 *
 * This is MVP random selection — no deduplication, rotation, or seeding.
 */
export function getRandomCaseForLevel(
  trackId: string,
  level: 1 | 2 | 3
): CaseMetadata {
  const trackCases = casesByTrack[trackId];
  if (!trackCases) {
    throw new Error(`Unknown trackId="${trackId}"`);
  }

  const candidates = trackCases.filter((c) => c.level === level);

  if (candidates.length === 0) {
    throw new Error(
      `No cases found for trackId="${trackId}" at level=${level}`
    );
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
