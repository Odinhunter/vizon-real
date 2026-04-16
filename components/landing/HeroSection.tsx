'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, scaleIn } from '@/lib/motion/variants';
import MockResultsCard from './MockResultsCard';
import MockFrameworkCard from './MockFrameworkCard';
import MockTrajectoryCard from './MockTrajectoryCard';

export default function HeroSection() {
  const { data: session } = useSession();
  const ctaHref = session
    ? '/diagnostic'
    : '/signup?callbackUrl=/diagnostic';

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

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-6 lg:px-12 pt-24 md:pt-28 pb-10 md:pb-24 text-center flex flex-col items-center"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-extrabold leading-[1.05] tracking-[-0.03em] mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 76px)' }}
        >
          <span className="text-white">Most candidates aren&apos;t ready.</span>
          <br />
          <span className="bg-gradient-to-r from-[#8db8e3] to-[#a5d0f5] bg-clip-text text-transparent">
            Are you one of them?
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-[15px] md:text-[17px] text-white/55 leading-relaxed max-w-2xl mb-8 md:mb-12"
        >
          AI is raising the bar. Firms are getting pickier. And most candidates walking into MBB interviews have prep — not proof. Vizon gives you a 40-minute diagnostic across 5 skills and 3 real cases. One score. No flattery.
        </motion.p>

        {/* CTA area */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-5 mb-0 md:mb-14"
        >
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href={ctaHref}
              className="inline-block bg-white text-[#051c2c] text-[15px] font-bold rounded-full px-10 py-4 hover:shadow-lg hover:shadow-white/20 transition-all"
            >
              Find out where you stand →
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating 3-card showcase */}
        <motion.div
          variants={scaleIn}
          className="hidden lg:grid grid-cols-3 gap-6 items-stretch w-full"
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
        </motion.div>
      </motion.div>
    </section>
  );
}
