export const assessmentTypeOptions = [
  "quiz",
  "assignment",
  "exit ticket",
  "concept test",
  "diagnostic check",
] as const;

export type AssessmentRecord = {
  id: string;
  title: string;
  assessment_date: string;
  assessment_type: string;
  topic: string | null;
  average_score: number | null;
  score_summary: Record<string, number> | null;
  concept_summary: Record<string, number> | null;
  teacher_note: string | null;
  confidence_summary: string | null;
  raw_file_path: string | null;
  expires_at: string | null;
  created_at: string;
};

export type ParsedAssessmentInput = {
  title: string;
  assessment_date: string;
  assessment_type: string;
  topic: string | null;
  average_score: number | null;
  score_summary: Record<string, number> | null;
  concept_summary: Record<string, number> | null;
  teacher_note: string | null;
  confidence_summary: string | null;
};

export function parseKeyValueLines(
  source: string,
  options?: { acceptedKeys?: string[]; valueLabel?: string },
) {
  const trimmed = source.trim();

  if (!trimmed) {
    return { success: true as const, data: null };
  }

  const entries = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const result: Record<string, number> = {};

  for (const entry of entries) {
    const separatorIndex = entry.indexOf(":");
    if (separatorIndex === -1) {
      return {
        success: false as const,
        error: `Use "label: value" format for ${options?.valueLabel ?? "summary lines"}.`,
      };
    }

    const key = entry.slice(0, separatorIndex).trim();
    const rawValue = entry.slice(separatorIndex + 1).trim();
    const value = Number(rawValue);

    if (!key || Number.isNaN(value)) {
      return {
        success: false as const,
        error: `Each ${options?.valueLabel ?? "summary"} line needs a label and numeric value.`,
      };
    }

    if (options?.acceptedKeys && !options.acceptedKeys.includes(key.toLowerCase())) {
      return {
        success: false as const,
        error: `Allowed labels are: ${options.acceptedKeys.join(", ")}.`,
      };
    }

    result[key] = value;
  }

  return { success: true as const, data: result };
}

function parseCsvRows(text: string) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return { success: false as const, error: "CSV files need a header row and at least one data row." };
  }

  const headers = rows[0].split(",").map((header) => header.trim().toLowerCase());
  const dataRows = rows.slice(1).map((row) => row.split(",").map((cell) => cell.trim()));

  return { success: true as const, headers, dataRows };
}

export function parseAssessmentCsv(text: string) {
  const parsedRows = parseCsvRows(text);

  if (!parsedRows.success) {
    return parsedRows;
  }

  const { headers, dataRows } = parsedRows;
  const conceptIndex = headers.indexOf("concept");
  const masteryIndex = headers.findIndex((header) => ["mastery", "mastery_value", "score"].includes(header));
  const labelIndex = headers.findIndex((header) => ["band", "label", "range"].includes(header));
  const valueIndex = headers.findIndex((header) => ["count", "value"].includes(header));

  if (conceptIndex !== -1 && masteryIndex !== -1) {
    const conceptSummary: Record<string, number> = {};

    for (const row of dataRows) {
      const concept = row[conceptIndex];
      const value = Number(row[masteryIndex]);

      if (!concept || Number.isNaN(value)) {
        return {
          success: false as const,
          error: 'Concept CSV rows must use "concept, mastery_value" style columns with numeric values.',
        };
      }

      conceptSummary[concept] = value;
    }

    return {
      success: true as const,
      data: { concept_summary: conceptSummary, score_summary: null as Record<string, number> | null },
    };
  }

  if (labelIndex !== -1 && valueIndex !== -1) {
    const scoreSummary: Record<string, number> = {};

    for (const row of dataRows) {
      const label = row[labelIndex];
      const value = Number(row[valueIndex]);

      if (!label || Number.isNaN(value)) {
        return {
          success: false as const,
          error: 'Distribution CSV rows must use "band, count" or "label, value" columns with numeric values.',
        };
      }

      scoreSummary[label] = value;
    }

    return {
      success: true as const,
      data: { concept_summary: null as Record<string, number> | null, score_summary: scoreSummary },
    };
  }

  return {
    success: false as const,
    error:
      'CSV headers must match either "concept, mastery_value" for concept mastery or "band, count" for distribution summaries.',
  };
}

export function parseAssessmentFormData(formData: FormData) {
  const inputMethod = String(formData.get("inputMethod") ?? "manual");
  const title = String(formData.get("title") ?? "").trim();
  const assessmentDate = String(formData.get("assessmentDate") ?? "").trim();
  const assessmentType = String(formData.get("assessmentType") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const averageScoreInput = String(formData.get("averageScore") ?? "").trim();
  const teacherNote = String(formData.get("teacherNote") ?? "").trim();
  const confidenceSummary = String(formData.get("confidenceSummary") ?? "").trim();
  const scoreSummaryText = String(formData.get("scoreSummaryText") ?? "").trim();
  const conceptSummaryText = String(formData.get("conceptSummaryText") ?? "").trim();

  if (!title) {
    return { success: false as const, error: "Assessment title is required." };
  }

  if (!assessmentDate) {
    return { success: false as const, error: "Assessment date is required." };
  }

  if (!assessmentTypeOptions.includes(assessmentType as (typeof assessmentTypeOptions)[number])) {
    return { success: false as const, error: "Choose a supported assessment type." };
  }

  let averageScore: number | null = null;
  if (averageScoreInput) {
    const parsedAverage = Number(averageScoreInput);
    if (Number.isNaN(parsedAverage) || parsedAverage < 0 || parsedAverage > 100) {
      return { success: false as const, error: "Average score must be a number between 0 and 100." };
    }
    averageScore = parsedAverage;
  }

  const scoreSummary = parseKeyValueLines(scoreSummaryText, {
    valueLabel: "distribution lines",
  });
  if (!scoreSummary.success) {
    return scoreSummary;
  }

  const conceptSummary = parseKeyValueLines(conceptSummaryText, {
    valueLabel: "concept mastery lines",
  });
  if (!conceptSummary.success) {
    return conceptSummary;
  }

  return {
    success: true as const,
    inputMethod,
    data: {
      title,
      assessment_date: assessmentDate,
      assessment_type: assessmentType,
      topic: topic || null,
      average_score: averageScore,
      score_summary: scoreSummary.data,
      concept_summary: conceptSummary.data,
      teacher_note: teacherNote || null,
      confidence_summary: confidenceSummary || null,
    } satisfies ParsedAssessmentInput,
  };
}

export function buildRawAssessmentPath(userId: string, classId: string, filename: string) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  return `${userId}/${classId}/${Date.now()}-${safeFilename}`;
}

export function getRetentionExpiryDate(retentionDays: number) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + retentionDays);
  return expiresAt.toISOString();
}
