"use client";

import { useMemo, useState } from "react";

import { formatAssessmentTypeLabel } from "@/lib/assessments";
import type { TeachingCycleTimelineEntry } from "@/lib/tracker";

type TeachingCycleSelectorProps = {
  entries: TeachingCycleTimelineEntry[];
};

export function TeachingCycleSelector({ entries }: TeachingCycleSelectorProps) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(entries[0]?.assessmentId ?? "");

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.assessmentId === selectedAssessmentId) ?? entries[0] ?? null,
    [entries, selectedAssessmentId],
  );

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Teaching timeline</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Weekly teaching cycle
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Choose a saved assessment to review its recommendation and teaching-cycle details.
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No cycle history yet
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Add an assessment and log the teaching method you use next to populate this view.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="teaching-cycle-assessment"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
            >
              Select assessment
            </label>
            <select
              id="teaching-cycle-assessment"
              value={selectedEntry?.assessmentId ?? ""}
              onChange={(event) => setSelectedAssessmentId(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            >
              {entries.map((entry) => (
                <option key={entry.assessmentId} value={entry.assessmentId}>
                  {entry.assessmentTitle} | {entry.assessmentDate}
                </option>
              ))}
            </select>
          </div>

          {selectedEntry ? (
            <article className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
                    {formatAssessmentTypeLabel(selectedEntry.assessmentType)}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedEntry.assessmentTitle}
                  </h4>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedEntry.assessmentDate}
                    {selectedEntry.averageScore !== null
                      ? ` | Avg score ${selectedEntry.averageScore}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 xl:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Detected patterns
                  </p>
                  <div className="mt-3 space-y-2 leading-6">
                    {selectedEntry.detectedPatterns.length > 0 ? (
                      selectedEntry.detectedPatterns.map((pattern) => <p key={pattern}>{pattern}</p>)
                    ) : (
                      <p>No strong pattern detected for this assessment.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Recommendations
                  </p>
                  <div className="mt-3 space-y-3 leading-6">
                    {selectedEntry.recommendations.length > 0 ? (
                      selectedEntry.recommendations.map((recommendation) => (
                        <div key={recommendation.id}>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {recommendation.method_name}
                          </p>
                          <p>{recommendation.implementation_note || recommendation.reason}</p>
                        </div>
                      ))
                    ) : (
                      <p>No recommendation was stored for this assessment.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Methods used
                  </p>
                  <div className="mt-3 space-y-3 leading-6">
                    {selectedEntry.methodLogs.length > 0 ? (
                      selectedEntry.methodLogs.map((log) => (
                        <div key={log.id}>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {log.method_used}
                            {log.was_recommended ? " (recommended)" : ""}
                          </p>
                          <p>{log.log_date}</p>
                          {log.reflection_note ? <p>{log.reflection_note}</p> : null}
                        </div>
                      ))
                    ) : (
                      <p>No teaching method has been logged after this assessment yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
