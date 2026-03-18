export type PostReadinessSnapshot = {
  status?: string;
  title?: string;
  summary?: string;
  publishedAt?: string;
  evergreenStatus?: string;
  keyTakeaways?: unknown[];
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
  distributionPackage?: {
    newsletterBlurb?: string;
    shortSocialPost?: string;
    ctaLabel?: string;
  };
};

export type ReadinessItemId =
  | "summary"
  | "media"
  | "seo"
  | "distribution"
  | "takeaways"
  | "refresh";

export type ReadinessItem = {
  id: ReadinessItemId;
  label: string;
  title: string;
  requiredForApproval: boolean;
  complete: boolean;
};

const REFRESH_WINDOW_DAYS = 180;

function isOlderThanRefreshWindow(publishedAt?: string): boolean {
  if (!publishedAt) return false;

  const publishedDate = new Date(publishedAt);
  if (Number.isNaN(publishedDate.getTime())) return false;

  return Date.now() - publishedDate.getTime() > REFRESH_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export function getPostReadinessItems(doc: PostReadinessSnapshot): ReadinessItem[] {
  const hasSummary = Boolean(doc.summary?.trim());
  const hasHeroImage = Boolean(doc.heroImage?.asset?._ref);
  const hasHeroAlt = Boolean(doc.heroImage?.alt?.trim());
  const hasMetaTitle = Boolean(doc.seo?.metaTitle?.trim());
  const hasMetaDescription = Boolean(doc.seo?.metaDescription?.trim());
  const hasSocialImage = Boolean(doc.seo?.socialImage?.asset?._ref);
  const hasNewsletterBlurb = Boolean(doc.distributionPackage?.newsletterBlurb?.trim());
  const hasShortSocial = Boolean(doc.distributionPackage?.shortSocialPost?.trim());
  const hasCtaLabel = Boolean(doc.distributionPackage?.ctaLabel?.trim());
  const takeawayCount = Array.isArray(doc.keyTakeaways)
    ? doc.keyTakeaways.filter((value) => typeof value === "string" && value.trim().length > 0)
        .length
    : 0;

  const refreshDue = isOlderThanRefreshWindow(doc.publishedAt);
  const refreshComplete = !refreshDue || doc.evergreenStatus === "timeless";

  return [
    {
      id: "summary",
      label: "Summary",
      title: hasSummary
        ? "Summary is in place."
        : "Add a summary before sending this through workflow.",
      requiredForApproval: true,
      complete: hasSummary,
    },
    {
      id: "media",
      label: "Hero Media",
      title:
        hasHeroImage && hasHeroAlt
          ? "Hero image and alt text are in place."
          : "Add a hero image with descriptive alt text.",
      requiredForApproval: true,
      complete: hasHeroImage && hasHeroAlt,
    },
    {
      id: "seo",
      label: "SEO",
      title:
        hasMetaTitle && hasMetaDescription && hasSocialImage
          ? "SEO metadata is complete."
          : "Add meta title, meta description, and a social image.",
      requiredForApproval: true,
      complete: hasMetaTitle && hasMetaDescription && hasSocialImage,
    },
    {
      id: "distribution",
      label: "Distribution",
      title:
        hasNewsletterBlurb && hasShortSocial && hasCtaLabel
          ? "Distribution package is ready."
          : "Generate a newsletter blurb, a short social post, and a CTA label.",
      requiredForApproval: false,
      complete: hasNewsletterBlurb && hasShortSocial && hasCtaLabel,
    },
    {
      id: "takeaways",
      label: "Key Takeaways",
      title:
        takeawayCount > 0
          ? "Key takeaways are ready."
          : "Add 2-4 takeaways to strengthen the article summary surface.",
      requiredForApproval: false,
      complete: takeawayCount > 0,
    },
    {
      id: "refresh",
      label: "Refresh Review",
      title: refreshDue
        ? "This published article is due for a refresh review."
        : "No refresh review is currently due.",
      requiredForApproval: false,
      complete: refreshComplete,
    },
  ];
}

export function getMissingReadinessItems(
  doc: PostReadinessSnapshot,
  options: { includeRecommended?: boolean } = {},
): ReadinessItem[] {
  return getPostReadinessItems(doc).filter(
    (item) => !item.complete && (options.includeRecommended ? true : item.requiredForApproval),
  );
}

export function isPostReadyForApproval(doc: PostReadinessSnapshot): boolean {
  return getMissingReadinessItems(doc).length === 0;
}
