import { useCallback } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

export const submitForReviewAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });

  // Only show for draft posts
  const status = (props.draft || props.published)?.status;
  if (status !== "draft") {
    return null;
  }

  const onHandle = useCallback(async () => {
    const docId = props.id.replace(/^drafts\./, "");

    // Update status and timestamp
    await client
      .patch(docId)
      .set({
        status: "in-review",
        lastReviewedAt: new Date().toISOString(),
      })
      .commit();

    props.onComplete();
  }, [client, props]);

  return {
    label: "Submit for Review",
    icon: () => "👀",
    onHandle,
  };
};
