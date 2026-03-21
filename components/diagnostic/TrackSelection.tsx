'use client';

import { useRouter } from 'next/navigation';
import { trackCards } from '@/content/index';

const NAVY = '#051c2c';

const trackMeta: Record<
  string,
  {
    accent: string;
    accentLight: string;
    gradient: string;
    icon: React.ReactNode;
    caseCount: string;
    time: string;
    level: string;
    open: boolean;
  }
> = {
  consulting: {
    accent: '#1A56DB',
    accentLight: '#EBF0FE',
    gradient: 'from-blue-600 to-indigo-700',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    caseCount: '3 Cases',
    time: '25–35 min',
    level: 'Progressive',
    open: true,
  },
  finance: {
    accent: '#059669',
    accentLight: '#ECFDF5',
    gradient: 'from-emerald-600 to-teal-700',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    caseCount: '2 Cases',
    time: '20–30 min',
    level: 'Progressive',
    open: true,
  },
  analytics: {
    accent: '#e8521a',
    accentLight: '#FFF4ED',
    gradient: 'from-orange-500 to-red-600',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9" />
        <path d="M21 3v6h-6" />
        <path d="M21 9c-1.5-2.5-4-5-9-5" />
        <line x1="3" y1="21" x2="9" y2="15" />
      </svg>
    ),
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
    <div className="min-h-screen bg-[#dce8f8]">
      {/* Hero header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto w-full px-6 md:px-12 pt-16 pb-14 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-[10px] font-mono tracking-[0.18em] uppercase text-[#3a5068] mb-6">
            VIZON DIAGNOSTIC
          </span>

          <h1
            className="font-sans font-bold leading-[1.08] tracking-[-0.03em] mb-5 mx-auto"
            style={{ fontSize: 'clamp(34px, 5vw, 54px)', color: NAVY, maxWidth: '640px' }}
          >
            Choose your track
          </h1>
          <p className="text-[16px] text-[#3a4f63] leading-relaxed max-w-lg mx-auto font-medium">
            Each track is built around the skills that matter most for that career path.
            Pick the one that matches where you&apos;re headed.
          </p>
        </div>
      </div>

      {/* Track cards grid */}
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trackCards.map((card) => {
            const meta = trackMeta[card.trackId];
            if (!meta) return null;

            return (
              <button
                key={card.trackId}
                disabled={!meta.open}
                onClick={() => router.push(`/diagnostic?track=${card.trackId}`)}
                className={`group relative flex flex-col text-left rounded-2xl overflow-hidden transition-all duration-300 bg-white/60 backdrop-blur-xl border border-white/70 shadow-lg shadow-blue-900/[0.06] ${
                  meta.open
                    ? 'hover:shadow-2xl hover:shadow-blue-900/[0.12] hover:-translate-y-1.5 hover:bg-white/80 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Colored header band */}
                <div
                  className={`relative px-6 pt-7 pb-6 bg-gradient-to-br ${meta.gradient} text-white`}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-3 right-3 w-32 h-32 rounded-full border border-white/30" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border border-white/20" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {meta.icon}
                      </div>
                      {meta.open ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-white/20 backdrop-blur-sm text-white">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold rounded-full bg-white/15 backdrop-blur-sm text-white/70">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-[21px] font-bold leading-tight tracking-[-0.01em]">
                      {card.displayName}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col px-6 pt-5 pb-6">
                  <p className="text-[14px] text-[#3a4f63] leading-[1.65] mb-5">
                    {trackDescriptions[card.trackId]}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-2 mb-5">
                    {[meta.caseCount, meta.time, meta.level].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-semibold backdrop-blur-sm"
                        style={{ backgroundColor: `${meta.accent}12`, color: meta.accent }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {card.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block rounded-full px-2.5 py-1 text-[11px] font-medium text-[#3a4f63] bg-[#f0f3f7]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    {meta.open ? (
                      <span
                        className="inline-flex items-center gap-2 text-[14px] font-bold transition-all duration-200 group-hover:gap-3"
                        style={{ color: meta.accent }}
                      >
                        Start diagnostic
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[14px] font-bold text-[#9ca3af]">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] font-mono text-[#5a7088] text-center mt-10 tracking-wide">
          No preparation required &middot; Results are AI-powered and delivered instantly
        </p>
      </div>
    </div>
  );
}
