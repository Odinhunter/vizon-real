import type { ProbeVariantContent } from '../types';

/**
 * User-facing probe content for the Finance track.
 * Keyed by variantId from the probe registry.
 */
export const financeProbeContent: Record<string, ProbeVariantContent> = {
  // ── Financial Signal Interpretation ─────────────────────────────────────────

  financial_signal_low_context: {
    variantId: 'financial_signal_low_context',
    format: 'free_text',
    question:
      "What do the financial metrics tell you about this company's current performance and trajectory?",
    instruction:
      'Identify the most important signals and explain what they indicate about the business.',
    scoringGuidance:
      'Strong: identifies the 2–3 most diagnostic metrics from the case (e.g., revenue growth rate, margin trend, cash conversion), explains what each signals about the business model, and synthesizes them into a coherent trajectory view. Weak: lists metrics without interpretation, describes what the numbers are rather than what they mean, or treats all metrics as equally important.',
  },
  financial_signal_medium_context: {
    variantId: 'financial_signal_medium_context',
    format: 'free_text',
    question:
      'Revenue is growing but margins and cash conversion are deteriorating. What story does the data tell, and which signals are most diagnostic?',
    instruction:
      'Prioritize the signals that matter most and explain the pattern they form together.',
    scoringGuidance:
      'Strong: identifies the growth-quality tension explicitly, explains what deteriorating margins + cash conversion means together (e.g., investment-led vs. structural cost problem), names the most diagnostic metric for distinguishing the two, and grounds the interpretation in the specific case numbers. Weak: describes the symptoms without forming a coherent story, or treats revenue growth and margin compression as independent issues.',
  },
  financial_signal_high_context: {
    variantId: 'financial_signal_high_context',
    format: 'free_text',
    question:
      'The income statement, balance sheet, and cash flow statement are sending conflicting signals. How do you interpret this tension, and what does it tell you about the quality of reported earnings?',
    instruction:
      'Work through the specific tension between the financial statements and explain what it implies about the sustainability of reported performance.',
    scoringGuidance:
      'Strong: names the specific cross-statement tension in the case (e.g., net income growing but operating cash flow declining), explains the accounting mechanisms that could cause it (e.g., accrual timing, working capital build), assesses earnings quality implications, and states what additional disclosure would resolve the ambiguity. Weak: summarizes each statement separately without analyzing the tension between them.',
  },

  // ── Investment Thesis Formation ──────────────────────────────────────────────

  investment_thesis_low_context: {
    variantId: 'investment_thesis_low_context',
    format: 'free_text',
    question: 'What is your initial directional investment view on this company?',
    instruction:
      'Articulate a clear investment stance — bullish, bearish, or cautious — and the core logic behind it.',
    scoringGuidance:
      'Strong: commits to a clear directional stance, grounds it in 2–3 specific observations from the case, and names what would need to be true for the thesis to play out. Weak: hedges without a direction, describes the company without forming a view, or gives a stance with no supporting logic from the case data.',
  },
  investment_thesis_medium_context: {
    variantId: 'investment_thesis_medium_context',
    format: 'free_text',
    question:
      'What is your investment thesis, and what are the two or three assumptions it most depends on?',
    instruction:
      'State the thesis and identify what must be true for it to hold. How confident are you in each assumption?',
    scoringGuidance:
      'Strong: states a specific thesis (not just a direction), names 2–3 assumptions that are load-bearing for the thesis, assesses the confidence level for each with reasoning grounded in the case, and notes what would invalidate the thesis. Weak: states a direction without articulating a thesis, or lists assumptions without assessing their probability or importance.',
  },
  investment_thesis_high_context: {
    variantId: 'investment_thesis_high_context',
    format: 'free_text',
    question:
      'Revenue growth is strong but unit economics are deteriorating and valuation is stretched. Multiple factors are pulling in different directions. How do you form a coherent investment view?',
    instruction:
      'Explain how you weigh the competing factors and arrive at a position. Identify what would cause you to change your thesis.',
    scoringGuidance:
      'Strong: names the key tension (growth vs. economics vs. valuation), explains a clear framework for weighing them (e.g., at what margin trajectory does the growth multiple become defensible), arrives at a specific view, and names the 1–2 data points that would flip the thesis. References specific case data. Weak: describes the tension without resolving it, or produces a balanced "on one hand / on the other hand" without a conclusion.',
  },

  // ── Capital Allocation Judgment ──────────────────────────────────────────────

  capital_allocation_low_context: {
    variantId: 'capital_allocation_low_context',
    format: 'free_text',
    question:
      'How should this company prioritize its capital deployment given the financial position you see?',
    instruction:
      'State a clear capital allocation priority and the logic behind it.',
    scoringGuidance:
      'Strong: states a specific capital allocation priority grounded in the case financial position (e.g., debt paydown before growth investment given leverage ratio, or growth investment given strong free cash flow), explains the return logic, and names the opportunity cost of the alternative. Weak: lists options without prioritizing, or gives a generic answer not connected to the case data.',
  },
  capital_allocation_medium_context: {
    variantId: 'capital_allocation_medium_context',
    format: 'free_text',
    question:
      'The company is weighing two competing uses of capital: investing in organic growth versus paying down debt. Which would you prioritize, and why?',
    instruction:
      'Compare the incremental returns and strategic logic of each option. Identify what information would change your answer.',
    scoringGuidance:
      'Strong: compares the after-tax cost of debt vs. expected incremental return on growth investment using case-specific numbers, names the leverage threshold or coverage ratio that changes the answer, and identifies 1–2 pieces of information that would materially shift the recommendation. Weak: gives a direction without the return comparison, or applies generic capital structure principles without engaging with the case numbers.',
  },
  capital_allocation_high_context: {
    variantId: 'capital_allocation_high_context',
    format: 'free_text',
    question:
      'The company faces simultaneous pressure to fund growth, service existing debt, and maintain liquidity buffer — but cannot fully satisfy all three. How do you reason through this capital allocation trade-off?',
    instruction:
      'Explain your framework for prioritizing competing capital needs, the risks of each trade-off, and how you would communicate this to management.',
    scoringGuidance:
      'Strong: applies a clear prioritization hierarchy (e.g., liquidity floor first, then debt service, then growth — or argues explicitly for a different ordering), quantifies the trade-off using case numbers, names the risk of under-funding each need, and frames the communication to management around the constraint rather than the choice. Weak: treats the three needs as equally urgent, or recommends without acknowledging that all three cannot be met simultaneously.',
  },

  // ── Risk Sensitivity Reasoning ──────────────────────────────────────────────

  risk_assessment_low_context: {
    variantId: 'risk_assessment_low_context',
    format: 'free_text',
    question:
      'What is the primary financial or operational risk you would flag for this investment?',
    instruction:
      'Identify the single most important downside risk and explain how you would assess its potential impact.',
    scoringGuidance:
      'Strong: names a specific risk grounded in the case data (not a generic "execution risk"), explains the mechanism by which it could materialize, and estimates the order-of-magnitude impact on the investment case. Weak: lists multiple risks without prioritizing, names a generic risk without connecting it to the case, or describes the risk without assessing its impact.',
  },
  risk_assessment_medium_context: {
    variantId: 'risk_assessment_medium_context',
    format: 'free_text',
    question:
      'What are the two or three most important risks in this situation? How would you rank them and estimate their potential impact?',
    instruction:
      'Prioritize the risks with clear reasoning and explain how each would affect the investment case.',
    scoringGuidance:
      'Strong: names 2–3 specific risks grounded in the case, ranks them with explicit logic (e.g., probability × impact or which is least hedgeable), estimates the impact of each on the investment case numerically or directionally, and notes how the risks interact. Weak: lists risks in no particular order, applies generic risk categories without case-specific grounding, or describes risks without estimating impact.',
  },
  risk_assessment_high_context: {
    variantId: 'risk_assessment_high_context',
    format: 'free_text',
    question:
      'Macro headwinds, company-specific execution risk, and balance sheet pressure are all present simultaneously. How do you think about the combined risk profile?',
    instruction:
      'Explain how you reason about the interaction between risks, which dominate the picture, and how this informs your overall investment view.',
    scoringGuidance:
      'Strong: analyzes the correlation structure between the three risk types (e.g., macro headwinds amplify balance sheet stress), names which risk dominates (and why), explains how the combined profile changes the required return threshold, and states how this feeds into the investment view. References the specific risks present in the case. Weak: treats each risk independently, or summarizes each risk without analyzing how they interact.',
  },

  // ── Investment Recommendation Clarity ────────────────────────────────────────

  investment_recommendation_low_context: {
    variantId: 'investment_recommendation_low_context',
    format: 'free_text',
    question: 'What is your investment recommendation, and what is your core rationale?',
    instruction:
      'Give a clear buy, hold, or sell recommendation with your key supporting logic.',
    scoringGuidance:
      'Strong: gives a specific recommendation (buy/hold/sell or equivalent), anchors it in 2–3 reasons directly drawn from the case analysis, and names the key risk to the recommendation. Weak: hedges without committing, restates the analysis without a recommendation, or gives a recommendation disconnected from the case data.',
  },
  investment_recommendation_medium_context: {
    variantId: 'investment_recommendation_medium_context',
    format: 'free_text',
    question:
      'Given the risk/return profile, how do you structure your recommendation, and what are the key conditions that would cause you to change it?',
    instruction:
      'Frame the recommendation with explicit reasoning about risk weighting and identify the two or three factors most likely to alter your view.',
    scoringGuidance:
      'Strong: frames the recommendation in terms of the risk/return trade-off explicitly (e.g., return is sufficient given the risk at current price), names 2–3 specific conditions that would flip the view, and assigns rough probability or watchlist criteria to each. Weak: gives a recommendation without the risk/return framing, or names "change conditions" too generically (e.g., "if results disappoint").',
  },
  investment_recommendation_high_context: {
    variantId: 'investment_recommendation_high_context',
    format: 'free_text',
    question:
      "The consensus view on this investment is bullish. Your analysis leads you to a more cautious position. How do you defend your view, and what would cause you to change it?",
    instruction:
      'Argue your position clearly. Anticipate the strongest counterarguments and explain what evidence would shift your stance.',
    scoringGuidance:
      'Strong: names the specific consensus argument being challenged, explains the analytical basis for the divergent view using case data, pre-empts the strongest bull counterargument, and names the specific evidence (e.g., metric threshold, management action) that would cause a view change. Weak: restates the cautious view without engaging with the consensus, or names evidence too vaguely to be actionable.',
  },
};
