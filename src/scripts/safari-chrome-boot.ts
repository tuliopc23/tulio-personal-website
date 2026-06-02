import { markBrowserEnvironment, shouldIsolateSafariChrome } from "../lib/browser-environment";
import { resyncBrowserChrome } from "../lib/safari-theme-color";

let booted = false;

function scheduleResync(delayMs: number): void {
  window.setTimeout(resyncBrowserChrome, delayMs);
}

function initSafariChromeBoot(): void {
  if (booted) {
    markBrowserEnvironment();
    resyncBrowserChrome();
    return;
  }

  booted = true;
  markBrowserEnvironment();
  resyncBrowserChrome();

  if (!shouldIsolateSafariChrome()) {
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

if (typeof window !== "undefined") {
  initSafariChromeBoot();
}
