import { marked } from "marked";

import { parseMarkdownDocument } from "./markdown";
import { toAbsoluteUrl } from "./seo.js";

function absolutizeSrc(src: string, siteOrigin: string): string {
  const trimmed = src.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  try {
    return toAbsoluteUrl(trimmed, siteOrigin);
  } catch {
    return trimmed;
  }
}

/** Ensure feed HTML img src values resolve for clients that load media against the site origin. */
export function absolutizeImgSrcInFeedHtml(html: string, siteOrigin: string): string {
  if (!html || !siteOrigin) return html;
  return html.replace(
    /<img\b([^>]*?)\bsrc\s*=\s*(["'])([^"']*)\2/gi,
    (match, before, quote, src) => {
      const absolute = absolutizeSrc(src, siteOrigin);
      return absolute === src ? match : `<img${before}src=${quote}${absolute}${quote}`;
    },
  );
}

export function postBodyToFeedHtml(markdownContent?: string | null): string {
  const { body } = parseMarkdownDocument(markdownContent);
  if (!body.trim()) return "";

  return marked(body, {
    breaks: true,
    gfm: true,
    async: false,
  });
}
