'use client';

import { motion } from 'framer-motion';
import type { TrackIntroContent } from '@/content/types';
import { fadeUp, staggerContainer } from '@/lib/motion/variants';

interface DiagnosticIntroProps {
  intro: TrackIntroContent;
  onStart: () => void;
  isStarting: boolean;
}

const NAVY = '#051c2c';
const CARD = 'rounded-2xl shadow-md shadow-black/[0.05] border border-white/70 bg-white';

const SKILLS = [
  { label: 'Structuring', icon: '◇', color: '#1A56DB' },
  { label: 'Hypothesis Thinking', icon: '◎', color: '#0e9f6e' },
  { label: 'Analytical Thinking', icon: '△', color: '#8b5cf6' },
  { label: 'Communication', icon: '▣', color: '#f59e0b' },
  { label: 'Recommendations', icon: '▸', color: '#ef4444' },
];

export default function DiagnosticIntro({
  intro,
  onStart,
  isStarting,
}: DiagnosticIntroProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#f7f8fa]"
    >
      {/* Hero header */}
      <div className="bg-white border-b border-[#e2e6ea]">
        <div className="max-w-4xl mx-auto w-full px-5 md:px-10 pt-10 pb-8">
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-5">
            <span className="px-2.5 py-1 rounded-full bg-[#f7f8fa] text-[9px] font-mono tracking-[0.15em] uppercase text-[#5a6775]">
              VIZON DIAGNOSTIC
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[9px] font-mono tracking-[0.15em] uppercase text-[#1A56DB]">
              {intro.displayName}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-sans font-bold leading-[1.1] tracking-[-0.02em] mb-3"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: NAVY }}
          >
            {intro.tagline}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[14px] text-[#4a5568] leading-relaxed max-w-2xl">
            {intro.description}
          </motion.p>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-4xl mx-auto w-full px-5 md:px-10 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { value: intro.timeEstimate, label: 'Time Estimate', accent: '#1A56DB' },
            { value: '15', label: 'Total Probes', accent: '#0e9f6e' },
            { value: '3', label: 'Business Cases', accent: '#8b5cf6' },
            { value: '5', label: 'Skills Assessed', accent: '#f59e0b' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${CARD} px-4 md:px-5 py-4`}
              style={{ borderLeft: `3px solid ${stat.accent}` }}
            >
              <div className="font-mono text-lg md:text-xl font-medium tabular-nums mb-1" style={{ color: NAVY }}>
                {stat.value}
              </div>
              <div className="text-[9px] font-mono text-[#5a6775] tracking-[0.15em] uppercase leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* How it works */}
          <div className={`${CARD} p-6`}>
            <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
              HOW IT WORKS
            </p>
            <ol className="space-y-4">
              {intro.howItWorks.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-medium text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: NAVY }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-[#4a5568] leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Skills assessed */}
          <div className={`${CARD} p-6`}>
            <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
              SKILLS ASSESSED
            </p>
            <div className="space-y-3">
              {SKILLS.map((skill) => (
                <div key={skill.label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] shrink-0"
                    style={{ backgroundColor: `${skill.color}12`, color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-[13px] font-medium" style={{ color: NAVY }}>{skill.label}</span>
                  </div>
                  <div className="h-1.5 w-16 md:w-24 bg-[#e2e6ea] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: '100%', backgroundColor: skill.color, opacity: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What to expect */}
        <div className={`${CARD} p-6 mb-6`}>
          <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-4">
            WHAT TO EXPECT
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Progressive Difficulty',
                desc: 'Three cases that escalate in complexity, revealing how you perform under pressure.',
                accent: '#1A56DB',
              },
              {
                title: 'Real Business Scenarios',
                desc: 'Realistic consulting situations with data exhibits — not abstract puzzles or trick questions.',
                accent: '#0e9f6e',
              },
              {
                title: 'AI-Powered Analysis',
                desc: 'Your responses are assessed for signal strength, analytical depth, and communication quality.',
                accent: '#8b5cf6',
              },
            ].map((item) => (
              <div key={item.title} className="border-t-2 pt-3" style={{ borderColor: item.accent }}>
                <p className="text-[13px] font-medium mb-1" style={{ color: NAVY }}>{item.title}</p>
                <p className="text-[12px] text-[#5a6775] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          disabled={isStarting}
          className="w-full py-4 rounded-xl text-white font-mono text-sm tracking-wider uppercase hover:opacity-90 active:opacity-100 disabled:opacity-40 transition-opacity duration-150"
          style={{ background: `linear-gradient(135deg, #1A56DB, ${NAVY})` }}
        >
          {isStarting ? 'Starting…' : 'Start Diagnostic →'}
        </button>

        <p className="text-[10px] font-mono text-[#5a6775] text-center mt-4 tracking-wide">
          No preparation required. Write freely. Results in ~30 minutes.
        </p>
      </div>
    </motion.div>
  );
}
