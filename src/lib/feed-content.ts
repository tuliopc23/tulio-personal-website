import type { PortableTextBlock } from "@portabletext/types";
import {
  escapeHTML,
  toHTML,
  uriLooksSafe,
  type PortableTextHtmlComponents,
} from "@portabletext/to-html";
import { marked } from "marked";

import { parseMarkdownDocument } from "./markdown";
import { toAbsoluteUrl } from "./seo.js";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/'/g, "&#39;");
}

const feedPortableComponents: Partial<PortableTextHtmlComponents> = {
  types: {
    image: ({ value }) => {
      const url =
        typeof (value as { url?: string }).url === "string" ? (value as { url: string }).url : "";
      if (!url) return "";
      const alt = escapeHTML(String((value as { alt?: string | null }).alt ?? ""));
      const captionRaw = (value as { caption?: string | null }).caption;
      const caption =
        typeof captionRaw === "string" && captionRaw.trim().length > 0
          ? `<figcaption>${escapeHTML(captionRaw)}</figcaption>`
          : "";
      return `<figure><img src="${escapeAttr(url)}" alt="${alt}" />${caption}</figure>`;
    },
    code: ({ value }) => {
      const code =
        typeof (value as { code?: string }).code === "string"
          ? (value as { code: string }).code
          : "";
      const langRaw =
        typeof (value as { language?: string }).language === "string"
          ? (value as { language: string }).language
          : "plaintext";
      const lang = langRaw.toLowerCase().replace(/[^a-z0-9+#.-]/g, "") || "plaintext";
      const filenameRaw = (value as { filename?: string }).filename;
      const filename =
        typeof filenameRaw === "string" && filenameRaw.trim().length > 0
          ? `<p><strong>${escapeHTML(filenameRaw)}</strong></p>`
          : "";
      return `${filename}<pre><code class="language-${escapeHTML(lang)}">${escapeHTML(code)}</code></pre>`;
    },
    callout: ({ value }) => {
      const v = value as {
        variant?: string;
        title?: string | null;
        body?: PortableTextBlock[];
      };
      const variant = typeof v.variant === "string" ? v.variant : "info";
      const title =
        typeof v.title === "string" && v.title.trim().length > 0
          ? `<p><strong>${escapeHTML(v.title)}</strong></p>`
          : "";
      const inner = toHTML(Array.isArray(v.body) ? v.body : [], {
        components: feedPortableComponents,
        onMissingComponent: false,
      });
      return `<aside data-callout="${escapeAttr(variant)}">${title}${inner}</aside>`;
    },
    videoEmbed: ({ value }) => {
      const v = value as { url?: string; caption?: string | null };
      const url = typeof v.url === "string" ? v.url : "";
      if (!url) return "";
      if (!uriLooksSafe(url)) return `<p>${escapeHTML(url)}</p>`;
      const cap =
        typeof v.caption === "string" && v.caption.trim().length > 0
          ? `<p><em>${escapeHTML(v.caption)}</em></p>`
          : "";
      return `<p><a href="${escapeAttr(url)}">Watch video</a></p>${cap}`;
    },
    divider: () => "<hr />",
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href ?? "";
      if (!href || !uriLooksSafe(href)) return children;
      const rel = /^https?:/i.test(href) ? ' rel="noopener noreferrer"' : "";
      return `<a href="${escapeAttr(href)}"${rel}>${children}</a>`;
    },
  },
};

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

export function postBodyToFeedHtml(
  content: PortableTextBlock[],
  markdownContent?: string | null,
): string {
  if (Array.isArray(content) && content.length > 0) {
    return toHTML(content, {
      components: feedPortableComponents,
      onMissingComponent: false,
    });
  }

  const { body } = parseMarkdownDocument(markdownContent);
  if (!body.trim()) return "";

  return marked(body, {
    breaks: true,
    gfm: true,
    async: false,
  });
}
