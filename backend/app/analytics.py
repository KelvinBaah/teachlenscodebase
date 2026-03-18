from typing import Any


def infer_understanding_bands(
    average_score: float | None,
    score_summary: dict[str, Any] | None,
) -> list[dict[str, int | str]]:
    if score_summary:
        normalized = {str(key).lower(): int(value) for key, value in score_summary.items()}

        return [
            {
                "label": "Low",
                "count": sum(
                    normalized.get(alias, 0) for alias in ["low", "emerging", "struggling"]
                ),
            },
            {
                "label": "Medium",
                "count": sum(
                    normalized.get(alias, 0)
                    for alias in ["medium", "developing", "approaching"]
                ),
            },
            {
                "label": "High",
                "count": sum(
                    normalized.get(alias, 0) for alias in ["high", "strong", "proficient"]
                ),
            },
        ]

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


def infer_concept_summary(
    concept_summary: dict[str, Any] | None,
) -> list[dict[str, float | str]]:
    if not concept_summary:
        return []

    return sorted(
        [
            {"concept": str(concept), "score": float(score)}
            for concept, score in concept_summary.items()
        ],
        key=lambda item: item["score"],
        reverse=True,
    )


def detect_confidence_mismatch(
    average_score: float | None,
    confidence_summary: str | None,
) -> bool:
    if average_score is None or not confidence_summary:
        return False

    normalized = confidence_summary.lower()
    confidence_signals = ["confident", "very sure", "felt strong", "high confidence"]

    return any(signal in normalized for signal in confidence_signals) and average_score < 70


def detect_learning_patterns(
    average_score: float | None,
    concept_metrics: list[dict[str, float | str]],
    understanding_bands: list[dict[str, int | str]],
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

    low_band = next(
        (int(band["count"]) for band in understanding_bands if band["label"] == "Low"),
        0,
    )
    high_band = next(
        (int(band["count"]) for band in understanding_bands if band["label"] == "High"),
        0,
    )

    if low_band > 0 and high_band > 0:
        patterns.append("Performance appears uneven across the class.")

    if len(concept_metrics) > 1:
        best = float(concept_metrics[0]["score"])
        weakest = float(concept_metrics[-1]["score"])
        weakest_concept = str(concept_metrics[-1]["concept"])

        if best - weakest >= 15:
            patterns.append(
                f"Concept mastery varies across topics, especially around {weakest_concept}."
            )

    if confidence_mismatch:
        patterns.append(
            "Students may feel confident while still performing below expectations."
        )

    return patterns[:4]


def analyze_assessment_record(record: dict[str, Any]) -> dict[str, Any]:
    average_score = (
        float(record["average_score"])
        if record.get("average_score") is not None
        else None
    )
    score_summary = record.get("score_summary")
    concept_summary = record.get("concept_summary")
    confidence_summary = record.get("confidence_summary")

    understanding_bands = infer_understanding_bands(average_score, score_summary)
    concept_metrics = infer_concept_summary(concept_summary)
    confidence_mismatch = detect_confidence_mismatch(
        average_score, confidence_summary
    )
    detected_patterns = detect_learning_patterns(
        average_score, concept_metrics, understanding_bands, confidence_mismatch
    )

    return {
        "average_score": average_score,
        "understanding_bands": understanding_bands,
        "concept_summary": concept_metrics,
        "confidence_mismatch": confidence_mismatch,
        "detected_patterns": detected_patterns,
    }
