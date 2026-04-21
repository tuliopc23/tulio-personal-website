/**
 * Entrance animations for dynamically hydrated Solid.js islands.
 *
 * Listens for `motion:island-ready` custom events dispatched by islands
 * after they mount, then staggers in their content with GSAP so the
 * island reveal system matches the rest of the scroll animation stack.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollTriggerRefresh } from "./scroll-trigger-refresh";

gsap.registerPlugin(ScrollTrigger);

type CleanupFn = VoidFunction;

let cleanups: CleanupFn[] = [];
let animations: Array<gsap.core.Tween> = [];
function handleIslandReady(event: Event): void {
  const detail = (event as CustomEvent).detail;
  const id = detail?.id;

  if (id === "github") {
    animateGitHubSection();
  }
}

function animateGitHubSection(): void {
  const section = document.getElementById("section-github");
  if (!section) return;

  const narrowViewport =
    typeof window.matchMedia === "function" && window.matchMedia("(max-width: 768px)").matches;
  const cardDuration = narrowViewport ? 0.58 : 0.68;
  const cardStagger = narrowViewport ? 0.06 : 0.08;
  const commitDuration = narrowViewport ? 0.48 : 0.56;
  const commitStagger = narrowViewport ? 0.02 : 0.03;

  // Repo cards
  const cards = Array.from(section.querySelectorAll<HTMLElement>("article"));
  if (cards.length) {
    gsap.set(cards, { autoAlpha: 0, y: 16 });
    animations.push(
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: cardDuration,
        ease: "power3.out",
        stagger: cardStagger,
        clearProps: "opacity,visibility,transform",
      }),
    );
  }

  // Commit list items
  const commits = Array.from(section.querySelectorAll<HTMLElement>("li"));
  if (commits.length) {
    gsap.set(commits, { autoAlpha: 0, x: 8 });
    animations.push(
      gsap.to(commits, {
        autoAlpha: 1,
        x: 0,
        duration: commitDuration,
        ease: "power3.out",
        stagger: commitStagger,
        delay: 0.15,
        clearProps: "opacity,visibility,transform",
      }),
    );
  }

  scheduleScrollTriggerRefresh("settled");
}

/* ── Public API ─────────────────────────────────────────────── */

export function initIslandReveals(): void {
  cleanupIslandReveals();
  document.addEventListener("motion:island-ready", handleIslandReady);
  cleanups.push(() => document.removeEventListener("motion:island-ready", handleIslandReady));
}

export function cleanupIslandReveals(): void {
  for (const animation of animations) animation.kill();
  animations = [];

  for (const fn of cleanups) fn();
  cleanups = [];
}
