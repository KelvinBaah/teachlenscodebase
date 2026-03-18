# Data Retention

TeachLens should avoid storing personally identifiable student information.

For the MVP, retention stays simple and auditable:

- Raw uploaded assessment CSV files are temporary and should be hard-deleted after `RAW_UPLOAD_RETENTION_DAYS`.
- Detailed instructional records can be removed after `DETAIL_RECORD_RETENTION_DAYS`.
- Aggregate class summaries can remain for trend analysis when they stay de-identified and minimal.

Current implementation notes:

- Assessments keep class-level aggregates such as average score, grouped distributions, and concept summaries.
- When an assessment detail record expires, TeachLens can redact narrative detail such as teacher notes and confidence summaries while keeping the aggregate trend data.
- Weekly analyses, recommendations, and teaching method logs support expiration and hard deletion.
- OpenAI summary requests use `store=False`, and the current MVP does not require persistent AI summary storage.

Cleanup entrypoint:

```bash
cd backend
python -m app.cleanup_retention
```

Recommended scheduling:

- Run the cleanup script daily with a simple cron job, scheduled task, or platform job runner.
