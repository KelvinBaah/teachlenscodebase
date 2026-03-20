# Deployment

TeachLens uses a simple three-part stack:

- frontend: Next.js on Vercel
- backend: FastAPI on Render or Railway
- database/auth/storage: Supabase

## Supabase

1. Create a Supabase project.
2. Enable email/password auth.
3. Run these SQL files in order:
   - `supabase/migrations/001_core_schema.sql`
   - `supabase/migrations/003_retention_cleanup_support.sql`
   - `supabase/migrations/004_simplified_assessment_fields.sql`
4. Copy the project URL, anon key, and service-role key.

## Frontend on Vercel

Build settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output: default Next.js output

Environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_API_URL`
- `RAW_UPLOAD_RETENTION_DAYS`
- `DETAIL_RECORD_RETENTION_DAYS`
- `SUPABASE_STORAGE_BUCKET_RAW_UPLOADS`

## Backend on Render or Railway

Service settings:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAW_UPLOAD_RETENTION_DAYS`
- `DETAIL_RECORD_RETENTION_DAYS`
- `CLEANUP_BATCH_SIZE`
- `SUPABASE_STORAGE_BUCKET_RAW_UPLOADS`
- `FRONTEND_ORIGIN`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Post-deploy checks

1. Open `/health` on the backend.
2. Sign in to the frontend.
3. Create a class.
4. Save an assessment.
5. Confirm recommendations, AI summary fallback or OpenAI summary, and teaching logs render.

## Retention cleanup job

Schedule this backend command daily:

```bash
cd backend
python -m app.cleanup_retention
```
