vi.mock("../../src/sanity/lib/load-query", () => ({
  loadQuery: vi.fn(),
}));

vi.mock("astro-portabletext", () => ({
  toPlainText: vi.fn((blocks: Array<{ children?: Array<{ text?: string }> }>) =>
    blocks
      .flatMap((block) => block.children ?? [])
      .map((child) => child.text ?? "")
      .join(" "),
  ),
}));

describe("posts helpers", () => {
  test("calculates reading time from portable text blocks", async () => {
    const { calculateReadingTimeMinutes } = await import("../../src/sanity/lib/posts");
    const minutes = calculateReadingTimeMinutes([
      {
        _type: "block",
        children: Array.from({ length: 230 }, (_, index) => ({ text: `word-${index}` })),
      } as any,
    ]);

    expect(minutes).toBe(1);
  });

  test("falls back to markdown when blocks are empty", async () => {
    const { calculateReadingTimeMinutes } = await import("../../src/sanity/lib/posts");
    const minutes = calculateReadingTimeMinutes([], "word ".repeat(500));
    expect(minutes).toBe(2);
  });

  test("returns post collections and category data from query responses", async () => {
    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    vi.mocked(loadQuery)
      .mockResolvedValueOnce({ data: [{ slug: "one" }] } as never)
      .mockResolvedValueOnce({
        data: [{ slug: "one", publishedAt: "2026-01-01" }],
      } as never)
      .mockResolvedValueOnce({
        data: [
          {
            _id: "1",
            title: "Post",
            summary: "Summary",
            slug: "one",
            publishedAt: "2026-01-01",
            tags: [],
          },
        ],
      } as never)
      .mockResolvedValueOnce({ data: [] } as never)
      .mockResolvedValueOnce({
        data: [{ _id: "cat", title: "Astro", slug: "astro", description: null }],
      } as never)
      .mockResolvedValueOnce({
        data: { _id: "cat", title: "Astro", slug: "astro", description: null },
      } as never)
      .mockResolvedValueOnce({ data: [] } as never);

    const posts = await import("../../src/sanity/lib/posts");

    await expect(posts.getAllPostSlugs()).resolves.toEqual(["one"]);
    await expect(posts.getAllPostLocators()).resolves.toEqual([
      { slug: "one", publishedAt: "2026-01-01" },
    ]);
    await expect(posts.getAllPosts()).resolves.toEqual([
      expect.objectContaining({ title: "Post", slug: "one" }),
    ]);
    await expect(posts.getFeaturedPosts()).resolves.toEqual([]);
    await expect(posts.getAllCategories()).resolves.toEqual([
      { _id: "cat", title: "Astro", slug: "astro", description: null },
    ]);
    await expect(posts.getCategoryBySlug("astro")).resolves.toEqual({
      _id: "cat",
      title: "Astro",
      slug: "astro",
      description: null,
    });
    await expect(posts.getPostsByCategory("astro")).resolves.toEqual([]);
  });

  test("adds reading time to post detail and returns recent posts", async () => {
    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    vi.mocked(loadQuery)
      .mockResolvedValueOnce({
        data: {
          _id: "1",
          title: "Post",
          summary: "Summary",
          slug: "one",
          publishedAt: "2026-01-01",
          updatedAt: "2026-01-05T12:00:00.000Z",
          tags: [],
          content: [],
          markdownContent: "word ".repeat(300),
        },
      } as never)
      .mockResolvedValueOnce({ data: null } as never)
      .mockResolvedValueOnce({
        data: [
          {
            _id: "2",
            title: "Another",
            summary: "Summary",
            slug: "two",
            publishedAt: "2026-01-02",
            tags: [],
          },
        ],
      } as never);

    const posts = await import("../../src/sanity/lib/posts");

    const detail = await posts.getPostBySlug("one");
    expect(detail?.readingTimeMinutes).toBe(1);
    await expect(posts.getPostBySlug("missing")).resolves.toBeNull();
    await expect(posts.getRecentPosts("one", 1)).resolves.toEqual([
      expect.objectContaining({ slug: "two" }),
    ]);
  });
});
