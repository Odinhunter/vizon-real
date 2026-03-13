'use client';

import SectionLabel from './SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    num: '01',
    title: 'Choose Your Track',
    description:
      'Consulting, Finance, or Data Analytics. Each track tests the specific capabilities that define performance in that career.',
    accent: 'bg-[#e8f0fe] text-[#1A56DB]',
  },
  {
    num: '02',
    title: 'Solve Real Cases',
    description:
      'Problems that surface how you think — not what you know. Progressive difficulty. Real ambiguity. No multiple choice.',
    accent: 'bg-[#fff3ee] text-[#e8521a]',
  },
  {
    num: '03',
    title: 'Get Your Signal',
    description:
      'A full capability map — scores, benchmarks, behavioral signals, and priority recommendations. Not a pass/fail. A diagnostic.',
    accent: 'bg-[#ecfdf5] text-[#059669]',
  },
];

export default function HowItWorksSection() {
  const ref1 = useScrollReveal(0);
  const ref2 = useScrollReveal(0.12);
  const ref3 = useScrollReveal(0.24);
  const refs = [ref1, ref2, ref3];

  return (
    <section id="how-it-works" className="bg-[#dce8f8] py-16 px-6 lg:px-12 scroll-mt-[64px]">
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionLabel label="HOW IT WORKS" />

        <h2 className="font-extrabold text-[#051c2c] leading-[1.1] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
          Three steps to clarity.
        </h2>
        <p className="text-[16px] text-[#6b7a87] leading-relaxed mb-12 max-w-xl">
          No guesswork. No fluff. A structured diagnostic that tells you exactly where you stand.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={refs[i]}
              className="reveal bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-8 shadow-md shadow-black/[0.05] hover:bg-white/80 hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${step.accent} text-[16px] font-bold flex items-center justify-center mb-6`}>
                {step.num}
              </div>
              <h3 className="text-[20px] font-bold text-[#051c2c] mb-3">
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
