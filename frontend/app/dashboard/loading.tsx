function DashboardLoadingCard({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="h-3 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-4 h-7 w-52 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-neutral-100 dark:bg-neutral-900" />
      <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">{detail}</p>
      <p className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </p>
    </article>
  );
}

export default function DashboardLoading() {
  return (
    <section className="space-y-6 py-6">
      <DashboardLoadingCard
        title="Loading dashboard"
        detail="TeachLens is gathering your classes, recent assessments, and recommendation activity."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="h-3 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-5 h-10 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 h-4 w-full rounded-full bg-neutral-100 dark:bg-neutral-900" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-72 rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
        <div className="h-72 rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
      </div>
    </section>
  );
}
