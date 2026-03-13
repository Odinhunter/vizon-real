/**
 * Prompt template for generating personalized skill narratives and recommendations.
 *
 * This is a second AI call made after batch extraction and scoring.
 * It takes the candidate's actual responses, the AI's observations,
 * and the computed scores to produce brutally honest, personalized feedback.
 */

import type { PendingResponse } from '@/engine/diagnosticSession';
import type { SkillDetail, Recommendation } from '@/lib/api/diagnosticClient';

export interface PersonalizedFeedbackInput {
  skills: SkillDetail[];
  pendingResponses: PendingResponse[];
  keyObservations: Record<string, string[]>; // skillId → merged observations
  trackScore: number;
  benchmark: number;
  archetypeName?: string;
  archetypeTopTraits?: string[];
}

export interface PersonalizedFeedbackOutput {
  skillNarratives: Record<string, string>; // skillId → narrative
  recommendations: Recommendation[];
  archetypeFeedback: string; // personalized paragraph for the candidate profile card
}

export interface PersonalizedFeedbackPrompt {
  system: string;
  user: string;
}

const SKILL_LABELS: Record<string, string> = {
  problem_structuring: 'Structuring',
  hypothesis_driven_thinking: 'Hypothesis Thinking',
  analytical_thinking: 'Analytical Thinking',
  client_communication: 'Client Communication',
  decision_recommendation: 'Decision & Recommendation',
};

function getSkillLabel(skillId: string): string {
  return SKILL_LABELS[skillId] ?? skillId;
}

export function buildPersonalizedFeedbackPrompt(
  input: PersonalizedFeedbackInput
): PersonalizedFeedbackPrompt {
  const system = `You are a brutally honest senior MBB partner writing personalized diagnostic feedback for a candidate who just completed a consulting skills assessment. You have reviewed every word they wrote.

YOUR VOICE:
- Professional but direct. No sugarcoating, no generic encouragement.
- Reference SPECIFIC things the candidate actually said or failed to say.
- If they were vague, say so. If they missed obvious data, call it out. If they showed genuine strength, acknowledge it precisely.
- Write as if you're giving private feedback after a case interview — caring enough to be honest, experienced enough to be specific.
- Each narrative should feel like it could ONLY have been written about THIS candidate.

WHAT MAKES BAD FEEDBACK (avoid this):
- "Shows promise but needs improvement" — too generic
- "Focus on building repeatable frameworks" — stock advice
- "Demonstrates competent structuring ability" — says nothing specific
- Any sentence that could apply to any candidate

WHAT MAKES GOOD FEEDBACK (do this):
- "You jumped straight into listing cost categories without asking what's driving the margin decline — that's a red flag in any case interview"
- "Your L3 response on the pricing question was actually stronger than your L1 baseline — you seem to perform better when the data is messy, which is unusual and valuable"
- "You consistently avoided committing to a recommendation, hedging with 'it depends' three times across the session"`;

  // Build per-skill context blocks
  const skillBlocks = input.skills.map((skill) => {
    const responses = input.pendingResponses.filter((p) => p.skillId === skill.skillId);
    const observations = input.keyObservations[skill.skillId] ?? [];

    const responseSnippets = responses.map((r, i) => {
      const stageLabel = `L${r.caseStage}`;
      const answer = r.rawResponse?.substring(0, 500) || '(no response)';
      return `  [${stageLabel}/${r.contextLevel}] Q: "${r.probeQuestion?.substring(0, 150)}..."
  A: "${answer}"`;
    }).join('\n');

    const stageScoreStr = skill.stageScores
      .map((ss) => `L${ss.stage}: ${ss.score}`)
      .join(' → ');

    return `SKILL: ${getSkillLabel(skill.skillId)} (${skill.skillId})
Score: ${skill.score}/100 | Benchmark: ${skill.benchmark} | Gap: ${skill.gap > 0 ? '+' : ''}${skill.gap} | Assessment: ${skill.assessment}
Trajectory: ${skill.trajectory} | Stage scores: ${stageScoreStr}
AI observations: ${observations.length > 0 ? observations.join('; ') : 'none'}
Candidate responses:
${responseSnippets}`;
  }).join('\n\n---\n\n');

  // Identify weakest skills for recommendations
  const sortedByGap = [...input.skills].sort((a, b) => a.gap - b.gap);
  const weakestSkills = sortedByGap.slice(0, 3).filter((s) => s.gap < 5);

  // Archetype context
  const archetypeInfo = `CANDIDATE ARCHETYPE: ${input.archetypeName ?? 'Unknown'}
Top Traits: ${input.archetypeTopTraits?.join(', ') ?? 'N/A'}`;

  const user = `Here is the complete diagnostic data for this candidate (overall score: ${input.trackScore}/100, benchmark: ${input.benchmark}):

${archetypeInfo}

${skillBlocks}

TASK 1 — SKILL NARRATIVES:
Write a personalized narrative for EACH skill (2-3 sentences). Reference specific things from their responses. Be honest about what they did well and what they clearly struggled with. Each narrative must contain at least one specific observation that could only apply to this candidate's actual answers.

TASK 2 — PRIORITY RECOMMENDATIONS:
Write ${weakestSkills.length} personalized recommendations for their weakest skills: ${weakestSkills.map((s) => getSkillLabel(s.skillId)).join(', ')}.
Each recommendation should:
- Have a specific, actionable title (not generic like "practice more")
- Reference what went wrong in their actual responses
- Give a concrete exercise or habit change that addresses their specific weakness
- Be 2-3 sentences max

TASK 3 — ARCHETYPE FEEDBACK:
Write a personalized 3-4 sentence paragraph that goes deeper on this candidate's archetype profile. Reference specific patterns from their responses that reveal why they fit this archetype. Call out both their defining strength and their most notable blind spot based on what you observed. This should read like a senior partner's private coaching note — direct, specific, and actionable. Do NOT repeat the archetype description — add NEW insight based on their actual performance.

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure:
{
  "skill_narratives": {
    "${input.skills.map((s) => s.skillId).join('": "...",\n    "')}": "..."
  },
  "recommendations": [
    { "priority": 1, "title": "...", "description": "..." },
    ...
  ],
  "archetype_feedback": "..."
}

Do not wrap in markdown code blocks. Do not include text outside the JSON.`;

  return { system, user };
}
