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
      'To diagnose the decline in profits, you want to identify the most important areas to investigate first. Select the THREE areas you would investigate first.',
    instruction:
      'Choose exactly three areas. Then explain how you structured the profit problem and why you selected these areas. Use 3–5 bullet points. Max 120 words.',
    options: [
      { id: 'A', text: 'Membership trends' },
      { id: 'B', text: 'Historical pricing strategy' },
      { id: 'C', text: 'Operating costs' },
      { id: 'D', text: 'Competitor pricing and membership promotions' },
      { id: 'E', text: 'Customer experience and satisfaction' },
      { id: 'F', text: 'Marketing spend' },
      { id: 'G', text: 'Employee turnover and staffing levels' },
    ],
    scoringGuidance:
      'Strong answers typically structure the problem around Profit = Revenue − Costs. Revenue drivers: number of members, pricing, retention. Cost drivers: facility operating costs, staffing, equipment. Strong: selects options that cover both revenue and cost dimensions (e.g. A+C+D or A+C+E), and the reasoning shows structured decomposition — separating top-line from cost drivers and justifying the prioritisation order. Weak: lists unrelated factors, fails to link drivers to profitability, or all choices from one dimension.',
  },

  problem_structuring_medium_context: {
    variantId: 'problem_structuring_medium_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'To diagnose the delivery delay problem, you want to identify the most important areas to investigate first. Select the THREE areas you would investigate first.',
    instruction:
      'Choose exactly three areas. Then explain how you structured the delivery delay problem and why you selected these areas. Use 3–5 bullet points. Max 120 words.',
    options: [
      { id: 'A', text: 'Customer order demand levels' },
      { id: 'B', text: 'Delivery driver availability and retention' },
      { id: 'C', text: 'Fulfillment hub processing efficiency' },
      { id: 'D', text: 'Geographic distribution of demand vs. driver allocation' },
      { id: 'E', text: 'Delivery route efficiency and distance' },
      { id: 'F', text: 'Mobile app interface design' },
      { id: 'G', text: 'Supplier pricing' },
    ],
    scoringGuidance:
      'Strong answers usually structure the system around: Delivery performance = Order demand vs. Delivery capacity. Capacity drivers: number of drivers, deliveries per driver, routing efficiency, hub processing time, driver retention and geographic allocation. Strong: selects options covering both demand and capacity dimensions (e.g. A+B+D or A+B+E), and the reasoning shows structured decomposition of the delivery pipeline. Weak: selects unrelated factors (F, G) that do not directly affect delivery timing, or fails to link selections to the delivery delay problem.',
  },

  problem_structuring_high_context: {
    variantId: 'problem_structuring_high_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'Before deciding whether to acquire QuickCart or enter Singapore organically, you want to structure the key areas to evaluate. Select the THREE most important areas to investigate first.',
    instruction:
      'Choose exactly three areas. Then explain how you structured the acquisition decision and why you selected these areas. Use 3–5 bullet points. Max 120 words.',
    options: [
      { id: 'A', text: 'Size and growth of the food delivery market in Singapore' },
      { id: 'B', text: 'QuickCart\'s technology platform and integration complexity' },
      { id: 'C', text: 'Competitive landscape of delivery platforms' },
      { id: 'D', text: 'Long-term profitability dynamics of delivery platforms in Singapore' },
      { id: 'E', text: 'QuickCart\'s financial performance and user base' },
      { id: 'F', text: 'Regulatory environment for food delivery acquisitions in Singapore' },
      { id: 'G', text: 'Marketing campaign effectiveness' },
    ],
    scoringGuidance:
      'Strong: typically structures the decision around market attractiveness, competitive concentration, target company economics, and long-term profitability of the platform model. Best selections cover A (market size), C (competitive landscape), and E (target company assessment) — or substitute D for one of these. B and F are plausible but second-tier considerations. Reasoning shows a structured framing: is the market worth entering, can SwiftEats compete, and is QuickCart a good vehicle? Weak: focuses on unrelated operational topics (G) or fails to connect drivers to the acquisition decision.',
  },

  // ── Hypothesis-Driven Thinking ──────────────────────────────────────────────

  hypothesis_driven_thinking_low_context: {
    variantId: 'hypothesis_driven_thinking_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'Look at the membership trend data. What is your initial hypothesis for the primary cause of FitLife\'s profit decline?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional data you would request to test your hypothesis. Max 100 words.',
    options: [
      { id: 'A', text: 'Membership decline due to increased competition' },
      { id: 'B', text: 'Rising operating costs per gym' },
      { id: 'C', text: 'Seasonal demand fluctuation' },
      { id: 'D', text: 'Declining customer satisfaction with facilities' },
    ],
    scoringGuidance:
      'Correct answer: A. The chart shows membership peaked in Q2 and declined sharply into Q4. The footnote mentions two new gym chains opened during Q3/Q4 — the candidate must notice this detail and connect it to the membership decline. Strong: selects A, articulates how falling membership reduces revenue under largely fixed operating costs, references the competitor entry timing from the footnote, and requests targeted follow-up data such as cancellations by location, competitor pricing and promotions, churn rates per gym, or cost trends by location. Partial: selects A but reasoning is thin or misses the competitor entry detail. Weak: selects C (seasonal) without noting the structural decline, or requests vague information.',
  },

  hypothesis_driven_thinking_medium_context: {
    variantId: 'hypothesis_driven_thinking_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'Daily orders have grown from 15,000 to 23,000 over four months. What is your initial hypothesis for the increase in delivery delays?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional data you would request next to test your hypothesis. Max 100 words.',
    options: [
      { id: 'A', text: 'Demand growth is exceeding delivery capacity in major cities' },
      { id: 'B', text: 'High driver turnover is reducing experienced driver availability' },
      { id: 'C', text: 'Fulfillment hubs are processing orders more slowly' },
      { id: 'D', text: 'Delivery route distances have increased as the service area expands' },
    ],
    scoringGuidance:
      'Correct answer: A. The grouped bar chart visually shows orders exceeding capacity from Month 3 onward, and the footnote notes geographic concentration in top 3 cities. Strong: selects A (demand growth + geographic concentration clearly point to a capacity bottleneck in top cities), notes the demand/capacity crossover visible in the chart, and requests targeted follow-up data such as driver counts by city, orders by city, or delivery times by city. The key is segmenting the problem geographically. B is a plausible distractor given the driver turnover data visible in the analytics exhibit, but turnover is a contributing factor, not the primary driver — even at full staffing the geographic allocation mismatch remains. Partial: selects A but reasoning is thin or follow-up data is not city-level. Weak: selects B without engaging with the demand/capacity gap, or fails to segment the problem geographically.',
  },

  hypothesis_driven_thinking_high_context: {
    variantId: 'hypothesis_driven_thinking_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Review the Singapore market data. Given the competitive landscape and QuickCart\'s operating metrics, what is your initial hypothesis regarding the best entry strategy for SwiftEats?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional data you would request to evaluate the entry decision. Max 100 words.',
    options: [
      { id: 'A', text: 'Acquiring QuickCart provides immediate scale despite asset quality risks' },
      { id: 'B', text: 'QuickCart\'s declining metrics suggest organic entry may be lower risk' },
      { id: 'C', text: 'SwiftEats should avoid entering Singapore entirely' },
      { id: 'D', text: 'SwiftEats should pursue a joint venture rather than full acquisition' },
    ],
    scoringGuidance:
      'Best answer: A, but B with strong reasoning can score nearly as well. The data shows top 3 incumbents control 85% of the market and organic build takes 2–3 years — making QuickCart\'s existing assets valuable for immediate scale. However, QuickCart\'s user base is declining (-5% YoY) and 40% of drivers churn annually, creating genuine acquisition risk. Strong for A: selects A, acknowledges both the scale advantage AND the degrading asset quality, and requests data on QuickCart\'s revenue trend, driver replacement costs, and acquisition price justification. Strong for B: selects B, builds a rigorous case that declining users and high driver churn mean the acquired assets are worth less than the price implies, and argues SwiftEats\' regional brand can accelerate organic entry. Weak: selects A or B without engaging with the tension between scale advantage and asset degradation, or selects C/D without substantive reasoning.',
  },

  // ── Analytical Thinking ─────────────────────────────────────────────────────

  analytical_thinking_low_context: {
    variantId: 'analytical_thinking_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'Using the exhibit data, calculate the monthly profit per gym 6 months ago, the monthly profit per gym today, and the total monthly profit lost across all 20 gyms. What is the approximate total monthly profit the company has lost?',
    instruction:
      'Select the closest answer. Then show your full calculation in three steps: (1) monthly profit per gym 6 months ago, (2) monthly profit per gym today, (3) total monthly profit lost across all 20 gyms. Explain what appears to be the primary driver. Max 120 words.',
    options: [
      { id: 'A', text: '~₹100L total monthly profit lost' },
      { id: 'B', text: '~₹150L total monthly profit lost' },
      { id: 'C', text: '~₹200L total monthly profit lost' },
      { id: 'D', text: '~₹250L total monthly profit lost' },
    ],
    scoringGuidance:
      'Correct answer: C. Calculation: (1) 6 months ago: Revenue = 2,400 × ₹2,000 = ₹48L. Profit = ₹48L − ₹35L = ₹13L per gym. (2) Today: Revenue = 1,950 × ₹2,000 = ₹39L. Profit = ₹39L − ₹36L = ₹3L per gym. (3) Profit drop per gym = ₹13L − ₹3L = ₹10L. Total across 20 gyms = ₹10L × 20 = ₹200L. Strong: selects C, shows all three calculation steps correctly, and identifies membership decline as the primary driver (with cost increase as secondary). Partial: selects C but misses one step. Weak: confuses revenue and profit, skips calculation steps, or selects the wrong option.',
  },

  analytical_thinking_medium_context: {
    variantId: 'analytical_thinking_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'Using the exhibit data, work through the delivery capacity analysis step by step. Approximately how many additional drivers would FastDrop need in the top 3 cities to close the delivery gap?',
    instruction:
      'Select the closest answer. Then show your full calculation through all the steps. Explain what operational issues appear to be driving the delivery delays. Max 120 words.',
    options: [
      { id: 'A', text: '~150 additional drivers' },
      { id: 'B', text: '~220 additional drivers' },
      { id: 'C', text: '~290 additional drivers' },
      { id: 'D', text: '~350 additional drivers' },
    ],
    scoringGuidance:
      'Correct answer: C. Full calculation: (1) Old capacity: 800 × 22 = 17,600. (2) Current capacity: 800 × 20 = 16,000. (3) Top 3 city demand: 23,000 × 60% = 13,800. (4) Top 3 city capacity: 800 × 50% = 400 drivers × 20 = 8,000. (5) Gap: 13,800 − 8,000 = 5,800. (6) Additional drivers: 5,800 ÷ 20 ≈ 290. Strong: selects C, shows all six steps correctly, and identifies multiple drivers — demand growth, driver productivity decline, geographic allocation imbalance, and rising driver turnover (8% vs. 3%). Partial: selects C but misses some steps. Weak: skips calculations or fails to identify the geographic allocation issue.',
  },

  analytical_thinking_high_context: {
    variantId: 'analytical_thinking_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Using the exhibit data, work through the financial analysis step by step. Calculate QuickCart\'s current revenue and profit, then estimate revenue and profit at scale if market share grows to 12% with improved margins, and determine how long it would take to recover the acquisition cost. Approximately how many years would it take to recover the $60M acquisition cost through operating profit at scale?',
    instruction:
      'Select the closest answer. Then show your full calculation through all the steps: (1) QuickCart\'s current annual revenue, (2) current operating profit, (3) revenue at 12% market share, (4) profit at 15% margin, (5) acquisition payback period, and (6) organic entry revenue at 10% share. Explain how you evaluated the financial attractiveness of the acquisition. Max 120 words.',
    options: [
      { id: 'A', text: '~4 years' },
      { id: 'B', text: '~6 years' },
      { id: 'C', text: '~8 years' },
      { id: 'D', text: '~12 years' },
    ],
    scoringGuidance:
      'Correct answer: C. Full calculation: (1) Current revenue: $2B × 8% = $160M order value × 20% = $32M. (2) Current profit: $32M × 10% = $3.2M. (3) Revenue at 12% share: $2B × 12% = $240M × 20% = $48M. (4) Profit at 15% margin: $48M × 15% = $7.2M. (5) Payback: $60M ÷ $7.2M ≈ 8 years. (6) Organic revenue at 10%: $2B × 10% = $200M × 20% = $40M. Strong: selects C, shows all six steps correctly, notes the ~8-year payback is long and should be weighed against QuickCart\'s declining user metrics (-5% YoY) and driver churn (40% annual), and compares acquisition economics vs. organic revenue potential while referencing time-to-market advantages. Partial: selects C but misses some steps or ignores the asset quality concerns. Weak: confuses order value with platform revenue, skips calculation steps, or fails to compare the two entry paths.',
  },

  // ── Client Communication ────────────────────────────────────────────────────

  client_communication_low_context: {
    variantId: 'client_communication_low_context',
    format: 'free_text',
    question:
      'The CEO asks: "What have we learned so far about the decline in FitLife\'s profits?" Provide a concise update using this structure: Situation / Key Insight / Next Step.',
    instruction:
      'Use the three-part structure above. Keep it concise and executive-friendly. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Next Step structure, summarizes profit decline clearly, highlights membership loss as the primary driver, links the decline to increased competition, and proposes concrete next investigation steps. Weak: repeats numbers without insight, ignores the structure, buries the key finding in the middle, lacks structure, or next step is too vague ("gather more data").',
  },

  client_communication_medium_context: {
    variantId: 'client_communication_medium_context',
    format: 'free_text',
    question:
      'The COO believes delivery delays are caused by insufficient drivers and wants to hire aggressively. The VP of Growth argues the problem is routing inefficiency and wants to invest in technology. The CEO asks you to weigh in. Using the Situation / Key Insight / Recommended Path structure, draft your response.',
    instruction:
      'Use the three-part structure above. Address both perspectives with data. Keep it concise and executive-friendly. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Recommended Path structure, acknowledges both the COO and VP Growth perspectives, uses data to show the primary driver is a demand/capacity mismatch concentrated in top 3 cities (not simply a headcount or routing issue alone), and recommends a sequenced approach — routing improvement first (lower cost, structural efficiency gain) followed by targeted hiring in the top 3 cities where the allocation gap is largest. References specific data points (e.g., 60% demand vs. 50% drivers in top cities, driver turnover doubling). Weak: sides entirely with one executive without engaging the other\'s view, ignores the data, or proposes a vague "do both" without sequencing or rationale.',
  },

  client_communication_high_context: {
    variantId: 'client_communication_high_context',
    format: 'free_text',
    question:
      'The board is enthusiastic about acquiring QuickCart for immediate market access. Your analysis shows an 8-year payback and declining user metrics. The CEO asks you to present your findings to the board. Using the Situation / Complication / Recommendation structure, draft your message.',
    instruction:
      'Use the Situation / Complication / Recommendation structure. Deliver the difficult finding clearly while remaining constructive. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Complication / Recommendation (SCR) structure. Situation: frames the strategic rationale the board already believes in (immediate market access, network effects, competitive concentration). Complication: introduces the 8-year payback, declining user base (-5% YoY), and high driver churn (40% annual) as material risks that temper the enthusiasm. Recommendation: either (a) recommends proceeding but at a renegotiated price with specific milestones/conditions, or (b) recommends organic entry with a clear argument for why SwiftEats\' brand can accelerate past the 10% baseline. Both paths can score well if supported by data. Weak: avoids delivering the complication, presents only positive findings, ignores the payback period, or uses a different structure than SCR.',
  },

  // ── Decision Recommendation ─────────────────────────────────────────────────

  decision_recommendation_low_context: {
    variantId: 'decision_recommendation_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'Which action should FitLife prioritize first to address the profit decline?',
    instruction:
      'Select one priority action, then explain why this action should be prioritised. Connect your reasoning to the survey data and operational insights. Max 120 words.',
    options: [
      { id: 'A', text: 'Lower membership prices to compete with new gyms' },
      { id: 'B', text: 'Expand gym floor space to increase capacity' },
      { id: 'C', text: 'Introduce off-peak membership discounts to shift demand' },
      { id: 'D', text: 'Invest in new gym equipment' },
    ],
    scoringGuidance:
      'Correct answer: C. Strong: selects C, recognizes that crowding is the #1 complaint (35%) but that building new space requires significant investment, notes that midday utilization is only ~55% while evenings are near full capacity, and concludes that off-peak discounts can redistribute demand to reduce crowding without heavy capex — addressing the root cause cost-effectively. Partial: selects C but does not connect the utilization split or capex constraint. A can receive partial-to-strong credit IF the candidate builds a rigorous competitive response argument — e.g., targeted price cuts only in locations facing direct competition, with margin math showing the revenue retention outweighs the margin compression. Selects A without this level of reasoning is weak. Weak: selects B without acknowledging the significant investment required, or ignores the operational insight about midday underutilization.',
  },

  decision_recommendation_medium_context: {
    variantId: 'decision_recommendation_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'Considering operational impact, cost, and implementation time, which action should FastDrop prioritize first?',
    instruction:
      'Select one priority action, then explain why it should be prioritized. Use the exhibit data to justify your recommendation. Max 120 words.',
    options: [
      { id: 'A', text: 'Hire more drivers' },
      { id: 'B', text: 'Improve routing software' },
      { id: 'C', text: 'Open new fulfillment hubs' },
      { id: 'D', text: 'Limit peak-hour orders' },
    ],
    scoringGuidance:
      'Correct answer: B. Routing improvement increases deliveries per driver from 20 to ~23, giving new capacity of 800 × 23 = 18,400 vs. 23,000 demand. Remaining gap ≈ 4,600. Routing does not solve the entire problem but it: significantly reduces the gap, costs less ($2M vs. $6M for hiring), and improves system efficiency structurally. Strong: selects B, cites the cost-effectiveness ($2M vs. $6M+), notes that routing improves per-driver productivity across all cities, acknowledges it partially closes the gap while being the most efficient first move, and notes that targeted hiring in top 3 cities should follow as a second phase — especially given the driver turnover problem (8% monthly) that must also be addressed. Partial: selects B but does not use the exhibit numbers or mention the phased approach. Weak: selects A without considering cost-effectiveness, selects C without noting the 9-month implementation delay, or selects D without noting revenue impact.',
  },

  decision_recommendation_high_context: {
    variantId: 'decision_recommendation_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Considering financial return, time to market, and network effects, which strategy should SwiftEats pursue?',
    instruction:
      'Select one strategy, then explain why this strategy should be prioritized. Address both the strengths and risks of your chosen path. Max 120 words.',
    options: [
      { id: 'A', text: 'Acquire QuickCart' },
      { id: 'B', text: 'Build network organically' },
    ],
    scoringGuidance:
      'Both A and B can score full marks with strong reasoning. For A (Acquire): Strong if the candidate acknowledges the ~8-year payback and degrading QuickCart metrics (declining users, 40% driver churn), but argues that network effects and time-to-market justify the premium — immediate access to 5,000 drivers, 3,500 restaurants, and 1.2M users in a market where incumbents control 85% and organic build takes 2–3 years. May recommend price renegotiation or earnout structure to mitigate risk. For B (Organic): Strong if the candidate calculates that the 8-year payback + declining user base + high driver churn make the $60M price unjustified, and argues that SwiftEats\' existing regional brand and operational expertise can accelerate organic entry beyond the assumed 10% share. Should acknowledge the time cost but argue the savings ($20M) and healthier asset base offset it. Weak for either option: fails to engage with the tension data (payback period, declining metrics), dismisses the alternative without analysis, or provides generic reasoning without referencing specific exhibit data.',
  },
};
