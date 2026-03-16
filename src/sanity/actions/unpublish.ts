import { ArchiveIcon } from "@sanity/icons";
import { useState } from "react";
import * as sanity from "sanity";

export const unpublishAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show for published posts
  const status = (props.draft || props.published)?.status;
  if (status !== "published") {
    return null;
  }

  const onHandle = () => {
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    operations.patch.execute([
      {
        set: {
          status: "archived",
        },
      },
    ]);
    operations.unpublish.execute();
    setDialogOpen(false);
    props.onComplete();
  };

  return {
    action: "unpublish",
    label: "Unpublish",
    icon: ArchiveIcon,
    tone: "critical",
    onHandle,
    dialog: dialogOpen && {
      type: "confirm",
      message:
        "Are you sure you want to unpublish this post? It will be moved to archived status and removed from the public site.",
      onCancel: () => {
        setDialogOpen(false);
      },
      onConfirm: handleConfirm,
      confirmButtonText: "Unpublish",
    },
  };
};
