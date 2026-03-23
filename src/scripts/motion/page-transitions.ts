/**
 * Route-aware page enter / leave transitions using Motion.
 *
 * Determines transition direction based on navigation depth:
 *   deeper  → content slides in from right
 *   shallower → content slides in from left
 *   same level → crossfade with subtle scale
 *
 * Preserves the `data-page-state` attribute on `<body>` so that
 * existing CSS rules (pointer-events, glass state, etc.) continue
 * to work.
 */

import type { DOMKeyframesDefinition } from "motion";
import { animateDOM } from "./dom-animate";
import { SPRING_HEAVY, SPRING_RESPONSIVE, SPRING_SMOOTH } from "./springs";

const SESSION_KEY = "motion:last-path";

let linkHandler: ((e: MouseEvent) => void) | null = null;
let leaveTimeout: number | null = null;
let links: HTMLAnchorElement[] = [];

/* ── Route depth ────────────────────────────────────────────── */

function routeDepth(path: string): number {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return 0;
  return clean.split("/").filter(Boolean).length;
}

type Direction = "forward" | "backward" | "same";

function transitionDirection(from: string, to: string): Direction {
  const depthFrom = routeDepth(from);
  const depthTo = routeDepth(to);
  if (depthTo > depthFrom) return "forward";
  if (depthTo < depthFrom) return "backward";
  return "same";
}

function enterKeyframes(dir: Direction): DOMKeyframesDefinition {
  switch (dir) {
    case "forward":
      return { opacity: [0, 1], transform: ["translateX(20px)", "translateX(0)"] };
    case "backward":
      return { opacity: [0, 1], transform: ["translateX(-20px)", "translateX(0)"] };
    case "same":
      return { opacity: [0, 1], transform: ["scale(0.99)", "scale(1)"] };
  }
}

function leaveKeyframes(dir: Direction): DOMKeyframesDefinition {
  switch (dir) {
    case "forward":
      return { opacity: [1, 0], transform: ["translateX(0)", "translateX(-12px)"] };
    case "backward":
      return { opacity: [1, 0], transform: ["translateX(0)", "translateX(12px)"] };
    case "same":
      return { opacity: [1, 0], transform: ["scale(1)", "scale(0.99)"] };
  }
}

/* ── Public API ─────────────────────────────────────────────── */

export function initPageTransitions(): void {
  cleanupPageTransitions();

  const content = document.querySelector<HTMLElement>(".content");
  if (!content) return;

  const body = document.body;
  const currentPath = window.location.pathname;
  const lastPath = sessionStorage.getItem(SESSION_KEY) ?? "/";
  const dir = transitionDirection(lastPath, currentPath);

  // Store current path for next navigation
  sessionStorage.setItem(SESSION_KEY, currentPath);

  // Enter animation
  body.dataset.pageState = "entering";
  const enterSpring = dir === "same" ? SPRING_HEAVY : SPRING_SMOOTH;
  animateDOM(content, enterKeyframes(dir), { ...enterSpring }).finished.then(() => {
    body.dataset.pageState = "ready";
  });

  // Internal link interception for leave animation
  links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]:not([target]):not([download])'),
  );

  linkHandler = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;

    const link = event.currentTarget;
    if (!(link instanceof HTMLAnchorElement)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (body.dataset.pageState === "leaving") return;

    event.preventDefault();
    body.dataset.pageState = "leaving";

    // Store target path so the enter animation on the next page knows direction
    sessionStorage.setItem(SESSION_KEY, currentPath);

    const leaveDir = transitionDirection(currentPath, url.pathname);
    animateDOM(content, leaveKeyframes(leaveDir), { ...SPRING_RESPONSIVE }).finished.then(() => {
      window.location.assign(url.toString());
    });

    // Safety timeout — navigate even if animation stalls
    leaveTimeout = window.setTimeout(() => {
      leaveTimeout = null;
      window.location.assign(url.toString());
    }, 400);
  };

  for (const link of links) {
    link.addEventListener("click", linkHandler as EventListener);
  }
}

export function cleanupPageTransitions(): void {
  if (linkHandler) {
    for (const link of links) {
      link.removeEventListener("click", linkHandler as EventListener);
    }
    linkHandler = null;
    links = [];
  }

  if (leaveTimeout !== null) {
    window.clearTimeout(leaveTimeout);
    leaveTimeout = null;
  }
}
