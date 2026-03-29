/**
 * Prompt template for generating personalized skill narratives and recommendations.
 *
 * This is a second AI call made after batch extraction and scoring.
 * It takes the candidate's actual responses, the AI's observations,
 * and the computed scores to produce brutally honest, personalized feedback.
 */

import type { PendingResponse } from '@/engine/diagnosticSession';
import type { SkillDetail, Recommendation } from '@/lib/api/diagnosticClient';
import { getTrackAnalysisConfig } from '@/engine/trackAnalysisConfig';
import { buildFinancePersonalizedFeedbackPrompt } from './financePersonalizedFeedback';

export interface PersonalizedFeedbackInput {
  skills: SkillDetail[];
  pendingResponses: PendingResponse[];
  keyObservations: Record<string, string[]>; // skillId → merged observations
  trackScore: number;
  benchmark: number;
  archetypeName?: string;
  archetypeTopTraits?: string[];
}

export interface AnswerFeedbackItem {
  sequenceNumber: number;
  skillId: string;
  skillLabel: string;
  caseStage: 1 | 2 | 3;
  questionSnippet: string;
  feedback: string;
}

export interface CaseSummaryItem {
  caseStage: 1 | 2 | 3;
  overallAssessment: string;
  strongestMoment: string;
  clearestGap: string;
}

export interface PersonalizedFeedbackOutput {
  skillNarratives: Record<string, string>; // skillId → narrative
  recommendations: Recommendation[];
  archetypeFeedback: string; // personalized paragraph for the candidate profile card
  answerFeedback?: AnswerFeedbackItem[];
  caseSummaries?: CaseSummaryItem[];
}

export interface PersonalizedFeedbackPrompt {
  system: string;
  user: string;
}

function getSkillLabel(skillId: string, trackId: string): string {
  const config = getTrackAnalysisConfig(trackId);
  return config.skillLabels[skillId] ?? skillId;
}

export function buildPersonalizedFeedbackPrompt(
  input: PersonalizedFeedbackInput,
  trackId = 'consulting'
): PersonalizedFeedbackPrompt {
  if (trackId === 'finance') {
    return buildFinancePersonalizedFeedbackPrompt(input);
  }
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

    const responseSnippets = responses.map((r) => {
      const stageLabel = `L${r.caseStage}`;
      const answer = r.rawResponse?.substring(0, 500) || '(no response)';
      return `  [${stageLabel}/${r.contextLevel}] Q: "${r.probeQuestion?.substring(0, 150)}..."
  A: "${answer}"`;
    }).join('\n');

    const stageScoreStr = skill.stageScores
      .map((ss) => `L${ss.stage}: ${ss.score}`)
      .join(' → ');

    return `SKILL: ${getSkillLabel(skill.skillId, trackId)} (${skill.skillId})
Score: ${skill.score}/100 | Benchmark: ${skill.benchmark} | Gap: ${skill.gap > 0 ? '+' : ''}${skill.gap} | Assessment: ${skill.assessment}
Trajectory: ${skill.trajectory} | Stage scores: ${stageScoreStr}
AI observations: ${observations.length > 0 ? observations.join('; ') : 'none'}
Candidate responses:
${responseSnippets}`;
  }).join('\n\n---\n\n');

  // Build ordered answer list for per-answer feedback
  const orderedAnswers = input.pendingResponses.map((r, i) => {
    const skillLabel = getSkillLabel(r.skillId, trackId);
    const answer = r.rawResponse?.substring(0, 600) || '(no response)';
    let optionNote = '';
    if (r.selectedOptionId) optionNote = ` [Selected option: ${r.selectedOptionId}]`;
    if (r.selectedOptionIds?.length) optionNote = ` [Selected options: ${r.selectedOptionIds.join(', ')}]`;
    return `Answer ${i + 1} | Skill: ${skillLabel} (${r.skillId}) | Case L${r.caseStage} | Context: ${r.contextLevel}
Q: "${r.probeQuestion?.substring(0, 200) || '(no question)'}"${optionNote}
A: "${answer}"`;
  }).join('\n\n');

  // Identify weakest skills for recommendations
  const sortedByGap = [...input.skills].sort((a, b) => a.gap - b.gap);
  const weakestSkills = sortedByGap.slice(0, 3).filter((s) => s.gap < 5);

  // Archetype context
  const archetypeInfo = `CANDIDATE ARCHETYPE: ${input.archetypeName ?? 'Unknown'}
Top Traits: ${input.archetypeTopTraits?.join(', ') ?? 'N/A'}`;

  const user = `Here is the complete diagnostic data for this candidate (overall score: ${input.trackScore}/100, benchmark: ${input.benchmark}):

${archetypeInfo}

${skillBlocks}

ANSWERS IN SEQUENCE:
${orderedAnswers}

TASK 1 — SKILL NARRATIVES:
Write a personalized narrative for EACH skill (2-3 sentences). Reference specific things from their responses. Be honest about what they did well and what they clearly struggled with. Each narrative must contain at least one specific observation that could only apply to this candidate's actual answers.

TASK 2 — PRIORITY RECOMMENDATIONS:
Write ${weakestSkills.length} personalized recommendations for their weakest skills: ${weakestSkills.map((s) => getSkillLabel(s.skillId, trackId)).join(', ')}.
Each recommendation should:
- Have a specific, actionable title (not generic like "practice more")
- Reference what went wrong in their actual responses
- Give a concrete exercise or habit change that addresses their specific weakness
- Be 2-3 sentences max

TASK 3 — ARCHETYPE FEEDBACK:
Write a personalized 3-4 sentence paragraph that goes deeper on this candidate's archetype profile. Reference specific patterns from their responses that reveal why they fit this archetype. Call out both their defining strength and their most notable blind spot based on what you observed. This should read like a senior partner's private coaching note — direct, specific, and actionable. Do NOT repeat the archetype description — add NEW insight based on their actual performance.

TASK 4 — PER-ANSWER FEEDBACK:
For EACH of the ${input.pendingResponses.length} answers above, write 2-3 sentences of qualitative feedback that references specific phrases, choices, or omissions in that actual answer. Do not write generic coaching. Quote or closely paraphrase something specific the candidate said or failed to say. Show what was good and what was missing.

Examples of strong per-answer feedback:
- "Your opening hypothesis named the right problem but didn't commit to a direction — you said 'could be either revenue or cost' but didn't follow it with a so-what or a prioritization."
- "You correctly identified the capacity gap but jumped straight to 'hire more drivers' without acknowledging the 8% monthly turnover data sitting in the exhibit. That omission is exactly what a follow-up question would expose."
- "This was your clearest response — you used the SCR structure precisely, led with the complication rather than burying it, and quantified the risk with the payback number."

TASK 5 — CASE SUMMARIES:
Write a summary for each of the 3 cases (L1, L2, L3). For each case, produce:
- overallAssessment: 2-3 sentences on how the candidate performed across the questions in that case
- strongestMoment: 1-2 sentences naming the specific thing they did best (reference actual content)
- clearestGap: 1-2 sentences naming the most important thing they missed or under-delivered (reference actual content)

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure:
{
  "skill_narratives": {
    "${input.skills.map((s) => s.skillId).join('": "...",\n    "')}": "..."
  },
  "recommendations": [
    { "priority": 1, "title": "...", "description": "..." }
  ],
  "archetype_feedback": "...",
  "answer_feedback": [
    { "sequence_number": 1, "skill_id": "...", "skill_label": "...", "case_stage": 1, "question_snippet": "...", "feedback": "..." },
    { "sequence_number": 2, "skill_id": "...", "skill_label": "...", "case_stage": 2, "question_snippet": "...", "feedback": "..." }
  ],
  "case_summaries": [
    { "case_stage": 1, "overall_assessment": "...", "strongest_moment": "...", "clearest_gap": "..." },
    { "case_stage": 2, "overall_assessment": "...", "strongest_moment": "...", "clearest_gap": "..." },
    { "case_stage": 3, "overall_assessment": "...", "strongest_moment": "...", "clearest_gap": "..." }
  ]
}

Do not wrap in markdown code blocks. Do not include text outside the JSON.`;

  return { system, user };
}
