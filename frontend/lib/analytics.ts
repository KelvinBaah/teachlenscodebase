import type { AssessmentRecord } from "./assessments";

export type UnderstandingBand = {
  label: string;
  count: number;
};

export type TrendPoint = {
  date: string;
  averageScore: number;
  title: string;
};

export type AssessmentAnalysis = {
  averageScore: number | null;
  averageConfidence: number | null;
  participationRate: number | null;
  understandingBands: UnderstandingBand[];
  confidenceMismatch: boolean;
  detectedPatterns: string[];
};

function inferUnderstandingBands(assessment: AssessmentRecord): UnderstandingBand[] {
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
  averageConfidence: number | null,
) {
  if (averageScore === null || averageConfidence === null) {
    return false;
  }

  return averageConfidence >= 4 && averageScore < 70;
}

function detectPatterns(assessment: AssessmentRecord, confidenceMismatch: boolean) {
  const patterns: string[] = [];

  if (assessment.average_score !== null) {
    if (assessment.average_score < 60) {
      patterns.push("Class understanding is broadly low and may need reteaching.");
    } else if (assessment.average_score < 75) {
      patterns.push("Class understanding is mixed and may need targeted follow-up.");
    } else {
      patterns.push("Class understanding is generally strong.");
    }
  }

  if (assessment.participation_rate !== null && assessment.participation_rate < 60) {
    patterns.push("Participation was lower than expected for this assessment.");
  }

  if (assessment.average_confidence !== null && assessment.average_confidence <= 2.5) {
    patterns.push("Students reported low confidence during this assessment cycle.");
  }

  if (confidenceMismatch) {
    patterns.push("Students may feel confident while still performing below expectations.");
  }

  const observation = assessment.teacher_observation?.toLowerCase() ?? "";
  if (["disengaged", "off task", "attention"].some((term) => observation.includes(term))) {
    patterns.push("Students appeared disengaged during this assessment cycle.");
  }

  return patterns.slice(0, 4);
}

export function analyzeAssessment(assessment: AssessmentRecord): AssessmentAnalysis {
  const averageScore = assessment.average_score ?? null;
  const averageConfidence = assessment.average_confidence ?? null;
  const participationRate = assessment.participation_rate ?? null;
  const understandingBands = inferUnderstandingBands(assessment);
  const confidenceMismatch = detectConfidenceMismatch(averageScore, averageConfidence);
  const detectedPatterns = detectPatterns(assessment, confidenceMismatch);

  return {
    averageScore,
    averageConfidence,
    participationRate,
    understandingBands,
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
