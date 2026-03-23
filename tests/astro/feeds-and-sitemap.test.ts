import { GET as atomFeedGet } from "../../src/pages/blog/atom.xml";
import { GET as rssFeedGet } from "../../src/pages/blog/feed.xml";
import { GET as robotsGet } from "../../src/pages/robots.txt";
import { GET as rootRssFeedGet } from "../../src/pages/rss.xml";
import { richPostSummary } from "../fixtures/sanity";

vi.mock("../../src/sanity/lib/posts", () => ({
  getAllPosts: vi.fn(async () => [richPostSummary]),
}));

describe("feeds and sitemap", () => {
  test("renders the canonical RSS feed", async () => {
    const response = await rootRssFeedGet({
      site: new URL("https://www.tuliocunha.dev"),
      request: new Request("https://www.tuliocunha.dev/rss.xml"),
    } as never);

    const xml = await response.text();
    expect(response.headers.get("Content-Type")).toContain("application/xml");
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("Building Better Astro Sites");
    expect(xml).toContain("https://www.tuliocunha.dev/rss.xml");
  });

  test("renders the legacy blog RSS feed", async () => {
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

  test("renders robots.txt with the sitemap index", async () => {
    const response = await robotsGet({
      site: new URL("https://www.tuliocunha.dev"),
      request: new Request("https://www.tuliocunha.dev/robots.txt"),
    } as never);

    const body = await response.text();
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toContain("Disallow: /studio/");
    expect(body).toContain("Sitemap: https://www.tuliocunha.dev/sitemap-index.xml");
  });
});
