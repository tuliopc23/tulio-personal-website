/**
 * Lenis smooth-scroll singleton.
 *
 * Provides vertical smooth scrolling for all pages and exposes
 * `getLenis()` so other modules can read scroll state or subscribe.
 */

import { shouldIsolateSafariChrome } from "../lib/browser-environment";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollEngine } from "../lib/scroll-subscribe";
import {
  cancelPendingScrollTriggerRefresh,
  scheduleScrollTriggerRefresh,
} from "./motion/scroll-trigger-refresh";

gsap.registerPlugin(ScrollTrigger);

const HORIZONTAL_RAIL_SELECTOR =
  "[data-lenis-prevent-horizontal], [data-case-track], [data-repo-rail]";

const HORIZONTAL_GESTURE_MIN_DELTA = 6;
const HORIZONTAL_GESTURE_RATIO = 1.15;

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;
let lagSmoothingApplied = false;

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

  if (reducedMotion || shouldIsolateSafariChrome()) return;

  const narrowViewport =
    typeof window.matchMedia === "function" && window.matchMedia("(max-width: 767px)").matches;

  // Default Lenis lerp is 0.1; slightly higher on narrow viewports for wheel follow-through.
  // syncTouch stays off so touch uses native inertia; nested overflow scrollers stay native.
  const lerp = narrowViewport ? 0.105 : 0.1;

  lenis = new Lenis({
    lerp,
    smoothWheel: true,
    gestureOrientation: "vertical",
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.15,
    infinite: false,
    autoRaf: false,
    // Horizontal rails use overflow-x only; allowNestedScroll delegates wheel to them and
    // traps vertical page scroll when the pointer is over a card. virtualScroll below routes
    // vertical vs horizontal intent instead (see Lenis nested-scroll docs).
    allowNestedScroll: false,
    anchors: true,
    stopInertiaOnNavigate: true,
    virtualScroll: ({ deltaX, deltaY, event }) => {
      if (!(event instanceof Event)) return true;
      if (!isHorizontalRailEventTarget(event)) return true;

      // Vertical wheel over a horizontal rail should scroll the page (Lenis).
      if (!hasHorizontalGestureIntent(deltaX, deltaY, event)) return true;

      // Horizontal wheel over the rail: let the rail consume it natively.
      return false;
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
  // Lenis + GSAP integration: disable lag smoothing so scroll scrubbing stays in sync.
  gsap.ticker.lagSmoothing(0);
  lagSmoothingApplied = true;

  setScrollEngine(lenis);
  document.documentElement.dataset.lenisActive = "true";

  scheduleScrollTriggerRefresh("immediate");
}

/** Tear down the current Lenis instance and stop the RAF loop. */
export function destroyLenis(): void {
  cancelPendingScrollTriggerRefresh();

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (lenis && scrollCallback) {
    lenis.off("scroll", scrollCallback);
    scrollCallback = null;
  }

  setScrollEngine(null);
  delete document.documentElement.dataset.lenisActive;

  if (lagSmoothingApplied) {
    gsap.ticker.lagSmoothing(500, 33);
    lagSmoothingApplied = false;
  }

  lenis?.destroy();
  lenis = null;
}
