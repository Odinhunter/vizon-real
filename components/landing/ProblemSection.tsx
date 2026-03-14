'use client';

import SectionLabel from './SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const painPoints = [
  {
    num: '01',
    headline: "You've done the prep.",
    subline: 'Frameworks. Mock cases. YouTube videos. But none of it told you your actual score.',
  },
  {
    num: '02',
    headline: 'You feel confident.',
    subline: "Confidence built on repetition is the most dangerous kind. It doesn't transfer.",
  },
  {
    num: '03',
    headline: 'AI is changing what firms want.',
    subline: "The bar isn't analysis anymore. It's judgment, speed, and mental clarity under fire.",
  },
  {
    num: '04',
    headline: "You're about to find out the hard way.",
    subline: 'Or you could find out now, while there\'s still time to act on it.',
  },
];

export default function ProblemSection() {
  const sectionRef = useScrollReveal();
  const card1Ref = useScrollReveal(0.1);
  const card2Ref = useScrollReveal(0.2);
  const card3Ref = useScrollReveal(0.3);
  const card4Ref = useScrollReveal(0.4);
  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref];

  return (
    <section className="pt-24 pb-16 px-6 lg:px-12 bg-[#dce8f8]">
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionLabel label="THE PROBLEM" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — main copy in blue card */}
          <div ref={sectionRef} className="reveal bg-[#1A56DB] backdrop-blur-xl rounded-3xl p-10 lg:p-12 flex flex-col justify-center shadow-xl shadow-[#1A56DB]/30 border border-white/10">
            <h2 className="font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              You&apos;ve been preparing.
            </h2>
            <p className="font-light text-white/60 leading-[1.1] tracking-[-0.01em] mb-8" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              But preparation isn&apos;t proof.
            </p>
            <p className="text-[15px] text-white/70 leading-relaxed mb-4">
              The consulting bar isn&apos;t what it was. AI handles the grunt work now. Firms want people who can{' '}
              <span className="font-semibold text-white">really think</span> — under pressure, with ambiguity, at speed.
            </p>
            <p className="text-[15px] text-white/70 leading-relaxed">
              Most candidates never find out if they can until they&apos;re already in the room.{' '}
              <span className="font-semibold text-white">
                Vizon is the test you should have taken before that.
              </span>
            </p>
          </div>

          {/* Right — pain point cards */}
          <div className="flex flex-col gap-4">
            {painPoints.map((point, i) => (
              <div
                key={point.num}
                ref={cardRefs[i]}
                className="reveal bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg shadow-black/[0.04] rounded-2xl p-7 flex gap-5 hover:bg-white/90 hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-0.5 transition-all"
              >
                <span className="text-[28px] font-extrabold text-[#e8521a]/60 tabular-nums shrink-0 leading-none">
                  {point.num}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-[#051c2c] mb-1.5">
                    {point.headline}
                  </p>
                  <p className="text-[14px] text-[#6b7a87] leading-relaxed">{point.subline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
