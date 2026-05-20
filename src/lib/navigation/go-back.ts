const TRAIL_KEY = "site-nav-trail";
const TRAIL_MAX = 10;
const BACK_FALLBACK_MS = 320;

function readTrail(): string[] {
  if (typeof sessionStorage === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(TRAIL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function writeTrail(trail: string[]): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail.slice(-TRAIL_MAX)));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

function currentPath(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function sameOriginReferrer(): string | null {
  const referrer = document.referrer;
  if (!referrer) return null;

  try {
    const url = new URL(referrer);
    if (url.origin !== window.location.origin) return null;
    if (`${url.pathname}${url.search}` === currentPath()) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function popTrailFallback(): string | null {
  const trail = readTrail();
  const current = currentPath();

  for (let index = trail.length - 1; index >= 0; index -= 1) {
    const entry = trail[index];
    if (entry && entry !== current) {
      return entry;
    }
  }

  return null;
}

/** Record the current path for back-navigation fallbacks (call once per page load). */
export function recordNavigationTrail(): void {
  if (typeof window === "undefined") {
    return;
  }

  const path = currentPath();
  const trail = readTrail();
  const last = trail[trail.length - 1];

  if (last === path) {
    return;
  }

  writeTrail([...trail, path]);
}

function assignFallback(fallback: string): void {
  window.location.assign(fallback);
}

function tryHistoryBack(onFallback: () => void): void {
  const startedAt = currentPath();
  let handled = false;

  const runFallbackOnce = () => {
    if (handled || currentPath() !== startedAt) {
      return;
    }
    handled = true;
    onFallback();
  };

  const onPageShow = (event: PageTransitionEvent) => {
    window.removeEventListener("pageshow", onPageShow);
    if (event.persisted) {
      return;
    }
    runFallbackOnce();
  };

  window.addEventListener("pageshow", onPageShow);
  window.setTimeout(() => {
    window.removeEventListener("pageshow", onPageShow);
    runFallbackOnce();
  }, BACK_FALLBACK_MS);

  window.history.back();
}

/** Navigate to the previous in-site page with resilient fallbacks. */
export function navigateBack(fallback = "/"): void {
  if (typeof window === "undefined") {
    return;
  }

  const runFallback = () => {
    const referrerPath = sameOriginReferrer();
    if (referrerPath) {
      assignFallback(referrerPath);
      return;
    }

    const trailPath = popTrailFallback();
    if (trailPath) {
      assignFallback(trailPath);
      return;
    }

    assignFallback(fallback);
  };

  const navigation = window.navigation as { canGoBack?: boolean; back?: () => void } | undefined;
  if (navigation?.canGoBack && typeof navigation.back === "function") {
    navigation.back();
    return;
  }

  if (window.history.length > 1) {
    tryHistoryBack(runFallback);
    return;
  }

  runFallback();
}
