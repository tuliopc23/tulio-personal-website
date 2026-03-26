/**
 * Case-study carousel (native scroll rail).
 *
 * Uses native horizontal scrolling plus scroll-snap so touch, trackpad,
 * and wheel behavior match the blog and GitHub rails.
 */

import type { AnimationPlaybackControlsWithThen } from "motion";
import { animateDOM } from "./dom-animate";
import { isReducedMotion } from "./reduced-motion";
import { SPRING_SNAPPY } from "./springs";

let slider: HTMLElement | null = null;
let track: HTMLElement | null = null;
let pills: HTMLElement[] = [];
let slides: HTMLElement[] = [];
let hint: HTMLElement | null = null;
let currentIndex = 0;
let hasDismissedHint = false;
let hintAnim: AnimationPlaybackControlsWithThen | null = null;
const cleanupFns: Array<() => void> = [];
let scrollFrame = 0;
let dragPointerId: number | null = null;
let dragStartX = 0;
let dragStartY = 0;
let dragStartScrollLeft = 0;
let isDragging = false;
let suppressClick = false;

const DRAG_INTENT_THRESHOLD = 10;
const DRAG_CLICK_SUPPRESSION_DISTANCE = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function measureTrackLimit(): number {
  if (!track) return 0;
  return Math.max(0, track.scrollWidth - track.clientWidth);
}

function measureSlideLeft(index: number): number {
  if (!track) return 0;
  const slide = slides[index];
  if (!slide) return 0;

  const trackRect = track.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  return clamp(track.scrollLeft + slideRect.left - trackRect.left, 0, measureTrackLimit());
}

function resolveNearestIndex(scrollLeft = track?.scrollLeft ?? 0): number {
  if (!track || slides.length === 0) return 0;

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const distance = Math.abs(measureSlideLeft(index) - scrollLeft);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function updateAria(index: number): void {
  slides.forEach((slide, i) => {
    slide.setAttribute("aria-hidden", i === index ? "false" : "true");
  });
  pills.forEach((pill, i) => {
    pill.setAttribute("aria-pressed", i === index ? "true" : "false");
    pill.classList.toggle("cta-pill--accent", i === index);
    pill.classList.toggle("cta-pill--neutral", i !== index);
  });
}

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

function goTo(index: number): void {
  if (!track || index < 0 || index >= slides.length) return;
  currentIndex = index;
  updateAria(index);
  dismissHint();
  track.scrollTo({
    left: measureSlideLeft(index),
    behavior: isReducedMotion() ? "auto" : "smooth",
  });
}

function onTrackScroll(): void {
  if (!track || slides.length === 0) return;
  dismissHint();
  if (scrollFrame !== 0) return;

  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    const nextIndex = resolveNearestIndex(track?.scrollLeft ?? 0);
    if (nextIndex === currentIndex) return;
    currentIndex = nextIndex;
    updateAria(nextIndex);
  });
}

function onPillKeyDown(event: KeyboardEvent): void {
  const current = event.currentTarget as HTMLElement | null;
  if (!current || pills.length === 0) return;
  const index = pills.indexOf(current);
  if (index === -1) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    pills[(index + 1) % pills.length]?.focus();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    pills[(index - 1 + pills.length) % pills.length]?.focus();
  }
}

function onResize(): void {
  if (!track || slides.length === 0) return;
  track.scrollTo({ left: measureSlideLeft(currentIndex), behavior: "auto" });
}

function onTrackKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case "ArrowRight":
    case "PageDown":
      event.preventDefault();
      goTo(Math.min(currentIndex + 1, slides.length - 1));
      break;
    case "ArrowLeft":
    case "PageUp":
      event.preventDefault();
      goTo(Math.max(currentIndex - 1, 0));
      break;
    case "Home":
      event.preventDefault();
      goTo(0);
      break;
    case "End":
      event.preventDefault();
      goTo(slides.length - 1);
      break;
    default:
      break;
  }
}

function resetDragState(): void {
  if (track && dragPointerId !== null && track.hasPointerCapture(dragPointerId)) {
    track.releasePointerCapture(dragPointerId);
  }
  track?.classList.remove("is-dragging");
  dragPointerId = null;
  dragStartX = 0;
  dragStartY = 0;
  dragStartScrollLeft = 0;
  isDragging = false;
}

function onPointerDown(event: PointerEvent): void {
  if (!track || event.button !== 0 || event.pointerType === "touch") return;

  track.setPointerCapture(event.pointerId);
  dragPointerId = event.pointerId;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragStartScrollLeft = track.scrollLeft;
  isDragging = false;
  suppressClick = false;
}

function onPointerMove(event: PointerEvent): void {
  if (!track || dragPointerId !== event.pointerId) return;

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;

  if (!isDragging) {
    if (Math.abs(deltaX) < DRAG_INTENT_THRESHOLD && Math.abs(deltaY) < DRAG_INTENT_THRESHOLD) {
      return;
    }

    if (Math.abs(deltaY) >= Math.abs(deltaX)) {
      resetDragState();
      return;
    }

    isDragging = true;
    track.setPointerCapture(event.pointerId);
    track.classList.add("is-dragging");
  }

  event.preventDefault();
  dismissHint();
  suppressClick ||= Math.abs(deltaX) >= DRAG_CLICK_SUPPRESSION_DISTANCE;
  track.scrollLeft = clamp(dragStartScrollLeft - deltaX, 0, measureTrackLimit());
}

function finishPointerInteraction(pointerId: number): void {
  if (dragPointerId !== pointerId) return;

  const dragged = isDragging;
  resetDragState();

  if (dragged) {
    goTo(resolveNearestIndex(track?.scrollLeft ?? 0));
  }
}

function onPointerUp(event: PointerEvent): void {
  finishPointerInteraction(event.pointerId);
}

function onTrackClickCapture(event: Event): void {
  if (!suppressClick) return;

  suppressClick = false;
  event.preventDefault();
  event.stopPropagation();
}

export function initCaseCarousel(): void {
  cleanupCaseCarousel();

  slider = document.querySelector<HTMLElement>("[data-case-slider]");
  if (!slider) return;

  track = slider.querySelector<HTMLElement>("[data-case-track]");
  pills = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-nav]"));
  slides = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-slide]"));
  hint = slider.querySelector<HTMLElement>("[data-swipe-hint]");
  if (!track || slides.length === 0) return;

  track.setAttribute("data-lenis-prevent-touch", "");
  if (!track.hasAttribute("tabindex")) {
    track.tabIndex = 0;
  }

  updateAria(0);
  startHintLoop();
  track.scrollTo({ left: measureSlideLeft(0), behavior: "auto" });

  pills.forEach((pill, i) => {
    const onClick = () => goTo(i);
    pill.addEventListener("click", onClick);
    pill.addEventListener("keydown", onPillKeyDown);
    cleanupFns.push(() => {
      pill.removeEventListener("click", onClick);
      pill.removeEventListener("keydown", onPillKeyDown);
    });
  });

  track.addEventListener("scroll", onTrackScroll, { passive: true });
  track.addEventListener("keydown", onTrackKeyDown);
  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerUp);
  track.addEventListener("click", onTrackClickCapture, true);
  window.addEventListener("resize", onResize, { passive: true });
  cleanupFns.push(() => {
    track?.removeEventListener("scroll", onTrackScroll);
    track?.removeEventListener("keydown", onTrackKeyDown);
    track?.removeEventListener("pointerdown", onPointerDown);
    track?.removeEventListener("pointermove", onPointerMove);
    track?.removeEventListener("pointerup", onPointerUp);
    track?.removeEventListener("pointercancel", onPointerUp);
    track?.removeEventListener("click", onTrackClickCapture, true);
    window.removeEventListener("resize", onResize);
  });
}

export function cleanupCaseCarousel(): void {
  if (hintAnim) {
    hintAnim.stop();
    hintAnim = null;
  }

  if (scrollFrame !== 0) {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }
  cleanupFns.splice(0).forEach((cleanup) => cleanup());
  resetDragState();

  slider = null;
  track = null;
  pills = [];
  slides = [];
  hint = null;
  currentIndex = 0;
  hasDismissedHint = false;
  suppressClick = false;
}
