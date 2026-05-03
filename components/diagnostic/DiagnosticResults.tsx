'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type {
  DiagnosticReport,
  VerdictTier,
  SkillAssessment,
  TrajectoryPattern,
  SkillDetail,
  ResiliencePattern,
  AnswerFeedback,
  CaseSummary,
} from '@/lib/api/diagnosticClient';
import { pollPersonalizedFeedback } from '@/lib/api/diagnosticClient';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ShareButton from './ShareButton';

// Recharts is heavy (~150KB+) and depends on ResizeObserver, so it's split into
// a separate chunk and loaded only on the results route. ssr: false is required.
const ChartSkeleton = () => (
  <div className="w-full h-full rounded-xl bg-[#f0f1f3] animate-pulse" />
);

const FirmFitDonut = dynamic(
  () => import('./results/Charts').then((m) => ({ default: m.FirmFitDonut })),
  { ssr: false, loading: ChartSkeleton }
);

const SkillsRadar = dynamic(
  () => import('./results/Charts').then((m) => ({ default: m.SkillsRadar })),
  { ssr: false, loading: ChartSkeleton }
);

const PressureAreaChart = dynamic(
  () => import('./results/Charts').then((m) => ({ default: m.PressureAreaChart })),
  { ssr: false, loading: ChartSkeleton }
);

const BehavioralBarChart = dynamic(
  () => import('./results/Charts').then((m) => ({ default: m.BehavioralBarChart })),
  { ssr: false, loading: ChartSkeleton }
);

const StageMiniBarChart = dynamic(
  () => import('./results/Charts').then((m) => ({ default: m.StageMiniBarChart })),
  { ssr: false, loading: ChartSkeleton }
);

// ─── Animated counter hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

// ─── Design tokens ──────────────────────────────────────────────────────────

const NAVY = '#051c2c';

const CARD = 'rounded-2xl shadow-md shadow-black/[0.05] border border-white/70 bg-white';

const ASSESSMENT_COLORS: Record<SkillAssessment, {
  bg: string; text: string; border: string; dot: string; bar: string;
}> = {
  ABOVE_THRESHOLD: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-400', dot: 'bg-emerald-500', bar: '#10b981' },
  NEAR_THRESHOLD:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-400',    dot: 'bg-blue-500',    bar: '#3b82f6' },
  BELOW_THRESHOLD: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-400',   dot: 'bg-amber-500',   bar: '#f59e0b' },
  CRITICAL_GAP:    { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-400',     dot: 'bg-red-500',     bar: '#ef4444' },
};

const ASSESSMENT_SHORT: Record<SkillAssessment, string> = {
  ABOVE_THRESHOLD: 'ABOVE',
  NEAR_THRESHOLD:  'NEAR',
  BELOW_THRESHOLD: 'BELOW',
  CRITICAL_GAP:    'CRITICAL',
};

const VERDICT_COLORS: Record<VerdictTier, { bg: string; text: string; borderColor: string; dot: string }> = {
  STRONG_CANDIDATE: { bg: 'bg-emerald-50', text: 'text-emerald-700', borderColor: '#10b981', dot: 'bg-emerald-500' },
  ABOVE_THRESHOLD:  { bg: 'bg-blue-50',    text: 'text-blue-700',    borderColor: '#3b82f6', dot: 'bg-blue-500' },
  BORDERLINE:       { bg: 'bg-amber-50',   text: 'text-amber-700',   borderColor: '#f59e0b', dot: 'bg-amber-500' },
  BELOW_THRESHOLD:  { bg: 'bg-red-50',     text: 'text-red-600',     borderColor: '#ef4444', dot: 'bg-red-500' },
  SIGNIFICANT_GAP:  { bg: 'bg-red-100',    text: 'text-red-800',     borderColor: '#dc2626', dot: 'bg-red-700' },
};

const VERDICT_DESCRIPTIONS: Record<VerdictTier, string> = {
  STRONG_CANDIDATE: 'Performance exceeds the MBB benchmark across key dimensions. You demonstrate the analytical rigor and structured thinking expected at top-tier firms.',
  ABOVE_THRESHOLD: 'Performance meets or exceeds the consulting benchmark. You show the core capabilities expected for MBB readiness with room to sharpen specific skills.',
  BORDERLINE: 'Performance approaches the consulting benchmark but falls short in key areas. Targeted improvement on specific skills can move you above the threshold.',
  BELOW_THRESHOLD: 'Performance falls below the consulting benchmark across several dimensions. Focused development on foundational skills is recommended before re-assessment.',
  SIGNIFICANT_GAP: 'Significant gaps exist across core consulting capabilities. A structured development plan addressing fundamental skills is strongly recommended.',
};

const VERDICT_LABELS: Record<VerdictTier, string> = {
  STRONG_CANDIDATE: 'STRONG CANDIDATE',
  ABOVE_THRESHOLD:  'ABOVE THRESHOLD',
  BORDERLINE:       'BORDERLINE',
  BELOW_THRESHOLD:  'BELOW THRESHOLD',
  SIGNIFICANT_GAP:  'SIGNIFICANT GAP',
};

const TRAJECTORY_LABELS: Record<TrajectoryPattern, string> = {
  IMPROVING:         'Improving',
  CONSISTENT:        'Consistent',
  DECLINING:         'Declining',
  INSUFFICIENT_DATA: 'N/A',
};

const TRAJECTORY_ICONS: Record<TrajectoryPattern, string> = {
  IMPROVING:         '\u2191',
  CONSISTENT:        '\u2192',
  DECLINING:         '\u2193',
  INSUFFICIENT_DATA: '\u2014',
};

const RESILIENCE_COLORS: Record<ResiliencePattern, { bg: string; text: string; border: string }> = {
  RESILIENT:      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-400' },
  MODERATE_DROP:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-400' },
  DEGRADES:       { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-400' },
  COLLAPSES:      { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-400' },
};

const RESILIENCE_LABELS: Record<ResiliencePattern, string> = {
  RESILIENT:     'Resilient',
  MODERATE_DROP: 'Moderate Drop',
  DEGRADES:      'Degrades',
  COLLAPSES:     'Collapses',
};

const FIRM_COLORS: Record<string, string> = {
  McKinsey: '#051c2c',
  BCG:      '#00875a',
  Bain:     '#cc0000',
  'Growth Equity':      '#0ea5e9',
  'Buyout PE':          '#6366f1',
  'Investment Banking': '#f59e0b',
};

const STAT_ACCENT_COLORS = ['var(--accent)', 'var(--blue)', '#10b981', '#051c2c', '#8b5cf6'];

// ─── Component ──────────────────────────────────────────────────────────────

interface DiagnosticResultsProps {
  result: DiagnosticReport;
  trackId: string;
  onRestart?: () => void;
  readOnly?: boolean;
  sessionId?: string;
}

function ShareButtonCTA({ sessionId }: { sessionId: string }) {
  return <ShareButton sessionId={sessionId} />;
}

function AssessmentBadge({ assessment }: { assessment: SkillAssessment }) {
  const colors = ASSESSMENT_COLORS[assessment];
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-full ${colors.bg} ${colors.text}`}>
      {ASSESSMENT_SHORT[assessment]}
    </span>
  );
}

function GapDisplay({ gap }: { gap: number }) {
  const sign = gap >= 0 ? '+' : '';
  const color = gap >= 5 ? 'text-emerald-600' : gap >= -4 ? 'text-blue-600' : gap >= -10 ? 'text-amber-600' : 'text-red-600';
  return (
    <span className={`font-mono text-sm tabular-nums font-medium ${color}`}>
      {sign}{gap}
    </span>
  );
}

// Mini donut SVG for skill cards
function MiniDonut({ score, color, size = 56 }: { score: number; color: string; size?: number }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e6ea" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          style={{ animation: 'ringFill 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-sm font-medium tabular-nums" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function DiagnosticResults({
  result,
  trackId,
  onRestart,
  readOnly = false,
  sessionId,
}: DiagnosticResultsProps) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());
  // liveResult starts as the base scored result and gets hydrated with
  // personalized feedback once phase 2 completes in the background.
  const [liveResult, setLiveResult] = useState<DiagnosticReport>(result);
  const [feedbackExhausted, setFeedbackExhausted] = useState(false);
  const feedbackReady = Array.isArray(liveResult.answerFeedback) && liveResult.answerFeedback.length > 0;

  const {
    trackScore,
    verdict,
    benchmark,
    metadata,
    quickStats,
    skills,
    behavioralSignals,
    recommendations,
    coverage,
    archetype,
    firmFit,
    pressureResilience,
    percentile,
    answerFeedback,
    caseSummaries,
  } = liveResult;

  // Poll for personalized feedback until it arrives (max ~60s, 4s interval)
  useEffect(() => {
    if (!sessionId || feedbackReady) return;
    let attempts = 0;
    const MAX_ATTEMPTS = 15;
    const id = setInterval(async () => {
      attempts++;
      const enriched = await pollPersonalizedFeedback(sessionId);
      if (enriched) {
        setLiveResult(enriched);
        clearInterval(id);
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(id);
        setFeedbackExhausted(true);
      }
    }, 4000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const toggleSkill = (skillId: string) => {
    setExpandedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) next.delete(skillId);
      else next.add(skillId);
      return next;
    });
  };

  const heroRef = useScrollReveal();
  const profileRef = useScrollReveal(0.1);
  const matrixRef = useScrollReveal(0.1);
  const skillsRef = useScrollReveal(0.15);
  const feedbackRef = useScrollReveal(0.15);
  const pressureRef = useScrollReveal(0.15);
  const behavioralRef = useScrollReveal(0.2);
  const ctaRef = useScrollReveal(0.2);

  const scoreCounter = useAnimatedCounter(trackScore);
  const resilienceCounter = useAnimatedCounter(pressureResilience.score);

  const radarData = skills.map((s) => ({
    skill: s.label,
    score: s.score,
    benchmark: s.benchmark,
  }));

  const verdictColors = VERDICT_COLORS[verdict];
  const { overallAssessment, avgGap, bestStage, skillsImproving, skillsDeclining } = metadata;

  // Pressure resilience area chart data
  const areaChartData = pressureResilience.perCaseAverage.map((pc) => ({
    name: `L${pc.stage}`,
    score: pc.score,
  }));

  // Donut data for MBB firm fit
  const firmDonutData = firmFit.map((ff) => ({
    name: ff.firm,
    value: ff.fitPercent,
    fill: FIRM_COLORS[ff.firm] ?? NAVY,
  }));

  // Behavioral bar chart data
  const behavioralBarData = behavioralSignals.map((s) => ({
    name: s.label,
    score: s.score,
    benchmark: s.benchmark,
    assessment: s.assessment,
    fill: ASSESSMENT_COLORS[s.assessment].bar,
  }));

  const resiliencePatternColor =
    pressureResilience.pattern === 'RESILIENT' ? '#10b981' :
    pressureResilience.pattern === 'MODERATE_DROP' ? '#3b82f6' :
    pressureResilience.pattern === 'DEGRADES' ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* ── Top Bar ──────────────────────────────────────────────────── */}
      <div
        className="h-14 flex items-center px-6 sm:px-10 shrink-0"
        style={{
          backgroundColor: NAVY,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderBottom: '2px solid transparent',
          borderImage: `linear-gradient(to right, var(--accent), var(--blue)) 1`,
        }}
      >
        <span className="text-white text-[11px] font-mono tracking-[0.2em] font-medium">VIZON</span>
        <span className="text-white/20 text-xs mx-3">|</span>
        <span className="text-[#5a6775] text-[10px] font-mono tracking-[0.15em] uppercase">DIAGNOSTIC REPORT</span>
        <span className="ml-auto">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-3 py-1 tracking-wider rounded-full ${verdictColors.bg} ${verdictColors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${verdictColors.dot}`} />
            {VERDICT_LABELS[verdict]}
          </span>
        </span>
      </div>

      {/* ── Section 1: Verdict Hero ──────────────────────────────────── */}
      <div ref={heroRef} className="reveal bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="px-6 sm:px-10 py-8 lg:py-10">
          <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-6">
            CAPABILITY VERDICT — {metadata.trackName.toUpperCase()} TRACK
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 mb-8">
            {/* Score ring */}
            <div className="shrink-0 flex items-center gap-6">
              <div className="relative w-28 h-28 lg:w-36 lg:h-36" ref={scoreCounter.ref}>
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e6ea" strokeWidth="6" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={verdictColors.borderColor} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(trackScore / 100) * 327} 327`}
                    style={{ animation: 'ringFill 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                  />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="#ef4444" strokeWidth="2" strokeLinecap="butt"
                    strokeDasharray={`2 ${(benchmark / 100) * 327 - 2} 0 ${327 - (benchmark / 100) * 327}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl lg:text-4xl font-medium tabular-nums" style={{ color: NAVY }}>
                    {scoreCounter.value}
                  </span>
                  <span className="font-mono text-[10px] text-[#5a6775]">/100</span>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-mono rounded-full ${verdictColors.bg} ${verdictColors.text}`}>
                    {percentile}th pctl
                  </span>
                </div>
              </div>
              <div className="lg:hidden">
                <p
                  className={`font-sans text-2xl font-bold leading-tight ${verdict === 'STRONG_CANDIDATE' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : ''}`}
                  style={verdict !== 'STRONG_CANDIDATE' ? { color: NAVY } : undefined}
                >
                  {VERDICT_LABELS[verdict]}
                </p>
              </div>
            </div>

            {/* Verdict text */}
            <div className="flex-1">
              <p
                className={`hidden lg:block font-sans text-3xl xl:text-4xl font-bold leading-tight mb-3 ${verdict === 'STRONG_CANDIDATE' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : ''}`}
                style={verdict !== 'STRONG_CANDIDATE' ? { color: NAVY } : undefined}
              >
                {VERDICT_LABELS[verdict]}
              </p>
              <p className="font-sans text-[13px] text-[#4a5568] leading-relaxed max-w-2xl">
                {VERDICT_DESCRIPTIONS[verdict]}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 stagger-children">
            {[
              { value: `${quickStats.skillsAboveBenchmark}/${quickStats.totalSkills}`, label: 'Skills Above Benchmark' },
              { value: `${TRAJECTORY_ICONS[quickStats.trajectoryPattern]} ${TRAJECTORY_LABELS[quickStats.trajectoryPattern]}`, label: 'Performance Trajectory' },
              { value: `${quickStats.consistencyScore}`, label: 'Consistency Score' },
              { value: `${coverage.assessed}/${coverage.total}`, label: 'Skills Assessed' },
              { value: `${avgGap >= 0 ? '+' : ''}${avgGap}`, label: 'Avg. Gap to Benchmark' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`${CARD} card-hover px-5 py-4`}
                style={{ borderLeft: `3px solid ${STAT_ACCENT_COLORS[i % STAT_ACCENT_COLORS.length]}` }}
              >
                <div className="font-mono text-xl lg:text-2xl font-medium tabular-nums mb-1" style={{ color: NAVY }}>
                  {stat.value}
                </div>
                <div className="text-[9px] font-mono text-[#5a6775] tracking-[0.15em] uppercase leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Metadata bar */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono tracking-wider border-t border-[#e2e6ea] pt-3">
            <span className="px-2.5 py-1 rounded-full bg-[#f7f8fa] text-[#5a6775]">TRACK: {metadata.trackName}</span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f8fa] text-[#5a6775]">QUESTIONS: {metadata.questionsCount}</span>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f8fa] text-[#5a6775]">BENCHMARK: {metadata.benchmark}</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">STRONGEST: {metadata.strongestSkill.label} ({metadata.strongestSkill.score})</span>
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-500">WEAKEST: {metadata.weakestSkill.label} ({metadata.weakestSkill.score})</span>
          </div>
        </div>
      </div>

      {/* ── Candidate Profile ─────────────────────────────────────── */}
      <div className="px-6 sm:px-10 py-8">
        <div ref={profileRef} className="reveal">
          <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
            CANDIDATE PROFILE
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Archetype Card */}
            <div className={`${CARD} accent-strip-top p-6 overflow-hidden`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-12 h-12 flex items-center justify-center text-xl rounded-xl text-white" style={{ background: `linear-gradient(135deg, var(--blue), ${NAVY})` }}>
                  {archetype.id === 'structured_analyst' ? '\u{1F537}' :
                   archetype.id === 'hypothesis_driver' ? '\u{1F3AF}' :
                   archetype.id === 'analytical_powerhouse' ? '\u{1F4CA}' :
                   archetype.id === 'communicator' ? '\u{1F4AC}' :
                   archetype.id === 'pressure_performer' ? '\u{26A1}' :
                   archetype.id === 'quantitative_modeler' ? '\u{1F522}' :
                   archetype.id === 'thesis_builder' ? '\u{1F3AF}' :
                   archetype.id === 'risk_adjusted_thinker' ? '\u{1F6E1}\u{FE0F}' :
                   archetype.id === 'deal_maker' ? '\u{1F4BC}' :
                   archetype.id === 'balanced_investor' ? '\u{1F504}' : '\u{1F504}'}
                </div>
                <div>
                  <p className="font-sans text-[18px] font-bold leading-tight" style={{ color: NAVY }}>
                    {archetype.name}
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 text-[9px] font-mono tracking-wider rounded-full bg-[#051c2c] text-white">
                    {archetype.tagline}
                  </span>
                </div>
              </div>
              <p className="font-sans text-[12px] text-[#4a5568] leading-relaxed mb-5">
                {archetype.description}
              </p>
              <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-widest mb-2">TOP TRAITS</p>
              <div className="space-y-2.5">
                {archetype.topTraits.map((trait) => {
                  const matchingSkill = skills.find((s) => s.label === trait);
                  const score = matchingSkill?.score ?? 0;
                  return (
                    <div key={trait}>
                      <div className="flex justify-between mb-1">
                        <span className="font-sans text-[11px] text-[#051c2c]">{trait}</span>
                        <span className="font-mono text-[11px] font-medium tabular-nums" style={{ color: NAVY }}>{score}</span>
                      </div>
                      <div className="h-2 bg-[#e2e6ea] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: NAVY }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI-generated personalized feedback */}
              {archetype.feedback && (
                <div className="mt-5 pt-4 border-t border-[#e2e6ea]">
                  <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-widest mb-2">COACHING NOTE</p>
                  <p className="font-sans text-[12px] text-[#4a5568] leading-relaxed">
                    {archetype.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* MBB Firm Fit */}
            <div className={`${CARD} p-6`}>
              <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-widest mb-4">
                {trackId === 'finance' ? 'FUND STRATEGY FIT' : 'MBB FIRM FIT'}
              </p>

              {/* Concentric donut rings */}
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48">
                  <FirmFitDonut firmFit={firmFit} />
                </div>
              </div>

              <div className="space-y-4">
                {firmFit.map((ff) => (
                  <div key={ff.firm}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-sans text-[13px] font-medium" style={{ color: FIRM_COLORS[ff.firm] ?? NAVY }}>
                        {ff.firm}
                      </span>
                      <span className="font-mono text-[13px] font-medium tabular-nums" style={{ color: NAVY }}>
                        {ff.fitPercent}%
                      </span>
                    </div>
                    <div className="h-3 bg-[#e2e6ea] rounded-full relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${ff.fitPercent}%`, backgroundColor: FIRM_COLORS[ff.firm] ?? NAVY }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                        style={{ left: `calc(${benchmark}% - 6px)`, backgroundColor: '#ef4444' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-[#e2e6ea]">
                <p className="font-sans text-[11px] text-[#4a5568] leading-relaxed">
                  {trackId === 'finance'
                    ? `Fit scores reflect how your skill profile aligns with each fund strategy's emphasis areas. The red marker indicates the benchmark (${benchmark}).`
                    : `Fit scores reflect how your skill profile aligns with each firm's known emphasis areas. The red marker indicates the MBB benchmark (${benchmark}).`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 sm:px-10 pb-8 flex flex-col gap-8">

        {/* ── Capability Matrix + Radar ───────────────────────────── */}
        <div ref={matrixRef} className="reveal">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
            {/* Capability Matrix */}
            <div className={`${CARD} overflow-hidden`}>
              <div className="px-5 pt-5 pb-3">
                <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em]">
                  CAPABILITY MATRIX
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: NAVY }} className="text-white">
                      <th className="text-left py-3 px-5 text-[10px] font-mono tracking-[0.15em] font-medium">SKILL</th>
                      <th className="text-center py-3 px-3 text-[10px] font-mono tracking-[0.15em] font-medium w-16">SCORE</th>
                      <th className="text-center py-3 px-3 text-[10px] font-mono tracking-[0.15em] font-medium w-20">BENCH</th>
                      <th className="hidden sm:table-cell text-left py-3 px-3 text-[10px] font-mono tracking-[0.15em] font-medium w-44">PERFORMANCE</th>
                      <th className="text-center py-3 px-3 text-[10px] font-mono tracking-[0.15em] font-medium w-14">GAP</th>
                      <th className="text-center py-3 px-3 text-[10px] font-mono tracking-[0.15em] font-medium w-32">ASSESSMENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, i) => (
                      <tr key={skill.skillId} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f7f8fa]'} hover:bg-[var(--blue-light)]/40 transition-colors border-b border-[#e2e6ea]`}>
                        <td className="py-3 px-5 text-[12px] font-sans text-[#051c2c]">{skill.label}</td>
                        <td className="py-3 px-3 text-center text-[12px] font-mono font-medium tabular-nums" style={{ color: ASSESSMENT_COLORS[skill.assessment].bar }}>{skill.score}</td>
                        <td className="py-3 px-3 text-center text-[12px] font-mono text-[#5a6775] tabular-nums">{skill.benchmark}</td>
                        <td className="hidden sm:table-cell py-3 px-3">
                          <PerformanceBar score={skill.score} benchmark={skill.benchmark} assessment={skill.assessment} />
                        </td>
                        <td className="py-3 px-3 text-center"><GapDisplay gap={skill.gap} /></td>
                        <td className="py-3 px-3 text-center"><AssessmentBadge assessment={skill.assessment} /></td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#051c2c] font-medium" style={{ background: 'linear-gradient(to right, #f0f4f8, #f7f8fa)' }}>
                      <td className="py-3 px-5 text-[12px] font-sans text-[#051c2c] font-semibold">OVERALL</td>
                      <td className="py-3 px-3 text-center text-[12px] font-mono font-medium tabular-nums" style={{ color: ASSESSMENT_COLORS[overallAssessment].bar }}>{trackScore}</td>
                      <td className="py-3 px-3 text-center text-[12px] font-mono text-[#5a6775] tabular-nums">{benchmark}</td>
                      <td className="hidden sm:table-cell py-3 px-3">
                        <PerformanceBar score={trackScore} benchmark={benchmark} assessment={overallAssessment} />
                      </td>
                      <td className="py-3 px-3 text-center"><GapDisplay gap={trackScore - benchmark} /></td>
                      <td className="py-3 px-3 text-center">
                        <AssessmentBadge assessment={overallAssessment} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Radar Chart */}
            <div className={`${CARD} p-5 flex flex-col`}>
              <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-4">
                SKILL PROFILE
              </p>
              <div className="flex-1 min-h-[280px]">
                <SkillsRadar data={radarData} />
              </div>
              <div className="border-t border-[#e2e6ea] pt-3 mt-2 flex flex-wrap gap-2">
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#f7f8fa] text-[#4a5568]">
                  Best stage: L{bestStage.stage} (avg {bestStage.avg})
                </span>
                {skillsImproving > 0 && (
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    {skillsImproving} skill{skillsImproving > 1 ? 's' : ''} improving
                  </span>
                )}
                {skillsDeclining > 0 && (
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                    {skillsDeclining} skill{skillsDeclining > 1 ? 's' : ''} declining
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Skill Breakdown Cards ────────────────────────── */}
        <div ref={skillsRef} className="reveal">
          <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
            SKILL BREAKDOWN
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <SkillCard
                key={skill.skillId}
                skill={skill}
                expanded={expandedSkills.has(skill.skillId)}
                onToggle={() => toggleSkill(skill.skillId)}
              />
            ))}
          </div>
        </div>

        {/* ── Answer Feedback + Case Summaries ────────────────────── */}
        {feedbackReady ? (
          <div ref={feedbackRef} className="reveal">
            <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
              ANSWER-LEVEL FEEDBACK
            </p>
            <div className="flex flex-col gap-8">
              {[1, 2, 3].map((stage) => {
                const stageAnswers = answerFeedback?.filter((a) => a.caseStage === stage) ?? [];
                const stageSummary = caseSummaries?.find((s) => s.caseStage === stage);
                if (!stageAnswers.length && !stageSummary) return null;
                return (
                  <CaseFeedbackBlock
                    key={stage}
                    caseStage={stage as 1 | 2 | 3}
                    answerFeedback={stageAnswers}
                    caseSummary={stageSummary}
                  />
                );
              })}
            </div>
          </div>
        ) : sessionId && !feedbackExhausted ? (
          <div ref={feedbackRef} className="reveal">
            <div className="flex items-center gap-3 mb-5">
              <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em]">
                ANSWER-LEVEL FEEDBACK
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[9px] font-mono tracking-[0.12em] uppercase text-[#1A56DB]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
                Personalizing…
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((stage) => (
                <div key={stage} className={`${CARD} p-6`}>
                  <div className="h-3 w-24 bg-[#e2e6ea] rounded animate-pulse mb-4" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-[#f0f1f3] rounded animate-pulse" />
                    <div className="h-2.5 w-4/5 bg-[#f0f1f3] rounded animate-pulse" />
                    <div className="h-2.5 w-3/5 bg-[#f0f1f3] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Pressure Resilience ──────────────────────────────────────── */}
        <div ref={pressureRef} className="reveal">
          <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-5">
            PRESSURE RESILIENCE
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left: Trajectory */}
            <div className={`${CARD} p-6`}>
              <div className="flex items-center gap-3 mb-6" ref={resilienceCounter.ref}>
                <div className="font-mono text-3xl font-medium tabular-nums" style={{ color: NAVY }}>
                  {resilienceCounter.value}
                </div>
                <div>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-mono tracking-wider rounded-full ${RESILIENCE_COLORS[pressureResilience.pattern].bg} ${RESILIENCE_COLORS[pressureResilience.pattern].text}`}>
                    {RESILIENCE_LABELS[pressureResilience.pattern]}
                  </span>
                  <p className="font-mono text-[10px] text-[#5a6775] mt-1">
                    {pressureResilience.dropFromBaseline >= 0 ? '+' : ''}{pressureResilience.dropFromBaseline} pts from baseline
                  </p>
                </div>
              </div>

              <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-widest mb-3">CASE STAGE PROGRESSION</p>
              <div className="h-[140px]">
                <PressureAreaChart data={areaChartData} color={resiliencePatternColor} />
              </div>
            </div>

            {/* Right: Heatmap */}
            <div className={`${CARD} p-6`}>
              <p className="text-[9px] font-mono text-[#5a6775] uppercase tracking-widest mb-4">
                SKILL x CASE HEATMAP
              </p>
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 text-[10px] font-mono text-[#5a6775] tracking-wider">SKILL</div>
                  <div className="w-12 text-center text-[10px] font-mono text-[#5a6775] tracking-wider">L1</div>
                  <div className="w-12 text-center text-[10px] font-mono text-[#5a6775] tracking-wider">L2</div>
                  <div className="w-12 text-center text-[10px] font-mono text-[#5a6775] tracking-wider">L3</div>
                </div>
                {pressureResilience.skillHeatmap.map((row) => (
                  <div key={row.skillId} className="flex items-center gap-2">
                    <div className="flex-1 text-[11px] font-sans text-[#051c2c] truncate">{row.label}</div>
                    {row.scores.map((score, si) => (
                      <div
                        key={si}
                        className="w-12 h-10 rounded-lg flex items-center justify-center font-mono text-[11px] font-medium tabular-nums text-white"
                        style={{
                          backgroundColor: score === 0 ? '#d1d5db' :
                            score >= 80 ? '#10b981' :
                            score >= 70 ? '#3b82f6' :
                            score >= 60 ? '#f59e0b' : '#ef4444',
                        }}
                      >
                        {score}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Behavioral Signals + Recommendations ─────────────── */}
        <div ref={behavioralRef} className="reveal">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Behavioral Signals */}
            <div className={`${CARD} p-6`}>
              <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-4">
                BEHAVIORAL SIGNALS
              </p>
              <div className="h-[220px]">
                <BehavioralBarChart data={behavioralBarData} />
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2e6ea]">
                <p className="font-sans text-[11px] text-[#4a5568] leading-relaxed">
                  Behavioral signals are observed independently from skill scores. They reflect how you communicate, frame problems, and express confidence.
                </p>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className={`${CARD} p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em]">
                    PRIORITY RECOMMENDATIONS
                  </p>
                  {!feedbackReady && sessionId && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[9px] font-mono tracking-[0.12em] uppercase text-[#1A56DB]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
                      Personalizing…
                    </span>
                  )}
                </div>

                {/* Weakest skill callout */}
                <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-red-50 to-white border border-red-100">
                  <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-widest mb-2">
                    FOCUS AREA — {metadata.weakestSkill.label.toUpperCase()} &middot; {metadata.weakestSkill.score}/100
                  </p>
                  <p className="font-sans text-[14px] font-semibold" style={{ color: NAVY }}>
                    {recommendations[0].title}
                  </p>
                </div>

                <div className="space-y-5">
                  {recommendations.map((rec) => (
                    <div key={rec.priority} className="flex gap-4">
                      <div
                        className="shrink-0 w-7 h-7 flex items-center justify-center font-mono text-xs font-medium text-white rounded-full"
                        style={{ backgroundColor: NAVY }}
                      >
                        {rec.priority}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13px] font-semibold text-[#051c2c] mb-1">{rec.title}</p>
                        <p className="font-sans text-[11px] text-[#4a5568] leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CTAs ──────────────────────────────────────────────────────── */}
        <div ref={ctaRef} className="reveal pb-6 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto w-full">
          {readOnly ? (
            <>
              <a
                href="/signup?callbackUrl=/diagnostic"
                className="flex-1 py-4 text-white font-mono text-[11px] text-center tracking-[0.15em] uppercase rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: NAVY }}
              >
                Run your own diagnostic →
              </a>
              {sessionId && <ShareButtonCTA sessionId={sessionId} />}
            </>
          ) : (
            <>
              {onRestart && (
                <button
                  onClick={onRestart}
                  className="flex-1 py-4 text-white font-mono text-[11px] tracking-[0.15em] uppercase rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                  style={{ backgroundColor: NAVY }}
                >
                  Retake Diagnostic
                </button>
              )}
              {sessionId && <ShareButtonCTA sessionId={sessionId} />}
              <a
                href="/"
                className="flex-1 py-4 bg-white font-mono text-[11px] text-center tracking-[0.15em] uppercase rounded-xl shadow-lg border border-[#e2e6ea] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{ color: NAVY }}
              >
                View All Tracks
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const CASE_STAGE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Case 1 — Baseline',
  2: 'Case 2 — Escalation',
  3: 'Case 3 — Pressure',
};

function CaseFeedbackBlock({
  caseStage,
  answerFeedback,
  caseSummary,
}: {
  caseStage: 1 | 2 | 3;
  answerFeedback: AnswerFeedback[];
  caseSummary?: CaseSummary;
}) {
  return (
    <div className={`${CARD} overflow-hidden`}>
      {/* Case header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#e2e6ea]" style={{ background: 'linear-gradient(to right, #f7f8fa, #fff)' }}>
        <p className="text-[10px] font-mono text-[#5a6775] uppercase tracking-[0.2em] mb-1">
          {CASE_STAGE_LABELS[caseStage]}
        </p>

        {/* Case-level summary */}
        {caseSummary && (
          <div className="mt-3 flex flex-col gap-3">
            <p className="font-sans text-[13px] text-[#4a5568] leading-relaxed">
              {caseSummary.overallAssessment}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <p className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest mb-1">STRONGEST MOMENT</p>
                <p className="font-sans text-[12px] text-emerald-800 leading-relaxed">{caseSummary.strongestMoment}</p>
              </div>
              <div className="flex-1 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                <p className="text-[9px] font-mono text-amber-600 uppercase tracking-widest mb-1">CLEAREST GAP</p>
                <p className="font-sans text-[12px] text-amber-800 leading-relaxed">{caseSummary.clearestGap}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Per-answer feedback */}
      {answerFeedback.length > 0 && (
        <div className="divide-y divide-[#f0f1f3]">
          {answerFeedback.map((af) => (
            <div key={af.sequenceNumber} className="px-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="shrink-0 w-6 h-6 flex items-center justify-center font-mono text-[10px] font-medium text-white rounded-full"
                  style={{ backgroundColor: NAVY }}
                >
                  {af.sequenceNumber}
                </span>
                <span className="font-mono text-[10px] text-[#5a6775] uppercase tracking-wider">{af.skillLabel}</span>
              </div>
              {af.questionSnippet && (
                <p className="font-mono text-[11px] text-[#7a8793] leading-snug mb-2 italic">
                  &ldquo;{af.questionSnippet}&rdquo;
                </p>
              )}
              <p className="font-sans text-[12px] text-[#4a5568] leading-relaxed">{af.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PerformanceBar({ score, benchmark, assessment }: { score: number; benchmark: number; assessment: SkillAssessment }) {
  const barColor = ASSESSMENT_COLORS[assessment].bar;
  return (
    <div className="relative h-2 w-full bg-neutral-100 rounded-full overflow-visible">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(score, 100)}%`, backgroundColor: barColor }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
        style={{ left: `calc(${benchmark}% - 5px)`, backgroundColor: '#ef4444' }}
      />
    </div>
  );
}

function SkillCard({ skill, expanded, onToggle }: { skill: SkillDetail; expanded: boolean; onToggle: () => void }) {
  const colors = ASSESSMENT_COLORS[skill.assessment];

  // Bar chart data for stage progression
  const stageBarData = skill.stageScores.map((ss, i) => ({
    name: `L${ss.stage}`,
    score: ss.score,
    opacity: i === skill.stageScores.length - 1 ? 1 : 0.4,
  }));

  return (
    <div
      className={`${CARD} card-hover overflow-hidden`}
      style={{ borderTop: `3px solid ${colors.bar}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-sans text-[13px] font-semibold text-[#051c2c] mb-2">{skill.label}</p>
            <AssessmentBadge assessment={skill.assessment} />
          </div>
          <MiniDonut score={skill.score} color={colors.bar} />
        </div>

        {/* Stage progression as mini bar chart */}
        {skill.stageScores.length > 0 && (
          <div className="flex items-end gap-3 mb-3">
            <div className="w-[100px] h-[48px]">
              <StageMiniBarChart data={stageBarData} color={colors.bar} />
            </div>
            {skill.trajectory !== 'INSUFFICIENT_DATA' && (
              <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full ${
                skill.trajectory === 'IMPROVING' ? 'bg-emerald-50 text-emerald-600' :
                skill.trajectory === 'DECLINING'  ? 'bg-red-50 text-red-600' :
                'bg-[#f7f8fa] text-[#5a6775]'
              }`}>
                {TRAJECTORY_ICONS[skill.trajectory]} {TRAJECTORY_LABELS[skill.trajectory]}
              </span>
            )}
          </div>
        )}

        {/* Expand/collapse narrative */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: expanded ? '10rem' : '0' }}
        >
          <p className="font-sans text-[11px] text-[#4a5568] leading-relaxed pb-1">{skill.narrative}</p>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-[11px] font-mono mt-1 hover:underline"
          style={{ color: 'var(--blue)' }}
        >
          {expanded ? 'Hide Details' : 'View Details'}
          <svg
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

