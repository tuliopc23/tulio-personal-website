import { SparklesIcon } from "@sanity/icons";
import * as sanity from "sanity";

export const refreshTagsAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const doc = props.draft || props.published;
  const hasContent = Boolean(
    doc?.title || doc?.summary || (Array.isArray(doc?.content) && doc.content.length),
  );

  if (!hasContent) {
    return null;
  }

  return {
    label: "Refresh Tags",
    icon: SparklesIcon,
    title: "Request a fresh AI tag pass using the Sanity document function.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            tagRefreshRequestedAt: new Date().toISOString(),
          },
        },
      ]);
      props.onComplete();
    },
  };
};
