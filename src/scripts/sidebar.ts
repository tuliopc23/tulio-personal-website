(() => {
  const filter = document.querySelector<HTMLInputElement>("#sidebarFilter");
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".sidebar__link")
  );
  const groups = Array.from(document.querySelectorAll<HTMLElement>(".sidebar__group"));

  const apply = (query: string | null | undefined): void => {
    const needle = (query ?? "").trim().toLowerCase();

    links.forEach((anchor) => {
      const label = anchor.textContent?.toLowerCase() ?? "";
      const matches = needle.length === 0 || label.includes(needle);
      anchor.style.display = matches ? "flex" : "none";
    });

    groups.forEach((groupEl) => {
      const hasVisible = Array.from(
        groupEl.querySelectorAll<HTMLAnchorElement>(".sidebar__link")
      ).some((anchor) => anchor.style.display !== "none");
      groupEl.style.display = hasVisible ? "block" : "none";
    });
  };

  filter?.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    apply(target?.value ?? null);
  });

  const sidebar = document.querySelector<HTMLElement>(".sidebar");
  const toggle = document.querySelector<HTMLButtonElement>(".topbar__menu");
  if (sidebar) {
    sidebar.setAttribute("aria-hidden", "true");
  }
  let backdrop: HTMLDivElement | null = null;

  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }

  const close = (): void => {
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    sidebar?.setAttribute("aria-hidden", "true");
    backdrop?.setAttribute("aria-hidden", "true");
  };

  const ensureBackdrop = (): HTMLDivElement => {
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.addEventListener("click", close);
      document.body.appendChild(backdrop);
    }

    return backdrop;
  };

  const open = (): void => {
    const nextBackdrop = ensureBackdrop();
    sidebar?.classList.add("is-open");
    nextBackdrop.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    sidebar?.setAttribute("aria-hidden", "false");
    nextBackdrop.setAttribute("aria-hidden", "false");
  };

  toggle?.addEventListener("click", () => {
    if (!sidebar) {
      return;
    }

    if (sidebar.classList.contains("is-open")) {
      close();
    } else {
      open();
    }
  });

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
    }

    if (event.key === "/" && document.activeElement !== filter) {
      filter?.focus();
      event.preventDefault();
    }
  });

  apply(filter?.value ?? null);
})();
