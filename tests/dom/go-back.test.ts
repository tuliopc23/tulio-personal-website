import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { navigateBack, recordNavigationTrail } from "../../src/lib/navigation/go-back";

describe("navigateBack", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("location", {
      ...window.location,
      pathname: "/blog/",
      search: "",
      href: "https://example.com/blog/",
      origin: "https://example.com",
      assign: vi.fn(),
    });
    Object.defineProperty(window, "history", {
      value: { length: 1, back: vi.fn() },
      configurable: true,
    });
    Object.defineProperty(document, "referrer", {
      value: "",
      configurable: true,
    });
    recordNavigationTrail();
    sessionStorage.setItem("site-nav-trail", JSON.stringify(["/", "/blog/"]));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses same-origin referrer when history is empty", () => {
    Object.defineProperty(document, "referrer", {
      value: "https://example.com/projects/",
      configurable: true,
    });

    navigateBack("/");

    expect(window.location.assign).toHaveBeenCalledWith("/projects/");
  });

  it("falls back to trail entry when history and referrer are unavailable", () => {
    navigateBack("/");

    expect(window.location.assign).toHaveBeenCalledWith("/");
  });

  it("does not run history fallback twice when back does not navigate", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "history", {
      value: { length: 3, back: vi.fn() },
      configurable: true,
    });

    navigateBack("/");
    vi.runAllTimers();

    expect(window.location.assign).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
