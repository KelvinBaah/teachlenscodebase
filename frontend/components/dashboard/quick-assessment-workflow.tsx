import Link from "next/link";

import { quickAssessmentFields } from "@/data/dashboard-config";

type QuickAssessmentWorkflowProps = {
  href: string;
  targetLabel: string;
};

export function QuickAssessmentWorkflow({
  href,
  targetLabel,
}: QuickAssessmentWorkflowProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 p-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Assessment workflow
        </p>
        <h3 className="mt-4 text-3xl font-semibold">One focused form for every assessment type.</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
          Quiz, assignment, diagnostic check, and exit ticket all share the same low-friction
          class summary workflow. It is designed to be completed quickly and kept free of student
          identifiers.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">Entry time</p>
            <p className="mt-3 text-2xl font-semibold">Under 30 sec</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">Data policy</p>
            <p className="mt-3 text-2xl font-semibold">Class-level only</p>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700 dark:text-secondary-300">
              Form fields
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Structured summary entry
            </h3>
          </div>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {targetLabel}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {quickAssessmentFields.map((field) => (
            <div
              key={field}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
            >
              {field}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
          <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Open the live class workflow to record the next assessment and generate updated
            recommendations.
          </p>
          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-secondary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-700"
          >
            Open assessment flow
          </Link>
        </div>
      </article>
    </section>
  );
}
