import Link from "next/link";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const statCards = [
  { label: "Active Classes", value: "3", note: "Profile setup will connect to Supabase later." },
  { label: "Weekly Analyses", value: "0", note: "Assessment uploads are not enabled yet." },
  { label: "Suggested Strategies", value: "0", note: "Rule-based recommendations arrive in a later session." },
];

export default async function HomePage() {
  const { isConfigured } = getSupabaseConfig();
  const supabase = createSupabaseServerClient();
  const user =
    isConfigured && supabase
      ? (await supabase.auth.getUser()).data.user
      : null;

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_20px_70px_rgba(16,33,43,0.08)] backdrop-blur">
          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_0.9fr] md:p-10">
            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-mist px-4 py-2 text-sm font-medium text-pine">
                TeachLens MVP Foundation
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  Turn weekly classroom evidence into clearer instructional decisions.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  TeachLens helps STEM teachers review formative assessment patterns,
                  track teaching moves over time, and prepare for research-based
                  recommendations without adding unnecessary workflow overhead.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={user ? "/dashboard" : "/sign-in"}
                  className="rounded-full bg-pine px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#184a3c]"
                >
                  {user ? "Open Dashboard" : "Sign In"}
                </Link>
                {!user ? (
                  <Link
                    href="/sign-up"
                    className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Create Account
                  </Link>
                ) : null}
                <div className="rounded-full border border-slate-200 px-6 py-3 text-sm text-slate-600">
                  {isConfigured
                    ? "MVP scaffold ready for auth, analytics, and strategy modules"
                    : "Add Supabase env values to enable teacher authentication"}
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] bg-ink p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    This Week
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Teacher Dashboard</h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  Placeholder
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-white/8 p-4">
                  <p className="text-sm text-white/70">Assessment Status</p>
                  <p className="mt-2 text-lg font-medium">No uploads yet</p>
                  <p className="mt-2 text-sm text-white/70">
                    Connect weekly class data to begin pattern analysis.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/8 p-4">
                  <p className="text-sm text-white/70">Retention Guardrail</p>
                  <p className="mt-2 text-lg font-medium">PII-free by design</p>
                  <p className="mt-2 text-sm text-white/70">
                    Raw uploads will use a configurable retention window.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {statCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[24px] border border-slate-200/80 bg-white/75 p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold text-ink">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.note}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
