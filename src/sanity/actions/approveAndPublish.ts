import * as sanity from "sanity";

export const approveAndPublishAction: sanity.DocumentActionComponent = (props) => {
  const client = sanity.useClient({ apiVersion: "2025-02-19" });

  // Only show for posts in review
  const status = (props.draft || props.published)?.status;
  if (status !== "in-review") {
    return null;
  }

  const onHandle = async () => {
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
  };

  return {
    label: "Approve & Publish",
    icon: () => "✅",
    tone: "positive",
    onHandle,
  };
};
