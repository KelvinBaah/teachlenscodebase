import Link from "next/link";
import { notFound } from "next/navigation";

import { AiSummaryPanel } from "@/components/classes/ai-summary-panel";
import { AssessmentForm } from "@/components/classes/assessment-form";
import { AssessmentSummarySelector } from "@/components/classes/assessment-summary-selector";
import { AssessmentTrendChart } from "@/components/classes/assessment-trend-chart";
import { DeleteClassButton } from "@/components/classes/delete-class-button";
import { RecommendationPanel } from "@/components/classes/recommendation-panel";
import { TeachingCycleSelector } from "@/components/classes/teaching-cycle-selector";
import {
  formatAssessmentTypeLabel,
  normalizeAssessmentRecord,
  type AssessmentRecord,
} from "@/lib/assessments";
import { analyzeAssessment, buildTrendPoints } from "@/lib/analytics";
import type { ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  RecommendationHistoryRecord,
  TeachingCycleTimelineEntry,
  TeachingMethodLogRecord,
} from "@/lib/tracker";

import { deleteClassAction } from "../actions";

type ClassDetailPageProps = {
  params: Promise<{
    classId: string;
  }>;
  searchParams?: Promise<{
    created?: string;
    assessment?: string;
    focus?: string;
  }>;
};

function buildTimelineEntries(
  assessments: AssessmentRecord[],
  recommendations: RecommendationHistoryRecord[],
  logs: TeachingMethodLogRecord[],
) {
  const recommendationsByAssessment = new Map<string, RecommendationHistoryRecord[]>();
  const logsByAssessment = new Map<string, TeachingMethodLogRecord[]>();

  for (const recommendation of recommendations) {
    if (!recommendation.assessment_id) {
      continue;
    }

    const existing = recommendationsByAssessment.get(recommendation.assessment_id) ?? [];
    existing.push(recommendation);
    recommendationsByAssessment.set(recommendation.assessment_id, existing);
  }

  for (const log of logs) {
    if (!log.assessment_id) {
      continue;
    }

    const existing = logsByAssessment.get(log.assessment_id) ?? [];
    existing.push(log);
    logsByAssessment.set(log.assessment_id, existing);
  }

  return assessments.map((assessment) => {
    const analysis = analyzeAssessment(assessment);

    return {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      assessmentDate: assessment.assessment_date,
      assessmentType: assessment.assessment_type,
      averageScore: assessment.average_score ?? null,
      detectedPatterns: analysis.detectedPatterns,
      recommendations: recommendationsByAssessment.get(assessment.id) ?? [],
      methodLogs: logsByAssessment.get(assessment.id) ?? [],
    } satisfies TeachingCycleTimelineEntry;
  });
}

export default async function ClassDetailPage({
  params,
  searchParams,
}: ClassDetailPageProps) {
  const { classId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="rounded-3xl border border-warning/30 bg-warning/10 p-8 text-warning">
        Add your frontend environment variables before using class profiles.
      </section>
    );
  }

  const { data, error } = await supabase
    .from("classes")
    .select("id, course_name, subject_area, class_size, class_level, term_label, created_at, updated_at")
    .eq("id", classId)
    .single();

  if (error || !data) {
    notFound();
  }

  const classRecord = data as ClassRecord;

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("class_id", classRecord.id)
    .order("assessment_date", { ascending: false });

  const assessmentHistory = (assessments ?? []).map((assessment) =>
    normalizeAssessmentRecord(assessment as Record<string, unknown>),
  ) as AssessmentRecord[];
  const selectedAssessment =
    assessmentHistory.find(
      (assessment) => assessment.id === resolvedSearchParams?.assessment,
    ) ??
    assessmentHistory[0] ??
    null;
  const latestAssessment = assessmentHistory[0] ?? null;
  const latestAnalysis = latestAssessment ? analyzeAssessment(latestAssessment) : null;
  const selectedAssessmentAnalysis = selectedAssessment
    ? analyzeAssessment(selectedAssessment)
    : null;
  const trendPoints = buildTrendPoints(assessmentHistory);

  const { data: recommendationRows } = await supabase
    .from("recommendations")
    .select("id, assessment_id, method_name, reason, implementation_note, created_at")
    .eq("class_id", classRecord.id)
    .order("created_at", { ascending: true });

  const { data: teachingMethodLogs } = await supabase
    .from("teaching_method_logs")
    .select(
      "id, assessment_id, weekly_analysis_id, recommendation_id, log_date, method_used, reflection_note, was_recommended, created_at",
    )
    .eq("class_id", classRecord.id)
    .order("log_date", { ascending: false })
    .order("created_at", { ascending: false });

  const recommendationHistory = (recommendationRows ?? []) as RecommendationHistoryRecord[];
  const selectedRecommendations = selectedAssessment
    ? recommendationHistory.filter(
        (recommendation) => recommendation.assessment_id === selectedAssessment.id,
      )
    : [];
  const methodLogHistory = (teachingMethodLogs ?? []) as TeachingMethodLogRecord[];
  const timelineEntries = buildTimelineEntries(
    assessmentHistory,
    recommendationHistory,
    methodLogHistory,
  );

  return (
    <section className="space-y-6">
      {resolvedSearchParams?.created === "1" ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Class created successfully. You can add the first assessment below.
        </div>
      ) : null}

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="section-kicker">Class workspace</p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100 md:text-4xl">
              {classRecord.course_name}
            </h1>
            <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
              Review class-level assessment inputs, analytics, recommendations, AI explanation,
              and the weekly teaching timeline in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dashboard/classes/${classRecord.id}/progress`}
              className="rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              View progress
            </Link>
            <Link
              href={`/dashboard/classes/${classRecord.id}/edit`}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600"
            >
              Edit class
            </Link>
            <form action={deleteClassAction}>
              <input type="hidden" name="classId" value={classRecord.id} />
              <DeleteClassButton />
            </form>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
              Subject
            </p>
            <p className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {classRecord.subject_area}
            </p>
          </article>
          <article className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
              Level
            </p>
            <p className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {classRecord.class_level}
            </p>
          </article>
          <article className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
              Class size
            </p>
            <p className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {classRecord.class_size}
            </p>
          </article>
          <article className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
              Term
            </p>
            <p className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {classRecord.term_label || "Not set"}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AssessmentForm classId={classRecord.id} />

        <article className="rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            What appears after you save
          </p>
          <h2 className="mt-4 text-2xl font-semibold">The full teaching review flow lives on this page.</h2>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/82">
              Analytics visualize score, confidence, participation, and trends.
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/82">
              Recommendations appear from the rule-based matrix tied to detected patterns.
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/82">
              The AI summary explains the analysis without replacing the recommendation logic.
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/82">
              The teaching cycle timeline tracks what you actually taught next.
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <AssessmentTrendChart trendPoints={trendPoints} />

        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Current snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Latest saved assessment
              </h2>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {latestAssessment ? latestAssessment.assessment_date : "No assessment yet"}
            </span>
          </div>

          {latestAnalysis ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Average score</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {latestAnalysis.averageScore ?? "--"}
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Detected pattern
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                  {latestAnalysis.detectedPatterns[0] ??
                    "No strong pattern detected for the latest assessment."}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                No analytics yet
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Save the first assessment above and this area will show the latest class snapshot.
              </p>
            </div>
          )}
        </article>
      </section>

      <RecommendationPanel
        classId={classRecord.id}
        assessmentId={selectedAssessment?.id ?? null}
        latestAssessmentTitle={selectedAssessment?.title ?? null}
        recommendations={selectedRecommendations}
        recommendationsAvailable={Boolean(selectedAssessment)}
      />

      <AiSummaryPanel
        className={classRecord.course_name}
        assessmentTitle={selectedAssessment?.title ?? null}
        analysisDate={selectedAssessment?.assessment_date ?? null}
        analysis={selectedAssessmentAnalysis}
        recommendations={selectedRecommendations}
      />

      <TeachingCycleSelector entries={timelineEntries} />

      <AssessmentSummarySelector assessments={assessmentHistory} />
    </section>
  );
}
