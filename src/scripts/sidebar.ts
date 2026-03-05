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
  const dragHandle = sidebar?.querySelector<HTMLElement>(".sidebar__dragHandle") ?? null;
  const totalLinks = links.length;
  const mobileDrawerQuery = window.matchMedia("(max-width: 1024px)");
  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let backdrop: HTMLDivElement | null = null;
  let previousFocusedElement: HTMLElement | null = null;

  let activePointerId: number | null = null;
  let dragStartY = 0;
  let dragLastY = 0;
  let dragLastTimestamp = 0;
  let dragVelocity = 0;

  const isMobileDrawer = (): boolean => mobileDrawerQuery.matches;

  const isEditableTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
  };

  const getFocusableSidebarElements = (): HTMLElement[] => {
    if (!sidebar) {
      return [];
    }

    return Array.from(sidebar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => {
        if (element.hasAttribute("disabled")) {
          return false;
        }
        if (element.getAttribute("aria-hidden") === "true") {
          return false;
        }

        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0;
      },
    );
  };

  const focusDrawerEntry = (): void => {
    const fallback = getFocusableSidebarElements()[0] ?? null;
    const target = filter && filter.offsetParent !== null ? filter : fallback;
    target?.focus();
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

  if (body.dataset && !body.dataset.sidebarState) {
    body.dataset.sidebarState = "closed";
  }

  const apply = (query: string | null): void => {
    const rawQuery = query ?? "";
    const trimmedQuery = rawQuery.trim();
    const needle = trimmedQuery.toLowerCase();
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
      if (groupEl.classList.contains("sidebar__group--site")) {
        groupEl.style.setProperty("display", "block", "important");
        return;
      }

      const hasVisible = Array.from(
        groupEl.querySelectorAll<HTMLAnchorElement>(".sidebar__link"),
      ).some((anchor) => {
        const computed = getComputedStyle(anchor);
        return computed.display !== "none" && anchor.style.display !== "none";
      });
      groupEl.style.display = hasVisible ? "block" : "none";
    });

    if (status) {
      if (needle.length === 0) {
        status.textContent = `Showing all ${totalLinks} sidebar links.`;
      } else if (visibleCount === 0) {
        status.textContent = `No sidebar links match "${trimmedQuery}".`;
      } else if (visibleCount === 1) {
        status.textContent = `Showing 1 sidebar link for "${trimmedQuery}".`;
      } else {
        status.textContent = `Showing ${visibleCount} sidebar links for "${trimmedQuery}".`;
      }
    }
  };

  const clearDragState = (): void => {
    sidebar?.classList.remove("is-dragging");
    sidebar?.style.removeProperty("--sidebar-offset");
    activePointerId = null;
    dragStartY = 0;
    dragLastY = 0;
    dragLastTimestamp = 0;
    dragVelocity = 0;
  };

  const close = (): void => {
    clearDragState();
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("is-locked");
    sidebar?.setAttribute("aria-hidden", "true");
    backdrop?.setAttribute("aria-hidden", "true");
    if (body.dataset) {
      body.dataset.sidebarState = "closed";
    }
    restorePreviousFocus();
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
    if (
      !(document.activeElement instanceof HTMLElement) ||
      !sidebar?.contains(document.activeElement)
    ) {
      previousFocusedElement = document.activeElement as HTMLElement | null;
    }

    clearDragState();
    sidebar?.classList.add("is-open");
    nextBackdrop.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
    body.classList.add("is-locked");
    sidebar?.setAttribute("aria-hidden", "false");
    nextBackdrop.setAttribute("aria-hidden", "false");
    if (body.dataset) {
      body.dataset.sidebarState = "open";
    }

    requestAnimationFrame(() => {
      focusDrawerEntry();
    });
  };

  const trapFocus = (event: KeyboardEvent): void => {
    if (!sidebar?.classList.contains("is-open") || event.key !== "Tab") {
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

  const startDrag = (event: PointerEvent): void => {
    if (!sidebar || !sidebar.classList.contains("is-open") || !isMobileDrawer()) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    activePointerId = event.pointerId;
    dragStartY = event.clientY;
    dragLastY = event.clientY;
    dragLastTimestamp = performance.now();
    dragVelocity = 0;

    sidebar.classList.add("is-dragging");
    sidebar.style.setProperty("--sidebar-offset", "0px");

    if (dragHandle?.setPointerCapture) {
      dragHandle.setPointerCapture(event.pointerId);
    }
  };

  const updateDrag = (event: PointerEvent): void => {
    if (!sidebar || activePointerId !== event.pointerId) {
      return;
    }

    const now = performance.now();
    const deltaY = event.clientY - dragStartY;
    const offset = deltaY > 0 ? deltaY : deltaY * 0.2;

    const elapsed = Math.max(now - dragLastTimestamp, 1);
    dragVelocity = (event.clientY - dragLastY) / elapsed;
    dragLastY = event.clientY;
    dragLastTimestamp = now;

    sidebar.style.setProperty("--sidebar-offset", `${offset}px`);
  };

  const endDrag = (event: PointerEvent): void => {
    if (!sidebar || activePointerId !== event.pointerId) {
      return;
    }

    const dragDistance = Math.max(event.clientY - dragStartY, 0);
    const closeThreshold = Math.min(Math.max(sidebar.clientHeight * 0.24, 90), 180);
    const shouldClose = dragDistance > closeThreshold || dragVelocity > 0.8;

    if (shouldClose) {
      close();
      return;
    }

    sidebar.classList.remove("is-dragging");
    sidebar.style.setProperty("--sidebar-offset", "0px");
    requestAnimationFrame(() => {
      sidebar?.style.removeProperty("--sidebar-offset");
    });
    activePointerId = null;
  };

  const cancelDrag = (event: PointerEvent): void => {
    if (activePointerId !== event.pointerId) {
      return;
    }
    sidebar?.classList.remove("is-dragging");
    sidebar?.style.removeProperty("--sidebar-offset");
    activePointerId = null;
  };

  filter?.addEventListener("input", (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    apply(target.value ?? null);
  });

  sidebar?.setAttribute("aria-hidden", "true");
  toggle?.setAttribute("aria-expanded", "false");

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

  sidebar?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (isMobileDrawer() && target.closest(".sidebar__link")) {
      close();
    }
  });

  if (dragHandle) {
    dragHandle.addEventListener("pointerdown", startDrag);
  }
  sidebar?.addEventListener("pointermove", updateDrag);
  sidebar?.addEventListener("pointerup", endDrag);
  sidebar?.addEventListener("pointercancel", cancelDrag);

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    trapFocus(event);

    if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (!filter) {
        return;
      }

      if (!isMobileDrawer()) {
        filter.focus();
        event.preventDefault();
        return;
      }

      const isOpen = Boolean(sidebar?.classList.contains("is-open"));
      if (isOpen) {
        filter.focus();
        event.preventDefault();
        return;
      }

      if (sidebar && toggle) {
        open();
        requestAnimationFrame(() => {
          filter.focus();
        });
        event.preventDefault();
      }
    }
  });

  const syncOnViewportChange = (): void => {
    if (isMobileDrawer()) {
      return;
    }

    if (sidebar?.classList.contains("is-open")) {
      close();
    }
    clearDragState();
  };

  if (typeof mobileDrawerQuery.addEventListener === "function") {
    mobileDrawerQuery.addEventListener("change", syncOnViewportChange);
  } else {
    mobileDrawerQuery.addListener(syncOnViewportChange);
  }

  apply(filter?.value ?? null);
})();
