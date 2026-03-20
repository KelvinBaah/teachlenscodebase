from typing import Any


def infer_understanding_bands(
    average_score: float | None,
) -> list[dict[str, int | str]]:
    if average_score is None:
        return []

    if average_score < 50:
        return [
            {"label": "Low", "count": 1},
            {"label": "Medium", "count": 0},
            {"label": "High", "count": 0},
        ]

    if average_score < 75:
        return [
            {"label": "Low", "count": 0},
            {"label": "Medium", "count": 1},
            {"label": "High", "count": 0},
        ]

    return [
        {"label": "Low", "count": 0},
        {"label": "Medium", "count": 0},
        {"label": "High", "count": 1},
    ]


def detect_confidence_mismatch(
    average_score: float | None,
    average_confidence: float | None,
) -> bool:
    if average_score is None or average_confidence is None:
        return False

    return average_confidence >= 4 and average_score < 70


def detect_learning_patterns(
    average_score: float | None,
    average_confidence: float | None,
    participation_rate: float | None,
    teacher_observation: str | None,
    confidence_mismatch: bool,
) -> list[str]:
    patterns: list[str] = []

    if average_score is not None:
        if average_score < 60:
            patterns.append("Class understanding is broadly low and may need reteaching.")
        elif average_score < 75:
            patterns.append(
                "Class understanding is mixed and may need targeted follow-up."
            )
        else:
            patterns.append("Class understanding is generally strong.")

    if participation_rate is not None and participation_rate < 60:
        patterns.append("Participation was lower than expected for this assessment.")

    if average_confidence is not None and average_confidence <= 2.5:
        patterns.append("Students reported low confidence during this assessment cycle.")

    if confidence_mismatch:
        patterns.append(
            "Students may feel confident while still performing below expectations."
        )

    observation = (teacher_observation or "").lower()
    if any(term in observation for term in ["disengaged", "off task", "attention"]):
        patterns.append("Students appeared disengaged during this assessment cycle.")

    return patterns[:4]


def analyze_assessment_record(record: dict[str, Any]) -> dict[str, Any]:
    average_score = (
        float(record["average_score"])
        if record.get("average_score") is not None
        else None
    )
    average_confidence = (
        float(record["average_confidence"])
        if record.get("average_confidence") is not None
        else None
    )
    participation_rate = (
        float(record["participation_rate"])
        if record.get("participation_rate") is not None
        else None
    )
    teacher_observation = record.get("teacher_observation")

    understanding_bands = infer_understanding_bands(average_score)
    confidence_mismatch = detect_confidence_mismatch(
        average_score, average_confidence
    )
    detected_patterns = detect_learning_patterns(
        average_score,
        average_confidence,
        participation_rate,
        teacher_observation,
        confidence_mismatch,
    )

    return {
        "average_score": average_score,
        "average_confidence": average_confidence,
        "participation_rate": participation_rate,
        "understanding_bands": understanding_bands,
        "confidence_mismatch": confidence_mismatch,
        "detected_patterns": detected_patterns,
    }
