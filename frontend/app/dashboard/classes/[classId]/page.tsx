import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalyticsCharts } from "@/components/classes/analytics-charts";
import { AssessmentForm } from "@/components/classes/assessment-form";
import { DeleteClassButton } from "@/components/classes/delete-class-button";
import { RecommendationPanel } from "@/components/classes/recommendation-panel";
import type { AssessmentRecord } from "@/lib/assessments";
import { analyzeAssessment, buildTrendPoints } from "@/lib/analytics";
import type { ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { deleteClassAction } from "../actions";

type ClassDetailPageProps = {
  params: {
    classId: string;
  };
};

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-8 text-amber-900">
        Add your Supabase frontend environment variables before using class profiles.
      </section>
    );
  }

  const { data, error } = await supabase
    .from("classes")
    .select("id, course_name, subject_area, class_size, class_level, term_label, created_at, updated_at")
    .eq("id", params.classId)
    .single();

  if (error || !data) {
    notFound();
  }

  const classRecord = data as ClassRecord;

  const { data: assessments } = await supabase
    .from("assessments")
    .select(
      "id, title, assessment_date, assessment_type, topic, average_score, score_summary, concept_summary, teacher_note, confidence_summary, raw_file_path, expires_at, created_at",
    )
    .eq("class_id", classRecord.id)
    .order("assessment_date", { ascending: false });

  const assessmentHistory = (assessments ?? []) as AssessmentRecord[];
  const latestAssessment = assessmentHistory[0] ?? null;
  const latestAnalysis = latestAssessment ? analyzeAssessment(latestAssessment) : null;
  const trendPoints = buildTrendPoints(assessmentHistory);
  const { data: latestRecommendations } =
    latestAssessment
      ? await supabase
          .from("recommendations")
          .select("id, method_name, reason, implementation_note")
          .eq("assessment_id", latestAssessment.id)
          .order("created_at", { ascending: true })
      : { data: [] };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
              Class Detail
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {classRecord.course_name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {classRecord.subject_area} | {classRecord.class_level} | {classRecord.class_size}{" "}
              learners
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dashboard/classes/${classRecord.id}/edit`}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Edit Class
            </Link>
            <form action={deleteClassAction}>
              <input type="hidden" name="classId" value={classRecord.id} />
              <DeleteClassButton />
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-ink">Profile Summary</h3>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between gap-4">
              <dt>Subject area</dt>
              <dd>{classRecord.subject_area}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Class level</dt>
              <dd>{classRecord.class_level}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Class size</dt>
              <dd>{classRecord.class_size}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Term</dt>
              <dd>{classRecord.term_label || "Not set yet"}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-ink">Assessment Workflow</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Add weekly formative assessments with manual summaries or a narrow CSV upload. All
            entries stay class-level or concept-level only.
          </p>
        </article>
      </div>

      <AssessmentForm classId={classRecord.id} />

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[28px] bg-ink p-6 text-white shadow-[0_20px_60px_rgba(16,33,43,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            Current Understanding Snapshot
          </p>

          {latestAnalysis ? (
            <div className="mt-4 space-y-5">
              <div className="flex items-end gap-3">
                <div className="text-5xl font-semibold">
                  {latestAnalysis.averageScore ?? "--"}
                </div>
                <div className="pb-1 text-sm text-white/70">average score</div>
              </div>

              <div className="rounded-2xl bg-white/8 p-4">
                <p className="text-sm text-white/70">Detected patterns</p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-white/85">
                  {latestAnalysis.detectedPatterns.length > 0 ? (
                    latestAnalysis.detectedPatterns.map((pattern) => (
                      <p key={pattern}>{pattern}</p>
                    ))
                  ) : (
                    <p>No strong pattern detected yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white/8 p-4">
                <p className="text-sm text-white/70">Confidence mismatch</p>
                <p className="mt-2 text-base font-medium text-white">
                  {latestAnalysis.confidenceMismatch
                    ? "Possible mismatch between confidence and performance"
                    : "No confidence-performance mismatch flagged"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-white/8 p-4 text-sm leading-6 text-white/80">
              Add an assessment to generate the first current-understanding snapshot.
            </div>
          )}
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-ink">Analytics Overview</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These descriptive charts stay transparent and teacher-friendly. They summarize what the
            current data suggests without using machine learning.
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
        </article>
      </section>

      <RecommendationPanel
        latestAssessmentTitle={latestAssessment?.title ?? null}
        recommendations={(latestRecommendations ?? []) as {
          id: string;
          method_name: string;
          reason: string | null;
          implementation_note: string | null;
        }[]}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-ink">Assessment History</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review the weekly evidence attached to this class before the analytics and
              recommendation sessions build on top of it.
            </p>
          </div>
          <div className="rounded-full bg-mist px-4 py-2 text-sm text-pine">
            {assessmentHistory.length} recorded
          </div>
        </div>

        {assessmentHistory.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
            <p className="text-lg font-semibold text-ink">No assessments yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add your first weekly assessment above to start building class-level evidence over
              time.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {assessmentHistory.map((assessment) => (
              <article
                key={assessment.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">
                      {assessment.assessment_type}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-ink">{assessment.title}</h4>
                    <p className="mt-2 text-sm text-slate-600">
                      {assessment.assessment_date}
                      {assessment.topic ? ` | ${assessment.topic}` : ""}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600">
                    Avg score: {assessment.average_score ?? "Not entered"}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p className="font-semibold text-ink">Distribution Summary</p>
                    <p className="mt-2 leading-6">
                      {assessment.score_summary
                        ? Object.entries(assessment.score_summary)
                            .map(([label, value]) => `${label}: ${value}`)
                            .join(", ")
                        : "No distribution summary entered."}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p className="font-semibold text-ink">Concept Mastery</p>
                    <p className="mt-2 leading-6">
                      {assessment.concept_summary
                        ? Object.entries(assessment.concept_summary)
                            .map(([label, value]) => `${label}: ${value}`)
                            .join(", ")
                        : "No concept mastery summary entered."}
                    </p>
                  </div>
                </div>

                {(assessment.teacher_note || assessment.confidence_summary) ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                      <p className="font-semibold text-ink">Teacher Note</p>
                      <p className="mt-2 leading-6">
                        {assessment.teacher_note || "No teacher note entered."}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                      <p className="font-semibold text-ink">Confidence Summary</p>
                      <p className="mt-2 leading-6">
                        {assessment.confidence_summary || "No confidence summary entered."}
                      </p>
                    </div>
                  </div>
                ) : null}

                {assessment.raw_file_path ? (
                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Raw CSV stored at <span className="font-mono">{assessment.raw_file_path}</span>
                    {assessment.expires_at ? ` until ${assessment.expires_at}` : ""}.
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
