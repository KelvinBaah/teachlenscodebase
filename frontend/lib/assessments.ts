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

const conceptHeaderAliases = ["concept", "concept_name", "topic", "skill", "standard"];
const masteryHeaderAliases = [
  "mastery",
  "mastery_value",
  "score",
  "percent",
  "percentage",
  "value",
];
const distributionLabelAliases = ["band", "label", "range", "bucket", "level"];
const distributionValueAliases = ["count", "students", "value", "total", "frequency", "number"];
const distributionLabelHints = [
  "low",
  "medium",
  "high",
  "emerging",
  "developing",
  "approaching",
  "strong",
  "proficient",
  "struggling",
];

function normalizeCsvCell(value: string) {
  return value.replace(/^\uFEFF/, "").replace(/^"|"$/g, "").trim();
}

function normalizeCsvHeader(value: string) {
  return normalizeCsvCell(value).toLowerCase().replace(/[\s-]+/g, "_");
}

function detectDelimiter(headerLine: string) {
  const candidates = [",", ";", "\t"];
  let bestDelimiter = ",";
  let bestScore = -1;

  for (const delimiter of candidates) {
    const score = headerLine.split(delimiter).length;
    if (score > bestScore) {
      bestScore = score;
      bestDelimiter = delimiter;
    }
  }

  return bestDelimiter;
}

function parseCsvRows(text: string) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return { success: false as const, error: "CSV files need at least one row of data." };
  }

  const delimiter = detectDelimiter(rows[0]);
  const parsedRows = rows.map((row) => row.split(delimiter).map((cell) => normalizeCsvCell(cell)));
  return { success: true as const, rows: parsedRows };
}

function findHeaderIndex(headers: string[], aliases: string[]) {
  return headers.findIndex((header) => aliases.includes(header));
}

function looksLikeDistributionLabel(value: string) {
  return distributionLabelHints.includes(value.toLowerCase());
}

function isNumericCell(value: string) {
  return value !== "" && !Number.isNaN(Number(value));
}

function hasAnyNumericCell(row: string[]) {
  return row.some(isNumericCell);
}

function inferPairsFromRows(rows: string[][]) {
  const pairs: Array<{ label: string; value: number }> = [];

  for (const row of rows) {
    const label = row.find((cell) => cell && !isNumericCell(cell)) ?? "";
    const numericCell = row.find(isNumericCell);

    if (!label || !numericCell) {
      continue;
    }

    pairs.push({ label, value: Number(numericCell) });
  }

  return pairs;
}

function inferWideSummary(headers: string[], rows: string[][]) {
  const numericColumnIndexes = headers
    .map((header, index) => ({ header, index }))
    .filter(({ header, index }) => {
      if (!header) {
        return false;
      }

      const normalized = normalizeCsvHeader(header);
      if (["student", "student_name", "name", "id", "student_id"].includes(normalized)) {
        return false;
      }

      return rows.some((row) => isNumericCell(row[index] ?? ""));
    });

  if (numericColumnIndexes.length === 0) {
    return null;
  }

  const conceptSummary: Record<string, number> = {};

  for (const { header, index } of numericColumnIndexes) {
    const numericValues = rows
      .map((row) => row[index] ?? "")
      .filter(isNumericCell)
      .map((value) => Number(value));

    if (numericValues.length === 0) {
      continue;
    }

    const average =
      numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
    conceptSummary[header] = Number(average.toFixed(2));
  }

  return Object.keys(conceptSummary).length > 0 ? conceptSummary : null;
}

function inferColumnAverages(rows: string[][]) {
  const maxColumns = Math.max(...rows.map((row) => row.length));
  const conceptSummary: Record<string, number> = {};

  for (let index = 0; index < maxColumns; index += 1) {
    const numericValues = rows
      .map((row) => row[index] ?? "")
      .filter(isNumericCell)
      .map((value) => Number(value));

    if (numericValues.length === 0) {
      continue;
    }

    const average =
      numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
    conceptSummary[`Column ${index + 1}`] = Number(average.toFixed(2));
  }

  return Object.keys(conceptSummary).length > 0 ? conceptSummary : null;
}

export function parseAssessmentCsv(text: string) {
  const parsedRows = parseCsvRows(text);

  if (!parsedRows.success) {
    return parsedRows;
  }

  const [firstRow, ...remainingRows] = parsedRows.rows;
  const normalizedHeaders = firstRow.map((header) => normalizeCsvHeader(header));
  const conceptIndex = findHeaderIndex(normalizedHeaders, conceptHeaderAliases);
  const masteryIndex = findHeaderIndex(normalizedHeaders, masteryHeaderAliases);
  const labelIndex = findHeaderIndex(normalizedHeaders, distributionLabelAliases);
  const valueIndex = findHeaderIndex(normalizedHeaders, distributionValueAliases);
  const hasRecognizedHeader =
    (conceptIndex !== -1 && masteryIndex !== -1) || (labelIndex !== -1 && valueIndex !== -1);
  const dataRows = hasRecognizedHeader ? remainingRows : parsedRows.rows;

  if (dataRows.length === 0) {
    return {
      success: false as const,
      error: "CSV files need at least one usable data row.",
    };
  }

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

  const usableRows = dataRows.filter((row) => row.length >= 2);

  if (usableRows.length > 0) {
    const firstLabel = usableRows[0][0];
    const allNumericSecondColumn = usableRows.every((row) => !Number.isNaN(Number(row[1])));

    if (firstLabel && allNumericSecondColumn) {
      if (looksLikeDistributionLabel(firstLabel)) {
        const scoreSummary: Record<string, number> = {};

        for (const row of usableRows) {
          const label = row[0];
          const value = Number(row[1]);

          if (!label || Number.isNaN(value)) {
            return {
              success: false as const,
              error: "Each distribution row needs a label and numeric value.",
            };
          }

          scoreSummary[label] = value;
        }

        return {
          success: true as const,
          data: {
            concept_summary: null as Record<string, number> | null,
            score_summary: scoreSummary,
          },
        };
      }

      const conceptSummary: Record<string, number> = {};

      for (const row of usableRows) {
        const concept = row[0];
        const value = Number(row[1]);

        if (!concept || Number.isNaN(value)) {
          return {
            success: false as const,
            error: "Each concept row needs a concept label and numeric value.",
          };
        }

        conceptSummary[concept] = value;
      }

      return {
        success: true as const,
        data: {
          concept_summary: conceptSummary,
          score_summary: null as Record<string, number> | null,
        },
      };
    }
  }

  const pairRows = inferPairsFromRows(dataRows.filter(hasAnyNumericCell));
  if (pairRows.length > 0) {
    const looksLikeDistribution = pairRows.every((pair) => looksLikeDistributionLabel(pair.label));

    if (looksLikeDistribution) {
      return {
        success: true as const,
        data: {
          concept_summary: null as Record<string, number> | null,
          score_summary: Object.fromEntries(
            pairRows.map((pair) => [pair.label, pair.value]),
          ),
        },
      };
    }

    return {
      success: true as const,
      data: {
        concept_summary: Object.fromEntries(
          pairRows.map((pair) => [pair.label, pair.value]),
        ),
        score_summary: null as Record<string, number> | null,
      },
    };
  }

  if (remainingRows.length > 0) {
    const wideSummary = inferWideSummary(firstRow, remainingRows);
    if (wideSummary) {
      return {
        success: true as const,
        data: {
          concept_summary: wideSummary,
          score_summary: null as Record<string, number> | null,
        },
      };
    }
  }

  const columnAverages = inferColumnAverages(dataRows);
  if (columnAverages) {
    return {
      success: true as const,
      data: {
        concept_summary: columnAverages,
        score_summary: null as Record<string, number> | null,
      },
    };
  }

  return {
    success: false as const,
    error:
      "TeachLens could not interpret this CSV. Try a plain CSV export with at least one numeric column.",
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
