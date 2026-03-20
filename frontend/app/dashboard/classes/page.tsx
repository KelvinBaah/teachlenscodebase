import Link from "next/link";

import type { ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ClassesPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="rounded-3xl border border-warning/30 bg-warning/10 p-8 text-warning">
        Add your frontend environment variables before using class profiles.
      </section>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: classes, error } = await supabase
    .from("classes")
    .select("id, course_name, subject_area, class_size, class_level, term_label, created_at")
    .eq("teacher_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const classList = (classes ?? []) as ClassRecord[];

  return (
    <section className="space-y-6">
      <div className="hero-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Class profiles</p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
              Organize your courses before entering weekly class summaries.
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
              Each profile is intentionally light: course, subject, level, size, and term. The
              rest of the workflow builds from class-level assessment signals only.
            </p>
          </div>
          <Link
            href="/dashboard/classes/new"
            className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            New class
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          {error.message}
        </div>
      ) : null}

      {classList.length === 0 ? (
        <div className="paper-card p-10 text-center">
          <h3 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            No classes yet
          </h3>
          <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Create your first class profile to start logging assessment summaries, reviewing
            recommendations, and tracking teaching methods over time.
          </p>
          <Link
            href="/dashboard/classes/new"
            className="mt-6 inline-flex rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Create first class
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classList.map((classRecord) => (
            <article key={classRecord.id} className="paper-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">{classRecord.subject_area}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {classRecord.course_name}
                  </h3>
                </div>
                <div className="tonal-chip bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-200">
                  {classRecord.class_size} learners
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
                  Level: {classRecord.class_level}
                </div>
                <div className="rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
                  Term: {classRecord.term_label || "Not set yet"}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/classes/${classRecord.id}`}
                  className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Open class
                </Link>
                <Link
                  href={`/dashboard/classes/${classRecord.id}/edit`}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600"
                >
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
