"use server";

import { revalidatePath } from "next/cache";

import {
  type AssessmentRecord,
  buildRawAssessmentPath,
  getRetentionExpiryDate,
  parseAssessmentCsv,
  parseAssessmentFormData,
} from "@/lib/assessments";
import { analyzeAssessment } from "@/lib/analytics";
import { buildRecommendations } from "@/lib/recommendations";

import { getAuthenticatedContext } from "../actions";

export type AssessmentActionState = {
  error?: string;
  success?: string;
};

const rawUploadRetentionDays = Number(process.env.RAW_UPLOAD_RETENTION_DAYS ?? "30");
const detailRecordRetentionDays = Number(process.env.DETAIL_RECORD_RETENTION_DAYS ?? "365");
const rawUploadBucket = process.env.SUPABASE_STORAGE_BUCKET_RAW_UPLOADS ?? "raw-assessments";

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

  const file = formData.get("rawCsv");
  let scoreSummary = parsed.data.score_summary;
  let conceptSummary = parsed.data.concept_summary;
  let rawFilePath: string | null = null;
  let rawUploadExpiresAt: string | null = null;

  if (parsed.inputMethod === "csv") {
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Upload a CSV file when using CSV input." };
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { error: "CSV uploads must use a .csv file." };
    }

    const csvText = await file.text();
    const parsedCsv = parseAssessmentCsv(csvText);

    if (!parsedCsv.success) {
      return { error: parsedCsv.error };
    }

    scoreSummary = parsedCsv.data.score_summary ?? scoreSummary;
    conceptSummary = parsedCsv.data.concept_summary ?? conceptSummary;
    rawUploadExpiresAt = getRetentionExpiryDate(rawUploadRetentionDays);

    const storagePath = buildRawAssessmentPath(context.user.id, classId, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await context.supabase.storage
      .from(rawUploadBucket)
      .upload(storagePath, fileBuffer, {
        contentType: file.type || "text/csv",
        upsert: false,
      });

    if (uploadError) {
      return {
        error:
          `${uploadError.message}. Confirm the raw-assessments bucket and storage policies are set up.`,
      };
    }

    rawFilePath = storagePath;
  }

  const assessmentPayload = {
    teacher_id: context.user.id,
    class_id: classId,
    ...parsed.data,
    score_summary: scoreSummary,
    concept_summary: conceptSummary,
    raw_file_path: rawFilePath,
    raw_upload_expires_at: rawUploadExpiresAt,
    retention_category: "assessment_detail",
    expires_at: getRetentionExpiryDate(detailRecordRetentionDays),
  };

  const { data: insertedAssessment, error } = await context.supabase
    .from("assessments")
    .insert(assessmentPayload)
    .select(
      "id, title, assessment_date, assessment_type, topic, average_score, score_summary, concept_summary, teacher_note, confidence_summary, raw_file_path, raw_upload_expires_at, retention_category, expires_at, created_at",
    )
    .single();

  if (error || !insertedAssessment) {
    return { error: error?.message ?? "Unable to save assessment." };
  }

  const createdAssessment = insertedAssessment as AssessmentRecord;
  const analysis = analyzeAssessment(createdAssessment);
  const generatedRecommendations = buildRecommendations(createdAssessment, analysis);

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
  return { success: "Assessment added." };
}
