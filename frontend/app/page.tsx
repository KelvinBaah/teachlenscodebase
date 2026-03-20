import Link from "next/link";
import { redirect } from "next/navigation";

import { LandingShowcase } from "@/components/marketing/landing-showcase";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const valueProps = [
  {
    title: "One shared assessment flow",
    body: "Quiz, assignment, diagnostic check, and exit ticket all use the same class-summary form.",
  },
  {
    title: "Rule-based recommendations",
    body: "Teaching methods come from a transparent matrix, not a black-box model.",
  },
  {
    title: "Privacy-first by design",
    body: "TeachLens works from class-level summary information only. No student-identifiable data belongs here.",
  },
];

const workflowSteps = [
  "Create a class profile for a course you teach.",
  "Add a class-level assessment summary in under 30 seconds.",
  "Review analysis, recommendation guidance, and AI explanations.",
  "Log the teaching method you use next and track progress over time.",
];

export default async function HomePage() {
  const { isConfigured } = getSupabaseConfig();
  const supabase = await createSupabaseServerClient();
  const user = isConfigured && supabase ? (await supabase.auth.getUser()).data.user : null;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="app-shell space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="hero-card overflow-hidden rounded-[36px] p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tonal-chip bg-[rgba(31,92,74,0.12)] text-[#1f5c4a]">
              TeachLens for STEM instructors
            </span>
            <span className="tonal-chip bg-[rgba(230,197,109,0.22)] text-[#7f6322]">
              Class-level summary workflow
            </span>
          </div>

          <div className="mt-8 max-w-4xl space-y-5">
            <p className="section-kicker">Instructional Decision Support</p>
            <h1 className="text-5xl font-semibold leading-[1.02] text-[#17212b] md:text-6xl">
              Turn one fast class summary into practical teaching next steps.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              TeachLens helps professors capture class-level assessment signals, review transparent
              recommendations, explain them in plain language, and keep a running record of what
              they taught next.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={user ? "/dashboard" : "/sign-in"}
              className="rounded-full bg-[var(--pine)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--pine-deep)]"
            >
              {user ? "Open Workspace" : "Sign In"}
            </Link>
            {!user ? (
              <Link
                href="/sign-up"
                className="rounded-full border border-[rgba(23,33,43,0.14)] bg-[rgba(255,255,255,0.78)] px-6 py-3 text-sm font-semibold text-[#17212b] transition hover:border-[rgba(23,33,43,0.24)]"
              >
                Create Teacher Account
              </Link>
            ) : null}
            <div className="rounded-full border border-[rgba(23,33,43,0.08)] bg-[rgba(255,255,255,0.62)] px-6 py-3 text-sm text-[var(--muted)]">
              {isConfigured
                ? "Frontend env is configured for Supabase-backed auth"
                : "Add frontend env values to enable teacher authentication"}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {valueProps.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-[rgba(23,33,43,0.08)] bg-[rgba(255,255,255,0.72)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[rgba(23,33,43,0.16)] hover:shadow-[0_20px_40px_rgba(23,33,43,0.08)]"
              >
                <h2 className="text-xl font-semibold text-[#17212b]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="paper-card rounded-[32px] p-7">
            <p className="section-kicker">Weekly Loop</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#17212b]">
              Assess, review, adjust, and revisit.
            </h2>
            <div className="mt-6 space-y-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-[22px] bg-[rgba(247,242,232,0.78)] p-4 transition duration-300 hover:translate-x-1"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pine)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-[var(--muted)]">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] bg-[#17212b] p-7 text-white shadow-[0_24px_80px_rgba(23,33,43,0.18)]">
            <p className="section-kicker !text-[rgba(255,255,255,0.55)]">Backend Alignment</p>
            <h2 className="mt-3 text-3xl font-semibold">Built to match the current MVP stack.</h2>
            <div className="mt-6 space-y-4 text-sm leading-6 text-[rgba(255,255,255,0.74)]">
              <p>Assessments now use eight structured class-summary fields for every type.</p>
              <p>Recommendations remain rule-based and can be explained, but not replaced, by AI.</p>
              <p>
                Retention logic stays intact so older detail can be reduced without losing trend
                baselines.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <LandingShowcase />
    </main>
  );
}
