Goal
Implement automatic cleanup and retention-friendly design.

What this session should produce
retention fields in schema
cleanup script or scheduled task
deletion of expired raw uploads and old detailed records
optional preserved aggregate summaries
privacy notice in app/docs




coding prompt
Implement data retention and cleanup for the TeachLens MVP.

This is important for cost control and privacy.

Requirements:
- Raw uploaded assessment files should not be stored forever
- Detailed records should support deletion after a defined retention period
- Where possible, preserve only lightweight aggregate summaries for longer-term trend analysis
- The app avoids personally identifiable student information

Please implement:
1. Retention-related fields where needed, such as:
   - created_at
   - expires_at
   - retention_category
2. A cleanup mechanism that can be run on a schedule, for example:
   - delete raw uploads older than 90 days
   - delete detailed weekly records after a defined period if configured
   - keep aggregate summaries if needed
3. A backend script or job entrypoint for cleanup
4. Clear configuration values for retention periods in env variables
5. A short privacy and retention note in the README and app settings/help area

Important constraints:
- Do not over-engineer
- A simple scheduled script is enough
- No need for a full data lifecycle platform
- Keep deletion logic clear and auditable
- Prefer hard deletion for raw uploads and expired detail records unless a summary must be preserved

Also:
- Make sure deleting detail records does not break the UI
- If summaries are retained, they should be de-identified and minimal