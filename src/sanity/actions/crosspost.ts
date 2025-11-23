import { PublishIcon } from "@sanity/icons";
import { useCallback, useState } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

/**
 * Manual Cross-posting Action
 * Allows manually triggering cross-posting to Dev.to and Hashnode
 */
export const crosspostAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [isProcessing, setIsProcessing] = useState(false);

  // Only show for published posts
  if (!props.published) {
    return null;
  }

  const onHandle = useCallback(async () => {
    setIsProcessing(true);

    try {
      const docId = props.id.replace(/^drafts\./, "");

      // Fetch the current document with cross-posting settings
      const post = await client.fetch(
        `*[_id == $id][0]{
          _id,
          title,
          crossposting
        }`,
        { id: docId },
      );

      if (!post) {
        props.onComplete();
        return;
      }

      const devtoEnabled = post.crossposting?.devto?.enabled;
      const hashnodeEnabled = post.crossposting?.hashnode?.enabled;

      if (!devtoEnabled && !hashnodeEnabled) {
        // No platforms enabled
        props.onComplete();
        return;
      }

      // In a real implementation, you would trigger an API endpoint here
      // For now, we'll just show a success message
      console.log("Cross-posting triggered for:", post.title);
      console.log("Dev.to enabled:", devtoEnabled);
      console.log("Hashnode enabled:", hashnodeEnabled);

      // You can add actual API calls here to trigger cross-posting
      // Example:
      // await fetch('/api/crosspost', {
      //   method: 'POST',
      //   body: JSON.stringify({ postId: docId })
      // });

      props.onComplete();
    } catch (error) {
      console.error("Cross-posting error:", error);
      props.onComplete();
    } finally {
      setIsProcessing(false);
    }
  }, [client, props]);

  return {
    label: "Cross-post to Platforms",
    icon: PublishIcon,
    onHandle,
    disabled: isProcessing,
    title: isProcessing
      ? "Cross-posting..."
      : "Manually trigger cross-posting to enabled platforms",
  };
};
