import Link from "next/link";

const rawUploadRetentionDays = process.env.RAW_UPLOAD_RETENTION_DAYS ?? "30";
const detailRecordRetentionDays = process.env.DETAIL_RECORD_RETENTION_DAYS ?? "365";

export default function DashboardHelpPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
              Help And Privacy
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Privacy and retention for TeachLens
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              The MVP keeps everything class-level, avoids student-identifiable data, and removes
              temporary detail on a schedule instead of keeping it forever.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-ink">What TeachLens avoids storing</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            TeachLens is designed for class-level trends only. Student names, student IDs, and
            other personally identifiable student data should never be uploaded or entered.
          </p>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-ink">What gets cleaned up</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Raw CSV uploads are deleted after {rawUploadRetentionDays} days. Detailed instructional
            notes, recommendations, analyses, and method logs can be removed after{" "}
            {detailRecordRetentionDays} days when the cleanup job runs.
          </p>
        </article>
      </div>

      <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-ink">Retention approach</h3>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <p>
            Raw upload files are hard-deleted from storage after their retention window ends.
          </p>
          <p>
            When an assessment detail record expires, TeachLens can preserve the lightweight
            aggregate values needed for trend charts while removing narrative detail such as teacher
            notes and confidence summaries.
          </p>
          <p>
            AI summaries are not required for the app to work, and OpenAI requests are sent with
            `store=False`.
          </p>
        </div>
      </article>
    </section>
  );
}
