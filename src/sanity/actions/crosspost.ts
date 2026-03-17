import { PublishIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import * as sanity from "sanity";

import { getCurrentPostDocument } from "./postActionUtils";

export const crosspostAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
  const doc = getCurrentPostDocument(props);
  const status = doc?.status;
  const crossposting = doc?.crossposting;
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
    title: "Trigger the Sanity function to retry any configured platform publishes safely.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            "crossposting.manualTriggerAt": new Date().toISOString(),
          },
        },
      ]);
      toast.push({
        status: "success",
        title: "Cross-post retry queued",
        description: "The publish function will re-check enabled platforms for this article.",
      });
    },
  };
};
