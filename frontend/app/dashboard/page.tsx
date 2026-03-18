import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const dashboardCards = [
  {
    title: "Class Profiles",
    body: "Create and manage the courses you teach before adding weekly assessments.",
  },
  {
    title: "Assessment Workflow",
    body: "Upload or enter class-level evidence without storing student-identifiable records.",
  },
  {
    title: "Recommendation Cycle",
    body: "Use later sessions to connect analysis, strategy suggestions, and teaching logs.",
  },
];

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const classCount = supabase
    ? (await supabase.from("classes").select("id", { count: "exact", head: true })).count ?? 0
    : 0;

  return (
    <section className="grid gap-6">
      <article className="rounded-[28px] bg-ink p-8 text-white shadow-[0_20px_60px_rgba(16,33,43,0.12)]">
        <p className="text-sm uppercase tracking-[0.2em] text-white/70">Dashboard Access</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Your protected TeachLens workspace is ready.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
          Authentication is active. The next build sessions will add class profiles, assessment
          entry, analytics, and rule-based instructional recommendations here.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/classes"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
          >
            Open Classes
          </Link>
          <div className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80">
            Current class profiles: {classCount}
          </div>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
