import { notFound } from "next/navigation";

import { ClassForm } from "@/components/classes/class-form";
import { valuesFromRecord, type ClassRecord } from "@/lib/classes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EditClassPageProps = {
  params: Promise<{
    classId: string;
  }>;
};

export default async function EditClassPage({ params }: EditClassPageProps) {
  const { classId } = await params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("classes")
    .select("id, course_name, subject_area, class_size, class_level, term_label")
    .eq("id", classId)
    .single();

  if (error || !data) {
    notFound();
  }

  const classRecord = data as ClassRecord;

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Edit Class</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Update {classRecord.course_name}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Keep the profile lightweight and class-level only so later assessment and recommendation
          workflows stay aligned with the MVP scope.
        </p>
      </div>

      <ClassForm
        mode="edit"
        classId={classRecord.id}
        initialValues={valuesFromRecord(classRecord)}
      />
    </section>
  );
}
