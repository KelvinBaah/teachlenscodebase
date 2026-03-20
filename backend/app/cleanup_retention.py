import json
from datetime import datetime, timezone
from typing import Any

from app.config import get_settings
from app.supabase_client import get_supabase_client


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def chunked(items: list[str], chunk_size: int) -> list[list[str]]:
    return [items[index : index + chunk_size] for index in range(0, len(items), chunk_size)]


def cleanup_expired_raw_uploads(client: Any, bucket: str, batch_size: int, now_iso: str) -> int:
    response = (
        client.from_("assessments")
        .select("id, raw_file_path")
        .lt("raw_upload_expires_at", now_iso)
        .limit(batch_size)
        .execute()
    )
    records = [record for record in (response.data or []) if record.get("raw_file_path")]

    if not records:
        return 0

    storage_paths = [str(record["raw_file_path"]) for record in records]
    for batch in chunked(storage_paths, 100):
        client.storage.from_(bucket).remove(batch)

    for record in records:
        (
            client.from_("assessments")
            .update({"raw_file_path": None, "raw_upload_expires_at": None})
            .eq("id", record["id"])
            .execute()
        )

    return len(records)


def cleanup_expired_assessment_details(
    client: Any, bucket: str, batch_size: int, now_iso: str
) -> int:
    response = (
        client.from_("assessments")
        .select("id, raw_file_path")
        .eq("retention_category", "assessment_detail")
        .lt("expires_at", now_iso)
        .limit(batch_size)
        .execute()
    )
    records = response.data or []

    storage_paths = [
        str(record["raw_file_path"])
        for record in records
        if record.get("raw_file_path")
    ]
    for batch in chunked(storage_paths, 100):
        client.storage.from_(bucket).remove(batch)

    for record in records:
        (
            client.from_("assessments")
            .update(
                {
                    "teacher_note": None,
                    "confidence_summary": None,
                    "current_teaching_method": None,
                    "teacher_observation": None,
                    "raw_file_path": None,
                    "raw_upload_expires_at": None,
                    "retention_category": "aggregate_summary",
                    "expires_at": None,
                }
            )
            .eq("id", record["id"])
            .execute()
        )

    return len(records)


def cleanup_expired_table_rows(
    client: Any, table_name: str, batch_size: int, now_iso: str
) -> int:
    response = (
        client.from_(table_name)
        .select("id")
        .lt("expires_at", now_iso)
        .limit(batch_size)
        .execute()
    )
    records = response.data or []

    for record in records:
        client.from_(table_name).delete().eq("id", record["id"]).execute()

    return len(records)


def run_cleanup() -> dict[str, int | str]:
    settings = get_settings()
    client = get_supabase_client(use_service_role=True)

    if client is None:
        raise SystemExit(
            "Supabase service-role credentials are required to run retention cleanup."
        )

    now_iso = utc_now_iso()
    report = {
        "run_at": now_iso,
        "raw_uploads_deleted": cleanup_expired_raw_uploads(
            client,
            settings.supabase_storage_bucket_raw_uploads,
            settings.cleanup_batch_size,
            now_iso,
        ),
        "assessment_details_redacted": cleanup_expired_assessment_details(
            client,
            settings.supabase_storage_bucket_raw_uploads,
            settings.cleanup_batch_size,
            now_iso,
        ),
        "weekly_analyses_deleted": cleanup_expired_table_rows(
            client,
            "weekly_analyses",
            settings.cleanup_batch_size,
            now_iso,
        ),
        "recommendations_deleted": cleanup_expired_table_rows(
            client,
            "recommendations",
            settings.cleanup_batch_size,
            now_iso,
        ),
        "teaching_method_logs_deleted": cleanup_expired_table_rows(
            client,
            "teaching_method_logs",
            settings.cleanup_batch_size,
            now_iso,
        ),
    }
    return report


if __name__ == "__main__":
    print(json.dumps(run_cleanup(), indent=2))
