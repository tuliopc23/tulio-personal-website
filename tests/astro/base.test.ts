import { experimental_AstroContainer as AstroContainer } from "astro/container";

import Base from "../../src/layouts/Base.astro";

describe("Base layout", () => {
  test("renders route-aware nav state and metadata", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(
      Base as any,
      {
        request: new Request("https://www.tuliocunha.dev/projects/"),
        props: {
          title: "Projects",
          description: "Selected work.",
          canonical: "https://www.tuliocunha.dev/projects/",
          structuredData: { "@type": "ItemList" },
        },
        slots: {
          default: "<main>Content</main>",
        },
      } as any
    );

    expect(html).toContain("<title>Projects • Tulio Cunha</title>");
    expect(html).toContain('rel="canonical" href="https://www.tuliocunha.dev/projects/"');
    expect(html).toMatch(/href="\/projects"[^>]*aria-current="page"/);
    expect(html).toContain("Apple apps, web builds, backend systems.");
    expect(html).toContain("data-site-search-open");
    expect(html).toContain('id="site-search"');
  });
});
