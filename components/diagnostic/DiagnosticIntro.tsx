'use client';

import type { TrackIntroContent } from '@/content/types';

interface DiagnosticIntroProps {
  intro: TrackIntroContent;
  onStart: () => void;
  isStarting: boolean;
}

export default function DiagnosticIntro({
  intro,
  onStart,
  isStarting,
}: DiagnosticIntroProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-10 flex flex-col justify-center">
        {/* Track line */}
        <div className="mb-8">
          <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
            VIZON · {intro.displayName}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-mono text-3xl font-normal text-neutral-900 leading-tight mb-3">
          {intro.tagline}
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8 font-mono">
          {intro.description}
        </p>

        {/* Divider */}
        <div className="border-t border-neutral-100 mb-8" />

        {/* Key details */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-neutral-100 px-4 py-4">
            <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase tracking-widest">
              Time Estimate
            </div>
            <div className="text-sm font-mono font-medium text-neutral-900">{intro.timeEstimate}</div>
          </div>
          <div className="border border-neutral-100 px-4 py-4">
            <div className="text-[10px] font-mono text-neutral-500 mb-1 uppercase tracking-widest">
              Probes
            </div>
            <div className="text-sm font-mono font-medium text-neutral-900">15 total · 3 cases</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100 mb-8" />

        {/* How it works */}
        <div className="mb-8">
          <h2 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-5">
            How it works
          </h2>
          <ol className="space-y-4">
            {intro.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-0.5 rounded-full bg-[#1A56DB] shrink-0 mt-0.5 self-stretch" />
                <div className="flex gap-3">
                  <span className="font-mono text-xs text-neutral-500 shrink-0 mt-0.5 w-4">
                    {i + 1}
                  </span>
                  <span className="font-mono text-sm text-neutral-600 leading-relaxed">{step}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100 mb-8" />

        {/* CTA */}
        <button
          onClick={onStart}
          disabled={isStarting}
          className="w-full py-4 bg-[#0A0A0A] text-white font-mono text-sm tracking-wider uppercase hover:bg-[#1F1F1F] active:bg-[#000] disabled:opacity-40 transition-colors duration-150"
        >
          {isStarting ? 'Starting…' : 'Start Diagnostic →'}
        </button>

        <p className="text-[10px] font-mono text-neutral-500 text-center mt-4 tracking-wide">
          No preparation required. Write freely.
        </p>
      </div>
    </div>
  );
}
