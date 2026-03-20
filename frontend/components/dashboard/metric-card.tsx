type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  trend: string;
  accent: "primary" | "secondary" | "neutral";
};

const accentStyles = {
  primary:
    "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200",
  secondary:
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-200",
  neutral:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
} as const;

export function MetricCard({ label, value, detail, trend, accent }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accentStyles[accent]}`}
        >
          {trend}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{detail}</p>
    </article>
  );
}
