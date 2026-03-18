type RecommendationRecord = {
  id: string;
  method_name: string;
  reason: string | null;
  implementation_note: string | null;
};

type RecommendationPanelProps = {
  latestAssessmentTitle: string | null;
  recommendations: RecommendationRecord[];
};

export function RecommendationPanel({
  latestAssessmentTitle,
  recommendations,
}: RecommendationPanelProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-ink">Recommended Teaching Methods</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These recommendations come from the rule-based matrix tied to the latest detected
            patterns.
          </p>
        </div>
        <div className="rounded-full bg-mist px-4 py-2 text-sm text-pine">
          {latestAssessmentTitle ? `Based on ${latestAssessmentTitle}` : "Waiting for assessment"}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
          <p className="text-lg font-semibold text-ink">No recommendations yet</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add an assessment with enough evidence to trigger detected learning patterns and this
            panel will populate automatically.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation.id}
              className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5"
            >
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-clay">
                Recommended method
              </p>
              <h4 className="mt-2 text-lg font-semibold text-ink">{recommendation.method_name}</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {recommendation.reason || "Recommended from the latest learning pattern analysis."}
              </p>
              <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                {recommendation.implementation_note || "Implementation guidance will appear here."}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
