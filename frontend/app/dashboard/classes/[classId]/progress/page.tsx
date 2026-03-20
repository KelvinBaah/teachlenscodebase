import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalyticsCharts } from "@/components/classes/analytics-charts";
import { normalizeAssessmentRecord, type AssessmentRecord } from "@/lib/assessments";
import { analyzeAssessment, buildTrendPoints } from "@/lib/analytics";
import type { ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildMethodFrequency, type TeachingMethodLogRecord } from "@/lib/tracker";

type ClassProgressPageProps = {
  params: Promise<{
    classId: string;
  }>;
};

export default async function ClassProgressPage({ params }: ClassProgressPageProps) {
  const { classId } = await params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="rounded-3xl border border-warning/30 bg-warning/10 p-8 text-warning">
        Add your frontend environment variables before using class progress tracking.
      </section>
    );
  }

  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("id, course_name, subject_area, class_size, class_level, term_label, created_at, updated_at")
    .eq("id", classId)
    .single();

  if (classError || !classData) {
    notFound();
  }

  const classRecord = classData as ClassRecord;

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("class_id", classRecord.id)
    .order("assessment_date", { ascending: false });

  const { data: logRows } = await supabase
    .from("teaching_method_logs")
    .select(
      "id, assessment_id, weekly_analysis_id, recommendation_id, log_date, method_used, reflection_note, was_recommended, created_at",
    )
    .eq("class_id", classRecord.id)
    .order("log_date", { ascending: false })
    .order("created_at", { ascending: false });

  const assessmentHistory = (assessments ?? []).map((assessment) =>
    normalizeAssessmentRecord(assessment as Record<string, unknown>),
  ) as AssessmentRecord[];
  const methodLogHistory = (logRows ?? []) as TeachingMethodLogRecord[];
  const latestAssessment = assessmentHistory[0] ?? null;
  const latestAnalysis = latestAssessment ? analyzeAssessment(latestAssessment) : null;
  const trendPoints = buildTrendPoints(assessmentHistory);
  const methodFrequency = buildMethodFrequency(methodLogHistory).slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="section-kicker">Longitudinal progress</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {classRecord.course_name}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Review the running assessment trend alongside the teaching methods you used so the
              weekly loop stays visible over time.
            </p>
          </div>
          <Link
            href={`/dashboard/classes/${classRecord.id}`}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600"
          >
            Back to class
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-secondary-700 dark:text-secondary-300">
            Assessments
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {assessmentHistory.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Recorded checkpoints for this class.
          </p>
        </article>
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-secondary-700 dark:text-secondary-300">
            Method logs
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {methodLogHistory.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Logged instructional adjustments over time.
          </p>
        </article>
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-secondary-700 dark:text-secondary-300">
            Latest method
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {methodLogHistory[0]?.method_used ?? "Not logged yet"}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            {methodLogHistory[0]?.log_date ?? "Log the next method to start the cycle history."}
          </p>
        </article>
      </div>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Understanding trend
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Assessment dates and average scores provide the longitudinal baseline for progress.
        </p>
        <div className="mt-6">
          <AnalyticsCharts
            analysis={
              latestAnalysis ?? {
                averageScore: null,
                averageConfidence: null,
                participationRate: null,
                understandingBands: [],
                confidenceMismatch: false,
                detectedPatterns: [],
              }
            }
            trendPoints={trendPoints}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Most used teaching methods
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            A quick frequency view of the strategies you have actually logged for this class.
          </p>

          {methodFrequency.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                No teaching logs yet
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Log a method from the recommendation panel to populate this progress view.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {methodFrequency.map((item) => (
                <div
                  key={item.method}
                  className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {item.method}
                  </span>
                  <span>{item.count} logged</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Methods used over time
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Keep a lightweight running record of the adjustments you used after each assessment
            cycle.
          </p>

          {methodLogHistory.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                No logged methods yet
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Return to the class page and log the teaching method you plan to use next.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {methodLogHistory.map((log) => (
                <article
                  key={log.id}
                  className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {log.method_used}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {log.log_date}
                      </p>
                      {log.assessment_id ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-secondary-700 dark:text-secondary-300">
                          Linked assessment
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                      {log.was_recommended ? "Recommended method" : "Teacher selected"}
                    </div>
                  </div>
                  {log.reflection_note ? (
                    <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                      {log.reflection_note}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </section>
  );
}
