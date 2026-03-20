"use server";

import { revalidatePath } from "next/cache";

import {
  type AssessmentRecord,
  getRetentionExpiryDate,
  normalizeAssessmentRecord,
  parseAssessmentFormData,
  shouldRetryAssessmentWithLegacySchema,
} from "@/lib/assessments";
import { analyzeAssessment } from "@/lib/analytics";
import { buildRecommendations } from "@/lib/recommendations";

import { getAuthenticatedContext } from "../actions";

export type AssessmentActionState = {
  error?: string;
  success?: string;
  createdAssessmentId?: string;
  recommendationsAvailable?: boolean;
};

const detailRecordRetentionDays = Number(process.env.DETAIL_RECORD_RETENTION_DAYS ?? "365");

export async function createAssessmentAction(
  classId: string,
  _previousState: AssessmentActionState,
  formData: FormData,
): Promise<AssessmentActionState> {
  const context = await getAuthenticatedContext();
  if ("error" in context) {
    return { error: context.error };
  }

  const parsed = parseAssessmentFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error };
  }

  const assessmentPayload = {
    teacher_id: context.user.id,
    class_id: classId,
    ...parsed.data,
    raw_file_path: null,
    raw_upload_expires_at: null,
    retention_category: "assessment_detail",
    expires_at: getRetentionExpiryDate(detailRecordRetentionDays),
  };

  const primaryInsert = await context.supabase
    .from("assessments")
    .insert(assessmentPayload)
    .select("*")
    .single();

  let insertedAssessment = primaryInsert.data;
  let error = primaryInsert.error;

  if ((error || !insertedAssessment) && error?.message && shouldRetryAssessmentWithLegacySchema(error.message)) {
    const legacyPayload = {
      teacher_id: context.user.id,
      class_id: classId,
      title: parsed.data.title,
      assessment_date: parsed.data.assessment_date,
      assessment_type: parsed.data.assessment_type,
      topic: parsed.data.topic,
      average_score: parsed.data.average_score,
      teacher_note: parsed.data.teacher_observation,
      confidence_summary:
        parsed.data.average_confidence !== null ? String(parsed.data.average_confidence) : null,
      score_summary: {
        participation_rate: parsed.data.participation_rate,
        current_teaching_method: parsed.data.current_teaching_method,
      },
      raw_file_path: null,
      retention_category: "assessment_detail",
      expires_at: getRetentionExpiryDate(detailRecordRetentionDays),
    };

    const legacyInsert = await context.supabase
      .from("assessments")
      .insert(legacyPayload)
      .select("*")
      .single();

    insertedAssessment = legacyInsert.data;
    error = legacyInsert.error;
  }

  if (error || !insertedAssessment) {
    return {
      error:
        error?.message ??
        "Unable to save assessment. If the problem continues, run the latest Supabase migration for simplified assessment fields.",
    };
  }

  const createdAssessment = normalizeAssessmentRecord(insertedAssessment) as AssessmentRecord;
  const analysis = analyzeAssessment(createdAssessment);
  const generatedRecommendations = buildRecommendations(createdAssessment, analysis);

  if (createdAssessment.current_teaching_method) {
    await context.supabase.from("teaching_method_logs").insert({
      teacher_id: context.user.id,
      class_id: classId,
      assessment_id: createdAssessment.id,
      log_date: createdAssessment.assessment_date,
      method_used: createdAssessment.current_teaching_method,
      reflection_note: "Method in place before this assessment.",
      was_recommended: false,
      retention_category: "teaching_method_detail",
      expires_at: getRetentionExpiryDate(detailRecordRetentionDays),
    });
  }

  if (generatedRecommendations.length > 0) {
    const recommendationRows = generatedRecommendations.map((item) => ({
      teacher_id: context.user.id,
      class_id: classId,
      assessment_id: createdAssessment.id,
      method_name: item.methodName,
      reason: item.whyRecommended,
      implementation_note: item.implementationNote,
      retention_category: "recommendation_detail",
      expires_at: getRetentionExpiryDate(detailRecordRetentionDays),
    }));

    await context.supabase.from("recommendations").insert(recommendationRows);
  }

  revalidatePath(`/dashboard/classes/${classId}`);
  return {
    success: "Assessment added. Loading recommendations...",
    createdAssessmentId: createdAssessment.id,
    recommendationsAvailable: generatedRecommendations.length > 0,
  };
}
