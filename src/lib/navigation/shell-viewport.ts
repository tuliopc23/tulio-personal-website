/** Shell chrome breakpoint: mobile liquid nav + simplified topbar ≤1024px; desktop ≥1025px */
export const MOBILE_SHELL_MEDIA_QUERY = "(max-width: 1024px)";

export function isMobileShellViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(MOBILE_SHELL_MEDIA_QUERY).matches;
}

export function isMobileLiquidNavActive(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.body.dataset.mobileLiquidNav === "true" && isMobileShellViewport();
}
