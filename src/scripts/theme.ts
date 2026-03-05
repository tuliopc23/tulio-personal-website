const isBrowser = typeof window !== "undefined";
const THEME_OVERRIDE_KEY = "theme-override";
export {};

type ThemeMode = "light" | "dark";
interface ThemeOptions {
  persist?: boolean;
}

declare global {
  interface Window {
    PUBLIC_GITHUB_TOKEN?: string;
    __themeController?: ThemeController;
    themeController?: {
      init: () => ThemeMode;
      getTheme: () => ThemeMode;
      toggleTheme: (options?: ThemeOptions) => void;
      setTheme: (theme: ThemeMode, options?: ThemeOptions) => void;
      subscribe: (listener: (theme: ThemeMode) => void) => () => void;
      prefersReducedMotion: () => boolean;
    };
    initLiquidThemeToggle?: (root: Element | null) => void;
  }
}

class ThemeController {
  private initialized = false;
  private current: ThemeMode = "dark";
  private stored: ThemeMode | null = null;
  private listeners = new Set<(theme: ThemeMode) => void>();
  private mediaQuery: MediaQueryList | null = null;
  private reduceMotionQuery: MediaQueryList | null = null;
  private transitionTimeoutId: number | null = null;

  init(): ThemeMode {
    if (!isBrowser || this.initialized) {
      return this.current;
    }

    this.initialized = true;
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    this.reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.stored = this.readStoredTheme();
    const resolved = this.resolveInitialTheme();
    this.applyTheme(resolved);

    const handleMediaChange = (event: MediaQueryListEvent): void => {
      if (this.stored) {
        return;
      }
      this.applyTheme(event.matches ? "light" : "dark");
    };

    if (this.mediaQuery) {
      if (typeof this.mediaQuery.addEventListener === "function") {
        this.mediaQuery.addEventListener("change", handleMediaChange);
      } else if (typeof this.mediaQuery.addListener === "function") {
        this.mediaQuery.addListener(handleMediaChange);
      }
    }

    return this.current;
  }

  getTheme(): ThemeMode {
    return this.current;
  }

  prefersReducedMotion(): boolean {
    if (!isBrowser) {
      return false;
    }

    if (!this.reduceMotionQuery) {
      this.reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    }

    return this.reduceMotionQuery.matches;
  }

  subscribe(listener: (theme: ThemeMode) => void): () => void {
    if (!this.initialized) {
      this.init();
    }

    this.listeners.add(listener);
    listener(this.current);

    return () => {
      this.listeners.delete(listener);
    };
  }

  toggleTheme(options: ThemeOptions = {}): void {
    const next: ThemeMode = this.current === "light" ? "dark" : "light";
    this.setTheme(next, options);
  }

  setTheme(theme: ThemeMode, options: ThemeOptions = {}): void {
    const persist = options.persist ?? true;
    if (!this.initialized) {
      this.init();
    }
    this.applyTheme(theme, persist);
  }

  private applyTheme(theme: ThemeMode, persist = false): void {
    if (!isBrowser) {
      return;
    }

    const root = document.documentElement;
    const next: ThemeMode = theme === "light" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    if (next === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = next === "light" ? "/Brand-icon-dark.webp" : "/Brand-icon-light.webp";
    }

    const themeColorMeta = document.getElementById("theme-color-meta");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", next === "light" ? "#f6f7fb" : "#050506");
    }

    this.current = next;

    if (persist) {
      this.stored = next;
      this.persistTheme(next);
    }

    if (!this.prefersReducedMotion()) {
      if (this.transitionTimeoutId !== null) {
        window.clearTimeout(this.transitionTimeoutId);
      }
      root.classList.add("theme-transition");
      this.transitionTimeoutId = window.setTimeout(() => {
        root.classList.remove("theme-transition");
        this.transitionTimeoutId = null;
      }, 400);
    } else {
      root.classList.remove("theme-transition");
    }

    this.listeners.forEach((listener) => {
      listener(next);
    });
  }

  private resolveInitialTheme(): ThemeMode {
    const root = document.documentElement;

    if (this.stored === "light" || this.stored === "dark") {
      return this.stored;
    }

    if (this.mediaQuery?.matches) {
      return "light";
    }

    if (this.mediaQuery) {
      return "dark";
    }

    const htmlTheme = root.getAttribute("data-theme");
    return htmlTheme === "light" ? "light" : "dark";
  }

  private readStoredTheme(): ThemeMode | null {
    if (!isBrowser) {
      return null;
    }

    try {
      const value = window.localStorage.getItem(THEME_OVERRIDE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  private persistTheme(theme: ThemeMode): void {
    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(THEME_OVERRIDE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const initLiquidThemeToggle = (root: Element | null): void => {
  if (!isBrowser || !root || !window.themeController) {
    return;
  }

  const button = root.matches("button") ? root : root.querySelector("button");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.type = "button";

  if (button.dataset.themeToggleBound === "true") {
    return;
  }
  button.dataset.themeToggleBound = "true";

  const getTheme = window.themeController.getTheme;
  const setTheme = window.themeController.setTheme;
  const toggleTheme = window.themeController.toggleTheme;
  const prefersReducedMotion = window.themeController.prefersReducedMotion;
  const subscribeToTheme = window.themeController.subscribe;

  button.setAttribute("aria-pressed", getTheme() === "dark" ? "true" : "false");

  let currentComplete = getTheme() === "dark" ? 100 : 0;
  let pointerMode: "idle" | "tap" | "drag" = "idle";
  let pointerId: number | null = null;
  let pointerType: string | null = null;
  let startX = 0;
  let skipClick = false;
  const dragActivationDistance = 12;

  const updateMotionPreference = (): void => {
    button.dataset.motion = prefersReducedMotion() ? "reduced" : "normal";
  };

  const setComplete = (value: number, instant = false): void => {
    currentComplete = clamp(value, 0, 100);
    if (instant) {
      button.dataset.instant = "true";
    }
    button.style.setProperty("--complete", currentComplete.toFixed(2));
    if (instant) {
      requestAnimationFrame(() => {
        button.dataset.instant = "false";
      });
    }
  };

  const themeToComplete = (theme: ThemeMode): number => (theme === "dark" ? 100 : 0);

  const updateFromTheme = (theme: ThemeMode): void => {
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    if (pointerMode === "drag") {
      return;
    }
    setComplete(themeToComplete(theme), true);
  };

  const rectComplete = (clientX: number): number => {
    const rect = button.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return clamp(percent, 0, 100);
  };

  const releasePointer = (): void => {
    if (pointerId !== null) {
      try {
        button.releasePointerCapture(pointerId);
      } catch {
        // ignore release errors
      }
    }
    pointerId = null;
    pointerType = null;
    pointerMode = "idle";
    button.dataset.dragging = "false";
  };

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }

    pointerMode = "tap";
    pointerId = event.pointerId;
    pointerType = event.pointerType;
    startX = event.clientX;
    skipClick = false;

    button.dataset.dragging = "true";
    if (typeof button.setPointerCapture === "function") {
      try {
        button.setPointerCapture(event.pointerId);
      } catch {
        // ignore capture errors
      }
    }

    if (prefersReducedMotion()) {
      return;
    }

    setComplete(rectComplete(event.clientX));
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (pointerMode === "idle" || event.pointerId !== pointerId) {
      return;
    }

    const distance = Math.abs(event.clientX - startX);
    const canDrag = pointerType === "mouse";
    if (pointerMode === "tap" && canDrag && distance > dragActivationDistance) {
      pointerMode = "drag";
    }

    if (pointerMode !== "drag") {
      return;
    }

    setComplete(rectComplete(event.clientX));
  };

  const handlePointerUp = (event: PointerEvent): void => {
    if (pointerMode === "idle" || event.pointerId !== pointerId) {
      return;
    }

    const wasDrag = pointerMode === "drag";
    const targetTheme: ThemeMode = currentComplete >= 50 ? "dark" : "light";

    releasePointer();

    if (wasDrag) {
      skipClick = true;
      setTheme(targetTheme, { persist: true });
      return;
    }

    setComplete(themeToComplete(getTheme()), true);
  };

  const handlePointerCancel = (event: PointerEvent): void => {
    if (pointerMode === "idle" || event.pointerId !== pointerId) {
      return;
    }

    releasePointer();
    setComplete(themeToComplete(getTheme()), true);
  };

  const handleClick = (event: MouseEvent): void => {
    if (skipClick) {
      skipClick = false;
      event.preventDefault();
      return;
    }

    toggleTheme({ persist: true });
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    skipClick = true;
    toggleTheme({ persist: true });
  };

  updateMotionPreference();

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionListener = (): void => updateMotionPreference();
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", motionListener);
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(motionListener);
  }

  button.addEventListener("pointerdown", handlePointerDown);
  button.addEventListener("pointermove", handlePointerMove);
  button.addEventListener("pointerup", handlePointerUp);
  button.addEventListener("pointercancel", handlePointerCancel);
  button.addEventListener("click", handleClick);
  button.addEventListener("keydown", handleKeyDown);
  button.addEventListener("keyup", handleKeyUp);

  subscribeToTheme(updateFromTheme);

  setComplete(themeToComplete(getTheme()), true);
};

const initializeTheme = (): void => {
  if (!isBrowser) {
    return;
  }

  const controller =
    window.__themeController instanceof ThemeController
      ? window.__themeController
      : new ThemeController();

  window.__themeController = controller;
  window.themeController = {
    init: (): ThemeMode => controller.init(),
    getTheme: (): ThemeMode => controller.getTheme(),
    toggleTheme: (options?: ThemeOptions): void => controller.toggleTheme(options ?? {}),
    setTheme: (theme: ThemeMode, options?: ThemeOptions): void =>
      controller.setTheme(theme, options ?? {}),
    subscribe: (listener: (theme: ThemeMode) => void): (() => void) =>
      controller.subscribe(listener),
    prefersReducedMotion: (): boolean => controller.prefersReducedMotion(),
  };

  controller.init();
  window.initLiquidThemeToggle = initLiquidThemeToggle;
};

const initializeAllToggles = (): void => {
  document.querySelectorAll("[data-theme-toggle-root]").forEach((element) => {
    initLiquidThemeToggle(element);
  });
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      initializeTheme();
      initializeAllToggles();
    },
    { once: true },
  );
} else {
  initializeTheme();
  initializeAllToggles();
}

document.addEventListener("astro:page-load", () => {
  initializeTheme();
  initializeAllToggles();
});
