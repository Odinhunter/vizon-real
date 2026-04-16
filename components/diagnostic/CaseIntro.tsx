'use client';

import { motion } from 'framer-motion';
import type { CaseContent } from '@/content/types';
import { fadeUp, staggerContainer } from '@/lib/motion/variants';

interface CaseIntroProps {
  content: CaseContent;
  caseNumber: 1 | 2 | 3;
  onBegin: () => void;
}

const LEVEL_LABELS: Record<1 | 2 | 3, string> = {
  1: 'BASELINE',
  2: 'ESCALATION',
  3: 'PRESSURE',
};

export default function CaseIntro({ content, caseNumber, onBegin }: CaseIntroProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto w-full px-5 py-8 flex flex-col gap-6"
      >
        {/* Case header */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <span className="inline-block px-2.5 py-1 border border-neutral-200 text-neutral-500 text-[10px] font-mono tracking-widest uppercase">
            Case {caseNumber} of 3
          </span>
          <span className="inline-block px-2.5 py-1 bg-[#0A0A0A] text-white text-[10px] font-mono tracking-widest uppercase">
            {LEVEL_LABELS[caseNumber]}
          </span>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp}>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">
            {content.company}
          </p>
          <h1 className="font-mono text-2xl font-normal text-neutral-900 leading-snug">
            {content.title}
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1.5 tracking-wide">
            Role: {content.role}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="border-t border-neutral-100" />

        {/* Narrative */}
        <motion.div variants={fadeUp}>
          <h2 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
            Context
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">{content.narrative}</p>
        </motion.div>

        {/* Situation */}
        <motion.div variants={fadeUp}>
          <h2 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
            Situation
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">{content.situation}</p>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="border-t border-neutral-100" />

        {/* Problem statement */}
        <motion.div variants={fadeUp} className="bg-neutral-900 text-white p-5 border-l-4 border-[#1A56DB]">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
            Your task
          </div>
          <p className="text-sm leading-relaxed font-mono">{content.problemStatement}</p>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="pb-6">
          <button
            onClick={onBegin}
            className="w-full py-4 bg-[#0A0A0A] text-white font-mono text-sm tracking-wider uppercase hover:bg-[#1F1F1F] active:bg-[#000] transition-colors duration-150"
          >
            Begin Case →
          </button>
          <p className="text-[10px] font-mono text-neutral-500 text-center mt-3 tracking-wide">
            5 questions · no time limit
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
