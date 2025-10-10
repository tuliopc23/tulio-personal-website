import { useCallback } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

export const schedulePublishAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });
  
  // Only show for approved or draft posts
  const status = (props.draft || props.published)?.status;
  if (status !== "approved" && status !== "draft" && status !== "in-review") {
    return null;
  }

  const onHandle = useCallback(async () => {
    const docId = props.id.replace(/^drafts\./, "");
    // In a real implementation, this would open a dialog to select date/time
    // For now, we'll set status to approved and schedule for +24 hours
    const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    await client
      .patch(docId)
      .set({
        status: "approved",
        scheduledPublishAt: scheduledTime,
      })
      .commit();
    
    props.onComplete();
  }, [client, props]);

  return {
    label: "Schedule Publish",
    icon: () => "📅",
    tone: "primary",
    onHandle,
  };
};
