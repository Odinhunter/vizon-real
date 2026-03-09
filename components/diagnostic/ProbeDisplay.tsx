'use client';

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
  answer,
  onAnswerChange,
  selectedOptionId,
  onSelectOption,
  selectedOptionIds,
  onToggleOptionId,
  onSubmit,
  isSubmitting,
}: ProbeDisplayProps) {
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

  // Track name derived from caseContent or fallback
  const trackName = 'CONSULTING TRACK';

  const hasExhibit = !!step.exhibit;

  const buttonLabel = isSubmitting
    ? 'Submitting…'
    : probeNumber === totalProbes && caseNumber === 3
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
          <span className="text-[#A3A3A3] text-xs font-mono tracking-wider uppercase hidden md:inline">{trackName}</span>
        </div>
        {/* Mobile compact progress */}
        <div className="flex-1 flex items-center justify-end gap-3 md:hidden">
          <span className="text-[#737373] text-xs font-mono tracking-wide">
            Q{probeNumber}/{totalProbes}
          </span>
          <span className="text-[#A3A3A3] text-xs font-mono tracking-wider">
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
          <span className="text-[#A3A3A3] text-xs font-mono tracking-wider uppercase">
            CASE {caseNumber} OF 3
          </span>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left question panel */}
        <div
          className={`${hasExhibit ? 'flex-1' : 'max-w-2xl w-full mx-auto'} overflow-y-auto px-5 md:px-8 py-6 md:py-8`}
        >
          {/* Case context reminder */}
          <div className="mb-5 pb-5 border-b border-neutral-100 flex gap-2.5">
            <div className="w-0.5 rounded-full bg-[#1A56DB] shrink-0 mt-0.5 self-stretch" />
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-0.5">
                {caseContent.company}
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 font-mono">
                {caseContent.problemStatement}
              </p>
            </div>
          </div>

          {/* Skill tag + level badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest">
              Q{probeNumber}
            </span>
            <span className="text-neutral-300">·</span>
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
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">
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
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">
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
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
              {format === 'free_text' ? 'Your response' : 'Walk through your reasoning'}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
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
              className="w-full py-4 bg-[#0A0A0A] text-white font-mono text-sm tracking-wider uppercase hover:bg-[#1F1F1F] active:bg-[#000] disabled:opacity-25 transition-colors"
            >
              {buttonLabel} →
            </button>
            {!canSubmit && !isSubmitting && answer.trim().length > 0 && (
              <p className="text-[10px] font-mono text-neutral-400 text-center mt-2 tracking-wide">
                Add more detail before submitting.
              </p>
            )}
          </div>
        </div>

        {/* Right exhibit panel (desktop only) */}
        {hasExhibit && (
          <div className="hidden md:block md:w-[440px] md:shrink-0 border-l border-neutral-100 bg-[#FAFAFA] overflow-y-auto">
            <ExhibitDisplay exhibit={step.exhibit!} mode="panel" />
          </div>
        )}
      </div>
    </div>
  );
}
