import type { APIRoute } from "astro";

import { getSiteOrigin, SITEMAP_INDEX_PATH, toAbsoluteUrl } from "../lib/seo.js";

export const prerender = true;

export const GET: APIRoute = ({ request, site }) => {
  const origin = getSiteOrigin(site ?? new URL(request.url));
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /studio/",
    "Disallow: /api/",
    "",
    `Sitemap: ${toAbsoluteUrl(SITEMAP_INDEX_PATH, origin)}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
