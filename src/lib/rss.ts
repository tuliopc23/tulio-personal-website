import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { absolutizeImgSrcInFeedHtml, postBodyToFeedHtml } from "./feed-content";
import {
  buildFeedContent,
  buildMediaRssItemTags,
  MEDIA_RSS_NS,
  resolvePostFeedImage,
} from "./feed-item-html";
import { getAllPostsForFeed } from "../sanity/lib/posts";
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

export { buildFeedContent, buildMediaRssItemTags, resolvePostFeedImage } from "./feed-item-html";

export async function createRssFeedResponse(
  context: Pick<APIContext, "request" | "site">,
  feedPath: string,
) {
  const site = new URL(getSiteOrigin(context.site ?? new URL(context.request.url)));
  const posts = await getAllPostsForFeed();

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
      media: MEDIA_RSS_NS,
    },
    items: posts.map((post) => {
      const link = toAbsoluteUrl(
        post.seo?.canonicalUrl?.startsWith("http") ? post.seo.canonicalUrl : `/blog/${post.slug}/`,
        site.origin,
      );
      const description = post.seo?.metaDescription ?? post.summary;
      const articleHtml = absolutizeImgSrcInFeedHtml(
        postBodyToFeedHtml(post.content, post.markdownContent),
        site.origin,
      );
      const { imageUrl, alt, width, height } = resolvePostFeedImage(post, site.origin);

      const categoryTags = post.tags
        .filter(Boolean)
        .map((tag) => `<category>${escapeHtml(tag)}</category>`)
        .join("");
      const mediaTags = imageUrl ? buildMediaRssItemTags(imageUrl, width, height) : "";

      return {
        title: post.seo?.metaTitle ?? post.title,
        description,
        link,
        pubDate: new Date(post.publishedAt),
        content: buildFeedContent({
          description,
          articleHtml,
          imageAlt: alt,
          imageUrl,
          link,
        }),
        customData: categoryTags + mediaTags,
      };
    }),
  });
}
