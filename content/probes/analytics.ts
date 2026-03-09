import type { ProbeVariantContent } from '../types';

/**
 * User-facing probe content for the Analytics track.
 * Keyed by variantId from the probe registry.
 */
export const analyticsProbeContent: Record<string, ProbeVariantContent> = {
  // ── Data Interpretation ──────────────────────────────────────────────────────

  data_interpretation_low_context: {
    variantId: 'data_interpretation_low_context',
    format: 'free_text',
    question:
      'What are the most important patterns in this data, and what do they tell you about what is happening?',
    instruction:
      'Identify the key signals and explain what they indicate about the underlying situation.',
    scoringGuidance:
      'Strong: identifies 2–3 specific patterns from the case data (not generic), explains the business meaning of each pattern (not just the statistical observation), and synthesizes them into a coherent account of what is happening. Weak: lists data points without identifying patterns, describes what the numbers are rather than what they mean, or treats all signals as equally important.',
  },
  data_interpretation_medium_context: {
    variantId: 'data_interpretation_medium_context',
    format: 'free_text',
    question:
      'Multiple metrics are moving, some in unexpected directions. What story does the combined data tell, and which signals do you treat as most meaningful?',
    instruction:
      'Explain how you prioritize and relate the different signals to form a coherent interpretation.',
    scoringGuidance:
      'Strong: names which signals are leading vs. lagging, explains why certain metrics are more diagnostic given the business context in the case, describes the story formed by the combination (not just each metric individually), and flags which unexpected movements require investigation. Weak: describes each metric separately without relating them, or treats all metrics as equally meaningful without a prioritization rationale.',
  },
  data_interpretation_high_context: {
    variantId: 'data_interpretation_high_context',
    format: 'free_text',
    question:
      'Two data sources are giving conflicting signals about the same underlying phenomenon. How do you interpret this conflict and decide which source to weight more heavily?',
    instruction:
      'Reason through the tension explicitly. Explain what would resolve the conflict and how the ambiguity affects your confidence in any conclusions you draw.',
    scoringGuidance:
      'Strong: names the specific conflict between the two sources in the case, applies explicit criteria for weighting (e.g., sample size, recency, collection methodology, alignment with other corroborating signals), states a conclusion with appropriate confidence caveat, and identifies what additional data would resolve the conflict. Weak: picks one source without justification, or describes the conflict without reaching any conclusion.',
  },

  // ── Problem Decomposition ────────────────────────────────────────────────────

  problem_decomposition_low_context: {
    variantId: 'problem_decomposition_low_context',
    format: 'free_text',
    question: 'How would you break this analytical question into its component parts?',
    instruction:
      'Walk through your decomposition and explain what answering each component would tell you.',
    scoringGuidance:
      'Strong: proposes a mutually exclusive and collectively exhaustive (MECE) decomposition specific to the case question (not a generic framework), names 3–4 components, and explains what answering each would contribute to the overall answer. Weak: applies a generic decomposition without tailoring it to the case, or breaks the question into overlapping or incomplete parts without explaining what each component resolves.',
  },
  problem_decomposition_medium_context: {
    variantId: 'problem_decomposition_medium_context',
    format: 'free_text',
    question:
      'There are several plausible framings of this problem. How do you decide which decomposition to start with, and how would you know if you had framed it incorrectly?',
    instruction:
      'Explain your scoping logic and the criteria you would use to evaluate whether your framing is correct.',
    scoringGuidance:
      'Strong: names 2–3 plausible framings specific to the case, explains the criteria for choosing between them (e.g., which framing is most actionable, most testable with available data, or most aligned with the decision being made), and names observable signals that would indicate the framing needs revision. Weak: picks a framing without comparing alternatives, or describes a correction mechanism too vaguely to be useful.',
  },
  problem_decomposition_high_context: {
    variantId: 'problem_decomposition_high_context',
    format: 'free_text',
    question:
      'The analytical question is ambiguous, different stakeholders are using the same language to describe different problems, and the scope keeps shifting. How do you establish a workable decomposition?',
    instruction:
      'Address how you would resolve the ambiguity, align on scope, and structure your analysis despite the shifting frame.',
    scoringGuidance:
      'Strong: proposes a process to surface and resolve the stakeholder disagreement (e.g., aligning on the decision that the analysis must support), names a decomposition that can accommodate scope changes at the margin, and identifies what would be held fixed vs. what can flex. References the specific ambiguity in the case. Weak: produces a decomposition without addressing the stakeholder conflict, or treats scope instability as an insurmountable blocker.',
  },

  // ── Statistical Reasoning ────────────────────────────────────────────────────

  statistical_reasoning_low_context: {
    variantId: 'statistical_reasoning_low_context',
    format: 'free_text',
    question:
      'What does the trend in this data suggest, and how confident are you in that conclusion?',
    instruction:
      'Describe what you observe and assess how strong the evidence is for the conclusion you are drawing.',
    scoringGuidance:
      'Strong: identifies the specific trend in the case data, states a conclusion, and calibrates confidence with explicit reasoning (e.g., references sample size, trend duration, presence of noise, or consistency with other signals). Weak: describes the trend without a conclusion, or states a conclusion with no confidence calibration.',
  },
  statistical_reasoning_medium_context: {
    variantId: 'statistical_reasoning_medium_context',
    format: 'free_text',
    question:
      'The data is based on a sample. What would make you more or less confident that these findings apply to the broader population?',
    instruction:
      'Assess the validity and representativeness of the data and explain what additional information would strengthen or weaken your conclusions.',
    scoringGuidance:
      'Strong: identifies specific validity concerns relevant to the case sample (e.g., selection bias, recency, geographic or demographic skew), names what sample characteristics would increase representativeness, and states which findings are most vs. least sensitive to sample quality. Weak: describes generic sampling concerns without connecting them to the case, or assesses validity without reference to the specific population the findings need to apply to.',
  },
  statistical_reasoning_high_context: {
    variantId: 'statistical_reasoning_high_context',
    format: 'free_text',
    question:
      'The data shows a strong correlation between two variables, but you need to assess whether it reflects a causal relationship or a confound. How do you reason through this?',
    instruction:
      'Explain your approach to distinguishing correlation from causation. Describe what tests or additional data would help you form a defensible position.',
    scoringGuidance:
      'Strong: names the specific correlation in the case, identifies plausible confounding variables or reverse causation mechanisms, describes at least one test or analysis that would provide causal evidence (e.g., natural experiment, instrumental variable, time-lag analysis), and states what level of evidence would be sufficient to act on. Weak: states "correlation is not causation" without identifying the specific confound or proposing a path to causal evidence.',
  },

  // ── Insight Synthesis ────────────────────────────────────────────────────────

  insight_synthesis_low_context: {
    variantId: 'insight_synthesis_low_context',
    format: 'free_text',
    question:
      'What is the single most actionable insight from this analysis, and why does it matter?',
    instruction:
      'State the insight clearly and explain what decision or action it should drive.',
    scoringGuidance:
      'Strong: states a specific, non-obvious insight grounded in the case data (not a restatement of a data point), connects it to a concrete decision or action, and explains why it matters relative to other things that could be concluded. Weak: restates a data observation as an insight, identifies an insight without connecting it to an action, or names an insight too generic to be actionable.',
  },
  insight_synthesis_medium_context: {
    variantId: 'insight_synthesis_medium_context',
    format: 'free_text',
    question:
      'Multiple metrics are pointing toward different implications. How do you synthesize these into one coherent, actionable insight?',
    instruction:
      'Explain how you integrate the signals and why the synthesis you have arrived at is the most useful framing for decision-making.',
    scoringGuidance:
      'Strong: names the specific signals in tension, explains the synthesis logic (e.g., which signal is more reliable, what level of abstraction resolves the tension), arrives at one clear insight, and explains why that framing is more useful for decision-making than alternatives. Weak: summarizes each signal separately without synthesizing them, or arrives at a conclusion that ignores some of the signals.',
  },
  insight_synthesis_high_context: {
    variantId: 'insight_synthesis_high_context',
    format: 'free_text',
    question:
      'Your analysis produces two plausible interpretations that lead to opposite recommendations. How do you decide which to present, and how do you handle the uncertainty honestly?',
    instruction:
      'Reason through the trade-offs of each interpretation. Explain your decision-making process and how you would communicate the residual uncertainty.',
    scoringGuidance:
      'Strong: names both interpretations and their opposing recommendations, applies explicit criteria to choose between them (e.g., which is more robust to being wrong, which aligns better with the available evidence, which has lower downside if incorrect), commits to a recommendation, and frames the communication to acknowledge the alternative without undermining confidence in the recommendation. Weak: presents both interpretations without choosing, or chooses without explaining why.',
  },

  // ── Analytical Communication ─────────────────────────────────────────────────

  analytical_communication_low_context: {
    variantId: 'analytical_communication_low_context',
    format: 'free_text',
    question:
      'How would you explain your main finding to someone without a technical or analytical background?',
    instruction:
      'Communicate your insight in clear, plain language. Avoid jargon and focus on meaning and implication.',
    scoringGuidance:
      'Strong: translates the finding into plain language with a concrete analogy or real-world reference, leads with the implication rather than the method, and communicates what it means for the audience rather than what was done analytically. Weak: uses technical terms without translation, explains the methodology rather than the finding, or communicates the data without the meaning.',
  },
  analytical_communication_medium_context: {
    variantId: 'analytical_communication_medium_context',
    format: 'free_text',
    question:
      'You need to present the same analysis to a data science team and to a business leadership team. How do you adapt your communication for each audience?',
    instruction:
      'Explain how you would tailor the emphasis, language, and level of detail for each audience without presenting different conclusions.',
    scoringGuidance:
      'Strong: identifies the specific needs of each audience (technical team wants methodology and reproducibility; leadership wants implication and action), names concrete changes in language, emphasis, and depth, and maintains a consistent underlying finding and recommendation across both. Weak: presents the same communication to both audiences, or adapts so heavily that the core finding changes between presentations.',
  },
  analytical_communication_high_context: {
    variantId: 'analytical_communication_high_context',
    format: 'free_text',
    question:
      'You need to present a finding that carries meaningful uncertainty to a skeptical executive audience that is expecting clean, definitive answers. How do you structure this communication?',
    instruction:
      'Explain how you would frame the finding, handle the uncertainty honestly, anticipate skepticism, and maintain credibility when you cannot be fully definitive.',
    scoringGuidance:
      'Strong: leads with the recommendation (not the uncertainty), quantifies or bounds the uncertainty explicitly, pre-empts the skeptic\'s most likely objection, explains what would resolve the uncertainty and on what timeline, and maintains a clear action recommendation despite the caveat. Weak: buries the finding in caveats, presents the uncertainty as a reason not to act, or avoids quantifying the uncertainty to appear more confident.',
  },
};
