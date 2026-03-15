const loadQueryMock = vi.fn();

vi.mock("../../src/sanity/lib/load-query", () => ({
  loadQuery: loadQueryMock,
}));

describe("projects library", () => {
  test("filters invalid categories from projects", async () => {
    loadQueryMock.mockResolvedValueOnce({
      data: [
        {
          _id: "project-1",
          title: "Atlas",
          slug: "atlas",
          role: "Lead engineer",
          summary: "Summary",
          status: "Live",
          href: "https://example.com",
          cta: "View",
          releaseDate: "2025-01-01",
          categories: ["native", "invalid", "web"],
          coverImage: null,
        },
      ],
    });

    const { getAllProjects } = await import("../../src/sanity/lib/projects");
    await expect(getAllProjects()).resolves.toEqual([
      expect.objectContaining({ categories: ["native", "web"] }),
    ]);
  });
});
