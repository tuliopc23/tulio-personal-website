const IOS_DEVICE_PATTERN = /iPad|iPhone|iPod/;
const NON_SAFARI_IOS_PATTERN = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|Chrome|Android/i;

function readIosSafariFromNavigator(nav: Navigator): boolean {
  const ua = nav.userAgent;
  const vendor = nav.vendor;
  const platform = nav.platform;
  const isIOS = IOS_DEVICE_PATTERN.test(ua) || (platform === "MacIntel" && nav.maxTouchPoints > 1);
  const isSafari = /Safari/i.test(ua) && /Apple/i.test(vendor) && !NON_SAFARI_IOS_PATTERN.test(ua);

  return isIOS && isSafari;
}

/**
 * Inline head script body for Base.astro (runs before CSS).
 * Keep detection aligned with readIosSafariFromNavigator().
 */
export const HEAD_IOS_SAFARI_MARK_INIT = `
  const ua = navigator.userAgent;
  const vendor = navigator.vendor;
  const platform = navigator.platform;
  const isIOS =
    ${IOS_DEVICE_PATTERN.toString()}.test(ua) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari =
    /Safari/i.test(ua) &&
    /Apple/i.test(vendor) &&
    !${NON_SAFARI_IOS_PATTERN.toString()}.test(ua);
  const forceStableSafariChrome = new URLSearchParams(window.location.search).has(
    "stableSafariChrome",
  );
  if ((isIOS && isSafari) || forceStableSafariChrome) {
    root.dataset.iosSafari = "true";
  } else {
    delete root.dataset.iosSafari;
  }
`.trim();

export function isIOSSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return readIosSafariFromNavigator(navigator);
}

export function hasStableSafariChromeFlag(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).has("stableSafariChrome");
}

/** True when iOS Safari chrome isolation should be active (includes dev kill switch). */
export function shouldIsolateSafariChrome(): boolean {
  return isIOSSafariBrowser() || hasStableSafariChromeFlag();
}

export function markBrowserEnvironment(): void {
  if (typeof document === "undefined") {
    return;
  }

  if (shouldIsolateSafariChrome()) {
    document.documentElement.dataset.iosSafari = "true";
  } else {
    delete document.documentElement.dataset.iosSafari;
  }
}
