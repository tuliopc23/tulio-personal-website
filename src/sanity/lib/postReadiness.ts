export type PostReadinessSnapshot = {
  status?: string;
  title?: string;
  summary?: string;
  hook?: string;
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
};

export type ReadinessItem = {
  id: "summary" | "hook" | "hero" | "seo" | "takeaways";
  label: string;
  title: string;
  requiredForApproval: boolean;
  complete: boolean;
};

export function getPostReadinessItems(doc: PostReadinessSnapshot): ReadinessItem[] {
  const hasSummary = Boolean(doc.summary?.trim());
  const hasHook = Boolean(doc.hook?.trim());
  const hasHeroImage = Boolean(doc.heroImage?.asset?._ref);
  const hasHeroAlt = Boolean(doc.heroImage?.alt?.trim());
  const hasMetaTitle = Boolean(doc.seo?.metaTitle?.trim());
  const hasMetaDescription = Boolean(doc.seo?.metaDescription?.trim());
  const hasSocialImage = Boolean(doc.seo?.socialImage?.asset?._ref);
  const takeawayCount = Array.isArray(doc.keyTakeaways)
    ? doc.keyTakeaways.filter((value) => typeof value === "string" && value.trim().length > 0)
        .length
    : 0;

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
      id: "hook",
      label: "Hook",
      title: hasHook ? "Hook is in place." : "Add a short hook for cards and the article hero.",
      requiredForApproval: true,
      complete: hasHook,
    },
    {
      id: "hero",
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
      id: "takeaways",
      label: "Key Takeaways",
      title:
        takeawayCount > 0
          ? "Key takeaways are ready."
          : "Add 2-4 takeaways to strengthen the article summary surface.",
      requiredForApproval: false,
      complete: takeawayCount > 0,
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
