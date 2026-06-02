export function isIOSSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent;
  const vendor = navigator.vendor;
  const platform = navigator.platform;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari =
    /Safari/i.test(ua) &&
    /Apple/i.test(vendor) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|Chrome|Android/i.test(ua);

  return isIOS && isSafari;
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
