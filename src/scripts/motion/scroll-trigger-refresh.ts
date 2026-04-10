/**
 * Coalesces ScrollTrigger.refresh() calls to avoid layout thrash when Lenis,
 * reveals, hydrated islands, and viewport changes all request a refresh.
 */

import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ScrollTriggerRefreshMode = "immediate" | "settled";

const SETTLE_MS = 180;

let rafId = 0;
let debounceId = 0;

function runRefresh(): void {
  ScrollTrigger.refresh();
}

/**
 * Schedule a single refresh. `immediate` runs on the next animation frame.
 * `settled` debounces (~180ms) so bursts (images, fonts, islands) collapse to one pass.
 */
export function scheduleScrollTriggerRefresh(mode: ScrollTriggerRefreshMode = "settled"): void {
  if (mode === "immediate") {
    if (debounceId) {
      clearTimeout(debounceId);
      debounceId = 0;
    }
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      runRefresh();
    });
    return;
  }

  if (debounceId) clearTimeout(debounceId);
  debounceId = window.setTimeout(() => {
    debounceId = 0;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      runRefresh();
    });
  }, SETTLE_MS);
}

/** Drop pending refresh work (call before teardown / full cleanup). */
export function cancelPendingScrollTriggerRefresh(): void {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (debounceId) {
    clearTimeout(debounceId);
    debounceId = 0;
  }
}

let viewportCleanups: Array<() => void> = [];

/**
 * Debounced refresh on visual viewport and orientation changes (iOS toolbar, rotation).
 */
export function initViewportScrollRefresh(): void {
  cleanupViewportScrollRefresh();

  const onLayoutShift = (): void => {
    scheduleScrollTriggerRefresh("settled");
  };

  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener("resize", onLayoutShift, { passive: true });
    vv.addEventListener("scroll", onLayoutShift, { passive: true });
    viewportCleanups.push(() => {
      vv.removeEventListener("resize", onLayoutShift);
      vv.removeEventListener("scroll", onLayoutShift);
    });
  }

  window.addEventListener("orientationchange", onLayoutShift, { passive: true });
  viewportCleanups.push(() => {
    window.removeEventListener("orientationchange", onLayoutShift);
  });
}

export function cleanupViewportScrollRefresh(): void {
  for (const fn of viewportCleanups) fn();
  viewportCleanups = [];
}
