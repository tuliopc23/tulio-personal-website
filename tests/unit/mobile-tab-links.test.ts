import { describe, expect, it } from "vitest";
import {
  getActivePrimaryNavId,
  normalizePathname,
  primaryNavLinks,
} from "../../src/lib/navigation/primary-nav-links";

describe("primary-nav-links", () => {
  it("normalizes trailing slashes", () => {
    expect(normalizePathname("/blog/")).toBe("/blog");
    expect(normalizePathname("/")).toBe("/");
    expect(normalizePathname("/projects/")).toBe("/projects");
  });

  it("resolves active tab from pathname", () => {
    expect(getActivePrimaryNavId("/")).toBe("home");
    expect(getActivePrimaryNavId("/blog/some-post")).toBe("blog");
    expect(getActivePrimaryNavId("/blog/category/software-development")).toBe("blog");
    expect(getActivePrimaryNavId("/projects")).toBe("cases");
    expect(getActivePrimaryNavId("/projects/")).toBe("cases");
    expect(getActivePrimaryNavId("/projects/my-case")).toBe("cases");
    expect(getActivePrimaryNavId("/about/")).toBe("about");
  });

  it("exposes four primary routes", () => {
    expect(primaryNavLinks.map((link) => link.href)).toEqual([
      "/",
      "/blog/",
      "/projects/",
      "/about/",
    ]);
    expect(primaryNavLinks.map((link) => link.label)).toEqual(["Home", "Blog", "Cases", "About"]);
  });

  it("matches blog and about subtrees only for those tabs", () => {
    const blog = primaryNavLinks.find((link) => link.id === "blog");
    const about = primaryNavLinks.find((link) => link.id === "about");
    const cases = primaryNavLinks.find((link) => link.id === "cases");

    expect(blog?.match("/blog")).toBe(true);
    expect(blog?.match("/")).toBe(false);
    expect(about?.match("/about/contact")).toBe(true);
    expect(cases?.match("/projects/foo")).toBe(true);
    expect(cases?.match("/project")).toBe(false);
  });
});
