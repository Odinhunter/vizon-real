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
  // Build key observations grouped by skill
  const keyObservations: Record<string, string[]> = {};
  for (let i = 0; i < extractions.length; i++) {
    const extraction = extractions[i];
    const pending = pendingResponses[i];
    if (!pending) continue;
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
    };
  } catch (err) {
    console.error('Personalized feedback generation failed:', err);
    return null;
  }
}
