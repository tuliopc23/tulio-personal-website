import { useCallback, useState } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

export const unpublishAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show for published posts
  const status = (props.draft || props.published)?.status;
  if (status !== "published") {
    return null;
  }

  const onHandle = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    const docId = props.id.replace(/^drafts\./, "");

    // Move to archived status
    await client.patch(docId).set({ status: "archived" }).commit();

    setDialogOpen(false);
    props.onComplete();
  }, [client, props]);

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
        props.onComplete();
      },
      onConfirm: handleConfirm,
    },
  };
};
