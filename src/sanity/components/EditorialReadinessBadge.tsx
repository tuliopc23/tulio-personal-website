import type { DocumentBadgeComponent, DocumentBadgeDescription } from "sanity";

type PostReadinessSnapshot = {
  status?: string;
  summary?: string;
  heroImage?: {
    alt?: string;
    asset?: {
      _ref?: string;
    };
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    socialImage?: {
      asset?: {
        _ref?: string;
      };
    };
  };
};

function getReadiness(doc: PostReadinessSnapshot): DocumentBadgeDescription | null {
  const hasSummary = Boolean(doc.summary?.trim());
  const hasHeroImage = Boolean(doc.heroImage?.asset?._ref);
  const hasHeroAlt = Boolean(doc.heroImage?.alt?.trim());
  const hasMetaTitle = Boolean(doc.seo?.metaTitle?.trim());
  const hasMetaDescription = Boolean(doc.seo?.metaDescription?.trim());
  const hasSocialImage = Boolean(doc.seo?.socialImage?.asset?._ref);

  if (!hasSummary) {
    return { label: "Needs Summary", color: "warning", title: "Add a summary before review." };
  }

  if (!hasHeroImage || !hasHeroAlt) {
    return {
      label: "Needs Hero Media",
      color: "warning",
      title: "Add a hero image with descriptive alt text.",
    };
  }

  if (!hasMetaTitle || !hasMetaDescription || !hasSocialImage) {
    return { label: "Needs SEO", color: "primary", title: "SEO metadata is incomplete." };
  }

  if (doc.status === "approved") {
    return {
      label: "Ready To Publish",
      color: "success",
      title: "Editorial metadata is complete.",
    };
  }

  return null;
}

export const EditorialReadinessBadge: DocumentBadgeComponent = (props) => {
  const doc = (props.draft || props.published) as PostReadinessSnapshot | null;
  if (!doc) return null;
  return getReadiness(doc);
};
