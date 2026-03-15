import type { DocumentBadgeComponent, DocumentBadgeDescription } from "sanity";

const STATUS_MAP: Record<string, DocumentBadgeDescription> = {
  draft: { label: "Draft", title: "This article is a draft" },
  "in-review": { label: "In Review", color: "warning", title: "Awaiting editorial review" },
  approved: { label: "Approved", color: "success", title: "Approved for publishing" },
  published: { label: "Published", color: "primary", title: "Live on the website" },
  archived: { label: "Archived", title: "No longer active" },
};

export const WorkflowBadge: DocumentBadgeComponent = (props) => {
  const doc = props.draft || props.published;
  const status = (doc as Record<string, unknown>)?.status as string | undefined;

  if (!status || !STATUS_MAP[status]) return null;

  return STATUS_MAP[status];
};
