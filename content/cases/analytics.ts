import type { CaseContent } from '../types';

export const analyticsCaseContent: Record<string, CaseContent> = {
  analytics_case_001: {
    caseId: 'analytics_case_001',
    title: 'Declining Day-7 Activation on a Consumer Mobile App',
    company: 'Kindl',
    role: 'Product Analyst presenting findings to the PM team',
    narrative:
      "You are a product analyst at Kindl, a consumer lifestyle app with 2.4 million downloads. The Head of Product has flagged a significant drop in Day-7 activation — the metric the team uses as the primary leading indicator of long-term retention — and has asked you to present your findings at next week's PM review.",
    situation:
      "Day-7 activation (defined as completing at least three core actions in the first seven days) has fallen from 38% to 22% over the past two months. The decline began approximately two weeks after an app redesign was pushed to production. However, the product team notes that acquisition channel mix also shifted over the same period: paid social now accounts for 58% of installs, up from 31% two months ago, replacing organic and referral traffic. The redesign affected onboarding flow, navigation structure, and surfacing of core features. There is disagreement internally about whether the redesign, the channel shift, or a seasonal effect is the primary driver.",
    problemStatement:
      'What is driving the decline in Day-7 activation at Kindl, and what should the team investigate or act on first?',
    dataExhibitHint:
      'Activation funnel by cohort and channel, feature engagement heatmap pre/post redesign, Day-1/Day-3/Day-7 retention curves by acquisition source',
  },

  analytics_case_002: {
    caseId: 'analytics_case_002',
    title: 'Mixed Revenue Signals at a B2B SaaS Product',
    company: 'Nexum',
    role: 'Analytics Lead presenting to the revenue leadership team',
    narrative:
      "You are the analytics lead at Nexum, a B2B SaaS company selling workflow automation tools to mid-market operations teams. The Chief Revenue Officer has asked you to prepare an analysis for the upcoming board meeting to explain an apparent contradiction in the revenue data — one that is already generating tension between the sales and product teams.",
    situation:
      "New ARR bookings are at an all-time high, up 42% year-over-year, and the sales team is celebrating record performance. However, net revenue retention has declined from 112% to 96% over four consecutive quarters, meaning expansion revenue and upsell activity have effectively stalled and gross churn has increased. As a result, total ARR growth has slowed to 8% despite record new bookings. The CRO believes this is a product-quality problem being masked by sales execution. The CPO believes the sales team has moved upmarket too quickly, selling to customers who are not a fit for the current product. The Customer Success team says they are under-resourced for the existing book of business.",
    problemStatement:
      'How do you reconcile the divergence between new bookings growth and NRR deterioration, and what does this tell you about the underlying health of the Nexum business?',
    dataExhibitHint:
      'ARR waterfall by component (new, expansion, churn), cohort NRR by customer vintage, product usage metrics by customer segment, support ticket volume and category',
  },

  analytics_case_003: {
    caseId: 'analytics_case_003',
    title: 'Conflicting Demand Signals at a Two-Sided Marketplace',
    company: 'Trabelo',
    role: 'Senior Data Analyst presenting to the executive team',
    narrative:
      "You are a senior data analyst at Trabelo, a two-sided marketplace connecting freelance service providers with SMB clients. The CEO has asked for a clear data-driven perspective on why GMV growth has stalled despite what appears to be a healthy and growing supply side. Two of your colleagues have already produced conflicting analyses, and the executive team is looking to you to resolve the ambiguity.",
    situation:
      "Active supply-side providers have grown 28% year-over-year. Provider-initiated service listings are up 35%. But demand-side conversion — the percentage of SMB visitors who become paying clients — has fallen from 6.2% to 3.8% over the same period. GMV is flat despite the supply growth. One analyst argues that supply growth has caused quality dilution: more providers, lower average quality, lower client trust. The second analyst argues that the matching algorithm is failing to surface high-quality providers to the right clients, and that the underlying quality distribution hasn't changed — only the matching. The two interpretations lead to different interventions: supply curation vs. algorithm improvement.",
    problemStatement:
      'What is the most likely explanation for the divergence between supply growth and demand conversion decline, and what analysis would most efficiently distinguish between the quality-dilution hypothesis and the matching-failure hypothesis?',
    dataExhibitHint:
      'Supply/demand activity trends, conversion funnel by traffic entry point, provider quality distribution histogram, client repeat rate and satisfaction scores',
  },
};
