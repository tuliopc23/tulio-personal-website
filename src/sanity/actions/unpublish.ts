import { ArchiveIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import * as sanity from "sanity";

export const unpublishAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
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
    toast.push({
      status: "success",
      title: "Unpublished",
      description: "The article has been removed from the public site and moved to archived.",
    });
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
