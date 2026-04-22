import type { CollectionEntry } from "astro:content";
import fs from "node:fs/promises";
import path from "node:path";
import { getCollection, render } from "astro:content";
import { markdownToPlainText } from "../markdown";

export { calculateReadingTimeMinutes } from "../reading-time";

export interface HeroImage {
  /** Astro image metadata (from content collection `image()` helper). */
  src: unknown;
  alt?: string | null;
  caption?: string | null;
}

export interface PostSeoMeta {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  jsonLd?: string | null;
  socialImage?: {
    url: string;
    alt?: string | null;
    width?: number;
    height?: number;
  } | null;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  role?: string | null;
  expertise?: string[] | null;
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
  archiveIntro?: string | null;
}

export interface Topic {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  archiveIntro?: string | null;
}

export interface SeriesReference {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
}

export interface SourceReference {
  _id: string;
  title: string;
  url: string;
  sourceType?: string | null;
  author?: string | null;
  capturedExcerpt?: string | null;
}

export interface PostSummary {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  audience?: string | null;
  intent?: string | null;
  targetKeyword?: string | null;
  evergreenStatus?: string | null;
  keyTakeaways?: string[] | null;
  pullQuotes?: Array<{
    quote: string;
    attribution?: string | null;
    sourceUrl?: string | null;
  }> | null;
  furtherReading?: Array<{
    title: string;
    href: string;
    note?: string | null;
  }> | null;
  coverVariant?: "default" | "cinematic" | "minimal" | null;
  series?: string | null;
  heroImage?: HeroImage | null;
  author?: Author | null;
  categories?: Category[] | null;
  topics?: Topic[] | null;
  relatedSeries?: SeriesReference[] | null;
  sourceReferences?: SourceReference[] | null;
  distributionPackage?: {
    newsletterBlurb?: string | null;
    shortSocialPost?: string | null;
    longSocialPost?: string | null;
    teaserQuote?: string | null;
    ctaLabel?: string | null;
  } | null;
  readingTimeMinutes?: number;
  seo?: PostSeoMeta | null;
  featured?: boolean;
}

export interface PostDetail extends PostSummary {
  updatedAt: string;
  markdownContent?: string | null;
  readingTimeMinutes: number;
}

export interface PostLocator {
  slug: string;
  publishedAt: string;
}

type PostEntry = CollectionEntry<"posts">;

function postPath(slug: string): string {
  return path.join(process.cwd(), "src/content/posts", slug, "index.mdx");
}

async function rawBodyAfterFrontmatter(slug: string): Promise<string> {
  try {
    const raw = await fs.readFile(postPath(slug), "utf8");
    return raw.replace(/^---[\s\S]*?---\s*/, "").trim();
  } catch {
    return "";
  }
}

async function bodyPlainText(slug: string): Promise<string> {
  const raw = await rawBodyAfterFrontmatter(slug);
  return markdownToPlainText(raw);
}

async function taxonomyMaps() {
  const [cats, topics, series] = await Promise.all([
    getCollection("taxonomyCategories"),
    getCollection("taxonomyTopics"),
    getCollection("taxonomySeries"),
  ]);

  const catMap = new Map<string, Category>();
  for (const c of cats) {
    catMap.set(c.data.slug, {
      _id: c.id,
      title: c.data.title,
      slug: c.data.slug,
      description: c.data.description ?? null,
      archiveIntro: c.data.archiveIntro ?? null,
    });
  }

  const topicMap = new Map<string, Topic>();
  for (const t of topics) {
    topicMap.set(t.data.slug, {
      _id: t.id,
      title: t.data.title,
      slug: t.data.slug,
      description: t.data.description ?? null,
      archiveIntro: t.data.archiveIntro ?? null,
    });
  }

  const seriesMap = new Map<string, SeriesReference>();
  for (const s of series) {
    seriesMap.set(s.data.slug, {
      _id: s.id,
      title: s.data.title,
      slug: s.data.slug,
      description: s.data.description ?? null,
    });
  }

  return { catMap, topicMap, seriesMap };
}

async function mapEntry(
  entry: PostEntry,
  maps: Awaited<ReturnType<typeof taxonomyMaps>>,
): Promise<PostSummary> {
  const d = entry.data;
  const publishedAt =
    d.publishedAt instanceof Date ? d.publishedAt.toISOString() : String(d.publishedAt);

  const categories = (d.categorySlugs ?? [])
    .map((s) => maps.catMap.get(s))
    .filter((c): c is Category => Boolean(c));

  const topics = (d.topicSlugs ?? [])
    .map((s) => maps.topicMap.get(s))
    .filter((t): t is Topic => Boolean(t));

  const relatedSeries = (d.seriesSlugs ?? [])
    .map((s) => maps.seriesMap.get(s))
    .filter((x): x is SeriesReference => Boolean(x));

  const heroImage: HeroImage | null = d.heroImage
    ? {
        src: d.heroImage,
        alt: "heroAlt" in d && typeof d.heroAlt === "string" ? d.heroAlt : null,
        caption: d.heroCaption ?? null,
      }
    : null;

  const author: Author | null =
    d.authorName || d.authorSlug
      ? {
          _id: d.authorSlug ?? "author",
          name: d.authorName ?? "Tulio Cunha",
          slug: d.authorSlug ?? "tulio-cunha",
          role: d.authorRole ?? null,
          expertise: null,
          avatar: null,
        }
      : null;

  const plain = await bodyPlainText(d.slug);
  const readingTimeMinutes = Math.max(
    1,
    Math.round(plain.split(/\s+/).filter(Boolean).length / 225),
  );

  const seo: PostSeoMeta | null = {
    metaTitle: d.seoMetaTitle ?? null,
    metaDescription: d.seoMetaDescription ?? null,
    canonicalUrl: d.seoCanonicalUrl?.trim() ? d.seoCanonicalUrl : null,
    noIndex: d.seoNoIndex ?? false,
    jsonLd: d.seoJsonLd ?? null,
    socialImage: null,
  };

  return {
    _id: entry.id,
    title: d.title,
    summary: d.summary,
    slug: d.slug,
    publishedAt,
    tags: d.tags ?? [],
    audience: d.audience ?? null,
    intent: d.intent ?? null,
    targetKeyword: d.targetKeyword ?? null,
    evergreenStatus: d.evergreenStatus ?? null,
    keyTakeaways: d.keyTakeaways,
    pullQuotes: d.pullQuotes,
    furtherReading: d.furtherReading,
    coverVariant: d.coverVariant,
    series: d.series ?? null,
    heroImage,
    author,
    categories,
    topics,
    relatedSeries,
    sourceReferences: (d.sourceReferences ?? null) as SourceReference[] | null,
    distributionPackage: d.distributionPackage ?? null,
    readingTimeMinutes,
    seo,
    featured: d.featured,
  };
}

async function publishedEntries(): Promise<PostEntry[]> {
  const entries = await getCollection("posts");
  const now = Date.now();

  const list: PostEntry[] = [];
  for (const entry of entries) {
    const d = entry.data;
    const pub =
      d.publishedAt instanceof Date ? d.publishedAt.getTime() : new Date(d.publishedAt).getTime();
    if (pub > now) continue;
    if (d.seoNoIndex) continue;
    list.push(entry);
  }

  list.sort((a, b) => {
    const ta =
      a.data.publishedAt instanceof Date
        ? a.data.publishedAt.getTime()
        : new Date(a.data.publishedAt).getTime();
    const tb =
      b.data.publishedAt instanceof Date
        ? b.data.publishedAt.getTime()
        : new Date(b.data.publishedAt).getTime();
    return tb - ta;
  });

  return list;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const entries = await publishedEntries();
  return entries.map((e) => e.data.slug);
}

export async function getAllPostLocators(): Promise<PostLocator[]> {
  const entries = await publishedEntries();
  return entries.map((e) => ({
    slug: e.data.slug,
    publishedAt:
      e.data.publishedAt instanceof Date
        ? e.data.publishedAt.toISOString()
        : new Date(e.data.publishedAt).toISOString(),
  }));
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const entries = await publishedEntries();
  const maps = await taxonomyMaps();
  return Promise.all(entries.map((e) => mapEntry(e, maps)));
}

export async function getAllPostsForFeed(): Promise<PostDetail[]> {
  const entries = await publishedEntries();
  const maps = await taxonomyMaps();
  const list = await Promise.all(entries.map((e) => mapEntry(e, maps)));
  return Promise.all(
    list.map(async (summary) => {
      const rawSource = await rawBodyAfterFrontmatter(summary.slug);
      const plain = markdownToPlainText(rawSource);
      const rt = Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 225));
      return detailFromSummary(summary, rawSource, rt);
    }),
  );
}

function detailFromSummary(
  summary: PostSummary,
  /** Raw MDX/Markdown body (after frontmatter) for RSS HTML; reading time uses plain length elsewhere. */
  articleSource: string,
  rt: number,
): PostDetail {
  return {
    ...summary,
    updatedAt: summary.publishedAt,
    markdownContent: articleSource,
    readingTimeMinutes: rt,
  };
}

export async function getFeaturedPosts(): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.featured);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const entries = await publishedEntries();
  const entry = entries.find((e) => e.data.slug === slug);
  if (!entry) return null;
  const maps = await taxonomyMaps();
  const summary = await mapEntry(entry, maps);
  const rawSource = await rawBodyAfterFrontmatter(slug);
  const plain = markdownToPlainText(rawSource);
  const rt = Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 225));
  return detailFromSummary(summary, rawSource, rt);
}

export async function getRecentPosts(excludeSlug: string, limit = 3): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export async function getAllCategories(): Promise<Category[]> {
  const cats = await getCollection("taxonomyCategories");
  return cats.map((c) => ({
    _id: c.id,
    title: c.data.title,
    slug: c.data.slug,
    description: c.data.description ?? null,
    archiveIntro: c.data.archiveIntro ?? null,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getAllCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

export async function getPostsByCategory(categorySlug: string): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.categories?.some((c) => c.slug === categorySlug));
}

/** Renders the MDX body for a published post (for article pages). */
export async function renderPostMdx(slug: string) {
  const entries = await publishedEntries();
  const entry = entries.find((e) => e.data.slug === slug);
  if (!entry) return null;
  return render(entry);
}
