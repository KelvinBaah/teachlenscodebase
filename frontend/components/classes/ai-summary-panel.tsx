"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { AssessmentAnalysis } from "@/lib/analytics";
import {
  buildFallbackAiSummary,
  type AiSummaryRecommendation,
  type AiSummaryResult,
} from "@/lib/ai-summary";

type AiSummaryPanelProps = {
  className: string;
  assessmentTitle: string | null;
  analysisDate: string | null;
  analysis: AssessmentAnalysis | null;
  recommendations: AiSummaryRecommendation[];
};

type RequestStatus = "idle" | "loading" | "success" | "error";

const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export function AiSummaryPanel({
  className,
  assessmentTitle,
  analysisDate,
  analysis,
  recommendations,
}: AiSummaryPanelProps) {
  const fallback = useMemo(
    () =>
      buildFallbackAiSummary({
        analysis: analysis ?? {
          averageScore: null,
          averageConfidence: null,
          participationRate: null,
          understandingBands: [],
          confidenceMismatch: false,
          detectedPatterns: [],
        },
        recommendations,
      }),
    [analysis, recommendations],
  );
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [result, setResult] = useState<AiSummaryResult>(fallback);

  const loadSummary = useCallback(async () => {
    if (!analysis) {
      setResult(fallback);
      setStatus("error");
      return;
    }

    if (!backendApiUrl) {
      setResult({
        ...fallback,
        error: "Set NEXT_PUBLIC_BACKEND_API_URL to enable live AI summaries.",
      });
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${backendApiUrl}/ai/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_name: className,
          assessment_title: assessmentTitle,
          analysis_date: analysisDate,
          average_score: analysis.averageScore,
          average_confidence: analysis.averageConfidence,
          participation_rate: analysis.participationRate,
          understanding_bands: analysis.understandingBands,
          confidence_mismatch: analysis.confidenceMismatch,
          detected_patterns: analysis.detectedPatterns,
          recommendations: recommendations.map((recommendation) => ({
            method_name: recommendation.method_name,
            why_recommended: recommendation.why_recommended ?? recommendation.reason ?? null,
            reason: recommendation.reason ?? null,
            implementation_note: recommendation.implementation_note,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("AI summary request failed.");
      }

      const data = (await response.json()) as AiSummaryResult;
      setResult(data);
      setStatus(data.source === "openai" ? "success" : "error");
    } catch {
      setResult({
        ...fallback,
        error: "AI summary is unavailable right now, so TeachLens is showing a local fallback.",
      });
      setStatus("error");
    }
  }, [analysis, analysisDate, assessmentTitle, className, fallback, recommendations]);

  useEffect(() => {
    if (!analysis) {
      return;
    }

    void loadSummary();
  }, [analysis, loadSummary]);

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">AI summary</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Teacher-facing explanation layer
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            This optional panel explains the current analysis and rule-based methods in plain
            language. It never selects recommendations by itself.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSummary()}
          disabled={!analysis || status === "loading"}
          className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600"
        >
          {status === "loading" ? "Loading..." : "Retry summary"}
        </button>
      </div>

      {!analysis ? (
        <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No analysis yet
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Add an assessment first so TeachLens has grounded analytics to summarize.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {status === "loading" ? (
            <div className="rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-700 dark:border-secondary-900/50 dark:bg-secondary-900/20 dark:text-secondary-200">
              Generating the teacher-facing summary for this assessment.
            </div>
          ) : null}

          <article className="rounded-3xl bg-neutral-50 p-5 dark:bg-neutral-950">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
                Class understanding
              </p>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
                {result.source === "openai"
                  ? `OpenAI ${result.model ?? ""}`.trim()
                  : "Local fallback"}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
              {result.understanding_summary}
            </p>
          </article>

          <article className="rounded-3xl bg-neutral-50 p-5 dark:bg-neutral-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
              Why these methods
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
              {result.recommendation_explanation}
            </p>
          </article>

          {result.error ? (
            <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              {result.error}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
