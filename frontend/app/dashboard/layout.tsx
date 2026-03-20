import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/sign-in");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/sign-in");
  }

  const { data: firstClass } = await supabase
    .from("classes")
    .select("id")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const primaryAssessmentHref = firstClass?.id
    ? `/dashboard/classes/${firstClass.id}`
    : "/dashboard/classes/new";

  return (
    <DashboardShell userEmail={user.email} primaryAssessmentHref={primaryAssessmentHref}>
      {children}
    </DashboardShell>
  );
}
