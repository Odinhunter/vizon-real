'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SectionLabel from './SectionLabel';
import { trackCards } from '@/content/index';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const trackDescriptions: Record<string, string> = {
  consulting:
    'MBB and Tier 1 strategy firms. Tests structured thinking, problem decomposition, and clarity under ambiguity.',
  finance:
    'Investment banking, PE, and asset management. Tests quantitative reasoning and decision-making under pressure.',
  analytics:
    'Product, strategy, and growth analytics. Tests data interpretation, statistical reasoning, and insight synthesis.',
};

const trackStatus: Record<string, { label: string; open: boolean }> = {
  consulting: { label: 'Open now', open: true },
  finance: { label: 'Upcoming', open: false },
  analytics: { label: 'Upcoming', open: false },
};

const trackAccent: Record<string, { bar: string; bg: string; text: string }> = {
  consulting: { bar: '#1A56DB', bg: 'bg-[#e8f0fe]', text: 'text-[#1A56DB]' },
  finance: { bar: '#051c2c', bg: 'bg-[#f0f1f3]', text: 'text-[#051c2c]' },
  analytics: { bar: '#e8521a', bg: 'bg-[#fff3ee]', text: 'text-[#e8521a]' },
};

export default function TracksSection() {
  const router = useRouter();
  const ref1 = useScrollReveal(0);
  const ref2 = useScrollReveal(0.12);
  const ref3 = useScrollReveal(0.24);
  const refs = [ref1, ref2, ref3];

  return (
    <section id="tracks" className="bg-[#dce8f8] py-16 px-6 lg:px-12 scroll-mt-[64px]">
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionLabel label="AVAILABLE TRACKS" />

        <h2 className="font-extrabold text-[#051c2c] leading-[1.1] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
          Choose your career track.
        </h2>
        <p className="text-[16px] text-[#6b7a87] leading-relaxed mb-12 max-w-xl">
          Each track tests the specific capabilities that define performance in that career.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trackCards.map((card, i) => {
            const status = trackStatus[card.trackId];
            const accent = trackAccent[card.trackId];

            return (
              <div
                key={card.trackId}
                ref={refs[i]}
                className={`reveal bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl overflow-hidden transition-all duration-300 shadow-md shadow-black/[0.05] ${
                  status.open ? 'hover:bg-white/80 hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-0.5 cursor-pointer' : 'opacity-70'
                }`}
                onClick={status.open ? () => router.push(`/diagnostic?track=${card.trackId}`) : undefined}
              >
                {/* Top accent bar */}
                <div className="h-1.5" style={{ backgroundColor: accent.bar }} />

                <div className="p-8">
                  <div className="flex items-start justify-between mb-5">
                    <h3 className="text-[22px] font-bold text-[#051c2c] leading-tight">
                      {card.displayName}
                    </h3>
                    <span
                      className={`shrink-0 ml-3 inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full ${
                        status.open
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-[#f7f8fa] text-[#8896a4]'
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-[14px] text-[#6b7a87] leading-relaxed mb-6">
                    {trackDescriptions[card.trackId]}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-block ${accent.bg} ${accent.text} rounded-full px-3 py-1.5 text-[11px] font-semibold`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {status.open ? (
                    <Link
                      href={`/diagnostic?track=${card.trackId}`}
                      className="inline-flex items-center gap-2 bg-[#1A56DB] text-white text-[13px] font-semibold rounded-full px-6 py-3 hover:bg-[#1548b8] transition-colors"
                    >
                      Start diagnostic
                      <span className="text-white/60">→</span>
                    </Link>
                  ) : (
                    <span className="inline-block text-[13px] font-medium text-[#b8c4ce]">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
