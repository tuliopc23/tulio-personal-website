import { CheckmarkCircleIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import * as sanity from "sanity";

import { isPostReadyForApproval } from "../lib/postReadiness";
import { getCurrentPostDocument } from "./postActionUtils";

export const approveAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
  const doc = getCurrentPostDocument(props);
  const status = doc?.status;

  if (status !== "in-review") {
    return null;
  }

  if (!isPostReadyForApproval(doc ?? {})) {
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
      toast.push({
        status: "success",
        title: "Approved",
        description: "This article is approved and ready to publish.",
      });
    },
  };
};
