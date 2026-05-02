import type { CaseContent } from '../types';

export const consultingCaseContent: Record<string, CaseContent> = {
  consulting_case_001: {
    caseId: 'consulting_case_001',
    title: 'FitLife Gym Profit Decline',
    company: 'FitLife',
    role: 'Management Consultant advising the CEO',
    narrative:
      'FitLife is a regional gym chain with 20 locations across India. Over the past 6 months, the CEO has noticed that overall company profits have fallen by 18%, even though membership prices have remained unchanged. The CEO wants to understand what is driving the decline and how the company should respond.',
    situation:
      'FitLife operates 20 gyms across India. Over the past 6 months, profits have fallen 18% with no change in membership pricing. The CEO has flagged the performance decline but has not yet identified a single clear cause. You have been asked to diagnose the cause of the performance decline.',
    problemStatement:
      'What is driving the 18% decline in profits at FitLife, and what should the company prioritize to reverse it?',
    dataExhibitHint:
      'Membership trends by quarter, unit economics per gym, customer exit survey results',

    probeExhibits: {
      // Shown on the hypothesis probe — candidate must form a hypothesis from membership trend data
      hypothesis_driven_thinking_low_context: {
        type: 'bar',
        title: 'Total Membership by Quarter',
        subtitle: 'Quarterly membership data across all 20 locations',
        xKeys: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
          { name: 'Total Members', values: [48000, 49000, 47500, 46200], highlight: true },
        ],
        yAxisFormat: 'number',
        footnote: 'Membership prices remained unchanged throughout this period. Two new gym chains opened multiple locations in the same cities during Q3 and Q4.',
      },

      // Shown on the analytical thinking probe — candidate must calculate profit per gym and total loss
      analytical_thinking_low_context: {
        type: 'table',
        title: 'Average Monthly Economics Per Gym',
        subtitle: 'Monthly unit economics per gym location',
        columns: ['6 Months Ago', 'Today'],
        rows: [
          { label: 'Members per gym', values: ['2,400', '2,310'] },
          { label: 'Monthly membership fee', values: ['₹2,000', '₹2,000'] },
          { label: 'Monthly operating cost', values: ['₹35L', '₹35.6L'], isHighlight: true },
          { isSpacer: true, label: '', values: [] },
          { label: 'Total FitLife gyms', values: ['20', '20'] },
          { label: 'Avg. gym capacity', values: ['~2,500 members', '~2,500 members'] },
        ],
        footnote: 'FitLife operates 20 gyms. Average gym capacity is approximately 2,500 members per location.',
      },

      // Shown on the recommendation probe — candidate must identify top churn driver
      decision_recommendation_low_context: {
        type: 'table',
        title: 'Customer Exit Survey — Top Reasons for Cancellation',
        subtitle: 'Exit survey responses from recent cancellations (n=400)',
        columns: ['% of Responses'],
        rows: [
          { label: 'Crowded gyms', values: ['35%'], isHighlight: true },
          { label: 'Better competitor pricing', values: ['25%'] },
          { label: 'Outdated equipment', values: ['20%'] },
          { label: 'Poor customer service', values: ['15%'] },
          { label: 'Other', values: ['5%'] },
        ],
        footnote: 'Source: Exit survey of 400 members who cancelled in the last 3 months. Most gyms operate near full capacity during evening hours; however, midday utilization is only around 55%. Building additional gym space would require significant investment.',
      },
    },
  },

  consulting_case_002: {
    caseId: 'consulting_case_002',
    title: 'FastDrop Delivery Delays',
    company: 'FastDrop',
    role: 'Management Consultant advising the CEO',
    narrative:
      'FastDrop is a same-day grocery delivery company operating in 7 major cities in the United States. Customers place orders through the FastDrop mobile app, and groceries are delivered from local fulfillment hubs in each city. Over the past 4 months, FastDrop has experienced a significant increase in delivery delays. Customer complaints have increased and repeat order rates have begun to decline.',
    situation:
      'The CEO has asked you to help diagnose what might be causing the operational performance decline. Delivery delays have worsened across the network, with the most severe issues concentrated in the three largest cities. The leadership team has not yet isolated whether the problem is demand-driven, capacity-driven, or both.',
    problemStatement:
      'What is causing the increase in delivery delays at FastDrop, and what should the company prioritize to resolve it?',
    dataExhibitHint:
      'Daily order volumes by month, delivery capacity metrics, solution comparison table',

    probeExhibits: {
      // Shown on hypothesis probe — grouped bar showing orders vs capacity
      hypothesis_driven_thinking_medium_context: {
        type: 'grouped_bar',
        title: 'Average Daily Orders vs. Delivery Capacity',
        subtitle: 'Average daily order volumes, last 4 months',
        xKeys: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
        series: [
          { name: 'Orders per Day', values: [15000, 16500, 19000, 23000], highlight: true },
          { name: 'Delivery Capacity', values: [16000, 16000, 16000, 16000] },
        ],
        yAxisFormat: 'number',
        footnote: 'Delivery capacity based on 800 drivers × 20 deliveries/day. Delays are most severe in New York, Los Angeles, and Chicago — these three cities account for 60% of total FastDrop demand.',
      },

      // Shown on analytical thinking probe — capacity metrics for multi-step calculation
      analytical_thinking_medium_context: {
        type: 'table',
        title: 'FastDrop Delivery Capacity Metrics',
        subtitle: 'Delivery operations data — current vs. 4 months ago',
        columns: ['4 Months Ago', 'Today'],
        rows: [
          { label: 'Active drivers', values: ['800', '800'] },
          { label: 'Avg. deliveries per driver per day', values: ['22', '20'], isHighlight: true },
          { label: 'Driver turnover (monthly)', values: ['3%', '8%'], isHighlight: true },
          { isSpacer: true, label: '', values: [] },
          { label: 'Current daily demand', values: ['—', '23,000 orders'] },
          { label: 'Demand in top 3 cities (NY, LA, Chicago)', values: ['—', '60% of total'] },
          { label: 'Drivers allocated to top 3 cities', values: ['—', '50% of drivers'], isHighlight: true },
        ],
        footnote: 'Driver turnover has doubled in top 3 cities vs. other markets.',
      },

      // Shown on recommendation probe — solution comparison table
      decision_recommendation_medium_context: {
        type: 'table',
        title: 'FastDrop — Solution Comparison',
        subtitle: 'Operations team evaluated four potential solutions to reduce delivery delays',
        columns: ['Capacity Impact', 'Time to Implement', 'Cost'],
        rows: [
          { label: 'Hire more drivers', values: ['+5,800 deliveries/day', '2 months', '$9M'] },
          { label: 'Improve routing software', values: ['+2,400 deliveries/day', '3 months', '$2M'], isHighlight: true },
          { label: 'Open new fulfillment hubs', values: ['+1,200 deliveries/day', '9 months', '$12M'] },
          { label: 'Limit peak-hour orders', values: ['−10% demand', 'Immediate', 'Low'] },
        ],
        footnote: 'All cost estimates are annualized. Implementation can be staggered.',
      },
    },
  },

  consulting_case_003: {
    caseId: 'consulting_case_003',
    title: 'SwiftEats Acquisition Decision in Singapore',
    company: 'SwiftEats',
    role: 'Management Consultant advising the CEO',
    narrative:
      'SwiftEats is a large food delivery platform operating across Southeast Asia, currently in Indonesia, Thailand, Malaysia, and Vietnam. Singapore is an attractive market because it has high food delivery usage, strong digital payment adoption, and a dense urban population. SwiftEats is considering entering the Singapore market through one of two strategies: building its own delivery network organically, or acquiring a smaller local delivery platform called QuickCart.',
    situation:
      'The CEO has asked you to evaluate which strategy SwiftEats should pursue. The acquisition of QuickCart would deliver immediate market presence but at a higher upfront cost. Organic entry would be cheaper initially but would require building a delivery network, restaurant partnerships, and driver supply from scratch in a market where three incumbents already control 85% of order volume.',
    problemStatement:
      'Should SwiftEats acquire QuickCart or enter the Singapore market organically, and what is the strategic and financial rationale for the chosen path?',
    dataExhibitHint:
      'Singapore market size and competitive share, QuickCart financials and network assets, entry strategy economics comparison',

    probeExhibits: {
      // Shown on hypothesis probe — market context with competition, QuickCart assets, and tension data
      hypothesis_driven_thinking_high_context: {
        type: 'table',
        title: 'Singapore Food Delivery Market — Key Facts',
        subtitle: 'Singapore food delivery market overview',
        columns: ['Value'],
        rows: [
          { label: 'Total annual order value', values: ['$2B'] },
          { label: 'Number of major platforms', values: ['3 incumbents'] },
          { label: 'Largest platform market share', values: ['~45%'] },
          { label: 'Top 3 platforms combined share', values: ['~85%'], isHighlight: true },
          { isSpacer: true, label: '', values: [] },
          { label: 'QuickCart market share', values: ['8%'] },
          { label: 'QuickCart active delivery drivers', values: ['5,000'] },
          { label: 'QuickCart restaurant partnerships', values: ['3,500'] },
          { label: 'QuickCart active users', values: ['1.2M'] },
          { label: 'QuickCart user growth (YoY)', values: ['-5%'], isHighlight: true },
          { label: 'QuickCart driver retention (annual)', values: ['60%'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'Estimated time to build network organically', values: ['2–3 years'] },
        ],
        footnote: 'Source: Industry data and management estimates. QuickCart\'s user base has been declining and 40% of drivers churn annually. Building a delivery network from scratch would likely take 2–3 years.',
      },

      // Shown on analytical thinking probe — economics for multi-step revenue, profit, and payback calculation
      analytical_thinking_high_context: {
        type: 'table',
        title: 'Singapore Food Delivery Economics',
        subtitle: 'Financial assumptions for market entry analysis',
        columns: ['Value'],
        rows: [
          { label: 'Total food delivery market (order value)', values: ['$2B'] },
          { label: 'Average platform commission rate', values: ['20%'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'QuickCart market share', values: ['8%'], isHighlight: true },
          { label: 'QuickCart operating margin', values: ['10%'], isHighlight: true },
          { isSpacer: true, label: '', values: [] },
          { label: 'SwiftEats target market share (Year 5)', values: ['12%'] },
          { label: 'Expected operating margin at scale', values: ['15%'] },
          { isSpacer: true, label: '', values: [] },
          { label: 'Estimated acquisition price for QuickCart', values: ['$60M'] },
          { label: 'Organic entry — expected market share (Year 5)', values: ['10%'] },
        ],
        footnote: 'Commission rates vary by platform; 20% represents the industry average for Singapore.',
      },

      // Shown on recommendation probe — strategy comparison with investment and outcomes
      decision_recommendation_high_context: {
        type: 'table',
        title: 'Entry Strategy Comparison — Acquisition vs. Organic',
        subtitle: 'Entry strategy comparison — key metrics',
        columns: ['Acquisition', 'Organic Entry'],
        rows: [
          { label: 'Investment required', values: ['$60M', '$40M'] },
          { label: 'Time to market', values: ['Immediate', '~3 years'], isHighlight: true },
          { label: 'Expected market share (Year 5)', values: ['12%', '10%'] },
          { label: 'Network effects', values: ['Strong', 'Weak initially'], isHighlight: true },
          { label: 'Acquisition payback (at scale profit)', values: ['~8 years', 'N/A'], isHighlight: true },
        ],
        footnote: 'Organic entry would likely delay meaningful revenue generation by approximately three years while building driver and restaurant networks. Food delivery platforms benefit from network effects — early scale leads to better driver utilisation and improving margins over time.',
      },
    },
  },
};
