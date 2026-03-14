(() => {
  const body = document.body;
  if (!body) {
    return;
  }

  const filter = document.querySelector<HTMLInputElement>("#sidebarFilter");
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".sidebar__link"));
  const groups = Array.from(document.querySelectorAll<HTMLElement>(".sidebar__group"));
  const status = document.querySelector<HTMLElement>("[data-sidebar-status]");
  const sidebar = document.querySelector<HTMLElement>(".sidebar");
  const toggle = document.querySelector<HTMLButtonElement>(".topbar__menu");
  const closeButton = document.querySelector<HTMLButtonElement>("[data-sidebar-close]");

  if (!sidebar) {
    return;
  }

  const totalLinks = links.length;
  const mobileDrawerQuery = window.matchMedia("(max-width: 1024px)");
  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let backdrop: HTMLDivElement | null = null;
  let previousFocusedElement: HTMLElement | null = null;

  const hasMobileDrawer = (): boolean => body.dataset.hasMobileDrawer === "true";
  const isMobileDrawer = (): boolean => hasMobileDrawer() && mobileDrawerQuery.matches;
  const syncScrollLock = (): void => {
    const shouldLock = isMobileDrawer() && sidebar.classList.contains("is-open");
    body.classList.toggle("is-locked", shouldLock);
    body.dataset.sidebarState = shouldLock ? "open" : "closed";
  };

  const isEditableTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
  };

  const getFocusableSidebarElements = (): HTMLElement[] =>
    Array.from(sidebar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
      if (element.hasAttribute("disabled") || element.getAttribute("aria-hidden") === "true") {
        return false;
      }

      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0;
    });

  const focusMenuEntry = (): void => {
    const preferred = closeButton && closeButton.offsetParent !== null ? closeButton : null;
    const fallback =
      filter && filter.offsetParent !== null ? filter : (getFocusableSidebarElements()[0] ?? null);
    (preferred ?? fallback)?.focus();
  };

  const restorePreviousFocus = (): void => {
    if (!previousFocusedElement) {
      return;
    }

    if (document.contains(previousFocusedElement)) {
      previousFocusedElement.focus();
    }

    previousFocusedElement = null;
  };

  links.forEach((anchor, index) => {
    anchor.style.setProperty("--sidebar-order", String(index));
  });

  if (!body.dataset.sidebarState) {
    body.dataset.sidebarState = "closed";
  }

  const apply = (query: string | null): void => {
    const needle = (query ?? "").trim().toLowerCase();
    let visibleCount = 0;

    links.forEach((anchor) => {
      const label = anchor.textContent?.toLowerCase() ?? "";
      const matches = needle.length === 0 || label.includes(needle);
      anchor.style.display = matches ? "flex" : "none";
      if (matches) {
        visibleCount += 1;
      }
    });

    groups.forEach((groupEl) => {
      const hasVisible = Array.from(
        groupEl.querySelectorAll<HTMLAnchorElement>(".sidebar__link"),
      ).some(
        (anchor) => anchor.style.display !== "none" && getComputedStyle(anchor).display !== "none",
      );
      groupEl.style.display = hasVisible ? "block" : "none";
    });

    if (!status) {
      return;
    }

    if (needle.length === 0) {
      status.textContent = `Showing all ${totalLinks} menu links.`;
    } else if (visibleCount === 0) {
      status.textContent = `No menu links match "${query?.trim() ?? ""}".`;
    } else if (visibleCount === 1) {
      status.textContent = `Showing 1 menu link for "${query?.trim() ?? ""}".`;
    } else {
      status.textContent = `Showing ${visibleCount} menu links for "${query?.trim() ?? ""}".`;
    }
  };

  const ensureBackdrop = (): HTMLDivElement => {
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.addEventListener("click", () => {
        close();
      });
      document.body.appendChild(backdrop);
    }

    return backdrop;
  };

  const close = (): void => {
    sidebar.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open menu");
    sidebar.setAttribute("aria-hidden", "true");
    backdrop?.setAttribute("aria-hidden", "true");
    syncScrollLock();
    restorePreviousFocus();
  };

  const open = (): void => {
    if (
      !(document.activeElement instanceof HTMLElement) ||
      !sidebar.contains(document.activeElement)
    ) {
      previousFocusedElement = document.activeElement as HTMLElement | null;
    }

    const nextBackdrop = ensureBackdrop();
    sidebar.classList.add("is-open");
    nextBackdrop.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
    toggle?.setAttribute("aria-label", "Close menu");
    sidebar.setAttribute("aria-hidden", "false");
    nextBackdrop.setAttribute("aria-hidden", "false");
    syncScrollLock();

    requestAnimationFrame(() => {
      focusMenuEntry();
    });
  };

  const trapFocus = (event: KeyboardEvent): void => {
    if (!sidebar.classList.contains("is-open") || event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableSidebarElements();
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (current === first || (current && !sidebar.contains(current))) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  filter?.addEventListener("input", (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    apply(target.value ?? null);
  });

  sidebar.setAttribute("aria-hidden", "true");
  toggle?.setAttribute("aria-expanded", "false");
  syncScrollLock();

  const toggleMenu = (): void => {
    if (!isMobileDrawer()) {
      return;
    }

    if (sidebar.classList.contains("is-open")) {
      close();
    } else {
      open();
    }
  };

  toggle?.addEventListener("click", toggleMenu);
  closeButton?.addEventListener("click", () => {
    close();
  });

  sidebar.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (isMobileDrawer() && target.closest(".sidebar__link")) {
      close();
    }
  });

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    trapFocus(event);

    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (isEditableTarget(event.target) || !filter) {
      return;
    }

    if (!isMobileDrawer()) {
      filter.focus();
      event.preventDefault();
      return;
    }

    if (!sidebar.classList.contains("is-open")) {
      open();
      requestAnimationFrame(() => {
        filter.focus();
      });
    } else {
      filter.focus();
    }

    event.preventDefault();
  });

  const syncOnViewportChange = (): void => {
    if (!isMobileDrawer() && sidebar.classList.contains("is-open")) {
      close();
      return;
    }

    syncScrollLock();
  };

  if (typeof mobileDrawerQuery.addEventListener === "function") {
    mobileDrawerQuery.addEventListener("change", syncOnViewportChange);
  } else {
    mobileDrawerQuery.addListener(syncOnViewportChange);
  }

  apply(filter?.value ?? null);
})();
