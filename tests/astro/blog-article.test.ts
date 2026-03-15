import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import {
  markdownFallbackPost,
  richPostDetail,
  richPostSummary,
} from "../fixtures/sanity";

vi.mock("../../src/sanity/lib/posts", () => ({
  calculateReadingTimeMinutes: vi.fn(() => 4),
  getAllPostSlugs: vi.fn(async () => ["building-better-astro-sites"]),
  getPostBySlug: vi.fn(async (slug: string) =>
    slug === "markdown-fallback" ? markdownFallbackPost : richPostDetail
  ),
  getRecentPosts: vi.fn(async () => [richPostSummary]),
}));

vi.mock("../../src/sanity/lib/image", () => ({
  generateSrcset: vi.fn(() => "https://cdn.example.com/image-640.png 640w"),
  optimizedImageUrl: vi.fn((url: string) => `${url}?optimized=true`),
}));

describe("blog article route", () => {
  test("renders SEO, reading metadata, and article content", async () => {
    const container = await AstroContainer.create();
    const { default: ArticlePage } = await import("../../src/pages/blog/[slug].astro");

    const html = await container.renderToString(ArticlePage as unknown as AstroComponentFactory, {
      request: new Request(
        "https://www.tuliocunha.dev/blog/building-better-astro-sites/"
      ),
      params: { slug: "building-better-astro-sites" },
    });

    expect(html).toContain("Building Better Astro Sites");
    expect(html).toContain("Astro Notes");
    expect(html).toContain("4 min read");
    expect(html).toContain("Filed under");
    expect(html).toContain("Send a note");
    expect(html).toContain("Share or subscribe");
    expect(html).toContain("Read like you build.");
    expect(html).toContain("Reading view");
    expect(html).toContain("application/rss+xml");
    expect(html).toContain("article--density-short");
    expect(html).toContain("article--hero-wide");
    expect(html).toContain("articleCard--readerRelated");
  });

  test("renders markdown fallback when portable text is missing", async () => {
    const container = await AstroContainer.create();
    const { default: ArticlePage } = await import("../../src/pages/blog/[slug].astro");

    const html = await container.renderToString(ArticlePage as unknown as AstroComponentFactory, {
      request: new Request("https://www.tuliocunha.dev/blog/markdown-fallback/"),
      params: { slug: "markdown-fallback" },
    });

    expect(html).toContain("Fallback markdown content");
    expect(html).toContain("articlePortable");
    expect(html).toContain("Read like you build.");
    expect(html).toContain("article--density-short");
    expect(html).toContain("article--hero-wide");
  });
});
