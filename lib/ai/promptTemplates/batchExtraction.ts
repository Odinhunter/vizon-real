/**
 * Batch signal extraction prompt template.
 *
 * Builds a single prompt covering all probe responses in a session.
 * Sending the full session at once gives the model cross-probe context —
 * it can observe whether performance degrades under pressure, whether the
 * candidate engages with case-specific data, and whether responses are
 * consistent or contradictory across the session arc.
 *
 * This replaces 15 individual extraction calls with one.
 */

import type { PendingResponse } from '@/engine/diagnosticSession';

const CASE_STAGE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Case 1 — Baseline',
  2: 'Case 2 — Escalation',
  3: 'Case 3 — Pressure',
};

const CONTEXT_LEVEL_LABELS: Record<'low' | 'medium' | 'high', string> = {
  low: 'low complexity',
  medium: 'medium complexity',
  high: 'high complexity',
};

/**
 * Formats the candidate's answer block for a single probe, adapted to the probe's format.
 * For MCQ/multi-select probes, the model sees which option(s) were chosen alongside
 * all available options — so it can assess whether the selection itself shows skill signal.
 */
function formatResponseBlock(p: PendingResponse): string {
  if (p.format === 'mcq_plus_reasoning' && p.options && p.options.length > 0) {
    const optionsList = p.options.map((o) => `  ${o.id}. ${o.text}`).join('\n');
    const selected = p.selectedOptionId ?? '(no selection recorded)';
    return `Available options:\n${optionsList}\nCandidate selected: ${selected}\nCandidate reasoning: ${p.rawResponse || '(no reasoning provided)'}`;
  }

  if (p.format === 'multi_select_plus_reasoning' && p.options && p.options.length > 0) {
    const optionsList = p.options.map((o) => `  ${o.id}. ${o.text}`).join('\n');
    const selected =
      p.selectedOptionIds && p.selectedOptionIds.length > 0
        ? p.selectedOptionIds.join(', ')
        : '(no selection recorded)';
    return `Available options:\n${optionsList}\nCandidate selected: ${selected}\nCandidate reasoning: ${p.rawResponse || '(no reasoning provided)'}`;
  }

  // free_text (default)
  return `Candidate response: ${p.rawResponse || '(no response provided)'}`;
}

export function buildBatchExtractionPrompt(probes: PendingResponse[]): string {
  const probeBlocks = probes
    .map((p, i) => {
      const stageLabel = CASE_STAGE_LABELS[p.caseStage];
      const complexityLabel = CONTEXT_LEVEL_LABELS[p.contextLevel];

      const exhibitBlock = p.exhibitContext
        ? `Data exhibit shown to candidate:\n${p.exhibitContext}`
        : 'Data exhibit: none';

      const responseBlock = formatResponseBlock(p);

      return `--- PROBE ${i + 1} (${stageLabel} / ${complexityLabel}) ---
Skill being assessed: ${p.skillId}
Case context: ${p.caseContext || '(not provided)'}
${exhibitBlock}
Question asked: ${p.probeQuestion || '(not provided)'}
Scoring guidance: ${p.scoringGuidance || '(not provided)'}
${responseBlock}`;
    })
    .join('\n\n');

  return `You are a behavioral signal extraction engine evaluating a candidate's full diagnostic session.

The session covers 3 progressive business cases: Baseline → Escalation → Pressure. Later probes test the same skills under greater ambiguity and time pressure. The candidate's responses across the session arc are visible to you — use this context to assess whether performance is consistent, improving, or degrading under pressure.

STRICT RULES:
- Extract structured measurements ONLY.
- Do NOT score the candidate.
- Do NOT evaluate overall performance.
- Do NOT give career advice or benchmarks.
- Do NOT fabricate observations not grounded in the candidate's actual response.
- Do NOT add commentary outside the JSON array.
- Never wrap JSON in markdown code blocks.
- Measure each probe independently AND with awareness of the full session arc.

MEASUREMENT DEFINITIONS:

signal_strength (0.0 to 1.0):
  How clearly the target skill signal is present in this response, assessed against the scoring guidance.
  0.0 = no observable signal for the target skill; response is irrelevant, generic, or does not engage with the case
  0.5 = partial signal; some relevant reasoning but missing key elements from the scoring guidance
  1.0 = clear, well-grounded signal; response engages specifically with the case data and satisfies the scoring guidance criteria

response_quality (0.0 to 1.0):
  How coherent, complete, and structured the response is overall.
  0.0 = incoherent, off-topic, or too short to assess
  0.5 = partially coherent with notable gaps in reasoning or structure
  1.0 = well-structured, complete, and clearly reasoned

behavioral_signals — observe each independently (0.0 to 1.0):
  framing_quality: how well the candidate frames the problem or context before diving into analysis
  reasoning_confidence: how decisively and clearly the candidate reasons without excessive hedging
  communication_clarity: how clearly and concisely the candidate communicates ideas

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly ${probes.length} objects, one per probe, in the same order as presented.
Each object must match this exact structure:
{
  "signal_strength": 0.0 to 1.0,
  "response_quality": 0.0 to 1.0,
  "behavioral_signals": {
    "framing_quality": 0.0 to 1.0,
    "reasoning_confidence": 0.0 to 1.0,
    "communication_clarity": 0.0 to 1.0
  }
}

Do not include any additional keys. All values must be numbers between 0 and 1 inclusive.

---

SESSION PROBES (${probes.length} total):

${probeBlocks}`;
}
