/**
 * Coalesced scroll subscriptions shared by Lenis and native scroll fallbacks.
 *
 * Prefer Lenis scroll events when smooth scroll is active so listeners do not
 * stack on every programmatic window.scrollTo tick during interpolation.
 */

import type Lenis from "lenis";

type ScrollCallback = () => void;

const subscribers = new Set<ScrollCallback>();
let lenisInstance: Lenis | null = null;
let lenisHandler: (() => void) | null = null;
let nativeAttached = false;
let coalesceRaf = 0;

function flushSubscribers(): void {
  if (coalesceRaf) return;
  coalesceRaf = requestAnimationFrame(() => {
    coalesceRaf = 0;
    for (const callback of subscribers) callback();
  });
}

function attachNativeScroll(): void {
  if (nativeAttached) return;
  nativeAttached = true;
  window.addEventListener("scroll", flushSubscribers, { passive: true });
}

function detachNativeScroll(): void {
  if (!nativeAttached) return;
  nativeAttached = false;
  window.removeEventListener("scroll", flushSubscribers);
}

function attachLenisScroll(lenis: Lenis): void {
  if (lenisHandler) {
    lenis.off("scroll", lenisHandler);
  }

  lenisHandler = flushSubscribers;
  lenis.on("scroll", lenisHandler);
}

function detachLenisScroll(): void {
  if (!lenisInstance || !lenisHandler) {
    lenisHandler = null;
    return;
  }

  lenisInstance.off("scroll", lenisHandler);
  lenisHandler = null;
}

/** Wire the active scroll engine (Lenis instance or native fallback). */
export function setScrollEngine(lenis: Lenis | null): void {
  detachLenisScroll();
  lenisInstance = lenis;

  if (lenis) {
    detachNativeScroll();
    attachLenisScroll(lenis);
    return;
  }

  if (subscribers.size > 0) {
    attachNativeScroll();
  }
}

/** Current vertical scroll offset (Lenis when active, otherwise native). */
export function getScrollY(): number {
  return lenisInstance?.scroll ?? window.scrollY;
}

/** Scroll to a vertical offset using Lenis when available. */
export function scrollToY(
  target: number,
  options?: { immediate?: boolean; behavior?: ScrollBehavior },
): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { immediate: options?.immediate ?? options?.behavior === "auto" });
    return;
  }

  window.scrollTo({
    top: target,
    behavior: options?.behavior ?? (options?.immediate ? "auto" : "smooth"),
  });
}

/**
 * Subscribe to scroll updates (coalesced to one rAF per frame).
 * Safe to call before Lenis initialises — wiring happens when the engine is set.
 */
export function subscribeScroll(callback: ScrollCallback): () => void {
  subscribers.add(callback);

  if (lenisInstance) {
    attachLenisScroll(lenisInstance);
  } else if (subscribers.size > 0) {
    attachNativeScroll();
  }

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      detachNativeScroll();
      if (coalesceRaf) {
        cancelAnimationFrame(coalesceRaf);
        coalesceRaf = 0;
      }
    }
  };
}

/** Test-only reset. */
export function resetScrollSubscribeForTests(): void {
  subscribers.clear();
  detachLenisScroll();
  detachNativeScroll();
  lenisInstance = null;
  if (coalesceRaf) {
    cancelAnimationFrame(coalesceRaf);
    coalesceRaf = 0;
  }
}
