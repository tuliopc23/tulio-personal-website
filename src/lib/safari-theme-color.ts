/** iOS Safari `theme-color` values — must match rendered `--bg` / `--bg-base` tokens. */
export const SAFARI_THEME_CHROME_COLORS = {
  light: "#f5f5f7",
  dark: "#050505",
} as const;

export type SafariThemeChromeMode = keyof typeof SAFARI_THEME_CHROME_COLORS;

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]#theme-color-meta';
const COLOR_SCHEME_META_SELECTOR = 'meta[name="color-scheme"]#color-scheme-meta';

export function getSafariThemeChromeColor(theme: SafariThemeChromeMode): string {
  return SAFARI_THEME_CHROME_COLORS[theme];
}

/** Sync Safari/browser chrome with the rendered site theme (not OS dark-first ordering). */
export function updateBrowserChrome(theme: SafariThemeChromeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  const isLight = theme === "light";
  const root = document.documentElement;

  const themeColorMeta = document.querySelector<HTMLMetaElement>(THEME_COLOR_META_SELECTOR);
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", getSafariThemeChromeColor(theme));
  }

  const colorSchemeMeta = document.querySelector<HTMLMetaElement>(COLOR_SCHEME_META_SELECTOR);
  if (colorSchemeMeta) {
    colorSchemeMeta.setAttribute("content", isLight ? "light" : "dark");
  }

  root.style.colorScheme = isLight ? "light" : "dark";
}

/** @deprecated Use updateBrowserChrome — kept for call-site clarity during migration. */
export function updateSafariThemeChrome(theme: SafariThemeChromeMode): void {
  updateBrowserChrome(theme);
}
