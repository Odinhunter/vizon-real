/**
 * Question display component.
 * Renders a single question with its options.
 * Placeholder UI only.
 */

import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="border border-gray-300 rounded p-6">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      
      <div className="space-y-2">
        {question.options?.map(option => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className="block w-full text-left p-3 border border-gray-200 rounded hover:bg-gray-50"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
