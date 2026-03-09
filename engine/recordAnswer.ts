/**
 * Answer recording logic.
 * 
 * Responsible for capturing user responses and updating session state.
 * Does NOT score answers, judge correctness, or determine the next question.
 * 
 * This function only:
 * - Records what the user selected
 * - Accumulates behavioral signals
 * - Updates session metadata
 * 
 * Branching, scoring, and interpretation happen elsewhere.
 */

import {
  DiagnosticSession,
  AnsweredQuestion,
  SkillSignals,
  SkillId,
} from './diagnosticSession';

/**
 * Input for recording a user's answer to a question.
 */
export interface RecordAnswerInput {
  /**
   * The question that was answered.
   */
  questionId: string;

  /**
   * The primary skill this question assessed.
   * Used to organize signal accumulation.
   */
  skillId: SkillId;

  /**
   * The option the user selected.
   */
  selectedOptionId: string;

  /**
   * Optional free-text reasoning provided by the user.
   * Not used for scoring - captured for context and AI explanations.
   */
  reasoningText?: string;

  /**
   * Behavioral signals observed from this answer.
   * 
   * These are extracted from the question configuration based on which option was chosen.
   * They represent raw observations, not scores or judgments.
   * 
   * Example: { 'data_driven_approach': 1, 'considers_stakeholders': 2 }
   */
  observedSignals?: Record<string, number>;
}

/**
 * Records a user's answer and updates the diagnostic session.
 * 
 * This function is purely an evidence logger. It does NOT:
 * - Judge whether the answer is "correct" or "good"
 * - Calculate scores or proficiency levels
 * - Aggregate or interpret signals
 * - Determine the next question (that's the branching engine's job)
 * 
 * It only:
 * - Appends the answer to the session history
 * - Stores raw signal observations exactly as provided
 * - Clears the current question (signaling readiness for next question)
 * 
 * Signal aggregation and interpretation are deferred to the scoring engine.
 * The session remains IN_PROGRESS. The branching engine will decide whether
 * to present another question or mark the session COMPLETE.
 * 
 * @param session - The current diagnostic session (not mutated)
 * @param input - The answer details and observed signals
 * @returns A new DiagnosticSession with the answer recorded
 */
export function recordAnswer(
  session: DiagnosticSession,
  input: RecordAnswerInput
): DiagnosticSession {
  const now = new Date();

  // Create the answered question record
  const answeredQuestion: AnsweredQuestion = {
    questionId: input.questionId,
    selectedOptionId: input.selectedOptionId,
    reasoningText: input.reasoningText,
    answeredAt: now,
  };

  // Store raw signals if provided
  // Do NOT aggregate or merge - just append as-is
  // The scoring engine will handle aggregation later
  const updatedSignals = input.observedSignals
    ? [
        ...session.observedSignals,
        {
          skillId: input.skillId,
          observations: input.observedSignals,
          questionCount: 1, // This represents one question's signals
        },
      ]
    : session.observedSignals;

  // Return new session with answer recorded
  // Note: We do NOT mutate the original session
  return {
    ...session,
    answeredQuestions: [...session.answeredQuestions, answeredQuestion],
    observedSignals: updatedSignals,
    currentQuestionId: null, // Clear current question - ready for next
    updatedAt: now,
  };
}
