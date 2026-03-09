/**
 * Track-agnostic diagnostic case (scenario) metadata contract.
 *
 * A case is a container for probe slots under a shared context.
 * It is NOT a questionnaire, not a set of probes, and not a question bank.
 *
 * Cases enable contextual signal collection by providing a shared scenario
 * frame that downstream layers can use to select and sequence probes.
 *
 * This contract stays track-agnostic by treating track association and
 * scenario type as opaque labels with no embedded logic or assumptions.
 */

/**
 * Opaque identifier for a track (e.g., consulting, finance).
 * The engine treats this as a string and does not interpret its meaning.
 */
export type TrackId = string;

/**
 * Opaque label describing the scenario type (e.g., "business", "financial").
 * Used for filtering/selection without implying content or format.
 */
export type ScenarioType = string;


/**
 * Metadata describing a diagnostic case (scenario).
 *
 * A case groups probe slots under a shared context so that
 * signals can be collected coherently across an interaction.
 * The case does not define probes, slots, questions, or scoring.
 */
export interface CaseMetadata {
  /**
   * Unique identifier for this case.
   */
  caseId: string;

  /**
   * Opaque track association for this case.
   * Enables selection of cases by track without embedding track logic.
   */
  trackId: TrackId;

  /**
   * Human-readable title for internal selection or display.
   */
  title: string;

  /**
   * Short internal description of the scenario intent.
   * Used for curation and selection; not user-facing prompt text.
   */
  description: string;

  /**
   * Opaque label describing the scenario type.
   * Helps group cases with similar diagnostic intent.
   */
  scenarioType: ScenarioType;

  /**
   * Optional tags used for selection, filtering, or rotation.
   * Examples: "early-career", "ops", "growth", "technical"
   */
  tags?: string[];

  /**
   * Ordered list of probe slot IDs this case supports.
   * This defines sequencing without embedding probe definitions.
   */
  probeSlotIds: string[];

  /**
   * Escalation level of the case.
   * 1 = Baseline
   * 2 = Escalation
   * 3 = Pressure
   */
  level: 1 | 2 | 3;
}
