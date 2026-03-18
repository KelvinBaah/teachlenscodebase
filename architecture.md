Goal

Set up the full-stack TeachLens MVP foundation with:
Next.js + TypeScript + Tailwind frontend
FastAPI backend
Supabase for auth, database, and storage
clean folder structure
shared environment configuration
basic README and run instructions

What this session should produce
frontend app scaffold
backend app scaffold
env example files
initial Tailwind setup
basic API health route
Supabase client setup
root README with local setup instructions




Prompt
Build the initial MVP scaffold for a web app called TeachLens.

Tech stack:
- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: FastAPI (Python)
- Database/Auth/Storage: Supabase (Postgres)
- Charts: Recharts
- AI integration will come later
- Deployment target: Vercel for frontend, Render or Railway for backend

Important constraints:
- Do not over-engineer.
- Build a clean, simple MVP only.
- Use readable folder structures and minimal abstractions.
- Do not introduce Docker, Kubernetes, CQRS, event buses, or complex patterns unless absolutely necessary.
- Avoid premature optimization.
- The app must avoid storing personally identifiable student information.
- Add placeholders for data retention so raw stored data can be deleted after a defined time.

Please create:
1. A frontend Next.js app scaffold with Tailwind configured
2. A backend FastAPI app scaffold
3. A simple health check API route in FastAPI
4. Supabase client setup for frontend and backend
5. .env.example files for frontend and backend
6. A root README with exact local setup steps
7. A monorepo-like folder structure that is simple and practical, for example:
   /frontend
   /backend
   /docs

Also:
- Add a simple homepage for TeachLens with a clean dashboard-style layout and a placeholder “Sign In” button
- Add comments only where useful
- Make sure the code runs locally with straightforward npm and python commands