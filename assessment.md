Goal
Allow teachers to add weekly assessments in a simple way.

What this session should produce
assessment creation form
CSV upload for class-level or concept-level results
manual input option
assessment history on class page
storage design for raw uploads with expiration metadata




coding prompt
Build the MVP assessment input workflow for TeachLens.

The app should support weekly formative assessment analysis. Teachers should be able to add assessments to a class in a simple, low-burden way.

Requirements:
- Teachers can add an assessment entry to a class
- Support two input methods:
  1. Manual entry form
  2. CSV upload
- Keep the assessment data class-level or concept-level only
- Do not store identifiable student information
- Include an optional short teacher note about classroom discourse
- Include optional confidence/self-assessment summary input
- Include the week number or date of assessment

Suggested assessment fields:
- class_id
- title
- date
- assessment_type (quiz, assignment, exit ticket, concept test, diagnostic check)
- topic or concept
- average score
- score distribution summary or simple category summary
- optional concept mastery values
- optional teacher note
- optional confidence summary
- optional raw file path if CSV uploaded

Please build:
1. Assessment add form on the class page
2. CSV upload support using Supabase storage or a simple storage approach
3. A parser flow for a simple CSV format
4. Assessment history list for each class
5. Validation and friendly error messages
6. Simple backend endpoints or helper functions as needed

Important constraints:
- Do not over-engineer the upload parser
- Support a narrow CSV format for MVP and document it clearly
- Keep the first version forgiving but simple
- Raw uploaded files should support future deletion after a retention period

Also:
- Add an expires_at or retention metadata field for raw uploads and detailed records
- Document the expected CSV format in the UI and README