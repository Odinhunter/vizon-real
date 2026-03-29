/**
 * Thin client for the diagnostic API.
 *
 * This module is the only place in the UI layer that makes fetch calls
 * to /api/diagnostic. All API response shapes are typed here.
 * Components never call fetch directly.
 */

// ── Response types ─────────────────────────────────────────────────────────────

export interface ProbeStep {
  type: 'probe';
  probeId: string;
  skillId: string;
  probeType: string;
  variantId: string;
  contextLevel: 'low' | 'medium' | 'high';
  /** Interaction format — drives which answer UI to render. */
  format: import('@/content/types').ProbeFormat;
  /** Selectable options. Populated for mcq and multi_select formats; null for free_text. */
  options: import('@/content/types').ProbeOption[] | null;
  /** Data exhibit to display alongside this probe question, if any. Null means no exhibit. */
  exhibit: import('@/content/types').ProbeExhibit | null;
}

export interface SkipStep {
  type: 'skip';
  slotId: string;
}

export interface CompleteStep {
  type: 'complete';
}

export type DiagnosticStep = ProbeStep | SkipStep | CompleteStep;

// ── Legacy alias (kept for safety) ───────────────────────────────────────────
export interface DiagnosticResultData {
  trackScore: number;
  skillScores: Record<string, number>;
  behavioralScores: {
    framing: number;
    confidence: number;
    clarity: number;
  };
  coverage: {
    total: number;
    assessed: number;
  };
}

// ── Advanced analytics types ─────────────────────────────────────────────────

/** Candidate archetype — classified from skill distribution pattern */
export interface CandidateArchetype {
  id: string;            // 'structured_analyst' | 'hypothesis_driver' | etc.
  name: string;          // "The Structured Analyst"
  description: string;   // one-sentence profile summary
  topTraits: string[];   // top 2 skill labels driving this classification
  tagline: string;       // "TOP 15% STRUCTURERS"
  feedback?: string;     // AI-generated personalized coaching note based on actual responses
}

/** MBB Firm Fit — firm-specific skill weightings */
export interface FirmFit {
  firm: string;       // 'McKinsey' | 'BCG' | 'Bain'
  fitPercent: number;  // 0-100, how well candidate's profile matches firm's values
}

/** Pressure resilience composite */
export type ResiliencePattern = 'RESILIENT' | 'MODERATE_DROP' | 'DEGRADES' | 'COLLAPSES';

export interface PressureResilience {
  score: number;              // 0-100 composite resilience score
  dropFromBaseline: number;   // net point drop L1 avg → L3 avg (negative = drop)
  pattern: ResiliencePattern;
  perCaseAverage: { stage: 1 | 2 | 3; score: number }[];  // overall avg per case
  skillHeatmap: {             // skill × case matrix
    skillId: string;
    label: string;
    scores: [number, number, number]; // [L1, L2, L3] as 0-100
  }[];
}

// ── Rich report types ────────────────────────────────────────────────────────

export type VerdictTier = 'STRONG_CANDIDATE' | 'ABOVE_THRESHOLD' | 'BORDERLINE' | 'BELOW_THRESHOLD' | 'SIGNIFICANT_GAP';
export type SkillAssessment = 'ABOVE_THRESHOLD' | 'NEAR_THRESHOLD' | 'BELOW_THRESHOLD' | 'CRITICAL_GAP';
export type TrajectoryPattern = 'IMPROVING' | 'CONSISTENT' | 'DECLINING' | 'INSUFFICIENT_DATA';

export interface SkillDetail {
  skillId: string;
  label: string;
  score: number;
  benchmark: number;
  gap: number;
  weight: number;
  assessment: SkillAssessment;
  trajectory: TrajectoryPattern;
  stageScores: { stage: 1 | 2 | 3; score: number }[];
  narrative: string;
}

export interface BehavioralSignal {
  dimension: string;
  label: string;
  score: number;
  benchmark: number;
  assessment: SkillAssessment;
}

export interface Recommendation {
  priority: number;
  title: string;
  description: string;
}

/** Qualitative feedback tied to a single answer the candidate submitted */
export interface AnswerFeedback {
  sequenceNumber: number;
  skillId: string;
  skillLabel: string;
  caseStage: 1 | 2 | 3;
  questionSnippet: string;
  feedback: string;
}

/** Rolled-up performance summary for a single case (one per case stage) */
export interface CaseSummary {
  caseStage: 1 | 2 | 3;
  overallAssessment: string;
  strongestMoment: string;
  clearestGap: string;
}

export interface DiagnosticReport {
  trackScore: number;
  verdict: VerdictTier;
  benchmark: number;
  metadata: {
    trackName: string;
    questionsCount: number;
    benchmark: number;
    strongestSkill: { label: string; score: number };
    weakestSkill: { label: string; score: number };
  };
  quickStats: {
    skillsAboveBenchmark: number;
    totalSkills: number;
    trajectoryPattern: TrajectoryPattern;
    consistencyScore: number;
  };
  skills: SkillDetail[];
  behavioralSignals: BehavioralSignal[];
  recommendations: Recommendation[];
  coverage: { total: number; assessed: number };
  archetype: CandidateArchetype;
  firmFit: FirmFit[];
  pressureResilience: PressureResilience;
  percentile: number;  // estimated percentile ranking 0-99
  answerFeedback?: AnswerFeedback[];
  caseSummaries?: CaseSummary[];
}

export interface StartResponse {
  sessionId: string;
  trackId: string;
  step: DiagnosticStep;
  caseStage: 1 | 2 | 3;
  currentCaseId: string;
}

export interface AnswerResponse {
  sessionId: string;
  step: DiagnosticStep;
  caseStage: 1 | 2 | 3;
  currentCaseId: string;
  status: 'IN_PROGRESS' | 'COMPLETE';
  result?: DiagnosticReport;
}

// ── API calls ──────────────────────────────────────────────────────────────────

/**
 * Starts a new diagnostic session for the given track.
 * Returns the session ID and the first diagnostic step.
 */
export async function startSession(trackId: string): Promise<StartResponse> {
  const res = await fetch('/api/diagnostic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start', trackId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? 'Failed to start session');
  }
  return data as StartResponse;
}

export interface AnswerPayload {
  rawResponse: string;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
}

/**
 * Submits a response to the current probe and returns the next step.
 * For mcq_plus_reasoning probes, include selectedOptionId.
 * For multi_select_plus_reasoning probes, include selectedOptionIds.
 */
export async function submitAnswer(
  sessionId: string,
  payload: AnswerPayload
): Promise<AnswerResponse> {
  const res = await fetch('/api/diagnostic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'answer', sessionId, ...payload }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? 'Failed to submit answer');
  }
  return data as AnswerResponse;
}
