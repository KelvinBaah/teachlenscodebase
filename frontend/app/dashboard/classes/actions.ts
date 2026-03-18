"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseClassFormData } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ClassActionState = {
  error?: string;
};

async function getAuthenticatedContext() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured. Add your frontend env values first." };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "Your session expired. Please sign in again." };
  }

  return { supabase, user };
}

export { getAuthenticatedContext };

export async function createClassAction(
  _previousState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const context = await getAuthenticatedContext();
  if ("error" in context) {
    return { error: context.error };
  }

  const parsed = parseClassFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error };
  }

  const { error } = await context.supabase.from("classes").insert({
    teacher_id: context.user.id,
    ...parsed.data,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  redirect("/dashboard/classes");
}

export async function updateClassAction(
  _previousState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const context = await getAuthenticatedContext();
  if ("error" in context) {
    return { error: context.error };
  }

  const classId = String(formData.get("classId") ?? "");
  if (!classId) {
    return { error: "Missing class ID." };
  }

  const parsed = parseClassFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error };
  }

  const { error } = await context.supabase
    .from("classes")
    .update(parsed.data)
    .eq("id", classId)
    .eq("teacher_id", context.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/classes/${classId}`);
  revalidatePath(`/dashboard/classes/${classId}/edit`);
  redirect(`/dashboard/classes/${classId}`);
}

export async function deleteClassAction(formData: FormData) {
  const context = await getAuthenticatedContext();
  if ("error" in context) {
    redirect("/sign-in");
  }

  const classId = String(formData.get("classId") ?? "");
  if (!classId) {
    return;
  }

  await context.supabase
    .from("classes")
    .delete()
    .eq("id", classId)
    .eq("teacher_id", context.user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  redirect("/dashboard/classes");
}
