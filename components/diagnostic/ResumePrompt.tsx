'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion/variants';
import type { InProgressSessionInfo } from '@/lib/api/diagnosticClient';

interface ResumePromptProps {
  session: InProgressSessionInfo;
  totalCases: number;
  probesPerCase: number;
  onContinue: () => void;
  onStartFresh: () => void;
  isContinuing: boolean;
  isStartingFresh: boolean;
}

const NAVY = '#051c2c';
const CARD = 'rounded-2xl shadow-md shadow-black/[0.05] border border-white/70 bg-white';

function formatStartedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const CASE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Case 1 — Baseline',
  2: 'Case 2 — Escalation',
  3: 'Case 3 — Pressure',
};

export default function ResumePrompt({
  session,
  totalCases,
  probesPerCase,
  onContinue,
  onStartFresh,
  isContinuing,
  isStartingFresh,
}: ResumePromptProps) {
  const totalProbes = totalCases * probesPerCase;
  const probesAnswered = (session.caseStage - 1) * probesPerCase + session.probeNumber - 1;
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
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-[9px] font-mono tracking-[0.15em] uppercase text-amber-600">
              SESSION IN PROGRESS
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-sans font-bold leading-[1.1] tracking-[-0.02em] mb-3"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: NAVY }}
          >
            You have an unfinished diagnostic
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[14px] text-[#4a5568] leading-relaxed max-w-2xl">
            Pick up exactly where you left off — your progress has been saved.
          </motion.p>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-4xl mx-auto w-full px-5 md:px-10 py-8">
        {/* Progress card */}
        <motion.div variants={fadeUp} className={`${CARD} p-6 mb-6`}>
          <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
            SAVED PROGRESS
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="border-l-2 border-[#1A56DB] pl-4">
              <div className="font-mono text-lg font-medium tabular-nums mb-1" style={{ color: NAVY }}>
                {CASE_LABELS[session.caseStage]}
              </div>
              <div className="text-[9px] font-mono text-[#5a6775] tracking-[0.15em] uppercase">
                Current Case
              </div>
            </div>
            <div className="border-l-2 border-[#0e9f6e] pl-4">
              <div className="font-mono text-lg font-medium tabular-nums mb-1" style={{ color: NAVY }}>
                Probe {session.probeNumber} of {probesPerCase}
              </div>
              <div className="text-[9px] font-mono text-[#5a6775] tracking-[0.15em] uppercase">
                Current Probe
              </div>
            </div>
            <div className="border-l-2 border-[#8b5cf6] pl-4">
              <div className="font-mono text-sm font-medium mb-1" style={{ color: NAVY }}>
                {formatStartedAt(session.startedAt)}
              </div>
              <div className="text-[9px] font-mono text-[#5a6775] tracking-[0.15em] uppercase">
                Started At
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-mono text-[#5a6775] uppercase tracking-[0.15em]">
                Overall Progress
              </span>
              <span className="text-[9px] font-mono text-[#5a6775]">
                {probesAnswered} / {totalProbes} probes answered
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#e2e6ea] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1A56DB] transition-all"
                style={{
                  width: `${(probesAnswered / totalProbes) * 100}%`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Action cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Continue */}
          <div className={`${CARD} p-6 flex flex-col`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] shrink-0 bg-blue-50 text-[#1A56DB]">
                ▶
              </div>
              <h3 className="font-sans font-semibold text-[15px]" style={{ color: NAVY }}>
                Continue where I left off
              </h3>
            </div>
            <p className="text-[12px] text-[#5a6775] leading-relaxed flex-1 mb-5">
              Resume your session and complete the remaining probes. Your answers so far are preserved.
            </p>
            <button
              onClick={onContinue}
              disabled={isContinuing || isStartingFresh}
              className="w-full py-3 rounded-xl text-white font-mono text-sm tracking-wider uppercase hover:opacity-90 disabled:opacity-40 transition-opacity"
              style={{ background: `linear-gradient(135deg, #1A56DB, ${NAVY})` }}
            >
              {isContinuing ? 'Resuming…' : 'Continue →'}
            </button>
          </div>

          {/* Start fresh */}
          <div className={`${CARD} p-6 flex flex-col`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] shrink-0 bg-[#f7f8fa] text-[#5a6775]">
                ↺
              </div>
              <h3 className="font-sans font-semibold text-[15px]" style={{ color: NAVY }}>
                Start a fresh session
              </h3>
            </div>
            <p className="text-[12px] text-[#5a6775] leading-relaxed flex-1 mb-5">
              Discard the saved session and begin again from the start. Your previous answers will be lost.
            </p>
            <button
              onClick={onStartFresh}
              disabled={isContinuing || isStartingFresh}
              className="w-full py-3 rounded-xl font-mono text-sm tracking-wider uppercase border border-[#e2e6ea] text-[#4a5568] hover:bg-[#f7f8fa] disabled:opacity-40 transition-colors"
            >
              {isStartingFresh ? 'Starting…' : 'Start Fresh'}
            </button>
          </div>
        </motion.div>

        <p className="text-[10px] font-mono text-[#5a6775] text-center tracking-wide">
          Sessions are saved automatically — you can always return to finish later.
        </p>
      </div>
    </motion.div>
  );
}
