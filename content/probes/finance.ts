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
      'Select exactly three. Then calculate BrewCo\'s annual revenue per store and explain the key drivers. Max 250 words.',
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
      'Select exactly three. Then break down how AutoNova generates revenue and EBITDA, showing the calculation. Max 250 words.',
    scoringGuidance:
      'Correct selection: A (Number of vehicles sold), B (Average selling price), D (EBITDA margin). Revenue = volume × ASP = 120,000 × €32,000 = €3.84B. EBITDA = revenue × margin = €3.84B × 12% = €460M. F (Depreciation) is a tempting distractor — it matters for EBIT and net income, but EBITDA explicitly adds back depreciation. G (Dealerships) affects volume indirectly but is not a direct P&L driver. Strong reasoning: decomposes the P&L into revenue = volume × price, then EBITDA = revenue × margin, and recognizes that EBITDA margin captures the cost structure. Weak: selects F (confuses EBITDA with EBIT) or C/E/G, or cannot produce the revenue-to-EBITDA calculation.',
  },
  financial_signal_high_context: {
    variantId: 'financial_signal_high_context',
    format: 'multi_select_plus_reasoning',
    maxSelections: 3,
    question:
      'Which are the THREE most important drivers of Cognify\'s enterprise value?',
    options: [
      { id: 'A', text: 'Total ARR' },
      { id: 'B', text: 'ARR growth rate' },
      { id: 'C', text: 'Number of customers' },
      { id: 'D', text: 'EBITDA margin' },
      { id: 'E', text: 'Office lease costs' },
      { id: 'F', text: 'Short-term customer onboarding cost' },
      { id: 'G', text: 'Social media engagement' },
    ],
    instruction:
      'Select exactly three. Then break down how Cognify generates revenue and enterprise value as a SaaS business. Max 250 words.',
    scoringGuidance:
      'Correct selection: A (Total ARR), B (ARR growth rate), D (EBITDA margin). SaaS enterprise value is driven by ARR × growth-adjusted multiple, with profitability (EBITDA margin) determining whether growth is sustainable and capital-efficient. Revenue = customers × average ARR per customer = 600 × $200K = $120M. Enterprise value at entry = $120M × 10× = $1.2B. C (Number of customers) is a component of ARR but not independently the value driver — it is captured within A. E, F, and G are not material value drivers. Strong reasoning: explains the ARR × multiple valuation framework, connects growth rate to multiple (8×–12× range depends on growth), and shows how EBITDA margin signals operating leverage. Weak: selects cost-side or irrelevant options, or cannot explain the SaaS valuation framework.',
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
      'Select one. Then explain how expansion creates value over time, referencing the store economics data. Max 250 words.',
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
      'Select one. Then explain how value will be created over the 5-year holding period, referencing the specific growth and margin drivers. Max 250 words.',
    scoringGuidance:
      'Correct: A. Value creation comes from two compounding drivers: (1) 7% annual revenue growth growing revenue ~1.4× over 5 years (~€5.4B), and (2) margin expansion from 12% to 15% driven by battery sourcing and scale efficiencies. Combined, EBITDA grows from €460M to ~€800M. C (multiple arbitrage) is a tempting distractor — the entry/exit multiple does expand from 8× to 9×, but this is a secondary effect that only works because EBITDA growth justifies a higher multiple. Strong reasoning: explains both growth levers, shows how they compound, and distinguishes primary (EBITDA growth) from secondary (multiple expansion) value creation. Weak: selects C without recognizing that multiple expansion requires operational improvement to sustain, or selects B/D which are not in the case.',
  },
  investment_thesis_high_context: {
    variantId: 'investment_thesis_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'What is the strongest investment thesis for Cognify AI?',
    options: [
      { id: 'A', text: 'ARR growth and margin expansion will drive valuation growth' },
      { id: 'B', text: 'Marketing costs can be reduced to improve profitability' },
      { id: 'C', text: 'Competitors will exit the agentic AI market' },
      { id: 'D', text: 'Pricing will increase significantly as AI adoption grows' },
    ],
    instruction:
      'Select one. Then explain how value will be created over the investment period, referencing the growth and margin projections. Max 250 words.',
    scoringGuidance:
      'Correct: A. Value creation comes from two compounding drivers: (1) ARR grows ~2.5× over 5 years ($120M → ~$300M) as growth moderates from 30% to ~20%, and (2) EBITDA margin expands from 20% to 30% through operating leverage. At a 10× exit multiple, enterprise value grows from $1.2B to $3.0B — a 2.5× increase. B is a weak thesis — marketing cost reduction is not the primary value driver for a high-growth SaaS company. C relies on unprovable competitive assumptions. D is speculative and not supported by the case data. Strong reasoning: explains both growth levers, shows how they compound, and connects ARR growth to multiple sustainability (companies growing 20%+ justify 10× ARR multiples within the 8×–12× range). Weak: selects B/C/D, or selects A but cannot explain the dual-lever value creation mechanism.',
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
      'Select the closest answer. Then show your calculations: (1) steady-state annual profit per store, (2) Year 1 profit per new store, (3) approximate payback period, (4) total annual profit from 70 new stores, and (5) ROIC. Evaluate whether this expansion is capital efficient. Max 250 words.',
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
      'Select the closest answer. Then show your calculations: (1) entry enterprise value, (2) approximate Year 5 revenue, (3) Year 5 EBITDA, (4) exit enterprise value, and (5) approximate MoM. Evaluate whether this investment shows strong capital efficiency. Max 250 words.',
    scoringGuidance:
      'Correct: C (~22%). Calculation chain: (1) Entry EV = €460M × 8 = €3.68B ≈ €3.7B. (2) Revenue grows at 7% for 5 years: €3.84B × 1.40 ≈ €5.4B. (3) Y5 EBITDA = €5.4B × 15% ≈ €810M ≈ €800M. (4) Exit EV = €800M × 9 = €7.2B. (5) MoM = €7.2B / €3.7B ≈ 2.0×. EBITDA yield = €800M / €3.7B ≈ 22%. Strong: produces the full calculation chain from entry to exit, correctly grows revenue at 7% (not 10%), applies the 15% exit margin, and concludes the investment generates ~2× MoM over 5 years. Weak: uses wrong growth rate, confuses revenue with EBITDA, or cannot connect the valuation steps.',
  },
  capital_allocation_high_context: {
    variantId: 'capital_allocation_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Work through the full return analysis. What is the approximate multiple of money (MoM) for this investment?',
    options: [
      { id: 'A', text: '1.5×' },
      { id: 'B', text: '2.0×' },
      { id: 'C', text: '2.5×' },
      { id: 'D', text: '3.0×' },
    ],
    instruction:
      'Select the closest answer. Then show your full calculation through all steps: (1) enterprise value at entry, (2) equity investment required, (3) approximate annual ARR growth rate implied by 2.5× over 5 years, (4) ARR at exit, (5) exit enterprise value, (6) equity value of the fund\'s stake at exit, (7) MoM. Then evaluate whether this represents an attractive return in IRR terms over a 5-year holding period. Max 250 words.',
    scoringGuidance:
      'Correct: C (2.5×). Full calculation chain: (1) Entry EV = $120M × 10 = $1.2B. (2) Equity investment = $1.2B × 40% = $480M. (3) 2.5× over 5 years implies ~20% CAGR (1.20^5 ≈ 2.49). (4) Exit ARR = $120M × 2.5 = $300M. (5) Exit EV = $300M × 10 = $3.0B. (6) Equity at exit = $3.0B × 40% = $1.2B. (7) MoM = $1.2B / $480M = 2.5×. IRR: 2.5× over 5 years ≈ ~20% IRR, which is an attractive return for growth equity. Strong: produces the full calculation chain correctly, correctly identifies ~20% CAGR from 2.5× growth, and evaluates IRR attractiveness. Partial: gets MoM correct but misses CAGR step or IRR evaluation. Weak: confuses enterprise value with equity value, cannot produce the calculation chain, or selects wrong answer.',
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
      'Select one. Then calculate annual profit per store and investment payback under the downside scenario, and explain how this risk affects returns and capital recovery. Max 250 words.',
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
      'Select one. Then calculate the downside exit valuation and MoM. Explain how the combination of lower EBITDA and a lower exit multiple affects the return profile. Max 250 words.',
    scoringGuidance:
      'Correct: A (~€590M). Under downside: revenue grows at 5% for 5 years → €3.84B × 1.28 ≈ €4.9B, EBITDA = €4.9B × 12% ≈ €590M. Exit EV = €590M × 7 = €4.13B. MoM = €4.13B / €3.7B ≈ 1.1×. This is a dramatic compression from the base case 2.0× MoM — the fund barely gets its money back. Strong reasoning: connects lower EBITDA + lower exit multiple → severely compressed returns, recognizes the "double hit" of operational underperformance and multiple contraction, and notes that 1.1× MoM over 5 years implies ~2% annualized return — far below the 20% IRR target. Weak: selects C or D (base case numbers), or cannot calculate the downside cascade from EBITDA → EV → MoM.',
  },
  risk_assessment_high_context: {
    variantId: 'risk_assessment_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Under the downside scenario, what is the approximate MoM for the fund\'s investment?',
    options: [
      { id: 'A', text: '1.2×' },
      { id: 'B', text: '1.4×' },
      { id: 'C', text: '1.8×' },
      { id: 'D', text: '2.0×' },
    ],
    instruction:
      'Select the closest answer. Then show your calculation: (1) exit enterprise value in the downside case, (2) equity value of the fund\'s stake, (3) downside MoM. Explain how growth slowdown and multiple compression interact to affect returns. Max 250 words.',
    scoringGuidance:
      'Correct: B (1.4×). Calculation: (1) Downside exit EV = $240M ARR × 7× = $1.68B ≈ $1.7B. (2) Equity at exit = $1.7B × 40% = $680M. (3) MoM = $680M / $480M ≈ 1.4×. This is a dramatic compression from the base case 2.5× MoM. 1.4× over 5 years implies ~7% IRR — well below growth equity targets of 20%+. Strong: produces the full downside calculation, recognizes the "double hit" of lower ARR growth AND lower exit multiple compressing returns simultaneously, and compares downside IRR (~7%) to base case (~20%). Notes that the downside still returns capital (no loss), but the opportunity cost is severe. Weak: selects C or D (base case contamination), cannot calculate the downside cascade, or fails to compare base vs. downside return profiles.',
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
      'Select one. Then explain your investment decision, including return profile, capital efficiency, and downside risks. Max 250 words.',
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
      'Select one. Then explain your decision considering: (1) return profile (MoM and implied IRR), (2) growth and margin drivers, and (3) downside severity. Max 250 words.',
    scoringGuidance:
      'Correct: A. Strong reasoning: (1) Base case delivers ~2× MoM over 5 years (€3.7B → €7.2B), implying ~15% IRR. While below 20% target in base case, a strong exit at 10× EBITDA (€800M × 10 = €8B) yields 2.2× MoM / ~17% IRR — close to target. (2) Growth is supported by two compounding levers: 7% revenue growth + margin expansion from 12% to 15%. (3) Acknowledges downside risk is severe (MoM compresses to ~1.1×) but argues base case assumptions are reasonable given EV market tailwinds. The nuance matters: a strong candidate should note that base case ~15% IRR is below target but argue the upside/downside skew is favorable. A well-reasoned B with strong downside analysis can receive full credit — the case is genuinely close.',
  },
  investment_recommendation_high_context: {
    variantId: 'investment_recommendation_high_context',
    format: 'mcq_plus_reasoning',
    question:
      'Which deal structure should the fund prefer?',
    options: [
      { id: 'A', text: 'Option A — $480M for 40% standard equity' },
      { id: 'B', text: 'Option B — $300M for 25% equity with 8% preferred return' },
    ],
    instruction:
      'Select one. Then explain your decision considering: (1) expected returns under the base case, (2) downside protection, and (3) capital efficiency. Max 250 words.',
    scoringGuidance:
      'Both A and B can score well with strong reasoning. For A (Standard equity): Base case delivers 2.5× MoM / ~20% IRR on $480M (40% × $3.0B = $1.2B at exit). Downside: 1.4× MoM / ~7% IRR (40% × $1.68B = $672M). Best argument: the fund has conviction in the base case and wants maximum upside capture. For B (Preferred + 10% equity): $300M check, 37.5% less capital. The 8% compounded preferred ($300M × 1.08^5 ≈ $441M) is a floor; above the preferred, 10% pro-rata. Base case: 10% × ($3.0B − $441M) + $441M = $697M → 2.32× MoM / ~18% IRR. Downside: 10% × ($1.68B − $441M) + $441M = $565M → 1.88× MoM / ~13% IRR. Best argument: B trades a small base-case haircut (2.32× vs. 2.5×) for materially better downside protection (1.88× vs. 1.4×), at less capital deployed. Strong: engages with both structures quantitatively, compares base and downside scenarios, and makes a clear upside-vs-protection recommendation. Weak: selects either option without comparing the structures, ignores the preferred mechanics, or cannot articulate the trade-off between ownership and downside protection.',
  },
};
