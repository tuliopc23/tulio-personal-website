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

const HORIZONTAL_RAIL_SELECTOR =
  "[data-lenis-prevent-horizontal], [data-repo-rail], .articleGrid, .cardRail";
const HORIZONTAL_GESTURE_MIN_DELTA = 6;
const HORIZONTAL_GESTURE_RATIO = 1.15;

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;

function isHTMLElement(node: unknown): node is HTMLElement {
  return node instanceof HTMLElement;
}

function isHorizontalRailEventTarget(event: Event): boolean {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];

  for (const node of path) {
    if (!isHTMLElement(node)) continue;
    if (node.matches(HORIZONTAL_RAIL_SELECTOR) || node.closest(HORIZONTAL_RAIL_SELECTOR)) {
      return true;
    }
  }

  return false;
}

function hasHorizontalGestureIntent(deltaX: number, deltaY: number, event?: Event): boolean {
  if (event instanceof WheelEvent && event.shiftKey) {
    return true;
  }

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  return absX >= HORIZONTAL_GESTURE_MIN_DELTA && absX > absY * HORIZONTAL_GESTURE_RATIO;
}

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
    gestureOrientation: "both",
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.15,
    infinite: false,
    autoRaf: false,
    anchors: true,
    stopInertiaOnNavigate: true,
    virtualScroll: ({ deltaX, deltaY, event }) => {
      if (!(event instanceof Event)) return true;
      if (!isHorizontalRailEventTarget(event)) return true;

      return !hasHorizontalGestureIntent(deltaX, deltaY, event);
    },
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
