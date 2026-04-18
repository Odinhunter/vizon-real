/**
 * Finance-specific personalized feedback prompt template.
 *
 * Uses an investment partner persona that references specific calculations,
 * financial concepts, and risk quantification from the candidate's responses.
 */

import type { PersonalizedFeedbackInput, PersonalizedFeedbackPrompt } from './personalizedFeedback';
import { getTrackAnalysisConfig } from '@/engine/trackAnalysisConfig';

function getSkillLabel(skillId: string): string {
  const config = getTrackAnalysisConfig('finance');
  return config.skillLabels[skillId] ?? skillId;
}

export function buildFinancePersonalizedFeedbackPrompt(
  input: PersonalizedFeedbackInput
): PersonalizedFeedbackPrompt {
  const system = `You are a brutally honest senior investment partner writing personalized diagnostic feedback for a candidate who just completed a finance skills assessment. You have reviewed every calculation they produced and every investment thesis they articulated.

YOUR VOICE:
- Professional but direct. No sugarcoating, no generic encouragement.
- Reference SPECIFIC calculations the candidate got right or wrong, financial concepts they confused, and risk quantification present or absent.
- If they miscalculated returns, say so with the specific numbers. If they confused EV with equity value, call it out. If they showed genuine quantitative strength, acknowledge it precisely.
- Write as if you're giving private feedback after a deal team review — caring enough to be honest, experienced enough to be specific.
- Each narrative should feel like it could ONLY have been written about THIS candidate.

WHAT MAKES BAD FEEDBACK (avoid this):
- "Shows promise but needs improvement" — too generic
- "Focus on building stronger financial models" — stock advice
- "Demonstrates competent analytical ability" — says nothing specific
- Any sentence that could apply to any candidate

WHAT MAKES GOOD FEEDBACK (do this):
- "You correctly calculated ROIC at 22.5% in L1 but then confused EV with equity value in L3 — that inconsistency would raise concerns in a deal review"
- "Your L3 deal structuring was your strongest response — you understood preferred return mechanics and correctly modeled the waterfall"
- "You consistently avoided quantifying downside scenarios, stating risks qualitatively three times without ever calculating return compression"`;

  const alignmentByProbe = input.rubricAlignmentByProbeIndex ?? {};

  // Build per-skill context blocks
  const skillBlocks = input.skills.map((skill) => {
    const responses = input.pendingResponses
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.skillId === skill.skillId);
    const observations = input.keyObservations[skill.skillId] ?? [];

    const responseSnippets = responses.map(({ p: r, i }) => {
      const stageLabel = `L${r.caseStage}`;
      const answer = r.rawResponse?.substring(0, 2000) || '(no response)';
      return `  [${stageLabel}/${r.contextLevel}] Q: "${r.probeQuestion?.substring(0, 200)}..."
  A: "${answer}"
  Answer #${i + 1}`;
    }).join('\n');

    const stageScoreStr = skill.stageScores
      .map((ss) => `L${ss.stage}: ${ss.score}`)
      .join(' → ');

    // Aggregate rubric alignment across this skill's probes
    const skillMatched = new Set<string>();
    const skillMissed = new Set<string>();
    for (const { i } of responses) {
      const entry = alignmentByProbe[i + 1];
      entry?.matched?.forEach((c) => skillMatched.add(c));
      entry?.missed?.forEach((c) => skillMissed.add(c));
    }
    const rubricSummary = (skillMatched.size > 0 || skillMissed.size > 0)
      ? `Rubric alignment across this skill:
  Hit: ${skillMatched.size > 0 ? Array.from(skillMatched).join('; ') : 'none'}
  Missed: ${skillMissed.size > 0 ? Array.from(skillMissed).join('; ') : 'none'}`
      : 'Rubric alignment: (not available)';

    return `SKILL: ${getSkillLabel(skill.skillId)} (${skill.skillId})
Score: ${skill.score}/100 | Benchmark: ${skill.benchmark} | Gap: ${skill.gap > 0 ? '+' : ''}${skill.gap} | Assessment: ${skill.assessment}
Trajectory: ${skill.trajectory} | Stage scores: ${stageScoreStr}
AI observations: ${observations.length > 0 ? observations.join('; ') : 'none'}
${rubricSummary}
Candidate responses:
${responseSnippets}`;
  }).join('\n\n---\n\n');

  // Identify weakest skills for recommendations
  const sortedByGap = [...input.skills].sort((a, b) => a.gap - b.gap);
  const weakestSkills = sortedByGap.slice(0, 3).filter((s) => s.gap < 5);

  // Archetype context
  const archetypeInfo = `CANDIDATE ARCHETYPE: ${input.archetypeName ?? 'Unknown'}
Top Traits: ${input.archetypeTopTraits?.join(', ') ?? 'N/A'}`;

  // Build ordered answer list for per-answer feedback
  const orderedAnswers = input.pendingResponses.map((r, i) => {
    const skillLabel = getSkillLabel(r.skillId);
    const answer = r.rawResponse?.substring(0, 2000) || '(no response)';
    let optionNote = '';
    if (r.selectedOptionId) optionNote = ` [Selected option: ${r.selectedOptionId}]`;
    if (r.selectedOptionIds?.length) optionNote = ` [Selected options: ${r.selectedOptionIds.join(', ')}]`;

    const rubricLine = r.scoringGuidance
      ? `Scoring guidance (expected calculations / rubric): ${r.scoringGuidance.substring(0, 800)}`
      : 'Scoring guidance: (not provided)';

    const align = alignmentByProbe[i + 1];
    const alignLine = align
      ? `Rubric alignment: ${align.alignment !== undefined ? align.alignment.toFixed(2) : 'n/a'}${
          align.matched?.length ? ` | Hit: ${align.matched.join('; ')}` : ''
        }${
          align.missed?.length ? ` | Missed: ${align.missed.join('; ')}` : ''
        }${
          align.extraneous?.length ? ` | Extraneous: ${align.extraneous.join('; ')}` : ''
        }`
      : '';

    return `Answer ${i + 1} | Skill: ${skillLabel} (${r.skillId}) | Case L${r.caseStage} | Context: ${r.contextLevel}
Q: "${r.probeQuestion?.substring(0, 300) || '(no question)'}"${optionNote}
${rubricLine}
A: "${answer}"${alignLine ? `\n${alignLine}` : ''}`;
  }).join('\n\n');

  const user = `Here is the complete diagnostic data for this candidate (overall score: ${input.trackScore}/100, benchmark: ${input.benchmark}):

${archetypeInfo}

${skillBlocks}

ANSWERS IN SEQUENCE:
${orderedAnswers}

TASK 1 — SKILL NARRATIVES:
Write a personalized narrative for EACH skill (2-3 sentences). Reference specific calculations, financial concepts, or analytical approaches from their responses AND at least one specific rubric criterion they hit or missed (use the "Rubric alignment across this skill" block — e.g. "rubric-correct IRR of 24%" or "missed the ROIC vs ROA distinction"). Be honest about what they did well and what they clearly struggled with. Each narrative must contain at least one specific observation that could only apply to this candidate's actual answers.

TASK 2 — PRIORITY RECOMMENDATIONS:
Write ${weakestSkills.length} personalized recommendations for their weakest skills: ${weakestSkills.map((s) => getSkillLabel(s.skillId)).join(', ')}.
Each recommendation should:
- Have a specific, actionable title (not generic like "practice more")
- Reference what went wrong in their actual responses (specific calculations, missing analysis, confused concepts)
- Give a concrete exercise or habit change that addresses their specific weakness
- Be 2-3 sentences max

TASK 3 — ARCHETYPE FEEDBACK:
Write a personalized 3-4 sentence paragraph that goes deeper on this candidate's archetype profile. Reference specific patterns from their responses that reveal why they fit this archetype — specific calculations they got right, financial reasoning patterns, how they handled risk quantification. Call out both their defining strength and their most notable blind spot based on what you observed. This should read like a senior partner's private coaching note — direct, specific, and actionable. Do NOT repeat the archetype description — add NEW insight based on their actual performance.

TASK 4 — PER-ANSWER FEEDBACK:
For EACH of the ${input.pendingResponses.length} answers above, write 2-3 sentences of qualitative feedback grounded in BOTH the candidate's actual calculations/words AND the scoring guidance rubric for that probe. You MUST:
- Reference at least one specific rubric criterion the candidate hit, missed, or got wrong (use the "Rubric alignment" and "Scoring guidance" lines). Call out calculation errors, missing metrics, or confused concepts against what the rubric expects. If those lines are absent, fall back to specific quotes/numbers from the answer.
- Quote or tightly paraphrase specific calculations, metrics, or phrases the candidate used — do not write coaching that could apply to any answer.
- Be honest about what was good and what was missing per the rubric.

Examples of strong per-answer feedback:
- "You correctly calculated EBITDA at €460M — that matches the rubric's expected value — but then confused gross margin with operating margin when justifying the 12× multiple. The rubric explicitly flags that distinction, and conflating them shows up immediately in a deal review."
- "Your ROIC was 22.5%, which is the rubric-correct number, but you left the 'capital efficiency vs peers' judgement implicit. The rubric asks for a comparison to the 15% sector average — you had the number, you just didn't benchmark it."
- "You picked option B when the rubric expects A; your reasoning ('lower multiple looks cheaper') is exactly the tempting distractor the rubric flags. The EV/EBITDA vs EV/Revenue distinction wasn't engaged."

TASK 5 — CASE SUMMARIES:
Write a summary for each of the 3 cases (L1, L2, L3). For each case, produce:
- overallAssessment: 2-3 sentences on how the candidate performed across the questions in that case
- strongestMoment: 1-2 sentences naming the specific thing they did best (reference actual content, calculations, or choices)
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
