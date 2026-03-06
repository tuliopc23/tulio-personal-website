import { PublishIcon } from "@sanity/icons";
import { useCallback, useState } from "react";
import { type DocumentActionComponent, useClient } from "sanity";

/**
 * Manual Cross-posting Action
 * Allows manually triggering cross-posting to Dev.to and Hashnode
 */
export const crosspostAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [isProcessing, setIsProcessing] = useState(false);
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL?.replace(/\/$/, "");
  const webhookUrl = process.env.SANITY_STUDIO_WEBHOOK_URL ||
    (webhookBaseUrl ? `${webhookBaseUrl}/api/auto-publish` : undefined);

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
          summary,
          "slug": slug.current,
          tags,
          content,
          seo,
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
      const linkedinEnabled = post.crossposting?.linkedin?.enabled;

      if (!devtoEnabled && !hashnodeEnabled && !linkedinEnabled) {
        // No platforms enabled
        props.onComplete();
        return;
      }

      if (!webhookUrl) {
        console.warn(
          "Cross-posting skipped because no external automation webhook is configured.",
        );
        props.onComplete();
        return;
      }

      console.log("Cross-posting triggered for:", post.title);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
          slug: post.slug,
          title: post.title,
          summary: post.summary,
          tags: post.tags,
          content: post.content,
          seo: post.seo,
          operation: "manual",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger cross-posting: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Cross-posting result:", result);

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
    disabled: isProcessing || !webhookUrl,
    title: isProcessing
      ? "Cross-posting..."
      : webhookUrl
        ? "Manually trigger cross-posting to enabled platforms"
        : "Set SANITY_STUDIO_WEBHOOK_URL or WEBHOOK_BASE_URL to use manual cross-posting",
  };
};
