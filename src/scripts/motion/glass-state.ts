/**
 * Topbar glass-state tracking.
 *
 * Switches `data-glass-state` between "rest" and "scrolled" on the
 * `<body>` element based on scroll position.  Uses Lenis scroll
 * events when available, falling back to the native scroll event.
 */

import { shouldIsolateSafariChrome } from "../../lib/browser-environment";
import { getScrollY, subscribeScroll } from "../../lib/scroll-subscribe";

type GlassState = "rest" | "scrolled";

let scrollUnsub: (() => void) | null = null;

function computeState(): GlassState {
  if (shouldIsolateSafariChrome()) {
    return "rest";
  }

  const body = document.body;
  const isHero = body.dataset.heroActive === "true";
  const threshold = isHero ? window.innerHeight * 0.5 : 32;
  const scrollY = getScrollY();
  return scrollY > threshold ? "scrolled" : "rest";
}

function apply(): void {
  const next = computeState();
  if (document.body.dataset.glassState !== next) {
    document.body.dataset.glassState = next;
  }
}

/* ── Public API ─────────────────────────────────────────────── */

export function initGlassState(): void {
  cleanupGlassState();

  if (shouldIsolateSafariChrome()) {
    document.body.dataset.glassState = "rest";
    return;
  }

  if (!document.body.dataset.glassState) {
    document.body.dataset.glassState = "rest";
  }

  apply();

  scrollUnsub = subscribeScroll(apply);
}

export function cleanupGlassState(): void {
  scrollUnsub?.();
  scrollUnsub = null;
}
