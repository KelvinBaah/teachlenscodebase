export type ClassRecord = {
  id: string;
  course_name: string;
  subject_area: string;
  class_size: number;
  class_level: string;
  term_label: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ClassFormValues = {
  courseName: string;
  subjectArea: string;
  classSize: string;
  classLevel: string;
  termLabel: string;
};

export type ValidationResult =
  | {
      success: true;
      data: {
        course_name: string;
        subject_area: string;
        class_size: number;
        class_level: string;
        term_label: string | null;
      };
    }
  | { success: false; error: string; values: ClassFormValues };

export const emptyClassValues: ClassFormValues = {
  courseName: "",
  subjectArea: "",
  classSize: "",
  classLevel: "",
  termLabel: "",
};

export function valuesFromRecord(record: Partial<ClassRecord> | null | undefined): ClassFormValues {
  return {
    courseName: record?.course_name ?? "",
    subjectArea: record?.subject_area ?? "",
    classSize: record?.class_size ? String(record.class_size) : "",
    classLevel: record?.class_level ?? "",
    termLabel: record?.term_label ?? "",
  };
}

export function parseClassFormData(formData: FormData): ValidationResult {
  const values: ClassFormValues = {
    courseName: String(formData.get("courseName") ?? "").trim(),
    subjectArea: String(formData.get("subjectArea") ?? "").trim(),
    classSize: String(formData.get("classSize") ?? "").trim(),
    classLevel: String(formData.get("classLevel") ?? "").trim(),
    termLabel: String(formData.get("termLabel") ?? "").trim(),
  };

  const parsedClassSize = Number(values.classSize);

  if (!values.courseName) {
    return { success: false, error: "Course name is required.", values };
  }

  if (!values.subjectArea) {
    return { success: false, error: "Subject area is required.", values };
  }

  if (!values.classLevel) {
    return { success: false, error: "Class level is required.", values };
  }

  if (!Number.isInteger(parsedClassSize) || parsedClassSize <= 0) {
    return { success: false, error: "Class size must be a positive whole number.", values };
  }

  return {
    success: true,
    data: {
      course_name: values.courseName,
      subject_area: values.subjectArea,
      class_size: parsedClassSize,
      class_level: values.classLevel,
      term_label: values.termLabel || null,
    },
  };
}
