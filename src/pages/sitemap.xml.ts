import type { APIRoute } from "astro";
import { getAllPostLocators } from "../sanity/lib/posts";

export const prerender = true;

const STATIC_ROUTES = ["/", "/about/", "/blog/", "/projects/", "/uses/", "/now/"];

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.valueOf())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

export const GET: APIRoute = async ({ site }) => {
  const origin = (
    site ?? new URL(process.env.PUBLIC_SANITY_PREVIEW_URL ?? "http://localhost:4321")
  ).origin;
  const cleanedOrigin = origin.replace(/\/$/, "");

  const [postLocators] = await Promise.all([getAllPostLocators()]);

  const urls = [
    ...STATIC_ROUTES.map((route) => ({
      loc: `${cleanedOrigin}${route}`,
      lastmod: new Date().toISOString(),
    })),
    ...postLocators.map((post) => ({
      loc: `${cleanedOrigin}/blog/${post.slug}/`,
      lastmod: formatDate(post.publishedAt),
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((entry) => {
        return [
          "  <url>",
          `    <loc>${entry.loc}</loc>`,
          `    <lastmod>${entry.lastmod}</lastmod>`,
          "  </url>",
        ].join("\n");
      })
      .join("\n") +
    "\n</urlset>\n";

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
