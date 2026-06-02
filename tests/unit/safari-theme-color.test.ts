import {
  SAFARI_THEME_CHROME_COLORS,
  getSafariThemeChromeColor,
  updateSafariThemeChrome,
} from "../../src/lib/safari-theme-color";

describe("safari-theme-color", () => {
  test("maps site themes to root background token colors", () => {
    expect(getSafariThemeChromeColor("light")).toBe(SAFARI_THEME_CHROME_COLORS.light);
    expect(getSafariThemeChromeColor("dark")).toBe(SAFARI_THEME_CHROME_COLORS.dark);
    expect(SAFARI_THEME_CHROME_COLORS.light).toBe("#f5f5f7");
    expect(SAFARI_THEME_CHROME_COLORS.dark).toBe("#050505");
  });

  test("updates the single authoritative theme-color meta", () => {
    document.head.innerHTML =
      '<meta name="theme-color" id="theme-color-meta" content="#f5f5f7">';
    document.head.innerHTML +=
      '<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">';

    updateSafariThemeChrome("dark");

    const metas = document.querySelectorAll('meta[name="theme-color"]');
    expect(metas).toHaveLength(2);
    expect(document.querySelector<HTMLMetaElement>(THEME_COLOR_META_SELECTOR)?.content).toBe(
      "#050505",
    );
  });
});

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]#theme-color-meta';
