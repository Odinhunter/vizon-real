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
} from 'recharts';

interface ExhibitDisplayProps {
  exhibit: ProbeExhibit;
  mode?: 'inline' | 'panel';
}

// ── Formatters ─────────────────────────────────────────────────────────────────

function formatTick(value: number, format?: string): string {
  if (format === 'percent') return `${value}%`;
  if (format === 'currency') return `$${value}`;
  if (format === 'number') return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : String(value);
  return String(value);
}

// ── Panel Header ───────────────────────────────────────────────────────────────

function PanelHeader({ exhibit }: { exhibit: ProbeExhibit }) {
  return (
    <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
          Case Reference Data
        </span>
        <span className="px-2 py-0.5 text-[10px] font-mono border border-neutral-200 text-neutral-500 uppercase tracking-wider">
          {exhibit.type === 'table' ? 'TABLE' : 'CHART'}
        </span>
      </div>
      <p className="font-mono text-sm font-semibold text-neutral-900">{exhibit.title}</p>
      {'subtitle' in exhibit && exhibit.subtitle && (
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{exhibit.subtitle}</p>
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
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-2 pr-4 text-xs font-mono font-medium text-neutral-400 uppercase tracking-wide w-1/2" />
              {exhibit.columns.map((col) => (
                <th
                  key={col}
                  className="text-right py-2 px-2 text-xs font-mono font-medium text-neutral-400 uppercase tracking-wide"
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
                  className={`border-b border-neutral-100 ${row.isHighlight ? 'bg-neutral-50' : ''}`}
                >
                  <td className={`py-2 pr-4 text-neutral-700 font-mono text-xs ${row.isBold ? 'font-semibold' : ''}`}>
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`py-2 px-2 text-right text-neutral-800 font-mono text-xs ${row.isBold ? 'font-semibold' : ''}`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {exhibit.footnote && (
          <p className="text-xs font-mono text-neutral-400 mt-3">{exhibit.footnote}</p>
        )}
      </div>
    </div>
  );
}

// ── Bar / Grouped Bar ──────────────────────────────────────────────────────────

function BarDisplay({ exhibit, mode }: { exhibit: ChartExhibit; mode: 'inline' | 'panel' }) {
  const isGrouped = exhibit.type === 'grouped_bar';
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
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barCategoryGap={isGrouped ? '20%' : '30%'}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatTick(v, exhibit.yAxisFormat)}
            />
            <Tooltip
              formatter={(value) => formatTick(Number(value), exhibit.yAxisFormat)}
              contentStyle={{ fontSize: 11, borderRadius: 0, border: '1px solid #e5e5e5' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            {exhibit.series.map((s) => (
              <Bar key={s.name} dataKey={s.name} fill={s.highlight ? '#1A56DB' : '#D4D4D4'} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        {exhibit.footnote && (
          <p className="text-xs font-mono text-neutral-400 mt-2">{exhibit.footnote}</p>
        )}
      </div>
    </div>
  );
}

// ── Line ───────────────────────────────────────────────────────────────────────

function LineDisplay({ exhibit, mode }: { exhibit: ChartExhibit; mode: 'inline' | 'panel' }) {
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
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatTick(v, exhibit.yAxisFormat)}
            />
            <Tooltip
              formatter={(value) => formatTick(Number(value), exhibit.yAxisFormat)}
              contentStyle={{ fontSize: 11, borderRadius: 0, border: '1px solid #e5e5e5' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            {exhibit.series.map((s) => (
              <Line
                key={s.name}
                dataKey={s.name}
                stroke={s.highlight ? '#1A56DB' : '#D4D4D4'}
                strokeWidth={s.highlight ? 2.5 : 1.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {exhibit.footnote && (
          <p className="text-xs font-mono text-neutral-400 mt-2">{exhibit.footnote}</p>
        )}
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
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatTick(v, exhibit.yAxisFormat)}
            />
            <Tooltip
              formatter={(value, name) =>
                name === 'base' ? null : formatTick(Number(value), exhibit.yAxisFormat)
              }
              contentStyle={{ fontSize: 11, borderRadius: 0, border: '1px solid #e5e5e5' }}
            />
            {/* Invisible base bar */}
            <Bar dataKey="base" stackId="wf" fill="transparent" />
            {/* Visible delta bar */}
            <Bar dataKey="delta" stackId="wf" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isTotal ? '#404040' : entry.isPositive ? '#1A56DB' : '#EF4444'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        {exhibit.footnote && (
          <p className="text-xs font-mono text-neutral-400 mt-2">{exhibit.footnote}</p>
        )}
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
