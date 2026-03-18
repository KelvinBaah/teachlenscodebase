"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";

import {
  createAssessmentAction,
  type AssessmentActionState,
} from "@/app/dashboard/classes/[classId]/assessment-actions";
import { assessmentTypeOptions } from "@/lib/assessments";

import { SubmitButton } from "./submit-button";

type AssessmentFormProps = {
  classId: string;
};

const initialState: AssessmentActionState = {};

export function AssessmentForm({ classId }: AssessmentFormProps) {
  const [inputMethod, setInputMethod] = useState<"manual" | "csv">("manual");
  const action = useMemo(() => createAssessmentAction.bind(null, classId), [classId]);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">Add Weekly Assessment</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use manual entry for quick summaries or upload a narrow CSV for concept mastery or
            distribution data.
          </p>
        </div>

        <div className="inline-flex rounded-full bg-mist p-1 text-sm">
          <button
            type="button"
            onClick={() => setInputMethod("manual")}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              inputMethod === "manual" ? "bg-white text-pine shadow-sm" : "text-slate-600"
            }`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => setInputMethod("csv")}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              inputMethod === "csv" ? "bg-white text-pine shadow-sm" : "text-slate-600"
            }`}
          >
            CSV Upload
          </button>
        </div>
      </div>

      <input type="hidden" name="inputMethod" value={inputMethod} />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="title">
            Assessment Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Week 3 concept test"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="assessmentDate">
            Assessment Date
          </label>
          <input
            id="assessmentDate"
            name="assessmentDate"
            type="date"
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="assessmentType">
            Assessment Type
          </label>
          <select
            id="assessmentType"
            name="assessmentType"
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            defaultValue="quiz"
          >
            {assessmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="topic">
            Topic or Concept
          </label>
          <input
            id="topic"
            name="topic"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Cell respiration"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="averageScore">
            Average Score
          </label>
          <input
            id="averageScore"
            name="averageScore"
            inputMode="decimal"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="76"
          />
        </div>
      </div>

      {inputMethod === "manual" ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="scoreSummaryText">
              Distribution Summary
            </label>
            <textarea
              id="scoreSummaryText"
              name="scoreSummaryText"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
              placeholder={"low: 8\nmedium: 14\nhigh: 10"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="conceptSummaryText">
              Concept Mastery
            </label>
            <textarea
              id="conceptSummaryText"
              name="conceptSummaryText"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
              placeholder={"photosynthesis: 82\ncellular respiration: 69"}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="rawCsv">
              CSV File
            </label>
            <input
              id="rawCsv"
              name="rawCsv"
              type="file"
              accept=".csv,text/csv"
              className="block w-full text-sm text-slate-700"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-ink">Concept mastery CSV</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs leading-5">
concept,mastery_value
photosynthesis,82
cellular respiration,69
              </pre>
            </div>
            <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-ink">Distribution CSV</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs leading-5">
band,count
low,8
medium,14
high,10
              </pre>
            </div>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            CSV uploads are stored as temporary raw files for the configured retention window and
            should never include student names or identifiers.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="confidenceSummary">
            Confidence Summary
          </label>
          <textarea
            id="confidenceSummary"
            name="confidenceSummary"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Most students felt confident, but several still hesitated on transfer questions."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="teacherNote">
            Teacher Note
          </label>
          <textarea
            id="teacherNote"
            name="teacherNote"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="Students discussed misconceptions around ATP use during peer checks."
          />
        </div>
      </div>

      {state.error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </div>
      ) : null}

      <div className="mt-6">
        <SubmitButton idleLabel="Save Assessment" pendingLabel="Saving..." />
      </div>
    </form>
  );
}
