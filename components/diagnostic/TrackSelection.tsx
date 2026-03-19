'use client';

import { useRouter } from 'next/navigation';
import { trackCards } from '@/content/index';

const NAVY = '#051c2c';
const CARD = 'rounded-2xl shadow-md shadow-black/[0.05] border border-white/70 bg-white';

const trackMeta: Record<
  string,
  {
    accent: string;
    icon: string;
    caseCount: string;
    time: string;
    level: string;
    open: boolean;
  }
> = {
  consulting: {
    accent: '#1A56DB',
    icon: '◇',
    caseCount: '3 Cases',
    time: '25–35 min',
    level: 'Progressive',
    open: true,
  },
  finance: {
    accent: '#051c2c',
    icon: '△',
    caseCount: '2 Cases',
    time: '20–30 min',
    level: 'Progressive',
    open: true,
  },
  analytics: {
    accent: '#e8521a',
    icon: '◎',
    caseCount: '3 Cases',
    time: '25–35 min',
    level: 'Progressive',
    open: false,
  },
};

const trackDescriptions: Record<string, string> = {
  consulting:
    'Structure problems, form hypotheses, and make clear recommendations across three progressively harder business cases.',
  finance:
    'Evaluate unit economics, calculate returns, assess risk, and make an investment recommendation on a real PE deal.',
  analytics:
    'Interpret data, apply statistical reasoning, and communicate findings across three analytical scenarios.',
};

export default function TrackSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e6ea]">
        <div className="max-w-3xl mx-auto w-full px-5 md:px-10 pt-10 pb-8">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-2.5 py-1 rounded-full bg-[#f7f8fa] text-[9px] font-mono tracking-[0.15em] uppercase text-[#5a6775]">
              VIZON DIAGNOSTIC
            </span>
          </div>

          <h1
            className="font-sans font-bold leading-[1.1] tracking-[-0.02em] mb-3"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: NAVY }}
          >
            Choose your track
          </h1>
          <p className="text-[14px] text-[#4a5568] leading-relaxed max-w-2xl">
            Each track is built around the skills that matter most for that career path.
            Pick the one that matches where you&apos;re headed.
          </p>
        </div>
      </div>

      {/* Track cards */}
      <div className="max-w-3xl mx-auto w-full px-5 md:px-10 py-8">
        <div className="space-y-4">
          {trackCards.map((card) => {
            const meta = trackMeta[card.trackId];
            if (!meta) return null;

            return (
              <button
                key={card.trackId}
                disabled={!meta.open}
                onClick={() => router.push(`/diagnostic?track=${card.trackId}`)}
                className={`${CARD} w-full text-left overflow-hidden transition-all duration-200 ${
                  meta.open
                    ? 'hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-0.5 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Accent bar */}
                <div className="h-1" style={{ backgroundColor: meta.accent }} />

                <div className="p-6 md:p-7">
                  {/* Title row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] shrink-0"
                        style={{
                          backgroundColor: `${meta.accent}10`,
                          color: meta.accent,
                        }}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <h3
                          className="text-[18px] md:text-[20px] font-bold leading-tight"
                          style={{ color: NAVY }}
                        >
                          {card.displayName}
                        </h3>
                      </div>
                    </div>

                    {meta.open ? (
                      <span className="shrink-0 ml-3 inline-flex items-center px-3 py-1 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-600">
                        Open
                      </span>
                    ) : (
                      <span className="shrink-0 ml-3 inline-flex items-center px-3 py-1 text-[10px] font-semibold rounded-full bg-[#f7f8fa] text-[#8896a4]">
                        Coming soon
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[13px] text-[#5a6775] leading-relaxed mb-5 ml-12">
                    {trackDescriptions[card.trackId]}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 ml-12">
                    {[
                      { label: meta.caseCount },
                      { label: meta.time },
                      { label: meta.level },
                    ].map((stat) => (
                      <span
                        key={stat.label}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#f7f8fa] text-[11px] font-mono text-[#5a6775]"
                      >
                        {stat.label}
                      </span>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mt-4 ml-12">
                    {card.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${meta.accent}08`,
                          color: meta.accent,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CTA hint */}
                  {meta.open && (
                    <div className="mt-5 ml-12">
                      <span
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                        style={{ color: meta.accent }}
                      >
                        Start diagnostic
                        <span className="opacity-50">&#8594;</span>
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] font-mono text-[#5a6775] text-center mt-6 tracking-wide">
          No preparation required. Results are AI-powered and delivered instantly.
        </p>
      </div>
    </div>
  );
}
