import type { AssessmentAnalysis } from "./analytics";

export type AiSummaryRecommendation = {
  id?: string;
  method_name: string;
  why_recommended?: string | null;
  reason?: string | null;
  implementation_note: string | null;
};

export type AiSummaryResult = {
  understanding_summary: string;
  recommendation_explanation: string;
  source: "openai" | "fallback";
  error: string | null;
  model: string | null;
};

type FallbackArgs = {
  analysis: AssessmentAnalysis;
  recommendations: AiSummaryRecommendation[];
};

export function buildFallbackAiSummary({
  analysis,
  recommendations,
}: FallbackArgs): AiSummaryResult {
  const summaryParts: string[] = [];

  if (analysis.averageScore !== null) {
    summaryParts.push(`The latest class average is ${analysis.averageScore}.`);
  }

  if (analysis.detectedPatterns[0]) {
    summaryParts.push(analysis.detectedPatterns[0]);
  } else if (analysis.confidenceMismatch) {
    summaryParts.push("A confidence-performance mismatch was flagged in the latest check.");
  } else {
    summaryParts.push("The latest assessment provides a limited but useful class-level snapshot.");
  }

  const recommendationParts: string[] = [];
  if (recommendations.length > 0) {
    recommendationParts.push(
      `The suggested methods were selected by the rule-based recommendation matrix: ${recommendations
        .slice(0, 3)
        .map((item) => item.method_name)
        .join(", ")}.`,
    );

    const firstReason =
      recommendations.find((item) => item.why_recommended)?.why_recommended ||
      recommendations.find((item) => item.reason)?.reason;

    if (firstReason) {
      recommendationParts.push(firstReason);
    }
  } else {
    recommendationParts.push(
      "No recommendation explanation is available yet because no teaching methods were generated for this assessment.",
    );
  }

  return {
    understanding_summary: summaryParts.join(" "),
    recommendation_explanation: recommendationParts.join(" "),
    source: "fallback",
    error: null,
    model: null,
  };
}
