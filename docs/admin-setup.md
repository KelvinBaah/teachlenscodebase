# Admin Setup

## Required environment variables

Frontend:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_API_URL`

Backend:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRONTEND_ORIGIN`

Optional but recommended:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `RAW_UPLOAD_RETENTION_DAYS`
- `DETAIL_RECORD_RETENTION_DAYS`
- `CLEANUP_BATCH_SIZE`

## Local run

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## Demo seed data

Run this after migrations and env setup:

```bash
cd backend
python -m app.seed_demo_data
```

By default the seed script tries to create:

- demo email: `demo.teacher@teachlens.local`
- demo password: `TeachLensDemo123!`

If your Supabase admin API is unavailable, create a teacher account manually and rerun with:

```bash
$env:TEACHLENS_DEMO_TEACHER_ID="your-user-id"
python -m app.seed_demo_data
```

## OpenAI usage

- OpenAI is optional.
- TeachLens still works without it.
- If `OPENAI_API_KEY` is missing, the class page shows a local fallback summary instead of failing.

## Retention cleanup

TeachLens keeps only class-level data. The active assessment workflow no longer depends on CSV uploads, but the cleanup job still removes legacy raw upload files if older records exist.

Run manually:

```bash
cd backend
python -m app.cleanup_retention
```

Recommended schedule:

- daily
- after business hours
- with the backend service-role credentials available
