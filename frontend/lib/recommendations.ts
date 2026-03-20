import type { AssessmentAnalysis } from "./analytics";
import type { AssessmentRecord } from "./assessments";

type PatternId =
  | "widespread_conceptual_misunderstanding"
  | "procedural_success_weak_reasoning"
  | "low_retention"
  | "wide_performance_gap"
  | "foundational_struggle"
  | "low_participation"
  | "confused_low_confidence"
  | "confident_but_poor"
  | "application_struggle"
  | "quick_mastery"
  | "uneven_concept_understanding"
  | "surface_memorization"
  | "disengaged"
  | "connecting_ideas_struggle";

export type RecommendationItem = {
  methodName: string;
  whyRecommended: string;
  implementationNote: string;
  sourcePattern: string;
};

type MatrixEntry = {
  id: PatternId;
  label: string;
  methods: string[];
};

const methodDescriptions: Record<string, string> = {
  "Peer Instruction":
    "Pose a conceptual question, let students commit individually, discuss with peers, then revisit the answer together.",
  "Concept Tests":
    "Use a short conceptual multiple-choice check during instruction and discuss the reasoning behind the best answer.",
  "Think-Pair-Share":
    "Give students time to think alone, discuss with a partner, and then share back with the class.",
  "Socratic Questioning":
    "Use probing questions to help students explain reasoning and test assumptions.",
  "Concept Mapping":
    "Ask students to build a visual map showing how key concepts connect and why the links matter.",
  "Conceptual Questions":
    "Use short prompts that ask students to explain ideas, not just produce answers.",
  "Peer Explanation Activities":
    "Have students explain how they solved or interpreted a problem to a partner or small group.",
  "Retrieval Practice":
    "Start class with a quick no-notes recall task focused on previously learned ideas.",
  "Low-Stakes Quizzes":
    "Use short, low-pressure quizzes to revisit prior content and surface what needs reinforcement.",
  "Spaced Practice Activities":
    "Revisit important ideas across multiple class meetings instead of covering them only once.",
  "Flexible Grouping":
    "Group students by current need so support and challenge can be adjusted more intentionally.",
  "Tiered Problem Sets":
    "Offer graduated problem sets so students can work at an appropriate level of challenge.",
  "Collaborative Problem Solving":
    "Use small-group problem solving with shared reasoning and visible work.",
  "Worked Examples":
    "Model a full solution step by step while making the reasoning explicit.",
  "Guided Practice":
    "Work through structured practice with prompts, hints, and teacher feedback.",
  "Scaffolded Problem Walkthroughs":
    "Break complex tasks into smaller guided steps before asking students to work independently.",
  "Polling Questions":
    "Use quick whole-class polls to boost participation and reveal current thinking.",
  "Small Group Discussion":
    "Use short group discussions so more students can speak and test their ideas aloud.",
  "Collaborative Learning":
    "Have students learn with and from each other through shared explanation and problem solving.",
  "Supportive Questioning":
    "Ask low-risk questions that invite partial thinking and build confidence through follow-up prompts.",
  "Diagnostic Concept Checks":
    "Use short checks focused on one concept at a time to pinpoint where support is needed.",
  "Focused Mini-Lessons":
    "Deliver a short reteach segment aimed at one specific misconception or weak concept.",
  "Small Group Remediation":
    "Pull a small group for focused support on a specific area of difficulty.",
  "Misconception Diagnosis Activities":
    "Surface incorrect ideas directly and compare them with correct reasoning in class.",
  "Reflection Activities":
    "Ask students to reflect on what they understood, what confused them, and how their thinking changed.",
  "Problem-Based Learning":
    "Anchor instruction around a meaningful problem that students must analyze and solve.",
  "Case-Based Learning":
    "Use a realistic case so students apply ideas in context rather than only recalling them.",
  "Real-World Application Tasks":
    "Ask students to apply ideas to practical or authentic scenarios.",
  "Inquiry-Based Projects":
    "Let students investigate a question over time and build evidence-based conclusions.",
  "Advanced Problem Challenges":
    "Offer more demanding extension problems for students who are ready to go further.",
  "Research Tasks":
    "Invite students to explore a topic more deeply and report what they found.",
  "Inquiry-Based Learning":
    "Use guided investigation so students build understanding from evidence and questioning.",
  "Interactive Simulations":
    "Use interactive tools or demos so students can manipulate variables and see outcomes.",
  "Collaborative Activities":
    "Use structured partner or group tasks that keep students actively engaged.",
  "Class Discussions":
    "Build in whole-class discussion that asks students to compare, justify, and refine ideas.",
  "Synthesis Exercises":
    "Ask students to combine ideas from multiple lessons into one explanation or product.",
  "Cumulative Problem Sets":
    "Use mixed review problem sets that require students to connect current and prior material.",
};

const matrix: MatrixEntry[] = [
  {
    id: "widespread_conceptual_misunderstanding",
    label: "Widespread conceptual misunderstanding",
    methods: ["Peer Instruction", "Concept Tests", "Think-Pair-Share", "Socratic Questioning"],
  },
  {
    id: "procedural_success_weak_reasoning",
    label: "Procedural success but weak conceptual reasoning",
    methods: ["Concept Mapping", "Conceptual Questions", "Peer Explanation Activities"],
  },
  {
    id: "low_retention",
    label: "Low retention of previously taught material",
    methods: ["Retrieval Practice", "Low-Stakes Quizzes", "Spaced Practice Activities"],
  },
  {
    id: "wide_performance_gap",
    label: "Wide performance gap among students",
    methods: ["Flexible Grouping", "Tiered Problem Sets", "Collaborative Problem Solving"],
  },
  {
    id: "foundational_struggle",
    label: "Students struggling with foundational knowledge",
    methods: ["Worked Examples", "Guided Practice", "Scaffolded Problem Walkthroughs"],
  },
  {
    id: "low_participation",
    label: "Low student participation in class discussions",
    methods: ["Think-Pair-Share", "Polling Questions", "Small Group Discussion"],
  },
  {
    id: "confused_low_confidence",
    label: "Students appear confused but lack confidence to respond",
    methods: ["Peer Instruction", "Collaborative Learning", "Supportive Questioning"],
  },
  {
    id: "confident_but_poor",
    label: "Students confident but performing poorly",
    methods: ["Concept Tests", "Misconception Diagnosis Activities", "Reflection Activities"],
  },
  {
    id: "application_struggle",
    label: "Students understand basic concepts but struggle with application",
    methods: ["Problem-Based Learning", "Case-Based Learning", "Real-World Application Tasks"],
  },
  {
    id: "quick_mastery",
    label: "Students quickly mastering material",
    methods: ["Inquiry-Based Projects", "Advanced Problem Challenges", "Research Tasks"],
  },
  {
    id: "uneven_concept_understanding",
    label: "Uneven understanding of specific concepts",
    methods: ["Diagnostic Concept Checks", "Focused Mini-Lessons", "Small Group Remediation"],
  },
  {
    id: "surface_memorization",
    label: "Surface-level memorization without deep learning",
    methods: ["Inquiry-Based Learning", "Socratic Questioning", "Concept Mapping"],
  },
  {
    id: "disengaged",
    label: "Students disengaged or losing attention",
    methods: ["Interactive Simulations", "Collaborative Activities", "Class Discussions"],
  },
  {
    id: "connecting_ideas_struggle",
    label: "Students struggling to connect ideas across topics",
    methods: ["Concept Mapping", "Synthesis Exercises", "Cumulative Problem Sets"],
  },
];

function detectPatternIds(
  assessment: AssessmentRecord,
  analysis: AssessmentAnalysis,
): PatternId[] {
  const ids: PatternId[] = [];
  const noteText = `${assessment.teacher_observation ?? ""}`.toLowerCase();
  const lowBand = analysis.understandingBands.find((band) => band.label === "Low")?.count ?? 0;

  if (analysis.averageScore !== null && analysis.averageScore < 60) {
    ids.push("widespread_conceptual_misunderstanding");
  }

  if (analysis.averageScore !== null && analysis.averageScore < 50) {
    ids.push("foundational_struggle");
  }

  if (analysis.confidenceMismatch) {
    ids.push("confident_but_poor");
  }

  if (analysis.averageConfidence !== null && analysis.averageConfidence <= 2.5) {
    ids.push("confused_low_confidence");
  }

  if (analysis.participationRate !== null && analysis.participationRate < 60) {
    ids.push("low_participation");
  }

  if (analysis.averageScore !== null && analysis.averageScore >= 85) {
    ids.push("quick_mastery");
  }

  if (analysis.averageScore !== null && analysis.averageScore >= 60 && analysis.averageScore < 75) {
    ids.push("wide_performance_gap");
  }

  if (
    assessment.assessment_type === "diagnostic_check" &&
    analysis.averageScore !== null &&
    analysis.averageScore < 70
  ) {
    ids.push("uneven_concept_understanding");
  }

  if (["quiet", "few students", "limited participation", "low participation"].some((term) => noteText.includes(term))) {
    ids.push("low_participation");
  }

  if (["disengaged", "attention", "off task"].some((term) => noteText.includes(term))) {
    ids.push("disengaged");
  }

  if (["application", "transfer", "real-world"].some((term) => noteText.includes(term))) {
    ids.push("application_struggle");
  }

  if (["forgot", "retention", "cumulative"].some((term) => noteText.includes(term))) {
    ids.push("low_retention");
  }

  return Array.from(new Set(ids));
}

export function buildRecommendations(
  assessment: AssessmentRecord,
  analysis: AssessmentAnalysis,
): RecommendationItem[] {
  const patternIds = detectPatternIds(assessment, analysis);
  const seenMethods = new Set<string>();
  const items: RecommendationItem[] = [];

  for (const patternId of patternIds) {
    const entry = matrix.find((candidate) => candidate.id === patternId);
    if (!entry) {
      continue;
    }

    for (const methodName of entry.methods) {
      if (seenMethods.has(methodName)) {
        continue;
      }

      seenMethods.add(methodName);
      items.push({
        methodName,
        whyRecommended: `${entry.label} was detected in the latest assessment data.`,
        implementationNote:
          methodDescriptions[methodName] ??
          "Use this strategy in a short, clearly structured way during the next lesson.",
        sourcePattern: entry.label,
      });

      if (items.length >= 4) {
        return items;
      }
    }
  }

  return items;
}
