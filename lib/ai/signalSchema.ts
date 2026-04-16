import { z } from "zod";
/**
 * AI Signal Extraction schema contract for Vizon.
 *
 * This file defines the strict types and Zod validation schemas used for
 * AI extraction outputs. It is intentionally standalone and must remain
 * independent from engine, session, and UI layers.
 */

/**
 * Supported diagnostic tracks for extraction input routing.
 */

export enum TrackId {
  CONSULTING = "consulting",
  FINANCE = "finance",
  ANALYTICS = "analytics",
}
/**
 * Standardized signal strength categories.
 * Constrains extracted output to a small, consistent vocabulary.
 */

export enum SignalStrength {
  WEAK = "weak",
  MODERATE = "moderate",
  STRONG = "strong",
}
/**
 * Validates one extracted signal evidence item from AI output.
 * Confidence is bounded to [0, 1] to enforce normalized certainty values.
 */

export const ExtractedSignalSchema = z
  .object({
    signalType: z.string().min(1),
    evidence: z.string().min(1),
    strength: z.nativeEnum(SignalStrength),
    confidence: z.number().min(0).max(1).finite(),
  })
  .strict();

/**
 * Enforces the full AI extraction output shape.
 * `.strict()` blocks additional/hallucinated fields outside this contract.
 */
export const ExtractionResultSchema = z
  .object({
    extractedSignals: z.array(ExtractedSignalSchema),
    missingSignals: z.array(z.string().min(1)),
    noiseIndicators: z.array(z.string().min(1)),
  })
  .strict();

export type ExtractedSignal = z.infer<typeof ExtractedSignalSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

/**
 * Behavioral signal dimensions extracted per probe response.
 * These are AI observations only — never used directly in scoring.
 */
export const BehavioralSignalsSchema = z
  .object({
    framing_quality: z.number().min(0).max(1).finite(),
    reasoning_confidence: z.number().min(0).max(1).finite(),
    communication_clarity: z.number().min(0).max(1).finite(),
  })
  .strip();

/**
 * Probe-level extraction output used by the scoring pipeline.
 *
 * probe_index     — 1-based position echoed from the prompt block header, used for
 *                   order-independent matching when the route applies scores to evidence.
 * signal_strength — how clearly the target skill signal is present (0–1)
 * response_quality — how coherent and complete the response is (0–1)
 * key_observations — chain-of-thought reasoning the model produces before scoring
 * behavioral_signals — behavioral dimensions observed, aggregated separately from scores
 */
export const ProbeExtractionResultSchema = z
  .object({
    probe_index: z.number().int().min(1),
    key_observations: z.array(z.string()).min(1).max(5),
    signal_strength: z.number().min(0).max(1).finite(),
    response_quality: z.number().min(0).max(1).finite(),
    behavioral_signals: BehavioralSignalsSchema,
  })
  .strip();

export type BehavioralSignals = z.infer<typeof BehavioralSignalsSchema>;
export type ProbeExtractionResult = z.infer<typeof ProbeExtractionResultSchema>;

/**
 * Batch extraction result — an ordered array of ProbeExtractionResult objects,
 * one per probe, matching the order probes were presented in the session.
 */
export const BatchExtractionResultSchema = z.array(ProbeExtractionResultSchema);
export type BatchExtractionResult = z.infer<typeof BatchExtractionResultSchema>;

/**
 * Internal contract passed into the AI extraction layer.
 * This input is not validated here because it originates from trusted app internals.
 */
export type ExtractionInput = {
  trackId: TrackId;
  skillTargeted: string;
  probeId: string;
  caseContext: string;
  probeQuestion: string;
  userResponse: string;
  expectedSignalCategories?: string[];
};
/**
 * Error used when AI output does not satisfy the extraction schemas.
 */

export class ExtractionFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtractionFormatError";
  }
}
