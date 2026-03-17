import { SparklesIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import * as sanity from "sanity";

import { getCurrentPostDocument } from "./postActionUtils";

export const refreshTagsAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const toast = useToast();
  const doc = getCurrentPostDocument(props);
  const hasContent = Boolean(
    doc?.title || doc?.summary || (Array.isArray(doc?.content) && doc.content.length),
  );

  if (!hasContent) {
    return null;
  }

  return {
    label: "Refresh Tags",
    icon: SparklesIcon,
    title: "Request a fresh AI tag pass from the Sanity auto-tag function.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            tagRefreshRequestedAt: new Date().toISOString(),
          },
        },
      ]);
      toast.push({
        status: "success",
        title: "Tag refresh requested",
        description: "The auto-tag function will generate a new tag pass for this article.",
      });
    },
  };
};
