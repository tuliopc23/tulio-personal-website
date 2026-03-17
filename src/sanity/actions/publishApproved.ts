import { PublishIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import * as sanity from "sanity";

import { getMissingReadinessItems, isPostReadyForApproval } from "../lib/postReadiness";
import { formatReadinessList, getCurrentPostDocument } from "./postActionUtils";

export const publishApprovedAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const doc = getCurrentPostDocument(props);
  const status = doc?.status;

  if (status !== "approved") {
    return null;
  }

  const missingItems = getMissingReadinessItems(doc ?? {});

  const publish = () => {
    operations.patch.execute([
      {
        set: {
          status: "published",
          publishedAt: new Date().toISOString(),
        },
      },
    ]);
    operations.publish.execute();
    toast.push({
      status: "success",
      title: "Published live",
      description: "The article is now live on the website.",
    });
    setDialogOpen(false);
  };

  return {
    action: "publish",
    label: "Publish Live",
    icon: PublishIcon,
    tone: "positive",
    title: missingItems.length
      ? "Publishing is blocked until required editorial checks are complete."
      : "Publish the approved article to the public site.",
    onHandle: () => {
      if (!isPostReadyForApproval(doc ?? {})) {
        setDialogOpen(true);
        return;
      }
      publish();
    },
    dialog: dialogOpen && {
      type: "confirm",
      message: `Publishing is blocked until these items are complete:\n\n${formatReadinessList(missingItems)}`,
      onCancel: () => setDialogOpen(false),
      onConfirm: () => setDialogOpen(false),
      confirmButtonText: "Back to editor",
      cancelButtonText: "Close",
    },
  };
};
