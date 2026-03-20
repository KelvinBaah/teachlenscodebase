export const dashboardNavGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/classes", label: "Classes" },
      { href: "/dashboard/classes/new", label: "Add Class" },
    ],
  },
  {
    label: "Support",
    items: [
      { href: "/dashboard/help", label: "Help" },
    ],
  },
] as const;

export const quickAssessmentFields = [
  "Assessment title",
  "Assessment date",
  "Topic or concept",
  "Average score",
  "Average confidence",
  "Participation rate",
  "Teaching method used",
  "Teacher observation",
] as const;
