import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SignInPageProps = {
  searchParams?: {
    next?: string;
  };
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="app-shell">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
        <section className="hero-card rounded-[36px] p-8 md:p-10">
          <Link
            className="inline-flex text-sm font-semibold text-[var(--pine)] hover:text-[var(--pine-deep)]"
            href="/"
          >
            Back to home
          </Link>
          <div className="mt-8 max-w-2xl space-y-5">
            <p className="section-kicker">TeachLens Sign In</p>
            <h2 className="text-5xl font-semibold leading-[1.04] text-[#17212b]">
              Return to a workspace built for fast instructional decisions.
            </h2>
            <p className="text-base leading-8 text-neutral-500 dark:text-neutral-400">
              Sign in to capture class-level assessment summaries, review rule-based
              recommendations, and keep a clear record of what you taught next.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="rounded-[24px] bg-[rgba(255,255,255,0.68)] p-5 shadow-[0_18px_40px_rgba(23,33,43,0.06)]">
              <p className="section-kicker">Summary-first</p>
              <p className="mt-3 text-lg font-semibold text-[#17212b]">No CSV cleanup required</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Every assessment type now uses the same simplified class-summary form.
              </p>
            </article>
            <article className="rounded-[24px] bg-[#17212b] p-5 text-white shadow-[0_22px_50px_rgba(23,33,43,0.16)]">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Privacy-first</p>
              <p className="mt-3 text-lg font-semibold">Teacher-facing only</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Keep entries at the class level and leave student-identifiable information out.
              </p>
            </article>
          </div>
        </section>

        <AuthForm mode="sign-in" nextPath={searchParams?.next || "/dashboard"} />
      </div>
    </main>
  );
}
