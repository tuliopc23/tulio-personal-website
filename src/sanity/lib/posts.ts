import type { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "astro-portabletext";

import { loadQuery } from "./load-query";

export interface SanityImageWithMetadata {
  url: string | null;
  width?: number;
  height?: number;
  lqip?: string | null;
  alt?: string | null;
  caption?: string | null;
}

export interface PostSeoMeta {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  jsonLd?: string | null;
  socialImage?: SanityImageWithMetadata | null;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  avatar?: {
    url: string | null;
    alt?: string | null;
  } | null;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
}

export interface PostSummary {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  heroImage?: SanityImageWithMetadata | null;
  author?: Author | null;
  categories?: Category[] | null;
  readingTimeMinutes?: number;
  seo?: PostSeoMeta | null;
  featured?: boolean;
}

export interface PostDetail extends PostSummary {
  content: PortableTextBlock[];
  readingTimeMinutes: number;
}

export interface PostLocator {
  slug: string;
  publishedAt: string;
}

const HERO_IMAGE_PROJECTION = `
  "heroImage": heroImage{
    alt,
    caption,
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
`;

const SEO_PROJECTION = `
  "seo": seo{
    metaTitle,
    metaDescription,
    canonicalUrl,
    "noIndex": coalesce(noIndex, false),
    "jsonLd": jsonLd.code,
    "socialImage": socialImage{
      alt,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`;

const AUTHOR_PROJECTION = `
  "author": author->{
    _id,
    name,
    "slug": slug.current,
    "avatar": avatar{
      alt,
      "url": asset->url
    }
  }
`;

const CATEGORIES_PROJECTION = `
  "categories": categories[]->{
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

const SUMMARY_PROJECTION = `{
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  tags,
  featured,
  ${HERO_IMAGE_PROJECTION},
  ${AUTHOR_PROJECTION},
  ${CATEGORIES_PROJECTION},
  ${SEO_PROJECTION}
}`;

const DETAIL_PROJECTION = `{
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  tags,
  featured,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, asset->altText),
      caption,
    }
  },
  ${HERO_IMAGE_PROJECTION},
  ${AUTHOR_PROJECTION},
  ${CATEGORIES_PROJECTION},
  ${SEO_PROJECTION}
}`;

export async function getAllPostSlugs(): Promise<string[]> {
  const { data } = await loadQuery<Array<{ slug: string }>>({
    query: `*[_type == "post" && defined(slug.current) && publishedAt <= now() && !coalesce(seo.noIndex, false)]{ "slug": slug.current }`,
  });
  return data?.map((entry) => entry.slug) ?? [];
}

export async function getAllPostLocators(): Promise<PostLocator[]> {
  const { data } = await loadQuery<PostLocator[]>({
    query: `*[_type == "post" && defined(slug.current) && publishedAt <= now() && !coalesce(seo.noIndex, false)] | order(publishedAt desc){ "slug": slug.current, "publishedAt": coalesce(_updatedAt, publishedAt) }`,
  });

  return data ?? [];
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const { data } = await loadQuery<PostSummary[]>({
    query: `*[_type == "post" && defined(slug.current) && publishedAt <= now() && !coalesce(seo.noIndex, false)] | order(publishedAt desc)${SUMMARY_PROJECTION}`,
  });

  return data ?? [];
}

export async function getFeaturedPosts(): Promise<PostSummary[]> {
  const { data } = await loadQuery<PostSummary[]>({
    query: `*[_type == "post" && defined(slug.current) && featured == true && publishedAt <= now() && !coalesce(seo.noIndex, false)] | order(publishedAt desc)${SUMMARY_PROJECTION}`,
  });

  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const { data } = await loadQuery<PostDetail | null>({
    query: `*[_type == "post" && slug.current == $slug && !coalesce(seo.noIndex, false)][0]${DETAIL_PROJECTION}`,
    params: { slug },
  });

  if (!data) return null;

  const readingTimeMinutes = calculateReadingTimeMinutes(data.content);

  return {
    ...data,
    readingTimeMinutes,
  };
}

export async function getRecentPosts(excludeSlug: string, limit = 3): Promise<PostSummary[]> {
  const { data } = await loadQuery<PostSummary[]>({
    query: `*[_type == "post" && defined(slug.current) && slug.current != $slug && publishedAt <= now() && !coalesce(seo.noIndex, false)] | order(publishedAt desc)[0...$limit]${SUMMARY_PROJECTION}`,
    params: { slug: excludeSlug, limit },
  });

  return data ?? [];
}

export function calculateReadingTimeMinutes(blocks: PortableTextBlock[]): number {
  if (!Array.isArray(blocks)) return 1;
  const plainText = toPlainText(blocks);
  const words = plainText.split(/\s+/).filter(Boolean);
  const minutes = Math.max(1, Math.round(words.length / 225));
  return minutes;
}

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await loadQuery<Category[]>({
    query: `*[_type == "category"] | order(title asc){ _id, title, "slug": slug.current, description }`,
  });

  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await loadQuery<Category | null>({
    query: `*[_type == "category" && slug.current == $slug][0]{ _id, title, "slug": slug.current, description }`,
    params: { slug },
  });

  return data ?? null;
}

export async function getPostsByCategory(categorySlug: string): Promise<PostSummary[]> {
  const { data } = await loadQuery<PostSummary[]>({
    query: `*[_type == "post" && defined(slug.current) && publishedAt <= now() && !coalesce(seo.noIndex, false) && $categorySlug in categories[]->slug.current] | order(publishedAt desc)${SUMMARY_PROJECTION}`,
    params: { categorySlug },
  });

  return data ?? [];
}
