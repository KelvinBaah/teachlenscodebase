"use client";

import Link from "next/link";
import { useActionState } from "react";

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
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="paper-card space-y-6 p-8">
      {mode === "edit" ? <input type="hidden" name="classId" value={classId} /> : null}

      <div className="max-w-3xl">
        <p className="section-kicker">{mode === "create" ? "New Class" : "Edit Class"}</p>
        <h2 className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          {mode === "create"
            ? "Set up a lightweight class profile"
            : "Update the class profile"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Keep the profile simple and class-level only so the rest of the assessment workflow stays
          fast, privacy-safe, and easy to maintain.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="courseName">
            Course Name
          </label>
          <input
            id="courseName"
            name="courseName"
            required
            defaultValue={initialValues.courseName}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Biology 101"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="subjectArea">
            Subject Area
          </label>
          <input
            id="subjectArea"
            name="subjectArea"
            required
            defaultValue={initialValues.subjectArea}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Biology"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="classLevel">
            Class Level
          </label>
          <input
            id="classLevel"
            name="classLevel"
            required
            defaultValue={initialValues.classLevel}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Undergraduate Intro"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="classSize">
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
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="termLabel">
            Term Label
          </label>
          <input
            id="termLabel"
            name="termLabel"
            defaultValue={initialValues.termLabel}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
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
          className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-600"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
