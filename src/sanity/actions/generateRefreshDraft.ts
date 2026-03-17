import { SyncIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import * as sanity from "sanity";

import { getCurrentPostDocument } from "./postActionUtils";

export const generateRefreshDraftAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
  const doc = getCurrentPostDocument(props);

  if (doc?.status !== "published") {
    return null;
  }

  return {
    label: "Generate Refresh Review",
    icon: SyncIcon,
    title: "Generate an AI review for refreshing evergreen content.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            refreshRequestedAt: new Date().toISOString(),
            evergreenStatus: "refreshing",
          },
        },
      ]);
      toast.push({
        status: "success",
        title: "Refresh review requested",
        description: "The Sanity function will generate a freshness review for this article.",
      });
    },
  };
};
