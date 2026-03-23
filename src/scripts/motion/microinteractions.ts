/**
 * Microinteraction enhancements using Motion springs.
 *
 * Motion fully owns hover/press animations for all interactive elements.
 * CSS provides the resting state and the compound transform formula;
 * this module animates the custom-property inputs with spring physics.
 */

import { animateDOM } from "./dom-animate";
import { SPRING_BOUNCY, SPRING_RESPONSIVE, SPRING_SMOOTH, SPRING_SNAPPY } from "./springs";

const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

type DisposeFn = VoidFunction;

let disposers: DisposeFn[] = [];

/* ── Helpers ────────────────────────────────────────────────── */

function onPointer(
  el: HTMLElement,
  event: string,
  handler: (e: PointerEvent) => void,
  options?: AddEventListenerOptions,
): void {
  el.addEventListener(event, handler as EventListener, options);
  disposers.push(() => el.removeEventListener(event, handler as EventListener));
}

/* ── Hover elevation for cards (.hover-elevate) ─────────────── */

function setupHoverElevation(): void {
  if (!pointerMedia.matches) return;

  const cards = document.querySelectorAll<HTMLElement>(".hover-elevate:not([data-parallax-card])");

  for (const card of cards) {
    const targetTranslate =
      getComputedStyle(card).getPropertyValue("--hover-elevate-translate").trim() || "-6px";
    const targetScale =
      getComputedStyle(card).getPropertyValue("--hover-elevate-scale").trim() || "1.01";

    onPointer(
      card,
      "pointerenter",
      () => {
        animateDOM(
          card,
          { "--hover-translate": targetTranslate, "--hover-scale": targetScale },
          { ...SPRING_SNAPPY },
        );
      },
      { passive: true },
    );

    onPointer(
      card,
      "pointerleave",
      () => {
        animateDOM(
          card,
          { "--hover-translate": "0px", "--hover-scale": "1" },
          { ...SPRING_SMOOTH },
        );
      },
      { passive: true },
    );
  }
}

/* ── Parallax cards get elevation too (via parallax-tilt.ts for tilt,
     but we handle the elevation spring here) ───────────────── */

function setupParallaxCardElevation(): void {
  if (!pointerMedia.matches) return;

  const cards = document.querySelectorAll<HTMLElement>("[data-parallax-card]");

  for (const card of cards) {
    const targetTranslate =
      getComputedStyle(card).getPropertyValue("--hover-elevate-translate").trim() || "-6px";
    const targetScale =
      getComputedStyle(card).getPropertyValue("--hover-elevate-scale").trim() || "1.01";

    onPointer(
      card,
      "pointerenter",
      (e) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        animateDOM(
          card,
          { "--hover-translate": targetTranslate, "--hover-scale": targetScale },
          { ...SPRING_SNAPPY },
        );
      },
      { passive: true },
    );

    onPointer(
      card,
      "pointerleave",
      () => {
        animateDOM(
          card,
          { "--hover-translate": "0px", "--hover-scale": "1" },
          { ...SPRING_SMOOTH },
        );
      },
      { passive: true },
    );
  }
}

/* ── Chip hover (.motion-chip) ──────────────────────────────── */

function setupChipHover(): void {
  if (!pointerMedia.matches) return;

  const chips = document.querySelectorAll<HTMLElement>(".motion-chip");

  for (const chip of chips) {
    onPointer(
      chip,
      "pointerenter",
      () => {
        animateDOM(
          chip,
          { "--motion-chip-lift": "-1px", "--motion-chip-scale": "1.01" },
          { ...SPRING_SNAPPY },
        );
      },
      { passive: true },
    );

    onPointer(
      chip,
      "pointerleave",
      () => {
        animateDOM(
          chip,
          { "--motion-chip-lift": "0px", "--motion-chip-scale": "1" },
          { ...SPRING_SMOOTH },
        );
      },
      { passive: true },
    );
  }
}

/* ── CTA pill hover + arrow spring (.motion-cta-pill) ──────── */

function setupCtaPills(): void {
  if (!pointerMedia.matches) return;

  const pills = document.querySelectorAll<HTMLElement>(".motion-cta-pill");

  for (const pill of pills) {
    const arrow = pill.querySelector<HTMLElement>("svg, [data-phosphor-icon]");

    onPointer(
      pill,
      "pointerenter",
      () => {
        animateDOM(
          pill,
          { "--cta-pill-lift": "-1px", "--cta-pill-scale": "1.01" },
          { ...SPRING_SNAPPY },
        );
        if (arrow) {
          animateDOM(
            arrow,
            { "--cta-arrow-x": "3px", "--cta-arrow-y": "-3px" },
            { ...SPRING_SNAPPY },
          );
        }
      },
      { passive: true },
    );

    onPointer(
      pill,
      "pointerleave",
      () => {
        animateDOM(
          pill,
          { "--cta-pill-lift": "0px", "--cta-pill-scale": "1" },
          { ...SPRING_SMOOTH },
        );
        if (arrow) {
          animateDOM(
            arrow,
            { "--cta-arrow-x": "0px", "--cta-arrow-y": "0px" },
            { ...SPRING_SMOOTH },
          );
        }
      },
      { passive: true },
    );
  }
}

/* ── Inline link hover (.motion-link-inline) ────────────────── */

function setupLinkInlineHover(): void {
  if (!pointerMedia.matches) return;

  const links = document.querySelectorAll<HTMLElement>(".motion-link-inline");

  for (const link of links) {
    onPointer(
      link,
      "pointerenter",
      () => {
        animateDOM(link, { "--motion-link-lift": "-1px" }, { ...SPRING_SNAPPY });
      },
      { passive: true },
    );

    onPointer(
      link,
      "pointerleave",
      () => {
        animateDOM(link, { "--motion-link-lift": "0px" }, { ...SPRING_SMOOTH });
      },
      { passive: true },
    );
  }
}

/* ── Press scale (all interactive elements) ─────────────────── */

function setupPressScale(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    ".motion-chip, .motion-cta-pill, .motion-link-inline",
  );

  for (const el of targets) {
    onPointer(
      el,
      "pointerdown",
      () => {
        animateDOM(el, { "--press-scale": "0.965" }, { ...SPRING_RESPONSIVE });
      },
      { passive: true },
    );

    const release = () => {
      animateDOM(el, { "--press-scale": "1" }, { ...SPRING_BOUNCY });
    };

    onPointer(el, "pointerup", release, { passive: true });
    onPointer(el, "pointerleave", release, { passive: true });
  }
}

/* ── Public API ─────────────────────────────────────────────── */

export function initMicrointeractions(): void {
  cleanupMicrointeractions();
  setupHoverElevation();
  setupParallaxCardElevation();
  setupChipHover();
  setupCtaPills();
  setupLinkInlineHover();
  setupPressScale();
}

export function cleanupMicrointeractions(): void {
  for (const dispose of disposers) dispose();
  disposers = [];
}
