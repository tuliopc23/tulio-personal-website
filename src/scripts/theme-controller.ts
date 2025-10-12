type Theme = "light" | "dark";

type ThemeListener = (theme: Theme) => void;

type StoredTheme = Theme | null;

interface ThemeControllerOptions {
  persist?: boolean;
}

const isBrowser = typeof window !== "undefined";

class ThemeController {
  private initialized = false;
  private current: Theme = "dark";
  private stored: StoredTheme = null;
  private listeners = new Set<ThemeListener>();
  private mediaQuery: MediaQueryList | null = null;
  private reduceMotionQuery: MediaQueryList | null = null;

  init(): Theme {
    if (!isBrowser || this.initialized) {
      return this.current;
    }

    this.initialized = true;
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    this.reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.stored = this.readStoredTheme();
    const resolved = this.resolveInitialTheme();
    this.applyTheme(resolved);

    const handleMediaChange = (event: MediaQueryListEvent) => {
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

  getTheme(): Theme {
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

  subscribe(listener: ThemeListener): () => void {
    if (!this.initialized) {
      this.init();
    }

    this.listeners.add(listener);
    listener(this.current);

    return () => {
      this.listeners.delete(listener);
    };
  }

  toggleTheme(options: ThemeControllerOptions = {}): void {
    const next = this.current === "light" ? "dark" : "light";
    this.setTheme(next, options);
  }

  setTheme(theme: Theme, options: ThemeControllerOptions = {}): void {
    const persist = options.persist ?? true;
    if (!this.initialized) {
      this.init();
    }
    this.applyTheme(theme, persist);
  }

  private applyTheme(theme: Theme, persist = false): void {
    if (!isBrowser) {
      return;
    }

    const root = document.documentElement;
    const next: Theme = theme === "light" ? "light" : "dark";

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
      favicon.href = next === "light" ? "/favicon-light.svg" : "/favicon-dark.svg";
    }

    this.current = next;

    if (persist) {
      this.stored = next;
      this.persistTheme(next);
    }

    this.listeners.forEach((listener) => {
      listener(next);
    });
  }

  private resolveInitialTheme(): Theme {
    const root = document.documentElement;

    if (this.stored === "light" || this.stored === "dark") {
      return this.stored;
    }

    const htmlTheme = root.getAttribute("data-theme");
    if (htmlTheme === "light" || htmlTheme === "dark") {
      return htmlTheme;
    }

    if (this.mediaQuery?.matches) {
      return "light";
    }

    return "dark";
  }

  private readStoredTheme(): StoredTheme {
    if (!isBrowser) {
      return null;
    }

    try {
      const value = window.localStorage.getItem("theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  private persistTheme(theme: Theme): void {
    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      /* ignore storage errors */
    }
  }
}

const controller = new ThemeController();

export const initThemeController = (): Theme => controller.init();

export const getTheme = (): Theme => controller.getTheme();

export const toggleTheme = (options?: ThemeControllerOptions): void =>
  controller.toggleTheme(options);

export const setTheme = (theme: Theme, options?: ThemeControllerOptions): void =>
  controller.setTheme(theme, options);

export const subscribeToTheme = (listener: ThemeListener): (() => void) =>
  controller.subscribe(listener);

export const prefersReducedMotion = (): boolean => controller.prefersReducedMotion();

export type { Theme };
