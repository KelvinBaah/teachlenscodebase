Goal
Create the core database schema and CRUD for class profiles.

What this session should produce
schema for teachers, classes, assessments, recommendations, teaching methods, weekly analysis
row-level ownership
create/edit/delete class profile
class list page
class detail page scaffold



coding prompt
Now build the core TeachLens database schema and class profile functionality.

The MVP supports teachers creating profiles for the classes they teach and tracking assessments, teaching methods, and recommendations over time.

Requirements:
- A teacher can create multiple class profiles
- Each class profile should include:
  - course name
  - subject area
  - class size
  - course level or class level
  - optional term or semester label
- Each teacher should only access their own class data
- Use Supabase Postgres
- Keep the schema simple and normalized enough for an MVP

Please do the following:
1. Design and implement SQL schema/migrations for core tables such as:
   - profiles or teachers
   - classes
   - assessments
   - weekly_analyses
   - recommendations
   - teaching_method_logs
2. Add row-level security policies so teachers only see their own records
3. Build frontend pages to:
   - list classes
   - create a class
   - edit a class
   - delete a class
   - view a class detail page
4. Add backend models/schemas in FastAPI if needed
5. Keep naming clear and consistent

Important constraints:
- Do not over-engineer
- Avoid adding fields that are not needed for the MVP
- Avoid audit logging complexity for now
- Do not include identifiable student-level records
- This app is class-level and concept-level, not student-identity-level

Also:
- Add form validation
- Add helpful empty states
- Update README with any SQL setup steps
