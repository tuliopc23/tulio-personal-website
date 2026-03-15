import { useState } from "react";
import * as sanity from "sanity";

export const unpublishAction: sanity.DocumentActionComponent = (props) => {
  const client = sanity.useClient({ apiVersion: "2025-02-19" });
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
    const docId = props.id.replace(/^drafts\./, "");

    // Move to archived status
    await client.patch(docId).set({ status: "archived" }).commit();

    setDialogOpen(false);
  };

  return {
    label: "Unpublish",
    icon: () => "📦",
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
    },
  };
};
