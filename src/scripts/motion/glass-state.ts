/**
 * Topbar glass-state tracking.
 *
 * Switches `data-glass-state` between "rest" and "scrolled" on the
 * `<body>` element based on scroll position.  Uses Lenis scroll
 * events when available, falling back to the native scroll event.
 */

import { getLenis } from "../lenis";

type GlassState = "rest" | "scrolled";

let nativeHandler: (() => void) | null = null;
let lenisUnsub: (() => void) | null = null;
let lenisGlassRaf = 0;

function computeState(): GlassState {
  const body = document.body;
  const isHero = body.dataset.heroActive === "true";
  const threshold = isHero ? window.innerHeight * 0.5 : 32;
  const scrollY = getLenis()?.scroll ?? window.scrollY;
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

  if (!document.body.dataset.glassState) {
    document.body.dataset.glassState = "rest";
  }

  apply();

  const lenis = getLenis();

  if (lenis) {
    const handler = (): void => {
      if (lenisGlassRaf) return;
      lenisGlassRaf = requestAnimationFrame(() => {
        lenisGlassRaf = 0;
        apply();
      });
    };
    lenis.on("scroll", handler);
    lenisUnsub = () => {
      lenis.off("scroll", handler);
      if (lenisGlassRaf) {
        cancelAnimationFrame(lenisGlassRaf);
        lenisGlassRaf = 0;
      }
    };
  } else {
    // Reduced-motion fallback (no Lenis)
    let frame = 0;
    const onScroll = (): void => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    nativeHandler = () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }
}

export function cleanupGlassState(): void {
  lenisUnsub?.();
  lenisUnsub = null;
  nativeHandler?.();
  nativeHandler = null;
}
