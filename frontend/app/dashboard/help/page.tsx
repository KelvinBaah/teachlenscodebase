import Link from "next/link";

import { PrivacyAccordion } from "@/components/dashboard/privacy-accordion";

const rawUploadRetentionDays = process.env.RAW_UPLOAD_RETENTION_DAYS ?? "30";
const detailRecordRetentionDays = process.env.DETAIL_RECORD_RETENTION_DAYS ?? "365";

export default function DashboardHelpPage() {
  return (
    <section className="space-y-6">
      <div className="hero-card rounded-[32px] p-7 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="section-kicker">Help and Privacy</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#17212b]">
              Privacy and retention for TeachLens
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
              TeachLens is built for class-level summary entry only. The workflow stays
              teacher-friendly, keeps student-identifiable data out of the product, and preserves
              the existing retention model.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[rgba(23,33,43,0.14)] bg-[rgba(255,255,255,0.78)] px-5 py-3 text-sm font-semibold text-[#17212b] transition hover:border-[rgba(23,33,43,0.24)]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="paper-card rounded-[28px] p-6">
          <h3 className="text-xl font-semibold text-[#17212b]">What TeachLens avoids storing</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            TeachLens is designed for class-level trends only. Student names, student IDs, and
            other personally identifiable student data should never be uploaded or entered.
          </p>
        </article>

        <article className="paper-card rounded-[28px] p-6">
          <h3 className="text-xl font-semibold text-[#17212b]">What gets cleaned up</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Legacy raw CSV uploads are deleted after {rawUploadRetentionDays} days if they exist.
            Detailed instructional notes, recommendations, analyses, and method logs can be removed
            after {detailRecordRetentionDays} days when the cleanup job runs.
          </p>
        </article>
      </div>

      <article className="paper-card rounded-[30px] p-6 md:p-7">
        <h3 className="text-2xl font-semibold text-[#17212b]">Retention approach</h3>
        <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
          <p>
            Legacy raw upload files are hard-deleted from storage after their retention window ends.
          </p>
          <p>
            When an assessment detail record expires, TeachLens can preserve the lightweight
            aggregate values needed for trend charts while removing narrative detail such as teacher
            observations and teaching-method context.
          </p>
          <p>
            AI summaries are not required for the app to work, and OpenAI requests are sent with
            `store=False`.
          </p>
        </div>
      </article>

      <article className="paper-card rounded-[30px] p-6 md:p-7">
        <p className="section-kicker">Common Questions</p>
        <h3 className="mt-3 text-2xl font-semibold text-[#17212b]">
          What teachers can safely enter
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          Use the accordion below as a quick reference while setting up the MVP with real class
          data. Every screen should stay focused on class summaries rather than individual student
          records.
        </p>
        <div className="mt-6">
          <PrivacyAccordion
            rawUploadRetentionDays={rawUploadRetentionDays}
            detailRecordRetentionDays={detailRecordRetentionDays}
          />
        </div>
      </article>
    </section>
  );
}
