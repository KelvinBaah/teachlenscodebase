"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import {
  createClassAction,
  type ClassActionState,
  updateClassAction,
} from "@/app/dashboard/classes/actions";
import { emptyClassValues, type ClassFormValues } from "@/lib/classes";

import { SubmitButton } from "./submit-button";

type ClassFormProps = {
  mode: "create" | "edit";
  classId?: string;
  initialValues?: ClassFormValues;
};

const initialState: ClassActionState = {};

export function ClassForm({ mode, classId, initialValues = emptyClassValues }: ClassFormProps) {
  const action = mode === "create" ? createClassAction : updateClassAction;
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-sm"
    >
      {mode === "edit" ? <input type="hidden" name="classId" value={classId} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="courseName">
            Course Name
          </label>
          <input
            id="courseName"
            name="courseName"
            required
            defaultValue={initialValues.courseName}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Biology 101"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="subjectArea">
            Subject Area
          </label>
          <input
            id="subjectArea"
            name="subjectArea"
            required
            defaultValue={initialValues.subjectArea}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Biology"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="classLevel">
            Class Level
          </label>
          <input
            id="classLevel"
            name="classLevel"
            required
            defaultValue={initialValues.classLevel}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Undergraduate Intro"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="classSize">
            Class Size
          </label>
          <input
            id="classSize"
            name="classSize"
            required
            min={1}
            step={1}
            inputMode="numeric"
            defaultValue={initialValues.classSize}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="termLabel">
            Term Label
          </label>
          <input
            id="termLabel"
            name="termLabel"
            defaultValue={initialValues.termLabel}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Fall 2026"
          />
        </div>
      </div>

      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton
          idleLabel={mode === "create" ? "Create Class" : "Save Changes"}
          pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
        />
        <Link
          href={mode === "edit" && classId ? `/dashboard/classes/${classId}` : "/dashboard/classes"}
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
