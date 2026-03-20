import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SignUpPage() {
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
            <p className="section-kicker">TeachLens Sign Up</p>
            <h2 className="text-5xl font-semibold leading-[1.04] text-[#17212b]">
              Create a teacher workspace that stays simple, structured, and privacy-aware.
            </h2>
            <p className="text-base leading-8 text-neutral-500 dark:text-neutral-400">
              This account is only for protected teacher access to the TeachLens workflow. Class
              summaries, recommendations, and method tracking all stay tied to your own workspace.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="rounded-[24px] bg-[rgba(255,255,255,0.68)] p-5 shadow-[0_18px_40px_rgba(23,33,43,0.06)]">
              <p className="section-kicker">Setup</p>
              <p className="mt-3 text-lg font-semibold text-[#17212b]">Start with one class</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Add a course, log one assessment, and let the recommendation flow build from there.
              </p>
            </article>
            <article className="rounded-[24px] bg-[#17212b] p-5 text-white shadow-[0_22px_50px_rgba(23,33,43,0.16)]">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Data policy</p>
              <p className="mt-3 text-lg font-semibold">No student-identifiable data</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Keep entries limited to class-level summary signals like score, confidence,
                participation, and observation.
              </p>
            </article>
          </div>
        </section>

        <AuthForm mode="sign-up" />
      </div>
    </main>
  );
}
