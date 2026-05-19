import { afterEach, describe, expect, it } from "vitest";
import { mobileTabLinks } from "../../src/lib/navigation/mobile-tab-links";
import { SITE_PRIMARY_ROUTES } from "../../src/lib/navigation/site-nav-routes";
import {
  filterSiteSearchRoutes,
  routeSearchHaystack,
  siteSearchRoutes,
} from "../../src/lib/navigation/site-search-routes";
import {
  getSiteSearchOpen,
  registerSiteSearchApi,
  setSiteSearchOpen,
  subscribeSiteSearch,
  toggleSiteSearch,
} from "../../src/lib/navigation/site-search-store";

describe("site search store", () => {
  afterEach(() => {
    setSiteSearchOpen(false);
    document.body.classList.remove("is-search-open");
  });

  it("opens and closes via API", () => {
    registerSiteSearchApi();
    const states: boolean[] = [];
    const unsubscribe = subscribeSiteSearch((open) => states.push(open));

    window.__siteSearch?.open();
    expect(states.at(-1)).toBe(true);
    expect(document.body.classList.contains("is-search-open")).toBe(true);

    window.__siteSearch?.close();
    expect(states.at(-1)).toBe(false);

    unsubscribe();
  });

  it("toggles open state without duplicate body class updates", () => {
    registerSiteSearchApi();
    toggleSiteSearch();
    expect(getSiteSearchOpen()).toBe(true);
    expect(document.body.classList.contains("is-search-open")).toBe(true);

    toggleSiteSearch();
    expect(getSiteSearchOpen()).toBe(false);
    expect(document.body.classList.contains("is-search-open")).toBe(false);
  });

  it("skips listener notifications when state is unchanged", () => {
    const states: boolean[] = [];
    const unsubscribe = subscribeSiteSearch((open) => states.push(open));

    setSiteSearchOpen(false);
    const countAfterNoop = states.length;

    setSiteSearchOpen(false);
    expect(states.length).toBe(countAfterNoop);

    unsubscribe();
  });
});

describe("filterSiteSearchRoutes", () => {
  it("returns all routes for an empty query", () => {
    expect(filterSiteSearchRoutes("")).toEqual([...siteSearchRoutes]);
    expect(filterSiteSearchRoutes("   ")).toEqual([...siteSearchRoutes]);
  });

  it("filters routes by title and description", () => {
    const results = filterSiteSearchRoutes("blog");
    expect(results.some((route) => route.href === "/blog/")).toBe(true);
    expect(
      results.every(
        (route) =>
          route.title.toLowerCase().includes("blog") ||
          route.description.toLowerCase().includes("blog") ||
          route.keywords.includes("blog"),
      ),
    ).toBe(true);
  });

  it("matches case studies via keywords", () => {
    const results = filterSiteSearchRoutes("portfolio");
    expect(results).toEqual([siteSearchRoutes[2]]);
    expect(results[0]?.href).toBe("/projects/");
  });

  it("returns no routes when nothing matches", () => {
    expect(filterSiteSearchRoutes("zzzz-not-a-route")).toEqual([]);
  });
});

describe("routeSearchHaystack", () => {
  it("lowercases searchable fields", () => {
    const route = siteSearchRoutes[0];
    expect(routeSearchHaystack(route)).toBe(
      `${route.title} ${route.description} ${route.keywords}`.toLowerCase(),
    );
  });
});

describe("primary route metadata", () => {
  it("aligns mobile tabs with search routes", () => {
    expect(mobileTabLinks.map((link) => link.href)).toEqual(
      Object.values(SITE_PRIMARY_ROUTES).map((route) => route.href),
    );
    expect(siteSearchRoutes.map((route) => route.href)).toEqual(
      Object.values(SITE_PRIMARY_ROUTES).map((route) => route.href),
    );
  });
});
