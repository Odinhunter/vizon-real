import type { ProbeVariantContent } from '../types';

/**
 * User-facing probe content for the Consulting track.
 * Keyed by variantId from the probe registry.
 *
 * Format guide:
 * - free_text: open reasoning only
 * - mcq_plus_reasoning: single-select + reasoning
 * - multi_select_plus_reasoning: multi-select + reasoning
 *
 * Two probes are implemented as non-free_text to demonstrate the pattern.
 * All others default to free_text and can be upgraded when final content is set.
 */
export const consultingProbeContent: Record<string, ProbeVariantContent> = {
  // ── Problem Structuring ─────────────────────────────────────────────────────

  problem_structuring_low_context: {
    variantId: 'problem_structuring_low_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'To begin diagnosing the profit decline, select the THREE areas you would investigate first.',
    instruction:
      'Choose exactly three areas. Then explain in 3–5 bullet points how you structured the problem and why you prioritised these areas. Max 120 words.',
    options: [
      { id: 'A', text: 'Membership trends — how membership volumes have changed over time' },
      { id: 'B', text: 'Pricing changes — whether membership fees or ancillary prices have shifted' },
      { id: 'C', text: 'Operating costs — whether fixed or variable costs have increased per gym' },
      { id: 'D', text: 'Competitor activity — whether new gyms or lower-price alternatives have entered the market' },
      { id: 'E', text: 'Customer experience — whether member satisfaction or complaints have changed' },
      { id: 'F', text: 'Marketing spend — whether acquisition spend has increased without proportionate returns' },
      { id: 'G', text: 'Gym equipment quality — whether equipment age or failures are affecting the experience' },
    ],
    scoringGuidance:
      'Strong: selects options that cover both revenue and cost dimensions (e.g. A+C+D or A+C+E), and the reasoning shows structured decomposition — separating top-line from cost drivers and justifying the prioritisation order. Weak: random selection, generic reasoning not tied to the specific case, or all choices from one dimension (e.g. three customer experience factors with no cost perspective).',
  },

  problem_structuring_medium_context: {
    variantId: 'problem_structuring_medium_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'Before deciding whether VoltCharge should expand into Germany, select the THREE most important areas to investigate first.',
    instruction:
      'Choose exactly three areas. Then explain in 3–5 bullet points how you structured the growth decision and why you selected these three areas. Max 120 words.',
    options: [
      { id: 'A', text: 'Size and growth of the EV market in Germany' },
      { id: 'B', text: 'Historical electricity pricing trends in Europe' },
      { id: 'C', text: 'Competitive landscape of EV charging networks in Germany' },
      { id: 'D', text: 'Customer preferences for EV brands' },
      { id: 'E', text: 'Economics of operating charging stations (unit economics and payback)' },
      { id: 'F', text: 'Long-term EV emissions policy targets' },
      { id: 'G', text: 'Marketing strategy for EV drivers' },
    ],
    scoringGuidance:
      'Strong: selects A (market attractiveness), C (competitive landscape), and E (unit economics) — the three core pillars of any market entry decision. Reasoning shows a structured approach: is the market big enough, can we win share, and does the economics work? Weak: prioritises unrelated operational topics (D, G) or policy factors (B, F) that are secondary to the go/no-go decision, or fails to link the three areas to the specific entry question.',
  },

  problem_structuring_high_context: {
    variantId: 'problem_structuring_high_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'Before deciding whether to acquire QuickCart or enter Singapore organically, select the THREE most important areas to investigate first.',
    instruction:
      'Choose exactly three areas. Then explain in 3–5 bullet points how you structured the acquisition decision and why you selected these three areas. Max 120 words.',
    options: [
      { id: 'A', text: 'Size and growth of the food delivery market in Singapore' },
      { id: 'B', text: 'Historical restaurant pricing trends in Singapore' },
      { id: 'C', text: 'Competitive landscape of delivery platforms currently operating in Singapore' },
      { id: 'D', text: 'Economics of operating a delivery platform at scale' },
      { id: 'E', text: 'QuickCart\'s financial performance, user base, and operational assets' },
      { id: 'F', text: 'Long-term restaurant licensing and food safety regulations' },
      { id: 'G', text: 'Marketing campaign effectiveness for food delivery apps' },
    ],
    scoringGuidance:
      'Strong: selects A (market attractiveness), C (competitive dynamics), and E (target company assessment) — the three pillars of an acquisition entry decision. Reasoning shows a structured framing: is the market worth entering, can SwiftEats compete, and is QuickCart a good vehicle to do so? D is also defensible as a substitute for C or E. Weak: selects unrelated operational areas (B, F, G) or fails to include the target company assessment (E), which is essential for an M&A decision.',
  },

  // ── Hypothesis-Driven Thinking ──────────────────────────────────────────────

  hypothesis_driven_thinking_low_context: {
    variantId: 'hypothesis_driven_thinking_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'The data shows total membership peaked in Q2 and fell sharply to Q4. What is your initial hypothesis for the profit decline?',
    instruction:
      'Select the hypothesis you find most compelling, then explain what additional data you would request to test it. Max 100 words.',
    options: [
      { id: 'A', text: 'Membership decline is reducing revenue faster than costs can be cut, compressing profit' },
      { id: 'B', text: 'Rising operating costs are the primary driver, independent of membership volumes' },
      { id: 'C', text: 'Competitive pressure is forcing implicit discounting or higher acquisition spend' },
      { id: 'D', text: 'Operational inefficiency has increased cost per member served' },
    ],
    scoringGuidance:
      'Correct answer: A. Strong: selects A (most defensible from the exhibit showing sharp membership decline), articulates how falling membership reduces revenue under largely fixed operating costs, and requests targeted follow-up data (e.g. revenue per gym, cost structure). Partial: selects A but reasoning is thin or the follow-up data request is generic. Weak: selects another option without engaging with the exhibit, or lists multiple hypotheses without a leading view.',
  },

  hypothesis_driven_thinking_medium_context: {
    variantId: 'hypothesis_driven_thinking_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the market data shown, what is your initial hypothesis about VoltCharge entering Germany?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional information you would request to test it — be specific about the metrics or data you need. Max 100 words.',
    options: [
      { id: 'A', text: 'The market is attractive due to strong EV growth — VoltCharge should prioritise speed of entry' },
      { id: 'B', text: 'Competition from established operators may limit VoltCharge\'s ability to gain meaningful market share' },
      { id: 'C', text: 'Electricity prices and input costs may make charging station economics unattractive' },
      { id: 'D', text: 'Government licensing or permitting may restrict new operators from entering the market' },
    ],
    scoringGuidance:
      'Both A and B are defensible given the data — A is supported by the 1.2M → 3M EV growth trajectory; B is supported by the presence of two large incumbents already operating. Strong: selects A or B, articulates the logic clearly, and requests specific metrics to test (e.g. competitor station count by region, utilization rates, geographic white-space mapping, charger payback periods). Weak: selects C or D without basis in the exhibit, or requests vague or unrelated information.',
  },

  hypothesis_driven_thinking_high_context: {
    variantId: 'hypothesis_driven_thinking_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the market data shown, what is your initial hypothesis regarding SwiftEats\' entry strategy into Singapore?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional information you would request to test it — be specific about the metrics or data you need. Max 100 words.',
    options: [
      { id: 'A', text: 'Acquiring QuickCart may allow faster market entry and leverage an existing network and customer base' },
      { id: 'B', text: 'Organic entry may lead to lower long-term costs and give SwiftEats full operational control' },
      { id: 'C', text: 'SwiftEats should avoid entering Singapore given the dominance of the top three incumbents' },
      { id: 'D', text: 'SwiftEats should focus on deepening market share in existing Southeast Asian markets first' },
    ],
    scoringGuidance:
      'Correct answer: A. The exhibit shows that top 3 incumbents control 85% of the market and that building organically takes 2–3 years — making QuickCart\'s existing driver network and restaurant base highly valuable. Strong: selects A, articulates how the network and speed advantage offset the acquisition premium, and requests specific data to test the thesis (QuickCart revenue, customer retention, driver utilisation, acquisition price). Weak: selects C or D without engaging with QuickCart\'s existing assets, or requests vague or unrelated metrics.',
  },

  // ── Analytical Thinking ─────────────────────────────────────────────────────

  analytical_thinking_low_context: {
    variantId: 'analytical_thinking_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the exhibit, what is the approximate change in monthly profit per gym between 6 months ago and today?',
    instruction:
      'Select the closest answer, then show your calculation. Max 120 words.',
    options: [
      { id: 'A', text: '~₹8L decline per gym per month' },
      { id: 'B', text: '~₹10L decline per gym per month' },
      { id: 'C', text: '~₹12L decline per gym per month' },
      { id: 'D', text: '~₹15L decline per gym per month' },
    ],
    scoringGuidance:
      'Correct answer: B. Calculation: Old revenue = 2,400 × ₹2,000 = ₹48L. New revenue = 1,950 × ₹2,000 = ₹39L. Revenue decline = ₹9L. Cost increase = ₹1L. Total profit decline = ₹10L per gym per month. Strong: selects B and shows full calculation with correct steps. Partial: selects B but has a minor arithmetic slip. Weak: selects the right answer without any calculation, or calculates incorrectly and selects the wrong option.',
  },

  analytical_thinking_medium_context: {
    variantId: 'analytical_thinking_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the market assumptions in the exhibit, what is the approximate total annual revenue of the EV charging market in Germany today?',
    instruction:
      'Select the closest answer. Then show your full calculation — including how you estimated the total market size and, separately, what VoltCharge\'s annual revenue would be if it captured a 10% market share. Max 120 words.',
    options: [
      { id: 'A', text: '~€400M' },
      { id: 'B', text: '~€800M' },
      { id: 'C', text: '~€1.15B' },
      { id: 'D', text: '~€2.5B' },
    ],
    scoringGuidance:
      'Correct answer: C. Calculation: 1.2M EVs × 120 sessions = 144M sessions/year. 144M × €8 = €1.152B total market. VoltCharge at 10% share = ~€115M annual revenue. Strong: selects C, shows both the market size calculation and the VoltCharge share calculation with correct arithmetic. Partial: selects C but shows only one of the two calculations or has a minor arithmetic slip. Weak: guesses without calculation, confuses total market size with VoltCharge\'s revenue, or selects a different option.',
  },

  analytical_thinking_high_context: {
    variantId: 'analytical_thinking_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the exhibit, approximately how much annual revenue does QuickCart generate today?',
    instruction:
      'Select the closest answer. Then show all three calculations: (1) QuickCart\'s annual revenue, (2) QuickCart\'s annual operating profit, and (3) the additional annual revenue SwiftEats could generate by growing market share from 8% to 12%. Max 120 words.',
    options: [
      { id: 'A', text: '~$16M' },
      { id: 'B', text: '~$24M' },
      { id: 'C', text: '~$32M' },
      { id: 'D', text: '~$80M' },
    ],
    scoringGuidance:
      'Correct answer: C. Calculations: (1) Revenue: $2B × 8% = $160M order value × 20% commission = $32M. (2) Operating profit: $32M × 10% = $3.2M. (3) Incremental revenue from 8%→12% share: 4% × $2B = $80M order value × 20% = $16M additional revenue. Strong: selects C and shows all three calculations with correct arithmetic. Partial: selects C and shows one or two calculations correctly. Weak: selects D (confusing order value with platform revenue), skips calculations, or cannot distinguish between order value and platform commission revenue.',
  },

  // ── Client Communication ────────────────────────────────────────────────────

  client_communication_low_context: {
    variantId: 'client_communication_low_context',
    format: 'free_text',
    question:
      'The CEO asks for a brief update on what you have learned. Write a short client update using this structure: Situation / Key Insight / Next Step.',
    instruction:
      'Use the three-part structure above. Keep it concise and executive-friendly. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Next Step structure, leads with the key insight (membership decline is driving the revenue shortfall), and closes with a concrete, specific next step the CEO can act on. Weak: ignores the structure and writes a generic paragraph, buries the key finding in the middle, or next step is too vague ("gather more data") or too operational for a CEO audience.',
  },

  client_communication_medium_context: {
    variantId: 'client_communication_medium_context',
    format: 'free_text',
    question:
      'The CEO asks for a brief update on whether Germany appears to be an attractive expansion opportunity. Provide a concise executive update.',
    instruction:
      'Structure your answer using the three-part format: Situation / Key Insight / Next Step. Use clear, executive-level language. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Next Step structure, leads with a clear market insight (e.g. strong EV growth + ~€1B+ market, but competitive dynamics need scrutiny), and closes with a specific next step (e.g. assess white-space vs. incumbents, or model entry economics for two strategies). Weak: repeats numbers from the exhibit without adding interpretive insight, lacks the three-part structure, or next step is vague ("do more research") without specifying what.',
  },

  client_communication_high_context: {
    variantId: 'client_communication_high_context',
    format: 'free_text',
    question:
      'The CEO asks: "Does acquiring QuickCart appear to be an attractive entry strategy for SwiftEats?" Provide a concise executive update.',
    instruction:
      'Structure your response using three parts: Situation / Key Insight / Next Step. Use clear, executive-level language. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Next Step structure, leads with a clear insight (e.g. QuickCart provides an immediate foothold in a network-effects-driven market worth $2B+, with $32M in revenue and an existing driver and restaurant base), and closes with a specific next step (e.g. validate acquisition price vs. standalone value, assess QuickCart retention rates and driver utilisation). Weak: restates numbers from the exhibit without interpreting them, lacks the three-part structure, or next step is vague.',
  },

  // ── Decision Recommendation ─────────────────────────────────────────────────

  decision_recommendation_low_context: {
    variantId: 'decision_recommendation_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the exit survey, what should FitLife prioritise first to address the profit decline?',
    instruction:
      'Select one priority action, then explain why it should come first. Connect your reasoning to the survey data. Max 120 words.',
    options: [
      { id: 'A', text: 'Lower membership prices to win back churned members' },
      { id: 'B', text: 'Expand capacity or reduce crowding across existing locations' },
      { id: 'C', text: 'Upgrade equipment across locations' },
      { id: 'D', text: 'Invest in customer service training' },
    ],
    scoringGuidance:
      'Correct answer: B. Strong: selects B, cites that 35% of exits — the largest single reason — are due to crowding, and explains why addressing the top driver is the highest-leverage first action. Partial: selects B but does not use the survey data to justify. Weak: selects A without noting that price cuts would further compress already-declining margins, or ignores the exhibit entirely and answers from general intuition.',
  },

  decision_recommendation_medium_context: {
    variantId: 'decision_recommendation_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'Based on the utilisation and revenue data in the exhibit, which entry strategy should VoltCharge prioritise for its initial expansion into Germany?',
    instruction:
      'Select one strategy, then explain why it is the stronger choice. Use the exhibit data to justify your recommendation. Max 120 words.',
    options: [
      { id: 'A', text: 'Highway charging network — install fast chargers along major motorways between cities' },
      { id: 'B', text: 'Urban charging network — install chargers in city parking areas and residential zones' },
    ],
    scoringGuidance:
      'Correct answer: B. Urban charging generates €140 per charger per day (20 sessions × €7) versus €96 for highway (8 sessions × €12), and requires lower upfront investment (€180M vs. €250M). Strong: selects B, calculates revenue per charger per day for both options, and notes the lower capital requirement — making urban the higher-return, lower-risk entry. Partial: selects B but does not use the exhibit numbers to justify. Weak: selects A without engaging with the per-charger economics, or recommends both strategies simultaneously without making a clear prioritisation call.',
  },

  decision_recommendation_high_context: {
    variantId: 'decision_recommendation_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Considering investment required, speed of entry, and the importance of early scale in delivery platforms, which strategy should SwiftEats pursue?',
    instruction:
      'Select one strategy. Then explain why it should be prioritised — reference the exhibit data and the role of network effects in your reasoning. Max 120 words.',
    options: [
      { id: 'A', text: 'Acquire QuickCart — pay $60M for immediate market entry with an existing driver and restaurant network' },
      { id: 'B', text: 'Build organically — invest $40M over 2–3 years to develop a proprietary delivery network' },
    ],
    scoringGuidance:
      'Correct answer: A. Acquisition advantages: immediate market entry, 5,000 drivers and 3,500 restaurant partners already in place, faster path to scale in a network-effects-driven market where early volume improves driver utilisation and margins. The $20M cost premium over organic entry is justified by 2–3 years of avoided build time and the compounding advantage of early scale. Strong: selects A, explicitly cites network effects and the time-to-market advantage, acknowledges the $20M premium and explains why it is justified. Partial: selects A without engaging with the network effects logic. Weak: selects B citing lower cost without addressing the structural disadvantage of entering 2–3 years later in a market where incumbents compound scale advantages.',
  },
};
