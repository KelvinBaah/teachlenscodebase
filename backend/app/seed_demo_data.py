import os
from datetime import date, datetime, timedelta, timezone
from typing import Any

from app.analytics import analyze_assessment_record
from app.config import get_settings
from app.recommendations import build_recommendations
from app.supabase_client import get_supabase_client


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def iso_expiry(days: int) -> str:
    return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()


def extract_user_id(payload: Any) -> str | None:
    if payload is None:
        return None

    if isinstance(payload, dict):
        user_id = payload.get("id")
        if user_id:
            return str(user_id)

        user = payload.get("user")
        if isinstance(user, dict) and user.get("id"):
            return str(user["id"])

        data = payload.get("data")
        return extract_user_id(data)

    for attribute in ("id", "user", "data"):
        value = getattr(payload, attribute, None)
        extracted = extract_user_id(value)
        if extracted:
            return extracted

    return None


def find_existing_user_id(client: Any, email: str) -> str | None:
    try:
        result = client.auth.admin.list_users()
    except Exception:
        return None

    candidates = []
    if isinstance(result, dict):
        candidates = result.get("users") or result.get("data") or []
    else:
        candidates = getattr(result, "users", None) or getattr(result, "data", None) or []

    for candidate in candidates:
        candidate_email = None
        if isinstance(candidate, dict):
            candidate_email = candidate.get("email")
        else:
            candidate_email = getattr(candidate, "email", None)

        if candidate_email == email:
            return extract_user_id(candidate)

    return None


def ensure_demo_teacher(client: Any, email: str, password: str) -> str:
    existing_user_id = find_existing_user_id(client, email)
    if existing_user_id:
        return existing_user_id

    try:
        created = client.auth.admin.create_user(
            {
                "email": email,
                "password": password,
                "email_confirm": True,
            }
        )
        user_id = extract_user_id(created)
        if user_id:
            return user_id
    except Exception:
        pass

    fallback_user_id = os.getenv("TEACHLENS_DEMO_TEACHER_ID", "").strip()
    if fallback_user_id:
        return fallback_user_id

    raise SystemExit(
        "TeachLens could not create the demo teacher automatically. "
        "Create a teacher account in Supabase first, then rerun with "
        "TEACHLENS_DEMO_TEACHER_ID set to that user's id."
    )


def upsert_profile(client: Any, teacher_id: str, email: str) -> None:
    client.table("profiles").upsert({"id": teacher_id, "email": email}).execute()


def clear_existing_demo_data(client: Any, teacher_id: str) -> None:
    for table_name in (
        "teaching_method_logs",
        "recommendations",
        "weekly_analyses",
        "assessments",
        "classes",
    ):
        client.table(table_name).delete().eq("teacher_id", teacher_id).execute()


def build_demo_classes() -> list[dict[str, Any]]:
    return [
        {
            "course_name": "BIO 101 - Section A",
            "subject_area": "Biology",
            "class_size": 28,
            "class_level": "Undergraduate",
            "term_label": "Spring 2026",
            "assessments": [
                {
                    "title": "Week 2 Diagnostic Check",
                    "assessment_type": "diagnostic_check",
                    "assessment_date": str(date.today() - timedelta(days=28)),
                    "topic": "Cell transport",
                    "average_score": 54,
                    "average_confidence": 2.6,
                    "participation_rate": 91,
                    "current_teaching_method": "Mini lecture",
                    "teacher_observation": "Students could recall definitions, but application was weak.",
                },
                {
                    "title": "Quiz 2",
                    "assessment_type": "quiz",
                    "assessment_date": str(date.today() - timedelta(days=14)),
                    "topic": "Photosynthesis",
                    "average_score": 68,
                    "average_confidence": 4.1,
                    "participation_rate": 88,
                    "current_teaching_method": "Worked examples",
                    "teacher_observation": "Students felt confident, but transfer questions still caused trouble.",
                },
                {
                    "title": "Week 5 Exit Ticket",
                    "assessment_type": "exit_ticket",
                    "assessment_date": str(date.today() - timedelta(days=3)),
                    "topic": "Cellular respiration",
                    "average_score": 76,
                    "average_confidence": 3.8,
                    "participation_rate": 94,
                    "current_teaching_method": "Peer instruction",
                    "teacher_observation": "Discussion was stronger and misconceptions were easier to surface.",
                },
            ],
        },
        {
            "course_name": "CHEM 110 - Foundations",
            "subject_area": "Chemistry",
            "class_size": 35,
            "class_level": "Undergraduate",
            "term_label": "Spring 2026",
            "assessments": [
                {
                    "title": "Assignment 1",
                    "assessment_type": "assignment",
                    "assessment_date": str(date.today() - timedelta(days=24)),
                    "topic": "Stoichiometry",
                    "average_score": 59,
                    "average_confidence": 3.0,
                    "participation_rate": 72,
                    "current_teaching_method": "Lecture with guided examples",
                    "teacher_observation": "Students finished the mechanics but struggled to explain their reasoning.",
                },
                {
                    "title": "Quiz 3",
                    "assessment_type": "quiz",
                    "assessment_date": str(date.today() - timedelta(days=10)),
                    "topic": "Chemical equilibrium",
                    "average_score": 63,
                    "average_confidence": 2.3,
                    "participation_rate": 81,
                    "current_teaching_method": "Collaborative problem solving",
                    "teacher_observation": "Students were cautious and needed more support connecting ideas across setups.",
                },
                {
                    "title": "Week 6 Exit Ticket",
                    "assessment_type": "exit_ticket",
                    "assessment_date": str(date.today() - timedelta(days=2)),
                    "topic": "Le Chatelier principle",
                    "average_score": 71,
                    "average_confidence": 3.4,
                    "participation_rate": 93,
                    "current_teaching_method": "Think-pair-share",
                    "teacher_observation": "Participation improved and more students could justify directional changes.",
                },
            ],
        },
        {
            "course_name": "MATH 201 - Applied Algebra",
            "subject_area": "Mathematics",
            "class_size": 24,
            "class_level": "Undergraduate",
            "term_label": "Spring 2026",
            "assessments": [
                {
                    "title": "Diagnostic Check 1",
                    "assessment_type": "diagnostic_check",
                    "assessment_date": str(date.today() - timedelta(days=21)),
                    "topic": "Systems of equations",
                    "average_score": 47,
                    "average_confidence": 2.1,
                    "participation_rate": 79,
                    "current_teaching_method": "Direct instruction",
                    "teacher_observation": "Students were disengaged and unsure when asked to explain steps.",
                },
                {
                    "title": "Assignment 2",
                    "assessment_type": "assignment",
                    "assessment_date": str(date.today() - timedelta(days=9)),
                    "topic": "Matrix operations",
                    "average_score": 66,
                    "average_confidence": 3.7,
                    "participation_rate": 83,
                    "current_teaching_method": "Worked examples",
                    "teacher_observation": "Procedural fluency improved, but application in context remained uneven.",
                },
                {
                    "title": "Exit Ticket 4",
                    "assessment_type": "exit_ticket",
                    "assessment_date": str(date.today() - timedelta(days=1)),
                    "topic": "Matrix inverses",
                    "average_score": 84,
                    "average_confidence": 4.2,
                    "participation_rate": 96,
                    "current_teaching_method": "Guided practice",
                    "teacher_observation": "Students are showing much stronger independence on the current topic.",
                },
            ],
        },
    ]


def seed_demo_data() -> dict[str, Any]:
    settings = get_settings()
    client = get_supabase_client(use_service_role=True)
    if client is None:
        raise SystemExit("Supabase service-role credentials are required to seed demo data.")

    demo_email = os.getenv("TEACHLENS_DEMO_EMAIL", "demo.teacher@teachlens.local")
    demo_password = os.getenv("TEACHLENS_DEMO_PASSWORD", "TeachLensDemo123!")
    teacher_id = ensure_demo_teacher(client, demo_email, demo_password)

    upsert_profile(client, teacher_id, demo_email)
    clear_existing_demo_data(client, teacher_id)

    classes_created = 0
    assessments_created = 0
    recommendations_created = 0
    logs_created = 0

    for class_seed in build_demo_classes():
        class_payload = {
            "teacher_id": teacher_id,
            "course_name": class_seed["course_name"],
            "subject_area": class_seed["subject_area"],
            "class_size": class_seed["class_size"],
            "class_level": class_seed["class_level"],
            "term_label": class_seed["term_label"],
        }

        class_row = client.table("classes").insert(class_payload).execute().data[0]
        classes_created += 1

        for index, assessment_seed in enumerate(class_seed["assessments"]):
            assessment_payload = {
                "teacher_id": teacher_id,
                "class_id": class_row["id"],
                **assessment_seed,
                "retention_category": "assessment_detail",
                "expires_at": iso_expiry(settings.detail_record_retention_days),
            }
            assessment_row = (
                client.table("assessments").insert(assessment_payload).execute().data[0]
            )
            assessments_created += 1

            client.table("teaching_method_logs").insert(
                {
                    "teacher_id": teacher_id,
                    "class_id": class_row["id"],
                    "assessment_id": assessment_row["id"],
                    "log_date": assessment_seed["assessment_date"],
                    "method_used": assessment_seed["current_teaching_method"],
                    "reflection_note": "Method in place before this assessment.",
                    "was_recommended": False,
                    "retention_category": "teaching_method_detail",
                    "expires_at": iso_expiry(settings.detail_record_retention_days),
                }
            ).execute()
            logs_created += 1

            analysis = analyze_assessment_record(assessment_seed)
            recommendation_rows = [
                {
                    "teacher_id": teacher_id,
                    "class_id": class_row["id"],
                    "assessment_id": assessment_row["id"],
                    "method_name": item["method_name"],
                    "reason": item["why_recommended"],
                    "implementation_note": item["implementation_note"],
                    "retention_category": "recommendation_detail",
                    "expires_at": iso_expiry(settings.detail_record_retention_days),
                }
                for item in build_recommendations(
                    {
                        **assessment_seed,
                        "confidence_mismatch": analysis["confidence_mismatch"],
                    }
                )
            ]

            if recommendation_rows:
                inserted_recommendations = (
                    client.table("recommendations").insert(recommendation_rows).execute().data
                )
                recommendations_created += len(inserted_recommendations)

                if index < 2:
                    first_recommendation = inserted_recommendations[0]
                    follow_up_date = str(
                        date.fromisoformat(assessment_seed["assessment_date"]) + timedelta(days=7)
                    )
                    client.table("teaching_method_logs").insert(
                        {
                            "teacher_id": teacher_id,
                            "class_id": class_row["id"],
                            "assessment_id": assessment_row["id"],
                            "recommendation_id": first_recommendation["id"],
                            "log_date": follow_up_date,
                            "method_used": first_recommendation["method_name"],
                            "reflection_note": "Seeded follow-up method after reviewing recommendations.",
                            "was_recommended": True,
                            "retention_category": "teaching_method_detail",
                            "expires_at": iso_expiry(settings.detail_record_retention_days),
                        }
                    ).execute()
                    logs_created += 1

    return {
        "run_at": iso_now(),
        "demo_teacher_email": demo_email,
        "demo_teacher_password": demo_password,
        "classes_created": classes_created,
        "assessments_created": assessments_created,
        "recommendations_created": recommendations_created,
        "teaching_logs_created": logs_created,
    }


if __name__ == "__main__":
    import json

    print(json.dumps(seed_demo_data(), indent=2))
