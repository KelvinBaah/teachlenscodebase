export type TeachingMethodLogRecord = {
  id: string;
  assessment_id: string | null;
  weekly_analysis_id: string | null;
  recommendation_id: string | null;
  log_date: string;
  method_used: string;
  reflection_note: string | null;
  was_recommended: boolean;
  created_at: string;
};

export type RecommendationHistoryRecord = {
  id: string;
  assessment_id: string | null;
  method_name: string;
  reason: string | null;
  implementation_note: string | null;
  created_at: string;
};

export type TeachingCycleTimelineEntry = {
  assessmentId: string;
  assessmentTitle: string;
  assessmentDate: string;
  assessmentType: string;
  averageScore: number | null;
  detectedPatterns: string[];
  recommendations: RecommendationHistoryRecord[];
  methodLogs: TeachingMethodLogRecord[];
};

export function parseTeachingMethodLogForm(formData: FormData) {
  const logDate = String(formData.get("logDate") ?? "").trim();
  const methodUsed = String(formData.get("methodUsed") ?? "").trim();
  const reflectionNote = String(formData.get("reflectionNote") ?? "").trim();
  const assessmentId = String(formData.get("assessmentId") ?? "").trim();
  const weeklyAnalysisId = String(formData.get("weeklyAnalysisId") ?? "").trim();
  const recommendationId = String(formData.get("recommendationId") ?? "").trim();
  const wasRecommended = String(formData.get("wasRecommended") ?? "false") === "true";

  if (!logDate) {
    return { success: false as const, error: "Log date is required." };
  }

  if (!methodUsed) {
    return { success: false as const, error: "Teaching method is required." };
  }

  return {
    success: true as const,
    data: {
      assessment_id: assessmentId || null,
      weekly_analysis_id: weeklyAnalysisId || null,
      recommendation_id: recommendationId || null,
      log_date: logDate,
      method_used: methodUsed,
      reflection_note: reflectionNote || null,
      was_recommended: wasRecommended,
    },
  };
}

export function buildMethodFrequency(logs: TeachingMethodLogRecord[]) {
  const counts = new Map<string, number>();

  for (const log of logs) {
    counts.set(log.method_used, (counts.get(log.method_used) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([method, count]) => ({ method, count }))
    .sort((a, b) => b.count - a.count || a.method.localeCompare(b.method));
}
