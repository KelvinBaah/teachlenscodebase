from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai_summary import generate_ai_summary
from app.analytics import analyze_assessment_record
from app.config import get_settings
from app.recommendations import build_recommendations
from app.schemas import (
    AISummaryRequest,
    AISummaryResponse,
    AssessmentAnalysisRead,
    RecommendationSuggestionRead,
)
from app.supabase_client import get_supabase_client

app = FastAPI(
    title="TeachLens API",
    version="0.1.0",
    description="Backend scaffold for the TeachLens MVP.",
)

settings = get_settings()
allowed_origins = [
    origin.strip() for origin in settings.frontend_origin.split(",") if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, object]:
    supabase_ready = get_supabase_client() is not None

    return {
        "status": "ok",
        "service": "teachlens-backend",
        "supabase_configured": supabase_ready,
        "raw_upload_retention_days": settings.raw_upload_retention_days,
        "detail_record_retention_days": settings.detail_record_retention_days,
        "cleanup_batch_size": settings.cleanup_batch_size,
        "openai_configured": bool(settings.openai_api_key),
        "openai_model": settings.openai_model,
    }


@app.post("/analytics/analyze", response_model=AssessmentAnalysisRead)
def analyze_assessment(payload: dict[str, object]) -> dict[str, object]:
    return analyze_assessment_record(payload)


@app.post("/recommendations/generate", response_model=list[RecommendationSuggestionRead])
def generate_recommendations(payload: dict[str, object]) -> list[dict[str, str]]:
    return build_recommendations(payload)


@app.post("/ai/summary", response_model=AISummaryResponse)
def summarize_analysis(payload: AISummaryRequest) -> dict[str, object]:
    return generate_ai_summary(payload.model_dump())
