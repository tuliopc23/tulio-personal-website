import { isIOSSafariBrowser, markBrowserEnvironment } from "../lib/browser-environment";
import { resyncBrowserChrome } from "../lib/safari-theme-color";

function scheduleResync(delayMs: number): void {
  window.setTimeout(resyncBrowserChrome, delayMs);
}

function initSafariChromeBoot(): void {
  markBrowserEnvironment();
  resyncBrowserChrome();

  if (!isIOSSafariBrowser()) {
    return;
  }

  scheduleResync(50);
  scheduleResync(250);
  scheduleResync(750);

  window.addEventListener("pageshow", () => {
    scheduleResync(50);
  });

  window.addEventListener("orientationchange", () => {
    scheduleResync(160);
  });

  window.addEventListener("resize", () => {
    scheduleResync(160);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      scheduleResync(80);
    }
  });

  document.addEventListener("astro:page-load", () => {
    markBrowserEnvironment();
    scheduleResync(80);
  });
}

initSafariChromeBoot();
