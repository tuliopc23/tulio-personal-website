import { experimental_AstroContainer as AstroContainer } from "astro/container";

import { richPostSummary } from "../fixtures/sanity";

vi.mock("../../src/sanity/lib/image", () => ({
  optimizedImageUrl: vi.fn((url: string) => `${url}?optimized=true`),
  generateSrcset: vi.fn(() => "https://cdn.example.com/image-640.png 640w"),
}));

vi.mock("../../src/sanity/lib/page-content", () => ({
  getBlogPageContent: vi.fn(async () => null),
}));

const getFeaturedPosts = vi.fn();
const getAllPosts = vi.fn();
const getAllCategories = vi.fn();
const getCategoryBySlug = vi.fn();
const getPostsByCategory = vi.fn();

vi.mock("../../src/sanity/lib/posts", () => ({
  getFeaturedPosts,
  getAllPosts,
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
}));

describe("blog index and category pages", () => {
  test("renders featured posts, filters, and feed links on the blog index", async () => {
    getFeaturedPosts.mockResolvedValueOnce([richPostSummary]);
    getAllPosts.mockResolvedValueOnce([
      richPostSummary,
      {
        ...richPostSummary,
        _id: "2",
        slug: "second-post",
        title: "Second Post",
        tags: ["swift"],
      },
    ]);

    const container = await AstroContainer.create();
    const { default: BlogIndex } = await import("../../src/pages/blog/index.astro");
    const html = await container.renderToString(
      BlogIndex as any,
      {
        request: new Request("https://www.tuliocunha.dev/blog/"),
      } as any
    );

    expect(html).toContain("Topics");
    expect(html).toContain("All posts");
    expect(html).toContain("Second Post");
    expect(html).toContain("/rss.xml");
    expect(html).toContain("/blog/atom.xml");
  });

  test("renders category pages with populated and empty states", async () => {
    getCategoryBySlug.mockResolvedValueOnce({
      _id: "cat",
      title: "Astro",
      slug: "astro",
      description: "Astro notes",
    });
    getPostsByCategory.mockResolvedValueOnce([richPostSummary]);

    const container = await AstroContainer.create();
    const { default: CategoryPage } =
      await import("../../src/pages/blog/category/[slug].astro");

    const populatedHtml = await container.renderToString(
      CategoryPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/blog/category/astro/"),
        params: { slug: "astro" },
      } as any
    );

    expect(populatedHtml).toContain("Astro Posts");
    expect(populatedHtml).toContain("Latest post:");

    getCategoryBySlug.mockResolvedValueOnce({
      _id: "cat",
      title: "Astro",
      slug: "astro",
      description: null,
    });
    getPostsByCategory.mockResolvedValueOnce([]);

    const emptyHtml = await container.renderToString(
      CategoryPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/blog/category/astro/"),
        params: { slug: "astro" },
      } as any
    );

    expect(emptyHtml).toContain("No posts in this topic yet");
  });
});
