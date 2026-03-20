"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/lib/analytics";

type AssessmentTrendChartProps = {
  trendPoints: TrendPoint[];
};

export function AssessmentTrendChart({ trendPoints }: AssessmentTrendChartProps) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="section-kicker">Analytics</p>
      <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Assessment trend over time
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        Track how average class performance changes across saved assessments.
      </p>

      <div className="mt-6 h-80">
        {trendPoints.length < 2 ? (
          <div className="flex h-full items-center justify-center rounded-3xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
            Add at least two assessments with average scores to see a trend.
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
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </article>
  );
}
