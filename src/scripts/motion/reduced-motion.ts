/**
 * Centralised reduced-motion state.
 *
 * Reads from the site's `themeController` when available,
 * falling back to `prefers-reduced-motion` media query.
 */

const fallbackQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

type Listener = (reduced: boolean) => void;

let current: boolean = window.themeController?.prefersReducedMotion?.() ?? fallbackQuery.matches;

const listeners = new Set<Listener>();

let unsubTheme: (() => void) | null = null;
let unsubFallback: (() => void) | null = null;

function notify(next: boolean): void {
  if (next === current) return;
  current = next;
  for (const fn of listeners) fn(current);
}

/** Bind to the theme controller or media query once. */
function bind(): void {
  if (unsubTheme || unsubFallback) return;

  if (window.themeController?.subscribeMotionPreference) {
    unsubTheme = window.themeController.subscribeMotionPreference(notify);
    return;
  }

  const handler = (e?: MediaQueryListEvent): void => {
    notify(typeof e?.matches === "boolean" ? e.matches : fallbackQuery.matches);
  };
  fallbackQuery.addEventListener("change", handler);
  unsubFallback = () => fallbackQuery.removeEventListener("change", handler);
}

bind();

// Re-bind after Astro page swaps in case `themeController` changes.
document.addEventListener("astro:page-load", () => {
  current = window.themeController?.prefersReducedMotion?.() ?? fallbackQuery.matches;
  bind();
});

/* ── Public API ─────────────────────────────────────────────── */

export function isReducedMotion(): boolean {
  return current;
}

/**
 * Subscribe to reduced-motion preference changes.
 * Returns an unsubscribe function.
 */
export function onReducedMotionChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
