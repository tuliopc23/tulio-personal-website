import type { ReadinessItem } from "../lib/postReadiness";

export type PostActionDocument = {
  status?: string;
  title?: string;
  summary?: string;
  publishedAt?: string;
  evergreenStatus?: string;
  keyTakeaways?: unknown[];
  content?: unknown[];
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
  crossposting?: {
    devto?: {
      enabled?: boolean;
    };
    hashnode?: {
      enabled?: boolean;
    };
    linkedin?: {
      enabled?: boolean;
    };
  };
};

export function getCurrentPostDocument(props: {
  draft?: unknown;
  published?: unknown;
}): PostActionDocument | null {
  return (props.draft || props.published || null) as PostActionDocument | null;
}

export function formatReadinessList(items: ReadinessItem[]): string {
  return items.map((item) => `• ${item.label}`).join("\n");
}
