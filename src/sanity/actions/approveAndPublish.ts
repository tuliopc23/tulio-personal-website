import { useCallback } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

export const approveAndPublishAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });

  // Only show for posts in review
  const status = (props.draft || props.published)?.status;
  if (status !== "in-review") {
    return null;
  }

  const onHandle = useCallback(async () => {
    const docId = props.id.replace(/^drafts\./, "");
    const now = new Date().toISOString();

    // Update to published status with approval metadata
    await client
      .patch(docId)
      .set({
        status: "published",
        publishedAt: now,
        approvedAt: now,
      })
      .commit();

    props.onComplete();
  }, [client, props]);

  return {
    label: "Approve & Publish",
    icon: () => "✅",
    tone: "positive",
    onHandle,
  };
};
