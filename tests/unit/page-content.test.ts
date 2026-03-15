import type {
  AboutPageContent,
  BlogPageContent,
  ProjectsPageContent,
} from "../../src/sanity/lib/page-content";

const loadQueryMock = vi.fn();

vi.mock("../../src/sanity/lib/load-query", () => ({
  loadQuery: loadQueryMock,
}));

describe("page content loaders", () => {
  test("returns about page content when present", async () => {
    const data: AboutPageContent = {
      seoDescription: "About",
      heroEyebrow: "About",
      heroTitle: "About title",
      heroLede: "About lede",
      manifestoLabel: "Label",
      manifestoTitle: "Manifesto",
      manifestoCopy: "Copy",
      proofBullets: ["One"],
      principles: [{ _key: "1", title: "T", body: "B" }],
      timelineHeading: "Timeline",
      timelineLede: "Lede",
      timelineItems: [{ _key: "1", year: "2026", title: "Now", body: "Body" }],
    };

    loadQueryMock.mockResolvedValueOnce({ data });
    const { getAboutPageContent } = await import("../../src/sanity/lib/page-content");

    await expect(getAboutPageContent()).resolves.toEqual(data);
  });

  test("returns null when now page content is missing", async () => {
    loadQueryMock.mockResolvedValueOnce({ data: null });
    const { getNowPageContent } = await import("../../src/sanity/lib/page-content");

    await expect(getNowPageContent()).resolves.toBeNull();
  });

  test("returns blog and projects content payloads", async () => {
    const blogData: BlogPageContent = {
      pageDescription: "Blog",
      heroEyebrow: "Journal",
      heroTitle: "Blog title",
      heroLede: "Blog lede",
      emptyStateTitle: "Empty",
      emptyStateBody: "No posts",
      editorialDirectionHeading: "Direction",
      editorialDirectionLede: "Lede",
      pillars: [{ _key: "1", icon: "book", title: "One", body: "Body" }],
      archiveHeading: "Archive",
      archiveLede: "Archive lede",
      allArticlesLabel: "All",
      loadOlderLabel: "Older",
      filterEmptyState: "No match",
      spotlightTags: ["astro"],
      placeholderCards: null,
    };

    const projectsData: ProjectsPageContent = {
      description: "Projects",
      heroEyebrow: "Work",
      heroTitle: "Projects title",
      heroLede: "Projects lede",
      filterEmptyTitle: "Filter empty",
      filterEmptyBody: "Filter body",
      pageEmptyTitle: "Page empty",
      pageEmptyBody: "Page body",
      contactEmail: "contact@example.com",
    };

    loadQueryMock.mockResolvedValueOnce({ data: blogData });
    loadQueryMock.mockResolvedValueOnce({ data: projectsData });
    const { getBlogPageContent, getProjectsPageContent } =
      await import("../../src/sanity/lib/page-content");

    await expect(getBlogPageContent()).resolves.toEqual(blogData);
    await expect(getProjectsPageContent()).resolves.toEqual(projectsData);
  });
});
