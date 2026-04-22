export const PROJECT_CATEGORIES = [
  { title: "Native", label: "Native", value: "native" },
  { title: "Web", label: "Web", value: "web" },
  { title: "Tooling", label: "Tooling", value: "tooling" },
  {
    title: "Design System",
    label: "Design systems",
    value: "design-system",
  },
  { title: "Experience", label: "Experience", value: "experience" },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["value"];

export function isProjectCategory(value: string): value is ProjectCategory {
  return PROJECT_CATEGORIES.some((category) => category.value === value);
}
