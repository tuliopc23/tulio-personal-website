import { PublishIcon } from "@sanity/icons";
import * as sanity from "sanity";

export const publishApprovedAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");
  const status = (props.draft || props.published)?.status;

  if (status !== "approved") {
    return null;
  }

  return {
    action: "publish",
    label: "Publish Live",
    icon: PublishIcon,
    tone: "positive",
    title: "Publish the approved article to the public site.",
    onHandle: () => {
      operations.patch.execute([
        {
          set: {
            status: "published",
            publishedAt: new Date().toISOString(),
          },
        },
      ]);
      operations.publish.execute();
      props.onComplete();
    },
  };
};
