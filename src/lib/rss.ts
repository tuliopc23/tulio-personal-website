import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { getAllPosts } from "../sanity/lib/posts";
import { getSiteOrigin, toAbsoluteUrl } from "./seo.js";

const FEED_TITLE = "Tulio Cunha — Blog";
const FEED_DESCRIPTION =
  "Programming essays on Apple platforms, web development, backend systems, and developer tooling.";
const FEED_LANGUAGE = "en-us";
const CONTACT_EMAIL = "contact@tuliocunha.dev";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFeedContent({
  description,
  imageAlt,
  imageUrl,
  link,
}: {
  description: string;
  imageAlt?: string | null;
  imageUrl?: string | null;
  link: string;
}) {
  const blocks: string[] = [];

  if (imageUrl) {
    blocks.push(`<p><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageAlt ?? "")}" /></p>`);
  }

  blocks.push(`<p>${escapeHtml(description)}</p>`);
  blocks.push(`<p><a href="${escapeHtml(link)}">Read the full post on tuliocunha.dev.</a></p>`);

  return blocks.join("");
}

export async function createRssFeedResponse(
  context: Pick<APIContext, "request" | "site">,
  feedPath: string,
) {
  const site = new URL(getSiteOrigin(context.site ?? new URL(context.request.url)));
  const posts = (await getAllPosts())
    .filter((post) => !post.seo?.noIndex)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return rss({
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    site,
    stylesheet: false,
    customData: [
      `<language>${FEED_LANGUAGE}</language>`,
      `<managingEditor>${CONTACT_EMAIL} (Tulio Cunha)</managingEditor>`,
      `<webMaster>${CONTACT_EMAIL} (Tulio Cunha)</webMaster>`,
      `<atom:link href="${escapeHtml(toAbsoluteUrl(feedPath, site.origin))}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    items: posts.map((post) => {
      const link = toAbsoluteUrl(
        post.seo?.canonicalUrl?.startsWith("http") ? post.seo.canonicalUrl : `/blog/${post.slug}/`,
        site.origin,
      );
      const description = post.seo?.metaDescription ?? post.summary;
      const image = post.seo?.socialImage?.url ? post.seo.socialImage : post.heroImage;
      const imageUrl = image?.url ? toAbsoluteUrl(image.url, site.origin) : null;

      return {
        title: post.seo?.metaTitle ?? post.title,
        description,
        link,
        pubDate: new Date(post.publishedAt),
        content: buildFeedContent({
          description,
          imageAlt: image?.alt,
          imageUrl,
          link,
        }),
        customData: post.tags
          .filter(Boolean)
          .map((tag) => `<category>${escapeHtml(tag)}</category>`)
          .join(""),
      };
    }),
  });
}
