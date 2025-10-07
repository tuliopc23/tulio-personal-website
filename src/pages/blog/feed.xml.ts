import { getAllPosts } from "../../sanity/lib/posts";

export const prerender = true;

const DEFAULT_ORIGIN = "https://www.tuliocunha.dev";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET({ site, request }: { site: URL | undefined; request: Request }) {
  const origin = site?.origin ?? new URL(request.url).origin ?? DEFAULT_ORIGIN;
  const feedUrl = new URL("/blog/feed.xml", origin).toString();
  const homepageUrl = new URL("/", origin).toString();
  const postUrl = (slug: string, canonical?: string | null) =>
    canonical?.startsWith("http") ? canonical : new URL(`/blog/${slug}/`, origin).toString();

  const posts = (await getAllPosts())
    .filter((post) => !post.seo?.noIndex)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const lastBuildDate = posts[0]
    ? new Date(posts[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const title = post.seo?.metaTitle ?? post.title;
      const description = post.seo?.metaDescription ?? post.summary;
      const link = postUrl(post.slug, post.seo?.canonicalUrl);
      const pubDate = new Date(post.publishedAt).toUTCString();
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `
      <item>
        <title>${escapeXml(title)}</title>
        <link>${escapeXml(link)}</link>
        <guid>${escapeXml(link)}</guid>
        <description>${escapeXml(description)}</description>
        <pubDate>${pubDate}</pubDate>
        ${categories}
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tulio Cunha — Blog</title>
    <link>${escapeXml(homepageUrl)}</link>
    <description>Apple-inspired engineering, design, and tooling notes by Tulio Cunha.</description>
    <language>en</language>
    <generator>Astro</generator>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
