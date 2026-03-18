Goal

Implement secure teacher authentication and protected app access.

What this session should produce
Supabase auth integration
sign up
sign in
sign out
protected dashboard route
teacher profile table if needed
simple session handling



Coding Prompt
Continue building the TeachLens MVP.

Implement teacher authentication using Supabase Auth.

Requirements:
- Teachers can sign up, sign in, and sign out
- Only authenticated teachers can access the dashboard
- Add protected routes for dashboard pages
- Create a simple teacher profile record if needed
- Keep the UX minimal and clean

Important constraints:
- Do not over-engineer
- No social login for now
- No multi-role system for now unless needed later
- Keep this teacher-only in the MVP
- Avoid unnecessary wrappers and state libraries if built-in Next.js patterns are enough

Please build:
1. Sign up page
2. Sign in page
3. Sign out flow
4. Protected dashboard layout
5. Supabase auth integration in a clean way
6. Simple loading and auth error states
7. A brief README update explaining auth setup

Also:
- Use Tailwind for styling
- Keep forms accessible and simple
- Do not store student data in auth-related tables