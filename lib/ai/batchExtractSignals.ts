/**
 * Batch AI signal extraction for a complete diagnostic session.
 *
 * Sends all probe responses in a single model call rather than 15 individual calls.
 * This gives the model full session context and reduces API overhead by 14 calls.
 *
 * Returns an ordered array of ProbeExtractionResult objects matching the input order.
 * On validation failure, retries once with a reinforcement prefix.
 * Throws if the output cannot be validated after retry.
 */

import type { PendingResponse } from '@/engine/diagnosticSession';
import { BatchExtractionResult, BatchExtractionResultSchema, ExtractionFormatError } from './signalSchema';
import { callModel } from './modelClient';
import { buildBatchExtractionPrompt } from './promptTemplates/batchExtraction';

const RETRY_PREFIX =
  'REMINDER: Return only a valid JSON array. No markdown, no extra text, no code blocks.\n\n';

export async function batchExtractSignals(
  probes: PendingResponse[]
): Promise<BatchExtractionResult> {
  if (probes.length === 0) return [];

  const prompt = buildBatchExtractionPrompt(probes);

  const first = await callAndValidate(prompt, probes.length);
  if (first) return first;

  const retry = await callAndValidate(RETRY_PREFIX + prompt, probes.length);
  if (retry) return retry;

  throw new ExtractionFormatError(
    `Batch extraction failed schema validation after retry. Expected ${probes.length} results.`
  );
}

async function callAndValidate(
  prompt: string,
  expectedCount: number
): Promise<BatchExtractionResult | null> {
  const response = await callModel({ prompt, temperature: 0 });

  try {
    const parsed = JSON.parse(response.rawText.trim());
    const validated = BatchExtractionResultSchema.parse(parsed);

    if (validated.length < expectedCount) {
      console.warn(
        `Batch extraction returned ${validated.length} results, expected ${expectedCount} — too few, discarding`
      );
      return null;
    }

    if (validated.length > expectedCount) {
      console.warn(
        `Batch extraction returned ${validated.length} results, expected ${expectedCount} — trimming to first ${expectedCount}`
      );
    }

    return validated.slice(0, expectedCount);
  } catch {
    return null;
  }
}
