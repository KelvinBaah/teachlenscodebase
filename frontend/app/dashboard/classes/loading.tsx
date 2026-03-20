export default function ClassesLoading() {
  return (
    <section className="space-y-6 py-6">
      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-3 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 h-8 w-60 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Loading your class list and workspace links.
        </p>
      </article>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-56 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="h-3 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 h-7 w-44 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded-full bg-neutral-100 dark:bg-neutral-900" />
              <div className="h-4 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-900" />
              <div className="h-4 w-2/3 rounded-full bg-neutral-100 dark:bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
