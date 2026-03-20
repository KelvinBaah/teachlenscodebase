"use client";

import { useMemo, useState } from "react";

import {
  formatAssessmentTypeLabel,
  type AssessmentRecord,
} from "@/lib/assessments";

type AssessmentSummarySelectorProps = {
  assessments: AssessmentRecord[];
};

export function AssessmentSummarySelector({
  assessments,
}: AssessmentSummarySelectorProps) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(assessments[0]?.id ?? "");

  const selectedAssessment = useMemo(
    () =>
      assessments.find((assessment) => assessment.id === selectedAssessmentId) ??
      assessments[0] ??
      null,
    [assessments, selectedAssessmentId],
  );

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Assessment history</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Previous class summaries
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Select a saved assessment to review the corresponding class summary details.
          </p>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No summaries yet
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Save an assessment above to create the first class summary record.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="assessment-history-selector"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
            >
              Select assessment
            </label>
            <select
              id="assessment-history-selector"
              value={selectedAssessment?.id ?? ""}
              onChange={(event) => setSelectedAssessmentId(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            >
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title} | {assessment.assessment_date}
                </option>
              ))}
            </select>
          </div>

          {selectedAssessment ? (
            <article className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
                    {formatAssessmentTypeLabel(selectedAssessment.assessment_type)}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedAssessment.title}
                  </h4>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedAssessment.assessment_date}
                    {selectedAssessment.topic ? ` | ${selectedAssessment.topic}` : ""}
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  Avg score: {selectedAssessment.average_score ?? "Not entered"}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Assessment signals
                  </p>
                  <p className="mt-2 leading-6">
                    Average score: {selectedAssessment.average_score ?? "Not entered"}
                    <br />
                    Average confidence: {selectedAssessment.average_confidence ?? "Not entered"}
                    <br />
                    Participation rate:{" "}
                    {selectedAssessment.participation_rate !== null
                      ? `${selectedAssessment.participation_rate}%`
                      : "Not entered"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Teaching context
                  </p>
                  <p className="mt-2 leading-6">
                    Topic: {selectedAssessment.topic || "Not entered"}
                    <br />
                    Current method: {selectedAssessment.current_teaching_method || "Not entered"}
                  </p>
                </div>
              </div>

              {selectedAssessment.teacher_observation ? (
                <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Teacher observation
                  </p>
                  <p className="mt-2 leading-6">{selectedAssessment.teacher_observation}</p>
                </div>
              ) : null}
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
