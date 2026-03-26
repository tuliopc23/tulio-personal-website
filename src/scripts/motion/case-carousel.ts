/**
 * Case-study carousel with swipe gestures and spring animations.
 *
 * Drives the horizontal strip on `/projects` — pill navigation,
 * pointer-based swipe, and keyboard arrows all stay in sync
 * through a single `goTo(index)` function.
 *
 * No visible rails or scrollbar. A small blue hint CTA provides
 * discoverability and dismisses after the first interaction.
 */

import type { AnimationPlaybackControlsWithThen } from "motion";
import { animateDOM } from "./dom-animate";
import { isReducedMotion } from "./reduced-motion";
import { SPRING_SMOOTH, SPRING_SNAPPY } from "./springs";

/* ── State ─────────────────────────────────────────────────── */

let slider: HTMLElement | null = null;
let strip: HTMLElement | null = null;
let track: HTMLElement | null = null;
let pills: HTMLElement[] = [];
let slides: HTMLElement[] = [];
let indicator: HTMLElement | null = null;
let hint: HTMLElement | null = null;

let currentIndex = 0;
let count = 0;
let hasDismissedHint = false;

// Pointer tracking
let pointerDown = false;
let startX = 0;
let startTime = 0;
let currentDelta = 0;

// Animation handles
let stripAnim: AnimationPlaybackControlsWithThen | null = null;
let indicatorAnim: AnimationPlaybackControlsWithThen | null = null;
let hintAnim: AnimationPlaybackControlsWithThen | null = null;

/* ── Helpers ───────────────────────────────────────────────── */

function sw(): number {
  return track ? track.offsetWidth : 0;
}

function pillMetrics(index: number): { left: number; width: number } {
  const pill = pills[index];
  if (!pill || !pill.parentElement) return { left: 0, width: 0 };
  return { left: pill.offsetLeft, width: pill.offsetWidth };
}

function updateAria(index: number): void {
  slides.forEach((s, i) => {
    s.setAttribute("aria-hidden", i === index ? "false" : "true");
  });
  pills.forEach((p, i) => {
    p.setAttribute("aria-pressed", i === index ? "true" : "false");
    p.classList.toggle("cta-pill--accent", i === index);
    p.classList.toggle("cta-pill--neutral", i !== index);
  });
}

/* ── Hint CTA ──────────────────────────────────────────────── */

function startHintLoop(): void {
  if (!hint || isReducedMotion()) return;
  hintAnim = animateDOM(
    hint,
    { transform: ["translateX(0px)", "translateX(-5px)", "translateX(0px)"] },
    { duration: 2, repeat: Infinity, ease: "easeInOut" },
  );
}

function dismissHint(): void {
  if (hasDismissedHint || !hint) return;
  hasDismissedHint = true;
  if (hintAnim) {
    hintAnim.stop();
    hintAnim = null;
  }
  if (isReducedMotion()) {
    hint.style.display = "none";
    return;
  }
  animateDOM(
    hint,
    { opacity: [null, 0], transform: [null, "translateX(-8px)"] },
    { ...SPRING_SNAPPY },
  ).finished.then(() => {
    if (hint) hint.style.display = "none";
  });
}

/* ── Indicator ─────────────────────────────────────────────── */

function moveIndicator(index: number, instant = false): void {
  if (!indicator) return;
  const m = pillMetrics(index);
  if (indicatorAnim) indicatorAnim.stop();
  if (instant || isReducedMotion()) {
    indicator.style.transform = `translateX(${m.left}px)`;
    indicator.style.width = `${m.width}px`;
  } else {
    indicatorAnim = animateDOM(
      indicator,
      { transform: [`translateX(${m.left}px)`], width: [`${m.width}px`] },
      { ...SPRING_SMOOTH },
    );
  }
}

function interpolateIndicator(fromIdx: number, delta: number): void {
  if (!indicator) return;
  const progress = -delta / sw();
  const toIdx = Math.max(0, Math.min(count - 1, fromIdx + (progress > 0 ? 1 : -1)));
  const t = Math.min(1, Math.abs(progress));
  const fromM = pillMetrics(fromIdx);
  const toM = pillMetrics(toIdx);
  indicator.style.transform = `translateX(${fromM.left + (toM.left - fromM.left) * t}px)`;
  indicator.style.width = `${fromM.width + (toM.width - fromM.width) * t}px`;
}

/* ── Core: goTo ────────────────────────────────────────────── */

function goTo(index: number, instant = false): void {
  if (index < 0 || index >= count) return;
  currentIndex = index;
  updateAria(index);
  dismissHint();

  const offset = -(index * sw());
  const reduced = isReducedMotion() || instant;

  if (stripAnim) stripAnim.stop();
  if (reduced) {
    strip!.style.transform = `translateX(${offset}px)`;
  } else {
    stripAnim = animateDOM(
      strip!,
      { transform: [`translateX(${offset}px)`] },
      { ...SPRING_SMOOTH },
    );
  }

  moveIndicator(index, reduced);
}

/* ── Pointer / swipe ───────────────────────────────────────── */

function onPointerDown(e: PointerEvent): void {
  if (e.button !== 0) return;
  pointerDown = true;
  startX = e.clientX;
  startTime = Date.now();
  currentDelta = 0;
  if (stripAnim) stripAnim.stop();
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent): void {
  if (!pointerDown || !strip) return;
  const raw = e.clientX - startX;

  // Rubber-band at edges
  const atStart = currentIndex === 0 && raw > 0;
  const atEnd = currentIndex === count - 1 && raw < 0;
  currentDelta = atStart || atEnd ? raw * 0.25 : raw;

  const base = -(currentIndex * sw());
  strip.style.transform = `translateX(${base + currentDelta}px)`;

  if (!isReducedMotion()) interpolateIndicator(currentIndex, currentDelta);
}

function onPointerUp(e: PointerEvent): void {
  if (!pointerDown) return;
  pointerDown = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

  const elapsed = Date.now() - startTime;
  const velocity = elapsed > 0 ? currentDelta / elapsed : 0;

  let target = currentIndex;
  if (Math.abs(currentDelta) > 80 || Math.abs(velocity) > 0.3) {
    target = currentDelta > 0 ? currentIndex - 1 : currentIndex + 1;
  }
  goTo(Math.max(0, Math.min(count - 1, target)));
}

function onPointerCancel(e: PointerEvent): void {
  if (!pointerDown) return;
  pointerDown = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  goTo(currentIndex);
}

/* ── Keyboard ──────────────────────────────────────────────── */

function onKeyDown(e: KeyboardEvent): void {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    if (currentIndex < count - 1) goTo(currentIndex + 1);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    if (currentIndex > 0) goTo(currentIndex - 1);
  }
}

/* ── Resize ────────────────────────────────────────────────── */

function onResize(): void {
  goTo(currentIndex, true);
}

/* ── Public API ────────────────────────────────────────────── */

export function initCaseCarousel(): void {
  cleanupCaseCarousel();

  slider = document.querySelector<HTMLElement>("[data-case-slider]");
  if (!slider) return;

  strip = slider.querySelector<HTMLElement>("[data-case-strip]");
  track = slider.querySelector<HTMLElement>("[data-case-track]");
  pills = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-nav]"));
  slides = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-slide]"));
  indicator = slider.querySelector<HTMLElement>("[data-pill-indicator]");
  hint = slider.querySelector<HTMLElement>("[data-swipe-hint]");

  count = slides.length;
  if (!strip || !track || count === 0) return;

  goTo(0, true);
  startHintLoop();

  pills.forEach((pill, i) => {
    pill.addEventListener("click", () => goTo(i));
    pill.addEventListener("keydown", onKeyDown);
  });

  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerCancel);

  window.addEventListener("resize", onResize);
}

export function cleanupCaseCarousel(): void {
  if (stripAnim) {
    stripAnim.stop();
    stripAnim = null;
  }
  if (indicatorAnim) {
    indicatorAnim.stop();
    indicatorAnim = null;
  }
  if (hintAnim) {
    hintAnim.stop();
    hintAnim = null;
  }

  if (track) {
    track.removeEventListener("pointerdown", onPointerDown);
    track.removeEventListener("pointermove", onPointerMove);
    track.removeEventListener("pointerup", onPointerUp);
    track.removeEventListener("pointercancel", onPointerCancel);
  }

  pills.forEach((pill) => pill.removeEventListener("keydown", onKeyDown));
  window.removeEventListener("resize", onResize);

  slider = null;
  strip = null;
  track = null;
  pills = [];
  slides = [];
  indicator = null;
  hint = null;
  currentIndex = 0;
  count = 0;
  hasDismissedHint = false;
  pointerDown = false;
}
