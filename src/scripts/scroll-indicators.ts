/**
 * Horizontal rail controller.
 *
 * Keeps native horizontal scrolling for carousels and card rails, while
 * translating desktop wheel and keyboard intent into smoother, snapped
 * horizontal movement. Vertical Lenis remains the only smooth-scroll engine.
 */

import { isReducedMotion } from "./motion/reduced-motion";

type CleanupFn = VoidFunction;

type RailTargets = {
  host: HTMLElement[];
  overflow: boolean;
  atStart: boolean;
  atEnd: boolean;
};

type RailController = {
  cleanup(): void;
  refresh(): void;
};

const RAIL_SELECTOR = ".articleGrid, .cardRail, [data-repo-rail]";
const SNAP_IDLE_MS = 120;
const WHEEL_GAIN = 0.95;
const KEYBOARD_MULTIPLIER = 0.92;
const HORIZONTAL_INTENT_MIN_DELTA = 6;
const HORIZONTAL_INTENT_RATIO = 1.15;
const DRAG_INTENT_THRESHOLD = 10;
const DRAG_CLICK_SUPPRESSION_DISTANCE = 12;

let controllers: RailController[] = [];
let cleanupFns: CleanupFn[] = [];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hasHorizontalIntent(deltaX: number, deltaY: number, forceHorizontal = false): boolean {
  if (forceHorizontal) return true;

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  return absX >= HORIZONTAL_INTENT_MIN_DELTA && absX > absY * HORIZONTAL_INTENT_RATIO;
}

function measureLimit(element: HTMLElement): number {
  return Math.max(0, element.scrollWidth - element.clientWidth);
}

function hasHorizontalOverflow(element: HTMLElement): boolean {
  return measureLimit(element) > 4;
}

function getRailHosts(element: HTMLElement): HTMLElement[] {
  return [
    element.closest<HTMLElement>(".articleCarousel"),
    element.closest<HTMLElement>(".container"),
    element.closest<HTMLElement>(".railContainer"),
  ].filter((target): target is HTMLElement => !!target);
}

function applyRailState(element: HTMLElement): RailTargets {
  const limit = measureLimit(element);
  const scrollLeft = element.scrollLeft;
  const overflow = limit > 4;
  const atStart = scrollLeft <= 10;
  const atEnd = scrollLeft >= limit - 10;
  const host = getRailHosts(element);

  element.dataset.hasOverflow = overflow ? "true" : "false";
  element.dataset.atStart = String(atStart);
  element.dataset.atEnd = String(atEnd);

  for (const target of host) {
    target.dataset.hasOverflow = overflow ? "true" : "false";
    target.dataset.atStart = String(atStart);
    target.dataset.atEnd = String(atEnd);
  }

  return { host, overflow, atStart, atEnd };
}

function measureStep(element: HTMLElement): number {
  const firstCard = element.firstElementChild;
  if (!(firstCard instanceof HTMLElement)) {
    return Math.max(element.clientWidth * 0.92, 220);
  }

  const styles = window.getComputedStyle(element);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
  return Math.max(firstCard.getBoundingClientRect().width + gap, 220);
}

function getSnapInline(element: HTMLElement): ScrollLogicalPosition {
  return element.matches("[data-repo-rail]") ? "center" : "start";
}

function resolveSnapLeft(element: HTMLElement, target: HTMLElement): number {
  const inline = getSnapInline(element);

  if (inline === "center") {
    return clamp(
      target.offsetLeft - (element.clientWidth - target.offsetWidth) / 2,
      0,
      measureLimit(element),
    );
  }

  return clamp(target.offsetLeft, 0, measureLimit(element));
}

function findSnapTarget(element: HTMLElement): HTMLElement | null {
  const items = Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && !child.hidden,
  );

  if (!items.length) return null;

  const inline = getSnapInline(element);
  const anchor =
    inline === "center" ? element.scrollLeft + element.clientWidth / 2 : element.scrollLeft;

  let best: HTMLElement | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const item of items) {
    const itemAnchor =
      inline === "center" ? item.offsetLeft + item.offsetWidth / 2 : item.offsetLeft;
    const distance = Math.abs(itemAnchor - anchor);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = item;
    }
  }

  return best;
}

function createRailController(element: HTMLElement): RailController {
  element.setAttribute("data-lenis-prevent-horizontal", "");

  if (!element.hasAttribute("tabindex")) {
    element.tabIndex = 0;
  }

  let raf: number | null = null;
  let snapTimer: number | null = null;
  let target = element.scrollLeft;
  // Track last frame time for time-based (frame-rate-independent) easing
  let lastFrameTime = 0;
  let dragPointerId: number | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartScrollLeft = 0;
  let isDragging = false;
  let suppressClick = false;

  // The per-frame lerp factor at 60 fps. The time-based formula normalises
  // this so 120 Hz screens animate at the same perceived speed as 60 Hz.
  const LERP_60FPS = 0.18;

  const cancelAnimation = (): void => {
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    lastFrameTime = 0;
  };

  const cancelSnap = (): void => {
    if (snapTimer !== null) {
      window.clearTimeout(snapTimer);
      snapTimer = null;
    }
  };

  const resetDragState = (): void => {
    if (dragPointerId !== null && element.hasPointerCapture(dragPointerId)) {
      element.releasePointerCapture(dragPointerId);
    }

    dragPointerId = null;
    dragStartX = 0;
    dragStartY = 0;
    dragStartScrollLeft = 0;
    isDragging = false;
    element.dataset.dragging = "false";
  };

  const animateTowardsTarget = (now: number): void => {
    const elapsed = lastFrameTime > 0 ? now - lastFrameTime : 1000 / 60;
    lastFrameTime = now;

    // Normalise the lerp factor to elapsed time so the animation feels
    // identical at 60 Hz, 90 Hz, and 120 Hz.
    const factor = 1 - Math.pow(1 - LERP_60FPS, elapsed / (1000 / 60));
    const next = target - element.scrollLeft;

    if (Math.abs(next) <= 0.5) {
      element.scrollLeft = target;
      applyRailState(element);
      raf = null;
      lastFrameTime = 0;
      return;
    }

    element.scrollLeft += next * factor;
    applyRailState(element);
    raf = requestAnimationFrame(animateTowardsTarget);
  };

  const startAnimation = (): void => {
    if (raf !== null) return;
    raf = requestAnimationFrame(animateTowardsTarget);
  };

  const setTarget = (next: number): void => {
    const limit = measureLimit(element);
    target = clamp(next, 0, limit);
    startAnimation();
  };

  const settleToNearest = (): void => {
    cancelSnap();
    if (isReducedMotion() || !hasHorizontalOverflow(element)) return;

    snapTimer = window.setTimeout(() => {
      snapTimer = null;
      const targetItem = findSnapTarget(element);
      if (!targetItem) return;

      setTarget(resolveSnapLeft(element, targetItem));
    }, SNAP_IDLE_MS);
  };

  const handleScroll = (): void => {
    target = element.scrollLeft;
    applyRailState(element);
    settleToNearest();
  };

  const handleWheel = (event: WheelEvent): void => {
    if (isReducedMotion() || !hasHorizontalOverflow(element)) return;

    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    const horizontalDominant = hasHorizontalIntent(event.deltaX, event.deltaY, event.shiftKey);
    const coarsePointer =
      typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;

    // Coarse pointers: only handle strong horizontal wheel (e.g. sideways trackpad on iPad).
    // Never remap vertical wheel to horizontal — native overflow-x + Lenis keep vertical smooth.
    if (coarsePointer && !horizontalDominant) {
      return;
    }

    // Fine pointer: horizontal wheel scrolls the rail; vertical wheel scrolls the page unless
    // Shift+wheel (maps vertical delta to horizontal), matching desktop carousel conventions.
    if (!horizontalDominant && !event.shiftKey) {
      return;
    }

    const delta =
      horizontalDominant && absX > 0.5
        ? event.deltaX
        : absY > 0.5
          ? event.deltaY
          : event.deltaX;

    if (Math.abs(delta) < 0.5) return;

    const state = applyRailState(element);
    const wantsBackward = delta < 0;
    const wantsForward = delta > 0;
    const canConsume =
      state.overflow && !((wantsBackward && state.atStart) || (wantsForward && state.atEnd));

    if (!canConsume) return;

    event.preventDefault();
    cancelSnap();
    setTarget(target + delta * measureStep(element) * 0.01 * WHEEL_GAIN);
    settleToNearest();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!hasHorizontalOverflow(element)) return;

    const step = measureStep(element) * KEYBOARD_MULTIPLIER;
    let nextTarget: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "PageDown":
        nextTarget = target + step;
        break;
      case "ArrowLeft":
      case "PageUp":
        nextTarget = target - step;
        break;
      case "Home":
        nextTarget = 0;
        break;
      case "End":
        nextTarget = measureLimit(element);
        break;
      default:
        break;
    }

    if (nextTarget === null) return;

    event.preventDefault();
    cancelSnap();
    if (isReducedMotion()) {
      element.scrollLeft = clamp(nextTarget, 0, measureLimit(element));
      target = element.scrollLeft;
      applyRailState(element);
      return;
    }

    setTarget(nextTarget);
    settleToNearest();
  };

  const refresh = (): void => {
    cancelAnimation();
    cancelSnap();
    target = clamp(element.scrollLeft, 0, measureLimit(element));
    applyRailState(element);
  };

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !hasHorizontalOverflow(element)) return;

    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragStartScrollLeft = element.scrollLeft;
    isDragging = false;
    suppressClick = false;
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (dragPointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;

    if (!isDragging) {
      if (Math.abs(deltaX) < DRAG_INTENT_THRESHOLD && Math.abs(deltaY) < DRAG_INTENT_THRESHOLD) {
        return;
      }

      if (!hasHorizontalIntent(deltaX, deltaY)) {
        resetDragState();
        return;
      }

      isDragging = true;
      element.dataset.dragging = "true";
      element.setPointerCapture(event.pointerId);
      cancelAnimation();
      cancelSnap();
    }

    event.preventDefault();
    suppressClick ||= Math.abs(deltaX) >= DRAG_CLICK_SUPPRESSION_DISTANCE;
    element.scrollLeft = clamp(dragStartScrollLeft - deltaX, 0, measureLimit(element));
    target = element.scrollLeft;
    applyRailState(element);
  };

  const finishPointerInteraction = (pointerId: number): void => {
    if (dragPointerId !== pointerId) return;

    const dragged = isDragging;
    resetDragState();

    if (dragged) {
      target = element.scrollLeft;
      settleToNearest();
    }
  };

  const handlePointerUp = (event: PointerEvent): void => {
    finishPointerInteraction(event.pointerId);
  };

  const handleClickCapture = (event: Event): void => {
    if (!suppressClick) return;

    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };

  element.addEventListener("scroll", handleScroll, { passive: true });
  element.addEventListener("wheel", handleWheel, { passive: false });
  element.addEventListener("keydown", handleKeyDown);
  element.addEventListener("pointerdown", handlePointerDown);
  element.addEventListener("pointermove", handlePointerMove);
  element.addEventListener("pointerup", handlePointerUp);
  element.addEventListener("pointercancel", handlePointerUp);
  element.addEventListener("click", handleClickCapture, true);

  refresh();

  return {
    cleanup() {
      cancelAnimation();
      cancelSnap();
      resetDragState();
      element.removeEventListener("scroll", handleScroll);
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("keydown", handleKeyDown);
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
      element.removeEventListener("click", handleClickCapture, true);
    },
    refresh,
  };
}

export function cleanupScrollIndicators(): void {
  for (const controller of controllers) controller.cleanup();
  controllers = [];
  for (const cleanup of cleanupFns) cleanup();
  cleanupFns = [];
}

export function initScrollIndicators(): void {
  cleanupScrollIndicators();

  const elements = Array.from(document.querySelectorAll<HTMLElement>(RAIL_SELECTOR));

  controllers = elements.map((element) => createRailController(element));

  const onResize = (): void => {
    for (const controller of controllers) controller.refresh();
  };

  window.addEventListener("resize", onResize, { passive: true });
  cleanupFns.push(() => window.removeEventListener("resize", onResize));
}
