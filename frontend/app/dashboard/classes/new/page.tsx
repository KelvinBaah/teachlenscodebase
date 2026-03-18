import { ClassForm } from "@/components/classes/class-form";

export default function NewClassPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">New Class</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Create a class profile
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Start with simple course details only. The class profile will anchor assessments,
          analytics, recommendations, and teaching method logs in later sessions.
        </p>
      </div>

      <ClassForm mode="create" />
    </section>
  );
}
