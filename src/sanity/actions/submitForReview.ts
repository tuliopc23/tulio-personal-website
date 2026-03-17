import { ClockIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import * as sanity from "sanity";

import { getMissingReadinessItems } from "../lib/postReadiness";
import { formatReadinessList, getCurrentPostDocument } from "./postActionUtils";

export const submitForReviewAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show for draft posts
  const doc = getCurrentPostDocument(props);
  const status = doc?.status;
  if (status !== "draft") {
    return null;
  }

  const missingItems = getMissingReadinessItems(doc ?? {}, { includeRecommended: true });

  const submit = () => {
    operations.patch.execute([
      {
        set: {
          status: "in-review",
          lastReviewedAt: new Date().toISOString(),
        },
      },
    ]);
    toast.push({
      status: "success",
      title: "Moved to review",
      description:
        missingItems.length > 0
          ? "The article is in review. Finish the remaining readiness items before approval."
          : "The article is ready for editorial review.",
    });
    setDialogOpen(false);
  };

  const onHandle = () => {
    if (missingItems.length > 0) {
      setDialogOpen(true);
      return;
    }

    submit();
  };

  return {
    label: "Submit for Review",
    icon: ClockIcon,
    onHandle,
    title:
      missingItems.length > 0
        ? "Review can start now, but this article still has readiness gaps."
        : "Move this article into editorial review.",
    dialog: dialogOpen && {
      type: "confirm",
      message: `This article still has a few open items:\n\n${formatReadinessList(missingItems)}\n\nSubmit it for review anyway?`,
      onCancel: () => setDialogOpen(false),
      onConfirm: submit,
      confirmButtonText: "Submit anyway",
      cancelButtonText: "Keep editing",
    },
  };
};
