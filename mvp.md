Goal
Make the app usable end to end and ready for pilot use.

What this session should produce
end-to-end workflow polish
form validation cleanup
empty states
error handling
test coverage for core flows
deployment docs
seeded demo data




coding prompt
Polish and stabilize the TeachLens MVP so it is ready for a small pilot and intervention study.

The current architecture and workflow must remain intact. Do not redesign the product. Focus on stabilization, cleanup, and reliability.

Core workflow must remain unchanged

--------------------------------------------------------------------

Current MVP capabilities that must remain supported


--------------------------------------------------------------------

Assessment form fields (do not change)



These fields represent class-level summary data only. No student-identifiable information should ever be required.

--------------------------------------------------------------------

Please perform the following improvements.

1. End-to-end review

Review the full application and remove rough edges, including:
- inconsistent UI behavior
- broken navigation
- leftover mock components
- unused API calls
- duplicate logic

The system should feel coherent and stable.

--------------------------------------------------------------------

2. Improve user experience states

Improve the following UI states across the app:

Empty states:
- dashboard with no classes
- class page with no assessments
- recommendation panel with no recommendations yet

Loading states:
- fetching classes
- loading class data
- generating recommendations
- AI summary generation

Error states:
- failed API calls
- form submission errors
- authentication failures

Error messages should be short and readable for instructors.

--------------------------------------------------------------------

3. Ensure the post-assessment recommendation flow works

Confirm that when a teacher submits an assessment:

1. assessment saves successfully
2. UI automatically switches to the recommendation section
3. recommendations correspond to the newly saved assessment
4. AI summary (if enabled) loads afterward

If needed, adjust backend response objects so the frontend receives:
- assessment_id
- recommendation payload
- AI summary status

Keep the logic simple.

--------------------------------------------------------------------

4. Tests for core flows

Add lightweight tests to verify core workflows.

Focus on:

auth flow
- protected dashboard access
- redirect when not authenticated

class management
- create class
- retrieve class list

assessment flow
- submit simplified assessment form
- assessment stored successfully

recommendation logic
- correct recommendation rules triggered
- recommendations returned

teaching method logging
- teaching method stored after assessment
- timeline reflects logged methods

Do not add heavy testing frameworks. Keep tests minimal and practical.

--------------------------------------------------------------------

5. Seeded demo data for development

Add development seed data so the app can be tested quickly.

Seed examples:
- demo teacher account
- 2–3 demo classes
- 3–5 example assessments per class
- sample recommendation outputs
- teaching method timeline entries

Seed data should represent realistic class summaries.

--------------------------------------------------------------------

6. Deployment documentation

Add clear deployment documentation for the stack.

Frontend:
Vercel deployment instructions

Backend:
Render or Railway deployment instructions

Database:
Supabase setup instructions

Include:
- environment variables
- migration steps
- build commands
- required secrets

Keep documentation short and practical.

--------------------------------------------------------------------

7. Developer / admin setup guide

Add a short guide explaining:

- required environment variables
- Supabase configuration
- OpenAI API key usage
- how to run the app locally
- how to seed demo data
- how retention cleanup works

--------------------------------------------------------------------

8. Verify data retention cleanup

Confirm the retention cleanup logic still works.

Raw assessment uploads:
- delete after configured retention period

Detailed records:
- expire based on retention configuration

Ensure cleanup jobs do not remove required baseline data.

--------------------------------------------------------------------

9. Privacy validation

Ensure the entire workflow uses class-level signals only.

Verify that the app never requires:
- student names
- student IDs
- student emails
- individual student records

All assessment signals should remain aggregated.

--------------------------------------------------------------------

10. UI coherence

Ensure the interface feels consistent and readable.

Focus on:
- clear typography
- simple layout
- consistent card spacing
- readable charts
- predictable navigation

The interface should feel like a lightweight academic teaching tool.

--------------------------------------------------------------------

Constraints

- Do not over-engineer
- Do not add new major features
- Keep the MVP stable and focused
- Prioritize reliability over expansion
- The goal is pilot readiness for an intervention study

--------------------------------------------------------------------

Success criteria

A teacher should be able to:

1. sign up or sign in
2. create a class
3. open that class
4. log an assessment in under 30 seconds
5. immediately see recommendations
6. review teaching history and assessment trend over time

The app should feel stable, simple, and ready for pilot testing.