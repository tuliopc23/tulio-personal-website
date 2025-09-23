(() => {
  const root = document.documentElement;
  const control = document.querySelector<HTMLInputElement>("[data-theme-toggle]");
  const media = window.matchMedia("(prefers-color-scheme: light)");

  type Theme = "light" | "dark";

  const readStoredTheme = (): Theme | null => {
    try {
      const value = localStorage.getItem("theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  let stored: Theme | null = readStoredTheme();

  const applyTheme = (
    theme: Theme | string | null | undefined,
    persist = false
  ): void => {
    const next: Theme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", next);

    if (control) {
      control.checked = next === "light";
    }

    if (persist) {
      stored = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* Ignore storage errors */
      }
    }
  };

  const resolveTheme = (): Theme => {
    if (stored) {
      return stored;
    }

    return media.matches ? "light" : "dark";
  };

  applyTheme(resolveTheme());

  control?.addEventListener("change", (event: Event) => {
    const target = event.currentTarget as HTMLInputElement | null;
    if (!target) {
      return;
    }

    applyTheme(target.checked ? "light" : "dark", true);
  });

  const handleMediaChange = (event: MediaQueryListEvent): void => {
    if (stored) {
      return;
    }

    applyTheme(event.matches ? "light" : "dark");
  };

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", handleMediaChange);
  } else if (typeof media.addListener === "function") {
    media.addListener(handleMediaChange);
  }
})();
