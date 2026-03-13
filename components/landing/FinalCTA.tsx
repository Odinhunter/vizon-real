'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function FinalCTA() {
  const ref = useScrollReveal();

  return (
    <section
      className="relative overflow-hidden gradient-animate"
      style={{
        background: 'linear-gradient(135deg, #051c2c 0%, #0a3d62 40%, #1A56DB 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-white/[0.04]" />
      <div className="absolute bottom-[-150px] left-[-80px] w-[600px] h-[600px] rounded-full bg-white/[0.03]" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#1A56DB]/25 blur-3xl" />

      <div ref={ref} className="reveal relative z-10 w-full max-w-[900px] mx-auto px-6 lg:px-12 py-20">
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-12 lg:p-16 text-center">
        <h2
          className="font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-4"
          style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
        >
          Find out now.
        </h2>
        <p
          className="font-light text-[#8db8e3] leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
        >
          Not in the room.
        </p>
        <p className="text-[16px] text-white/45 leading-relaxed max-w-lg mx-auto mb-12">
          The worst time to discover a gap is mid-interview. Get an objective read on your
          capabilities before you&apos;re sitting across from someone who&apos;s evaluating them.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/diagnostic?track=consulting"
            className="bg-white text-[#051c2c] text-[15px] font-bold rounded-full px-10 py-4 hover:shadow-lg hover:shadow-white/20 transition-all"
          >
            Run your diagnostic
          </Link>
          <a
            href="#tracks"
            className="border border-white/20 text-white/80 text-[14px] font-medium rounded-full px-8 py-4 hover:bg-white/10 hover:text-white transition-all"
          >
            View all tracks
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
