Goal
Use AI only for summarization and explanation, not for core recommendation logic.

What this session should produce
backend AI summary endpoint
safe prompt templates
concise class summary and recommendation explanation
graceful fallback if AI fails




coding prompt
Add a lightweight AI summary layer to TeachLens using the OpenAI Responses API.

Important:
- AI should not be the source of truth for recommendation selection
- The recommendation matrix remains rule-based
- AI is only used to summarize analysis in plain language and explain suggestions clearly to teachers

Please implement:
1. A backend endpoint that takes:
   - current assessment analysis
   - detected learning patterns
   - recommended teaching methods
2. Calls the OpenAI Responses API to generate:
   - a short teacher-friendly summary of class understanding
   - a short explanation of why the methods were recommended
3. Add a frontend panel that displays the AI summary
4. Add loading, retry, and fallback behavior if AI is unavailable
5. Keep prompts safe, simple, and grounded in provided analysis data only

Important constraints:
- Do not over-engineer
- Do not allow the AI to invent unsupported analytics
- Do not let the AI override the rule-based recommendation matrix
- Keep outputs concise and readable
- Make the feature optional or gracefully degradable

Also:
- Store the AI summary if useful, but support deletion under the retention policy
- Add environment variable documentation for OpenAI API keys