/**
 * Diagnostic engine state management.
 * Handles the current state of a diagnostic session.
 * Does not contain business logic - only state container.
 */

import { DiagnosticState } from '@/lib/types';

export function createInitialState(): DiagnosticState {
  return {
    currentQuestionId: null,
    answeredQuestions: new Map(),
    skillScores: new Map(),
    isComplete: false,
  };
}

export function updateAnswer(
  state: DiagnosticState,
  questionId: string,
  answer: string | string[]
): DiagnosticState {
  const newAnswers = new Map(state.answeredQuestions);
  newAnswers.set(questionId, answer);

  return {
    ...state,
    answeredQuestions: newAnswers,
  };
}

export function updateSkillScores(
  state: DiagnosticState,
  scores: Map<string, number>
): DiagnosticState {
  return {
    ...state,
    skillScores: new Map(scores),
  };
}

export function markComplete(state: DiagnosticState): DiagnosticState {
  return {
    ...state,
    isComplete: true,
  };
}
