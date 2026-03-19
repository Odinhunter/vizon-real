import type { ProbeVariantContent } from '../types';

/**
 * User-facing probe content for the Finance track.
 * Keyed by variantId from the probe registry.
 */
export const financeProbeContent: Record<string, ProbeVariantContent> = {
  // ── Financial Signal Interpretation ─────────────────────────────────────────

  financial_signal_low_context: {
    variantId: 'financial_signal_low_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'Based on the data above, which are the THREE most important drivers of BrewCo\'s revenue?',
    options: [
      { id: 'A', text: 'Number of stores' },
      { id: 'B', text: 'Rent cost per store' },
      { id: 'C', text: 'Customer volume per store' },
      { id: 'D', text: 'Average order value' },
      { id: 'E', text: 'Staff-to-customer ratio' },
      { id: 'F', text: 'Operating days per year' },
      { id: 'G', text: 'Gross margin per item sold' },
    ],
    instruction:
      'Select exactly three. Then calculate BrewCo\'s annual revenue per store and explain the key drivers. Max 120 words.',
    scoringGuidance:
      'Correct selection: A (Number of stores), C (Customer volume per store), D (Average order value). These are the direct revenue formula components: Revenue = stores × customers/day × AOV × days. Strong reasoning: calculates 250 × $5.50 × 360 = $495K ≈ $500K per store, and explains why these are the controllable levers. F (Operating days) is a valid partial credit option — it is in the revenue formula but is largely fixed at 360. G (Gross margin) is a tempting distractor — it drives profit, not revenue. B (Rent) and E (Staff ratio) are cost-side metrics. Weak: selects cost-side options (B, E, G) confusing revenue drivers with profit drivers, or cannot produce the revenue calculation.',
  },
  financial_signal_medium_context: {
    variantId: 'financial_signal_medium_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'Which are the THREE most important drivers of AutoNova\'s EBITDA?',
    options: [
      { id: 'A', text: 'Number of vehicles sold' },
      { id: 'B', text: 'Average selling price per vehicle' },
      { id: 'C', text: 'Battery supplier geographic diversification' },
      { id: 'D', text: 'EBITDA margin (operating cost structure)' },
      { id: 'E', text: 'Warranty claim frequency' },
      { id: 'F', text: 'Depreciation schedule on manufacturing equipment' },
      { id: 'G', text: 'Number of dealership locations' },
    ],
    instruction:
      'Select exactly three. Then break down how AutoNova generates revenue and EBITDA, showing the calculation. Max 120 words.',
    scoringGuidance:
      'Correct selection: A (Number of vehicles sold), B (Average selling price), D (EBITDA margin). Revenue = volume × ASP = 120,000 × €32,000 = €3.84B. EBITDA = revenue × margin = €3.84B × 12% = €460M. F (Depreciation) is a tempting distractor — it matters for EBIT and net income, but EBITDA explicitly adds back depreciation. G (Dealerships) affects volume indirectly but is not a direct P&L driver. Strong reasoning: decomposes the P&L into revenue = volume × price, then EBITDA = revenue × margin, and recognizes that EBITDA margin captures the cost structure. Weak: selects F (confuses EBITDA with EBIT) or C/E/G, or cannot produce the revenue-to-EBITDA calculation.',
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
    format: 'mcq_plus_reasoning',
    question: 'What is the strongest value creation driver in this investment?',
    options: [
      { id: 'A', text: 'Store expansion with improving unit economics as new stores mature' },
      { id: 'B', text: 'Margin improvement in existing stores through cost optimization' },
      { id: 'C', text: 'Increasing average order value through premium product mix' },
      { id: 'D', text: 'Reducing initial investment per store to accelerate rollout' },
    ],
    instruction:
      'Select one. Then explain how expansion creates value over time, referencing the store economics data. Max 120 words.',
    scoringGuidance:
      'Correct: A. The core value creation story is expanding from 50 to 120 stores while unit economics improve as new stores mature (9% → 18% margin over 2 years). B is tempting but the case shows existing stores already operate at 18% margin — there is no improvement opportunity flagged. C and D are plausible levers but not supported by the case data. Strong reasoning: explains the margin ramp mechanism (new stores start at 9% and converge to 18% over 2 years), quantifies the scale (70 new stores × $90K steady-state profit = $6.3M incremental), and distinguishes between growth-driven and efficiency-driven value creation. Weak: selects B/C/D, or selects A but cannot explain the margin ramp.',
  },
  investment_thesis_medium_context: {
    variantId: 'investment_thesis_medium_context',
    format: 'mcq_plus_reasoning',
    question: 'What is the strongest value creation thesis for this investment?',
    options: [
      { id: 'A', text: 'EBITDA growth driven by revenue growth and margin expansion' },
      { id: 'B', text: 'Operational restructuring to cut headcount and reduce SG&A' },
      { id: 'C', text: 'Multiple arbitrage — buying low and selling at a higher multiple' },
      { id: 'D', text: 'Government EV subsidies increasing consumer demand' },
    ],
    instruction:
      'Select one. Then explain how value will be created over the 5-year holding period, referencing the specific growth and margin drivers. Max 120 words.',
    scoringGuidance:
      'Correct: A. Value creation comes from two compounding drivers: (1) 7% annual revenue growth growing revenue ~1.4× over 5 years (~€5.4B), and (2) margin expansion from 12% to 15% driven by battery sourcing and scale efficiencies. Combined, EBITDA grows from €460M to ~€800M. C (multiple arbitrage) is a tempting distractor — the entry/exit multiple does expand from 8× to 9×, but this is a secondary effect that only works because EBITDA growth justifies a higher multiple. Strong reasoning: explains both growth levers, shows how they compound, and distinguishes primary (EBITDA growth) from secondary (multiple expansion) value creation. Weak: selects C without recognizing that multiple expansion requires operational improvement to sustain, or selects B/D which are not in the case.',
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
    format: 'mcq_plus_reasoning',
    question: 'What is the return on invested capital (ROIC) per store at steady state?',
    options: [
      { id: 'A', text: '10%' },
      { id: 'B', text: '15%' },
      { id: 'C', text: '22.5%' },
      { id: 'D', text: '30%' },
    ],
    instruction:
      'Select the closest answer. Then show your calculations: (1) steady-state annual profit per store, (2) Year 1 profit per new store, (3) approximate payback period, (4) total annual profit from 70 new stores, and (5) ROIC. Evaluate whether this expansion is capital efficient. Max 120 words.',
    scoringGuidance:
      'Correct: C (22.5%). Calculation chain: (1) Steady-state profit = $500K × 18% = $90K per store. (2) Year 1 profit = $450K × 9% = $40.5K per store. (3) Payback ≈ $400K / $90K ≈ 4.4 years (or ~5 years accounting for Y1 ramp). (4) Total from 70 stores = 70 × $90K = $6.3M. (5) ROIC = $90K / $400K = 22.5%. Strong: produces the full calculation chain correctly and concludes that 22.5% ROIC exceeds the 20% target return, making the expansion capital-efficient. Weak: selects wrong answer, cannot produce the calculation, or confuses revenue with profit in the ROIC formula.',
  },
  capital_allocation_medium_context: {
    variantId: 'capital_allocation_medium_context',
    format: 'mcq_plus_reasoning',
    question: 'What is the approximate EBITDA yield on entry price at Year 5?',
    options: [
      { id: 'A', text: '~10%' },
      { id: 'B', text: '~15%' },
      { id: 'C', text: '~22%' },
      { id: 'D', text: '~30%' },
    ],
    instruction:
      'Select the closest answer. Then show your calculations: (1) entry enterprise value, (2) approximate Year 5 revenue, (3) Year 5 EBITDA, (4) exit enterprise value, and (5) approximate MoM. Evaluate whether this investment shows strong capital efficiency. Max 120 words.',
    scoringGuidance:
      'Correct: C (~22%). Calculation chain: (1) Entry EV = €460M × 8 = €3.68B ≈ €3.7B. (2) Revenue grows at 7% for 5 years: €3.84B × 1.40 ≈ €5.4B. (3) Y5 EBITDA = €5.4B × 15% ≈ €810M ≈ €800M. (4) Exit EV = €800M × 9 = €7.2B. (5) MoM = €7.2B / €3.7B ≈ 2.0×. EBITDA yield = €800M / €3.7B ≈ 22%. Strong: produces the full calculation chain from entry to exit, correctly grows revenue at 7% (not 10%), applies the 15% exit margin, and concludes the investment generates ~2× MoM over 5 years. Weak: uses wrong growth rate, confuses revenue with EBITDA, or cannot connect the valuation steps.',
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
    format: 'mcq_plus_reasoning',
    question: 'What is the biggest risk to the investment thesis?',
    options: [
      { id: 'A', text: 'Rising input costs compressing existing store margins' },
      { id: 'B', text: 'Slower ramp-up and weaker unit economics in new stores' },
      { id: 'C', text: 'Cannibalization of existing stores by new locations' },
      { id: 'D', text: 'Currency depreciation in Southeast Asian markets' },
    ],
    instruction:
      'Select one. Then calculate annual profit per store and investment payback under the downside scenario, and explain how this risk affects returns and capital recovery. Max 100 words.',
    scoringGuidance:
      'Correct: B. The downside scenario directly threatens the investment thesis by reducing store-level returns. A (input costs) and C (cannibalization) are real risks but are not quantified in the case data — the downside scenario explicitly models B. D (currency) is valid but second-order. Strong reasoning: calculates downside profit = $420K × 12% = $50.4K (~$50K) per store, payback = $400K / $50K = 8 years (vs. ~4.4 years base case). This nearly doubles the payback period and drops ROIC from 22.5% to ~12.5%, below the 20% target. The 8-year payback also exceeds the 5-year investment horizon. Weak: selects A/C/D without engaging with the downside data, or selects B but cannot produce the calculation.',
  },
  risk_assessment_medium_context: {
    variantId: 'risk_assessment_medium_context',
    format: 'mcq_plus_reasoning',
    question: 'Under the downside scenario, what is the approximate Year 5 EBITDA?',
    options: [
      { id: 'A', text: '~€590M' },
      { id: 'B', text: '~€700M' },
      { id: 'C', text: '~€800M' },
      { id: 'D', text: '~€1B' },
    ],
    instruction:
      'Select one. Then calculate the downside exit valuation and MoM. Explain how the combination of lower EBITDA and a lower exit multiple affects the return profile. Max 120 words.',
    scoringGuidance:
      'Correct: A (~€590M). Under downside: revenue grows at 5% for 5 years → €3.84B × 1.28 ≈ €4.9B, EBITDA = €4.9B × 12% ≈ €590M. Exit EV = €590M × 7 = €4.13B. MoM = €4.13B / €3.7B ≈ 1.1×. This is a dramatic compression from the base case 2.0× MoM — the fund barely gets its money back. Strong reasoning: connects lower EBITDA + lower exit multiple → severely compressed returns, recognizes the "double hit" of operational underperformance and multiple contraction, and notes that 1.1× MoM over 5 years implies ~2% annualized return — far below the 20% IRR target. Weak: selects C or D (base case numbers), or cannot calculate the downside cascade from EBITDA → EV → MoM.',
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
    format: 'mcq_plus_reasoning',
    question: 'Based on the data above, should the fund proceed with the investment?',
    options: [
      { id: 'A', text: 'Invest — the return profile justifies the risk' },
      { id: 'B', text: 'Do not invest — the risks outweigh the potential returns' },
    ],
    instruction:
      'Select one. Then explain your investment decision, including return profile, capital efficiency, and downside risks. Max 120 words.',
    scoringGuidance:
      'Correct: A. Strong reasoning: (1) Yield = $6.3M / $28M ≈ 22.5%, exceeding the 20% target. (2) Exit value at 10× steady-state profit = $6.3M × 10 = $63M on a $28M investment — a >2× return. (3) Even with the 2-year ramp period, returns exceed target within the 5-year horizon. (4) Acknowledges downside risk (payback extends to 8 years, ROIC drops to ~12.5%) but argues base case economics are compelling enough. Weak: selects B without engaging with the numbers, or selects A but cannot articulate the return math. A well-reasoned B answer with strong downside analysis can receive partial credit.',
  },
  investment_recommendation_medium_context: {
    variantId: 'investment_recommendation_medium_context',
    format: 'mcq_plus_reasoning',
    question: 'Should the fund proceed with this investment?',
    options: [
      { id: 'A', text: 'Invest — the return profile justifies the risk' },
      { id: 'B', text: 'Do not invest — the risks outweigh the potential returns' },
    ],
    instruction:
      'Select one. Then explain your decision considering: (1) return profile (MoM and implied IRR), (2) growth and margin drivers, and (3) downside severity. Max 120 words.',
    scoringGuidance:
      'Correct: A. Strong reasoning: (1) Base case delivers ~2× MoM over 5 years (€3.7B → €7.2B), implying ~15% IRR. While below 20% target in base case, a strong exit at 10× EBITDA (€800M × 10 = €8B) yields 2.2× MoM / ~17% IRR — close to target. (2) Growth is supported by two compounding levers: 7% revenue growth + margin expansion from 12% to 15%. (3) Acknowledges downside risk is severe (MoM compresses to ~1.1×) but argues base case assumptions are reasonable given EV market tailwinds. The nuance matters: a strong candidate should note that base case ~15% IRR is below target but argue the upside/downside skew is favorable. A well-reasoned B with strong downside analysis can receive full credit — the case is genuinely close.',
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
