import { describe, expect, it } from "vitest";
import {
  getActiveMobileTabId,
  mobileTabLinks,
  normalizeMobilePathname,
} from "../../src/lib/navigation/mobile-tab-links";

describe("mobile-tab-links", () => {
  it("normalizes trailing slashes", () => {
    expect(normalizeMobilePathname("/blog/")).toBe("/blog");
    expect(normalizeMobilePathname("/")).toBe("/");
    expect(normalizeMobilePathname("/projects/")).toBe("/projects");
  });

  it("resolves active tab from pathname", () => {
    expect(getActiveMobileTabId("/")).toBe("home");
    expect(getActiveMobileTabId("/blog/some-post")).toBe("blog");
    expect(getActiveMobileTabId("/blog/category/software-development")).toBe("blog");
    expect(getActiveMobileTabId("/projects")).toBe("cases");
    expect(getActiveMobileTabId("/projects/")).toBe("cases");
    expect(getActiveMobileTabId("/about/")).toBe("about");
  });

  it("exposes four primary mobile routes", () => {
    expect(mobileTabLinks.map((link) => link.href)).toEqual([
      "/",
      "/blog/",
      "/projects/",
      "/about/",
    ]);
    expect(mobileTabLinks.map((link) => link.label)).toEqual(["Home", "Blog", "Cases", "About"]);
  });

  it("matches blog and about subtrees only for those tabs", () => {
    const blog = mobileTabLinks.find((link) => link.id === "blog");
    const about = mobileTabLinks.find((link) => link.id === "about");
    const cases = mobileTabLinks.find((link) => link.id === "cases");

    expect(blog?.match("/blog")).toBe(true);
    expect(blog?.match("/")).toBe(false);
    expect(about?.match("/about/contact")).toBe(true);
    expect(cases?.match("/projects/foo")).toBe(true);
    expect(cases?.match("/project")).toBe(false);
  });
});
