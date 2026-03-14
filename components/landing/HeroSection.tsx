'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import MockResultsCard from './MockResultsCard';
import MockFrameworkCard from './MockFrameworkCard';
import MockTrajectoryCard from './MockTrajectoryCard';

export default function HeroSection() {
  const { data: session } = useSession();
  const ctaHref = session
    ? '/diagnostic?track=consulting'
    : '/signup?callbackUrl=/diagnostic?track=consulting';

  return (
    <section className="relative overflow-hidden">
      {/* Main hero gradient */}
      <div
        className="absolute inset-0 gradient-animate"
        style={{
          background: 'linear-gradient(180deg, #051c2c 0%, #0a3157 35%, #1A56DB 65%, #6b9be8 88%, #b8d0ee 96%, #dce8f8 100%)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-28 pb-24 text-center flex flex-col items-center">
        {/* Headline */}
        <h1
          className="font-extrabold leading-[1.05] tracking-[-0.03em] mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 76px)', animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}
        >
          <span className="text-white">Most candidates aren&apos;t ready.</span>
          <br />
          <span className="bg-gradient-to-r from-[#8db8e3] to-[#a5d0f5] bg-clip-text text-transparent">
            Are you actually one of them?
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[17px] text-white/55 leading-relaxed max-w-2xl mb-12"
          style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both' }}
        >
          AI is raising the bar. Firms are getting pickier. And most candidates walking into MBB interviews have prep — not proof. Vizon gives you a 40-minute diagnostic across 5 skills and 3 real cases. One score. No flattery.
        </p>

        {/* CTA area */}
        <div
          className="flex flex-col sm:flex-row items-center gap-5 mb-14"
          style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}
        >
          <Link
            href={ctaHref}
            className="bg-white text-[#051c2c] text-[15px] font-bold rounded-full px-10 py-4 hover:shadow-lg hover:shadow-white/20 transition-all"
          >
            Find out where you stand →
          </Link>
        </div>

        {/* Floating 3-card showcase */}
        <div
          className="hidden lg:grid grid-cols-3 gap-6 items-stretch w-full"
          style={{ animation: 'scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}
        >
          <div className="float h-full" style={{ animationDelay: '0.3s' }}>
            <MockFrameworkCard />
          </div>
          <div className="float h-full" style={{ animationDelay: '0s' }}>
            <MockResultsCard />
          </div>
          <div className="float h-full" style={{ animationDelay: '0.6s' }}>
            <MockTrajectoryCard />
          </div>
        </div>
      </div>
    </section>
  );
}
