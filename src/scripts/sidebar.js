(() => {
  const body = document.body;
  const filter = document.querySelector("#sidebarFilter");
  const links = Array.from(document.querySelectorAll(".sidebar__link"));
  const groups = Array.from(document.querySelectorAll(".sidebar__group"));
  const status = document.querySelector("[data-sidebar-status]");
  const totalLinks = links.length;

  if (body && body.dataset && !body.dataset.sidebarState) {
    body.dataset.sidebarState = "closed";
  }

  const apply = (query) => {
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
      const hasVisible = Array.from(groupEl.querySelectorAll(".sidebar__link")).some(
        (anchor) => anchor.style.display !== "none"
      );
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

  filter?.addEventListener("input", (event) => {
    const target = event.target;
    apply(target?.value ?? null);
  });

  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".topbar__menu");
  if (sidebar) {
    sidebar.setAttribute("aria-hidden", "true");
  }
  let backdrop = null;

  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }

  const close = () => {
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    body?.classList.remove("is-locked");
    sidebar?.setAttribute("aria-hidden", "true");
    backdrop?.setAttribute("aria-hidden", "true");
    if (body?.dataset) {
      body.dataset.sidebarState = "closed";
    }
  };

  const ensureBackdrop = () => {
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.addEventListener("click", close);
      document.body.appendChild(backdrop);
    }

    return backdrop;
  };

  const open = () => {
    const nextBackdrop = ensureBackdrop();
    sidebar?.classList.add("is-open");
    nextBackdrop.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
    body?.classList.add("is-locked");
    sidebar?.setAttribute("aria-hidden", "false");
    nextBackdrop.setAttribute("aria-hidden", "false");
    if (body?.dataset) {
      body.dataset.sidebarState = "open";
    }
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

  window.addEventListener("keydown", (event) => {
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
