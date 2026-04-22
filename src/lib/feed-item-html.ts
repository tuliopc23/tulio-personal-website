import type { PostDetail } from "../lib/content/posts";
import { toAbsoluteUrl } from "./seo.js";

const MEDIA_RSS_NS = "http://search.yahoo.com/mrss/";

export { MEDIA_RSS_NS };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function resolvePostFeedImage(post: PostDetail, siteOrigin: string) {
  const hero = post.heroImage ?? null;
  const heroSrc =
    hero?.src &&
    typeof hero.src === "object" &&
    hero.src &&
    "src" in (hero.src as Record<string, unknown>)
      ? String((hero.src as Record<string, unknown>).src)
      : null;
  const socialImage = post.seo?.socialImage ?? null;
  const socialImageUrl = socialImage?.url ? toAbsoluteUrl(socialImage.url, siteOrigin) : null;
  const imageUrl = heroSrc ? toAbsoluteUrl(heroSrc, siteOrigin) : socialImageUrl;
  return {
    imageUrl,
    alt: hero?.alt ?? socialImage?.alt ?? null,
    width:
      hero?.src &&
      typeof hero.src === "object" &&
      hero.src &&
      "width" in (hero.src as Record<string, unknown>)
        ? Number((hero.src as Record<string, unknown>).width)
        : socialImage?.width,
    height:
      hero?.src &&
      typeof hero.src === "object" &&
      hero.src &&
      "height" in (hero.src as Record<string, unknown>)
        ? Number((hero.src as Record<string, unknown>).height)
        : socialImage?.height,
  };
}

export function buildFeedContent({
  description,
  articleHtml,
  imageAlt,
  imageUrl,
  link,
}: {
  description: string;
  articleHtml: string;
  imageAlt?: string | null;
  imageUrl?: string | null;
  link: string;
}) {
  const blocks: string[] = [];

  if (imageUrl) {
    blocks.push(`<p><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageAlt ?? "")}" /></p>`);
  }

  const body = articleHtml.trim() || `<p>${escapeHtml(description)}</p>`;
  blocks.push(body);
  blocks.push(`<p><a href="${escapeHtml(link)}">Read the full post on tuliocunha.dev.</a></p>`);

  return blocks.join("");
}

function guessImageMimeType(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".svg") || path.endsWith(".svgz")) return "image/svg+xml";
  return "image/jpeg";
}

/** Per-item RSS/Atom: Media RSS tags for clients that fetch cover art separately from HTML. */
export function buildMediaRssItemTags(imageUrl: string, width?: number, height?: number): string {
  const u = escapeHtml(imageUrl);
  const w = width != null && width > 0 ? ` width="${escapeHtml(String(width))}"` : "";
  const h = height != null && height > 0 ? ` height="${escapeHtml(String(height))}"` : "";
  const mime = escapeHtml(guessImageMimeType(imageUrl));
  return `<media:thumbnail url="${u}"${w}${h}/><media:content medium="image" url="${u}" type="${mime}"/>`;
}
