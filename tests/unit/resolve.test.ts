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
});
