import { MethodLogForm } from "./method-log-form";

type RecommendationRecord = {
  id: string;
  method_name: string;
  reason: string | null;
  implementation_note: string | null;
};

type RecommendationPanelProps = {
  classId: string;
  assessmentId: string | null;
  latestAssessmentTitle: string | null;
  recommendations: RecommendationRecord[];
  recommendationsAvailable?: boolean;
};

export function RecommendationPanel({
  classId,
  assessmentId,
  latestAssessmentTitle,
  recommendations,
  recommendationsAvailable = true,
}: RecommendationPanelProps) {
  return (
    <section
      id="recommendations"
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Recommendations</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Recommended teaching methods
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            These suggestions come from the rule-based matrix tied to the selected saved
            assessment.
          </p>
        </div>
        <div className="rounded-full bg-secondary-50 px-4 py-2 text-sm text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-200">
          {latestAssessmentTitle ? `Based on ${latestAssessmentTitle}` : "Waiting for assessment"}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {recommendationsAvailable ? "No recommendations yet" : "No recommendations available"}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            {recommendationsAvailable
              ? "Save an assessment with enough evidence to trigger learning patterns and this panel will populate automatically."
              : "TeachLens saved the assessment, but no rule-based recommendations were generated from that assessment yet."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation.id}
              className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700 dark:text-secondary-300">
                Recommended method
              </p>
              <h4 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {recommendation.method_name}
              </h4>
              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {recommendation.reason || "Recommended from the selected assessment analysis."}
              </p>
              <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                {recommendation.implementation_note || "Implementation guidance will appear here."}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6">
        <MethodLogForm
          classId={classId}
          assessmentId={assessmentId}
          recommendations={recommendations}
        />
      </div>
    </section>
  );
}
