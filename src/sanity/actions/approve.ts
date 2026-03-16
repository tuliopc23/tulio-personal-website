import { CheckmarkCircleIcon } from "@sanity/icons";
import * as sanity from "sanity";

export const approveAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const status = (props.draft || props.published)?.status;

  if (status !== "in-review") {
    return null;
  }

  return {
    label: "Approve",
    icon: CheckmarkCircleIcon,
    tone: "positive",
    title: "Mark this article as approved and ready for publishing.",
    onHandle: () => {
      const now = new Date().toISOString();
      operations.patch.execute([
        {
          set: {
            status: "approved",
            approvedAt: now,
            lastReviewedAt: now,
          },
        },
      ]);
      props.onComplete();
    },
  };
};
