Goal
Build simple analytics from assessment data.

What this session should produce
class-level summary metrics
concept-level summary if available
normal-curve style distribution chart or grouped distribution chart
longitudinal trend basis
backend analysis utility




coding prompt
Build the first TeachLens analytics engine for assessment analysis.

The PRD requires visual analytics dashboards, including class-level learning patterns and a normal curve distribution of patterns of understanding.

For the MVP:
- Keep analytics simple and interpretable
- Do not build advanced machine learning yet
- Use rules and descriptive analytics
- Generate outputs that are useful to teachers

Please implement:
1. Backend analysis utilities that take an assessment record and return:
   - average score
   - simple distribution bands such as low / medium / high understanding
   - optional concept-level summary if concept values are provided
   - confidence-performance mismatch flag if confidence data exists
   - a short list of detected learning patterns
2. Frontend visualizations using Recharts for:
   - score distribution
   - understanding bands
   - concept mastery chart when available
3. A simple “Current Understanding Snapshot” card on the class page
4. A simple “Assessment Trend Over Time” chart scaffold

Important constraints:
- Do not over-engineer the analytics
- Avoid heavy statistics libraries unless necessary
- Use understandable labels rather than academic jargon in the UI
- Make the analysis transparent and easy to follow

Also:
- Add comments or docs that explain the pattern-detection logic
- Build the backend so this can later support multiple weeks of analyses