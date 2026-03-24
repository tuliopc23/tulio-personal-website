import { SITEMAP_INDEX_PATH, shouldIncludeInSitemap, toAbsoluteUrl } from "../../src/lib/seo.js";

describe("seo helpers", () => {
  test("resolves relative URLs against the configured site", () => {
    expect(toAbsoluteUrl("/terminal-favicon.svg", "https://www.tuliocunha.dev/blog/")).toBe(
      "https://www.tuliocunha.dev/terminal-favicon.svg",
    );
  });

  test("excludes non-indexable utility routes from the sitemap", () => {
    expect(shouldIncludeInSitemap("https://www.tuliocunha.dev/blog/")).toBe(true);
    expect(shouldIncludeInSitemap(`https://www.tuliocunha.dev${SITEMAP_INDEX_PATH}`)).toBe(false);
    expect(shouldIncludeInSitemap("https://www.tuliocunha.dev/rss.xml")).toBe(false);
    expect(shouldIncludeInSitemap("https://www.tuliocunha.dev/blog/feed.xml")).toBe(false);
    expect(shouldIncludeInSitemap("https://www.tuliocunha.dev/blog/atom.xml")).toBe(false);
    expect(shouldIncludeInSitemap("https://www.tuliocunha.dev/robots.txt")).toBe(false);
    expect(shouldIncludeInSitemap("https://www.tuliocunha.dev/studio/")).toBe(false);
  });
});
