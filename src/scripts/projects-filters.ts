function matchesProjectCategory(card: Element, activeFilter: string): boolean {
  const categories = (card.getAttribute("data-project-categories") ?? "")
    .split(",")
    .filter(Boolean);

  return activeFilter === "all" || categories.includes(activeFilter);
}

export function initProjectTilt(root: ParentNode = document): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (prefersReducedMotion || !supportsFinePointer) {
    return;
  }

  const cards = root.querySelectorAll<HTMLElement>("[data-project-card]");
  cards.forEach((card) => {
    if (card.dataset.projectTiltInitialized === "true") {
      return;
    }

    card.dataset.projectTiltInitialized = "true";

    card.addEventListener("pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((rect.height / 2 - y) / rect.height) * 4;
      const rotateY = ((x - rect.width / 2) / rect.width) * 5;

      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
      card.setAttribute("data-tilt", "active");
    });

    const clearTilt = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.removeAttribute("data-tilt");
    };

    card.addEventListener("pointerleave", clearTilt);
    card.addEventListener("pointercancel", clearTilt);
  });
}

export function initProjectFilters(root: ParentNode = document): void {
  const grid = root.querySelector("[data-projects-grid]");
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-project-card]"));
  const filters = Array.from(root.querySelectorAll<HTMLElement>("[data-project-filter]"));
  const emptyState = root.querySelector<HTMLElement>("[data-project-empty]");

  if (!(grid instanceof HTMLElement) || filters.length === 0 || cards.length === 0) {
    return;
  }

  if (grid.dataset.projectFiltersInitialized === "true") {
    return;
  }

  grid.dataset.projectFiltersInitialized = "true";

  const urlParams = new URLSearchParams(window.location.search);
  let activeFilter = urlParams.get("filter") || "all";

  const validFilters = filters.map((filter) => filter.dataset.projectFilter).filter(Boolean);
  if (!validFilters.includes(activeFilter)) {
    activeFilter = "all";
  }

  const fadeDuration = 200;

  const setActiveButtonState = (activeButton: HTMLElement) => {
    filters.forEach((chip) => {
      const isActive = chip === activeButton;
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });
  };

  const applyFilters = () => {
    let matches = 0;

    cards.forEach((card) => {
      const shouldShow = matchesProjectCategory(card, activeFilter);

      if (shouldShow) {
        matches += 1;
        if (card.hidden) {
          card.hidden = false;
          card.dataset.state = "showing";
          requestAnimationFrame(() => {
            card.dataset.state = "visible";
          });
        } else {
          card.dataset.state = "visible";
        }
      } else if (!card.hidden) {
        card.dataset.state = "hiding";
        window.setTimeout(() => {
          card.hidden = true;
          card.dataset.state = "filtered";
        }, fadeDuration);
      } else {
        card.dataset.state = "filtered";
      }
    });

    if (emptyState) {
      emptyState.hidden = matches > 0;
    }
  };

  const selectProjectFilter = (button: HTMLElement) => {
    const nextFilter = button.dataset.projectFilter ?? "all";
    if (nextFilter === activeFilter) {
      return;
    }

    activeFilter = nextFilter;
    setActiveButtonState(button);

    const url = new URL(window.location.href);
    if (nextFilter === "all") {
      url.searchParams.delete("filter");
    } else {
      url.searchParams.set("filter", nextFilter);
    }

    window.history.pushState({}, "", url);
    applyFilters();
  };

  filters.forEach((button, index) => {
    const isActive = button.dataset.projectFilter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    button.addEventListener("click", () => selectProjectFilter(button));
    button.addEventListener("keydown", (event) => {
      let targetIndex = index;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          targetIndex = index > 0 ? index - 1 : filters.length - 1;
          break;
        case "ArrowRight":
          event.preventDefault();
          targetIndex = index < filters.length - 1 ? index + 1 : 0;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          selectProjectFilter(button);
          return;
        case "Escape":
          event.preventDefault();
          filters[0]?.focus();
          return;
        default:
          return;
      }

      filters[targetIndex]?.focus();
    });
  });

  applyFilters();
}

if (typeof document !== "undefined") {
  initProjectTilt();
  initProjectFilters();
}
