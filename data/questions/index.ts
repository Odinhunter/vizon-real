/**
 * Question definitions - data only, no logic.
 * Questions are structured data consumed by the diagnostic engine.
 * Do not include scoring or branching logic here.
 */

import { Question } from '@/lib/types';

export const questions: Question[] = [
  // Placeholder question structure - do not implement real questions yet
  {
    id: 'placeholder-question-1',
    text: 'This is a placeholder question',
    type: 'single-choice',
    options: [
      {
        id: 'option-1',
        text: 'Placeholder option A',
        skillWeights: {
          'placeholder-skill-1': 1.0,
        },
      },
      {
        id: 'option-2',
        text: 'Placeholder option B',
        skillWeights: {
          'placeholder-skill-2': 1.0,
        },
      },
    ],
    skillsAssessed: ['placeholder-skill-1', 'placeholder-skill-2'],
  },
];

export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getAllQuestions(): Question[] {
  return questions;
}
