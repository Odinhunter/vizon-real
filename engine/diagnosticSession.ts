/**
 * Core diagnostic session state definition.
 * 
 * This file defines the structural shape of a diagnostic session.
 * It is fully career- and skill-agnostic.
 * 
 * Skills are treated as opaque identifiers defined by configuration.
 * Career tracks determine which skills are assessed and how they're interpreted.
 * 
 * The session tracks:
 * - Which career track is being diagnosed
 * - Progress through the diagnostic flow
 * - User responses to questions
 * - Observed behavioral signals per skill
 * - Overall session status
 * 
 * Contains NO logic, scoring, or branching rules.
 */

import type { ProbeExtractionResult } from '../lib/ai/signalSchema';

/**
 * Opaque identifier for a skill.
 * 
 * Skills are defined in configuration, not hardcoded in the engine.
 * The engine treats these as strings and does not interpret their meaning.
 * 
 * Examples (defined in config):
 * - 'analytical-thinking'
 * - 'stakeholder-navigation'
 * - 'technical-depth'
 */
export type SkillId = string;

/**
 * Current state of the diagnostic session lifecycle.
 */
export enum DiagnosticStatus {
  /**
   * User is actively progressing through questions.
   * The session can accept new answers and advance to next questions.
   */
  IN_PROGRESS = 'IN_PROGRESS',

  /**
   * All required questions have been answered.
   * The session is ready for result generation and cannot accept new answers.
   */
  COMPLETE = 'COMPLETE',
}

/**
 * Represents a single answered question in the diagnostic flow.
 * Stores both the user's choice and any explanatory reasoning they provided.
 */
export interface AnsweredQuestion {
  /**
   * Unique identifier of the question that was answered.
   * Used to look up question metadata from the questions data layer.
   */
  questionId: string;

  /**
   * The option ID the user selected.
   * Maps to a specific answer choice defined in the question data.
   */
  selectedOptionId: string;

  /**
   * Optional free-text reasoning provided by the user.
   * Used to capture decision-making process, not for scoring.
   * May be used by AI for generating explanations or insights.
   */
  reasoningText?: string;

  /**
   * Timestamp when this question was answered.
   * Useful for analytics and flow optimization.
   */
  answeredAt: Date;
}

/**
 * Stores observed behavioral signals for a single skill.
 * 
 * Signals are raw observations extracted from answers, NOT scores or levels.
 * The scoring engine will later interpret these signals to generate proficiency assessments.
 * 
 * This structure is intentionally flexible to support multiple signal types:
 * - Choice patterns
 * - Behavioral indicators
 * - Response characteristics
 */
export interface SkillSignals {
  /**
   * The skill identifier these signals relate to.
   * Must correspond to a skill defined in the career track configuration.
   */
  skillId: SkillId;

  /**
   * Raw signal observations as key-value pairs.
   * 
   * Keys are signal types (defined by question configuration).
   * Values are signal strengths or counts.
   * 
   * Example structure (actual signal types defined in question data):
   * {
   *   'signal_type_a': 3,
   *   'signal_type_b': 1,
   *   'signal_type_c': 5
   * }
   * 
   * The scoring engine will aggregate and interpret these based on career track rules.
   */
  observations: Record<string, number>;

  /**
   * Number of questions that contributed signals for this skill.
   * Used to determine signal confidence and whether sufficient data exists for assessment.
   */
  questionCount: number;
}

/**
 * A buffered probe response waiting for batch AI extraction at session completion.
 * Stores everything the batch prompt needs: context, question, guidance, and the raw answer.
 */
export interface PendingResponse {
  skillId: string;
  probeId: string;
  caseStage: 1 | 2 | 3;
  contextLevel: 'low' | 'medium' | 'high';
  caseContext: string;
  probeQuestion: string;
  scoringGuidance: string;
  /** Plain-text serialization of the exhibit shown alongside this probe, or empty string. */
  exhibitContext: string;
  /** Probe interaction format — determines how the response fields are interpreted. */
  format: 'free_text' | 'mcq_plus_reasoning' | 'multi_select_plus_reasoning';
  /** All options presented to the candidate. Populated for mcq and multi_select formats. */
  options?: { id: string; text: string }[];
  /** The option ID the candidate selected. Populated for mcq_plus_reasoning probes. */
  selectedOptionId?: string;
  /** The option IDs the candidate selected. Populated for multi_select_plus_reasoning probes. */
  selectedOptionIds?: string[];
  /** The candidate's free-text reasoning (always present). */
  rawResponse: string;
}

/**
 * A single probe score entry, tagged with the case stage it came from.
 *
 * caseStage enables trajectory-aware aggregation in the scoring engine:
 * evidence from L3 (pressure) carries more weight than evidence from L1 (baseline).
 */
export interface SkillProbeEntry {
  /** Probe score ∈ [0, 1], computed deterministically by the scoring engine. */
  score: number;
  /** The escalation stage during which this probe was executed. */
  caseStage: 1 | 2 | 3;
}

/**
 * Wrapper for AI-extracted evidence with case attribution.
 * Stores the raw probe extraction result for audit and debugging.
 * Scoring is computed deterministically from skillEvidence, not from this field.
 */
export interface AIExtractedEvidenceEntry {
  caseId: string;
  caseStage: 1 | 2 | 3;
  skillId: SkillId | null;
  probeId: string;
  extraction: ProbeExtractionResult;
}

/**
 * Complete state of a single diagnostic session.
 * 
 * This is the core state container for the entire diagnostic flow.
 * Mutated as the user progresses through questions.
 * Once status is COMPLETE, it is passed to the scoring engine for result generation.
 * 
 * This structure is career-agnostic and makes no assumptions about which skills exist
 * or how they should be assessed. All career-specific logic lives in configuration.
 */
export interface DiagnosticSession {
  /**
   * Unique identifier for this diagnostic session.
   * Used for persistence, analytics, and session recovery.
   */
  sessionId: string;

  /**
   * The career track being diagnosed.
   * 
   * This is a configuration identifier, not hardcoded logic.
   * The configuration defines:
   * - Which skills are assessed
   * - How signals map to proficiency levels
   * - Which questions to use
   * 
   * Examples: 'consulting', 'finance', 'product-management', 'data-science'
   */
  careerTrackId: string;

  /**
   * Identifier of the currently active case within the session.
   * Used to attribute probes and signals to the correct escalation stage.
   */
  currentCaseId: string;

  /**
   * Current escalation stage within the session.
   * 1 = Baseline case
   * 2 = Escalation case
   * 3 = Pressure scenario
   */
  caseStage: 1 | 2 | 3;

  /**
   * History of cases executed during this session.
   * Enables longitudinal analysis across increasing ambiguity.
   */
  caseHistory: string[];

  /**
   * The skill currently being focused on in the diagnostic flow.
   * 
   * Null if no specific skill is being targeted (e.g., multi-skill questions).
   * Used by the branching engine to determine the next question in adaptive flows.
   */
  currentSkillId: SkillId | null;

  /**
   * The question currently being presented to the user.
   * 
   * Null if:
   * - Session just started
   * - User just answered and engine is calculating next question
   * - Session is complete
   */
  currentQuestionId: string | null;

  /**
   * All questions answered so far in this session.
   * 
   * Order matters: the branching engine uses answer history to determine adaptive flow.
   * The scoring engine iterates through this to extract and aggregate signals.
   */
  answeredQuestions: AnsweredQuestion[];

  /**
   * Observed behavioral signals grouped by skill.
   * 
   * Accumulates as questions are answered.
   * Signals are extracted from answer choices based on question configuration.
   * 
   * This is NOT a score or proficiency level - it's raw behavioral data.
   * The scoring engine interprets these signals according to career track rules.
   */
  observedSignals: SkillSignals[];

  /**
   * Buffered probe responses waiting for batch AI extraction at session completion.
   * Populated per-probe during the session. Consumed once when status = COMPLETE.
   */
  pendingResponses: PendingResponse[];

  /**
   * Raw AI-extracted evidence with case attribution, stored for audit.
   *
   * Each entry records the full ProbeExtractionResult so the extraction
   * can be replayed or inspected. Scoring uses skillEvidence, not this field.
   */
  aiExtractedEvidence?: AIExtractedEvidenceEntry[];

    /**
   * Accumulated probe scores per skill, used for deterministic skill scoring.
   *
   * Key = skillId, value = array of SkillProbeEntry objects.
   * Each entry records the probe_score and the case stage it came from.
   * caseStage enables trajectory-aware aggregation: L3 evidence outweighs L1.
   */
  skillEvidence: Record<string, SkillProbeEntry[]>;

  /**
   * Accumulated behavioral signal observations across all probe responses.
   *
   * These are AI observations only — never used in skill or track scoring.
   * aggregateBehavioralSignals() converts these into 0–100 behavioral scores.
   */
  behavioralEvidence: {
    framing_quality: number[];
    reasoning_confidence: number[];
    communication_clarity: number[];
  };

  /**
   * Current lifecycle status of the diagnostic session.
   * 
   * Drives UI state and determines whether the session can:
   * - Accept new answers (IN_PROGRESS)
   * - Generate results (COMPLETE)
   * 
   * Transitions: IN_PROGRESS -> COMPLETE
   */
  status: DiagnosticStatus;

  /**
   * When this session was created.
   * Used for analytics and session expiry.
   */
  createdAt: Date;

  /**
   * When this session was last updated.
   * Updated every time a question is answered or state changes.
   * Used for analytics and detecting stale sessions.
   */
  updatedAt: Date;

  /**
   * Current index of the probe slot being processed.
   * Used by orchestration to resume the diagnostic flow deterministically.
   */
  currentSlotIndex?: number;

  /**
   * History of probes executed in this session.
   * Enables replay, auditing, and step-by-step debugging.
   */
  probeHistory?: Array<{
    slotId: string;
    probeId: string;
    variantId: string;
  }>;

  /**
   * Raw responses captured for each executed probe.
   * Interpretation and scoring are deferred to later stages.
   */
  responses?: Array<{
    slotId: string;
    probeId: string;
    variantId: string;
    rawResponse?: unknown;
  }>;
}
