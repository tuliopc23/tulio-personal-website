/**
 * Scroll-linked progress animations.
 *
 * Uses GSAP ScrollTrigger (scrub) so hero corridor effects share Lenis'
 * scroll lifecycle instead of running a separate Motion scroll timeline.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollTriggerRefresh } from "./scroll-trigger-refresh";

gsap.registerPlugin(ScrollTrigger);

type CleanupFn = VoidFunction;

let cleanups: CleanupFn[] = [];

function isNarrowViewport(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 767px)").matches;
}

function rememberScrollTrigger(trigger: ScrollTrigger, extra?: CleanupFn): void {
  cleanups.push(() => {
    trigger.kill();
    extra?.();
  });
}

function scrubTween(
  target: HTMLElement,
  vars: gsap.TweenVars,
  trigger: HTMLElement,
  start: string,
  end: string,
): ScrollTrigger {
  const tween = gsap.to(target, {
    ...vars,
    ease: "none",
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: true,
    },
  });

  const st = tween.scrollTrigger;
  if (!st) {
    tween.kill();
    throw new Error("scroll-progress: ScrollTrigger did not attach");
  }

  rememberScrollTrigger(st, () => tween.kill());
  return st;
}

/* ── Hero scroll indicator ──────────────────────────────────── */

function setupHeroScrollIndicator(): void {
  const hero = document.querySelector<HTMLElement>(".hero-remotion");
  if (!hero) return;

  const narrow = isNarrowViewport();
  const scrollLine = document.querySelector<HTMLElement>(".hero-remotion__scrollLine");
  const scrollLabel = document.querySelector<HTMLElement>(".hero-remotion__scroll");

  if (scrollLine) {
    gsap.set(scrollLine, { scaleY: 0, opacity: 1, transformOrigin: "top center" });
    scrubTween(
      scrollLine,
      { scaleY: 1, opacity: 0 },
      hero,
      "start start",
      "end start",
    );
  }

  if (scrollLabel) {
    gsap.set(scrollLabel, { opacity: 1, y: 0 });
    scrubTween(
      scrollLabel,
      { opacity: 0, y: -12 },
      hero,
      "start start",
      "30% start",
    );
  }

  if (!narrow) {
    const player = hero.querySelector<HTMLElement>(".hero-remotion__player");
    if (player) {
      gsap.set(player, { opacity: 1, y: 0, scale: 1 });
      scrubTween(
        player,
        { opacity: 0.3, y: -40, scale: 0.97 },
        hero,
        "start start",
        "end start",
      );
    }
  }

  const heroBridge = document.querySelector<HTMLElement>(".homepage-stage--hero-bridge");
  if (heroBridge) {
    gsap.set(heroBridge, { opacity: 0.86, y: 10 });
    scrubTween(
      heroBridge,
      { opacity: 1, y: 0 },
      hero,
      "55% start",
      "end start",
    );
  }

  gsap.set(hero, { "--hero-feather-opacity": 0.72 });
  scrubTween(
    hero,
    { "--hero-feather-opacity": 1 },
    hero,
    "start start",
    "end start",
  );

  scheduleScrollTriggerRefresh("settled");
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
