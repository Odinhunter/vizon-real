/**
 * Core type definitions for the Vizon diagnostic engine.
 * These types define the structure of questions, skills, career tracks, and diagnostic state.
 */

export interface Skill {
  id: string;
  name: string;
  category: string;
  weight: number;
}

export interface CareerTrack {
  id: string;
  name: string;
  requiredSkills: string[]; // skill IDs
}

export interface Question {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'scale' | 'scenario';
  options?: QuestionOption[];
  skillsAssessed: string[]; // skill IDs
}

export interface QuestionOption {
  id: string;
  text: string;
  skillWeights: Record<string, number>; // skill ID -> weight contribution
}

export interface DiagnosticState {
  currentQuestionId: string | null;
  answeredQuestions: Map<string, string | string[]>;
  skillScores: Map<string, number>;
  isComplete: boolean;
}

export interface DiagnosticResult {
  skillScores: Record<string, number>;
  suggestedTracks: string[]; // career track IDs
  completionDate: Date;
}
