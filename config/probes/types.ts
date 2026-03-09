/**
 * Generic, track-agnostic probe types.
 *
 * All track-specific probe files import from here.
 * Engine files depend only on these types — never on track-specific probe files.
 */

export type SignalCategory =
  | 'problem_understanding'
  | 'thought_structure'
  | 'analytical_depth'
  | 'judgment_decision'
  | 'engagement_effort';

export type ContextLevel = 'low' | 'medium' | 'high';

export type ProbeVariant = {
  variantId: string;
  contextLevel: ContextLevel;
  description: string;
};

export type Probe = {
  probeId: string;
  skillId: string;
  probeType: string;
  description: string;
  primarySignals: SignalCategory[];
  secondarySignals: SignalCategory[];
  variants: ProbeVariant[];
};
