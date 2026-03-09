/**
 * Consulting-specific glossary.
 *
 * These terms clarify consulting language and expectations,
 * not how to solve the case.
 */

import { GlossaryEntry } from "./common";

export const consultingGlossary: GlossaryEntry[] = [
  {
    term: "Problem Structuring",
    shortDefinition:
      "Breaking down a broad problem into clear, logical components.",
    expandedExplanation:
      "Problem structuring focuses on defining what to analyze and how different parts of the problem relate to each other.",
    exampleUsage:
      "The candidate began by structuring the margin decline problem.",
    relatedTerms: ["Workstreams", "Hypothesis"]
  },
  {
    term: "Workstreams",
    shortDefinition:
      "Parallel areas of analysis that collectively address a problem.",
    expandedExplanation:
      "Workstreams allow teams to analyze complex problems efficiently by dividing effort across logical dimensions.",
    exampleUsage:
      "The team split the analysis into revenue, costs, and customer behavior workstreams.",
    relatedTerms: ["Problem Structuring", "Team Collaboration"]
  },
  {
    term: "Hypothesis",
    shortDefinition:
      "A testable explanation for what may be driving an observed outcome.",
    expandedExplanation:
      "Hypotheses guide analysis and are refined or rejected based on evidence.",
    exampleUsage:
      "One hypothesis was that higher discounts were driving margin decline.",
    relatedTerms: ["Analysis", "Evidence"]
  },
  {
    term: "Stakeholder Communication",
    shortDefinition:
      "Communicating insights clearly to decision-makers.",
    expandedExplanation:
      "Effective stakeholder communication emphasizes clarity, prioritization, and actionable framing.",
    exampleUsage:
      "The consultant summarized findings for the CEO.",
    relatedTerms: ["Client Communication", "Recommendation"]
  },
  {
    term: "Recommendation",
    shortDefinition:
      "A proposed course of action supported by analysis.",
    expandedExplanation:
      "Recommendations synthesize insights and outline next steps while acknowledging uncertainty.",
    exampleUsage:
      "The final recommendation focused on improving unit economics.",
    relatedTerms: ["Judgment", "Decision-Making"]
  }
];
