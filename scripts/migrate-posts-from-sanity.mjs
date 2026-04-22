/**
 * One-shot migration: fetch published posts from Sanity and write MDX with YAML frontmatter.
 */
import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { stringify as stringifyYaml } from "yaml";
import "dotenv/config";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_READ_TOKEN?.trim();

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: true,
  ...(token ? { token } : {}),
});

const query = `*[_type == "post" && status == "published" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  summary,
  publishedAt,
  tags,
  featured,
  audience,
  intent,
  targetKeyword,
  evergreenStatus,
  series,
  coverVariant,
  keyTakeaways,
  "categorySlugs": categories[]->slug.current,
  "topicSlugs": topics[]->slug.current,
  "seriesSlugs": relatedSeries[]->slug.current,
  pullQuotes[]{quote, attribution, sourceUrl},
  furtherReading[]{title, href, note},
  sourceReferences[]{title, url, sourceType, author, capturedExcerpt},
  distributionPackage,
  markdownContent,
  "seoMetaTitle": seo.metaTitle,
  "seoMetaDescription": seo.metaDescription,
  "seoCanonicalUrl": seo.canonicalUrl,
  "seoNoIndex": seo.noIndex,
  "seoJsonLd": seo.jsonLd.code,
  "authorName": author->name,
  "authorSlug": author->slug.current,
  "authorRole": author->role,
  "heroImage": heroImage.asset->url,
  "heroAlt": heroImage.alt,
  "heroCaption": heroImage.caption
}`;

function prune(value) {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) {
    const arr = value.map(prune).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const p = prune(v);
      if (p !== undefined) out[k] = p;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return value;
}

async function main() {
  const posts = await client.fetch(query);
  const root = path.resolve("src/content/posts");

  for (const post of posts) {
    const slug = post.slug;
    if (!slug) continue;
    const dir = path.join(root, slug);
    await fs.mkdir(dir, { recursive: true });

    const fm = prune({
      title: post.title,
      slug,
      publishedAt: post.publishedAt,
      summary: post.summary,
      tags: post.tags ?? [],
      featured: post.featured ?? false,
      audience: post.audience,
      intent: post.intent,
      targetKeyword: post.targetKeyword,
      evergreenStatus: post.evergreenStatus,
      series: post.series,
      coverVariant: post.coverVariant ?? "default",
      categorySlugs: post.categorySlugs?.filter(Boolean) ?? [],
      topicSlugs: post.topicSlugs?.filter(Boolean) ?? [],
      seriesSlugs: post.seriesSlugs?.filter(Boolean) ?? [],
      keyTakeaways: post.keyTakeaways,
      pullQuotes: post.pullQuotes,
      furtherReading: post.furtherReading,
      sourceReferences: post.sourceReferences,
      distributionPackage: post.distributionPackage,
      seoMetaTitle: post.seoMetaTitle,
      seoMetaDescription: post.seoMetaDescription,
      seoCanonicalUrl: post.seoCanonicalUrl,
      seoNoIndex: post.seoNoIndex ?? false,
      seoJsonLd: post.seoJsonLd,
      authorName: post.authorName,
      authorSlug: post.authorSlug,
      authorRole: post.authorRole,
      heroImage: post.heroImage,
      heroAlt: post.heroAlt,
      heroCaption: post.heroCaption,
    });

    const body =
      post.markdownContent?.trim()?.length > 0
        ? post.markdownContent
        : "_Article body was authored in Portable Text in Sanity. Convert this post manually to MDX or paste exported markdown._";

    const yamlBlock = stringifyYaml(fm ?? {}).trimEnd();
    const file = `---\n${yamlBlock}\n---\n\n${body}\n`;
    await fs.writeFile(path.join(dir, "index.mdx"), file, "utf8");
    console.log("wrote", slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
