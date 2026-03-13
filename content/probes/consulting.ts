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
      { id: 'G', text: 'Gym equipment maintenance schedules' },
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
      { id: 'B', text: 'Delivery driver availability' },
      { id: 'C', text: 'Fulfillment hub processing efficiency' },
      { id: 'D', text: 'Marketing campaign performance' },
      { id: 'E', text: 'Delivery route efficiency and distance' },
      { id: 'F', text: 'Mobile app interface design' },
      { id: 'G', text: 'Supplier pricing' },
    ],
    scoringGuidance:
      'Strong answers usually structure the system around: Delivery performance = Order demand vs. Delivery capacity. Capacity drivers: number of drivers, deliveries per driver, routing efficiency, hub processing time. Strong: selects options covering both demand and capacity dimensions (e.g. A+B+C or A+B+E), and the reasoning shows structured decomposition of the delivery pipeline. Weak: selects unrelated factors (D, F, G) that do not directly affect delivery timing, or fails to link selections to the delivery delay problem.',
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
      { id: 'B', text: 'Historical restaurant pricing trends' },
      { id: 'C', text: 'Competitive landscape of delivery platforms' },
      { id: 'D', text: 'Long-term profitability dynamics of delivery platforms in Singapore' },
      { id: 'E', text: 'QuickCart\'s financial performance and user base' },
      { id: 'F', text: 'Long-term restaurant licensing regulations' },
      { id: 'G', text: 'Marketing campaign effectiveness' },
    ],
    scoringGuidance:
      'Strong: typically structures the decision around market attractiveness, competitive concentration, target company economics, and long-term profitability of the platform model. Best selections cover A (market size), C (competitive landscape), and E (target company assessment) — or substitute D for one of these. Reasoning shows a structured framing: is the market worth entering, can SwiftEats compete, and is QuickCart a good vehicle? Weak: focuses on unrelated operational topics (B, F, G) or fails to connect drivers to the acquisition decision.',
  },

  // ── Hypothesis-Driven Thinking ──────────────────────────────────────────────

  hypothesis_driven_thinking_low_context: {
    variantId: 'hypothesis_driven_thinking_low_context',
    format: 'mcq_plus_reasoning',
    question:
      'The data shows total membership peaked in Q2 and fell sharply to Q4. Local market data shows that two new gym chains opened multiple locations in the same cities during Q3 and Q4, and member cancellations increased significantly during this period — particularly in locations where new gyms opened nearby. Based on this information, what is your initial hypothesis for the decline in profits?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional data you would request to test your hypothesis. Max 100 words.',
    options: [
      { id: 'A', text: 'Membership decline due to increased competition' },
      { id: 'B', text: 'Rising operating costs per gym' },
      { id: 'C', text: 'Poor marketing effectiveness' },
      { id: 'D', text: 'Inefficient gym operations' },
    ],
    scoringGuidance:
      'Correct answer: A. Strong: selects A (membership decline correlates with competitor entry in Q3/Q4), articulates how falling membership reduces revenue under largely fixed operating costs, and requests targeted follow-up data such as cancellations by location, competitor pricing and promotions, churn rates per gym, or cost trends by location. Partial: selects A but reasoning is thin or the follow-up data request is generic. Weak: requests vague information or fails to link data requests to hypothesis.',
  },

  hypothesis_driven_thinking_medium_context: {
    variantId: 'hypothesis_driven_thinking_medium_context',
    format: 'mcq_plus_reasoning',
    question:
      'The data shows that daily orders have grown from 15,000 to 23,000 over four months. Delivery delays are most severe in New York, Los Angeles, and Chicago — these three cities account for 60% of total demand. Based on this information, what is your initial hypothesis for why delivery delays have increased?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional data you would request next to test your hypothesis. Max 100 words.',
    options: [
      { id: 'A', text: 'Demand growth is exceeding delivery capacity in major cities' },
      { id: 'B', text: 'Driver productivity has declined across the network' },
      { id: 'C', text: 'Fulfillment hubs are processing orders more slowly' },
      { id: 'D', text: 'Competitors are attracting drivers away' },
    ],
    scoringGuidance:
      'Correct answer: A. Strong: selects A (demand growth + geographic concentration clearly point to a capacity bottleneck in top cities), and requests targeted follow-up data such as driver counts by city, orders by city, deliveries per driver by city, or delivery distance by city. The key is segmenting the problem geographically. Partial: selects A but reasoning is thin or follow-up data is not city-level. Weak: fails to segment the problem geographically, or selects B/C/D without engaging with the demand growth and city concentration data.',
  },

  hypothesis_driven_thinking_high_context: {
    variantId: 'hypothesis_driven_thinking_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'The Singapore food delivery market generates approximately $2B in annual order value. Three major platforms control ~85% of the market, with the largest holding ~45% share. QuickCart holds 8% market share and has built 5,000 active drivers, 3,500 restaurant partnerships, and 1.2M active users. Building a delivery network from scratch would likely take 2–3 years. Based on this information, what is your initial hypothesis regarding SwiftEats\' entry strategy?',
    instruction:
      'Select the hypothesis you find most compelling. Then explain what additional data you would request to evaluate the acquisition decision. Max 100 words.',
    options: [
      { id: 'A', text: 'Acquiring QuickCart may allow faster market entry and scale' },
      { id: 'B', text: 'Organic entry may lead to lower long-term costs' },
      { id: 'C', text: 'SwiftEats should avoid entering Singapore entirely' },
      { id: 'D', text: 'SwiftEats should focus only on expanding in existing markets' },
    ],
    scoringGuidance:
      'Correct answer: A. The data shows top 3 incumbents control 85% of the market and organic build takes 2–3 years — making QuickCart\'s existing driver network, restaurant partnerships, and user base highly valuable for immediate scale. Strong: selects A, articulates how the network and speed advantage offset the acquisition premium, and requests specific data such as QuickCart revenue and profitability, expected acquisition price, cost of building an organic network, and expected market share growth. Weak: selects C or D without engaging with QuickCart\'s existing assets, or requests unrelated metrics that fail to connect to the acquisition hypothesis.',
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
      'Correct answer: C. Full calculation: (1) Old capacity: 800 × 22 = 17,600. (2) Current capacity: 800 × 20 = 16,000. (3) Top 3 city demand: 23,000 × 60% = 13,800. (4) Top 3 city capacity: 800 × 50% = 400 drivers × 20 = 8,000. (5) Gap: 13,800 − 8,000 = 5,800. (6) Additional drivers: 5,800 ÷ 20 ≈ 290. Strong: selects C, shows all six steps correctly, and identifies multiple drivers — demand growth, driver productivity decline, and driver allocation imbalance across cities. Partial: selects C but misses some steps. Weak: skips calculations or fails to identify the geographic allocation issue.',
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
      'Correct answer: C. Full calculation: (1) Current revenue: $2B × 8% = $160M order value × 20% = $32M. (2) Current profit: $32M × 10% = $3.2M. (3) Revenue at 12% share: $2B × 12% = $240M × 20% = $48M. (4) Profit at 15% margin: $48M × 15% = $7.2M. (5) Payback: $60M ÷ $7.2M ≈ 8 years. (6) Organic revenue at 10%: $2B × 10% = $200M × 20% = $40M. Strong: selects C, shows all six steps correctly, and compares acquisition economics vs. organic revenue potential while referencing time-to-market advantages. Partial: selects C but misses some steps. Weak: confuses order value with platform revenue, skips calculation steps, or fails to compare the two entry paths.',
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
      'The CEO asks: "What have we learned so far about the cause of FastDrop\'s delivery delays?" Provide a concise update using this structure: Situation / Key Insight / Next Step.',
    instruction:
      'Use the three-part structure above. Keep it concise and executive-friendly. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Next Step structure, identifies demand growth outpacing capacity, highlights the delivery capacity gap concentrated in the top 3 cities, explains the city-level driver shortage, and proposes concrete next steps. Weak: repeats numbers without insight, lacks the three-part structure, or next step is vague ("hire more drivers") without connecting to the geographic imbalance.',
  },

  client_communication_high_context: {
    variantId: 'client_communication_high_context',
    format: 'free_text',
    question:
      'The CEO asks: "Does acquiring QuickCart appear to be a financially attractive entry strategy?" Provide a concise update using this structure: Situation / Key Insight / Next Step.',
    instruction:
      'Use the three-part structure above. Keep it concise and executive-friendly. Max 120 words.',
    scoringGuidance:
      'Strong: uses the explicit Situation / Key Insight / Next Step structure, highlights revenue potential ($32M current → $48M at scale), references profitability improvement (10% → 15% margin), discusses acquisition payback (~8 years) and strategic benefits (immediate scale, network effects), and closes with a concrete next step. Weak: restates numbers from the exhibit without interpreting them, lacks the three-part structure, or next step is vague.',
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
      'Correct answer: C. Strong: selects C, recognizes that crowding is the #1 complaint (35%) but that building new space requires significant investment, notes that midday utilization is only ~55% while evenings are near full capacity, and concludes that off-peak discounts can redistribute demand to reduce crowding without heavy capex — addressing the root cause cost-effectively. Partial: selects C but does not connect the utilization split or capex constraint. Weak: selects A without noting that broad price cuts further compress margins, selects B without acknowledging the significant investment required, or ignores the operational insight about midday underutilization.',
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
      'Correct answer: B. Routing improvement increases deliveries per driver from 20 to ~23, giving new capacity of 800 × 23 = 18,400 vs. 23,000 demand. Remaining gap ≈ 4,600. Routing does not solve the entire problem but it: significantly reduces the gap, costs less ($2M vs. $6M for hiring), and improves system efficiency structurally. Strong: selects B, cites the cost-effectiveness ($2M vs. $6M+), notes that routing improves per-driver productivity across all cities, and acknowledges it partially closes the gap while being the most efficient first move. Partial: selects B but does not use the exhibit numbers. Weak: selects A without considering cost-effectiveness, selects C without noting the 9-month implementation delay, or selects D without noting revenue impact.',
  },

  decision_recommendation_high_context: {
    variantId: 'decision_recommendation_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Considering financial return, time to market, and network effects, which strategy should SwiftEats pursue?',
    instruction:
      'Select one strategy, then explain why this strategy should be prioritized. Max 120 words.',
    options: [
      { id: 'A', text: 'Acquire QuickCart' },
      { id: 'B', text: 'Build network organically' },
    ],
    scoringGuidance:
      'Correct answer: A. Acquisition advantages: immediate market entry, 5,000 drivers and 3,500 restaurant partners already in place, 1.2M active users, faster path to 12% market share in a network-effects-driven market where early volume improves driver utilisation and margins. The $20M cost premium ($60M vs. $40M) is justified by ~3 years of avoided build time and the compounding advantage of early scale. Strong: selects A, explicitly cites network effects and time-to-market advantage, acknowledges the $20M premium and explains why it is justified, and references the higher expected market share (12% vs. 10%). Partial: selects A without engaging with network effects logic. Weak: selects B citing lower cost without addressing the structural disadvantage of entering 2–3 years later in a market where incumbents compound scale advantages.',
  },
};
