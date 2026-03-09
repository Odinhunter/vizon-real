import type { CaseContent } from '../types';

export const consultingCaseContent: Record<string, CaseContent> = {
  consulting_case_001: {
    caseId: 'consulting_case_001',
    title: 'Profit Decline at a Regional Gym Chain',
    company: 'FitLife',
    role: 'Management Consultant advising the CEO',
    narrative:
      'You have been engaged by FitLife, a regional gym chain operating 20 locations. Profits have declined 18% over the past 6 months despite membership prices remaining unchanged. The CEO has flagged the performance decline across the chain but has not yet identified a single clear cause.',
    situation:
      'FitLife operates 20 gyms across the region. Over the past 6 months, profits have fallen 18% with no change in membership pricing. Performance data suggests membership volumes have declined significantly, but the leadership team has not yet isolated whether the issue is revenue-driven, cost-driven, or both. No obvious single cause has been identified yet.',
    problemStatement:
      'What is driving the 18% decline in profits at FitLife, and what should the company prioritize to reverse it?',
    dataExhibitHint:
      'Membership trends by quarter, unit economics per gym, customer exit survey results',

    probeExhibits: {
      // Shown on the hypothesis probe — candidate must form a hypothesis from membership trend data
      hypothesis_driven_thinking_low_context: {
        type: 'bar',
        title: 'Total Membership by Quarter',
        subtitle: 'Membership peaked in Q2 then declined sharply into Q4',
        xKeys: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
          { name: 'Total Members', values: [48000, 50000, 46000, 39000], highlight: true },
        ],
        yAxisFormat: 'number',
        footnote: 'Membership prices remained unchanged throughout this period.',
      },

      // Shown on the analytical thinking probe — candidate must calculate profit change per gym
      analytical_thinking_low_context: {
        type: 'table',
        title: 'Average Monthly Economics Per Gym',
        subtitle: 'Revenue per gym has fallen; costs have risen slightly',
        columns: ['6 Months Ago', 'Today'],
        rows: [
          { label: 'Members per gym', values: ['2,400', '1,950'] },
          { label: 'Monthly membership fee', values: ['₹2,000', '₹2,000'] },
          { label: 'Monthly operating cost', values: ['₹35L', '₹36L'], isHighlight: true },
        ],
      },

      // Shown on the recommendation probe — candidate must identify top churn driver
      decision_recommendation_low_context: {
        type: 'table',
        title: 'Customer Exit Survey — Top Reasons for Cancellation',
        subtitle: 'Crowding is the single largest driver of member churn',
        columns: ['% of Responses'],
        rows: [
          { label: 'Crowded gyms', values: ['35%'], isHighlight: true },
          { label: 'Better competitor pricing', values: ['25%'] },
          { label: 'Outdated equipment', values: ['20%'] },
          { label: 'Poor customer service', values: ['15%'] },
          { label: 'Other', values: ['5%'] },
        ],
        footnote: 'Source: Exit survey of 400 members who cancelled in the last 3 months.',
      },
    },
  },

  consulting_case_002: {
    caseId: 'consulting_case_002',
    title: 'Market Entry Evaluation for a European EV Charging Operator',
    company: 'VoltCharge',
    role: 'Management Consultant advising the CEO',
    narrative:
      'VoltCharge is a European company that builds and operates public electric vehicle (EV) charging stations. The company currently operates over 4,000 charging stations across Western Europe, primarily in France and the Netherlands. Due to strong EV adoption across Europe, VoltCharge is considering expanding into the German market — one of the largest EV markets in Europe.',
    situation:
      'Entering Germany would require significant infrastructure investment. The CEO wants to ensure the opportunity is attractive before committing capital. The leadership team has not yet assessed market size, competitive dynamics, or which entry strategy would generate the strongest returns.',
    problemStatement:
      'Should VoltCharge enter the German EV charging market, and if so, which entry strategy should it prioritise?',
    dataExhibitHint:
      'German EV fleet size and growth forecast, charging station utilization rates, competitive landscape, entry strategy economics',

    probeExhibits: {
      // Shown on hypothesis probe — market data with growth and competition signals
      hypothesis_driven_thinking_medium_context: {
        type: 'table',
        title: 'German EV Charging Market — Key Facts',
        subtitle: 'Strong EV growth coexists with established competition and significant infrastructure already deployed',
        columns: ['Current', '5-Year Forecast'],
        rows: [
          { label: 'EVs on the road', values: ['1.2 million', '3 million'], isHighlight: true },
          { label: 'Public charging stations', values: ['70,000', '—'] },
          { label: 'Major charging network operators', values: ['2 large incumbents', '—'] },
          { label: 'VoltCharge stations (Germany)', values: ['0', '—'] },
        ],
        footnote: 'Source: Industry forecast and public data. Forecast assumes current EV adoption trajectory continues.',
      },

      // Shown on analytical thinking probe — market sizing assumptions
      analytical_thinking_medium_context: {
        type: 'table',
        title: 'EV Charging Market Assumptions — Germany',
        subtitle: 'Assumptions to estimate total annual market revenue and VoltCharge\'s potential share',
        columns: ['Value'],
        rows: [
          { label: 'Total EVs in Germany', values: ['1.2 million'] },
          { label: 'Average charging sessions per EV per year', values: ['120 sessions'] },
          { label: 'Average revenue per charging session', values: ['€8'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'VoltCharge target market share (Year 5)', values: ['10%'], isHighlight: true },
        ],
        footnote: 'Management assumption. Apply these figures to estimate total market size and VoltCharge\'s revenue opportunity.',
      },

      // Shown on recommendation probe — strategy economics side by side
      decision_recommendation_medium_context: {
        type: 'table',
        title: 'Entry Strategy Comparison — Highway vs. Urban Charging',
        subtitle: 'Urban charging generates higher revenue per charger per day despite a lower price per session',
        columns: ['Highway Charging', 'Urban Charging'],
        rows: [
          { label: 'Estimated investment', values: ['€250M', '€180M'] },
          { label: 'Sessions per charger per day', values: ['8', '20'], isHighlight: true },
          { label: 'Revenue per session', values: ['€12', '€7'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'Revenue per charger per day', values: ['€96', '€140'], isBold: true, isHighlight: true },
        ],
        footnote: 'Revenue per charger per day = sessions per day × revenue per session.',
      },
    },
  },

  consulting_case_003: {
    caseId: 'consulting_case_003',
    title: 'Acquisition vs. Organic Entry into the Singapore Food Delivery Market',
    company: 'SwiftEats',
    role: 'Management Consultant advising the CEO',
    narrative:
      'SwiftEats is a large food delivery platform operating across Southeast Asia — currently in Indonesia, Thailand, Malaysia, and Vietnam. Singapore is an attractive adjacent market with high food delivery usage, strong digital payment adoption, and a dense urban population. SwiftEats is now considering whether to enter Singapore organically or acquire QuickCart, a smaller local delivery platform already operating there.',
    situation:
      'The CEO must choose between two entry strategies before the next board meeting. The acquisition of QuickCart would deliver immediate market presence but at a higher upfront cost. Organic entry would be cheaper initially but would require building a delivery network, restaurant partnerships, and driver supply from scratch. The leadership team has not yet assessed QuickCart\'s financials, compared the economics of each path, or evaluated how competitive dynamics in Singapore would affect the decision.',
    problemStatement:
      'Should SwiftEats acquire QuickCart or enter the Singapore market organically, and what is the strategic rationale for the chosen path?',
    dataExhibitHint:
      'Singapore market size and competitive share, QuickCart revenue and profitability, entry strategy economics comparison',

    probeExhibits: {
      // Shown on hypothesis probe — market context with competition and build-time signals
      hypothesis_driven_thinking_high_context: {
        type: 'table',
        title: 'Singapore Food Delivery Market — Key Facts',
        subtitle: 'A concentrated market with strong network effects and a multi-year lead time for organic entry',
        columns: ['Value'],
        rows: [
          { label: 'Total annual order value', values: ['$2B'] },
          { label: 'Number of major platforms', values: ['3 incumbents'], isHighlight: true },
          { label: 'Top 3 platforms combined market share', values: ['~85%'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'QuickCart market share', values: ['8%'] },
          { label: 'QuickCart active delivery drivers', values: ['5,000'] },
          { label: 'QuickCart restaurant partnerships', values: ['3,500'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'Estimated time to build network organically', values: ['2–3 years'] },
        ],
        footnote: 'Source: Industry data and management estimates.',
      },

      // Shown on analytical thinking probe — economics to calculate revenue and profit
      analytical_thinking_high_context: {
        type: 'table',
        title: 'Singapore Food Delivery Economics',
        subtitle: 'Apply these assumptions to estimate QuickCart\'s current revenue, profit, and growth potential',
        columns: ['Value'],
        rows: [
          { label: 'Total food delivery market (order value)', values: ['$2B'] },
          { label: 'Average platform commission rate', values: ['20%'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'QuickCart market share', values: ['8%'], isHighlight: true },
          { label: 'QuickCart operating margin', values: ['10%'], isHighlight: true },
          { isSpacer: true, label: '', values: [] },
          { label: 'SwiftEats target market share (Year 5)', values: ['12%'] },
        ],
        footnote: 'Use these figures to calculate QuickCart\'s annual revenue, operating profit, and incremental revenue from growing market share to 12%.',
      },

      // Shown on recommendation probe — strategy comparison with investment and outcomes
      decision_recommendation_high_context: {
        type: 'table',
        title: 'Entry Strategy Comparison — Acquisition vs. Organic',
        subtitle: 'Acquisition costs more upfront but delivers immediate scale in a network-effects-driven market',
        columns: ['Acquire QuickCart', 'Organic Entry'],
        rows: [
          { label: 'Estimated investment', values: ['$60M', '$40M'] },
          { label: 'Time to market', values: ['Immediate', '2–3 years'], isHighlight: true },
          { label: 'Market share at Year 5', values: ['~12%', '~10%'] },
          { label: 'Existing driver network', values: ['5,000 drivers', 'Build from scratch'], isHighlight: true },
          { label: 'Restaurant partnerships', values: ['3,500 partners', 'Build from scratch'] },
        ],
        footnote: 'Food delivery platforms benefit from network effects — early scale leads to better driver utilisation and improving margins over time.',
      },
    },
  },
};
