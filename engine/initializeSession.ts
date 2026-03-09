/**
 * Session initialization logic.
 * 
 * Responsible for creating a new diagnostic session in a valid starting state.
 * Does NOT select skills, questions, or implement any flow logic.
 */

import { DiagnosticSession, DiagnosticStatus } from './diagnosticSession';
import { randomUUID } from 'crypto';

/**
 * Creates and initializes a new diagnostic session.
 * 
 * Returns a session in IN_PROGRESS state with all collections empty.
 * The session is ready to begin the diagnostic flow, but does not yet have
 * a current question or skill assigned.
 * 
 * The branching engine is responsible for determining the first question
 * based on the career track configuration.
 * 
 * @param careerTrackId - The career track identifier (e.g., 'consulting', 'finance')
 * @returns A new DiagnosticSession in its initial state
 */
export function initializeDiagnosticSession(
  careerTrackId: string,
  initialCaseId: string
): DiagnosticSession {
  const now = new Date();

  return {
    sessionId: randomUUID(),
    careerTrackId,
    currentCaseId: initialCaseId,
    caseStage: 1,
    caseHistory: [initialCaseId],
    currentSkillId: null, // No skill selected yet - branching engine decides
    currentQuestionId: null, // No question selected yet - branching engine decides
    answeredQuestions: [], // Empty - user hasn't answered anything
    observedSignals: [], // Empty - no signals collected yet
    pendingResponses: [], // Empty - no probe responses buffered yet
    aiExtractedEvidence: [], // Empty - no AI evidence extracted yet
    skillEvidence: {}, // Empty - no probe scores yet
    behavioralEvidence: {
      framing_quality: [],
      reasoning_confidence: [],
      communication_clarity: [],
    },
    status: DiagnosticStatus.IN_PROGRESS,
    createdAt: now,
    updatedAt: now,
  };
}
