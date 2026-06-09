/**
 * Desktop topbar tab-select: sliding glass indicator on hover/focus.
 */

import { animateDOM } from "./dom-animate";
import { isReducedMotion } from "./reduced-motion";
import { SPRING_SMOOTH } from "./springs";

const DESKTOP_MEDIA = "(min-width: 1025px)";
const SHELL_SELECTOR = "[data-topbar-nav-shell]";
const INDICATOR_SELECTOR = "[data-topbar-tab-indicator]";
const LINK_SELECTOR = ".topbar__navLink";
const LIST_SELECTOR = "[data-topbar-list]";
const MASK_SELECTOR = "[data-topbar-mask]";

type IndicatorMetrics = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let shell: HTMLElement | null = null;
let indicator: HTMLElement | null = null;
let activeLink: HTMLElement | null = null;
let hoverLink: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;
let mediaQuery: MediaQueryList | null = null;
let controls: { stop: () => void } | null = null;
const cleanups: Array<() => void> = [];

function isDesktop(): boolean {
  return mediaQuery?.matches ?? window.matchMedia(DESKTOP_MEDIA).matches;
}

const INDICATOR_INSET_Y = 2;

function measureLink(link: HTMLElement, container: HTMLElement): IndicatorMetrics {
  const containerRect = container.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();

  return {
    x: linkRect.left - containerRect.left,
    y: linkRect.top - containerRect.top + INDICATOR_INSET_Y,
    width: linkRect.width,
    height: Math.max(linkRect.height - INDICATOR_INSET_Y * 2, 0),
  };
}

function applyMetrics(metrics: IndicatorMetrics, animate: boolean): void {
  if (!indicator || !shell) return;

  const reduced = isReducedMotion();
  const target = {
    x: metrics.x,
    y: metrics.y,
    width: metrics.width,
    height: metrics.height,
  };

  controls?.stop();
  controls = null;

  if (!animate || reduced) {
    indicator.style.transform = `translate(${target.x}px, ${target.y}px)`;
    indicator.style.width = `${target.width}px`;
    indicator.style.height = `${target.height}px`;
    return;
  }

  controls = animateDOM(indicator, target, SPRING_SMOOTH);
}

function targetLink(): HTMLElement | null {
  return hoverLink ?? activeLink;
}

function syncIndicator(animate = false): void {
  if (!shell || !indicator || !isDesktop()) return;

  const link = targetLink();
  if (!link) return;

  applyMetrics(measureLink(link, shell), animate);
}

function showIndicator(): void {
  if (!indicator) return;
  indicator.hidden = false;
}

function onPointerEnter(event: Event): void {
  const link = event.currentTarget;
  if (!(link instanceof HTMLElement)) return;
  hoverLink = link;
  syncIndicator(true);
}

function onPointerLeave(): void {
  hoverLink = null;
  syncIndicator(true);
}

function onFocusIn(event: FocusEvent): void {
  const link = event.currentTarget;
  if (!(link instanceof HTMLElement)) return;
  hoverLink = link;
  syncIndicator(true);
}

function onFocusOut(event: FocusEvent): void {
  const shellEl = shell;
  if (!shellEl) return;

  const next = event.relatedTarget;
  if (next instanceof Node && shellEl.contains(next)) return;

  hoverLink = null;
  syncIndicator(true);
}

function bindKeyboardRoving(links: HTMLElement[]): void {
  links.forEach((link, index) => {
    link.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const nextIndex =
        event.key === "ArrowRight"
          ? (index + 1) % links.length
          : (index - 1 + links.length) % links.length;
      links[nextIndex]?.focus();
    });
  });
}

function bindMaskScroll(): void {
  const mask = document.querySelector<HTMLElement>(MASK_SELECTOR);
  const list = mask?.querySelector<HTMLElement>(LIST_SELECTOR);
  if (!mask || !list) return;

  const updateEdges = () => {
    const atStart = mask.scrollLeft <= 1;
    const atEnd = mask.scrollLeft + mask.clientWidth >= mask.scrollWidth - 1;
    mask.dataset.edgeStart = atStart ? "true" : "false";
    mask.dataset.edgeEnd = atEnd ? "true" : "false";
  };

  const centerActive = () => {
    if (isDesktop()) return;
    const active = list.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!active) return;

    const reduceMotion = isReducedMotion();
    requestAnimationFrame(() => {
      const activeRect = active.getBoundingClientRect();
      const maskRect = mask.getBoundingClientRect();
      const offset = activeRect.left - maskRect.left;
      const scrollLeft = mask.scrollLeft + offset - (mask.clientWidth - active.clientWidth) / 2;
      mask.scrollTo({
        left: Math.max(scrollLeft, 0),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  };

  updateEdges();
  centerActive();
  mask.addEventListener("scroll", updateEdges, { passive: true });

  const onResize = () => {
    updateEdges();
    centerActive();
  };

  window.addEventListener("resize", onResize);

  cleanups.push(() => {
    mask.removeEventListener("scroll", updateEdges);
    window.removeEventListener("resize", onResize);
  });
}

function bindShell(): void {
  shell = document.querySelector<HTMLElement>(SHELL_SELECTOR);
  indicator = document.querySelector<HTMLElement>(INDICATOR_SELECTOR);
  if (!shell || !indicator) return;

  const links = [...shell.querySelectorAll<HTMLElement>(LINK_SELECTOR)];
  if (links.length === 0) return;

  activeLink = shell.querySelector<HTMLElement>(`${LINK_SELECTOR}[aria-current="page"]`);
  showIndicator();
  syncIndicator(false);

  for (const link of links) {
    link.addEventListener("mouseenter", onPointerEnter);
    link.addEventListener("mouseleave", onPointerLeave);
    link.addEventListener("focusin", onFocusIn);
    link.addEventListener("focusout", onFocusOut);
  }

  bindKeyboardRoving(links);

  resizeObserver = new ResizeObserver(() => syncIndicator(false));
  resizeObserver.observe(shell);
  for (const link of links) {
    resizeObserver.observe(link);
  }

  const onResize = () => {
    if (!isDesktop()) return;
    syncIndicator(false);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
}

function unbindShell(): void {
  controls?.stop();
  controls = null;

  if (shell) {
    const links = [...shell.querySelectorAll<HTMLElement>(LINK_SELECTOR)];
    for (const link of links) {
      link.removeEventListener("mouseenter", onPointerEnter);
      link.removeEventListener("mouseleave", onPointerLeave);
      link.removeEventListener("focusin", onFocusIn);
      link.removeEventListener("focusout", onFocusOut);
    }
  }

  resizeObserver?.disconnect();
  resizeObserver = null;

  if (indicator) {
    indicator.hidden = true;
    indicator.style.removeProperty("transform");
    indicator.style.removeProperty("width");
    indicator.style.removeProperty("height");
  }

  shell = null;
  indicator = null;
  activeLink = null;
  hoverLink = null;
}

function onMediaChange(): void {
  if (isDesktop()) {
    if (!shell) bindShell();
    else syncIndicator(false);
    return;
  }

  unbindShell();
}

export function initTopbarTabSelect(): void {
  if (typeof window === "undefined") return;

  cleanupTopbarTabSelect();
  bindMaskScroll();

  mediaQuery = window.matchMedia(DESKTOP_MEDIA);
  mediaQuery.addEventListener("change", onMediaChange);

  if (isDesktop()) {
    bindShell();
  }
}

export function cleanupTopbarTabSelect(): void {
  mediaQuery?.removeEventListener("change", onMediaChange);
  mediaQuery = null;
  unbindShell();
  for (const cleanup of cleanups.splice(0)) {
    cleanup();
  }
}
