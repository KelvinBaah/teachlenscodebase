import assert from "node:assert/strict";

import { getSafeAuthRedirectPath } from "../lib/auth.ts";
import { parseAssessmentFormData } from "../lib/assessments.ts";
import { parseClassFormData } from "../lib/classes.ts";
import { parseTeachingMethodLogForm } from "../lib/tracker.ts";

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest("auth redirect defaults to dashboard", () => {
  assert.equal(getSafeAuthRedirectPath(), "/dashboard");
  assert.equal(getSafeAuthRedirectPath(""), "/dashboard");
});

runTest("auth redirect preserves safe internal routes", () => {
  assert.equal(getSafeAuthRedirectPath("/dashboard/classes"), "/dashboard/classes");
  assert.equal(getSafeAuthRedirectPath("/classes/123"), "/classes/123");
});

runTest("auth redirect rejects unsafe paths", () => {
  assert.equal(getSafeAuthRedirectPath("/sign-in"), "/dashboard");
  assert.equal(getSafeAuthRedirectPath("/sign-up"), "/dashboard");
  assert.equal(getSafeAuthRedirectPath("https://example.com"), "/dashboard");
  assert.equal(getSafeAuthRedirectPath("//example.com"), "/dashboard");
});

runTest("class form parser accepts a valid class payload", () => {
  const formData = new FormData();
  formData.set("courseName", "BIO 101");
  formData.set("subjectArea", "Biology");
  formData.set("classSize", "28");
  formData.set("classLevel", "Undergraduate");
  formData.set("termLabel", "Fall 2026");

  const result = parseClassFormData(formData);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.course_name, "BIO 101");
    assert.equal(result.data.class_size, 28);
  }
});

runTest("assessment parser normalizes decimal participation", () => {
  const formData = new FormData();
  formData.set("title", "Quiz 2");
  formData.set("assessmentDate", "2026-03-20");
  formData.set("assessmentType", "quiz");
  formData.set("topicOrConcept", "Chemical equilibrium");
  formData.set("averageScore", "68");
  formData.set("averageConfidence", "4.1");
  formData.set("participationRate", "0.88");
  formData.set("currentTeachingMethod", "Worked examples");
  formData.set("teacherObservation", "Students felt confident, but transfer was uneven.");

  const result = parseAssessmentFormData(formData);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.participation_rate, 88);
    assert.equal(result.data.assessment_type, "quiz");
  }
});

runTest("assessment parser rejects invalid confidence", () => {
  const formData = new FormData();
  formData.set("title", "Quiz 2");
  formData.set("assessmentDate", "2026-03-20");
  formData.set("assessmentType", "quiz");
  formData.set("averageConfidence", "7");

  const result = parseAssessmentFormData(formData);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error, /Average confidence/i);
  }
});

runTest("teaching log parser requires date and method", () => {
  const invalid = parseTeachingMethodLogForm(new FormData());
  assert.equal(invalid.success, false);

  const validForm = new FormData();
  validForm.set("logDate", "2026-03-21");
  validForm.set("methodUsed", "Peer Instruction");
  validForm.set("assessmentId", "assessment-1");
  validForm.set("wasRecommended", "true");

  const valid = parseTeachingMethodLogForm(validForm);
  assert.equal(valid.success, true);
  if (valid.success) {
    assert.equal(valid.data.method_used, "Peer Instruction");
    assert.equal(valid.data.was_recommended, true);
  }
});

console.log("Frontend MVP tests passed.");
