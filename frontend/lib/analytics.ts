import type { AssessmentRecord } from "./assessments";

export type UnderstandingBand = {
  label: string;
  count: number;
};

export type ConceptMetric = {
  concept: string;
  score: number;
};

export type TrendPoint = {
  date: string;
  averageScore: number;
  title: string;
};

export type AssessmentAnalysis = {
  averageScore: number | null;
  scoreDistribution: { label: string; value: number }[];
  understandingBands: UnderstandingBand[];
  conceptMetrics: ConceptMetric[];
  confidenceMismatch: boolean;
  detectedPatterns: string[];
};

function toDistributionEntries(scoreSummary: AssessmentRecord["score_summary"]) {
  if (!scoreSummary) {
    return [];
  }

  return Object.entries(scoreSummary).map(([label, value]) => ({
    label,
    value,
  }));
}

function toConceptMetrics(conceptSummary: AssessmentRecord["concept_summary"]) {
  if (!conceptSummary) {
    return [];
  }

  return Object.entries(conceptSummary)
    .map(([concept, score]) => ({ concept, score }))
    .sort((a, b) => b.score - a.score);
}

function inferUnderstandingBands(assessment: AssessmentRecord): UnderstandingBand[] {
  const distribution = assessment.score_summary;

  if (distribution && Object.keys(distribution).length > 0) {
    const lowAliases = ["low", "emerging", "struggling"];
    const mediumAliases = ["medium", "developing", "approaching"];
    const highAliases = ["high", "strong", "proficient"];

    const pick = (aliases: string[]) =>
      Object.entries(distribution)
        .filter(([label]) => aliases.includes(label.toLowerCase()))
        .reduce((sum, [, value]) => sum + value, 0);

    return [
      { label: "Low", count: pick(lowAliases) },
      { label: "Medium", count: pick(mediumAliases) },
      { label: "High", count: pick(highAliases) },
    ];
  }

  if (assessment.average_score === null || assessment.average_score === undefined) {
    return [];
  }

  if (assessment.average_score < 50) {
    return [
      { label: "Low", count: 1 },
      { label: "Medium", count: 0 },
      { label: "High", count: 0 },
    ];
  }

  if (assessment.average_score < 75) {
    return [
      { label: "Low", count: 0 },
      { label: "Medium", count: 1 },
      { label: "High", count: 0 },
    ];
  }

  return [
    { label: "Low", count: 0 },
    { label: "Medium", count: 0 },
    { label: "High", count: 1 },
  ];
}

function detectConfidenceMismatch(
  averageScore: number | null,
  confidenceSummary: string | null,
) {
  if (averageScore === null || !confidenceSummary) {
    return false;
  }

  const normalized = confidenceSummary.toLowerCase();
  const signalsHighConfidence = ["confident", "very sure", "felt strong", "high confidence"].some(
    (signal) => normalized.includes(signal),
  );

  return signalsHighConfidence && averageScore < 70;
}

function detectPatterns(
  averageScore: number | null,
  conceptMetrics: ConceptMetric[],
  understandingBands: UnderstandingBand[],
  confidenceMismatch: boolean,
) {
  const patterns: string[] = [];

  if (averageScore !== null) {
    if (averageScore < 60) {
      patterns.push("Class understanding is broadly low and may need reteaching.");
    } else if (averageScore >= 60 && averageScore < 75) {
      patterns.push("Class understanding is mixed and may need targeted follow-up.");
    } else {
      patterns.push("Class understanding is generally strong.");
    }
  }

  const lowBand = understandingBands.find((band) => band.label === "Low")?.count ?? 0;
  const highBand = understandingBands.find((band) => band.label === "High")?.count ?? 0;

  if (lowBand > 0 && highBand > 0) {
    patterns.push("Performance appears uneven across the class.");
  }

  if (conceptMetrics.length > 1) {
    const best = conceptMetrics[0];
    const weakest = conceptMetrics[conceptMetrics.length - 1];

    if (best.score - weakest.score >= 15) {
      patterns.push(`Concept mastery varies across topics, especially around ${weakest.concept}.`);
    }
  }

  if (confidenceMismatch) {
    patterns.push("Students may feel confident while still performing below expectations.");
  }

  return patterns.slice(0, 4);
}

export function analyzeAssessment(assessment: AssessmentRecord): AssessmentAnalysis {
  const averageScore = assessment.average_score ?? null;
  const scoreDistribution = toDistributionEntries(assessment.score_summary);
  const conceptMetrics = toConceptMetrics(assessment.concept_summary);
  const understandingBands = inferUnderstandingBands(assessment);
  const confidenceMismatch = detectConfidenceMismatch(
    averageScore,
    assessment.confidence_summary,
  );
  const detectedPatterns = detectPatterns(
    averageScore,
    conceptMetrics,
    understandingBands,
    confidenceMismatch,
  );

  return {
    averageScore,
    scoreDistribution,
    understandingBands,
    conceptMetrics,
    confidenceMismatch,
    detectedPatterns,
  };
}

export function buildTrendPoints(assessments: AssessmentRecord[]): TrendPoint[] {
  return assessments
    .filter((assessment) => assessment.average_score !== null)
    .map((assessment) => ({
      date: assessment.assessment_date,
      averageScore: assessment.average_score ?? 0,
      title: assessment.title,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
