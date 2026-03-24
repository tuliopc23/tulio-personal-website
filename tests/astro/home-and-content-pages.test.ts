import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as solidContainerRenderer } from "@astrojs/solid-js";

import { richPostSummary } from "../fixtures/sanity";

vi.mock("../../src/sanity/lib/posts", () => ({
  getAllPosts: vi.fn(async () => [
    richPostSummary,
    { ...richPostSummary, _id: "2", slug: "two", title: "Second" },
  ]),
}));

vi.mock("../../src/sanity/lib/page-content", () => ({
  getAboutPageContent: vi.fn(async () => null),
  getNowPageContent: vi.fn(async () => null),
}));

describe("home, about, and now pages", () => {
  test("renders the homepage sections and recent writing", async () => {
    const container = await AstroContainer.create({
      renderers: await loadRenderers([solidContainerRenderer()]),
    });
    const { default: HomePage } = await import("../../src/pages/index.astro");

    const html = await container.renderToString(
      HomePage as any,
      {
        request: new Request("https://www.tuliocunha.dev/"),
      } as any,
    );

    expect(html).toContain("Daily setup");
    expect(html).toContain("Recent shipping and public work.");
    expect(html).toContain("Building Better Astro Sites");
  });

  test("renders about and now fallback content", async () => {
    const container = await AstroContainer.create({
      renderers: await loadRenderers([solidContainerRenderer()]),
    });
    const [{ default: AboutPage }, { default: NowPage }] = await Promise.all([
      import("../../src/pages/about.astro"),
      import("../../src/pages/now.astro"),
    ]);

    const aboutHtml = await container.renderToString(
      AboutPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/about/"),
      } as any,
    );
    const nowHtml = await container.renderToString(
      NowPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/now/"),
      } as any,
    );

    expect(aboutHtml).toContain("How I work");
    expect(aboutHtml).toContain("Strong internals first. Clear interfaces second.");
    expect(nowHtml).toContain("What has attention right now");
    // Section id is stable; heading text is not SSR'd and API outcome changes error/empty/success copy.
    expect(nowHtml).toContain("section-github");
  });
});
