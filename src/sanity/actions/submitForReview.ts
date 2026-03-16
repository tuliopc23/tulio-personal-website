import { ClockIcon } from "@sanity/icons";
import * as sanity from "sanity";

export const submitForReviewAction: sanity.DocumentActionComponent = (props) => {
  const documentId = props.id.replace(/^drafts\./, "");
  const operations = sanity.useDocumentOperation(documentId, "post");

  // Only show for draft posts
  const status = (props.draft || props.published)?.status;
  if (status !== "draft") {
    return null;
  }

  const onHandle = () => {
    operations.patch.execute([
      {
        set: {
          status: "in-review",
          lastReviewedAt: new Date().toISOString(),
        },
      },
    ]);
    props.onComplete();
  };

  return {
    label: "Submit for Review",
    icon: ClockIcon,
    onHandle,
    title: "Move this article into editorial review.",
  };
};
