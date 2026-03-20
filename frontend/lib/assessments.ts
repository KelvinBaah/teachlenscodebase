export const assessmentTypeOptions = [
  "quiz",
  "assignment",
  "diagnostic_check",
  "exit_ticket",
] as const;

export type AssessmentRecord = {
  id: string;
  title: string;
  assessment_date: string;
  assessment_type: string;
  topic: string | null;
  average_score: number | null;
  average_confidence: number | null;
  participation_rate: number | null;
  current_teaching_method: string | null;
  teacher_observation: string | null;
  raw_file_path: string | null;
  raw_upload_expires_at: string | null;
  retention_category: string;
  expires_at: string | null;
  created_at: string;
};

export type ParsedAssessmentInput = {
  title: string;
  assessment_date: string;
  assessment_type: string;
  topic: string | null;
  average_score: number | null;
  average_confidence: number | null;
  participation_rate: number | null;
  current_teaching_method: string | null;
  teacher_observation: string | null;
};

type AssessmentRecordLike = Record<string, unknown>;

export function formatAssessmentTypeLabel(type: string) {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function readLegacyScoreSummaryValue(
  scoreSummary: unknown,
  key: "participation_rate" | "current_teaching_method",
) {
  if (!scoreSummary || typeof scoreSummary !== "object" || Array.isArray(scoreSummary)) {
    return null;
  }

  const value = (scoreSummary as Record<string, unknown>)[key];
  return value ?? null;
}

export function normalizeAssessmentRecord(record: AssessmentRecordLike): AssessmentRecord {
  const scoreSummary = record.score_summary;
  const averageConfidence =
    parseNullableNumber(record.average_confidence) ??
    parseNullableNumber(record.confidence_summary);
  const participationRate =
    parseNullableNumber(record.participation_rate) ??
    parseNullableNumber(readLegacyScoreSummaryValue(scoreSummary, "participation_rate"));
  const currentTeachingMethod =
    typeof record.current_teaching_method === "string"
      ? record.current_teaching_method
      : typeof readLegacyScoreSummaryValue(scoreSummary, "current_teaching_method") === "string"
        ? String(readLegacyScoreSummaryValue(scoreSummary, "current_teaching_method"))
        : null;
  const teacherObservation =
    typeof record.teacher_observation === "string"
      ? record.teacher_observation
      : typeof record.teacher_note === "string"
        ? record.teacher_note
        : null;

  return {
    id: String(record.id ?? ""),
    title: String(record.title ?? ""),
    assessment_date: String(record.assessment_date ?? ""),
    assessment_type: String(record.assessment_type ?? ""),
    topic: typeof record.topic === "string" ? record.topic : null,
    average_score: parseNullableNumber(record.average_score),
    average_confidence: averageConfidence,
    participation_rate: participationRate,
    current_teaching_method: currentTeachingMethod,
    teacher_observation: teacherObservation,
    raw_file_path: typeof record.raw_file_path === "string" ? record.raw_file_path : null,
    raw_upload_expires_at:
      typeof record.raw_upload_expires_at === "string" ? record.raw_upload_expires_at : null,
    retention_category:
      typeof record.retention_category === "string" ? record.retention_category : "assessment_detail",
    expires_at: typeof record.expires_at === "string" ? record.expires_at : null,
    created_at: typeof record.created_at === "string" ? record.created_at : "",
  };
}

export function shouldRetryAssessmentWithLegacySchema(errorMessage: string) {
  const normalized = errorMessage.toLowerCase();
  return [
    "average_confidence",
    "participation_rate",
    "current_teaching_method",
    "teacher_observation",
    "raw_upload_expires_at",
    "schema cache",
  ].some((term) => normalized.includes(term));
}

function parsePercentageOrDecimal(rawValue: string) {
  const trimmed = rawValue.trim().replace("%", "");
  if (!trimmed) {
    return { success: true as const, value: null };
  }

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || parsed < 0) {
    return {
      success: false as const,
      error: "Participation rate must be a positive percentage or decimal.",
    };
  }

  if (parsed <= 1) {
    return { success: true as const, value: Number((parsed * 100).toFixed(2)) };
  }

  if (parsed <= 100) {
    return { success: true as const, value: parsed };
  }

  return {
    success: false as const,
    error: "Participation rate must be between 0 and 100, or a decimal between 0 and 1.",
  };
}

function parseOptionalNumber(rawValue: string, options: { min: number; max: number; label: string }) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return { success: true as const, value: null };
  }

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || parsed < options.min || parsed > options.max) {
    return {
      success: false as const,
      error: `${options.label} must be a number between ${options.min} and ${options.max}.`,
    };
  }

  return { success: true as const, value: parsed };
}

export function parseAssessmentFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const assessmentDate = String(formData.get("assessmentDate") ?? "").trim();
  const assessmentType = String(formData.get("assessmentType") ?? "").trim();
  const topic = String(formData.get("topicOrConcept") ?? "").trim();
  const averageScoreInput = String(formData.get("averageScore") ?? "").trim();
  const averageConfidenceInput = String(formData.get("averageConfidence") ?? "").trim();
  const participationRateInput = String(formData.get("participationRate") ?? "").trim();
  const currentTeachingMethod = String(formData.get("currentTeachingMethod") ?? "").trim();
  const teacherObservation = String(formData.get("teacherObservation") ?? "").trim();

  if (!title) {
    return { success: false as const, error: "Assessment title is required." };
  }

  if (!assessmentDate) {
    return { success: false as const, error: "Assessment date is required." };
  }

  if (!assessmentTypeOptions.includes(assessmentType as (typeof assessmentTypeOptions)[number])) {
    return { success: false as const, error: "Choose a supported assessment type." };
  }

  const averageScore = parseOptionalNumber(averageScoreInput, {
    min: 0,
    max: 100,
    label: "Average score",
  });
  if (!averageScore.success) {
    return averageScore;
  }

  const averageConfidence = parseOptionalNumber(averageConfidenceInput, {
    min: 1,
    max: 5,
    label: "Average confidence",
  });
  if (!averageConfidence.success) {
    return averageConfidence;
  }

  const participationRate = parsePercentageOrDecimal(participationRateInput);
  if (!participationRate.success) {
    return participationRate;
  }

  return {
    success: true as const,
    data: {
      title,
      assessment_date: assessmentDate,
      assessment_type: assessmentType,
      topic: topic || null,
      average_score: averageScore.value,
      average_confidence: averageConfidence.value,
      participation_rate: participationRate.value,
      current_teaching_method: currentTeachingMethod || null,
      teacher_observation: teacherObservation || null,
    } satisfies ParsedAssessmentInput,
  };
}

export function getRetentionExpiryDate(retentionDays: number) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + retentionDays);
  return expiresAt.toISOString();
}
