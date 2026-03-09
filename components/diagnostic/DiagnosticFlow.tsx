/**
 * Main diagnostic flow component.
 * Orchestrates question display and answer collection.
 * Placeholder UI only - no styling or real interactions yet.
 */

'use client';

import { useState } from 'react';
import { DiagnosticState } from '@/lib/types';
import { createInitialState } from '@/engine/state';

export default function DiagnosticFlow() {
  const [state, setState] = useState<DiagnosticState>(createInitialState());

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Diagnostic Flow</h1>
      <p className="text-gray-600">Placeholder for diagnostic UI</p>
      
      <div className="mt-8">
        <p className="text-sm">State: {state.isComplete ? 'Complete' : 'In Progress'}</p>
        <p className="text-sm">Answered: {state.answeredQuestions.size}</p>
      </div>
    </div>
  );
}
