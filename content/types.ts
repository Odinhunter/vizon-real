/**
 * Content layer types for the diagnostic experience.
 *
 * These types hold user-facing content — narratives, questions, instructions,
 * and data exhibits — that are separate from the engine's configuration types.
 *
 * The content layer is consumed by the UI and AI extraction. The engine never reads it.
 */

// ── Exhibit types ──────────────────────────────────────────────────────────────

export type YAxisFormat = 'number' | 'percent' | 'currency' | 'multiple';

/**
 * A single data series in a chart. highlight=true renders in the primary dark color;
 * all other series render in muted gray — the standard McKinsey visual convention.
 */
export interface ExhibitSeries {
  name: string;
  values: number[];
  /** If true, this series renders in primary color. Others render as secondary/gray. */
  highlight?: boolean;
}

/**
 * Bar chart (single or grouped) and line chart.
 * All share xKeys + series structure.
 */
export interface ChartExhibit {
  type: 'bar' | 'grouped_bar' | 'line';
  title: string;
  /** The "so what" — one sentence stating the insight the chart shows. */
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xKeys: string[];
  series: ExhibitSeries[];
  yAxisFormat?: YAxisFormat;
  footnote?: string;
}

/**
 * A single item in a waterfall chart.
 * isTotal=true renders as a full anchored bar (base or final value).
 * isTotal=false renders as a floating delta bar (positive=dark, negative=red).
 */
export interface WaterfallItem {
  label: string;
  value: number;
  /** True for the opening and closing absolute-value bars. */
  isTotal?: boolean;
}

/**
 * Waterfall / bridge chart. Used for cost bridges, margin bridges, etc.
 * Items are ordered and rendered left-to-right.
 */
export interface WaterfallExhibit {
  type: 'waterfall';
  title: string;
  subtitle?: string;
  items: WaterfallItem[];
  yAxisFormat?: YAxisFormat;
  footnote?: string;
}

/**
 * A single row in a data table.
 */
export interface TableRow {
  label: string;
  values: (string | number)[];
  /** Renders label and values in bold — used for totals/subtotals. */
  isBold?: boolean;
  /** Inserts a blank spacer row for visual grouping. */
  isSpacer?: boolean;
  /** Highlights the row with a light background — used for key callout rows. */
  isHighlight?: boolean;
}

/**
 * Data table exhibit. Used for financial summaries, comparisons, and multi-column data.
 */
export interface TableExhibit {
  type: 'table';
  title: string;
  subtitle?: string;
  /** Column headers. First column (row labels) is implicit and not listed here. */
  columns: string[];
  rows: TableRow[];
  footnote?: string;
}

/**
 * Union of all exhibit types. The `type` discriminant drives rendering.
 */
export type ProbeExhibit = ChartExhibit | WaterfallExhibit | TableExhibit;

// ── Case content ───────────────────────────────────────────────────────────────

/**
 * Rich user-facing content for a diagnostic case.
 * Keyed by caseId in the content registries.
 */
export interface CaseContent {
  caseId: string;
  title: string;
  /** Name of the company or organization in the scenario. */
  company: string;
  /** The user's role in this scenario. */
  role: string;
  /** Opening narrative paragraph — sets the scene. */
  narrative: string;
  /** Current situation — specific facts and context. */
  situation: string;
  /** The core question or problem the user must address. */
  problemStatement: string;
  /** Describes what data exhibits will appear here when content is fully built out. */
  dataExhibitHint: string;
  /**
   * Probe-level data exhibits, keyed by variantId.
   * Only probes that need an exhibit have an entry here.
   * Exhibits are case-specific — the same probe variant used in two different
   * cases can show completely different data.
   */
  probeExhibits?: Record<string, ProbeExhibit>;
}

// ── Probe response format ──────────────────────────────────────────────────────

/**
 * The interaction format for a probe.
 *
 * free_text              — open textarea only. No options presented.
 * mcq_plus_reasoning     — single-select from options, then explain reasoning in textarea.
 * multi_select_plus_reasoning — select one or more options, then explain reasoning in textarea.
 */
export type ProbeFormat = 'free_text' | 'mcq_plus_reasoning' | 'multi_select_plus_reasoning';

/**
 * A single selectable option in an MCQ or multi-select probe.
 */
export interface ProbeOption {
  /** Short identifier shown to the user — typically 'A', 'B', 'C', 'D'. */
  id: string;
  /** Full option text presented to the user. */
  text: string;
}

// ── Probe content ──────────────────────────────────────────────────────────────

/**
 * User-facing content for a single probe variant.
 * Keyed by variantId in the content registries.
 */
export interface ProbeVariantContent {
  variantId: string;
  /** The question presented to the user. */
  question: string;
  /** Instruction for how to approach the response. */
  instruction: string;
  /**
   * Scoring guidance for AI extraction.
   * Describes what a strong response references, what signals to look for,
   * and what a weak response typically misses. Never shown to the user.
   */
  scoringGuidance: string;
  /**
   * The interaction format for this probe.
   * Determines what UI the user sees and how the answer payload is structured.
   */
  format: ProbeFormat;
  /**
   * Selectable options. Required when format is mcq_plus_reasoning or
   * multi_select_plus_reasoning. Must be omitted for free_text probes.
   */
  options?: ProbeOption[];
  /**
   * Maximum number of options the user may select.
   * Only relevant for multi_select_plus_reasoning. Omit for no limit.
   */
  maxSelections?: number;
}

// ── Track intro content ────────────────────────────────────────────────────────

/**
 * Introductory content for a career track, shown before the first case.
 */
export interface TrackIntroContent {
  trackId: string;
  displayName: string;
  tagline: string;
  description: string;
  timeEstimate: string;
  howItWorks: string[];
}
