import type { CaseContent } from '../types';

export const financeCaseContent: Record<string, CaseContent> = {
  finance_case_001: {
    caseId: 'finance_case_001',
    title: 'BrewCo Café Chain Investment',
    company: 'BrewCo',
    role: 'Private Equity Investment Professional',
    narrative:
      'You are an investment professional at a mid-market private equity fund evaluating BrewCo, a premium coffee chain operating 50 stores across Southeast Asia. BrewCo is seeking growth capital to expand from 50 to 120 stores over the next 3 years. Your fund is considering leading the investment round. You need to evaluate the business fundamentals, expansion economics, and return profile to make an investment recommendation.',
    situation:
      'BrewCo operates 50 stores with average revenue of approximately $500K per store. Each store serves about 250 customers per day at an average order value of $5.50, operating 360 days per year. The company plans to expand to 120 stores over 3 years. New stores require $400K in initial investment each and are expected to ramp from $450K revenue at 9% margin in Year 1 to $500K revenue at 18% margin at steady state over a 2-year maturity period.',
    problemStatement:
      'Should the fund invest in BrewCo\'s expansion from 50 to 120 stores? Evaluate the unit economics, return on invested capital, key risks, and overall investment attractiveness.',
    dataExhibitHint:
      'Current business metrics, store expansion economics, investment return analysis, downside scenario, and investment summary',

    probeExhibits: {
      financial_signal_low_context: {
        type: 'table',
        title: 'BrewCo Current Business Metrics',
        subtitle: 'Core operating data for the existing 50-store network',
        columns: ['Value'],
        rows: [
          { label: 'Number of stores', values: ['50'] },
          { label: 'Daily customers per store', values: ['250'] },
          { label: 'Average order value', values: ['$5.50'] },
          { label: 'Operating days per year', values: ['360'] },
        ],
        footnote:
          'All stores are in Southeast Asia. Figures represent trailing twelve-month averages.',
      },

      investment_thesis_low_context: {
        type: 'table',
        title: 'Store Expansion Economics',
        subtitle: 'New stores ramp to steady-state performance over 2 years',
        columns: ['Existing Stores', 'New Stores'],
        rows: [
          { label: 'Annual revenue per store', values: ['$500K', '$450K (Y1)'] },
          { label: 'Operating margin', values: ['18%', '9% (Y1) → 18% (steady state)'] },
          { label: 'Time to maturity', values: ['—', '2 years'] },
        ],
        footnote:
          'New stores reach existing store performance levels after approximately 2 years of operation.',
      },

      capital_allocation_low_context: {
        type: 'table',
        title: 'Store Investment Economics',
        subtitle: 'Per-store capital requirements and return profile',
        columns: ['Value'],
        rows: [
          { label: 'Initial investment per store', values: ['$400K'] },
          { label: 'Steady-state revenue per store', values: ['$500K'] },
          { label: 'Steady-state operating margin', values: ['18%'] },
          { label: 'Year 1 revenue (new store)', values: ['$450K'] },
          { label: 'Year 1 operating margin (new store)', values: ['9%'] },
        ],
        footnote:
          'Investment includes fit-out, equipment, and working capital. Margin improvement driven by operating leverage as customer traffic builds.',
      },

      risk_assessment_low_context: {
        type: 'table',
        title: 'Downside Scenario',
        subtitle: 'Impact of slower ramp-up and weaker unit economics',
        columns: ['Base Case', 'Downside Case'],
        rows: [
          { label: 'Revenue per store', values: ['$500K', '$420K'] },
          { label: 'Operating margin', values: ['18%', '12%'] },
        ],
        footnote:
          'Downside assumes slower customer acquisition and higher operating costs in new markets.',
      },

      investment_recommendation_low_context: {
        type: 'table',
        title: 'Investment Summary',
        subtitle: 'Key metrics for the 70-store expansion program',
        columns: ['Value'],
        rows: [
          { label: 'Total expansion investment', values: ['$28M'] },
          { label: 'Steady-state annual profit (70 new stores)', values: ['$6.3M'] },
          { label: 'Time to steady state', values: ['2 years'] },
          { label: 'Target return', values: ['20%+'] },
          { label: 'Investment horizon', values: ['5 years'] },
        ],
        footnote: 'Assume exit valuation at 10× steady-state annual profit.',
      },
    },
  },

  finance_case_002: {
    caseId: 'finance_case_002',
    title: 'AutoNova AG Investment Evaluation',
    company: 'AutoNova AG',
    role: 'Private Equity Investment Professional',
    narrative:
      'You are on the investment team at a private equity fund evaluating a majority acquisition of AutoNova AG, a mid-sized German electric vehicle manufacturer. AutoNova sells mid-range EVs across Europe and has benefited from strong demand for sustainable mobility. The fund is considering acquiring a majority stake and exiting in 5 years.',
    situation:
      'AutoNova sells 120,000 vehicles annually at an average selling price of €32,000, generating €3.84B in revenue with a 12% EBITDA margin (€460M). The company is expected to grow revenue at 7% annually, with EBITDA margins expanding from 12% to 15% by Year 5 due to improved battery sourcing costs and production scale efficiencies. The fund would enter at an 8× EBITDA multiple and targets an exit at 9× in the base case. For purposes of this analysis, assume an all-equity transaction structure.',
    problemStatement:
      'Should the fund acquire a majority stake in AutoNova AG? Evaluate the entry valuation, projected returns, downside risks, and overall investment attractiveness over a 5-year holding period.',
    dataExhibitHint:
      'Operating metrics, growth and margin assumptions, entry valuation, exit assumptions, and downside scenario',

    probeExhibits: {
      financial_signal_medium_context: {
        type: 'table',
        title: 'AutoNova Operating Metrics',
        subtitle: 'Core financial data for the current business',
        columns: ['Value'],
        rows: [
          { label: 'Vehicles sold annually', values: ['120,000'] },
          { label: 'Average selling price (ASP)', values: ['€32,000'] },
          { label: 'Total revenue', values: ['€3.84B'] },
          { label: 'EBITDA margin', values: ['12%'] },
          { label: 'EBITDA', values: ['€460M'], isHighlight: true },
        ],
        footnote: 'AutoNova operates across major European markets with a focus on mid-range EVs.',
      },

      investment_thesis_medium_context: {
        type: 'table',
        title: 'Growth & Margin Assumptions',
        subtitle: 'Margin expansion driven by battery sourcing and scale efficiencies',
        columns: ['Value'],
        rows: [
          { label: 'Annual revenue growth', values: ['7%'] },
          { label: 'EBITDA margin (today)', values: ['12%'] },
          { label: 'EBITDA margin (Year 5)', values: ['15%'], isHighlight: true },
        ],
        footnote: 'Margin expansion expected from improved battery sourcing costs and production scale efficiencies.',
      },

      capital_allocation_medium_context: {
        type: 'table',
        title: 'Entry Valuation & Growth Assumptions',
        subtitle: 'Entry at 8× current EBITDA with revenue growth and margin expansion',
        columns: ['Value'],
        rows: [
          { label: 'Current EBITDA', values: ['€460M'] },
          { label: 'Entry multiple', values: ['8×'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'Annual revenue growth', values: ['7%'] },
          { label: 'EBITDA margin (Year 5)', values: ['15%'] },
          { label: 'Exit multiple', values: ['9×'] },
        ],
        footnote: 'Candidate should calculate entry EV, Year 5 EBITDA, exit EV, and return metrics independently.',
      },

      risk_assessment_medium_context: {
        type: 'table',
        title: 'Downside Scenario',
        subtitle: 'Impact of slower growth, compressed margins, and lower exit multiple',
        columns: ['Base Case', 'Downside'],
        rows: [
          { label: 'Revenue growth', values: ['7%', '5%'] },
          { label: 'EBITDA margin (Year 5)', values: ['15%', '12%'] },
          { label: 'Exit multiple', values: ['9×', '7×'] },
        ],
        footnote: 'Downside assumes slower EV adoption, competitive pressure on pricing, and limited margin improvement.',
      },

      investment_recommendation_medium_context: {
        type: 'table',
        title: 'Investment Context',
        subtitle: 'Key parameters for the investment decision',
        columns: ['Value'],
        rows: [
          { label: 'Holding period', values: ['5 years'] },
          { label: 'Target return', values: ['20% IRR'] },
          { label: 'Transaction structure', values: ['All-equity (simplified)'] },
        ],
        footnote: 'Growth and margin expansion take time — returns are back-loaded toward exit. In a strong market scenario, the fund expects to exit at a 10× EBITDA multiple.',
      },
    },
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
