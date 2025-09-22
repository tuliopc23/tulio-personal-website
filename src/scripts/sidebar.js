(function () {
  const filter = document.querySelector("#sidebarFilter");
  const links = Array.from(document.querySelectorAll(".sidebar__link"));
  const groups = Array.from(document.querySelectorAll(".sidebar__group"));

  function apply(query) {
    const needle = (query || "").trim().toLowerCase();

    links.forEach((anchor) => {
      const matches = !needle || anchor.textContent.toLowerCase().includes(needle);
      anchor.style.display = matches ? "flex" : "none";
    });

    groups.forEach((groupEl) => {
      const hasVisible = Array.from(groupEl.querySelectorAll(".sidebar__link")).some(
        (anchor) => anchor.style.display !== "none"
      );
      groupEl.style.display = hasVisible ? "block" : "none";
    });
  }

  filter?.addEventListener("input", (event) => apply(event.target.value));

  // Mobile toggle logic mirrors Apple Docs style drawer
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".topbar__menu");
  let backdrop;

  function ensureBackdrop() {
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "backdrop";
      backdrop.addEventListener("click", close);
      document.body.appendChild(backdrop);
    }
  }

  function open() {
    ensureBackdrop();
    sidebar?.classList.add("is-open");
    backdrop?.classList.add("is-open");
  }

  function close() {
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
  }

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

  apply(filter?.value);
})();
