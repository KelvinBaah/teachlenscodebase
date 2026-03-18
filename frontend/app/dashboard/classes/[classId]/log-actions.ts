"use server";

import { revalidatePath } from "next/cache";

import { parseTeachingMethodLogForm } from "@/lib/tracker";

import { getAuthenticatedContext } from "../actions";

export type TeachingMethodLogActionState = {
  error?: string;
  success?: string;
};

const detailRecordRetentionDays = Number(process.env.DETAIL_RECORD_RETENTION_DAYS ?? "365");

export async function createTeachingMethodLogAction(
  classId: string,
  _previousState: TeachingMethodLogActionState,
  formData: FormData,
): Promise<TeachingMethodLogActionState> {
  const context = await getAuthenticatedContext();
  if ("error" in context) {
    return { error: context.error };
  }

  const parsed = parseTeachingMethodLogForm(formData);
  if (!parsed.success) {
    return { error: parsed.error };
  }

  const { error } = await context.supabase.from("teaching_method_logs").insert({
    teacher_id: context.user.id,
    class_id: classId,
    retention_category: "teaching_method_detail",
    expires_at: new Date(
      Date.now() + detailRecordRetentionDays * 24 * 60 * 60 * 1000,
    ).toISOString(),
    ...parsed.data,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/classes/${classId}`);
  revalidatePath(`/dashboard/classes/${classId}/progress`);
  return { success: "Teaching method logged." };
}
