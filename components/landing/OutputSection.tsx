'use client';

import SectionLabel from './SectionLabel';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const BLUE = '#1A56DB';

const skillBars = [
  { name: 'Structuring', score: 78, benchmark: 74 },
  { name: 'Pressure', score: 62, benchmark: 74 },
  { name: 'Clarity', score: 85, benchmark: 74 },
  { name: 'Prioritisation', score: 70, benchmark: 74 },
  { name: 'Speed', score: 73, benchmark: 74 },
];

const deliverables = [
  {
    title: 'Overall Score + Verdict',
    description:
      'Your composite score against the MBB threshold of 74. Clear, unambiguous, and benchmarked — not relative to other users, but to what firms actually expect.',
    icon: '01',
    accent: 'bg-[#e8f0fe] text-[#1A56DB]',
    borderColor: 'border-l-[#1A56DB]',
  },
  {
    title: '5-Skill Capability Map',
    description:
      'Scores across Structuring, Pressure Handling, Clarity of Reasoning, Prioritisation, and Speed. With gap analysis and trajectory across case difficulty.',
    icon: '02',
    accent: 'bg-[#fff3ee] text-[#e8521a]',
    borderColor: 'border-l-[#e8521a]',
  },
  {
    title: 'Candidate Archetype',
    description:
      'Your consulting profile across six archetypes — The Structured Analyst, The Pressure Performer, and more. Built on your actual skill distribution, not a quiz.',
    icon: '03',
    accent: 'bg-[#f0fdf4] text-[#16a34a]',
    borderColor: 'border-l-[#16a34a]',
  },
  {
    title: 'MBB Firm Fit Scores',
    description:
      'McKinsey, BCG, and Bain weight skills differently. Your fit percentages tell you where to focus your applications — and which firm plays to your strengths.',
    icon: '04',
    accent: 'bg-[#fdf4ff] text-[#9333ea]',
    borderColor: 'border-l-[#9333ea]',
  },
  {
    title: 'Pressure Resilience Breakdown',
    description:
      'Your performance across baseline, escalation, and pressure cases. The pattern that emerges here is usually the most honest thing in the report.',
    icon: '05',
    accent: 'bg-[#fff7ed] text-[#ea580c]',
    borderColor: 'border-l-[#ea580c]',
  },
  {
    title: 'Behavioral Evidence + Recs',
    description:
      'Signals extracted from how you write — confidence, structure, precision — plus targeted priority recommendations to close your gaps.',
    icon: '06',
    accent: 'bg-[#fef3c7] text-[#d97706]',
    borderColor: 'border-l-[#d97706]',
  },
];

function CustomRadar() {
  // Wider viewBox with generous padding so no label clips
  const cx = 240, cy = 200, maxR = 120;
  const n = skillBars.length;
  const ringLevels = [25, 50, 75, 100];
  const labelR = maxR + 44;

  function pt(r: number, i: number) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function polyPts(vals: number[]) {
    return vals.map((v, i) => {
      const p = pt((v / 100) * maxR, i);
      return `${p.x},${p.y}`;
    }).join(' ');
  }

  const scores = skillBars.map((s) => s.score);
  const benchmarks = skillBars.map((s) => s.benchmark);

  return (
    <svg viewBox="0 0 480 390" className="w-full h-full">
      <defs>
        <radialGradient id="rScoreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A56DB" stopOpacity="0.32" />
          <stop offset="60%" stopColor="#1A56DB" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1A56DB" stopOpacity="0.04" />
        </radialGradient>
        <radialGradient id="rBenchGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8521a" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#e8521a" stopOpacity="0.08" />
        </radialGradient>
        <filter id="rGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="rDotGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Circular grid rings — cleaner than pentagon rings */}
      {ringLevels.map((level, li) => {
        const r = (level / 100) * maxR;
        const isOuter = li === ringLevels.length - 1;
        const isMid = level === 50;
        return (
          <circle
            key={li}
            cx={cx} cy={cy} r={r}
            fill={isOuter ? 'rgba(26,86,219,0.025)' : 'none'}
            stroke={
              isOuter
                ? 'rgba(26,86,219,0.22)'
                : isMid
                ? 'rgba(26,86,219,0.13)'
                : 'rgba(26,86,219,0.08)'
            }
            strokeWidth={isOuter ? 1.5 : 1}
          />
        );
      })}

      {/* Scale labels along the top axis */}
      {ringLevels.slice(0, 3).map((level) => {
        const r = (level / 100) * maxR;
        return (
          <text
            key={level}
            x={cx + 5}
            y={cy - r + 4}
            fontSize={8}
            fontFamily="Inter, sans-serif"
            fill="rgba(26,86,219,0.40)"
            fontWeight={600}
          >
            {level}
          </text>
        );
      })}

      {/* Axis lines */}
      {skillBars.map((_, i) => {
        const p = pt(maxR, i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={p.x} y2={p.y}
            stroke="rgba(26,86,219,0.11)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        );
      })}

      {/* Benchmark polygon — light fill + visible stroke */}
      <polygon
        points={polyPts(benchmarks)}
        fill="url(#rBenchGrad)"
        stroke="#e8521a"
        strokeWidth={2}
        strokeDasharray="6 3"
        opacity={0.75}
      />

      {/* Score fill */}
      <polygon points={polyPts(scores)} fill="url(#rScoreGrad)" />
      {/* Score stroke with glow */}
      <polygon
        points={polyPts(scores)}
        fill="none"
        stroke="#1A56DB"
        strokeWidth={2.5}
        strokeLinejoin="round"
        filter="url(#rGlow)"
      />

      {/* Score vertex dots */}
      {scores.map((score, i) => {
        const p = pt((score / 100) * maxR, i);
        const gap = skillBars[i].score - skillBars[i].benchmark;
        const dotColor = gap >= 0 ? '#1A56DB' : '#e8521a';
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={9} fill={dotColor} opacity={0.12} />
            <circle cx={p.x} cy={p.y} r={4.5} fill={dotColor} filter="url(#rDotGlow)" />
            <circle cx={p.x} cy={p.y} r={2.5} fill="white" />
          </g>
        );
      })}

      {/* Skill labels with score + gap indicator */}
      {skillBars.map((skill, i) => {
        const p = pt(labelR, i);
        const isLeft = p.x < cx - 10;
        const isRight = p.x > cx + 10;
        const anchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
        const gap = skill.score - skill.benchmark;
        const gapColor = gap > 0 ? '#059669' : gap < 0 ? '#dc2626' : '#8896a4';
        const gapText = gap > 0 ? `+${gap}` : `${gap}`;
        const isAbove = gap >= 0;

        return (
          <g key={i}>
            {/* Skill name */}
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={12}
              fontFamily="Inter, sans-serif"
              fill="#1e3a5f"
              fontWeight={700}
            >
              {skill.name}
            </text>
            {/* Score */}
            <text
              x={p.x}
              y={p.y + 8}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={11}
              fontFamily="Inter, sans-serif"
              fill="#1A56DB"
              fontWeight={700}
            >
              {skill.score}
              {'  '}
              <tspan fontSize={9} fill={gapColor} fontWeight={600}>{gapText}</tspan>
            </text>
          </g>
        );
      })}

      {/* Center point */}
      <circle cx={cx} cy={cy} r={3} fill="rgba(26,86,219,0.25)" />
    </svg>
  );
}

export default function OutputSection() {
  const leftRef = useScrollReveal(0);
  const rightRef = useScrollReveal(0.15);

  return (
    <section id="output" className="bg-[#dce8f8] py-10 md:py-16 px-5 md:px-6 lg:px-12 scroll-mt-[64px]">
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionLabel label="YOUR OUTPUT" />

        <h2 className="font-extrabold text-[#051c2c] leading-[1.1] tracking-[-0.02em] mb-3 md:mb-4" style={{ fontSize: 'clamp(24px, 3.5vw, 44px)' }}>
          Clear Feedback. No Sugarcoating.
        </h2>
        <p className="text-[15px] md:text-[16px] text-[#6b7a87] leading-relaxed mb-8 md:mb-12 max-w-xl">
          Every skill scored. Every gap exposed. Benchmarked against the actual MBB hiring threshold — so you know exactly what you&apos;re working with.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
          {/* Left — skill bars + radar */}
          <div ref={leftRef} className="reveal bg-white/60 backdrop-blur-xl border border-white/70 shadow-md shadow-black/[0.05] rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10">
            <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
              {skillBars.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-[#051c2c]">{skill.name}</span>
                    <span className="text-[14px] font-bold tabular-nums text-[#051c2c]">{skill.score}</span>
                  </div>
                  <div className="relative h-[6px] w-full bg-[#e2e6ea]/60 rounded-full">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${skill.score}%`, backgroundColor: BLUE }}
                    />
                    <div
                      className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-[#e8521a]"
                      style={{ left: `${skill.benchmark}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-[11px] text-[#8896a4] font-medium mb-0 md:mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-[4px] rounded-full" style={{ backgroundColor: BLUE }} />
                <span>Your score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-[4px] rounded-full bg-[#e8521a]" />
                <span>MBB benchmark (74)</span>
              </div>
            </div>

            {/* Custom radar chart — hidden on mobile to save vertical space */}
            <div className="hidden md:block w-[83%] mx-auto" style={{ aspectRatio: '480/390' }}>
              <CustomRadar />
            </div>
          </div>

          {/* Right — deliverables */}
          <div ref={rightRef} className="reveal flex flex-col gap-2.5 md:gap-3">
            <p className="text-[13px] font-semibold text-[#051c2c] mb-1">What you receive after 40 minutes:</p>
            {deliverables.map((item) => (
              <div key={item.title} className={`bg-white/60 backdrop-blur-xl border border-white/70 shadow-md shadow-black/[0.05] rounded-xl px-4 md:px-5 py-3.5 md:py-4 hover:bg-white/80 hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-0.5 transition-all border-l-3 ${item.borderColor}`}>
                <div className="flex gap-3 md:gap-4 items-start">
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg ${item.accent} text-[10px] md:text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#051c2c] leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[#6b7a87] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
