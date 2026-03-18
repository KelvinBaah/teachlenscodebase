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
          scoreDistribution: [],
          understandingBands: [],
          conceptMetrics: [],
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
          understanding_bands: analysis.understandingBands,
          concept_summary: analysis.conceptMetrics,
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
    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">AI Summary Layer</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This optional panel explains the current analysis and rule-based methods in teacher
            language. It never selects recommendations by itself.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSummary()}
          disabled={!analysis || status === "loading"}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Loading..." : "Retry Summary"}
        </button>
      </div>

      {!analysis ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
          <p className="text-lg font-semibold text-ink">No analysis yet</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add an assessment first so TeachLens has grounded analytics to summarize.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <article className="rounded-[24px] bg-slate-50/70 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">
                Class understanding
              </p>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                {result.source === "openai"
                  ? `OpenAI ${result.model ?? ""}`.trim()
                  : "Local fallback"}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {result.understanding_summary}
            </p>
          </article>

          <article className="rounded-[24px] bg-slate-50/70 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">
              Why these methods
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {result.recommendation_explanation}
            </p>
          </article>

          {result.error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {result.error}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
