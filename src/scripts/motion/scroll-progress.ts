/**
 * Scroll-linked progress animations.
 *
 * Uses Motion's `scroll()` for declarative scroll-bound effects:
 * - Hero scroll indicator line animation
 * - Hero section parallax fade on scroll
 */

import { scroll } from "motion";
import { animateDOM } from "./dom-animate";

type StopFn = VoidFunction;

let cleanups: StopFn[] = [];

/* ── Hero scroll indicator ──────────────────────────────────── */

function setupHeroScrollIndicator(): void {
  const hero = document.querySelector<HTMLElement>(".hero-remotion");
  if (!hero) return;

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

  // Parallax fade on the hero player
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

/* ── Card grid differential parallax ────────────────────────── */

function setupGridParallax(): void {
  const grids = document.querySelectorAll<HTMLElement>("[data-scroll-parallax-grid]");

  for (const grid of grids) {
    const items = Array.from(grid.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );

    for (let i = 0; i < items.length; i++) {
      const even = i % 2 === 0;
      const stop = scroll(
        animateDOM(items[i], {
          transform: even
            ? ["translateY(6px)", "translateY(-6px)"]
            : ["translateY(-4px)", "translateY(4px)"],
        }),
        { target: items[i], offset: ["start end", "end start"] },
      );
      cleanups.push(stop);
    }
  }
}

/* ── Public API ─────────────────────────────────────────────── */

export function initScrollProgress(): void {
  cleanupScrollProgress();
  setupHeroScrollIndicator();
  setupGridParallax();
}

export function cleanupScrollProgress(): void {
  for (const stop of cleanups) stop();
  cleanups = [];
}
