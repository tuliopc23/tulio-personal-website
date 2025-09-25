(() => {
  const root = document.documentElement;
  const control = document.querySelector("[data-theme-toggle]");
  const media = window.matchMedia("(prefers-color-scheme: light)");

  const readStoredTheme = () => {
    try {
      const value = localStorage.getItem("theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  /** @type {"light" | "dark" | null} */
  let stored = readStoredTheme();

  const applyTheme = (theme, persist = false) => {
    const next = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", next);

    if (control instanceof HTMLInputElement) {
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

  const resolveTheme = () => {
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return media.matches ? "light" : "dark";
  };

  applyTheme(resolveTheme());

  control?.addEventListener("change", (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    applyTheme(target.checked ? "light" : "dark", true);
  });

  const handleMediaChange = (event) => {
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
