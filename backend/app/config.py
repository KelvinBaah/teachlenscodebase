from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    raw_upload_retention_days: int = 30
    detail_record_retention_days: int = 365
    cleanup_batch_size: int = 200
    supabase_storage_bucket_raw_uploads: str = "raw-assessments"
    frontend_origin: str = "http://localhost:3000"
    openai_api_key: str = ""
    openai_model: str = "gpt-5-mini"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
