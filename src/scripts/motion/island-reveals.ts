/**
 * Entrance animations for dynamically hydrated Solid.js islands.
 *
 * Listens for `motion:island-ready` custom events dispatched by islands
 * after they mount, then staggers in their content with spring physics.
 */

import { stagger } from "motion";
import { animateDOM } from "./dom-animate";
import { SPRING_SMOOTH } from "./springs";

type CleanupFn = VoidFunction;

let cleanups: CleanupFn[] = [];

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

  // Repo cards
  const cards = Array.from(section.querySelectorAll<HTMLElement>("article"));
  if (cards.length) {
    animateDOM(
      cards,
      { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0)"] },
      { ...SPRING_SMOOTH, delay: stagger(0.08) },
    );
  }

  // Commit list items
  const commits = Array.from(section.querySelectorAll<HTMLElement>("li"));
  if (commits.length) {
    animateDOM(
      commits,
      { opacity: [0, 1], transform: ["translateX(8px)", "translateX(0)"] },
      { ...SPRING_SMOOTH, delay: stagger(0.03, { startDelay: 0.15 }) },
    );
  }
}

/* ── Public API ─────────────────────────────────────────────── */

export function initIslandReveals(): void {
  cleanupIslandReveals();
  document.addEventListener("motion:island-ready", handleIslandReady);
  cleanups.push(() => document.removeEventListener("motion:island-ready", handleIslandReady));
}

export function cleanupIslandReveals(): void {
  for (const fn of cleanups) fn();
  cleanups = [];
}
