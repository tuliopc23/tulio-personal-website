(() => {
  const body = document.body;
  if (!body) {
    return;
  }

  const root = document.querySelector<HTMLElement>("[data-site-search-root]");
  const input = document.querySelector<HTMLInputElement>("[data-site-search-input]");
  const status = document.querySelector<HTMLElement>("[data-site-search-status]");
  const empty = document.querySelector<HTMLElement>("[data-site-search-empty]");
  const items = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-site-search-item]"));
  const openButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-site-search-open]"),
  );
  const closeButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-site-search-close]"),
  );

  if (!root || !input || items.length === 0 || openButtons.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let previousFocusedElement: HTMLElement | null = null;

  const focusableElements = (): HTMLElement[] =>
    Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden && !element.hasAttribute("disabled"));

  const visibleItems = (): HTMLAnchorElement[] => items.filter((item) => !item.hidden);

  const updateStatus = (query: string, count: number): void => {
    if (!status) {
      return;
    }

    if (!query) {
      status.textContent = `Showing all ${items.length} quick search destinations.`;
      return;
    }

    if (count === 0) {
      status.textContent = `No quick search destinations match ${query}.`;
      return;
    }

    if (count === 1) {
      status.textContent = `Showing 1 quick search destination for ${query}.`;
      return;
    }

    status.textContent = `Showing ${count} quick search destinations for ${query}.`;
  };

  const filterResults = (value: string): void => {
    const needle = value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const haystack = item.dataset.searchValue ?? "";
      const matches = needle.length === 0 || haystack.includes(needle);
      item.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.hidden = visibleCount !== 0;
    }

    updateStatus(value.trim(), visibleCount);
  };

  const syncExpanded = (expanded: boolean): void => {
    openButtons.forEach((button) => {
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  };

  const close = ({ restoreFocus = true } = {}): void => {
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    body.classList.remove("is-search-open");
    syncExpanded(false);

    if (restoreFocus && previousFocusedElement && document.contains(previousFocusedElement)) {
      previousFocusedElement.focus({ preventScroll: true });
    }

    previousFocusedElement = null;
  };

  const open = (): void => {
    if (
      !(document.activeElement instanceof HTMLElement) ||
      !root.contains(document.activeElement)
    ) {
      previousFocusedElement = document.activeElement as HTMLElement | null;
    }

    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    body.classList.add("is-search-open");
    syncExpanded(true);
    filterResults(input.value);

    requestAnimationFrame(() => {
      input.focus({ preventScroll: prefersReducedMotion });
      input.select();
    });
  };

  const openFirstResult = (): void => {
    const first = visibleItems()[0];
    first?.click();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (root.hidden) {
        open();
      } else {
        close();
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      close();
    });
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      close({ restoreFocus: false });
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      event.preventDefault();
      const currentVisibleItems = visibleItems();
      const currentIndex = currentVisibleItems.indexOf(item);
      if (currentIndex === -1) {
        return;
      }

      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (currentIndex + delta + currentVisibleItems.length) % currentVisibleItems.length;
      currentVisibleItems[nextIndex]?.focus();
    });
  });

  input.addEventListener("input", () => {
    filterResults(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      openFirstResult();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      visibleItems()[0]?.focus();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    const isShortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

    if (isShortcut) {
      event.preventDefault();
      if (root.hidden) {
        open();
      } else {
        close();
      }
      return;
    }

    if (event.key === "Escape" && !root.hidden) {
      close();
    }
  });

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target === root) {
      close();
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || root.hidden) {
      return;
    }

    const focusables = focusableElements();
    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  filterResults("");
  close({ restoreFocus: false });
})();

export {};
