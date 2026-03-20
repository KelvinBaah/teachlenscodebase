import Link from "next/link";

import { DashboardVisualizations } from "@/components/dashboard/dashboard-visualizations";
import { MetricCard } from "@/components/dashboard/metric-card";
import { QuickAssessmentWorkflow } from "@/components/dashboard/quick-assessment-workflow";
import { analyzeAssessment, buildTrendPoints } from "@/lib/analytics";
import { normalizeAssessmentRecord } from "@/lib/assessments";
import type { ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TeachingMethodLogRecord } from "@/lib/tracker";

type RecommendationSummary = {
  id: string;
  class_id: string | null;
  assessment_id: string | null;
  method_name: string;
  reason: string | null;
  created_at: string;
};

function formatPercent(value: number | null) {
  return value === null ? "--" : `${Math.round(value)}%`;
}

function formatConfidence(value: number | null) {
  return value === null ? "--" : `${value.toFixed(1)}/5`;
}

function average(numbers: number[]) {
  if (numbers.length === 0) {
    return null;
  }

  return numbers.reduce((total, value) => total + value, 0) / numbers.length;
}

function buildTrendLabel(current: number | null, previous: number | null, suffix: string) {
  if (current === null || previous === null) {
    return `No ${suffix} trend yet`;
  }

  const delta = current - previous;
  if (delta === 0) {
    return `Stable ${suffix}`;
  }

  const direction = delta > 0 ? "+" : "";
  return `${direction}${delta.toFixed(1)} ${suffix}`;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="rounded-3xl border border-warning/30 bg-warning/10 p-6 text-warning">
        Add your frontend environment variables before loading the dashboard.
      </section>
    );
  }

  const [
    classCountResult,
    assessmentCountResult,
    classRowsResult,
    assessmentRowsResult,
    methodLogsResult,
    recommendationsResult,
  ] = await Promise.all([
    supabase.from("classes").select("id", { count: "exact", head: true }),
    supabase.from("assessments").select("id", { count: "exact", head: true }),
    supabase
      .from("classes")
      .select("id, course_name, subject_area, class_size, class_level, term_label, created_at, updated_at")
      .order("updated_at", { ascending: false }),
    supabase.from("assessments").select("*").order("assessment_date", { ascending: false }).limit(8),
    supabase
      .from("teaching_method_logs")
      .select(
        "id, class_id, assessment_id, weekly_analysis_id, recommendation_id, log_date, method_used, reflection_note, was_recommended, created_at",
      )
      .order("log_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("recommendations")
      .select("id, class_id, assessment_id, method_name, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const classes = (classRowsResult.data ?? []) as ClassRecord[];
  const assessments = (assessmentRowsResult.data ?? []).map((record) =>
    normalizeAssessmentRecord(record as Record<string, unknown>),
  );
  const methodLogs = (methodLogsResult.data ?? []) as TeachingMethodLogRecord[];
  const recommendations = (recommendationsResult.data ?? []) as RecommendationSummary[];
  const classMap = new Map(classes.map((item) => [item.id, item]));

  const latestAssessment = assessments[0] ?? null;
  const previousAssessment = assessments[1] ?? null;
  const latestAnalysis = latestAssessment ? analyzeAssessment(latestAssessment) : null;
  const trendPoints = buildTrendPoints(assessments).map((point) => ({
    date: point.date,
    averageScore: point.averageScore,
  }));

  const averageScore = average(
    assessments
      .map((assessment) => assessment.average_score)
      .filter((value): value is number => value !== null),
  );
  const averageParticipation = average(
    assessments
      .map((assessment) => assessment.participation_rate)
      .filter((value): value is number => value !== null),
  );
  const averageConfidence = average(
    assessments
      .map((assessment) => assessment.average_confidence)
      .filter((value): value is number => value !== null),
  );

  const signalPoints = [
    averageScore !== null ? { label: "Average score", value: Number(averageScore.toFixed(1)) } : null,
    averageParticipation !== null
      ? { label: "Participation", value: Number(averageParticipation.toFixed(1)) }
      : null,
    averageConfidence !== null
      ? { label: "Confidence", value: Number(((averageConfidence / 5) * 100).toFixed(1)) }
      : null,
  ].filter((item): item is { label: string; value: number } => item !== null);

  const assessmentTypeCounts = assessments.reduce<Record<string, number>>((accumulator, assessment) => {
    accumulator[assessment.assessment_type] = (accumulator[assessment.assessment_type] ?? 0) + 1;
    return accumulator;
  }, {});

  const distributionPoints = Object.entries(assessmentTypeCounts).map(([label, value]) => ({
    label: label.replaceAll("_", " "),
    value,
  }));

  const quickEntryHref = classes[0] ? `/dashboard/classes/${classes[0].id}` : "/dashboard/classes/new";
  const quickEntryLabel = classes[0] ? classes[0].course_name : "Create a class first";

  return (
    <section className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="section-kicker">Teacher workflow</p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100 md:text-4xl">
              Sign in, create a class, open it, add an assessment, and review results.
            </h1>
            <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
              This is the real protected app experience. Start with the class list below, then
              move into a class workspace to enter an assessment and see analytics,
              recommendations, AI explanation, and the teaching timeline.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/classes/new"
              className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Create class
            </Link>
            <Link
              href={quickEntryHref}
              className="inline-flex items-center rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm font-semibold text-secondary-700 transition hover:border-secondary-300 hover:bg-secondary-100 dark:border-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-200 dark:hover:border-secondary-700 dark:hover:bg-secondary-900/50"
            >
              {classes[0] ? "Open latest class" : "Start with class setup"}
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Classes</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Your class list
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Open a class to access the assessment form, analytics, recommendations, AI summary,
              and teaching method timeline.
            </p>
          </div>
          <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            {classCountResult.count ?? 0} class{(classCountResult.count ?? 0) === 1 ? "" : "es"}
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              No classes yet
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Create your first class to begin the TeachLens workflow.
            </p>
            <Link
              href="/dashboard/classes/new"
              className="mt-5 inline-flex rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Create first class
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((classRecord) => (
              <article
                key={classRecord.id}
                className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
                  {classRecord.subject_area}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {classRecord.course_name}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <p>Level: {classRecord.class_level}</p>
                  <p>Size: {classRecord.class_size}</p>
                  <p>Term: {classRecord.term_label || "Not set yet"}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/classes/${classRecord.id}`}
                    className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    Open class
                  </Link>
                  <Link
                    href={`/classes/${classRecord.id}`}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600"
                  >
                    Direct route
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {classes.length > 0 ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Average Score"
              value={averageScore === null ? "--" : `${averageScore.toFixed(1)}%`}
              detail="Average across recent class-level assessment summaries."
              trend={buildTrendLabel(
                latestAssessment?.average_score ?? null,
                previousAssessment?.average_score ?? null,
                "pts",
              )}
              accent="primary"
            />
            <MetricCard
              label="Participation Rate"
              value={formatPercent(averageParticipation)}
              detail="Completion rate across recent assessment entries."
              trend={buildTrendLabel(
                latestAssessment?.participation_rate ?? null,
                previousAssessment?.participation_rate ?? null,
                "pts",
              )}
              accent="secondary"
            />
            <MetricCard
              label="Confidence Level"
              value={formatConfidence(averageConfidence)}
              detail="Student self-reported confidence on the current 1 to 5 scale."
              trend={buildTrendLabel(
                latestAssessment?.average_confidence ?? null,
                previousAssessment?.average_confidence ?? null,
                "pts",
              )}
              accent="neutral"
            />
          </section>

          <DashboardVisualizations
            trendPoints={trendPoints}
            signalPoints={signalPoints}
            distributionPoints={distributionPoints}
          />

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">Recent activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                    Assessments and teaching logs
                  </h2>
                </div>
                <Link
                  href="/dashboard/classes"
                  className="text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                >
                  View all classes
                </Link>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Recent assessments
                  </p>
                  {assessments.length === 0 ? (
                    <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                      No assessments yet.
                    </div>
                  ) : (
                    assessments.slice(0, 4).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                      >
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {assessment.title}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {assessment.assessment_date} | {assessment.assessment_type.replaceAll("_", " ")}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Latest methods logged
                  </p>
                  {methodLogs.length === 0 ? (
                    <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                      No teaching logs yet.
                    </div>
                  ) : (
                    methodLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                      >
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {log.method_used}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {log.log_date}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">Recommendation signals</p>
                  <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                    Current teaching insights
                  </h2>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {assessmentCountResult.count ?? 0} assessments
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Student understanding signals
                  </p>
                  <div className="mt-3 space-y-2">
                    {(latestAnalysis?.detectedPatterns ?? []).length > 0 ? (
                      latestAnalysis?.detectedPatterns.map((pattern) => (
                        <p
                          key={pattern}
                          className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                          {pattern}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        Add an assessment to surface the first set of class-level understanding
                        signals.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Recent recommendation activity
                  </p>
                  <div className="mt-3 space-y-3">
                    {recommendations.length === 0 ? (
                      <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        Recommendations will appear here after you save assessment summaries.
                      </p>
                    ) : (
                      recommendations.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {item.method_name}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                            {item.reason ?? "Rule-based recommendation generated from recent signals."}
                          </p>
                          {item.class_id && classMap.get(item.class_id) ? (
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-secondary-700 dark:text-secondary-300">
                              {classMap.get(item.class_id)?.course_name}
                            </p>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </article>
          </section>

          <QuickAssessmentWorkflow href={quickEntryHref} targetLabel={quickEntryLabel} />
        </>
      ) : null}
    </section>
  );
}
