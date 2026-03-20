import { ClassForm } from "@/components/classes/class-form";

export default function NewClassPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="section-kicker">New class</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Create a class profile
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Start with simple course details only. The class profile will anchor assessments,
          analytics, recommendations, and teaching method logs in later sessions.
        </p>
      </div>

      <ClassForm mode="create" />
    </section>
  );
}
