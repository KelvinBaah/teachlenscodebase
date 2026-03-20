"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  createAssessmentAction,
  type AssessmentActionState,
} from "@/app/dashboard/classes/[classId]/assessment-actions";
import {
  assessmentTypeOptions,
  formatAssessmentTypeLabel,
} from "@/lib/assessments";

import { SubmitButton } from "./submit-button";

type AssessmentFormProps = {
  classId: string;
};

const initialState: AssessmentActionState = {};

export function AssessmentForm({ classId }: AssessmentFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const action = useMemo(() => createAssessmentAction.bind(null, classId), [classId]);
  const [state, formAction] = useActionState(action, initialState);
  const [isNavigatingToRecommendations, setIsNavigatingToRecommendations] = useState(false);

  useEffect(() => {
    if (!state.success || !state.createdAssessmentId) {
      return;
    }

    setIsNavigatingToRecommendations(true);

    const targetUrl = `${pathname}?assessment=${state.createdAssessmentId}&focus=recommendations#recommendations`;
    router.replace(targetUrl, { scroll: false });
    router.refresh();

    const timeoutId = window.setTimeout(() => {
      document.getElementById("recommendations")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsNavigatingToRecommendations(false);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, router, state.createdAssessmentId, state.success]);

  return (
    <form action={formAction} className="paper-card p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Add Class Summary Assessment
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Enter one quick class-level summary for a quiz, assignment, diagnostic check, or exit
            ticket. Do not enter student names, IDs, or any other student-identifiable data.
          </p>
        </div>
        <div className="rounded-full bg-secondary-50 px-4 py-2 text-sm text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-200">
          Under 30 seconds
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="assessmentType">
            Assessment Type
          </label>
          <select
            id="assessmentType"
            name="assessmentType"
            required
            defaultValue="quiz"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
          >
            {assessmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {formatAssessmentTypeLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="title">
            Assessment Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Quiz 2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="assessmentDate">
            Assessment Date
          </label>
          <input
            id="assessmentDate"
            name="assessmentDate"
            type="date"
            required
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="topicOrConcept">
            Topic or Concept
          </label>
          <input
            id="topicOrConcept"
            name="topicOrConcept"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Chemical equilibrium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="averageScore">
            Average Score
          </label>
          <input
            id="averageScore"
            name="averageScore"
            inputMode="decimal"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="72"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="averageConfidence">
            Average Confidence
          </label>
          <input
            id="averageConfidence"
            name="averageConfidence"
            inputMode="decimal"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="3.6"
          />
          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">Use a class average on a 1 to 5 scale.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="participationRate">
            Participation Rate
          </label>
          <input
            id="participationRate"
            name="participationRate"
            inputMode="decimal"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="0.88 or 88"
          />
          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            Enter a decimal or percent for the portion of the class that completed it.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="currentTeachingMethod">
            Current Teaching Method
          </label>
          <input
            id="currentTeachingMethod"
            name="currentTeachingMethod"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Peer instruction"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="teacherObservation">
            Teacher Observation
          </label>
          <textarea
            id="teacherObservation"
            name="teacherObservation"
            rows={4}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="Class discussion was active, but many students still struggled to apply the concept independently."
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
          {isNavigatingToRecommendations
            ? "Assessment saved. Opening recommendations..."
            : state.success}
        </div>
      ) : null}

      <div className="mt-6">
        <SubmitButton
          idleLabel="Save Assessment"
          pendingLabel={
            isNavigatingToRecommendations ? "Opening recommendations..." : "Saving..."
          }
        />
      </div>
    </form>
  );
}
