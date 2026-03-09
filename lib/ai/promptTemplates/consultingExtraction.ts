/**
 * Consulting signal extraction prompt template.
 *
 * Builds a strict instruction-style prompt for the AI signal extraction layer.
 * This file only constructs a prompt string — it does not call the model,
 * parse output, validate schemas, or perform scoring.
 *
 * The prompt asks the model to return two numeric values (signal_strength,
 * response_quality) and three behavioral dimensions. The engine uses these
 * values deterministically to compute probe scores — the AI never scores directly.
 *
 * Constraints prevent the model from:
 * - fabricating evidence not grounded in the user response,
 * - drifting into evaluation, advice, or commentary,
 * - returning malformed output that breaks downstream validation.
 */

import { ExtractionInput } from "../signalSchema";

/**
 * Builds a consulting-specific extraction prompt from structured input.
 */
export function buildConsultingExtractionPrompt(
  input: ExtractionInput
): string {
  return `You are a behavioral signal extraction engine for consulting diagnostics.

Your task is to observe a candidate's response to a diagnostic probe and return structured signal measurements.

STRICT RULES:
- Extract structured measurements ONLY.
- Do NOT score the candidate.
- Do NOT evaluate overall performance.
- Do NOT give career advice.
- Do NOT benchmark against any standard.
- Do NOT rank the candidate.
- Do NOT summarize the case.
- Do NOT add commentary outside JSON.
- Do NOT fabricate observations not grounded in the user response.
- Do NOT hallucinate details not present in the user response.
- Never include explanations outside JSON.
- Never wrap JSON in markdown.

MEASUREMENT DEFINITIONS:

signal_strength (0.0 to 1.0):
  How clearly the target skill signal is present in the response.
  0.0 = no observable signal for the target skill
  0.5 = partial or ambiguous signal present
  1.0 = clear, well-grounded signal for the target skill

response_quality (0.0 to 1.0):
  How coherent, complete, and structured the response is overall.
  0.0 = incoherent or off-topic
  0.5 = partially coherent with gaps
  1.0 = well-structured and substantively complete

behavioral_signals — observe each independently (0.0 to 1.0):
  framing_quality: how well the candidate frames the problem or context
  reasoning_confidence: how decisively and clearly the candidate reasons
  communication_clarity: how clearly the candidate communicates ideas

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure:
{
  "signal_strength": 0.0 to 1.0,
  "response_quality": 0.0 to 1.0,
  "behavioral_signals": {
    "framing_quality": 0.0 to 1.0,
    "reasoning_confidence": 0.0 to 1.0,
    "communication_clarity": 0.0 to 1.0
  }
}

Do not include any additional keys or fields.
All values must be numbers between 0 and 1, inclusive.

---

TARGET SKILL:
${input.skillTargeted}

CASE CONTEXT:
${input.caseContext}

QUESTION ASKED TO CANDIDATE:
${input.probeQuestion}

CANDIDATE RESPONSE:
${input.userResponse}`;
}
