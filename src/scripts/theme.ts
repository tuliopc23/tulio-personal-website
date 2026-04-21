const isBrowser = typeof window !== "undefined";

export {};

type ThemeMode = "light" | "dark";
type ThemePreference = "system" | ThemeMode;
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
      getPreference: () => ThemePreference;
      setPreference: (preference: ThemePreference, options?: ThemeOptions) => void;
      setSystem: (options?: ThemeOptions) => void;
      subscribe: (listener: (theme: ThemeMode) => void) => () => void;
      prefersReducedMotion: () => boolean;
      subscribeMotionPreference: (listener: (reduced: boolean) => void) => () => void;
    };
    initLiquidThemeToggle?: (root: Element | null) => void;
  }
}

class ThemeController {
  private initialized = false;
  private current: ThemeMode = "dark";
  private preference: ThemePreference = "system";
  private listeners = new Set<(theme: ThemeMode) => void>();
  private motionListeners = new Set<(reduced: boolean) => void>();
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
    this.applyMotionPreference(this.reduceMotionQuery.matches);

    this.preference = "system";
    const resolved = this.resolveInitialTheme();
    this.applyTheme(resolved);

    const handleMediaChange = (event: MediaQueryListEvent): void => {
      if (this.preference !== "system") {
        return;
      }
      this.applyTheme(event.matches ? "light" : "dark");
    };

    if (this.mediaQuery) {
      this.mediaQuery.addEventListener("change", handleMediaChange);
    }

    const handleReduceMotionChange = (event: MediaQueryListEvent): void => {
      this.applyMotionPreference(event.matches);
    };

    if (this.reduceMotionQuery) {
      this.reduceMotionQuery.addEventListener("change", handleReduceMotionChange);
    }

    return this.current;
  }

  getTheme(): ThemeMode {
    return this.current;
  }

  getPreference(): ThemePreference {
    return this.preference;
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

  subscribeMotionPreference(listener: (reduced: boolean) => void): () => void {
    if (!this.initialized) {
      this.init();
    }

    this.motionListeners.add(listener);
    listener(this.prefersReducedMotion());

    return () => {
      this.motionListeners.delete(listener);
    };
  }

  toggleTheme(options: ThemeOptions = {}): void {
    const next = this.nextPreferenceFromToggle();
    this.setPreference(next, options);
  }

  setTheme(theme: ThemeMode, options: ThemeOptions = {}): void {
    if (!this.initialized) {
      this.init();
    }

    this.setPreference(theme, { persist: false, ...options });
  }

  setPreference(preference: ThemePreference, options: ThemeOptions = {}): void {
    if (!this.initialized) {
      this.init();
    }

    const nextPref: ThemePreference =
      preference === "light" || preference === "dark" || preference === "system"
        ? preference
        : "system";

    this.preference = nextPref;
    const resolvedTheme = this.resolveThemeFromPreference(nextPref);
    this.applyTheme(resolvedTheme);
  }

  setSystem(options: ThemeOptions = {}): void {
    this.setPreference("system", options);
  }

  private applyTheme(theme: ThemeMode): void {
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
      favicon.href = next === "light" ? "/brand-icon-light.png" : "/brand-icon-dark.png";
    }

    const themeColorMeta = document.getElementById("theme-color-meta");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", next === "light" ? "#f6f7fb" : "#050506");
    }

    this.current = next;

    this.clearThemeTransition();
    if (!this.prefersReducedMotion()) {
      root.classList.add("theme-transition");
      this.transitionTimeoutId = window.setTimeout(() => {
        root.classList.remove("theme-transition");
        this.transitionTimeoutId = null;
      }, 400);
    }

    this.listeners.forEach((listener) => {
      listener(next);
    });
  }

  private applyMotionPreference(reduced: boolean): void {
    if (!isBrowser) {
      return;
    }

    document.documentElement.dataset.motion = reduced ? "reduced" : "normal";
    if (reduced) {
      this.clearThemeTransition();
    }

    this.motionListeners.forEach((listener) => {
      listener(reduced);
    });
  }

  private clearThemeTransition(): void {
    if (!isBrowser) {
      return;
    }

    if (this.transitionTimeoutId !== null) {
      window.clearTimeout(this.transitionTimeoutId);
      this.transitionTimeoutId = null;
    }

    document.documentElement.classList.remove("theme-transition");
  }

  private resolveInitialTheme(): ThemeMode {
    const root = document.documentElement;

    if (this.preference === "light" || this.preference === "dark") {
      return this.preference;
    }

    if (this.preference === "system") {
      if (this.mediaQuery?.matches) {
        return "light";
      }
      if (this.mediaQuery) {
        return "dark";
      }
    }

    const htmlTheme = root.getAttribute("data-theme");
    return htmlTheme === "light" ? "light" : "dark";
  }

  private resolveThemeFromPreference(preference: ThemePreference): ThemeMode {
    if (preference === "light" || preference === "dark") {
      return preference;
    }

    if (this.mediaQuery?.matches) {
      return "light";
    }

    return "dark";
  }

  private nextPreferenceFromToggle(): ThemePreference {
    if (this.preference === "system") {
      return this.current === "dark" ? "light" : "dark";
    }

    return this.preference === "light" ? "dark" : "light";
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
  const getPreference = window.themeController.getPreference;
  const setPreference = window.themeController.setPreference;
  const prefersReducedMotion = window.themeController.prefersReducedMotion;
  const subscribeToTheme = window.themeController.subscribe;
  const subscribeToMotionPreference = window.themeController.subscribeMotionPreference;

  button.setAttribute("aria-pressed", getTheme() === "dark" ? "true" : "false");

  let currentComplete = getTheme() === "dark" ? 100 : 0;
  let pointerMode: "idle" | "tap" | "drag" = "idle";
  let pointerId: number | null = null;
  let pointerType: string | null = null;
  let startX = 0;
  let skipClick = false;
  const dragActivationDistance = 12;
  let reducedMotion = prefersReducedMotion();

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
    const preference = getPreference();
    button.dataset.themePreference = preference;
    const preferenceLabel =
      preference === "system" ? "System" : preference === "dark" ? "Dark" : "Light";
    button.setAttribute("aria-label", `Theme: ${preferenceLabel}`);
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

  const updateMotionPreference = (reduced: boolean): void => {
    reducedMotion = reduced;
    button.dataset.motion = reduced ? "reduced" : "normal";

    if (!reduced) {
      return;
    }

    skipClick = false;
    if (pointerMode !== "idle") {
      releasePointer();
    }
    setComplete(themeToComplete(getTheme()), true);
  };

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || reducedMotion) {
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
      setPreference(targetTheme, { persist: true });
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

    const cycle = (): ThemePreference => {
      const pref = getPreference();
      if (pref === "system") return "dark";
      if (pref === "dark") return "light";
      return "system";
    };

    setPreference(cycle(), { persist: true });
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

    const cycle = (): ThemePreference => {
      const pref = getPreference();
      if (pref === "system") return "dark";
      if (pref === "dark") return "light";
      return "system";
    };

    setPreference(cycle(), { persist: true });
  };

  button.addEventListener("pointerdown", handlePointerDown);
  button.addEventListener("pointermove", handlePointerMove);
  button.addEventListener("pointerup", handlePointerUp);
  button.addEventListener("pointercancel", handlePointerCancel);
  button.addEventListener("click", handleClick);
  button.addEventListener("keydown", handleKeyDown);
  button.addEventListener("keyup", handleKeyUp);

  subscribeToMotionPreference(updateMotionPreference);
  subscribeToTheme(updateFromTheme);

  setComplete(themeToComplete(getTheme()), true);
  button.dataset.themePreference = getPreference();
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
    getPreference: (): ThemePreference => controller.getPreference(),
    setPreference: (preference: ThemePreference, options?: ThemeOptions): void =>
      controller.setPreference(preference, options ?? {}),
    setSystem: (options?: ThemeOptions): void => controller.setSystem(options ?? {}),
    subscribe: (listener: (theme: ThemeMode) => void): (() => void) =>
      controller.subscribe(listener),
    prefersReducedMotion: (): boolean => controller.prefersReducedMotion(),
    subscribeMotionPreference: (listener: (reduced: boolean) => void): (() => void) =>
      controller.subscribeMotionPreference(listener),
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
