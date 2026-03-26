import { resolve } from "../../src/sanity/lib/resolve";

describe("sanity presentation resolve", () => {
  test("maps post locations to the article and blog index", () => {
    const output = (resolve?.locations as any).post.resolve?.({
      title: "Post",
      slug: "hello",
    });

    expect(output?.locations).toEqual([
      { title: "Post", href: "/blog/hello/" },
      { title: "Blog Index", href: "/blog/" },
    ]);
  });

  test("maps remaining document types to website locations", () => {
    const locations = resolve?.locations as any;

    expect(locations.category.resolve({ title: "Astro", slug: "astro" }).locations).toEqual([
      { title: "Astro", href: "/blog/category/astro/" },
      { title: "Blog Index", href: "/blog/" },
    ]);
    expect(locations.project.resolve({ title: "Atlas" }).locations).toEqual([
      { title: "Atlas", href: "/projects/" },
    ]);
    expect(locations.aboutPage.resolve({}).locations).toEqual([
      { title: "About", href: "/about/" },
    ]);
    expect(locations.blogPage.resolve({}).locations).toEqual([{ title: "Blog", href: "/blog/" }]);
    expect(locations.projectsPage.resolve({}).locations).toEqual([
      { title: "Projects", href: "/projects/" },
    ]);
  });
});
