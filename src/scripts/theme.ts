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

  setPreference(preference: ThemePreference, _options: ThemeOptions = {}): void {
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
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      initializeTheme();
    },
    { once: true },
  );
} else {
  initializeTheme();
}

document.addEventListener("astro:page-load", () => {
  initializeTheme();
});
