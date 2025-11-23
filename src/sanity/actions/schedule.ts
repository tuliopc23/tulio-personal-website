import { ClockIcon } from "@sanity/icons";
import { useCallback, useState } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

/**
 * Schedule Publishing Action
 * Sets a scheduledPublishAt date for the post
 */
export const scheduleAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [isProcessing, setIsProcessing] = useState(false);

  // Only show for draft or published posts
  if (!props.draft && !props.published) {
    return null;
  }

  const onHandle = useCallback(async () => {
    setIsProcessing(true);

    try {
      const docId = props.id.replace(/^drafts\./, "");

      // Simple implementation: schedule for 1 hour from now
      // In a real app, you'd want a date/time picker dialog
      const scheduledDate = new Date();
      scheduledDate.setHours(scheduledDate.getHours() + 1);

      await client
        .patch(docId)
        .set({
          scheduledPublishAt: scheduledDate.toISOString(),
        })
        .commit();

      console.log(`Post scheduled for: ${scheduledDate.toLocaleString()}`);
      props.onComplete();
    } catch (error) {
      console.error("Scheduling error:", error);
      props.onComplete();
    } finally {
      setIsProcessing(false);
    }
  }, [client, props]);

  return {
    label: "Schedule (+1 hour)",
    icon: ClockIcon,
    onHandle,
    disabled: isProcessing,
    title: "Schedule this post to publish in 1 hour",
  };
};
