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
  result?: DiagnosticResultData;
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
