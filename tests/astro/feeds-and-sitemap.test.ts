import { GET as atomFeedGet } from "../../src/pages/blog/atom.xml";
import { GET as rssFeedGet } from "../../src/pages/blog/feed.xml";
import { GET as sitemapGet } from "../../src/pages/sitemap.xml";
import { richPostSummary } from "../fixtures/sanity";

vi.mock("../../src/sanity/lib/posts", () => ({
  getAllPosts: vi.fn(async () => [richPostSummary]),
  getAllCategories: vi.fn(async () => [
    { _id: "cat", title: "Astro", slug: "astro", description: "" },
  ]),
  getAllPostLocators: vi.fn(async () => [
    { slug: richPostSummary.slug, publishedAt: richPostSummary.publishedAt },
  ]),
}));

describe("feeds and sitemap", () => {
  test("renders RSS feed entries", async () => {
    const response = await rssFeedGet({
      site: new URL("https://www.tuliocunha.dev"),
      request: new Request("https://www.tuliocunha.dev/blog/feed.xml"),
    } as never);

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("Building Better Astro Sites");
  });

  test("renders Atom feed entries", async () => {
    const response = await atomFeedGet({
      site: new URL("https://www.tuliocunha.dev"),
      request: new Request("https://www.tuliocunha.dev/blog/atom.xml"),
    } as never);

    const xml = await response.text();
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom"');
    expect(xml).toContain("building-better-astro-sites");
  });

  test("renders sitemap URLs for static pages and posts", async () => {
    const response = await sitemapGet({
      site: new URL("https://www.tuliocunha.dev"),
    } as never);

    const xml = await response.text();
    expect(xml).toContain("<loc>https://www.tuliocunha.dev/blog/</loc>");
    expect(xml).toContain(
      "<loc>https://www.tuliocunha.dev/blog/building-better-astro-sites/</loc>"
    );
    expect(xml).toContain("<loc>https://www.tuliocunha.dev/blog/category/astro/</loc>");
  });
});
