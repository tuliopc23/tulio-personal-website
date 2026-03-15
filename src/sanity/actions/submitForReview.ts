import { useCallback } from "react";
import * as sanity from "sanity";

export const submitForReviewAction: sanity.DocumentActionComponent = (props) => {
  const client = sanity.useClient({ apiVersion: "2025-02-19" });

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

  }, [client, props]);

  return {
    label: "Submit for Review",
    icon: () => "👀",
    onHandle,
  };
};
