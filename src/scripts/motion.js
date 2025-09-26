(() => {
  const doc = document;
  const body = doc.body;
  if (!body) {
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasReduced = prefersReduced.matches;

  const revealSelector = "[data-reveal]";

  if (hasReduced) {
    body.classList.add("motion-reduce");
    body.dataset.pageState = "ready";
    if (!body.dataset.glassState) {
      body.dataset.glassState = "rest";
    }
    doc.querySelectorAll(revealSelector).forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  body.classList.add("motion-enabled");
  if (!body.dataset.pageState) {
    body.dataset.pageState = "entering";
  }
  if (!body.dataset.glassState) {
    body.dataset.glassState = "rest";
  }

  const onReady = () => {
    requestAnimationFrame(() => {
      body.dataset.pageState = "ready";
    });
  };

  if (doc.readyState === "complete") {
    onReady();
  } else {
    window.addEventListener("load", onReady, { once: true });
  }

  const groups = new Map();
  const revealElements = Array.from(doc.querySelectorAll(revealSelector));

  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.add("is-visible");
            obs.unobserve(target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10%",
        threshold: 0.15,
      }
    );

    revealElements.forEach((el) => {
      const element = el;
      const { revealDelay, revealOrder, revealGroup } = element.dataset;

      if (revealDelay) {
        element.style.setProperty("--reveal-delay", revealDelay);
      } else if (revealOrder !== undefined) {
        const numericOrder = Number(revealOrder);
        if (!Number.isNaN(numericOrder)) {
          element.style.setProperty("--reveal-delay", `${numericOrder * 50}ms`);
        }
      } else if (revealGroup) {
        const nextIndex = groups.get(revealGroup) ?? 0;
        element.style.setProperty("--reveal-delay", `${nextIndex * 60}ms`);
        groups.set(revealGroup, nextIndex + 1);
      }

      observer.observe(element);
    });
  }

  const updateGlassState = () => {
    const scrolled = window.scrollY > 32;
    body.dataset.glassState = scrolled ? "scrolled" : "rest";
  };

  updateGlassState();

  window.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateGlassState);
    },
    { passive: true }
  );

  const internalLinkSelector = 'a[href^="/"]:not([target]):not([download])';
  const internalLinks = Array.from(doc.querySelectorAll(internalLinkSelector));

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (body.dataset.pageState === "leaving") {
        return;
      }

      body.dataset.pageState = "leaving";

      window.setTimeout(() => {
        window.location.assign(url.toString());
      }, 160);

      event.preventDefault();
    });
  });

  prefersReduced.addEventListener?.("change", () => {
    window.location.reload();
  });
})();
