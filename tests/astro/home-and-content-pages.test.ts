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
}));

vi.mock("../../src/lib/github-data", () => ({
  getMergedGitHubData: vi.fn(async () => []),
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
    expect(html).toContain("What moved recently and where the commits landed.");
    expect(html).toContain("Building Better Astro Sites");
  });

  test("renders about fallback content", async () => {
    const container = await AstroContainer.create({
      renderers: await loadRenderers([solidContainerRenderer()]),
    });
    const { default: AboutPage } = await import("../../src/pages/about.astro");

    const aboutHtml = await container.renderToString(
      AboutPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/about/"),
      } as any,
    );

    expect(aboutHtml).toContain("How I Build");
    expect(aboutHtml).toContain("I start where most people skip");
  });
});
