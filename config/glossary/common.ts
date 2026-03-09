/**
 * Common business glossary.
 *
 * These definitions are track-agnostic and provide factual clarification only.
 * They do not guide reasoning, interpretation, or decision-making.
 */

export type GlossaryEntry = {
  term: string;
  shortDefinition: string;
  expandedExplanation?: string;
  exampleUsage?: string;
  relatedTerms?: string[];
};

export const commonGlossary: GlossaryEntry[] = [
  {
    term: "Revenue",
    shortDefinition:
      "Total income generated from selling products or services.",
    expandedExplanation:
      "Revenue reflects top-line performance and does not account for costs. Growth in revenue does not necessarily imply profitability.",
    exampleUsage:
      "The company’s revenue increased by 15% year-over-year.",
    relatedTerms: ["Costs", "Profit", "Growth"]
  },
  {
    term: "Variable Costs",
    shortDefinition:
      "Costs that change directly with the volume of units sold.",
    expandedExplanation:
      "Variable costs typically include production, packaging, fulfillment, and transaction-related marketing expenses.",
    exampleUsage:
      "Shipping expenses increase as order volume rises.",
    relatedTerms: ["Fixed Costs", "Contribution Margin"]
  },
  {
    term: "Fixed Costs",
    shortDefinition:
      "Costs that do not change in the short term with sales volume.",
    expandedExplanation:
      "Fixed costs remain constant regardless of output level, such as rent, salaries, or long-term software contracts.",
    exampleUsage:
      "Office rent remains unchanged even if sales decline.",
    relatedTerms: ["Variable Costs"]
  },
  {
    term: "Contribution Margin",
    shortDefinition:
      "Revenue per unit minus variable costs associated with that unit.",
    expandedExplanation:
      "Contribution margin shows how much each incremental unit contributes toward covering fixed costs and profit.",
    exampleUsage:
      "A ₹1,000 order with ₹700 in variable costs has a ₹300 contribution margin.",
    relatedTerms: ["Unit Economics", "Variable Costs", "Profitability"]
  },
  {
    term: "Unit Economics",
    shortDefinition:
      "The revenues and costs associated with a single unit or transaction.",
    expandedExplanation:
      "Unit economics help assess whether a business model is sustainable at the transaction level.",
    exampleUsage:
      "The company’s unit economics weakened due to rising acquisition costs.",
    relatedTerms: ["Contribution Margin", "CAC", "AOV"]
  },
  {
    term: "Average Order Value (AOV)",
    shortDefinition:
      "Average revenue generated per customer order.",
    expandedExplanation:
      "AOV reflects pricing, bundling, and product mix decisions.",
    exampleUsage:
      "Discounting led to a decline in average order value.",
    relatedTerms: ["Revenue", "Product Mix"]
  },
  {
    term: "Customer Acquisition Cost (CAC)",
    shortDefinition:
      "Average cost incurred to acquire a new customer.",
    expandedExplanation:
      "CAC typically includes marketing spend, promotions, and onboarding expenses.",
    exampleUsage:
      "Customer acquisition costs rose due to increased digital ad competition.",
    relatedTerms: ["Marketing Spend", "Unit Economics"]
  },
  {
    term: "Profitability",
    shortDefinition:
      "The extent to which revenues exceed costs.",
    expandedExplanation:
      "Profitability can be evaluated at multiple levels, such as unit-level, product-level, or company-wide.",
    exampleUsage:
      "The firm remains profitable despite margin pressure.",
    relatedTerms: ["Revenue", "Costs", "Margins"]
  }
];
