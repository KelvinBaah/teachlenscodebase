"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AssessmentAnalysis, TrendPoint } from "@/lib/analytics";

type AnalyticsChartsProps = {
  analysis: AssessmentAnalysis;
  trendPoints: TrendPoint[];
};

const bandColors = ["#3b82f6", "#14b8a6", "#f59e0b"];

export function AnalyticsCharts({ analysis, trendPoints }: AnalyticsChartsProps) {
  const summarySignals = [
    { label: "Score", value: analysis.averageScore ?? 0 },
    {
      label: "Confidence",
      value:
        analysis.averageConfidence !== null
          ? Number(((analysis.averageConfidence / 5) * 100).toFixed(2))
          : 0,
    },
    { label: "Participation", value: analysis.participationRate ?? 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Summary signals
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          The latest class summary uses score, confidence, and participation only.
        </p>
        <div className="mt-6 h-64">
          {summarySignals.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              Add class summary values to see this chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summarySignals}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Understanding bands
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          A lightweight low, medium, high interpretation based on the average class score.
        </p>
        <div className="mt-6 h-64">
          {analysis.understandingBands.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              Add an average score to see this chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.understandingBands}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {analysis.understandingBands.map((band, index) => (
                    <Cell key={band.label} fill={bandColors[index] ?? "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Participation snapshot
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Participation and confidence provide quick context for how much weight to give the latest
          score.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-neutral-50 p-5 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Average confidence</p>
            <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              {analysis.averageConfidence !== null ? analysis.averageConfidence.toFixed(1) : "--"}
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              On a 1 to 5 class average scale.
            </p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-5 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Participation rate</p>
            <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              {analysis.participationRate !== null ? `${analysis.participationRate}%` : "--"}
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Percent of the class that completed it.
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Assessment trend over time
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          A simple average score trend so future weekly analyses have a longitudinal baseline.
        </p>
        <div className="mt-6 h-64">
          {trendPoints.length < 2 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              Add at least two assessments with average scores to see a trend line.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendPoints}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </div>
  );
}
