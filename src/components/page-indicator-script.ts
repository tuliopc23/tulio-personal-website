declare global {
  interface Window {
    __pageIndicatorCleanups?: Array<() => void>;
  }
}

export function resolvePageIndicatorItemSelector(selector?: string | null) {
  const normalized = (selector || ":scope > *").trim();
  return normalized.startsWith(">") ? `:scope ${normalized}` : normalized;
}

export function prefersPageIndicatorReducedMotion(): boolean {
  const rootMotion = document.documentElement.dataset.motion;
  return (
    rootMotion === "reduced" ||
    (rootMotion !== "normal" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function resolveTargetLeft(container: HTMLElement, item: HTMLElement): number {
  const shouldCenter = container.matches("[data-repo-rail]");

  if (shouldCenter) {
    return clamp(
      item.offsetLeft - (container.clientWidth - item.offsetWidth) / 2,
      0,
      Math.max(0, container.scrollWidth - container.clientWidth),
    );
  }

  return clamp(item.offsetLeft, 0, Math.max(0, container.scrollWidth - container.clientWidth));
}

function getCleanups(): Array<() => void> {
  if (!Array.isArray(window.__pageIndicatorCleanups)) {
    window.__pageIndicatorCleanups = [];
  }

  return window.__pageIndicatorCleanups;
}

function cleanupAll() {
  getCleanups()
    .splice(0)
    .forEach((cleanup) => {
      cleanup();
    });
}

export function initPageIndicators(): void {
  cleanupAll();

  const indicators = document.querySelectorAll("[data-page-indicator]");
  indicators.forEach((indicator) => {
    if (!(indicator instanceof HTMLElement)) return;

    const containerSelector = indicator.getAttribute("data-container");
    const itemSelector = resolvePageIndicatorItemSelector(
      indicator.getAttribute("data-item") || ":scope > *",
    );
    if (!containerSelector) return;

    const container = document.querySelector(containerSelector);
    const track = indicator.querySelector("[data-page-indicator-track]");
    const slider = indicator.querySelector("[data-page-indicator-slider]");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !(container instanceof HTMLElement) ||
      !(track instanceof HTMLElement) ||
      !(slider instanceof HTMLElement)
    ) {
      return;
    }

    let dots: HTMLButtonElement[] = [];
    let ticking = false;

    const updateMotionState = () => {
      const reduced = prefersPageIndicatorReducedMotion();
      indicator.dataset.motion = reduced ? "reduced" : "normal";
      return reduced;
    };

    const getItems = () =>
      Array.from(container.querySelectorAll(itemSelector)).filter(
        (item) => item instanceof HTMLElement,
      );

    const scrollToIndex = (index: number) => {
      const items = getItems();
      const item = items[index];
      if (!(item instanceof HTMLElement)) return;

      container.scrollTo({
        left: resolveTargetLeft(container, item),
        behavior: prefersPageIndicatorReducedMotion() ? "auto" : "smooth",
      });
    };

    const updateSlider = (activeDot: HTMLElement | undefined) => {
      if (!(activeDot instanceof HTMLElement)) return;
      if (updateMotionState()) {
        slider.style.transform = "translateX(0px)";
        slider.style.width = "";
        return;
      }
      // Read all geometry before any writes to avoid forced layout reflow.
      const dotRect = activeDot.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const offsetX = dotRect.left - trackRect.left - 10;
      const activeWidth = getComputedStyle(activeDot).width;
      // Write phase — no reads after this point.
      slider.style.transform = `translateX(${offsetX}px)`;
      slider.style.width = activeWidth;
    };

    const syncDots = (activeIndex: number) => {
      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.dataset.active = String(isActive);
        dot.setAttribute("aria-pressed", isActive ? "true" : "false");
        dot.setAttribute("tabindex", isActive ? "0" : "-1");
      });
      updateSlider(dots[activeIndex]);
    };

    const buildDots = () => {
      const items = getItems();
      track.innerHTML = "";
      track.appendChild(slider);
      dots = [];
      updateMotionState();

      if (items.length <= 1) {
        indicator.style.display = "none";
        slider.style.transform = "translateX(0px)";
        return;
      }

      indicator.style.display = "";
      items.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.dataset.pageIndicatorDot = "";
        dot.dataset.active = String(index === 0);
        dot.setAttribute("tabindex", index === 0 ? "0" : "-1");
        dot.setAttribute("aria-label", `Go to item ${index + 1}`);
        dot.setAttribute("aria-pressed", index === 0 ? "true" : "false");
        dot.addEventListener("click", () => scrollToIndex(index));
        dot.addEventListener("keydown", (event) => {
          let nextIndex = index;
          if (event.key === "ArrowRight" || event.key === "ArrowDown")
            nextIndex = Math.min(index + 1, dots.length - 1);
          else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
            nextIndex = Math.max(index - 1, 0);
          else if (event.key === "Home") nextIndex = 0;
          else if (event.key === "End") nextIndex = dots.length - 1;
          else return;
          event.preventDefault();
          dots[nextIndex]?.focus();
          scrollToIndex(nextIndex);
        });
        track.appendChild(dot);
        dots.push(dot);
      });
      syncDots(0);
    };

    const updateActiveDot = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateMotionState();
        const items = getItems();
        if (items.length !== dots.length) buildDots();
        if (items.length === 0 || dots.length === 0) {
          indicator.style.display = "none";
          ticking = false;
          return;
        }
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        items.forEach((item, index) => {
          const itemRect = item.getBoundingClientRect();
          const itemCenter = itemRect.left + itemRect.width / 2;
          const distance = Math.abs(itemCenter - containerCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        syncDots(closestIndex);
        ticking = false;
      });
    };

    const observer = new MutationObserver(() => {
      buildDots();
      updateActiveDot();
    });
    observer.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "style"],
    });
    container.addEventListener("scroll", updateActiveDot, { passive: true });
    window.addEventListener("resize", updateActiveDot, { passive: true });
    const handleMotionChange = () => {
      updateMotionState();
      updateActiveDot();
    };
    motionQuery.addEventListener("change", handleMotionChange);
    getCleanups().push(() => {
      observer.disconnect();
      container.removeEventListener("scroll", updateActiveDot);
      window.removeEventListener("resize", updateActiveDot);
      motionQuery.removeEventListener("change", handleMotionChange);
    });
    buildDots();
    updateActiveDot();
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageIndicators, { once: true });
  } else {
    initPageIndicators();
  }
  document.addEventListener("astro:page-load", initPageIndicators);
}
