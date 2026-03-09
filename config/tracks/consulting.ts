/**
 * Consulting career track configuration.
 * 
 * Defines the five core skills assessed for consulting readiness.
 * Each skill specifies what diagnostic evidence is required using universal signal categories.
 * 
 * This is pure configuration data - no logic, no scoring, no branching.
 * The diagnostic engine uses this to determine what evidence to collect.
 */

import { SkillId } from '@/engine/diagnosticSession';

/**
 * Universal signal categories used across all career tracks.
 * These represent fundamental behavioral observations that can be extracted from diagnostic questions.
 */
export type SignalCategory =
  | 'problem_understanding'  // How the user frames and interprets problems
  | 'thought_structure'      // How the user organizes thinking and approaches
  | 'analytical_depth'       // How deeply the user analyzes situations
  | 'judgment_decision'      // How the user makes decisions and trade-offs
  | 'engagement_effort';     // How the user engages with complexity and ambiguity

/**
 * Evidence requirements for a single skill.
 * Specifies which signal categories are needed and how many distinct observations.
 */
export interface EvidenceRequirement {
  /**
   * The universal signal category required for this skill.
   */
  signalCategory: SignalCategory;

  /**
   * Minimum number of distinct observations needed in this category.
   * The engine will continue probing until this threshold is met.
   */
  minObservations: number;
}

/**
 * Definition of a single consulting skill.
 */
export interface ConsultingSkill {
  /**
   * Unique identifier for this skill.
   * Used throughout the engine and session state.
   */
  skillId: SkillId;

  /**
   * Human-readable name of the skill.
   * Displayed to users in results and explanations.
   */
  name: string;

  /**
   * Short description of what this skill represents.
   * Explains why this matters for consulting readiness.
   */
  description: string;

  /**
   * Evidence requirements for assessing this skill.
   * Defines what diagnostic signals the engine must collect.
   */
  requiredEvidence: EvidenceRequirement[];
}

/**
 * The five core consulting skills.
 * 
 * These skills represent the fundamental capabilities required for consulting work.
 * Each skill is assessed through multiple signal categories to build a complete picture.
 */
export const consultingSkills: ConsultingSkill[] = [
  {
    skillId: 'problem-structuring',
    name: 'Problem Structuring',
    description: 'Ability to break down complex business problems into clear, logical frameworks',

    /**
     * Why this skill exists:
     * Case interviews and real consulting work require taking ambiguous client challenges
     * and creating structured approaches. This is the foundation of consulting problem-solving.
     * 
     * Evidence required:
     * - How they understand and frame problems (problem_understanding)
     * - How they organize their analytical approach (thought_structure)
     * - How deeply they analyze root causes (analytical_depth)
     */
    requiredEvidence: [
      {
        signalCategory: 'problem_understanding',
        minObservations: 3,
      },
      {
        signalCategory: 'thought_structure',
        minObservations: 3,
      },
      {
        signalCategory: 'analytical_depth',
        minObservations: 2,
      },
    ],
  },

  {
    skillId: 'analytical-thinking',
    name: 'Analytical Thinking',
    description: 'Ability to use data, frameworks, and logic to derive sound insights and recommendations',

    /**
     * Why this skill exists:
     * Consulting recommendations must be backed by rigorous analysis.
     * This requires systematic thinking, sound judgment, and the ability to go deep on key questions.
     * 
     * Evidence required:
     * - Depth of analytical investigation (analytical_depth)
     * - How structured their thinking is (thought_structure)
     * - Quality of judgment when analyzing (judgment_decision)
     */
    requiredEvidence: [
      {
        signalCategory: 'analytical_depth',
        minObservations: 4,
      },
      {
        signalCategory: 'thought_structure',
        minObservations: 2,
      },
      {
        signalCategory: 'judgment_decision',
        minObservations: 2,
      },
    ],
  },

  {
    skillId: 'client-communication',
    name: 'Client Communication',
    description: 'Ability to synthesize complex analysis into clear, executive-ready messages',

    /**
     * Why this skill exists:
     * Consultants must communicate findings to C-suite stakeholders who need clarity and action.
     * This requires understanding audience needs, structuring messages, and making judgment calls
     * about what to emphasize.
     * 
     * Evidence required:
     * - How they understand audience needs (problem_understanding)
     * - How they structure communication (thought_structure)
     * - How they make decisions about what to emphasize (judgment_decision)
     */
    requiredEvidence: [
      {
        signalCategory: 'problem_understanding',
        minObservations: 2,
      },
      {
        signalCategory: 'thought_structure',
        minObservations: 3,
      },
      {
        signalCategory: 'judgment_decision',
        minObservations: 3,
      },
    ],
  },

  {
    skillId: 'team-effectiveness',
    name: 'Team Effectiveness',
    description: 'Ability to collaborate productively, navigate team dynamics, and drive collective output',

    /**
     * Why this skill exists:
     * Consulting is team-based work. Success requires coordinating with team members,
     * managing up and across, and making decisions that balance individual and team goals.
     * 
     * Evidence required:
     * - How they understand interpersonal dynamics (problem_understanding)
     * - How they make decisions in team contexts (judgment_decision)
     * - How they engage with collaborative complexity (engagement_effort)
     */
    requiredEvidence: [
      {
        signalCategory: 'problem_understanding',
        minObservations: 2,
      },
      {
        signalCategory: 'judgment_decision',
        minObservations: 3,
      },
      {
        signalCategory: 'engagement_effort',
        minObservations: 3,
      },
    ],
  },

  {
    skillId: 'learning-adaptability',
    name: 'Learning & Adaptability',
    description: 'Ability to quickly understand new domains, adapt approaches, and perform under ambiguity',

    /**
     * Why this skill exists:
     * Consultants rotate across industries, problem types, and client contexts.
     * They must rapidly get up to speed on unfamiliar domains and adapt their approach
     * as they learn more.
     * 
     * Evidence required:
     * - How they engage with new/complex information (engagement_effort)
     * - How deeply they analyze unfamiliar contexts (analytical_depth)
     * - How they structure understanding of new domains (thought_structure)
     */
    requiredEvidence: [
      {
        signalCategory: 'engagement_effort',
        minObservations: 3,
      },
      {
        signalCategory: 'analytical_depth',
        minObservations: 2,
      },
      {
        signalCategory: 'thought_structure',
        minObservations: 2,
      },
    ],
  },
];

/**
 * Consulting career track definition.
 * This is the top-level configuration consumed by the diagnostic engine.
 */
export const consultingTrack = {
  trackId: 'consulting',
  name: 'Management Consulting',
  description: 'Assesses readiness for strategy and management consulting roles',
  skills: consultingSkills,
};
