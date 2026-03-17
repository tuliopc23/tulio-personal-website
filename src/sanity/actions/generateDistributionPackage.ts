import { SparklesIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import * as sanity from "sanity";

import { getCurrentPostDocument } from "./postActionUtils";

export const generateDistributionPackageAction: sanity.DocumentActionComponent = (props) => {
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
    label: "Generate Distribution Package",
    icon: SparklesIcon,
    title: "Generate newsletter and social copy from the Sanity function.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            distributionRequestedAt: new Date().toISOString(),
          },
        },
      ]);
      toast.push({
        status: "success",
        title: "Distribution package requested",
        description: "The Sanity function will refresh the reusable promo copy for this article.",
      });
    },
  };
};
