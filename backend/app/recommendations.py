from typing import Any


METHOD_DESCRIPTIONS = {
    "Peer Instruction": "Pose a conceptual question, let students commit individually, discuss with peers, then revisit the answer together.",
    "Concept Tests": "Use a short conceptual multiple-choice check during instruction and discuss the reasoning behind the best answer.",
    "Think-Pair-Share": "Give students time to think alone, discuss with a partner, and then share back with the class.",
    "Socratic Questioning": "Use probing questions to help students explain reasoning and test assumptions.",
    "Concept Mapping": "Ask students to build a visual map showing how key concepts connect and why the links matter.",
    "Conceptual Questions": "Use short prompts that ask students to explain ideas, not just produce answers.",
    "Peer Explanation Activities": "Have students explain how they solved or interpreted a problem to a partner or small group.",
    "Retrieval Practice": "Start class with a quick no-notes recall task focused on previously learned ideas.",
    "Low-Stakes Quizzes": "Use short, low-pressure quizzes to revisit prior content and surface what needs reinforcement.",
    "Spaced Practice Activities": "Revisit important ideas across multiple class meetings instead of covering them only once.",
    "Flexible Grouping": "Group students by current need so support and challenge can be adjusted more intentionally.",
    "Tiered Problem Sets": "Offer graduated problem sets so students can work at an appropriate level of challenge.",
    "Collaborative Problem Solving": "Use small-group problem solving with shared reasoning and visible work.",
    "Worked Examples": "Model a full solution step by step while making the reasoning explicit.",
    "Guided Practice": "Work through structured practice with prompts, hints, and teacher feedback.",
    "Scaffolded Problem Walkthroughs": "Break complex tasks into smaller guided steps before asking students to work independently.",
    "Polling Questions": "Use quick whole-class polls to boost participation and reveal current thinking.",
    "Small Group Discussion": "Use short group discussions so more students can speak and test their ideas aloud.",
    "Collaborative Learning": "Have students learn with and from each other through shared explanation and problem solving.",
    "Supportive Questioning": "Ask low-risk questions that invite partial thinking and build confidence through follow-up prompts.",
    "Diagnostic Concept Checks": "Use short checks focused on one concept at a time to pinpoint where support is needed.",
    "Focused Mini-Lessons": "Deliver a short reteach segment aimed at one specific misconception or weak concept.",
    "Small Group Remediation": "Pull a small group for focused support on a specific area of difficulty.",
    "Misconception Diagnosis Activities": "Surface incorrect ideas directly and compare them with correct reasoning in class.",
    "Reflection Activities": "Ask students to reflect on what they understood, what confused them, and how their thinking changed.",
    "Problem-Based Learning": "Anchor instruction around a meaningful problem that students must analyze and solve.",
    "Case-Based Learning": "Use a realistic case so students apply ideas in context rather than only recalling them.",
    "Real-World Application Tasks": "Ask students to apply ideas to practical or authentic scenarios.",
    "Inquiry-Based Projects": "Let students investigate a question over time and build evidence-based conclusions.",
    "Advanced Problem Challenges": "Offer more demanding extension problems for students who are ready to go further.",
    "Research Tasks": "Invite students to explore a topic more deeply and report what they found.",
    "Inquiry-Based Learning": "Use guided investigation so students build understanding from evidence and questioning.",
    "Interactive Simulations": "Use interactive tools or demos so students can manipulate variables and see outcomes.",
    "Collaborative Activities": "Use structured partner or group tasks that keep students actively engaged.",
    "Class Discussions": "Build in whole-class discussion that asks students to compare, justify, and refine ideas.",
    "Synthesis Exercises": "Ask students to combine ideas from multiple lessons into one explanation or product.",
    "Cumulative Problem Sets": "Use mixed review problem sets that require students to connect current and prior material.",
}

MATRIX = [
    {
        "id": "widespread_conceptual_misunderstanding",
        "label": "Widespread conceptual misunderstanding",
        "methods": [
            "Peer Instruction",
            "Concept Tests",
            "Think-Pair-Share",
            "Socratic Questioning",
        ],
    },
    {
        "id": "procedural_success_weak_reasoning",
        "label": "Procedural success but weak conceptual reasoning",
        "methods": [
            "Concept Mapping",
            "Conceptual Questions",
            "Peer Explanation Activities",
        ],
    },
    {
        "id": "low_retention",
        "label": "Low retention of previously taught material",
        "methods": [
            "Retrieval Practice",
            "Low-Stakes Quizzes",
            "Spaced Practice Activities",
        ],
    },
    {
        "id": "wide_performance_gap",
        "label": "Wide performance gap among students",
        "methods": [
            "Flexible Grouping",
            "Tiered Problem Sets",
            "Collaborative Problem Solving",
        ],
    },
    {
        "id": "foundational_struggle",
        "label": "Students struggling with foundational knowledge",
        "methods": ["Worked Examples", "Guided Practice", "Scaffolded Problem Walkthroughs"],
    },
    {
        "id": "low_participation",
        "label": "Low student participation in class discussions",
        "methods": ["Think-Pair-Share", "Polling Questions", "Small Group Discussion"],
    },
    {
        "id": "confused_low_confidence",
        "label": "Students appear confused but lack confidence to respond",
        "methods": ["Peer Instruction", "Collaborative Learning", "Supportive Questioning"],
    },
    {
        "id": "confident_but_poor",
        "label": "Students confident but performing poorly",
        "methods": [
            "Concept Tests",
            "Misconception Diagnosis Activities",
            "Reflection Activities",
        ],
    },
    {
        "id": "application_struggle",
        "label": "Students understand basic concepts but struggle with application",
        "methods": [
            "Problem-Based Learning",
            "Case-Based Learning",
            "Real-World Application Tasks",
        ],
    },
    {
        "id": "quick_mastery",
        "label": "Students quickly mastering material",
        "methods": [
            "Inquiry-Based Projects",
            "Advanced Problem Challenges",
            "Research Tasks",
        ],
    },
    {
        "id": "uneven_concept_understanding",
        "label": "Uneven understanding of specific concepts",
        "methods": ["Diagnostic Concept Checks", "Focused Mini-Lessons", "Small Group Remediation"],
    },
    {
        "id": "surface_memorization",
        "label": "Surface-level memorization without deep learning",
        "methods": ["Inquiry-Based Learning", "Socratic Questioning", "Concept Mapping"],
    },
    {
        "id": "disengaged",
        "label": "Students disengaged or losing attention",
        "methods": ["Interactive Simulations", "Collaborative Activities", "Class Discussions"],
    },
    {
        "id": "connecting_ideas_struggle",
        "label": "Students struggling to connect ideas across topics",
        "methods": ["Concept Mapping", "Synthesis Exercises", "Cumulative Problem Sets"],
    },
]


def detect_pattern_ids(payload: dict[str, Any]) -> list[str]:
    ids: list[str] = []
    average_score = payload.get("average_score")
    confidence_mismatch = bool(payload.get("confidence_mismatch"))
    understanding_bands = payload.get("understanding_bands", [])
    concept_summary = payload.get("concept_summary", [])
    note_text = str(payload.get("notes", "")).lower()

    low_band = next(
        (int(item["count"]) for item in understanding_bands if item["label"] == "Low"),
        0,
    )
    high_band = next(
        (int(item["count"]) for item in understanding_bands if item["label"] == "High"),
        0,
    )

    if average_score is not None and float(average_score) < 60:
        ids.append("widespread_conceptual_misunderstanding")

    if average_score is not None and float(average_score) < 50:
        ids.append("foundational_struggle")

    if low_band > 0 and high_band > 0:
        ids.append("wide_performance_gap")

    if confidence_mismatch:
        ids.append("confident_but_poor")

    if average_score is not None and float(average_score) >= 85:
        ids.append("quick_mastery")

    if len(concept_summary) > 1:
        best = float(concept_summary[0]["score"])
        weakest = float(concept_summary[-1]["score"])
        if best - weakest >= 15:
            ids.append("uneven_concept_understanding")

    if any(term in note_text for term in ["hesitant", "uncertain", "low confidence", "nervous"]):
        ids.append("confused_low_confidence")

    if any(term in note_text for term in ["quiet", "few students", "limited participation", "low participation"]):
        ids.append("low_participation")

    if any(term in note_text for term in ["disengaged", "attention", "off task"]):
        ids.append("disengaged")

    if any(term in note_text for term in ["application", "transfer", "real-world"]):
        ids.append("application_struggle")

    if any(term in note_text for term in ["forgot", "retention", "cumulative"]):
        ids.append("low_retention")

    return list(dict.fromkeys(ids))


def build_recommendations(payload: dict[str, Any]) -> list[dict[str, str]]:
    pattern_ids = detect_pattern_ids(payload)
    recommendations: list[dict[str, str]] = []
    seen_methods: set[str] = set()

    for pattern_id in pattern_ids:
        entry = next((item for item in MATRIX if item["id"] == pattern_id), None)
        if not entry:
            continue

        for method_name in entry["methods"]:
            if method_name in seen_methods:
                continue

            seen_methods.add(method_name)
            recommendations.append(
                {
                    "method_name": method_name,
                    "why_recommended": f"{entry['label']} was detected in the latest assessment data.",
                    "implementation_note": METHOD_DESCRIPTIONS.get(
                        method_name,
                        "Use this strategy in a short, clearly structured way during the next lesson.",
                    ),
                    "source_pattern": entry["label"],
                }
            )

            if len(recommendations) >= 4:
                return recommendations

    return recommendations
