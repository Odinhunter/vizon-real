/**
 * AI signal extraction orchestrator.
 *
 * Connects prompt templates, model transport, and schema validation
 * into a single extraction call. This layer is responsible for enforcing
 * the AI output contract — if the model returns invalid structure, it
 * retries once before failing hard.
 *
 * This file is stateless and does not touch session, engine, or scoring.
 */

import {
  ExtractionInput,
  ProbeExtractionResult,
  ProbeExtractionResultSchema,
  ExtractionFormatError,
} from "./signalSchema";
import { callModel } from "./modelClient";
import { buildConsultingExtractionPrompt } from "./promptTemplates/consultingExtraction";

const RETRY_PREFIX =
  "REMINDER: Return only valid JSON matching the required structure. Do not include any extra text.\n\n";

/**
 * Extracts behavioral signals from a user response via AI.
 *
 * Routes to the correct prompt template by track, calls the model,
 * and validates the output against the ProbeExtractionResultSchema.
 *
 * Retries once on parse/validation failure because LLMs occasionally
 * return malformed output on the first attempt. A single retry with
 * a reinforcement prefix resolves most transient formatting issues.
 *
 * Strict validation is required because downstream layers depend on
 * a guaranteed output shape — loose or partial results would corrupt
 * the diagnostic pipeline.
 */
export async function extractSignals(
  input: ExtractionInput
): Promise<ProbeExtractionResult> {
  const prompt = buildPromptForTrack(input);

  // First attempt
  const firstResult = await callAndValidate(prompt);
  if (firstResult) return firstResult;

  // Retry with reinforcement prefix
  const retryResult = await callAndValidate(RETRY_PREFIX + prompt);
  if (retryResult) return retryResult;

  throw new ExtractionFormatError(
    "AI output failed schema validation after retry."
  );
}

function buildPromptForTrack(input: ExtractionInput): string {
  switch (input.trackId) {
    case "consulting":
      return buildConsultingExtractionPrompt(input);
    default:
      throw new Error("Extraction not implemented for this track yet");
  }
}

/**
 * Calls the model, parses JSON, and validates against the ProbeExtractionResultSchema.
 * Returns null on any parse or validation failure instead of throwing,
 * so the caller can decide whether to retry.
 */
async function callAndValidate(
  prompt: string
): Promise<ProbeExtractionResult | null> {
  const response = await callModel({ prompt, temperature: 0 });

  try {
    const parsed = JSON.parse(response.rawText.trim());
    return ProbeExtractionResultSchema.parse(parsed);
  } catch {
    return null;
  }
}
