import { describe, expect, test } from "vitest";

import { postBodyToFeedHtml } from "../../src/lib/feed-content";
import type { PostDetail } from "../../src/sanity/lib/posts";
import { markdownFallbackPost, richPostDetail } from "../fixtures/sanity";

describe("postBodyToFeedHtml", () => {
  test("renders portable text blocks to HTML", () => {
    const html = postBodyToFeedHtml(richPostDetail.content, richPostDetail.markdownContent);
    expect(html).toContain("<p>");
    expect(html).toContain("Astro makes it easy to keep most of the page static");
  });

  test("falls back to markdown when content is empty", () => {
    const post = markdownFallbackPost as PostDetail;
    const html = postBodyToFeedHtml(post.content, post.markdownContent);
    expect(html).toContain("<h1");
    expect(html).toContain("Heading");
    expect(html).toContain("Fallback markdown content");
  });
});
