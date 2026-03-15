'use client';

import SectionLabel from './SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    num: '01',
    title: 'Pick your battlefield.',
    description:
      'Consulting, Finance, or Data Analytics. Each track is calibrated against what firms in that space actually test for — not generic case prep.',
    accent: 'bg-[#e8f0fe] text-[#1A56DB]',
  },
  {
    num: '02',
    title: 'Work through real cases.',
    description:
      'Three progressively harder problems. No multiple choice. No hints. Just you, the problem, and how you think under pressure.',
    accent: 'bg-[#fff3ee] text-[#e8521a]',
  },
  {
    num: '03',
    title: 'Get the truth about your readiness.',
    description:
      'Scores across 5 skills, benchmarked against real hiring thresholds. A capability map, not a score card. And a clear read on where to focus.',
    accent: 'bg-[#ecfdf5] text-[#059669]',
  },
];

export default function HowItWorksSection() {
  const ref1 = useScrollReveal(0);
  const ref2 = useScrollReveal(0.12);
  const ref3 = useScrollReveal(0.24);
  const refs = [ref1, ref2, ref3];

  return (
    <section id="how-it-works" className="bg-[#dce8f8] py-10 md:py-16 px-5 md:px-6 lg:px-12 scroll-mt-[64px]">
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionLabel label="HOW IT WORKS" />

        <h2 className="font-extrabold text-[#051c2c] leading-[1.1] tracking-[-0.02em] mb-3 md:mb-4" style={{ fontSize: 'clamp(24px, 3.5vw, 44px)' }}>
          Forty minutes. Real answers.
        </h2>
        <p className="text-[15px] md:text-[16px] text-[#6b7a87] leading-relaxed mb-8 md:mb-12 max-w-xl">
          No personality quiz. No self-reported scores. A structured test that surfaces exactly how you think — and exactly where you break.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={refs[i]}
              className="reveal bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-md shadow-black/[0.05] hover:bg-white/80 hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${step.accent} text-[14px] md:text-[16px] font-bold flex items-center justify-center mb-4 md:mb-6`}>
                {step.num}
              </div>
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#051c2c] mb-2 md:mb-3">
                {step.title}
              </h3>
              <p className="text-[14px] text-[#6b7a87] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
