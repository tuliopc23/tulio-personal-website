/**
 * Lenis smooth-scroll singleton.
 *
 * Provides vertical smooth scrolling for all pages and exposes
 * `getLenis()` so other modules can read scroll state or subscribe.
 */

import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

/* ── Public API ─────────────────────────────────────────────── */

export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Create and start the vertical Lenis instance.
 * Call with `reducedMotion: true` to skip (native scroll used instead).
 */
export function initLenis(reducedMotion: boolean): void {
  destroyLenis();

  if (reducedMotion) return; // native scroll when user prefers reduced motion

  lenis = new Lenis({
    lerp: 0.075,
    smoothWheel: true,
    gestureOrientation: "vertical",
    syncTouch: true,
    syncTouchLerp: 0.08,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.1,
    infinite: false,
    autoRaf: true,
    anchors: true,
    stopInertiaOnNavigate: true,
  });
}

/** Tear down the current Lenis instance and stop the RAF loop. */
export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}
