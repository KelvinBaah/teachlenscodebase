"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-6">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/30">
        <p className="section-kicker text-red-700 dark:text-red-300">Dashboard error</p>
        <h1 className="mt-3 text-2xl font-semibold text-red-900 dark:text-red-100">
          TeachLens could not load this workspace
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-red-700 dark:text-red-200">
          {error.message || "Try reloading the page. If the issue continues, sign in again and retry."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-full bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
