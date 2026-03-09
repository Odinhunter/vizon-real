import type { CaseContent } from '../types';

export const financeCaseContent: Record<string, CaseContent> = {
  finance_case_001: {
    caseId: 'finance_case_001',
    title: 'Initiating Coverage on Lumina Fitness Technologies',
    company: 'Lumina Fitness Technologies',
    role: 'Equity Research Analyst initiating coverage',
    narrative:
      "You are an equity research analyst initiating coverage on Lumina Fitness Technologies, a connected fitness company that experienced explosive subscriber growth during the pandemic before facing normalization headwinds. Management is guiding toward profitability within 18 months, but the market is skeptical. Your job is to form a clear investment view and initiate with a rating.",
    situation:
      "Lumina grew its subscriber base 4x during the pandemic, reaching 3.2 million connected subscribers. Subscriber growth has been flat to negative for five consecutive quarters, and hardware sales have declined 60% from peak. The company has pivoted toward a software-only subscription tier at $29/month, abandoning the $39 hardware-bundled tier. This transition has improved gross margins on new subscribers but created a mixed installed base. Management is guiding to positive EBITDA within six quarters. Cash burn is approximately $45M per quarter, and the company holds $280M in cash. The stock is down 72% from its peak.",
    problemStatement:
      'What is your investment rating on Lumina, and what is the thesis? Specifically: how do you assess the pace of normalization, the economics of the subscription transition, and balance sheet sustainability?',
    dataExhibitHint:
      '3-year income statement with segment detail, subscriber metrics (gross adds, churn, ARPU by tier), cash position and burn rate, comparable company trading multiples',
  },

  finance_case_002: {
    caseId: 'finance_case_002',
    title: 'Overleveraged Balance Sheet at a Regional Retail Chain',
    company: 'Broadstone Retail Group',
    role: 'Credit Analyst evaluating refinancing risk',
    narrative:
      'You are a credit analyst at a leveraged finance desk reviewing Broadstone Retail Group, a regional retail chain with 210 locations across the Midwest. A $450M bond matures in 14 months. The company is in early-stage discussions with its lenders, and the market is closely watching whether a refinancing is achievable given the deteriorating operating environment.',
    situation:
      "Broadstone carries $1.2B in total debt — a 5.5x leverage multiple at current EBITDA. EBITDA has compressed from $240M three years ago to $175M last year, driven by three consecutive quarters of negative same-store sales (-2.4%, -3.8%, -4.1%) and rising occupancy costs. The company is currently in compliance with its covenants, but EBITDA covenant headroom has narrowed to $18M. Management is pursuing $40M in annualized cost savings through store consolidation and labor rationalization, but these initiatives are 8–12 months from full realization. Two non-core distribution assets are being marketed for sale at an estimated $120M, but no buyer has been announced.",
    problemStatement:
      'Is Broadstone capable of refinancing successfully in the current environment, or does the combination of operational deterioration and leverage create an unsustainable path to the bond maturity? What is your credit assessment?',
    dataExhibitHint:
      'Leverage ratio trend (3 years), EBITDA-to-interest coverage, covenant headroom analysis, cash flow waterfall under base and stress scenarios',
  },

  finance_case_003: {
    caseId: 'finance_case_003',
    title: 'Contested Acquisition of a SaaS Platform by a PE Sponsor',
    company: 'Meridian SaaS / Arkwright Capital',
    role: 'Investment Professional evaluating a contested acquisition',
    narrative:
      "You are on the investment team at Arkwright Capital, a mid-market PE sponsor. Arkwright is evaluating a contested acquisition of Meridian, a B2B SaaS company serving mid-market logistics teams with $85M in ARR. Two other sponsors are in the final round. Your final bid is due in four days. The pressure to decide — and to price accurately — is acute.",
    situation:
      "Meridian has posted 35% ARR growth year-over-year, and the business is strategically compelling. However, the unit economics have been deteriorating: net revenue retention has declined from 118% to 104% over six quarters, CAC payback has extended from 22 to 31 months, and EBITDA margin is -28% with no clear path to profitability within 24 months. The company completed a go-to-market restructuring 9 months ago, which management credits with stabilizing churn. Competing bids are reportedly in the 9-11x ARR range. Your preliminary view is that 9x ARR is the right ceiling, but your deal team is divided: the junior analysts are bullish on the market opportunity; the senior partners are concerned about the NRR trend and the extended payback.",
    problemStatement:
      'Should Arkwright bid? At what valuation range, and what are the three or four diligence questions that could materially move the price or kill the deal? With four days to closing, how do you frame the investment decision?',
    dataExhibitHint:
      'ARR bridge and NRR trend by quarter, CAC payback evolution, unit economics by customer cohort, comparable acquisition multiples in B2B SaaS',
  },
};
