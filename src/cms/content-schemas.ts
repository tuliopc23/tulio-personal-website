/**
 * Zod schemas shared by `src/content.config.ts` and CMS integrity tests.
 * Keeping a single source of truth prevents drift between Astro builds and CI validation.
 */
import { z } from "astro/zod";

export const seoSchema = z.object({
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoCanonicalUrl: z.string().url().optional().or(z.literal("")),
  seoNoIndex: z.boolean().optional(),
  seoJsonLd: z.string().optional(),
});

export const postSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    publishedAt: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    audience: z.string().optional(),
    intent: z.string().optional(),
    targetKeyword: z.string().optional(),
    evergreenStatus: z.string().optional(),
    series: z.string().optional(),
    coverVariant: z.enum(["default", "cinematic", "minimal"]).optional().default("default"),
    categorySlugs: z.array(z.string()).optional().default([]),
    topicSlugs: z.array(z.string()).optional().default([]),
    seriesSlugs: z.array(z.string()).optional().default([]),
    keyTakeaways: z.array(z.string()).optional(),
    pullQuotes: z
      .array(
        z.object({
          quote: z.string(),
          attribution: z.string().optional(),
          sourceUrl: z.string().optional(),
        }),
      )
      .optional(),
    furtherReading: z
      .array(
        z.object({
          title: z.string(),
          href: z.string(),
          note: z.string().optional(),
        }),
      )
      .optional(),
    sourceReferences: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          sourceType: z.string().optional(),
          author: z.string().optional(),
          capturedExcerpt: z.string().optional(),
        }),
      )
      .optional(),
    distributionPackage: z
      .object({
        newsletterBlurb: z.string().optional(),
        shortSocialPost: z.string().optional(),
        longSocialPost: z.string().optional(),
        teaserQuote: z.string().optional(),
        ctaLabel: z.string().optional(),
      })
      .optional(),
    authorName: z.string().optional(),
    authorSlug: z.string().optional(),
    authorRole: z.string().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    heroCaption: z.string().optional(),
  })
  .merge(seoSchema);

export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  role: z.string(),
  summary: z.string(),
  status: z.enum(["Live", "Maintained", "Exploration"]),
  href: z.string(),
  cta: z.string(),
  releaseDate: z.coerce.date().optional(),
  categories: z.array(z.string()).optional().default([]),
  stack: z.array(z.string()).optional(),
  order: z.number().optional(),
  coverImageUrl: z.string().optional().nullable(),
  coverImageAlt: z.string().optional().nullable(),
});

export const taxonomySchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  archiveIntro: z.string().nullable().optional(),
});

/** Keystatic site singletons — enough to catch missing/empty critical fields before deploy. */
export const blogPageSingletonSchema = z.object({
  pageDescription: z.string().min(1),
  heroTitle: z.string().min(1),
  allArticlesLabel: z.string().min(1),
});

export const aboutPageSingletonSchema = z.object({
  seoDescription: z.string().min(1),
  heroTitle: z.string().min(1),
  sections: z.array(z.unknown()).optional(),
});

export const projectsPageSingletonSchema = z.object({
  description: z.string().min(1),
  heroTitle: z.string().min(1),
  contactEmail: z.string().min(1),
});

export const featuredGithubSingletonSchema = z.object({
  repos: z
    .array(
      z.object({
        id: z.string().min(1),
        repoFullName: z.string().min(1),
        featured: z.boolean().optional(),
        visibleInProofOfWork: z.boolean().optional(),
      }),
    )
    .min(1),
});
