import {
  SAFARI_THEME_CHROME_COLORS,
  getSafariThemeChromeColor,
  updateBrowserChrome,
} from "../../src/lib/safari-theme-color";

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]#theme-color-meta';
const COLOR_SCHEME_META_SELECTOR = 'meta[name="color-scheme"]#color-scheme-meta';

describe("safari-theme-color", () => {
  test("maps site themes to root background token colors", () => {
    expect(getSafariThemeChromeColor("light")).toBe(SAFARI_THEME_CHROME_COLORS.light);
    expect(getSafariThemeChromeColor("dark")).toBe(SAFARI_THEME_CHROME_COLORS.dark);
    expect(SAFARI_THEME_CHROME_COLORS.light).toBe("#f5f5f7");
    expect(SAFARI_THEME_CHROME_COLORS.dark).toBe("#050505");
  });

  test("updates theme-color, color-scheme meta, and document colorScheme", () => {
    document.head.innerHTML =
      '<meta name="theme-color" id="theme-color-meta" content="#f5f5f7">' +
      '<meta name="color-scheme" id="color-scheme-meta" content="light">';
    document.head.innerHTML +=
      '<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">';

    updateBrowserChrome("dark");

    const metas = document.querySelectorAll('meta[name="theme-color"]');
    expect(metas).toHaveLength(2);
    expect(document.querySelector<HTMLMetaElement>(THEME_COLOR_META_SELECTOR)?.content).toBe(
      "#050505",
    );
    expect(document.querySelector<HTMLMetaElement>(COLOR_SCHEME_META_SELECTOR)?.content).toBe(
      "dark",
    );
    expect(document.documentElement.style.colorScheme).toBe("dark");

    updateBrowserChrome("light");

    expect(document.querySelector<HTMLMetaElement>(THEME_COLOR_META_SELECTOR)?.content).toBe(
      "#f5f5f7",
    );
    expect(document.querySelector<HTMLMetaElement>(COLOR_SCHEME_META_SELECTOR)?.content).toBe(
      "light",
    );
    expect(document.documentElement.style.colorScheme).toBe("light");
  });
});
