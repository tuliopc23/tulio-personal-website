import { getCollection } from "astro:content";

import type { PostSummary } from "./posts";
import { getAllPosts } from "./posts";

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

export async function getAllTopicSlugs(): Promise<string[]> {
  const topics = await getCollection("taxonomyTopics");
  return topics.map((t) => t.data.slug);
}

export async function getTopicBySlug(slug: string): Promise<EditorialTopic | null> {
  const topics = await getCollection("taxonomyTopics");
  const t = topics.find((entry) => entry.data.slug === slug);
  if (!t) return null;
  return {
    _id: t.id,
    title: t.data.title,
    slug: t.data.slug,
    description: t.data.description ?? null,
    archiveIntro: t.data.archiveIntro ?? null,
  };
}

export async function getPostsByTopicSlug(topicSlug: string): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.topics?.some((t) => t.slug === topicSlug));
}

export async function getAllSeriesSlugs(): Promise<string[]> {
  const series = await getCollection("taxonomySeries");
  return series.map((s) => s.data.slug);
}

export async function getSeriesBySlug(slug: string): Promise<EditorialSeries | null> {
  const series = await getCollection("taxonomySeries");
  const s = series.find((entry) => entry.data.slug === slug);
  if (!s) return null;
  return {
    _id: s.id,
    title: s.data.title,
    slug: s.data.slug,
    description: s.data.description ?? null,
    positioning:
      "positioning" in s.data ? ((s.data as { positioning?: string }).positioning ?? null) : null,
  };
}

export async function getPostsBySeriesSlug(seriesSlug: string): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter(
    (p) =>
      p.relatedSeries?.some((s) => s.slug === seriesSlug) ||
      p.series?.toLowerCase().replace(/\s+/g, "-") === seriesSlug,
  );
}
