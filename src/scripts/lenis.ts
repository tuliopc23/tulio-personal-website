/**
 * Lenis smooth-scroll singleton.
 *
 * Provides vertical smooth scrolling for all pages and exposes
 * `getLenis()` so other modules can read scroll state or subscribe.
 */

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;

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

  const narrowViewport =
    typeof window.matchMedia === "function" && window.matchMedia("(max-width: 767px)").matches;

  // Slightly higher lerp on narrow viewports: snappier follow-through on touch devices
  // where `syncTouch` stays off (native touch; Lenis only smooths wheel / virtual path).
  const lerp = narrowViewport ? 0.11 : 0.09;

  lenis = new Lenis({
    lerp,
    smoothWheel: true,
    gestureOrientation: "vertical",
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.15,
    infinite: false,
    autoRaf: false,
    anchors: true,
    stopInertiaOnNavigate: true,
  });

  scrollCallback = () => {
    ScrollTrigger.update();
  };
  lenis.on("scroll", scrollCallback);

  tickerCallback = (time) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

/** Tear down the current Lenis instance and stop the RAF loop. */
export function destroyLenis(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (lenis && scrollCallback) {
    lenis.off("scroll", scrollCallback);
    scrollCallback = null;
  }

  lenis?.destroy();
  lenis = null;
}
