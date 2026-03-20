export default function ClassDetailLoading() {
  return (
    <section className="space-y-6 py-6">
      <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        <div className="h-3 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 h-9 w-72 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Loading class data, saved assessments, and teaching history.
        </p>
      </article>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[34rem] rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
        <div className="h-[34rem] rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="h-80 rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
        <div className="h-80 rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
      </div>
      <div className="h-96 rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900" />
    </section>
  );
}
