export const SITE_URL = "https://www.tuliocunha.dev";
export const SITEMAP_INDEX_PATH = "/sitemap-index.xml";
export const RSS_FEED_PATH = "/rss.xml";
export const LEGACY_RSS_FEED_PATH = "/blog/feed.xml";
export const ATOM_FEED_PATH = "/blog/atom.xml";

const EXCLUDED_SITEMAP_PATHS = new Set([
  SITEMAP_INDEX_PATH,
  RSS_FEED_PATH,
  LEGACY_RSS_FEED_PATH,
  ATOM_FEED_PATH,
  "/robots.txt",
]);

export function getSiteOrigin(site) {
  if (site instanceof URL) {
    return site.origin;
  }

  if (typeof site === "string" && site.length > 0) {
    return new URL(site).origin;
  }

  return new URL(SITE_URL).origin;
}

export function toAbsoluteUrl(pathOrUrl, site = SITE_URL) {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, getSiteOrigin(site)).toString();
  }
}

export function shouldIncludeInSitemap(page) {
  const pathname = new URL(page).pathname;
  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (normalizedPath === "/studio" || normalizedPath.startsWith("/studio/")) {
    return false;
  }

  return !EXCLUDED_SITEMAP_PATHS.has(normalizedPath);
}
