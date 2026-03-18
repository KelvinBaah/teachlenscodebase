# TeachLens MVP Scaffold

TeachLens is a teacher-facing instructional decision-support app for reviewing formative assessment patterns and tracking instructional changes over time.

This repository contains a simple full-stack MVP foundation:

- `frontend`: Next.js + TypeScript + Tailwind CSS
- `backend`: FastAPI
- `docs`: lightweight project notes

## Project Structure

```text
TeachLens/
  architecture.md
  prd.md
  masterprompt.md
  frontend/
  backend/
  docs/
```

## Local Setup

### 1. Frontend

```bash
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

Health check:

```bash
curl http://localhost:8000/health
```

## Environment Variables

### Frontend

Set these in `frontend/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend

Set these in `backend/.env`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAW_UPLOAD_RETENTION_DAYS`

`RAW_UPLOAD_RETENTION_DAYS` is a placeholder for the future retention workflow so raw uploaded data can be removed after a defined time window.

## Notes

- This scaffold avoids storing personally identifiable student information by design intent. That rule should remain in place as features are added.
- Recommendation logic, analytics, uploads, and AI summaries are intentionally not implemented yet.
- Deployment targets are expected to be Vercel for the frontend and Render or Railway for the backend.

## Authentication Setup

TeachLens now includes Supabase email/password authentication for teachers.

1. In Supabase, create a project and copy the project URL and anon key into `frontend/.env.local`.
2. In Supabase Authentication, enable email/password sign-in.
3. For the simplest MVP local flow, you can disable email confirmation while testing. If confirmation remains enabled, sign-up will ask the teacher to check email before first sign-in.
4. The protected app route is `frontend/app/dashboard`, and unauthenticated users are redirected to `/sign-in`.

For this auth session, the app relies on Supabase Auth users only. A separate teacher profile table can be added in the later database session if needed, but no student-identifiable data should ever be stored in auth-related records.

## Database Setup

The first database migration lives at `supabase/migrations/001_core_schema.sql`.

1. Open your Supabase project SQL editor.
2. Run the contents of `supabase/migrations/001_core_schema.sql`.
3. Confirm that the tables `profiles`, `classes`, `assessments`, `weekly_analyses`, `recommendations`, and `teaching_method_logs` were created.
4. Confirm that row-level security is enabled and the ownership policies were created.

This migration keeps the data model class-level and teacher-owned:

- `profiles` mirrors the authenticated teacher account.
- `classes` stores the core class profile used throughout the MVP.
- Later sessions attach assessments, analyses, recommendations, and method logs to each class.

No student-identifiable records should be added to these tables.

## Assessment Input Setup

Assessment input now supports both manual entry and a narrow CSV upload flow on each class page.

1. Run `supabase/migrations/002_raw_assessment_storage.sql` in Supabase after the core schema migration.
2. Set `RAW_UPLOAD_RETENTION_DAYS=30` in `frontend/.env.local` if you want a custom retention window for raw CSV uploads.
3. Set `SUPABASE_STORAGE_BUCKET_RAW_UPLOADS=raw-assessments` in `frontend/.env.local` if you want to override the default bucket name.

Supported CSV formats:

- Concept mastery:
  `concept,mastery_value`
- Distribution summary:
  `band,count`

Examples:

```text
concept,mastery_value
photosynthesis,82
cellular respiration,69
```

```text
band,count
low,8
medium,14
high,10
```

Manual entry also supports:

- distribution lines like `low: 8`
- concept mastery lines like `photosynthesis: 82`

Raw CSV uploads are intended to be temporary and should never contain student names, IDs, or other personally identifiable student information.

## Analytics Notes

The first analytics pass is intentionally descriptive and rule-based:

- average score is taken directly from the assessment record
- understanding bands are inferred from grouped distribution values or, when needed, from the average score
- concept mastery is shown only when concept-level values are available
- confidence mismatch is flagged only when the note suggests high confidence while performance remains below 70
- detected patterns are short, transparent summaries rather than hidden model outputs

The backend utility for this session lives in `backend/app/analytics.py`, and the class page visualizations use Recharts in the frontend.

## Recommendation Matrix

The rule-based recommendation engine uses the teaching-method matrix provided in your uploaded planning document. It remains static and editable in code, with no machine learning involved in method selection.

- backend recommendation service: `backend/app/recommendations.py`
- frontend recommendation mapping for stored assessment recommendations: `frontend/lib/recommendations.ts`

The current workflow stores recommendation rows linked to each newly created assessment so later sessions can reuse them for teaching logs and summaries.
