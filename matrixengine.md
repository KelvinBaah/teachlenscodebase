Goal
Convert detected learning patterns into recommended teaching methods using your matrix.

What this session should produce
static recommendation matrix in code or JSON seed
recommendation service
top 2–4 suggested methods per detected pattern
one-sentence implementation descriptions displayed in UI



coding prompt
Build the TeachLens recommendation engine using a rule-based teaching method recommendation matrix.

This is a core MVP feature. Do not use machine learning for recommendation selection yet.

Use this approach:
- Detect one or more learning patterns from the assessment analysis
- Map those patterns to recommended instructional responses
- Return 2 to 4 teaching methods with implementation descriptions
- Keep the mapping transparent and editable

Please implement:
1. A structured recommendation matrix in code or seed data
2. A recommendation service in the backend that maps detected patterns to teaching methods
3. A frontend recommendation panel on the assessment or class page
4. Display for each recommended method:
   - method name
   - why it was recommended
   - one-sentence implementation description
5. A simple explanation such as:
   “Detected pattern: students confident but performing poorly”
   “Recommended methods: concept tests, misconception diagnosis activities, reflection exercises”

Important constraints:
- Do not over-engineer
- Keep the matrix rule-based and easy to modify
- No vector search or embeddings yet
- No AI-generated pedagogy decisions yet
- The recommendation source of truth should be a static matrix for now

Also:
- Store recommendations linked to an assessment analysis
- Make the recommendation format reusable for later AI summarization