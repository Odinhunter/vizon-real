'use client';

/**
 * Recharts island — extracted from DiagnosticResults so the heavy chart library
 * is dynamic-imported (ssr: false) and only ships on the results route.
 *
 * Recharts depends on ResizeObserver, so SSR must be disabled.
 */

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Tooltip,
} from 'recharts';
import type { FirmFit } from '@/lib/api/diagnosticClient';

const NAVY = '#051c2c';

const FIRM_COLORS: Record<string, string> = {
  McKinsey: '#051c2c',
  BCG: '#00875a',
  Bain: '#cc0000',
  'Growth Equity': '#0ea5e9',
  'Buyout PE': '#6366f1',
  'Investment Banking': '#f59e0b',
};

// ─── Firm fit donut (concentric rings) ───────────────────────────────────────

interface FirmFitDonutProps {
  firmFit: FirmFit[];
}

export function FirmFitDonut({ firmFit }: FirmFitDonutProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <PieChart>
        {firmFit.map((ff, i) => {
          const innerR = 30 + i * 18;
          const outerR = innerR + 14;
          return (
            <Pie
              key={ff.firm}
              data={[
                { value: ff.fitPercent, fill: FIRM_COLORS[ff.firm] ?? NAVY },
                { value: 100 - ff.fitPercent, fill: '#e2e6ea' },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={innerR}
              outerRadius={outerR}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              cornerRadius={4}
              stroke="none"
            >
              <Cell fill={FIRM_COLORS[ff.firm] ?? NAVY} />
              <Cell fill="#f0f1f3" />
            </Pie>
          );
        })}
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Skill profile radar ─────────────────────────────────────────────────────

interface SkillsRadarProps {
  data: { skill: string; score: number; benchmark: number }[];
}

export function SkillsRadar({ data }: SkillsRadarProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
        <PolarGrid stroke="#e2e6ea" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fill: '#5a6775' }}
        />
        <Radar
          name="Benchmark"
          dataKey="benchmark"
          stroke="var(--accent)"
          fill="transparent"
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <Radar
          name="Your Profile"
          dataKey="score"
          stroke="var(--blue)"
          fill="var(--blue)"
          fillOpacity={0.12}
          strokeWidth={2}
        />
        <Legend wrapperStyle={{ fontSize: 10, fontFamily: "'DM Mono', monospace" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── Pressure resilience area chart ──────────────────────────────────────────

interface PressureAreaChartProps {
  data: { name: string; score: number }[];
  color: string;
}

export function PressureAreaChart({ data, color }: PressureAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ea" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fill: '#5a6775' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fill: '#5a6775' }} />
        <Tooltip
          contentStyle={{ fontSize: 11, fontFamily: "'DM Mono', monospace", borderRadius: 12, border: '1px solid #e2e6ea' }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2.5}
          fill="url(#areaGrad)"
          dot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Skill stage progression mini bar chart (used inside SkillCard) ─────────

interface StageMiniBarChartProps {
  data: { name: string; score: number; opacity: number }[];
  color: string;
}

export function StageMiniBarChart({ data, color }: StageMiniBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 8, fontFamily: "'DM Mono', monospace", fill: '#5a6775' }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={color} fillOpacity={entry.opacity} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Behavioral signals horizontal bar chart ─────────────────────────────────

interface BehavioralBarChartProps {
  data: { name: string; score: number; benchmark: number; fill: string }[];
}

export function BehavioralBarChart({ data }: BehavioralBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ea" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fill: '#5a6775' }} />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 10, fontFamily: "var(--font-sora), 'Sora', sans-serif", fill: '#4a5568' }}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, fontFamily: "'DM Mono', monospace", borderRadius: 12, border: '1px solid #e2e6ea' }}
        />
        <Bar dataKey="score" barSize={16} radius={[0, 8, 8, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
