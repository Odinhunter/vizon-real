/**
 * Batch signal extraction prompt template.
 *
 * Builds a system + user prompt covering all probe responses in a session.
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

export interface BatchExtractionPrompt {
  system: string;
  user: string;
}

export function buildBatchExtractionPrompt(probes: PendingResponse[]): BatchExtractionPrompt {
  const system = `You are a senior management consulting interviewer and behavioral assessor. You have conducted thousands of case interviews at McKinsey, BCG, and Bain. Your task is to extract precise, calibrated measurements from a candidate's diagnostic session.

MEASUREMENT DEFINITIONS WITH CALIBRATION ANCHORS:

signal_strength (0.0 to 1.0) — How clearly the target skill signal is present, assessed against the scoring guidance:
  0.0–0.1: No signal at all. Response is gibberish, completely off-topic, or shows zero engagement with the question.
  0.1–0.3: Minimal signal. Response may touch on the topic but demonstrates no real understanding. Generic statements, restating the question, or surface-level platitudes without substance.
  0.3–0.5: Weak signal. Some relevant concepts mentioned but analysis is shallow, misses key elements from the scoring guidance, or applies the wrong framework. A candidate with basic business knowledge but no consulting training.
  0.5–0.7: Moderate signal. Engages with the case data and addresses some scoring guidance criteria, but has notable gaps in depth, specificity, or rigor. Competent but not impressive.
  0.7–0.85: Strong signal. Demonstrates clear command of the skill, engages specifically with case data, and satisfies most scoring guidance criteria. Minor gaps in sophistication or completeness.
  0.85–1.0: Exceptional signal. Reserved for responses that would impress a senior partner — precise framework application, novel insight, specific data engagement, and fully satisfies all scoring guidance criteria. Very few responses deserve this range.

response_quality (0.0 to 1.0) — How coherent, complete, and structured the response is:
  0.0–0.1: No meaningful response. Gibberish, single word, or completely empty.
  0.1–0.3: Poor quality. Disorganized, hard to follow, major logical gaps, or far too brief to demonstrate competence.
  0.3–0.5: Below average. Some structure visible but lacks logical flow, contains contradictions, or is notably incomplete. Would not pass a first-round screen.
  0.5–0.7: Adequate. Organized with identifiable reasoning but lacks the crispness, depth, or polish expected in consulting. Missing key points or analysis steps.
  0.7–0.85: Good quality. Well-structured with clear reasoning, covers main points, and communicates effectively. Minor improvements possible.
  0.85–1.0: Exceptional. Client-ready quality — impeccable structure, thorough coverage, clear and concise. Very few responses deserve this range.

behavioral_signals — observe each independently (0.0 to 1.0):
  framing_quality: How well the candidate frames the problem or context before diving into analysis. 0.0 = no framing, dives straight in. 0.5 = basic framing present but generic. 1.0 = crisp, structured framing that sets up the analysis and shows understanding of the problem space.
  reasoning_confidence: How decisively and clearly the candidate reasons without excessive hedging. 0.0 = extremely uncertain, constant hedging, no conviction. 0.5 = some assertions but frequently qualifies or backtracks. 1.0 = decisive reasoning with appropriate conviction and clear logic chain.
  communication_clarity: How clearly and concisely the candidate communicates ideas. 0.0 = muddled, hard to follow, verbose without substance. 0.5 = understandable but could be more concise or better organized. 1.0 = crystal clear, concise, every sentence adds value.

SCORING PHILOSOPHY:
- Be a TOUGH grader. You are evaluating against MBB consulting standards, not general competence.
- The median response from an unprepared candidate should score 0.25–0.40 on signal_strength.
- Scores above 0.7 should be reserved for genuinely strong consulting-quality responses.
- Scores above 0.85 should be rare — only for responses that demonstrate real insight.
- Nonsense, irrelevant, or low-effort responses must score below 0.15.
- Vary your scores. A batch of 15 responses will naturally range from poor to excellent.
- Ground every observation in the candidate's actual words. Do not fabricate.
- For each probe, write 1–5 key_observations BEFORE assigning scores. This chain-of-thought ensures your scores are evidence-based.`;

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

  const user = `Analyze the following diagnostic session of ${probes.length} probe responses. For each probe, first write your key observations about the response, then assign calibrated scores.

SESSION PROBES (${probes.length} total):

${probeBlocks}

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly ${probes.length} objects, one per probe, in the same order as presented.
Each object must match this exact structure:
{
  "key_observations": ["observation 1", "observation 2", ...],
  "signal_strength": 0.0 to 1.0,
  "response_quality": 0.0 to 1.0,
  "behavioral_signals": {
    "framing_quality": 0.0 to 1.0,
    "reasoning_confidence": 0.0 to 1.0,
    "communication_clarity": 0.0 to 1.0
  }
}

All numeric values must be numbers between 0 and 1 inclusive. The key_observations array must have 1–5 string entries.
Do not wrap the JSON in markdown code blocks. Do not include any text outside the JSON array.`;

  return { system, user };
}
