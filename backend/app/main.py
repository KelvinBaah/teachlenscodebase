from fastapi import FastAPI

from app.analytics import analyze_assessment_record
from app.config import get_settings
from app.recommendations import build_recommendations
from app.schemas import AssessmentAnalysisRead, RecommendationSuggestionRead
from app.supabase_client import get_supabase_client

app = FastAPI(
    title="TeachLens API",
    version="0.1.0",
    description="Backend scaffold for the TeachLens MVP.",
)


@app.get("/health")
def health_check() -> dict[str, object]:
    settings = get_settings()
    supabase_ready = get_supabase_client() is not None

    return {
        "status": "ok",
        "service": "teachlens-backend",
        "supabase_configured": supabase_ready,
        "raw_upload_retention_days": settings.raw_upload_retention_days,
    }


@app.post("/analytics/analyze", response_model=AssessmentAnalysisRead)
def analyze_assessment(payload: dict[str, object]) -> dict[str, object]:
    return analyze_assessment_record(payload)


@app.post("/recommendations/generate", response_model=list[RecommendationSuggestionRead])
def generate_recommendations(payload: dict[str, object]) -> list[dict[str, str]]:
    return build_recommendations(payload)
