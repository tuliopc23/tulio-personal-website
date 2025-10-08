(() => {
  // Track scroll position for edge fade indicators
  const updateEdgeFades = (): void => {
    // Article carousel edge fades
    const articleCarousels = document.querySelectorAll<HTMLElement>(".articleCarousel");
    articleCarousels.forEach((carousel) => {
      const grid = carousel.querySelector<HTMLElement>(".articleGrid");
      if (!grid) return;

      const { scrollLeft, scrollWidth, clientWidth } = grid;
      const atStart = scrollLeft <= 10;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      carousel.setAttribute("data-at-start", String(atStart));
      carousel.setAttribute("data-at-end", String(atEnd));
    });

    // Card rail edge fades (handled via container parent)
    const cardRails = document.querySelectorAll<HTMLElement>(".cardRail");
    cardRails.forEach((rail) => {
      const { scrollLeft, scrollWidth, clientWidth } = rail;
      const atStart = scrollLeft <= 10;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      const container = rail.closest<HTMLElement>(".container");
      if (container) {
        container.setAttribute("data-at-start", String(atStart));
        container.setAttribute("data-at-end", String(atEnd));
      }
    });
  };

  // Attach scroll listeners
  const attachScrollListeners = (): void => {
    const scrollables = [
      ...document.querySelectorAll<HTMLElement>(".articleGrid"),
      ...document.querySelectorAll<HTMLElement>(".cardRail"),
    ];

    scrollables.forEach((element) => {
      element.addEventListener("scroll", updateEdgeFades, { passive: true });
    });

    window.addEventListener("resize", updateEdgeFades, { passive: true });
  };

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      attachScrollListeners();
      updateEdgeFades();
    });
  } else {
    attachScrollListeners();
    updateEdgeFades();
  }
})();
