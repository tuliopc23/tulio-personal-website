import {
  installAnimationStubs,
  installMatchMediaStub,
  installStorageStub,
} from "../helpers/browser";



describe("theme controller script", () => {
  test("initializes using system theme and updates document state", async () => {
    installAnimationStubs();
    installMatchMediaStub({ light: true, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-light.png"><meta id="theme-color-meta" content="#f6f7fb">';
    vi.resetModules();

    await import("../../src/scripts/theme");

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect((document.querySelector('link[rel="icon"]') as HTMLLinkElement).href).toContain(
      "/brand-icon-light.png",
    );
  });

  test("toggles theme without persistence, and can return to system sync", async () => {
    installAnimationStubs();
    const media = installMatchMediaStub({ light: false, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-dark.png"><meta id="theme-color-meta" content="#050506">';

    vi.useFakeTimers();
    vi.resetModules();
    await import("../../src/scripts/theme");

    expect(window.themeController?.getTheme()).toBe("dark");
    window.themeController?.toggleTheme({ persist: false });
    expect(window.themeController?.getTheme()).toBe("light");
    expect(window.themeController?.getPreference()).toBe("light");
    expect(document.documentElement.classList.contains("theme-transition")).toBe(true);

    vi.runAllTimers();
    expect(document.documentElement.classList.contains("theme-transition")).toBe(false);

    // While explicitly overridden, OS changes should not affect the theme.
    media.setMatches("(prefers-color-scheme: light)", false);
    expect(window.themeController?.getTheme()).toBe("light");

    window.themeController?.setSystem({ persist: false });
    expect(window.themeController?.getPreference()).toBe("system");
    expect(window.themeController?.getTheme()).toBe("dark");
    media.setMatches("(prefers-color-scheme: light)", true);
    expect(window.themeController?.getTheme()).toBe("light");

    const listener = vi.fn();
    const unsubscribe = window.themeController?.subscribeMotionPreference(listener);
    media.setMatches("(prefers-reduced-motion: reduce)", true);
    expect(document.documentElement.dataset.motion).toBe("reduced");
    expect(listener).toHaveBeenCalled();
    unsubscribe?.();
  });

  test("reacts to system theme changes when preference is system", async () => {
    installAnimationStubs();
    const media = installMatchMediaStub({ light: false, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-dark.png"><meta id="theme-color-meta" content="#050506">';

    vi.resetModules();
    await import("../../src/scripts/theme");

    expect(window.themeController?.getTheme()).toBe("dark");
    expect(window.themeController?.getPreference()).toBe("system");
    media.setMatches("(prefers-color-scheme: light)", true);
    expect(window.themeController?.getTheme()).toBe("light");
  });
});
