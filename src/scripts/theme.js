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

    // Add class for Shiki code block theme switching
    if (next === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

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
    // If user has explicitly chosen a theme, use it
    if (stored === "light" || stored === "dark") {
      console.log("[Theme] Using stored theme:", stored);
      return stored;
    }

    // Otherwise, respect the HTML's initial data-theme attribute (defaults to dark)
    const htmlTheme = root.getAttribute("data-theme");
    console.log("[Theme] No stored theme, using HTML default:", htmlTheme);
    return htmlTheme === "light" ? "light" : "dark";
  };

  const initialTheme = resolveTheme();
  console.log("[Theme] Applying initial theme:", initialTheme);
  applyTheme(initialTheme);

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
