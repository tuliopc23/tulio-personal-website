(() => {
  const doc = document;
  const body = doc.body;
  if (!body) {
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealSelector = "[data-reveal]";
  const internalLinkSelector = 'a[href^="/"]:not([target]):not([download])';
  const MAX_REVEAL_DELAY = 180;

  const revealElements = Array.from(doc.querySelectorAll(revealSelector));
  const internalLinks = Array.from(doc.querySelectorAll(internalLinkSelector));

  const showAllReveals = () => {
    revealElements.forEach((el) => {
      el.classList.add("is-visible");
    });
  };

  const ensureGlassState = () => {
    if (!body.dataset.glassState) {
      body.dataset.glassState = "rest";
    }
  };

  const updateGlassState = () => {
    const scrolled = window.scrollY > 32;
    body.dataset.glassState = scrolled ? "scrolled" : "rest";
  };

  const handleScroll = () => {
    window.requestAnimationFrame(updateGlassState);
  };

  ensureGlassState();
  updateGlassState();
  window.addEventListener("scroll", handleScroll, { passive: true });

  let observer = null;
  let linkHandler = null;

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (linkHandler) {
      internalLinks.forEach((link) => link.removeEventListener("click", linkHandler));
      linkHandler = null;
    }
  };

  const activateReducedMotion = () => {
    cleanup();
    body.classList.remove("motion-enabled");
    body.classList.add("motion-reduce");
    body.dataset.pageState = "ready";
    ensureGlassState();
    showAllReveals();
  };

  const activateStandardMotion = () => {
    cleanup();
    body.classList.remove("motion-reduce");
    body.classList.add("motion-enabled");
    body.dataset.pageState = "entering";
    ensureGlassState();

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

    if (revealElements.length) {
      const groups = new Map();
      observer = new IntersectionObserver(
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
        },
      );

      revealElements.forEach((element) => {
        const { revealDelay, revealOrder, revealGroup } = element.dataset;

        if (revealDelay) {
          element.style.setProperty("--reveal-delay", revealDelay);
        } else if (revealOrder !== undefined) {
          const numericOrder = Number(revealOrder);
          if (!Number.isNaN(numericOrder)) {
            const computed = Math.min(Math.max(numericOrder, 0) * 60, MAX_REVEAL_DELAY);
            element.style.setProperty("--reveal-delay", `${computed}ms`);
          }
        } else if (revealGroup) {
          const nextIndex = groups.get(revealGroup) ?? 0;
          const computed = Math.min(nextIndex * 60, MAX_REVEAL_DELAY);
          element.style.setProperty("--reveal-delay", `${computed}ms`);
          groups.set(revealGroup, nextIndex + 1);
        }

        observer?.observe(element);
      });
    }

    if (internalLinks.length) {
      linkHandler = (event) => {
        if (event.defaultPrevented) {
          return;
        }

        const link = event.currentTarget;
        if (!(link instanceof HTMLAnchorElement)) {
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
      };

      internalLinks.forEach((link) => link.addEventListener("click", linkHandler));
    }
  };

  const applyMotionPreference = (reduce) => {
    if (reduce) {
      activateReducedMotion();
    } else {
      activateStandardMotion();
    }
  };

  applyMotionPreference(prefersReduced.matches);

  const handlePreferenceChange = (event) => {
    const next = typeof event?.matches === "boolean" ? event.matches : prefersReduced.matches;
    applyMotionPreference(next);
  };

  if (typeof prefersReduced.addEventListener === "function") {
    prefersReduced.addEventListener("change", handlePreferenceChange);
  } else if (typeof prefersReduced.addListener === "function") {
    prefersReduced.addListener(handlePreferenceChange);
  }
})();
