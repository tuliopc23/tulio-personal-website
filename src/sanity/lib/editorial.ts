import { loadQuery } from "./load-query";
import type { PostSummary } from "./posts";

export interface EditorialTopic {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  archiveIntro?: string | null;
}

export interface EditorialSeries {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  positioning?: string | null;
}

const TOPIC_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  description,
  archiveIntro
}`;

const SERIES_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  description,
  positioning
}`;

const POST_CARD_PROJECTION = `{
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  tags,
  featured,
  keyTakeaways,
  coverVariant,
  series,
  "heroImage": heroImage{
    alt,
    caption,
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  "author": author->{
    _id,
    name,
    "slug": slug.current,
    role,
    expertise,
    "avatar": avatar{
      alt,
      "url": asset->url
    }
  },
  "categories": categories[]->{
    _id,
    title,
    "slug": slug.current,
    description,
    archiveIntro
  },
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current,
    description,
    archiveIntro
  },
  "relatedSeries": relatedSeries[]->{
    _id,
    title,
    "slug": slug.current,
    description
  },
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
}`;

export async function getAllTopicSlugs(): Promise<string[]> {
  const { data } = await loadQuery<Array<{ slug: string }>>({
    query: `*[_type == "topic" && defined(slug.current)]{ "slug": slug.current }`,
    queryLabel: "topic slugs",
  });

  return data?.map((entry) => entry.slug) ?? [];
}

export async function getTopicBySlug(slug: string): Promise<EditorialTopic | null> {
  const { data } = await loadQuery<EditorialTopic | null>({
    query: `*[_type == "topic" && slug.current == $slug][0]${TOPIC_PROJECTION}`,
    params: { slug },
    queryLabel: `topic by slug (${slug})`,
  });

  return data ?? null;
}

export async function getPostsByTopicSlug(slug: string): Promise<PostSummary[]> {
  const { data } = await loadQuery<PostSummary[]>({
    query: `*[_type == "post" && defined(slug.current) && status == "published" && publishedAt <= now() && !coalesce(seo.noIndex, false) && $slug in topics[]->slug.current] | order(publishedAt desc)${POST_CARD_PROJECTION}`,
    params: { slug },
    queryLabel: `posts by topic (${slug})`,
  });

  return data ?? [];
}

export async function getAllSeriesSlugs(): Promise<string[]> {
  const { data } = await loadQuery<Array<{ slug: string }>>({
    query: `*[_type == "series" && defined(slug.current)]{ "slug": slug.current }`,
    queryLabel: "series slugs",
  });

  return data?.map((entry) => entry.slug) ?? [];
}

export async function getSeriesBySlug(slug: string): Promise<EditorialSeries | null> {
  const { data } = await loadQuery<EditorialSeries | null>({
    query: `*[_type == "series" && slug.current == $slug][0]${SERIES_PROJECTION}`,
    params: { slug },
    queryLabel: `series by slug (${slug})`,
  });

  return data ?? null;
}

export async function getPostsBySeriesSlug(slug: string): Promise<PostSummary[]> {
  const { data } = await loadQuery<PostSummary[]>({
    query: `*[_type == "post" && defined(slug.current) && status == "published" && publishedAt <= now() && !coalesce(seo.noIndex, false) && ($slug in relatedSeries[]->slug.current || series match $seriesTitle)] | order(publishedAt desc)${POST_CARD_PROJECTION}`,
    params: { slug, seriesTitle: slug.replace(/-/g, " ") },
    queryLabel: `posts by series (${slug})`,
  });

  return data ?? [];
}
