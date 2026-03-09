'use client';

import type { DiagnosticResultData } from '@/lib/api/diagnosticClient';

interface DiagnosticResultsProps {
  result: DiagnosticResultData;
  trackId: string;
  onRestart: () => void;
}

function formatSkillLabel(skillId: string): string {
  return skillId
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .toUpperCase();
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const pct = Math.round(score);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-mono font-medium text-neutral-900 tabular-nums">{pct}</span>
      </div>
      <div className="h-1 w-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full bg-[#1A56DB] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DiagnosticResults({
  result,
  trackId,
  onRestart,
}: DiagnosticResultsProps) {
  const { trackScore, skillScores, behavioralScores, coverage } = result;
  const trackPct = Math.round(trackScore);

  const tier =
    trackPct >= 80
      ? 'STRONG'
      : trackPct >= 60
        ? 'DEVELOPING'
        : 'EARLY STAGE';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="h-12 bg-[#0A0A0A] flex items-center px-6 shrink-0">
        <span className="text-white text-xs font-mono tracking-widest">VIZON</span>
        <span className="text-[#404040] text-xs mx-2">|</span>
        <span className="text-[#A3A3A3] text-xs font-mono tracking-wider uppercase">CONSULTING TRACK</span>
      </div>

      <div className="max-w-2xl mx-auto w-full px-5 py-10 flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">
            Diagnostic Report
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            {coverage.assessed} of {coverage.total} skills assessed · 3 cases
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100" />

        {/* Overall score */}
        <div>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">
            Overall Score
          </p>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-mono text-6xl font-bold text-neutral-900 tabular-nums leading-none">
              {trackPct}
            </span>
            <span className="font-mono text-2xl font-light text-neutral-300 mb-1">/100</span>
          </div>
          <span className="inline-block px-2.5 py-1 border border-neutral-200 text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
            {tier}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100" />

        {/* Skill scores */}
        <div>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-5">
            Skill Breakdown
          </p>
          <div className="space-y-5">
            {Object.entries(skillScores).map(([skillId, score]) => (
              <ScoreBar key={skillId} label={formatSkillLabel(skillId)} score={score} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100" />

        {/* Behavioral scores */}
        <div>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-5">
            Behavioral Signals
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { key: 'framing', label: 'FRAMING' },
                { key: 'confidence', label: 'CONFIDENCE' },
                { key: 'clarity', label: 'CLARITY' },
              ] as const
            ).map(({ key, label }) => {
              const val = Math.round(behavioralScores[key]);
              return (
                <div
                  key={key}
                  className="border border-neutral-100 p-4 text-center"
                >
                  <div className="font-mono text-2xl font-bold text-neutral-900 tabular-nums">{val}</div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1 tracking-widest">{label}</div>
                  <div className="mt-2 h-1 w-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-[#1A56DB] transition-all duration-700 ease-out"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100" />

        {/* CTA */}
        <div className="pb-6 space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-[#0A0A0A] text-white font-mono text-sm tracking-wider uppercase hover:bg-[#1F1F1F] active:bg-[#000] transition-colors duration-150"
          >
            Retake Diagnostic →
          </button>
          <a
            href="/"
            className="block w-full py-4 border border-neutral-200 text-neutral-700 font-mono text-sm text-center tracking-wider uppercase hover:bg-neutral-50 active:bg-neutral-100 transition-colors duration-150"
          >
            Choose a Different Track
          </a>
        </div>
      </div>
    </div>
  );
}
