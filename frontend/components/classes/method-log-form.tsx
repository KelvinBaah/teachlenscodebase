"use client";

import { useActionState, useMemo } from "react";

import {
  createTeachingMethodLogAction,
  type TeachingMethodLogActionState,
} from "@/app/dashboard/classes/[classId]/log-actions";

import { SubmitButton } from "./submit-button";

type RecommendationOption = {
  id: string;
  method_name: string;
  implementation_note: string | null;
};

type MethodLogFormProps = {
  classId: string;
  assessmentId: string | null;
  recommendations: RecommendationOption[];
};

const initialState: TeachingMethodLogActionState = {};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function MethodLogForm({
  classId,
  assessmentId,
  recommendations,
}: MethodLogFormProps) {
  const action = useMemo(() => createTeachingMethodLogAction.bind(null, classId), [classId]);
  const [state, formAction] = useActionState(action, initialState);
  const defaultDate = todayIsoDate();

  return (
    <div className="space-y-4">
      {recommendations.length > 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Quick log a recommended method
              </h4>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Capture the adjustment you plan to use next with one click. You can add a
                reflection note below if you want more context later.
              </p>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-secondary-700 dark:bg-neutral-900 dark:text-secondary-300">
              Adjust
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {recommendations.map((recommendation) => (
              <form
                key={recommendation.id}
                action={formAction}
                className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <input type="hidden" name="assessmentId" value={assessmentId ?? ""} />
                <input type="hidden" name="recommendationId" value={recommendation.id} />
                <input type="hidden" name="logDate" value={defaultDate} />
                <input type="hidden" name="methodUsed" value={recommendation.method_name} />
                <input type="hidden" name="wasRecommended" value="true" />
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {recommendation.method_name}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  {recommendation.implementation_note ||
                    "Use the recommendation guidance from the matrix during the next lesson."}
                </p>
                <button
                  type="submit"
                  className="mt-4 rounded-full bg-secondary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-700"
                >
                  Log This Method
                </button>
              </form>
            ))}
          </div>
        </div>
      ) : null}

      <form
        action={formAction}
        className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Teaching method log
            </h4>
            <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Record what you actually taught next so the class timeline stays tied to real
              instructional choices, not just recommendations.
            </p>
          </div>
          <div className="rounded-full bg-secondary-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-200">
            Teach
          </div>
        </div>

        <input type="hidden" name="assessmentId" value={assessmentId ?? ""} />

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="logDate">
              Week or Date
            </label>
            <input
              id="logDate"
              name="logDate"
              type="date"
              defaultValue={defaultDate}
              required
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="wasRecommended">
              Was it recommended?
            </label>
            <select
              id="wasRecommended"
              name="wasRecommended"
              defaultValue="false"
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            >
              <option value="false">Not from the recommendation list</option>
              <option value="true">Yes, it came from the recommendation list</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="methodUsed">
              Teaching Method Used
            </label>
            <input
              id="methodUsed"
              name="methodUsed"
              required
              list="recommended-methods"
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
              placeholder="Peer Instruction"
            />
            <datalist id="recommended-methods">
              {recommendations.map((recommendation) => (
                <option key={recommendation.id} value={recommendation.method_name} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="reflectionNote">
              Optional Reflection Note
            </label>
            <textarea
              id="reflectionNote"
              name="reflectionNote"
              rows={4}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
              placeholder="Short note about how you plan to use the method or what you want to watch for next week."
            />
          </div>
        </div>

        {state.error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        ) : null}

        {state.success ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {state.success}
          </div>
        ) : null}

        <div className="mt-5">
          <SubmitButton idleLabel="Save Teaching Log" pendingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
