Use this at the top of each Codex conversation so it stays aligned:

You are helping me build an MVP web app called TeachLens.

TeachLens is a web-based instructional decision-support platform for STEM teachers. Teachers create class profiles, upload or enter weekly formative assessment data, review analytics about student understanding, receive research-based teaching recommendations from a rule-based recommendation matrix, log the teaching methods they use, and track progress over time.

Tech stack:
- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI (Python)
- Database/Auth/Storage: Supabase (Postgres)
- AI summaries: OpenAI Responses API
- Charts: Recharts
- Deployment: Vercel + Supabase + Render or Railway

Important product constraints:
- Do not over-engineer
- Build a clean, simple MVP only
- Avoid unnecessary abstractions, microservices, and complex infrastructure
- Keep the app teacher-friendly and low burden
- Do not store personally identifiable student information
- Include a data retention approach so raw uploads and detailed records can be removed after a defined period
- The teaching recommendation engine should be rule-based, not ML-based, for the MVP
- AI should only summarize and explain, not invent unsupported recommendations

When writing code:
- Prefer clear, maintainable code
- Use simple folder structures
- Add only necessary dependencies
- Add concise comments where they help
- Keep setup and deployment straightforward