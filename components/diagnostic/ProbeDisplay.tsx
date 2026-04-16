'use client';

import { useState } from 'react';
import type { ProbeStep } from '@/lib/api/diagnosticClient';
import type { CaseContent, ProbeVariantContent } from '@/content/types';
import AnswerInput from './AnswerInput';
import ExhibitDisplay from './ExhibitDisplay';

interface ProbeDisplayProps {
  step: ProbeStep;
  caseContent: CaseContent;
  probeContent: ProbeVariantContent | null;
  caseNumber: 1 | 2 | 3;
  probeNumber: number;
  totalProbes: number;
  /** Provided by the server — true when submitting this probe will complete the session. */
  isLastProbe: boolean;
  answer: string;
  onAnswerChange: (value: string) => void;
  selectedOptionId: string | undefined;
  onSelectOption: (id: string) => void;
  selectedOptionIds: string[];
  onToggleOptionId: (id: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const MIN_ANSWER_LENGTH = 30;

const SKILL_LABELS: Record<string, string> = {
  problem_structuring: 'PROBLEM STRUCTURING',
  hypothesis_driven_thinking: 'HYPOTHESIS FORMATION',
  analytical_thinking: 'ANALYTICAL THINKING',
  client_communication: 'CLIENT COMMUNICATION',
  decision_recommendation: 'DECISION & RECOMMENDATION',
};

const LEVEL_LABELS: Record<string, string> = {
  low: 'BASELINE',
  medium: 'ESCALATION',
  high: 'PRESSURE',
};

const TOTAL_CASES = 3;

export default function ProbeDisplay({
  step,
  caseContent,
  probeContent,
  caseNumber,
  probeNumber,
  totalProbes,
  isLastProbe,
  answer,
  onAnswerChange,
  selectedOptionId,
  onSelectOption,
  selectedOptionIds,
  onToggleOptionId,
  onSubmit,
  isSubmitting,
}: ProbeDisplayProps) {
  const [contextOpen, setContextOpen] = useState(false);
  const [rightTab, setRightTab] = useState<'exhibit' | 'context'>('exhibit');

  const format = step.format ?? 'free_text';
  const options = step.options ?? [];

  const hasOptionSelection =
    format === 'mcq_plus_reasoning'
      ? !!selectedOptionId
      : format === 'multi_select_plus_reasoning'
        ? selectedOptionIds.length > 0
        : true;

  const canSubmit = answer.trim().length >= MIN_ANSWER_LENGTH && hasOptionSelection && !isSubmitting;

  const question =
    probeContent?.question ??
    `Respond to probe: ${step.skillId.replace(/_/g, ' ')} (${step.contextLevel} context)`;
  const instruction =
    probeContent?.instruction ?? 'Explain your reasoning clearly and in detail.';

  const completedProbes = (caseNumber - 1) * totalProbes + (probeNumber - 1);
  const totalSessionProbes = TOTAL_CASES * totalProbes;
  const progressPct = Math.round((completedProbes / totalSessionProbes) * 100);

  const trackName = 'CONSULTING TRACK';

  const hasExhibit = !!step.exhibit;

  const buttonLabel = isLastProbe
    ? 'Finish Diagnostic'
    : probeNumber === totalProbes
      ? 'Next Case'
      : 'Submit & Continue';

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Dark nav bar */}
      <nav className="bg-[#0A0A0A] border-b border-[#1F1F1F] px-4 md:px-6 py-3 flex items-center gap-4 md:gap-6 shrink-0">
        {/* Left: brand + track */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white text-xs font-mono font-semibold tracking-widest uppercase">VIZON</span>
          <span className="text-[#404040] text-xs hidden md:inline">|</span>
          <span className="text-neutral-500 text-xs font-mono tracking-wider uppercase hidden md:inline">{trackName}</span>
        </div>
        {/* Mobile compact progress */}
        <div className="flex-1 flex items-center justify-end gap-3 md:hidden">
          <span className="text-[#737373] text-xs font-mono tracking-wide">
            Q{probeNumber}/{totalProbes}
          </span>
          <span className="text-neutral-500 text-xs font-mono tracking-wider">
            C{caseNumber}/3
          </span>
        </div>
        {/* Center: progress (desktop) */}
        <div className="flex-1 hidden md:flex items-center gap-4">
          <span className="text-[#737373] text-xs font-mono tracking-wide whitespace-nowrap">
            QUESTION {probeNumber} OF {totalProbes}
          </span>
          <div className="flex-1 h-px bg-[#262626] relative">
            <div
              className="absolute inset-y-0 left-0 bg-[#1A56DB] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[#737373] text-xs font-mono tracking-wide whitespace-nowrap">
            {progressPct}% COMPLETE
          </span>
        </div>
        {/* Right: case stage (desktop) */}
        <div className="shrink-0 hidden md:block">
          <span className="text-neutral-500 text-xs font-mono tracking-wider uppercase">
            CASE {caseNumber} OF 3
          </span>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left question panel */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 md:py-8">
          {/* Skill tag + level badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest">
              Q{probeNumber}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase">
              {SKILL_LABELS[step.skillId] ?? step.skillId.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-mono tracking-wider border border-neutral-200 text-neutral-500 uppercase">
              {LEVEL_LABELS[step.contextLevel] ?? step.contextLevel.toUpperCase()}
            </span>
          </div>

          {/* Question */}
          <h2 className="font-mono text-[1.15rem] font-normal text-neutral-900 leading-relaxed mb-6">
            {question}
          </h2>

          {/* Mobile: collapsible case context */}
          <div className="md:hidden mb-5">
            <button
              onClick={() => setContextOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-neutral-200 bg-[#FAFAFA] font-mono text-[10px] tracking-widest text-neutral-500 uppercase"
            >
              <span>Case Context</span>
              <span>{contextOpen ? '−' : '+'}</span>
            </button>
            {contextOpen && (
              <div className="border border-t-0 border-neutral-200 px-4 py-4 bg-white space-y-4">
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Your Role</p>
                  <p className="text-xs font-mono text-neutral-700 leading-relaxed">{caseContent.role}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Situation</p>
                  <p className="text-xs font-mono text-neutral-600 leading-relaxed">{caseContent.situation}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Engagement Question</p>
                  <p className="text-xs font-mono text-neutral-800 font-semibold leading-relaxed">{caseContent.problemStatement}</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile inline exhibit */}
          {hasExhibit && (
            <div className="md:hidden mb-6 border border-neutral-200 bg-[#FAFAFA]">
              <ExhibitDisplay exhibit={step.exhibit!} mode="panel" />
            </div>
          )}

          {/* Instruction box */}
          <div className="flex gap-2.5 p-4 border border-[#BFDBFE] bg-[#EEF4FF] mb-5">
            <span className="text-[#2563EB] text-sm shrink-0 font-mono mt-0.5">→</span>
            <p className="text-sm text-[#1E40AF] leading-relaxed font-mono">{instruction}</p>
          </div>

          {/* MCQ options */}
          {format === 'mcq_plus_reasoning' && options.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                Select one
              </p>
              <div className="space-y-2">
                {options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOption(opt.id)}
                      disabled={isSubmitting}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 border transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isSelected
                          ? 'border-[#0A0A0A] bg-[#0A0A0A]'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                    >
                      <span
                        className={`w-5 h-5 shrink-0 flex items-center justify-center border text-[10px] font-mono
                          ${isSelected
                            ? 'border-transparent bg-white text-[#0A0A0A]'
                            : 'border-neutral-300 text-neutral-500'
                          }`}
                      >
                        {opt.id}
                      </span>
                      <span className={`font-mono text-sm leading-relaxed ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Multi-select options */}
          {format === 'multi_select_plus_reasoning' && options.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                {probeContent?.maxSelections
                  ? `Select ${probeContent.maxSelections} · ${selectedOptionIds.length}/${probeContent.maxSelections} chosen`
                  : 'Select all that apply'}
              </p>
              <div className="space-y-2">
                {options.map((opt) => {
                  const isSelected = selectedOptionIds.includes(opt.id);
                  const maxReached =
                    !!probeContent?.maxSelections &&
                    selectedOptionIds.length >= probeContent.maxSelections;
                  const isDisabled = isSubmitting || (!isSelected && maxReached);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (isDisabled) return;
                        onToggleOptionId(opt.id);
                      }}
                      disabled={isDisabled}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 border transition-colors duration-100
                        ${isSelected
                          ? 'border-[#0A0A0A] bg-[#0A0A0A]'
                          : isDisabled
                            ? 'border-neutral-100 bg-neutral-50 cursor-not-allowed'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                    >
                      <span
                        className={`w-5 h-5 shrink-0 flex items-center justify-center border text-[10px] font-mono
                          ${isSelected
                            ? 'border-transparent bg-white text-[#0A0A0A]'
                            : isDisabled
                              ? 'border-neutral-200 text-neutral-300'
                              : 'border-neutral-300 text-neutral-500'
                          }`}
                      >
                        {opt.id}
                      </span>
                      <span
                        className={`font-mono text-sm leading-relaxed ${
                          isSelected ? 'text-white' : isDisabled ? 'text-neutral-400' : 'text-neutral-800'
                        }`}
                      >
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reasoning label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
              {format === 'free_text' ? 'Your response' : 'Walk through your reasoning'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              {answer.length} / 280
            </span>
          </div>

          {/* Answer input */}
          <AnswerInput
            value={answer}
            onChange={onAnswerChange}
            disabled={isSubmitting}
            minLength={MIN_ANSWER_LENGTH}
          />

          {/* Submit */}
          <div className="pb-8 mt-5">
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="w-full py-4 bg-[#0A0A0A] text-white font-mono text-sm tracking-wider uppercase hover:bg-[#1F1F1F] active:bg-[#000] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>{buttonLabel} →</>
              )}
            </button>
            {!canSubmit && !isSubmitting && answer.trim().length > 0 && (
              <p className="text-[10px] font-mono text-neutral-500 text-center mt-2 tracking-wide">
                Add more detail before submitting.
              </p>
            )}
          </div>
        </div>

        {/* Right panel — always visible on desktop */}
        <div className="hidden md:flex md:w-[440px] md:shrink-0 border-l border-neutral-100 bg-[#FAFAFA] flex-col overflow-hidden">
          {/* Tab pills — only shown when exhibit present */}
          {hasExhibit && (
            <div className="px-4 pt-4 pb-0 shrink-0">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setRightTab('exhibit')}
                  className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors border
                    ${rightTab === 'exhibit'
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
                    }`}
                >
                  Case Exhibit
                </button>
                <button
                  onClick={() => setRightTab('context')}
                  className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors border
                    ${rightTab === 'context'
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
                    }`}
                >
                  Case Context
                </button>
              </div>
            </div>
          )}

          {/* Exhibit tab */}
          {hasExhibit && rightTab === 'exhibit' && (
            <div className="flex-1 overflow-y-auto mt-4">
              <ExhibitDisplay exhibit={step.exhibit!} mode="panel" />
            </div>
          )}

          {/* Context tab (or full panel when no exhibit) */}
          {(!hasExhibit || rightTab === 'context') && (
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Case Briefing</span>
                <span className="px-2 py-0.5 text-[10px] font-mono border border-neutral-200 text-neutral-500 uppercase tracking-wider">
                  Case {caseNumber} of 3
                </span>
              </div>
              <h3 className="font-mono text-base font-semibold text-neutral-900 mb-1">{caseContent.title}</h3>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Your Role</p>
                  <p className="text-xs font-mono text-neutral-700 leading-relaxed">{caseContent.role}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Background</p>
                  <p className="text-xs font-mono text-neutral-600 leading-relaxed">{caseContent.narrative}</p>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-0.5 bg-[#003A70] rounded-full shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Situation</p>
                    <p className="text-xs font-mono text-neutral-700 leading-relaxed">{caseContent.situation}</p>
                  </div>
                </div>
                <div className="pt-1 border-t border-neutral-100">
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">Engagement Question</p>
                  <p className="text-sm font-mono text-neutral-900 font-semibold leading-relaxed">{caseContent.problemStatement}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
