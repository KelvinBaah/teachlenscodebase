# Data Retention Placeholder

TeachLens should avoid storing personally identifiable student information.

For the MVP, keep retention simple:

- Raw uploaded assessment files should be treated as temporary.
- A retention window should be configurable with `RAW_UPLOAD_RETENTION_DAYS`.
- Future backend jobs or admin actions should delete expired raw uploads and any associated temporary storage records.
- Aggregated class-level analytics can be retained longer if they do not contain student-identifiable data.

This document is a placeholder so retention stays visible from the beginning of the project.
