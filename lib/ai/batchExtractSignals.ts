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
  probes: PendingResponse[],
  trackId = 'consulting'
): Promise<BatchExtractionResult> {
  if (probes.length === 0) return [];

  const { system, user } = buildBatchExtractionPrompt(probes, trackId);

  const first = await callAndValidate(system, user, probes.length);
  if (first) return first;

  const retry = await callAndValidate(system, RETRY_PREFIX + user, probes.length);
  if (retry) return retry;

  throw new ExtractionFormatError(
    `Batch extraction failed schema validation after retry. Expected ${probes.length} results.`
  );
}

async function callAndValidate(
  system: string,
  prompt: string,
  expectedCount: number
): Promise<BatchExtractionResult | null> {
  const response = await callModel({ system, prompt, temperature: 0.2 });

  try {
    // Strip markdown code fences if present
    let text = response.rawText.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(text);
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
  } catch (err) {
    console.error(
      'Batch extraction parse/validation failed. Raw AI response:',
      response.rawText.substring(0, 2000)
    );
    console.error('Parse error:', err);
    return null;
  }
}
