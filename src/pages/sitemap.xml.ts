import type { APIRoute } from "astro";
import { getAllPostLocators, getAllCategories } from "../sanity/lib/posts";

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

  const [postLocators, categories] = await Promise.all([
    getAllPostLocators(),
    getAllCategories(),
  ]);

  const urls = [
    ...STATIC_ROUTES.map((route) => ({
      loc: `${cleanedOrigin}${route}`,
      lastmod: new Date().toISOString(),
      priority: route === "/" ? 1.0 : 0.8,
    })),
    ...postLocators.map((post) => ({
      loc: `${cleanedOrigin}/blog/${post.slug}/`,
      lastmod: formatDate(post.publishedAt),
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      loc: `${cleanedOrigin}/blog/category/${category.slug}/`,
      lastmod: new Date().toISOString(),
      priority: 0.6,
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
          `    <priority>${entry.priority}</priority>`,
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
