/**
 * Track-specific analysis configuration.
 *
 * Provides skill labels, narratives, recommendations, archetype classification,
 * and firm/fund fit weights for each career track. The analysis engine uses
 * this config so it evaluates candidates against the right professional standards.
 */

import type {
  SkillAssessment,
  TrajectoryPattern,
  SkillDetail,
  CandidateArchetype,
  FirmFit,
} from '@/lib/api/diagnosticClient';

// ─── Config interface ────────────────────────────────────────────────────────

interface ArchetypeTemplate {
  id: string;
  name: string;
  description: string;
  tagline: string;
}

export interface TrackAnalysisConfig {
  skillLabels: Record<string, string>;
  skillNarratives: Record<string, Record<SkillAssessment, string>>;
  skillRecommendations: Record<string, { title: string; description: string }>;
  classifyArchetype: (skills: SkillDetail[], trajectory: TrajectoryPattern) => CandidateArchetype;
  firmWeights: Record<string, Record<string, number>>;
  firmFitSectionTitle: string;
}

// ─── Consulting config ───────────────────────────────────────────────────────

const CONSULTING_SKILL_LABELS: Record<string, string> = {
  problem_structuring: 'Structuring',
  hypothesis_driven_thinking: 'Hypothesis Thinking',
  analytical_thinking: 'Analytical Thinking',
  client_communication: 'Client Communication',
  decision_recommendation: 'Decision & Recommendation',
};

const CONSULTING_SKILL_NARRATIVES: Record<string, Record<SkillAssessment, string>> = {
  problem_structuring: {
    ABOVE_THRESHOLD: 'Strong ability to decompose ambiguous problems into structured frameworks. Your structuring instincts align with top-tier consulting expectations.',
    NEAR_THRESHOLD: 'Demonstrates competent structuring ability that approaches the benchmark. With targeted practice on MECE decomposition, this skill can become a clear strength.',
    BELOW_THRESHOLD: 'Structuring ability shows promise but falls short of the consulting benchmark. Focus on building repeatable frameworks for common problem types.',
    CRITICAL_GAP: 'Significant gap in problem structuring — a foundational consulting skill. Prioritize structured thinking exercises and case practice to build this capability.',
  },
  hypothesis_driven_thinking: {
    ABOVE_THRESHOLD: 'Demonstrates a clear hypothesis-first approach, testing and refining assumptions efficiently. This is a differentiating strength in consulting interviews.',
    NEAR_THRESHOLD: 'Shows emerging hypothesis-driven instincts. Strengthening the habit of leading with a hypothesis before diving into analysis will push this above threshold.',
    BELOW_THRESHOLD: 'Tendency toward data-gathering before forming hypotheses. Consulting requires leading with a point of view — practice forming early hypotheses and testing them.',
    CRITICAL_GAP: 'Lacks a hypothesis-driven approach, which is a core differentiator in consulting. Focus on building the muscle of forming and testing hypotheses early.',
  },
  analytical_thinking: {
    ABOVE_THRESHOLD: 'Excellent analytical capabilities with strong quantitative reasoning and pattern recognition. Your analysis stands out as a core strength.',
    NEAR_THRESHOLD: 'Solid analytical foundation approaching the consulting benchmark. Sharpening quantitative reasoning and synthesis will cement this as a strength.',
    BELOW_THRESHOLD: 'Analytical thinking needs development to meet consulting standards. Focus on quantitative reasoning, data interpretation, and drawing actionable insights.',
    CRITICAL_GAP: 'Major gap in analytical thinking — the primary consulting capability. Intensive practice on quantitative reasoning and case math is essential.',
  },
  client_communication: {
    ABOVE_THRESHOLD: 'Clear, executive-ready communication style with strong framing and concision. Your communication would resonate well in client-facing settings.',
    NEAR_THRESHOLD: 'Communication is clear and competent, approaching professional consulting standards. Refining executive presence and concision will push this forward.',
    BELOW_THRESHOLD: 'Communication style needs refinement for consulting contexts. Focus on leading with the answer, structuring responses top-down, and being more concise.',
    CRITICAL_GAP: 'Communication falls significantly below consulting expectations. Prioritize pyramid-structured responses and practicing concise, insight-led delivery.',
  },
  decision_recommendation: {
    ABOVE_THRESHOLD: 'Strong ability to synthesize analysis into clear, defensible recommendations. You demonstrate the conviction expected at top firms.',
    NEAR_THRESHOLD: 'Shows good instincts for making recommendations but occasionally hedges. Building confidence in committing to a position under uncertainty will help.',
    BELOW_THRESHOLD: 'Recommendations tend to be tentative or insufficiently supported. Practice making bold, evidence-backed recommendations even with incomplete data.',
    CRITICAL_GAP: 'Struggles to commit to clear recommendations — a critical consulting output. Focus on building the habit of synthesizing analysis into decisive action items.',
  },
};

const CONSULTING_SKILL_RECOMMENDATIONS: Record<string, { title: string; description: string }> = {
  problem_structuring: {
    title: 'Build Repeatable Structuring Frameworks',
    description: 'Practice MECE decomposition on 2-3 new problems daily. Start with common consulting archetypes (profitability, market entry, operations) and build muscle memory for clean issue trees.',
  },
  hypothesis_driven_thinking: {
    title: 'Lead with Hypotheses, Not Data Collection',
    description: 'Before every analysis, write down your hypothesis in one sentence. Track how often you confirm vs. pivot. This trains the consulting habit of being "hypothesis-driven, not data-driven."',
  },
  analytical_thinking: {
    title: 'Sharpen Quantitative Reasoning',
    description: 'Work through market sizing and case math problems daily. Focus on estimation accuracy, identifying the right metrics, and connecting quantitative findings to strategic implications.',
  },
  client_communication: {
    title: 'Practice Top-Down, Insight-Led Communication',
    description: 'Record yourself answering case questions and review for concision. Lead every response with the answer, then support with 2-3 structured reasons. Eliminate filler and hedging language.',
  },
  decision_recommendation: {
    title: 'Commit to Clear Recommendations Under Uncertainty',
    description: 'In every practice case, force yourself to make a definitive recommendation with 60% of the data. State your recommendation, the key evidence, risks, and next steps — in that order.',
  },
};

const CONSULTING_ARCHETYPE_TEMPLATES: Record<string, ArchetypeTemplate> = {
  pressure_performer: {
    id: 'pressure_performer',
    name: 'The Pressure Performer',
    description: 'You thrive under increasing complexity, delivering stronger performance as case difficulty escalates — a rare and highly valued trait in consulting.',
    tagline: 'RISES UNDER PRESSURE',
  },
  structured_analyst: {
    id: 'structured_analyst',
    name: 'The Structured Analyst',
    description: 'Your instinct to decompose problems into clean frameworks is your defining edge — structured thinkers anchor high-performing case teams.',
    tagline: 'TOP 15% STRUCTURERS',
  },
  hypothesis_driver: {
    id: 'hypothesis_driver',
    name: 'The Hypothesis Driver',
    description: 'You lead with hypotheses rather than data collection, testing and refining assumptions efficiently — the hallmark of experienced consultants.',
    tagline: 'HYPOTHESIS-FIRST THINKER',
  },
  analytical_powerhouse: {
    id: 'analytical_powerhouse',
    name: 'The Analytical Powerhouse',
    description: 'Your quantitative reasoning and pattern recognition stand out as elite-level capabilities that drive insight generation.',
    tagline: 'ELITE ANALYTICAL DEPTH',
  },
  communicator: {
    id: 'communicator',
    name: 'The Communicator',
    description: 'Your ability to frame insights clearly and communicate with executive presence is a differentiating strength in client-facing roles.',
    tagline: 'CLIENT-READY PRESENCE',
  },
  balanced_generalist: {
    id: 'balanced_generalist',
    name: 'The Balanced Generalist',
    description: 'Your evenly distributed skill profile shows versatility across all consulting dimensions — a strong foundation for any engagement type.',
    tagline: 'VERSATILE ALL-ROUNDER',
  },
};

function classifyConsultingArchetype(skills: SkillDetail[], overallTrajectory: TrajectoryPattern): CandidateArchetype {
  const sorted = [...skills].sort((a, b) => b.score - a.score);
  const topTraits = sorted.slice(0, 2).map((s) => s.label);
  const top1Id = sorted[0]?.skillId;
  const top2Ids = sorted.slice(0, 2).map((s) => s.skillId);

  if (overallTrajectory === 'IMPROVING') {
    const l1Scores = skills.flatMap((s) => s.stageScores.filter((ss) => ss.stage === 1).map((ss) => ss.score));
    const l3Scores = skills.flatMap((s) => s.stageScores.filter((ss) => ss.stage === 3).map((ss) => ss.score));
    const l1Avg = l1Scores.length > 0 ? l1Scores.reduce((a, b) => a + b, 0) / l1Scores.length : 0;
    const l3Avg = l3Scores.length > 0 ? l3Scores.reduce((a, b) => a + b, 0) / l3Scores.length : 0;
    if (l3Avg > l1Avg) {
      return { ...CONSULTING_ARCHETYPE_TEMPLATES.pressure_performer, topTraits };
    }
  }

  if (
    top2Ids.includes('problem_structuring') &&
    (top2Ids.includes('analytical_thinking') || top2Ids.includes('client_communication'))
  ) {
    return { ...CONSULTING_ARCHETYPE_TEMPLATES.structured_analyst, topTraits };
  }

  if (top1Id === 'hypothesis_driven_thinking') {
    return { ...CONSULTING_ARCHETYPE_TEMPLATES.hypothesis_driver, topTraits };
  }

  if (top1Id === 'analytical_thinking' && sorted[0].score >= 75) {
    return { ...CONSULTING_ARCHETYPE_TEMPLATES.analytical_powerhouse, topTraits };
  }

  if (top1Id === 'client_communication') {
    return { ...CONSULTING_ARCHETYPE_TEMPLATES.communicator, topTraits };
  }

  return { ...CONSULTING_ARCHETYPE_TEMPLATES.balanced_generalist, topTraits };
}

const CONSULTING_FIRM_WEIGHTS: Record<string, Record<string, number>> = {
  McKinsey: {
    problem_structuring: 1.3,
    hypothesis_driven_thinking: 1.5,
    analytical_thinking: 1.1,
    client_communication: 0.8,
    decision_recommendation: 0.9,
  },
  BCG: {
    problem_structuring: 1.0,
    hypothesis_driven_thinking: 1.1,
    analytical_thinking: 1.5,
    client_communication: 1.0,
    decision_recommendation: 1.0,
  },
  Bain: {
    problem_structuring: 1.0,
    hypothesis_driven_thinking: 0.9,
    analytical_thinking: 1.1,
    client_communication: 1.2,
    decision_recommendation: 1.5,
  },
};

// ─── Finance config ──────────────────────────────────────────────────────────

const FINANCE_SKILL_LABELS: Record<string, string> = {
  financial_signal_interpretation: 'Financial Signal Reading',
  investment_thesis_formation: 'Investment Thesis',
  capital_allocation_judgment: 'Capital Allocation',
  risk_sensitivity_reasoning: 'Risk Sensitivity',
  investment_recommendation_clarity: 'Investment Recommendation',
};

const FINANCE_SKILL_NARRATIVES: Record<string, Record<SkillAssessment, string>> = {
  financial_signal_interpretation: {
    ABOVE_THRESHOLD: 'Strong ability to decompose financial statements and identify metrics that drive business value. Your instinct for reading financial signals is a clear edge.',
    NEAR_THRESHOLD: 'Demonstrates competent financial analysis approaching the benchmark. Sharpening your ability to distinguish leading vs. lagging indicators will push this above threshold.',
    BELOW_THRESHOLD: 'Financial signal interpretation needs development. Focus on P&L decomposition, distinguishing revenue drivers from cost metrics, and identifying unit economics.',
    CRITICAL_GAP: 'Major gap in financial signal reading — a foundational investment skill. Prioritize mastering financial statement analysis and key metric identification.',
  },
  investment_thesis_formation: {
    ABOVE_THRESHOLD: 'Strong thesis formation with clear articulation of why an investment works. You identify inflection points and value creation levers effectively.',
    NEAR_THRESHOLD: 'Shows emerging thesis-building instincts. Strengthening the habit of anchoring every thesis in specific value creation mechanisms will push this forward.',
    BELOW_THRESHOLD: 'Investment thesis formation needs work. Focus on identifying what must be true for an investment to generate target returns, not just why a company is "good."',
    CRITICAL_GAP: 'Significant gap in thesis formation — the core intellectual output in investing. Practice articulating specific value creation hypotheses with quantified upside.',
  },
  capital_allocation_judgment: {
    ABOVE_THRESHOLD: 'Excellent capital allocation reasoning with precise return calculations. Your ability to model entry, growth, and exit scenarios is a differentiating strength.',
    NEAR_THRESHOLD: 'Solid capital allocation foundation approaching the benchmark. Tightening calculation precision and modeling multiple scenarios will cement this as a strength.',
    BELOW_THRESHOLD: 'Capital allocation judgment needs development. Focus on end-to-end return calculation chains: entry valuation → projected financials → exit assumptions → MoM and IRR.',
    CRITICAL_GAP: 'Major gap in capital allocation reasoning. Unable to consistently produce correct return calculations — this is the core quantitative output expected in any investment role.',
  },
  risk_sensitivity_reasoning: {
    ABOVE_THRESHOLD: 'Strong risk awareness with quantified downside scenarios. You naturally pair risk identification with specific return compression calculations.',
    NEAR_THRESHOLD: 'Shows good risk instincts approaching the benchmark. Always pairing risk identification with quantified impact on returns will push this above threshold.',
    BELOW_THRESHOLD: 'Risk sensitivity is developing but too qualitative. Move beyond identifying risks to calculating their specific impact on returns under downside scenarios.',
    CRITICAL_GAP: 'Significant gap in risk reasoning. Risks are identified generically without quantification — every risk statement should include specific return impact calculations.',
  },
  investment_recommendation_clarity: {
    ABOVE_THRESHOLD: 'Clear, decisive investment recommendations anchored in return math. You communicate conviction backed by specific numbers — exactly what investment committees expect.',
    NEAR_THRESHOLD: 'Shows good recommendation instincts but occasionally lacks the return math anchor. Lead every recommendation with specific MoM/IRR targets and key assumptions.',
    BELOW_THRESHOLD: 'Recommendations tend to be qualitative rather than return-anchored. Practice structuring every recommendation as: "Invest at X× / Y% IRR because [thesis], downside to Z× if [risk]."',
    CRITICAL_GAP: 'Struggles to commit to clear investment recommendations with supporting return math. This is the critical output in any investment role — a recommendation without numbers is just an opinion.',
  },
};

const FINANCE_SKILL_RECOMMENDATIONS: Record<string, { title: string; description: string }> = {
  financial_signal_interpretation: {
    title: 'Master P&L Decomposition and Unit Economics',
    description: 'Practice breaking down revenue formulas and distinguishing revenue drivers from cost metrics. For every company, identify the 3 metrics that most drive enterprise value and explain why.',
  },
  investment_thesis_formation: {
    title: 'Anchor Every Thesis in Specific Value Creation Levers',
    description: 'For each investment case, identify exactly what must change (revenue growth, margin expansion, multiple expansion) and by how much to hit target returns. Vague theses are not theses.',
  },
  capital_allocation_judgment: {
    title: 'Drill Return Calculation Chains End-to-End',
    description: 'Practice entry valuation → projected financials → exit assumptions → MoM → IRR until the calculation chain is automatic. Speed and accuracy on return math is non-negotiable.',
  },
  risk_sensitivity_reasoning: {
    title: 'Always Quantify the Downside Scenario',
    description: 'Pair every risk identification with a specific calculation of return compression. "Revenue growth slows from 30% to 15%" should immediately trigger "which compresses MoM from 3.2× to 1.8×."',
  },
  investment_recommendation_clarity: {
    title: 'Anchor Every Recommendation in Return Math',
    description: 'Structure every recommendation as: "Invest at 2.5× MoM / 20% IRR because [thesis], acknowledging downside to 1.4× / 7% if [risk]." No recommendation without numbers.',
  },
};

const FINANCE_ARCHETYPE_TEMPLATES: Record<string, ArchetypeTemplate> = {
  pressure_performer: {
    id: 'pressure_performer',
    name: 'The Pressure Performer',
    description: 'You thrive under increasing deal complexity, delivering stronger analysis as case difficulty escalates — a rare and highly valued trait in investment roles.',
    tagline: 'RISES UNDER PRESSURE',
  },
  quantitative_modeler: {
    id: 'quantitative_modeler',
    name: 'The Quantitative Modeler',
    description: 'Your precision in financial calculations and capital allocation reasoning is your defining edge — quantitative modelers anchor high-performing deal teams.',
    tagline: 'ELITE QUANTITATIVE PRECISION',
  },
  thesis_builder: {
    id: 'thesis_builder',
    name: 'The Thesis Builder',
    description: 'You lead with investment hypotheses, identifying inflection points and value creation levers before diving into numbers — the hallmark of experienced investors.',
    tagline: 'THESIS-FIRST INVESTOR',
  },
  risk_adjusted_thinker: {
    id: 'risk_adjusted_thinker',
    name: 'The Risk-Adjusted Thinker',
    description: 'Your instinct to quantify downside scenarios and adjust expected returns for risk sets you apart — risk-adjusted thinking protects capital and builds LP trust.',
    tagline: 'DOWNSIDE-AWARE ANALYST',
  },
  deal_maker: {
    id: 'deal_maker',
    name: 'The Deal Maker',
    description: 'Your ability to synthesize analysis into clear, conviction-backed investment recommendations is a differentiating strength in any deal process.',
    tagline: 'CONVICTION-DRIVEN RECOMMENDER',
  },
  balanced_investor: {
    id: 'balanced_investor',
    name: 'The Balanced Investor',
    description: 'Your evenly distributed skill profile shows versatility across all investment dimensions — a strong foundation for any deal type or fund strategy.',
    tagline: 'VERSATILE ALL-ROUNDER',
  },
};

function classifyFinanceArchetype(skills: SkillDetail[], overallTrajectory: TrajectoryPattern): CandidateArchetype {
  const sorted = [...skills].sort((a, b) => b.score - a.score);
  const topTraits = sorted.slice(0, 2).map((s) => s.label);
  const top1Id = sorted[0]?.skillId;
  const top2Ids = sorted.slice(0, 2).map((s) => s.skillId);

  // Pressure Performer: L3 avg > L1 avg
  if (overallTrajectory === 'IMPROVING') {
    const l1Scores = skills.flatMap((s) => s.stageScores.filter((ss) => ss.stage === 1).map((ss) => ss.score));
    const l3Scores = skills.flatMap((s) => s.stageScores.filter((ss) => ss.stage === 3).map((ss) => ss.score));
    const l1Avg = l1Scores.length > 0 ? l1Scores.reduce((a, b) => a + b, 0) / l1Scores.length : 0;
    const l3Avg = l3Scores.length > 0 ? l3Scores.reduce((a, b) => a + b, 0) / l3Scores.length : 0;
    if (l3Avg > l1Avg) {
      return { ...FINANCE_ARCHETYPE_TEMPLATES.pressure_performer, topTraits };
    }
  }

  // Quantitative Modeler: top 2 include capital_allocation + financial_signal
  if (
    top2Ids.includes('capital_allocation_judgment') &&
    top2Ids.includes('financial_signal_interpretation')
  ) {
    return { ...FINANCE_ARCHETYPE_TEMPLATES.quantitative_modeler, topTraits };
  }

  // Thesis Builder: investment_thesis is #1
  if (top1Id === 'investment_thesis_formation') {
    return { ...FINANCE_ARCHETYPE_TEMPLATES.thesis_builder, topTraits };
  }

  // Risk-Adjusted Thinker: risk_sensitivity is #1 AND score >= 75
  if (top1Id === 'risk_sensitivity_reasoning' && sorted[0].score >= 75) {
    return { ...FINANCE_ARCHETYPE_TEMPLATES.risk_adjusted_thinker, topTraits };
  }

  // Deal Maker: investment_recommendation is #1
  if (top1Id === 'investment_recommendation_clarity') {
    return { ...FINANCE_ARCHETYPE_TEMPLATES.deal_maker, topTraits };
  }

  // Balanced Investor: fallback
  return { ...FINANCE_ARCHETYPE_TEMPLATES.balanced_investor, topTraits };
}

const FINANCE_FIRM_WEIGHTS: Record<string, Record<string, number>> = {
  'Growth Equity': {
    financial_signal_interpretation: 1.1,
    investment_thesis_formation: 1.5,
    capital_allocation_judgment: 1.0,
    risk_sensitivity_reasoning: 0.9,
    investment_recommendation_clarity: 1.0,
  },
  'Buyout PE': {
    financial_signal_interpretation: 1.0,
    investment_thesis_formation: 0.9,
    capital_allocation_judgment: 1.5,
    risk_sensitivity_reasoning: 1.2,
    investment_recommendation_clarity: 1.0,
  },
  'Investment Banking': {
    financial_signal_interpretation: 1.2,
    investment_thesis_formation: 1.0,
    capital_allocation_judgment: 1.0,
    risk_sensitivity_reasoning: 0.9,
    investment_recommendation_clarity: 1.5,
  },
};

// ─── Public API ──────────────────────────────────────────────────────────────

const CONSULTING_CONFIG: TrackAnalysisConfig = {
  skillLabels: CONSULTING_SKILL_LABELS,
  skillNarratives: CONSULTING_SKILL_NARRATIVES,
  skillRecommendations: CONSULTING_SKILL_RECOMMENDATIONS,
  classifyArchetype: classifyConsultingArchetype,
  firmWeights: CONSULTING_FIRM_WEIGHTS,
  firmFitSectionTitle: 'MBB FIRM FIT',
};

const FINANCE_CONFIG: TrackAnalysisConfig = {
  skillLabels: FINANCE_SKILL_LABELS,
  skillNarratives: FINANCE_SKILL_NARRATIVES,
  skillRecommendations: FINANCE_SKILL_RECOMMENDATIONS,
  classifyArchetype: classifyFinanceArchetype,
  firmWeights: FINANCE_FIRM_WEIGHTS,
  firmFitSectionTitle: 'FUND STRATEGY FIT',
};

export function getTrackAnalysisConfig(trackId: string): TrackAnalysisConfig {
  switch (trackId) {
    case 'finance':
      return FINANCE_CONFIG;
    default:
      return CONSULTING_CONFIG;
  }
}
