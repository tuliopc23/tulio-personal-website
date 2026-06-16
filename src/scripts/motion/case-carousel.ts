/**
 * Case-study carousel (native scroll rail).
 *
 * Uses native horizontal scrolling plus scroll-snap so touch, trackpad,
 * and wheel behavior match the blog and GitHub rails.
 */

import { isReducedMotion } from "./reduced-motion";

let slider: HTMLElement | null = null;
let track: HTMLElement | null = null;
let pills: HTMLElement[] = [];
let slides: HTMLElement[] = [];
let previousButton: HTMLButtonElement | null = null;
let nextButton: HTMLButtonElement | null = null;
let progressLabel: HTMLElement | null = null;
let currentIndex = 0;
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

  const offset = slide.offsetLeft - track.offsetLeft;
  if (Number.isFinite(offset)) {
    return clamp(offset, 0, measureTrackLimit());
  }

  const trackRect = track.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  return clamp(track.scrollLeft + slideRect.left - trackRect.left, 0, measureTrackLimit());
}

function resolveNearestIndex(scrollLeft = track?.scrollLeft ?? 0): number {
  if (!track || slides.length === 0) return 0;

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((_, index) => {
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
    const isActive = i === index;
    slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    if (isActive) {
      slide.removeAttribute("inert");
    } else {
      slide.setAttribute("inert", "");
    }
  });
  pills.forEach((pill, i) => {
    pill.setAttribute("aria-pressed", i === index ? "true" : "false");
    pill.classList.toggle("cta-pill--accent", i === index);
    pill.classList.toggle("cta-pill--neutral", i !== index);
  });
  if (previousButton) previousButton.disabled = index === 0;
  if (nextButton) nextButton.disabled = index >= slides.length - 1;
  if (progressLabel) {
    progressLabel.textContent = `${index + 1} / ${slides.length}`;
  }
}

function goTo(index: number): void {
  if (!track || index < 0 || index >= slides.length) return;
  currentIndex = index;
  updateAria(index);
  const left = measureSlideLeft(index);
  track.scrollTo({
    left,
    behavior: "auto",
  });
  // scroll-snap can leave us a few px off after native scroll; align on next frame.
  requestAnimationFrame(() => {
    if (!track) return;
    const aligned = measureSlideLeft(index);
    if (Math.abs(track.scrollLeft - aligned) > 2) {
      track.scrollLeft = aligned;
    }
  });
}

function onTrackScroll(): void {
  if (!track || slides.length === 0) return;
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

function onControlClick(direction: -1 | 1): void {
  goTo(clamp(currentIndex + direction, 0, slides.length - 1));
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

function hasHorizontalWheelIntent(event: WheelEvent): boolean {
  const absX = Math.abs(event.deltaX);
  const absY = Math.abs(event.deltaY);
  return event.shiftKey || (absX >= DRAG_INTENT_THRESHOLD && absX > absY * 1.15);
}

function onTrackWheel(event: WheelEvent): void {
  if (!track || isReducedMotion()) return;

  const limit = measureTrackLimit();
  if (limit <= 4 || !hasHorizontalWheelIntent(event)) return;

  const delta =
    Math.abs(event.deltaX) >= DRAG_INTENT_THRESHOLD &&
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
  if (Math.abs(delta) < 0.5) return;

  const atStart = track.scrollLeft <= 2;
  const atEnd = track.scrollLeft >= limit - 2;
  const wantsBackward = delta < 0;
  const wantsForward = delta > 0;
  if ((wantsBackward && atStart) || (wantsForward && atEnd)) return;

  event.preventDefault();
  track.scrollLeft = clamp(track.scrollLeft + delta, 0, limit);
}

export function initCaseCarousel(): void {
  cleanupCaseCarousel();

  slider = document.querySelector<HTMLElement>("[data-case-slider]");
  if (!slider) return;

  track = slider.querySelector<HTMLElement>("[data-case-track]");
  pills = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-nav]"));
  slides = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-slide]"));
  previousButton = slider.querySelector<HTMLButtonElement>("[data-case-prev]");
  nextButton = slider.querySelector<HTMLButtonElement>("[data-case-next]");
  progressLabel = slider.querySelector<HTMLElement>("[data-case-progress]");
  if (!track || slides.length === 0) return;

  track.setAttribute("data-lenis-prevent-horizontal", "");
  if (!track.hasAttribute("tabindex")) {
    track.tabIndex = 0;
  }

  updateAria(0);
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

  const onPreviousClick = () => onControlClick(-1);
  const onNextClick = () => onControlClick(1);
  previousButton?.addEventListener("click", onPreviousClick);
  nextButton?.addEventListener("click", onNextClick);
  cleanupFns.push(() => {
    previousButton?.removeEventListener("click", onPreviousClick);
    nextButton?.removeEventListener("click", onNextClick);
  });

  track.addEventListener("scroll", onTrackScroll, { passive: true });
  track.addEventListener("wheel", onTrackWheel, { passive: false });
  track.addEventListener("keydown", onTrackKeyDown);
  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerUp);
  track.addEventListener("click", onTrackClickCapture, true);
  window.addEventListener("resize", onResize, { passive: true });
  cleanupFns.push(() => {
    track?.removeEventListener("scroll", onTrackScroll);
    track?.removeEventListener("wheel", onTrackWheel);
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
  previousButton = null;
  nextButton = null;
  progressLabel = null;
  currentIndex = 0;
  suppressClick = false;
}
