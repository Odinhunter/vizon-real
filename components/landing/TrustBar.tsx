'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

const universities = ['Harvard', 'Wharton', 'Stanford', 'LSE', 'INSEAD', 'Columbia', 'MIT'];

export default function TrustBar() {
  const ref = useScrollReveal();

  return (
    <section className="bg-[#0a1628] py-8">
      <div ref={ref} className="reveal w-full px-6 lg:px-12 text-center">
        <p className="text-[13px] text-white/50 mb-6 font-medium">
          Students from these institutions use Vizon
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {universities.map((name) => (
            <span
              key={name}
              className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 text-[14px] font-semibold tracking-[0.04em] text-white/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
