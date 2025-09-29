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

export async function GET({
  site,
  request,
}: {
  site: URL | undefined;
  request: Request;
}) {
  const origin = site?.origin ?? new URL(request.url).origin ?? DEFAULT_ORIGIN;
  const feedUrl = new URL("/blog/atom.xml", origin).toString();
  const blogUrl = new URL("/blog/", origin).toString();

  const posts = (await getAllPosts())
    .filter((post) => !post.seo?.noIndex)
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const updated = posts[0]
    ? new Date(posts[0].publishedAt).toISOString()
    : new Date().toISOString();

  const entries = posts
    .map((post) => {
      const title = post.seo?.metaTitle ?? post.title;
      const description = post.seo?.metaDescription ?? post.summary;
      const link =
        post.seo?.canonicalUrl && post.seo.canonicalUrl.startsWith("http")
          ? post.seo.canonicalUrl
          : new URL(`/blog/${post.slug}/`, origin).toString();
      const published = new Date(post.publishedAt).toISOString();
      const categories = post.tags
        .map((tag) => `<category term="${escapeXml(tag)}" />`)
        .join("\n");

      const summary = escapeXml(description);

      return `
    <entry>
      <id>${escapeXml(link)}</id>
      <title>${escapeXml(title)}</title>
      <link href="${escapeXml(link)}" />
      <updated>${published}</updated>
      <published>${published}</published>
      <summary type="html">${summary}</summary>
      ${categories}
    </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(blogUrl)}</id>
  <title>Tulio Cunha — Blog</title>
  <link href="${escapeXml(feedUrl)}" rel="self" />
  <link href="${escapeXml(blogUrl)}" />
  <updated>${updated}</updated>
  <author>
    <name>Tulio Cunha</name>
    <uri>${escapeXml(origin)}</uri>
  </author>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
