/** iOS Safari `theme-color` values — must match rendered `--bg` / `--bg-base` tokens. */
export const SAFARI_THEME_CHROME_COLORS = {
  light: "#f5f5f7",
  dark: "#050505",
} as const;

export type SafariThemeChromeMode = keyof typeof SAFARI_THEME_CHROME_COLORS;

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]#theme-color-meta';

export function getSafariThemeChromeColor(theme: SafariThemeChromeMode): string {
  return SAFARI_THEME_CHROME_COLORS[theme];
}

/** Single authoritative `theme-color` meta — do not add OS media-bound duplicates. */
export function updateSafariThemeChrome(theme: SafariThemeChromeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  const meta = document.querySelector<HTMLMetaElement>(THEME_COLOR_META_SELECTOR);
  if (meta) {
    meta.setAttribute("content", getSafariThemeChromeColor(theme));
  }
}
