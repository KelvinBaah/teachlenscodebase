import { formatAssessmentTypeLabel } from "@/lib/assessments";
import type { TeachingCycleTimelineEntry } from "@/lib/tracker";

type TeachingCycleTimelineProps = {
  entries: TeachingCycleTimelineEntry[];
};

export function TeachingCycleTimeline({ entries }: TeachingCycleTimelineProps) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Teaching timeline</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Weekly teaching cycle
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Follow the full loop from assessment evidence to instructional adjustment and the next
            round of teaching.
          </p>
        </div>
        <div className="rounded-full bg-secondary-50 px-4 py-2 text-sm text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-200">
          Assess -&gt; Analyze -&gt; Recommend -&gt; Adjust
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No cycle history yet
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Add an assessment and log the teaching method you use next to start building the class
            timeline.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.assessmentId}
              className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
                    {formatAssessmentTypeLabel(entry.assessmentType)}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {entry.assessmentTitle}
                  </h4>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {entry.assessmentDate}
                    {entry.averageScore !== null ? ` | Avg score ${entry.averageScore}` : ""}
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                  Weekly checkpoint
                </div>
              </div>

              <div className="mt-5 grid gap-3 xl:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Detected patterns
                  </p>
                  <div className="mt-3 space-y-2 leading-6">
                    {entry.detectedPatterns.length > 0 ? (
                      entry.detectedPatterns.map((pattern) => <p key={pattern}>{pattern}</p>)
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
                    {entry.recommendations.length > 0 ? (
                      entry.recommendations.map((recommendation) => (
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
                    {entry.methodLogs.length > 0 ? (
                      entry.methodLogs.map((log) => (
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
          ))}
        </div>
      )}
    </section>
  );
}
