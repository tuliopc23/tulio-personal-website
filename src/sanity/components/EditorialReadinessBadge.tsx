import type { DocumentBadgeComponent, DocumentBadgeDescription } from "sanity";

import {
  getMissingReadinessItems,
  isPostReadyForApproval,
  type PostReadinessSnapshot,
} from "../lib/postReadiness";

function getReadiness(doc: PostReadinessSnapshot): DocumentBadgeDescription | null {
  const missingRequired = getMissingReadinessItems(doc);
  if (missingRequired.length > 0) {
    const firstMissing = missingRequired[0];
    return {
      label: `Needs ${firstMissing.label}`,
      color: firstMissing.id === "seo" ? "primary" : "warning",
      title: firstMissing.title,
    };
  }

  const missingRecommended = getMissingReadinessItems(doc, { includeRecommended: true }).filter(
    (item) => !item.requiredForApproval,
  );
  if (missingRecommended.length > 0) {
    return {
      label:
        missingRecommended[0].id === "refresh"
          ? "Refresh Opportunity"
          : `Recommended: ${missingRecommended[0].label}`,
      color: missingRecommended[0].id === "refresh" ? "warning" : "primary",
      title: missingRecommended[0].title,
    };
  }

  if (doc.status === "approved" || isPostReadyForApproval(doc)) {
    return {
      label: "Ready To Publish",
      color: "success",
      title: "Approval requirements are complete and this article is ready to go live.",
    };
  }

  return null;
}

export const EditorialReadinessBadge: DocumentBadgeComponent = (props) => {
  const doc = (props.draft || props.published) as PostReadinessSnapshot | null;
  if (!doc) return null;
  return getReadiness(doc);
};
