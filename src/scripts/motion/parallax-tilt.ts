/**
 * Spring-based pointer-tracking parallax tilt.
 *
 * Animates CSS custom properties (`--parallax-rotate-x`,
 * `--parallax-rotate-y`, `--parallax-translate`) so that the
 * existing `.hover-elevate` CSS transform compound continues to
 * work.  Uses Motion for smooth spring interpolation.
 */

import { getLenis } from "../lenis";
import { animateDOM } from "./dom-animate";
import { SPRING_SMOOTH, SPRING_SNAPPY } from "./springs";

const pointerTiltMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
const MAX_TILT = 4; // degrees
const MAX_SHIFT = 6; // px

type CardScrollState = {
  cachedRect: DOMRect | null;
};

type DisposeFn = VoidFunction;

let disposers: DisposeFn[] = [];
let lenisScrollCleanup: DisposeFn | null = null;

/* ── Helpers ────────────────────────────────────────────────── */

function applyTilt(card: HTMLElement, event: PointerEvent, rect: DOMRect): void {
  if (rect.width === 0 || rect.height === 0) return;

  const relX = (event.clientX - rect.left) / rect.width - 0.5;
  const relY = (event.clientY - rect.top) / rect.height - 0.5;
  const clamp = (v: number, limit: number) => Math.min(Math.max(v, -limit), limit);

  const rotateX = clamp(-relY * MAX_TILT * 2, MAX_TILT);
  const rotateY = clamp(relX * MAX_TILT * 2, MAX_TILT);
  const translateY = clamp(-relY * MAX_SHIFT, MAX_SHIFT);

  animateDOM(
    card,
    {
      "--parallax-rotate-x": `${rotateX}deg`,
      "--parallax-rotate-y": `${rotateY}deg`,
      "--parallax-translate": `${translateY}px`,
    },
    { ...SPRING_SNAPPY },
  );
}

function resetTilt(card: HTMLElement): void {
  animateDOM(
    card,
    {
      "--parallax-rotate-x": "0deg",
      "--parallax-rotate-y": "0deg",
      "--parallax-translate": "0px",
    },
    { ...SPRING_SMOOTH },
  );
}

/* ── Init ───────────────────────────────────────────────────── */

export function initParallaxTilt(): void {
  cleanupParallaxTilt();

  if (!pointerTiltMedia.matches) return;

  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-card]"));
  if (!cards.length) return;

  const cardStates = new Map<HTMLElement, CardScrollState>();
  for (const card of cards) {
    cardStates.set(card, { cachedRect: null });
  }

  const lenis = getLenis();
  if (lenis) {
    const invalidateAllRects = (): void => {
      for (const state of cardStates.values()) {
        state.cachedRect = null;
      }
    };
    lenis.on("scroll", invalidateAllRects);
    lenisScrollCleanup = () => lenis.off("scroll", invalidateAllRects);
  }

  for (const card of cards) {
    let trackingPointer = false;
    const scrollState = cardStates.get(card)!;

    const onMove = (e: PointerEvent) => {
      if (!scrollState.cachedRect) scrollState.cachedRect = card.getBoundingClientRect();
      applyTilt(card, e, scrollState.cachedRect);
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;

      scrollState.cachedRect = card.getBoundingClientRect();

      if (!trackingPointer) {
        card.addEventListener("pointermove", onMove, { passive: true });
        trackingPointer = true;
      }
      card.classList.add("is-tilting");
      applyTilt(card, e, scrollState.cachedRect);
    };

    const onEnd = () => {
      if (trackingPointer) {
        card.removeEventListener("pointermove", onMove);
        trackingPointer = false;
      }
      scrollState.cachedRect = null;
      card.classList.remove("is-tilting");
      resetTilt(card);
    };

    card.addEventListener("pointerenter", onEnter, { passive: true });
    card.addEventListener("pointerleave", onEnd, { passive: true });
    card.addEventListener("pointercancel", onEnd, { passive: true });

    disposers.push(() => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onEnd);
      card.removeEventListener("pointercancel", onEnd);
      onEnd();
    });
  }
}

export function cleanupParallaxTilt(): void {
  lenisScrollCleanup?.();
  lenisScrollCleanup = null;
  for (const dispose of disposers) dispose();
  disposers = [];
}
