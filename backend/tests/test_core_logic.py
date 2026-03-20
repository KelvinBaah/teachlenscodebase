import unittest
from unittest.mock import patch

from app.ai_summary import build_fallback_summary, generate_ai_summary
from app.analytics import analyze_assessment_record
from app.recommendations import build_recommendations, detect_pattern_ids


class AnalyticsTests(unittest.TestCase):
    def test_analyze_assessment_record_flags_confidence_mismatch(self):
        analysis = analyze_assessment_record(
            {
                "average_score": 58,
                "average_confidence": 4.2,
                "participation_rate": 55,
                "teacher_observation": "Several students were disengaged and off task.",
            }
        )

        self.assertEqual(analysis["average_score"], 58.0)
        self.assertTrue(analysis["confidence_mismatch"])
        self.assertIn(
            "Students may feel confident while still performing below expectations.",
            analysis["detected_patterns"],
        )
        self.assertIn(
            "Students appeared disengaged during this assessment cycle.",
            analysis["detected_patterns"],
        )


class RecommendationTests(unittest.TestCase):
    def test_detect_pattern_ids_captures_diagnostic_and_application_signals(self):
        pattern_ids = detect_pattern_ids(
            {
                "assessment_type": "diagnostic_check",
                "average_score": 64,
                "average_confidence": 2.2,
                "participation_rate": 52,
                "confidence_mismatch": False,
                "teacher_observation": "Students struggled with transfer to real-world application.",
            }
        )

        self.assertIn("uneven_concept_understanding", pattern_ids)
        self.assertIn("application_struggle", pattern_ids)
        self.assertIn("low_participation", pattern_ids)

    def test_build_recommendations_returns_unique_methods_capped_at_four(self):
        recommendations = build_recommendations(
            {
                "assessment_type": "diagnostic_check",
                "average_score": 48,
                "average_confidence": 2.0,
                "participation_rate": 45,
                "confidence_mismatch": False,
                "teacher_observation": "Students appeared disengaged and had low retention.",
            }
        )

        self.assertGreater(len(recommendations), 0)
        self.assertLessEqual(len(recommendations), 4)
        self.assertEqual(
            len({item["method_name"] for item in recommendations}), len(recommendations)
        )


class AISummaryTests(unittest.TestCase):
    def test_build_fallback_summary_uses_grounded_data(self):
        result = build_fallback_summary(
            {
                "average_score": 68,
                "average_confidence": 3.9,
                "participation_rate": 88,
                "detected_patterns": [
                    "Class understanding is mixed and may need targeted follow-up."
                ],
                "recommendations": [
                    {
                        "method_name": "Peer Instruction",
                        "why_recommended": "Mixed understanding was detected.",
                    }
                ],
            }
        )

        self.assertEqual(result["source"], "fallback")
        self.assertIn("68", result["understanding_summary"])
        self.assertIn("Peer Instruction", result["recommendation_explanation"])

    def test_generate_ai_summary_falls_back_without_api_key(self):
        with patch("app.ai_summary.get_settings") as mock_get_settings:
            mock_get_settings.return_value.openai_api_key = ""
            mock_get_settings.return_value.openai_model = "gpt-5-mini"
            result = generate_ai_summary(
                {
                    "class_name": "BIO 101",
                    "assessment_title": "Quiz 2",
                    "average_score": 68,
                    "average_confidence": 4.1,
                    "participation_rate": 88,
                    "detected_patterns": [
                        "Class understanding is mixed and may need targeted follow-up."
                    ],
                    "recommendations": [],
                }
            )

        self.assertEqual(result["source"], "fallback")
        self.assertIn("OpenAI API key", result["error"])


if __name__ == "__main__":
    unittest.main()
