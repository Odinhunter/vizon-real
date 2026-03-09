/**
 * Content registry — unified lookup for all user-facing diagnostic content.
 *
 * This is the single import point for UI components that need case narratives,
 * probe questions, and track introductions. The engine never imports from here.
 */

import type { CaseContent, ProbeVariantContent, TrackIntroContent, ProbeExhibit } from './types';

import { consultingCaseContent } from './cases/consulting';
import { financeCaseContent } from './cases/finance';
import { analyticsCaseContent } from './cases/analytics';

import { consultingProbeContent } from './probes/consulting';
import { financeProbeContent } from './probes/finance';
import { analyticsProbeContent } from './probes/analytics';

// ── Merged registries ─────────────────────────────────────────────────────────

const allCaseContent: Record<string, CaseContent> = {
  ...consultingCaseContent,
  ...financeCaseContent,
  ...analyticsCaseContent,
};

const allProbeContent: Record<string, ProbeVariantContent> = {
  ...consultingProbeContent,
  ...financeProbeContent,
  ...analyticsProbeContent,
};

// ── Track intro content ────────────────────────────────────────────────────────

const trackIntroContent: Record<string, TrackIntroContent> = {
  consulting: {
    trackId: 'consulting',
    displayName: 'Management Consulting',
    tagline: 'Assess your consulting readiness',
    description:
      'This diagnostic evaluates your ability to structure ambiguous business problems, form hypotheses, reason analytically, communicate findings, and make clear recommendations — the five core skills that define consulting performance.',
    timeEstimate: '25–35 minutes',
    howItWorks: [
      'You will work through 3 progressive business cases, each more complex than the last.',
      'Each case begins with a situation and context. Read it carefully — you will respond to 5 probes based on it.',
      'Write freely. There are no trick questions. The diagnostic looks for how you think, not a specific answer.',
      'Your responses are assessed by a combination of structured prompts and AI signal extraction.',
    ],
  },
  finance: {
    trackId: 'finance',
    displayName: 'Finance & Investment',
    tagline: 'Assess your investment analysis readiness',
    description:
      'This diagnostic evaluates your ability to interpret financial signals, form an investment thesis, reason about capital allocation, assess risk, and deliver a clear investment recommendation — the five core skills that define finance performance.',
    timeEstimate: '25–35 minutes',
    howItWorks: [
      'You will work through 3 progressive investment cases, each with greater financial complexity.',
      'Each case provides a company context and financial situation. Read it carefully before responding.',
      'Write freely. The diagnostic evaluates your reasoning process, not just your final answer.',
      'Your responses are assessed by a combination of structured prompts and AI signal extraction.',
    ],
  },
  analytics: {
    trackId: 'analytics',
    displayName: 'Data Analytics',
    tagline: 'Assess your analytics readiness',
    description:
      'This diagnostic evaluates your ability to interpret data, decompose analytical problems, apply statistical reasoning, synthesize insights, and communicate findings — the five core skills that define analytics performance.',
    timeEstimate: '25–35 minutes',
    howItWorks: [
      'You will work through 3 progressive analytical cases, each with more complex data and ambiguity.',
      'Each case describes a business situation and data environment. Read it carefully.',
      'Write freely. The diagnostic looks for how you reason through data, not a specific answer.',
      'Your responses are assessed by a combination of structured prompts and AI signal extraction.',
    ],
  },
};

// ── Track card content (for landing page) ─────────────────────────────────────

export interface TrackCardContent {
  trackId: string;
  displayName: string;
  shortDescription: string;
  skills: string[];
}

export const trackCards: TrackCardContent[] = [
  {
    trackId: 'consulting',
    displayName: 'Management Consulting',
    shortDescription:
      'Assess your ability to structure problems, form hypotheses, reason analytically, and make clear recommendations.',
    skills: ['Problem Structuring', 'Hypothesis Thinking', 'Analytical Reasoning', 'Communication', 'Decision Making'],
  },
  {
    trackId: 'finance',
    displayName: 'Finance & Investment',
    shortDescription:
      'Assess your ability to interpret financial signals, form investment theses, evaluate risk, and deliver investment recommendations.',
    skills: ['Signal Interpretation', 'Thesis Formation', 'Capital Allocation', 'Risk Assessment', 'Investment Clarity'],
  },
  {
    trackId: 'analytics',
    displayName: 'Data Analytics',
    shortDescription:
      'Assess your ability to interpret data, decompose analytical problems, apply statistical reasoning, and communicate insights.',
    skills: ['Data Interpretation', 'Problem Decomposition', 'Statistical Reasoning', 'Insight Synthesis', 'Communication'],
  },
];

// ── Lookup functions ──────────────────────────────────────────────────────────

/**
 * Returns case content by caseId, or null if not found.
 */
export function getCaseContent(caseId: string): CaseContent | null {
  return allCaseContent[caseId] ?? null;
}

/**
 * Returns probe variant content by variantId, or null if not found.
 */
export function getProbeContent(variantId: string): ProbeVariantContent | null {
  return allProbeContent[variantId] ?? null;
}

/**
 * Returns track intro content by trackId, or null if not found.
 */
export function getTrackIntro(trackId: string): TrackIntroContent | null {
  return trackIntroContent[trackId] ?? null;
}

/**
 * Returns the exhibit for a specific probe within a specific case, or null if none.
 * Exhibits are case-scoped — the same probe variant shows different data per case.
 */
export function getProbeExhibit(caseId: string, variantId: string): ProbeExhibit | null {
  return allCaseContent[caseId]?.probeExhibits?.[variantId] ?? null;
}

/**
 * Serializes a ProbeExhibit into a plain-text description for the AI batch extraction prompt.
 * Gives the model an accurate account of what data the candidate was looking at when responding.
 */
export function serializeExhibitForAI(exhibit: ProbeExhibit): string {
  if (exhibit.type === 'table') {
    const header = `[Exhibit: ${exhibit.title}${exhibit.subtitle ? ` — ${exhibit.subtitle}` : ''}]`;
    const colRow = ['', ...exhibit.columns].join(' | ');
    const divider = exhibit.columns.map(() => '---').join(' | ');
    const rows = exhibit.rows
      .filter((r) => !r.isSpacer)
      .map((r) => [r.label, ...r.values.map(String)].join(' | '))
      .join('\n');
    const footer = exhibit.footnote ? `\n${exhibit.footnote}` : '';
    return `${header}\n${colRow}\n${divider}\n${rows}${footer}`;
  }

  if (exhibit.type === 'waterfall') {
    const header = `[Exhibit: ${exhibit.title}${exhibit.subtitle ? ` — ${exhibit.subtitle}` : ''}]`;
    const rows = exhibit.items
      .map((item) => {
        const sign = item.isTotal ? '' : item.value >= 0 ? '+' : '';
        const fmt = formatValue(item.value, exhibit.yAxisFormat);
        return `  ${item.label}: ${item.isTotal ? fmt : sign + fmt}${item.isTotal ? ' (total)' : ''}`;
      })
      .join('\n');
    const footer = exhibit.footnote ? `\n${exhibit.footnote}` : '';
    return `${header}\n${rows}${footer}`;
  }

  // bar, grouped_bar, line
  const header = `[Exhibit: ${exhibit.title}${exhibit.subtitle ? ` — ${exhibit.subtitle}` : ''}]`;
  const colRow = ['Series', ...exhibit.xKeys].join(' | ');
  const divider = exhibit.xKeys.map(() => '---').join(' | ');
  const rows = exhibit.series
    .map((s) => {
      const vals = s.values.map((v) => formatValue(v, exhibit.yAxisFormat));
      return [s.name, ...vals].join(' | ');
    })
    .join('\n');
  const footer = exhibit.footnote ? `\n${exhibit.footnote}` : '';
  return `${header}\n${colRow}\n${divider}\n${rows}${footer}`;
}

function formatValue(value: number, format?: string): string {
  if (format === 'percent') return `${value}%`;
  if (format === 'currency') return `$${value}`;
  if (format === 'multiple') return `${value}x`;
  return String(value);
}

export type { CaseContent, ProbeVariantContent, TrackIntroContent, ProbeExhibit };
