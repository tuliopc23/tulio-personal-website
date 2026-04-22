import { experimental_AstroContainer as AstroContainer } from "astro/container";

import { sampleProject } from "../fixtures/content";

vi.mock("../../src/lib/content/projects", () => ({
  getAllProjects: vi.fn(async () => [sampleProject]),
}));

vi.mock("../../src/lib/content/page-content", () => ({
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

    expect(html).toContain("Case Studies");
    expect(html).toContain("Project Atlas");
    // When `getProjectsPageContent()` is mocked to null, the /projects case studies
    // section should render the empty-state copy.
    expect(html).toContain("Case studies are being prepared");
    // The non-Sanity projects list is still rendered from `getAllProjects()`.
    expect(html).toContain("More work");
  });
});
