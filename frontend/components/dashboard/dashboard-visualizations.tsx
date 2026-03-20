"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = {
  date: string;
  averageScore: number;
};

type SignalPoint = {
  label: string;
  value: number;
};

type DistributionPoint = {
  label: string;
  value: number;
};

type DashboardVisualizationsProps = {
  trendPoints: TrendPoint[];
  signalPoints: SignalPoint[];
  distributionPoints: DistributionPoint[];
};

const chartColors = ["#2563eb", "#14b8a6", "#f59e0b", "#38bdf8"];

export function DashboardVisualizations({
  trendPoints,
  signalPoints,
  distributionPoints,
}: DashboardVisualizationsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
              Score trend
            </p>
            <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Average performance across recent assessments
            </h3>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Based on recent class-level summary entries
          </p>
        </div>
        <div className="mt-6 h-72">
          {trendPoints.length < 2 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              Add at least two assessments to populate the trend chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendPoints}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700 dark:text-secondary-300">
          Assessment mix
        </p>
        <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Recent entry distribution
        </h3>
        <div className="mt-6 h-72">
          {distributionPoints.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              Add assessments to see the recent mix.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionPoints}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {distributionPoints.map((entry, index) => (
                    <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
              Core signals
            </p>
            <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Score, participation, and confidence
            </h3>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Signals used by the current recommendation workflow
          </p>
        </div>
        <div className="mt-6 h-80">
          {signalPoints.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
              Add assessment summaries to populate the signal chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signalPoints}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {signalPoints.map((entry, index) => (
                    <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </section>
  );
}
