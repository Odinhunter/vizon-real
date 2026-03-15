'use client';

import type { ProbeExhibit, TableExhibit, ChartExhibit, WaterfallExhibit } from '@/content/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  LabelList,
} from 'recharts';

interface ExhibitDisplayProps {
  exhibit: ProbeExhibit;
  mode?: 'inline' | 'panel';
}

// ── Shared tooltip style ────────────────────────────────────────────────────────

const tooltipStyle = {
  fontSize: 11,
  fontFamily: 'var(--font-geist-mono), monospace',
  borderRadius: 0,
  border: '1px solid #E5E7EB',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

// ── Formatters ─────────────────────────────────────────────────────────────────

function formatTick(value: number, format?: string): string {
  if (format === 'percent') return `${value}%`;
  if (format === 'currency') return `$${value}`;
  if (format === 'number') return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : String(value);
  return String(value);
}

// ── Footnote ────────────────────────────────────────────────────────────────────

function Footnote({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-4 pt-3 border-t border-neutral-100">
      <p className="text-[10px] font-mono text-neutral-500 leading-relaxed">{text}</p>
    </div>
  );
}

// ── Panel Header ───────────────────────────────────────────────────────────────

function PanelHeader({ exhibit }: { exhibit: ProbeExhibit }) {
  return (
    <div className="px-5 pt-4 pb-2 border-b border-neutral-100 border-t-2 border-t-[#003A70]">
      <div className="mb-2">
        <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
          Exhibit
        </span>
      </div>
      <p className="font-mono text-base font-semibold text-neutral-900">{exhibit.title}</p>
      {'subtitle' in exhibit && exhibit.subtitle && (
        <p className="font-mono text-xs text-neutral-500 mt-2 leading-relaxed">{exhibit.subtitle}</p>
      )}
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────────

function TableDisplay({ exhibit, mode }: { exhibit: TableExhibit; mode: 'inline' | 'panel' }) {
  return (
    <div>
      {mode === 'panel' ? (
        <PanelHeader exhibit={exhibit} />
      ) : (
        <div className="px-5 pt-5">
          <p className="text-sm font-semibold text-neutral-900 mb-0.5">{exhibit.title}</p>
          {exhibit.subtitle && (
            <p className="text-xs text-neutral-500 mb-4">{exhibit.subtitle}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">
        <table className="w-full text-sm border-collapse border-t-2 border-[#003A70]">
          <thead>
            <tr className="bg-[#003A70]">
              <th className="text-left text-white text-[10px] font-mono uppercase tracking-wider py-2.5 px-3 w-1/2" />
              {exhibit.columns.map((col) => (
                <th
                  key={col}
                  className="text-right text-white text-[10px] font-mono uppercase tracking-wider py-2.5 px-3"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exhibit.rows.map((row, i) => {
              if (row.isSpacer) {
                return <tr key={i} className="h-2" />;
              }
              return (
                <tr
                  key={i}
                  className={`border-b border-neutral-100 ${row.isHighlight ? 'bg-[#F0F4F8]' : ''}`}
                >
                  <td className={`py-2.5 px-3 text-neutral-700 font-mono text-xs ${row.isBold ? 'font-semibold text-neutral-900' : ''}`}>
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`py-2.5 px-3 text-right text-neutral-800 font-mono text-xs ${row.isBold ? 'font-semibold text-neutral-900' : ''}`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Footnote text={exhibit.footnote} />
      </div>
    </div>
  );
}

// ── Bar / Grouped Bar ──────────────────────────────────────────────────────────

function BarDisplay({ exhibit, mode }: { exhibit: ChartExhibit; mode: 'inline' | 'panel' }) {
  const isGrouped = exhibit.type === 'grouped_bar';
  const isSingleSeries = exhibit.series.length === 1;
  const data = exhibit.xKeys.map((key, i) => {
    const point: Record<string, string | number> = { name: key };
    exhibit.series.forEach((s) => {
      point[s.name] = s.values[i];
    });
    return point;
  });

  return (
    <div>
      {mode === 'panel' ? (
        <PanelHeader exhibit={exhibit} />
      ) : (
        <div className="px-5 pt-5">
          <p className="text-sm font-semibold text-neutral-900 mb-0.5">{exhibit.title}</p>
          {exhibit.subtitle && (
            <p className="text-xs text-neutral-500 mb-4">{exhibit.subtitle}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <BarChart data={data} barCategoryGap={isGrouped ? '20%' : '25%'}>
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => formatTick(Number(value), exhibit.yAxisFormat)}
              contentStyle={tooltipStyle}
            />
            {!isSingleSeries && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />}
            {exhibit.series.map((s) => (
              <Bar key={s.name} dataKey={s.name} fill={s.highlight ? '#003A70' : '#C8D7E8'} radius={[3, 3, 0, 0]}>
                <LabelList dataKey={s.name} position="top" fontSize={11} fontFamily="var(--font-geist-mono)" formatter={(v) => formatTick(Number(v), exhibit.yAxisFormat)} fill="#374151" />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
        <Footnote text={exhibit.footnote} />
      </div>
    </div>
  );
}

// ── Line ───────────────────────────────────────────────────────────────────────

function LineDisplay({ exhibit, mode }: { exhibit: ChartExhibit; mode: 'inline' | 'panel' }) {
  const isSingleSeries = exhibit.series.length === 1;
  const data = exhibit.xKeys.map((key, i) => {
    const point: Record<string, string | number> = { name: key };
    exhibit.series.forEach((s) => {
      point[s.name] = s.values[i];
    });
    return point;
  });

  return (
    <div>
      {mode === 'panel' ? (
        <PanelHeader exhibit={exhibit} />
      ) : (
        <div className="px-5 pt-5">
          <p className="text-sm font-semibold text-neutral-900 mb-0.5">{exhibit.title}</p>
          {exhibit.subtitle && (
            <p className="text-xs text-neutral-500 mb-4">{exhibit.subtitle}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <LineChart data={data}>
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => formatTick(Number(value), exhibit.yAxisFormat)}
              contentStyle={tooltipStyle}
            />
            {!isSingleSeries && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />}
            {exhibit.series.map((s) => (
              <Line
                key={s.name}
                dataKey={s.name}
                stroke={s.highlight ? '#003A70' : '#C8D7E8'}
                strokeWidth={s.highlight ? 2.5 : 1.5}
                dot={s.highlight ? { r: 3, fill: '#003A70', strokeWidth: 0 } : { r: 2.5, fill: '#C8D7E8', strokeWidth: 0 }}
              >
                {s.highlight && (
                  <LabelList dataKey={s.name} position="top" fontSize={11} fontFamily="var(--font-geist-mono)" formatter={(v) => formatTick(Number(v), exhibit.yAxisFormat)} fill="#374151" />
                )}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
        <Footnote text={exhibit.footnote} />
      </div>
    </div>
  );
}

// ── Waterfall ──────────────────────────────────────────────────────────────────

function WaterfallDisplay({ exhibit, mode }: { exhibit: WaterfallExhibit; mode: 'inline' | 'panel' }) {
  let runningTotal = 0;

  const data = exhibit.items.map((item) => {
    if (item.isTotal) {
      const base = 0;
      const value = item.value;
      runningTotal = value;
      return { name: item.label, base, delta: value, isTotal: true, isPositive: true };
    }
    const base = runningTotal;
    const delta = item.value;
    runningTotal += delta;
    return { name: item.label, base, delta, isTotal: false, isPositive: delta >= 0 };
  });

  return (
    <div>
      {mode === 'panel' ? (
        <PanelHeader exhibit={exhibit} />
      ) : (
        <div className="px-5 pt-5">
          <p className="text-sm font-semibold text-neutral-900 mb-0.5">{exhibit.title}</p>
          {'subtitle' in exhibit && exhibit.subtitle && (
            <p className="text-xs text-neutral-500 mb-4">{exhibit.subtitle}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <ComposedChart data={data} barCategoryGap="20%">
            <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value, name) =>
                name === 'base' ? null : formatTick(Number(value), exhibit.yAxisFormat)
              }
              contentStyle={tooltipStyle}
            />
            {/* Invisible base bar */}
            <Bar dataKey="base" stackId="wf" fill="transparent" />
            {/* Visible delta bar */}
            <Bar dataKey="delta" stackId="wf" radius={[2, 2, 0, 0]}>
              <LabelList dataKey="delta" position="top" fontSize={11} fontFamily="var(--font-geist-mono)" formatter={(v) => formatTick(Number(v), exhibit.yAxisFormat)} fill="#374151" />
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isTotal ? '#404040' : entry.isPositive ? '#003A70' : '#EF4444'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        <Footnote text={exhibit.footnote} />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ExhibitDisplay({ exhibit, mode = 'inline' }: ExhibitDisplayProps) {
  if (exhibit.type === 'table') return <TableDisplay exhibit={exhibit} mode={mode} />;
  if (exhibit.type === 'bar' || exhibit.type === 'grouped_bar') return <BarDisplay exhibit={exhibit as ChartExhibit} mode={mode} />;
  if (exhibit.type === 'line') return <LineDisplay exhibit={exhibit as ChartExhibit} mode={mode} />;
  if (exhibit.type === 'waterfall') return <WaterfallDisplay exhibit={exhibit as WaterfallExhibit} mode={mode} />;
  return null;
}
