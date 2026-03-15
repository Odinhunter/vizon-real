'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SectionLabel from './SectionLabel';
import { trackCards } from '@/content/index';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const trackDescriptions: Record<string, string> = {
  consulting:
    'The MBB bar is high and getting higher. This track tests structured thinking, problem decomposition, and performance under ambiguity across three progressively harder cases.',
  finance:
    'IB and PE don\'t reward effort. They reward judgment. This track tests quantitative reasoning, thesis formation, and decision-making under real pressure.',
  analytics:
    'Product and growth teams want people who can turn noise into insight. This track tests data interpretation, statistical reasoning, and communication of findings.',
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
    <section id="tracks" className="bg-[#dce8f8] py-10 md:py-16 px-5 md:px-6 lg:px-12 scroll-mt-[64px]">
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionLabel label="AVAILABLE TRACKS" />

        <h2 className="font-extrabold text-[#051c2c] leading-[1.1] tracking-[-0.02em] mb-3 md:mb-4" style={{ fontSize: 'clamp(24px, 3.5vw, 44px)' }}>
          Your career. Your diagnostic.
        </h2>
        <p className="text-[15px] md:text-[16px] text-[#6b7a87] leading-relaxed mb-8 md:mb-12 max-w-xl">
          Every track is built around the real skills that separate hires from rejections — not what&apos;s on your CV, but what&apos;s in your head when it matters.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
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

                <div className="p-6 md:p-8">
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
                      Join the waitlist — launching Q2
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
