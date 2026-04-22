import { describe, expect, test } from "vitest";

import { absolutizeImgSrcInFeedHtml, postBodyToFeedHtml } from "../../src/lib/feed-content";
import type { PostDetail } from "../../src/lib/content/posts";
import { markdownFallbackPost, richPostDetail } from "../fixtures/content";

describe("postBodyToFeedHtml", () => {
  test("renders markdown to HTML", () => {
    const html = postBodyToFeedHtml(richPostDetail.markdownContent);
    expect(html).toContain("<p>");
    expect(html).toContain("Astro makes it easy to keep most of the page static");
  });

  test("renders markdown headings", () => {
    const post = markdownFallbackPost as PostDetail;
    const html = postBodyToFeedHtml(post.markdownContent);
    expect(html).toContain("<h1");
    expect(html).toContain("Heading");
    expect(html).toContain("Fallback markdown content");
  });

  test("absolutizeImgSrcInFeedHtml resolves root-relative and protocol-relative src", () => {
    const origin = "https://www.example.com";
    const html = '<p><img src="/pic.png" alt="a" /> <img src="//cdn.example/x.webp" alt="b" /></p>';
    const out = absolutizeImgSrcInFeedHtml(html, origin);
    expect(out).toContain('src="https://www.example.com/pic.png"');
    expect(out).toContain('src="https://cdn.example/x.webp"');
  });
});
