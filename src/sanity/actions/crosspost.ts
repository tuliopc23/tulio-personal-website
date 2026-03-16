import { PublishIcon } from "@sanity/icons";
import * as sanity from "sanity";

export const crosspostAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const doc = (props.draft || props.published) as Record<string, unknown> | undefined;
  const status = doc?.status;
  const crossposting = doc?.crossposting as Record<string, Record<string, unknown>> | undefined;
  const hasPlatforms = Boolean(
    crossposting?.devto?.enabled ||
      crossposting?.hashnode?.enabled ||
      crossposting?.linkedin?.enabled,
  );

  if (status !== "published" || !hasPlatforms) {
    return null;
  }

  return {
    label: "Retry Cross-post",
    icon: PublishIcon,
    title: "Trigger the Sanity document function to retry any missing platform publishes.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            "crossposting.manualTriggerAt": new Date().toISOString(),
          },
        },
      ]);
      props.onComplete();
    },
  };
};
