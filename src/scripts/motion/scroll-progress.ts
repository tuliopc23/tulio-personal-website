/**
 * Scroll-linked progress animations.
 *
 * Uses Motion's `scroll()` for declarative scroll-bound effects:
 * - Hero scroll indicator line animation
 * - Hero section parallax fade on scroll
 *
 * On narrow viewports the hero Remotion player skips transform/opacity scroll
 * binding to reduce main-thread work alongside Lenis and video.
 */

import { scroll } from "motion";
import { animateDOM } from "./dom-animate";

type StopFn = VoidFunction;

let cleanups: StopFn[] = [];

function isNarrowViewport(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 768px)").matches;
}

/* ── Hero scroll indicator ──────────────────────────────────── */

function setupHeroScrollIndicator(): void {
  const hero = document.querySelector<HTMLElement>(".hero-remotion");
  if (!hero) return;

  const narrow = isNarrowViewport();
  const scrollLine = document.querySelector<HTMLElement>(".hero-remotion__scrollLine");
  const scrollLabel = document.querySelector<HTMLElement>(".hero-remotion__scroll");

  // Animate the scroll indicator line
  if (scrollLine) {
    const stop = scroll(animateDOM(scrollLine, { scaleY: [0, 1], opacity: [1, 0] }), {
      target: hero,
      offset: ["start start", "end start"],
    });
    cleanups.push(stop);
  }

  // Fade out the entire scroll prompt as user scrolls
  if (scrollLabel) {
    const stop = scroll(
      animateDOM(scrollLabel, {
        opacity: [1, 0],
        transform: ["translateY(0)", "translateY(-12px)"],
      }),
      { target: hero, offset: ["start start", "0.3 start"] },
    );
    cleanups.push(stop);
  }

  // Parallax fade on the hero player (desktop only — mobile avoids extra scroll listeners on video)
  if (!narrow) {
    const player = hero.querySelector<HTMLElement>(".hero-remotion__player");
    if (player) {
      const stop = scroll(
        animateDOM(player, {
          opacity: [1, 0.3],
          transform: ["translateY(0)", "translateY(-40px) scale(0.97)"],
        }),
        { target: hero, offset: ["start start", "end start"] },
      );
      cleanups.push(stop);
    }
  }
}

/* ── Public API ─────────────────────────────────────────────── */

export function initScrollProgress(): void {
  cleanupScrollProgress();
  setupHeroScrollIndicator();
}

export function cleanupScrollProgress(): void {
  for (const stop of cleanups) stop();
  cleanups = [];
}
