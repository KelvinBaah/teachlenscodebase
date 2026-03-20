import unittest

from app.cleanup_retention import (
    chunked,
    cleanup_expired_assessment_details,
    cleanup_expired_raw_uploads,
)


class FakeResponse:
    def __init__(self, data):
        self.data = data


class FakeTableQuery:
    def __init__(self, client, table_name):
        self.client = client
        self.table_name = table_name
        self.filters = []
        self.operation = "select"
        self.payload = None

    def select(self, _columns):
        self.operation = "select"
        return self

    def update(self, payload):
        self.operation = "update"
        self.payload = payload
        return self

    def delete(self):
        self.operation = "delete"
        return self

    def lt(self, field, value):
        self.filters.append(("lt", field, value))
        return self

    def eq(self, field, value):
        self.filters.append(("eq", field, value))
        return self

    def limit(self, _limit):
        return self

    def execute(self):
        if self.operation == "select":
            rows = list(self.client.tables.get(self.table_name, []))
            for operator, field, value in self.filters:
                if operator == "lt":
                    rows = [
                        row for row in rows if row.get(field) is not None and row.get(field) < value
                    ]
                elif operator == "eq":
                    rows = [row for row in rows if row.get(field) == value]
            return FakeResponse(rows)

        if self.operation == "update":
            for row in self.client.tables.get(self.table_name, []):
                if all(
                    (
                        operator != "eq"
                        or row.get(field) == value
                    )
                    for operator, field, value in self.filters
                ):
                    row.update(self.payload)
            return FakeResponse([])

        if self.operation == "delete":
            retained = []
            removed = []
            for row in self.client.tables.get(self.table_name, []):
                if all(
                    (
                        operator != "eq"
                        or row.get(field) == value
                    )
                    for operator, field, value in self.filters
                ):
                    removed.append(row)
                else:
                    retained.append(row)
            self.client.tables[self.table_name] = retained
            return FakeResponse(removed)

        raise AssertionError("Unsupported fake query operation")


class FakeStorageBucket:
    def __init__(self):
        self.removed_paths = []

    def remove(self, paths):
        self.removed_paths.extend(paths)


class FakeStorage:
    def __init__(self):
        self.bucket = FakeStorageBucket()

    def from_(self, _bucket):
        return self.bucket


class FakeClient:
    def __init__(self, tables):
        self.tables = tables
        self.storage = FakeStorage()

    def from_(self, table_name):
        return FakeTableQuery(self, table_name)


class CleanupRetentionTests(unittest.TestCase):
    def test_chunked_splits_large_lists(self):
        self.assertEqual(chunked(["a", "b", "c", "d", "e"], 2), [["a", "b"], ["c", "d"], ["e"]])

    def test_cleanup_expired_raw_uploads_clears_storage_and_db_fields(self):
        client = FakeClient(
          {
              "assessments": [
                  {
                      "id": "a1",
                      "raw_file_path": "raw/demo-1.csv",
                      "raw_upload_expires_at": "2024-01-01T00:00:00+00:00",
                  },
                  {
                      "id": "a2",
                      "raw_file_path": None,
                      "raw_upload_expires_at": "2024-01-01T00:00:00+00:00",
                  },
              ]
          }
        )

        deleted = cleanup_expired_raw_uploads(
            client, "raw-assessments", 10, "2025-01-01T00:00:00+00:00"
        )

        self.assertEqual(deleted, 1)
        self.assertEqual(client.storage.bucket.removed_paths, ["raw/demo-1.csv"])
        self.assertIsNone(client.tables["assessments"][0]["raw_file_path"])

    def test_cleanup_expired_assessment_details_preserves_aggregate_baseline(self):
        client = FakeClient(
            {
                "assessments": [
                    {
                        "id": "a1",
                        "retention_category": "assessment_detail",
                        "expires_at": "2024-01-01T00:00:00+00:00",
                        "raw_file_path": "raw/demo-2.csv",
                        "teacher_note": "Detailed note",
                        "teacher_observation": "Observation",
                        "current_teaching_method": "Peer Instruction",
                    }
                ]
            }
        )

        redacted = cleanup_expired_assessment_details(
            client, "raw-assessments", 10, "2025-01-01T00:00:00+00:00"
        )

        updated = client.tables["assessments"][0]
        self.assertEqual(redacted, 1)
        self.assertEqual(updated["retention_category"], "aggregate_summary")
        self.assertIsNone(updated["teacher_note"])
        self.assertIsNone(updated["teacher_observation"])
        self.assertIsNone(updated["current_teaching_method"])
        self.assertIsNone(updated["raw_file_path"])


if __name__ == "__main__":
    unittest.main()
