import { experimental_AstroContainer as AstroContainer } from "astro/container";

import { sampleProject } from "../fixtures/sanity";

vi.mock("../../src/sanity/lib/projects", () => ({
  getAllProjects: vi.fn(async () => [sampleProject]),
}));

vi.mock("../../src/sanity/lib/page-content", () => ({
  getProjectsPageContent: vi.fn(async () => null),
}));

describe("projects page", () => {
  test("renders the project list and filters", async () => {
    const container = await AstroContainer.create();
    const { default: ProjectsPage } = await import("../../src/pages/projects.astro");

    const html = await container.renderToString(
      ProjectsPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/projects/"),
      } as any,
    );

    expect(html).toContain("Projects");
    expect(html).toContain("Project Atlas");
    expect(html).toContain("Filter projects");
    expect(html).toContain('data-project-filter="web"');
  });
});
