import type { TeachingCycleTimelineEntry } from "@/lib/tracker";

type TeachingCycleTimelineProps = {
  entries: TeachingCycleTimelineEntry[];
};

export function TeachingCycleTimeline({ entries }: TeachingCycleTimelineProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">Weekly Teaching Cycle</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Follow the full loop from assessment evidence to instructional adjustment and the next
            round of teaching.
          </p>
        </div>
        <div className="rounded-full bg-mist px-4 py-2 text-sm text-pine">
          {"Assess -> Analyze -> Recommend -> Adjust"}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
          <p className="text-lg font-semibold text-ink">No cycle history yet</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add an assessment and log the teaching method you use next to start building the class
            timeline.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.assessmentId}
              className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">
                    {entry.assessmentType}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-ink">{entry.assessmentTitle}</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {entry.assessmentDate}
                    {entry.averageScore !== null ? ` | Avg score ${entry.averageScore}` : ""}
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Weekly checkpoint
                </div>
              </div>

              <div className="mt-5 grid gap-3 xl:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <p className="font-semibold text-ink">Detected Patterns</p>
                  <div className="mt-3 space-y-2 leading-6">
                    {entry.detectedPatterns.length > 0 ? (
                      entry.detectedPatterns.map((pattern) => <p key={pattern}>{pattern}</p>)
                    ) : (
                      <p>No strong pattern detected for this assessment.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <p className="font-semibold text-ink">Recommendations</p>
                  <div className="mt-3 space-y-3 leading-6">
                    {entry.recommendations.length > 0 ? (
                      entry.recommendations.map((recommendation) => (
                        <div key={recommendation.id}>
                          <p className="font-medium text-ink">{recommendation.method_name}</p>
                          <p>{recommendation.implementation_note || recommendation.reason}</p>
                        </div>
                      ))
                    ) : (
                      <p>No recommendation was stored for this assessment.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <p className="font-semibold text-ink">Methods Used</p>
                  <div className="mt-3 space-y-3 leading-6">
                    {entry.methodLogs.length > 0 ? (
                      entry.methodLogs.map((log) => (
                        <div key={log.id}>
                          <p className="font-medium text-ink">
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
