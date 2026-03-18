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

const bandColors = ["#b8693d", "#6f8d62", "#1f5c4a"];

export function AnalyticsCharts({ analysis, trendPoints }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">Score Distribution</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Current grouped distribution based on the latest assessment summary.
        </p>
        <div className="mt-6 h-64">
          {analysis.scoreDistribution.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
              Add a distribution summary to see this chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#1f5c4a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">Understanding Bands</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A simple low, medium, high interpretation of current class understanding.
        </p>
        <div className="mt-6 h-64">
          {analysis.understandingBands.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
              Add an average score or grouped distribution to see this chart.
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
                    <Cell key={band.label} fill={bandColors[index] ?? "#1f5c4a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">Concept Mastery</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Concept-level summary when concept mastery values are available.
        </p>
        <div className="mt-6 h-64">
          {analysis.conceptMetrics.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
              Add concept mastery values to see this chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.conceptMetrics} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="concept" width={120} />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 10, 10, 0]} fill="#b8693d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">Assessment Trend Over Time</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A simple average score trend so future weekly analyses have a longitudinal baseline.
        </p>
        <div className="mt-6 h-64">
          {trendPoints.length < 2 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
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
                  stroke="#1f5c4a"
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
