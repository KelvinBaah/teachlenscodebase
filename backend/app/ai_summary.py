import json
from typing import Any

from app.config import get_settings

SYSTEM_PROMPT = """
You are TeachLens AI, a teacher-facing explainer.

Your job is to summarize class-level assessment analysis in plain language.
You must stay grounded in the provided data only.

Rules:
- Do not invent analytics, causes, or student details.
- Do not add teaching methods that are not already provided.
- Do not override or second-guess the existing rule-based recommendations.
- Keep both outputs concise, teacher-friendly, and practical.
- Return valid JSON with exactly these keys:
  understanding_summary
  recommendation_explanation
""".strip()


def build_fallback_summary(payload: dict[str, Any]) -> dict[str, Any]:
    average_score = payload.get("average_score")
    average_confidence = payload.get("average_confidence")
    participation_rate = payload.get("participation_rate")
    detected_patterns = payload.get("detected_patterns", [])
    recommendations = payload.get("recommendations", [])

    summary_parts: list[str] = []

    if average_score is not None:
        summary_parts.append(f"The latest class average is {average_score}.")

    if average_confidence is not None:
        summary_parts.append(f"Average confidence was {average_confidence} out of 5.")

    if participation_rate is not None:
        summary_parts.append(f"Participation was {participation_rate}% of the class.")

    if detected_patterns:
        summary_parts.append(str(detected_patterns[0]))
    elif not summary_parts:
        summary_parts.append("The latest assessment offers a limited but usable class-level snapshot.")

    explanation_parts: list[str] = []
    if recommendations:
        method_names = [str(item.get("method_name", "")).strip() for item in recommendations]
        method_names = [name for name in method_names if name]

        if method_names:
            joined_methods = ", ".join(method_names[:3])
            explanation_parts.append(
                f"The suggested methods come from the rule-based matrix linked to the detected patterns: {joined_methods}."
            )

        reasons = [
            str(item.get("why_recommended") or item.get("reason") or "").strip()
            for item in recommendations
        ]
        reasons = [reason for reason in reasons if reason]
        if reasons:
            explanation_parts.append(reasons[0])
    else:
        explanation_parts.append(
            "No recommendation explanation is available yet because no method suggestions were generated for this assessment."
        )

    return {
        "understanding_summary": " ".join(summary_parts[:3]),
        "recommendation_explanation": " ".join(explanation_parts[:2]),
        "source": "fallback",
        "error": None,
        "model": None,
    }


def _parse_ai_response(output_text: str) -> dict[str, str] | None:
    try:
        parsed = json.loads(output_text)
    except json.JSONDecodeError:
        return None

    understanding_summary = str(parsed.get("understanding_summary", "")).strip()
    recommendation_explanation = str(
        parsed.get("recommendation_explanation", "")
    ).strip()

    if not understanding_summary or not recommendation_explanation:
        return None

    return {
        "understanding_summary": understanding_summary,
        "recommendation_explanation": recommendation_explanation,
    }


def generate_ai_summary(payload: dict[str, Any]) -> dict[str, Any]:
    settings = get_settings()
    fallback = build_fallback_summary(payload)

    if not settings.openai_api_key:
        fallback["error"] = "OpenAI API key is not configured."
        return fallback

    try:
        from openai import OpenAI
    except ImportError:
        fallback["error"] = "OpenAI SDK is not installed in the backend environment."
        return fallback

    try:
        user_payload = {
            "class_name": payload.get("class_name"),
            "assessment_title": payload.get("assessment_title"),
            "analysis_date": payload.get("analysis_date"),
            "average_score": payload.get("average_score"),
            "average_confidence": payload.get("average_confidence"),
            "participation_rate": payload.get("participation_rate"),
            "understanding_bands": payload.get("understanding_bands", []),
            "confidence_mismatch": payload.get("confidence_mismatch", False),
            "detected_patterns": payload.get("detected_patterns", []),
            "recommendations": payload.get("recommendations", []),
        }

        user_prompt = (
            "Summarize this TeachLens class analysis and explain the already-selected rule-based "
            "teaching recommendations. Keep the explanation grounded in the provided data only.\n\n"
            f"{json.dumps(user_payload, ensure_ascii=True, default=str)}"
        )

        client = OpenAI(api_key=settings.openai_api_key)
        response = client.responses.create(
            model=settings.openai_model,
            store=False,
            max_output_tokens=260,
            input=[
                {
                    "role": "system",
                    "content": [{"type": "input_text", "text": SYSTEM_PROMPT}],
                },
                {
                    "role": "user",
                    "content": [{"type": "input_text", "text": user_prompt}],
                },
            ],
        )

        parsed = _parse_ai_response(response.output_text or "")
        if not parsed:
            fallback["error"] = "OpenAI returned an unreadable response."
            return fallback

        return {
            **parsed,
            "source": "openai",
            "error": None,
            "model": settings.openai_model,
        }
    except Exception as exc:
        fallback["error"] = str(exc)
        return fallback
