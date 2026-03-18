import Link from "next/link";

import type { ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ClassesPage() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-8 text-amber-900">
        Add your Supabase frontend environment variables before using class profiles.
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
      <div className="flex flex-col gap-4 rounded-[28px] bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            Class Profiles
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            Manage the classes you teach.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Each profile stays class-level only so the MVP can support instructional decisions
            without requiring student-identifiable records.
          </p>
        </div>
        <Link
          href="/dashboard/classes/new"
          className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#184a3c]"
        >
          New Class
        </Link>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error.message}
        </div>
      ) : null}

      {classList.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center">
          <h3 className="text-2xl font-semibold text-ink">No classes yet</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Create your first class profile to start organizing assessment workflows and weekly
            analysis.
          </p>
          <Link
            href="/dashboard/classes/new"
            className="mt-6 inline-flex rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#184a3c]"
          >
            Create First Class
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classList.map((classRecord) => (
            <article
              key={classRecord.id}
              className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{classRecord.subject_area}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{classRecord.course_name}</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Class size: {classRecord.class_size}</p>
                <p>Level: {classRecord.class_level}</p>
                <p>Term: {classRecord.term_label || "Not set yet"}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/dashboard/classes/${classRecord.id}`}
                  className="rounded-full bg-mist px-4 py-2 text-sm font-semibold text-pine transition hover:bg-[#dfede6]"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/classes/${classRecord.id}/edit`}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
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
