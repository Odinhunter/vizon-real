/**
 * Generates personalized skill narratives and recommendations using AI.
 *
 * This is a second AI call made after batch extraction and scoring.
 * It takes the candidate's actual responses and AI observations to produce
 * specific, honest feedback that references what they actually wrote.
 *
 * On failure, returns null so the caller can fall back to template-based feedback.
 */

import type { PendingResponse } from '@/engine/diagnosticSession';
import type { SkillDetail, Recommendation } from '@/lib/api/diagnosticClient';
import type { BatchExtractionResult } from './signalSchema';
import { callModel } from './modelClient';
import {
  buildPersonalizedFeedbackPrompt,
  type PersonalizedFeedbackOutput,
} from './promptTemplates/personalizedFeedback';
import { z } from 'zod';

const FeedbackResponseSchema = z.object({
  skill_narratives: z.record(z.string(), z.string()),
  recommendations: z.array(
    z.object({
      priority: z.number(),
      title: z.string(),
      description: z.string(),
    })
  ),
  archetype_feedback: z.string().optional(),
  answer_feedback: z.array(
    z.object({
      sequence_number: z.number(),
      skill_id: z.string(),
      skill_label: z.string(),
      case_stage: z.number(),
      question_snippet: z.string(),
      feedback: z.string(),
    })
  ).optional(),
  case_summaries: z.array(
    z.object({
      case_stage: z.number(),
      overall_assessment: z.string(),
      strongest_moment: z.string(),
      clearest_gap: z.string(),
    })
  ).optional(),
}).strip();

export async function generatePersonalizedFeedback(
  skills: SkillDetail[],
  pendingResponses: PendingResponse[],
  extractions: BatchExtractionResult,
  trackScore: number,
  benchmark: number,
  archetypeName?: string,
  archetypeTopTraits?: string[],
  trackId = 'consulting'
): Promise<PersonalizedFeedbackOutput | null> {
  // Build key observations grouped by skill.
  // Match by probe_index (echoed from the prompt) to stay order-independent.
  const keyObservations: Record<string, string[]> = {};
  const extractionByIndex = new Map(extractions.map(e => [e.probe_index, e]));
  for (let i = 0; i < pendingResponses.length; i++) {
    const extraction = extractionByIndex.get(i + 1);
    const pending = pendingResponses[i];
    if (!extraction || !pending) continue;
    const obs = keyObservations[pending.skillId] ?? [];
    obs.push(...(extraction.key_observations ?? []));
    keyObservations[pending.skillId] = obs;
  }

  const { system, user } = buildPersonalizedFeedbackPrompt({
    skills,
    pendingResponses,
    keyObservations,
    trackScore,
    benchmark,
    archetypeName,
    archetypeTopTraits,
  }, trackId);

  try {
    const response = await callModel({ system, prompt: user, temperature: 0.3 });

    let text = response.rawText.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = FeedbackResponseSchema.parse(JSON.parse(text));

    return {
      skillNarratives: parsed.skill_narratives,
      recommendations: parsed.recommendations.map((r, i) => ({
        priority: r.priority ?? i + 1,
        title: r.title,
        description: r.description,
      })),
      archetypeFeedback: parsed.archetype_feedback ?? '',
      answerFeedback: parsed.answer_feedback?.map((af) => ({
        sequenceNumber: af.sequence_number,
        skillId: af.skill_id,
        skillLabel: af.skill_label,
        caseStage: af.case_stage as 1 | 2 | 3,
        questionSnippet: af.question_snippet,
        feedback: af.feedback,
      })),
      caseSummaries: parsed.case_summaries?.map((cs) => ({
        caseStage: cs.case_stage as 1 | 2 | 3,
        overallAssessment: cs.overall_assessment,
        strongestMoment: cs.strongest_moment,
        clearestGap: cs.clearest_gap,
      })),
    };
  } catch (err) {
    console.error('Personalized feedback generation failed:', err);
    return null;
  }
}
