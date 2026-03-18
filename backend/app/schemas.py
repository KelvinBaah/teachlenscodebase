from datetime import date, datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    full_name: str | None = None
    institution_name: str | None = None
    created_at: datetime
    updated_at: datetime


class ClassBase(BaseModel):
    course_name: str = Field(min_length=1, max_length=200)
    subject_area: str = Field(min_length=1, max_length=120)
    class_size: int = Field(gt=0)
    class_level: str = Field(min_length=1, max_length=120)
    term_label: str | None = Field(default=None, max_length=120)


class ClassCreate(ClassBase):
    teacher_id: UUID


class ClassUpdate(ClassBase):
    pass


class ClassRead(ClassBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    teacher_id: UUID
    created_at: datetime
    updated_at: datetime


class AssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    teacher_id: UUID
    class_id: UUID
    title: str
    assessment_date: date
    assessment_type: str
    topic: str | None = None
    average_score: float | None = None
    score_summary: dict[str, Any] | None = None
    concept_summary: dict[str, Any] | None = None
    teacher_note: str | None = None
    confidence_summary: str | None = None
    raw_file_path: str | None = None
    raw_upload_expires_at: datetime | None = None
    retention_category: str
    expires_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class AssessmentCreate(BaseModel):
    teacher_id: UUID
    class_id: UUID
    title: str = Field(min_length=1, max_length=200)
    assessment_date: date
    assessment_type: str = Field(min_length=1, max_length=80)
    topic: str | None = Field(default=None, max_length=200)
    average_score: float | None = Field(default=None, ge=0, le=100)
    score_summary: dict[str, Any] | None = None
    concept_summary: dict[str, Any] | None = None
    teacher_note: str | None = Field(default=None, max_length=2000)
    confidence_summary: str | None = Field(default=None, max_length=1000)
    raw_file_path: str | None = None
    raw_upload_expires_at: datetime | None = None
    retention_category: str = "assessment_detail"
    expires_at: datetime | None = None


class WeeklyAnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    teacher_id: UUID
    class_id: UUID
    assessment_id: UUID | None = None
    summary: str | None = None
    detected_patterns: list[Any]
    average_score: float | None = None
    understanding_bands: dict[str, Any] | None = None
    retention_category: str = "weekly_analysis_detail"
    expires_at: datetime | None = None
    created_at: datetime


class AssessmentAnalysisRead(BaseModel):
    average_score: float | None = None
    understanding_bands: list[dict[str, Any]]
    concept_summary: list[dict[str, Any]]
    confidence_mismatch: bool
    detected_patterns: list[str]


class RecommendationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    teacher_id: UUID
    class_id: UUID
    assessment_id: UUID | None = None
    weekly_analysis_id: UUID | None = None
    method_name: str
    reason: str | None = None
    implementation_note: str | None = None
    retention_category: str = "recommendation_detail"
    expires_at: datetime | None = None
    created_at: datetime


class RecommendationSuggestionRead(BaseModel):
    method_name: str
    why_recommended: str
    implementation_note: str
    source_pattern: str


class AISummaryRecommendation(BaseModel):
    method_name: str
    why_recommended: str | None = None
    reason: str | None = None
    implementation_note: str | None = None


class AISummaryRequest(BaseModel):
    class_name: str | None = None
    assessment_title: str | None = None
    analysis_date: date | None = None
    average_score: float | None = None
    understanding_bands: list[dict[str, Any]] = Field(default_factory=list)
    concept_summary: list[dict[str, Any]] = Field(default_factory=list)
    confidence_mismatch: bool = False
    detected_patterns: list[str] = Field(default_factory=list)
    recommendations: list[AISummaryRecommendation] = Field(default_factory=list)


class AISummaryResponse(BaseModel):
    understanding_summary: str
    recommendation_explanation: str
    source: Literal["openai", "fallback"]
    error: str | None = None
    model: str | None = None


class TeachingMethodLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    teacher_id: UUID
    class_id: UUID
    assessment_id: UUID | None = None
    weekly_analysis_id: UUID | None = None
    recommendation_id: UUID | None = None
    log_date: date
    method_used: str
    reflection_note: str | None = None
    was_recommended: bool
    retention_category: str = "teaching_method_detail"
    expires_at: datetime | None = None
    created_at: datetime


class TeachingMethodLogCreate(BaseModel):
    teacher_id: UUID
    class_id: UUID
    assessment_id: UUID | None = None
    weekly_analysis_id: UUID | None = None
    recommendation_id: UUID | None = None
    log_date: date
    method_used: str = Field(min_length=1, max_length=200)
    reflection_note: str | None = Field(default=None, max_length=1500)
    was_recommended: bool = False
    retention_category: str = "teaching_method_detail"
    expires_at: datetime | None = None
