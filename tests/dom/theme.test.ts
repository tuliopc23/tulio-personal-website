import {
  installAnimationStubs,
  installMatchMediaStub,
  installStorageStub,
} from "../helpers/browser";

describe("theme controller script", () => {
  test("initializes using stored theme and updates document state", async () => {
    installAnimationStubs();
    installMatchMediaStub({ light: true, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/Brand-icon-dark.webp"><meta id="theme-color-meta" content="#f6f7fb">';
    localStorage.setItem("theme-override", "dark");
    vi.resetModules();

    await import("../../src/scripts/theme");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      (document.querySelector('link[rel="icon"]') as HTMLLinkElement).href
    ).toContain("/Brand-icon-light.webp");
  });
});
