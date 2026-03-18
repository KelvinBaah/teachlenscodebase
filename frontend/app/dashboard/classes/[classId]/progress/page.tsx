import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalyticsCharts } from "@/components/classes/analytics-charts";
import type { AssessmentRecord } from "@/lib/assessments";
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
      <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-8 text-amber-900">
        Add your Supabase frontend environment variables before using class progress tracking.
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
    .select(
      "id, title, assessment_date, assessment_type, topic, average_score, score_summary, concept_summary, teacher_note, confidence_summary, raw_file_path, raw_upload_expires_at, retention_category, expires_at, created_at",
    )
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

  const assessmentHistory = (assessments ?? []) as AssessmentRecord[];
  const methodLogHistory = (logRows ?? []) as TeachingMethodLogRecord[];
  const latestAssessment = assessmentHistory[0] ?? null;
  const latestAnalysis = latestAssessment ? analyzeAssessment(latestAssessment) : null;
  const trendPoints = buildTrendPoints(assessmentHistory);
  const methodFrequency = buildMethodFrequency(methodLogHistory).slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
              Longitudinal Progress
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {classRecord.course_name}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Review the running assessment trend alongside the teaching methods you used so the
              weekly loop stays visible over time.
            </p>
          </div>
          <Link
            href={`/dashboard/classes/${classRecord.id}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Back to Class
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">Assessments</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{assessmentHistory.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Recorded checkpoints for this class.
          </p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">Method Logs</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{methodLogHistory.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Logged instructional adjustments over time.
          </p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">Latest Method</p>
          <p className="mt-3 text-xl font-semibold text-ink">
            {methodLogHistory[0]?.method_used ?? "Not logged yet"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {methodLogHistory[0]?.log_date ?? "Log the next method to start the cycle history."}
          </p>
        </article>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-ink">Understanding Trend</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Assessment dates and average scores provide the longitudinal baseline for progress.
        </p>
        <div className="mt-6">
          <AnalyticsCharts
            analysis={
              latestAnalysis ?? {
                averageScore: null,
                scoreDistribution: [],
                understandingBands: [],
                conceptMetrics: [],
                confidenceMismatch: false,
                detectedPatterns: [],
              }
            }
            trendPoints={trendPoints}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-ink">Most Used Teaching Methods</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A quick frequency view of the strategies you have actually logged for this class.
          </p>

          {methodFrequency.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
              <p className="text-lg font-semibold text-ink">No teaching logs yet</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Log a method from the recommendation panel to populate this progress view.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {methodFrequency.map((item) => (
                <div
                  key={item.method}
                  className="flex items-center justify-between rounded-2xl bg-slate-50/70 px-4 py-3 text-sm text-slate-600"
                >
                  <span className="font-medium text-ink">{item.method}</span>
                  <span>{item.count} logged</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-ink">Methods Used Over Time</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep a lightweight running record of the adjustments you used after each assessment
            cycle.
          </p>

          {methodLogHistory.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
              <p className="text-lg font-semibold text-ink">No logged methods yet</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Return to the class page and log the teaching method you plan to use next.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {methodLogHistory.map((log) => (
                <article
                  key={log.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-ink">{log.method_used}</p>
                      <p className="mt-1 text-sm text-slate-600">{log.log_date}</p>
                    </div>
                    <div className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      {log.was_recommended ? "Recommended method" : "Teacher selected"}
                    </div>
                  </div>
                  {log.reflection_note ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">{log.reflection_note}</p>
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
