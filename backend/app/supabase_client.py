from supabase import Client, create_client

from app.config import get_settings


def get_supabase_client(use_service_role: bool = False) -> Client | None:
    settings = get_settings()
    key = (
        settings.supabase_service_role_key
        if use_service_role
        else settings.supabase_anon_key
    )

    if not settings.supabase_url or not key:
        return None

    return create_client(settings.supabase_url, key)
