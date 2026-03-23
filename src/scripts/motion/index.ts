/**
 * Motion system orchestrator.
 *
 * Initialises Lenis smooth scrolling and all Motion-based animation
 * sub-systems, and hooks into Astro's page-lifecycle events so that
 * everything tears down cleanly on navigation and re-initialises on
 * the new page.
 */

import { destroyLenis, initLenis } from "../lenis";
import { cleanupScrollIndicators, initScrollIndicators } from "../scroll-indicators";
import { cleanupGlassState, initGlassState } from "./glass-state";
import { cleanupIslandReveals, initIslandReveals } from "./island-reveals";
import { cleanupMicrointeractions, initMicrointeractions } from "./microinteractions";
import { cleanupPageTransitions, initPageTransitions } from "./page-transitions";
import { cleanupParallaxTilt, initParallaxTilt } from "./parallax-tilt";
import { isReducedMotion, onReducedMotionChange } from "./reduced-motion";
import { cleanupReveals, initReveals, showAllReveals } from "./reveals";
import { cleanupScrollProgress, initScrollProgress } from "./scroll-progress";

/* ── Lifecycle ──────────────────────────────────────────────── */

function init(): void {
  const reduced = isReducedMotion();
  initLenis(reduced);
  initGlassState();

  if (reduced) {
    showAllReveals();
    initScrollIndicators();
    return;
  }

  initReveals();
  initPageTransitions();
  initParallaxTilt();
  initMicrointeractions();
  initScrollProgress();
  initIslandReveals();
  initScrollIndicators();
}

function cleanup(): void {
  cleanupScrollIndicators();
  cleanupIslandReveals();
  cleanupScrollProgress();
  cleanupMicrointeractions();
  cleanupParallaxTilt();
  cleanupPageTransitions();
  cleanupReveals();
  cleanupGlassState();
  destroyLenis();
}

/* ── Preference toggle ──────────────────────────────────────── */

onReducedMotionChange(() => {
  cleanup();
  init();
});

/* ── Astro page lifecycle ───────────────────────────────────── */

let initialized = false;

function safeInit(): void {
  if (initialized) {
    // On subsequent navigations, cleanup first
    cleanup();
  }
  initialized = true;
  init();
}

document.addEventListener("astro:before-swap", () => {
  cleanup();
  initialized = false;
});
document.addEventListener("astro:page-load", () => {
  if (!initialized) safeInit();
});
window.addEventListener("pagehide", cleanup);

// Initialize as soon as the DOM is ready so first-touch / first-wheel
// interactions do not wait for late assets. `astro:page-load` still handles
// client-side navigations after `astro:before-swap` resets the flag.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (!initialized) safeInit();
    },
    { once: true },
  );
} else {
  if (!initialized) safeInit();
}
