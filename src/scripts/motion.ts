(() => {
  type PageState = "entering" | "ready" | "leaving";
  type GlassState = "rest" | "scrolled";

  interface BodyDataset extends DOMStringMap {
    pageState?: PageState;
    glassState?: GlassState;
  }

  interface RevealDataset extends DOMStringMap {
    reveal?: string;
    revealDelay?: string;
    revealOrder?: string;
    revealGroup?: string;
  }

  const doc = document;
  const body = doc.body as HTMLBodyElement & { dataset: BodyDataset };
  if (!body) {
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealSelector = "[data-reveal]";
  const internalLinkSelector = 'a[href^="/"]:not([target]):not([download])';
  const MAX_REVEAL_DELAY = 180;

  const revealElements = Array.from(doc.querySelectorAll<HTMLElement>(revealSelector));
  const internalLinks = Array.from(doc.querySelectorAll<HTMLAnchorElement>(internalLinkSelector));

  const showAllReveals = (): void => {
    revealElements.forEach((el) => {
      el.classList.add("is-visible");
    });
  };

  const ensureGlassState = (): void => {
    if (!body.dataset.glassState) {
      body.dataset.glassState = "rest";
    }
  };

  const updateGlassState = (): void => {
    const scrolled = window.scrollY > 32;
    body.dataset.glassState = scrolled ? "scrolled" : "rest";
  };

  const handleScroll = (): void => {
    window.requestAnimationFrame(updateGlassState);
  };

  ensureGlassState();
  updateGlassState();
  window.addEventListener("scroll", handleScroll, { passive: true });

  let observer: IntersectionObserver | null = null;
  let linkHandler: ((event: MouseEvent) => void) | null = null;
  let scrollHandler: (() => void) | null = null;
  let scrollTimeout: number | null = null;

  const cleanup = (): void => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (linkHandler) {
      internalLinks.forEach((link) => {
        link.removeEventListener("click", linkHandler as EventListener);
      });
      linkHandler = null;
    }

    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
      scrollHandler = null;
    }

    if (scrollTimeout !== null) {
      window.cancelAnimationFrame(scrollTimeout);
      scrollTimeout = null;
    }
  };

  const activateReducedMotion = (): void => {
    cleanup();
    body.classList.remove("motion-enabled");
    body.classList.add("motion-reduce");
    body.dataset.pageState = "ready";
    ensureGlassState();
    showAllReveals();
  };

  const activateStandardMotion = (): void => {
    cleanup();
    body.classList.remove("motion-reduce");
    body.classList.add("motion-enabled");
    body.dataset.pageState = "entering";
    ensureGlassState();

    const onReady = (): void => {
      requestAnimationFrame(() => {
        body.dataset.pageState = "ready";
      });
    };

    if (doc.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady, { once: true });
    }

    // Check if we're on an article page - show reveals immediately
    const isArticlePage =
      window.location.pathname.startsWith("/blog/") &&
      window.location.pathname !== "/blog/" &&
      !window.location.pathname.startsWith("/blog/category/");

    if (revealElements.length) {
      const groups = new Map<string, number>();

      if (isArticlePage) {
        // On article pages, show all reveals immediately with staggered delays
        revealElements.forEach((element) => {
          const dataset = element.dataset as RevealDataset;
          const { revealDelay, revealOrder, revealGroup } = dataset;

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

          // Show immediately with delay
          setTimeout(
            () => {
              element.classList.add("is-visible");
            },
            parseInt(element.style.getPropertyValue("--reveal-delay"), 10) || 0,
          );
        });
      } else {
        // On other pages, use intersection observer with scroll progress tracking
        observer = new IntersectionObserver(
          (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
            entries.forEach((entry) => {
              const target = entry.target as HTMLElement;
              const rect = entry.boundingClientRect;
              const viewportHeight = window.innerHeight;
              
              // Calculate scroll progress (0 = just entering, 1 = fully visible)
              // Trigger zone: from 20% below viewport to 20% above viewport
              const triggerStart = viewportHeight * 0.2;
              const triggerEnd = viewportHeight * 0.8;
              const elementTop = rect.top;
              const elementHeight = rect.height;
              
              let progress = 0;
              
              if (entry.isIntersecting) {
                // Element is in the trigger zone
                const distanceFromTop = elementTop - triggerStart;
                const triggerRange = triggerEnd - triggerStart;
                progress = Math.max(0, Math.min(1, 1 - (distanceFromTop / triggerRange)));
                
                // Smooth progress calculation
                progress = Math.max(0, Math.min(1, progress));
                target.style.setProperty("--scroll-progress", String(progress));
                
                // Mark as visible when progress > 0.5 for better UX
                if (progress > 0.5 && !target.classList.contains("is-visible")) {
                  target.classList.add("is-visible");
                }
              } else {
                // Element is outside viewport
                if (elementTop < 0) {
                  // Element has scrolled past - fully visible
                  progress = 1;
                  target.classList.add("is-visible");
                } else {
                  // Element hasn't entered yet
                  progress = 0;
                }
                target.style.setProperty("--scroll-progress", String(progress));
              }
            });
          },
          {
            root: null,
            rootMargin: "20% 0px -20% 0px", // Larger margin for smoother transitions
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Multiple thresholds for smooth progress
          },
        );

        // Add scroll listener for continuous progress updates
        const updateScrollProgress = (): void => {
          revealElements.forEach((element) => {
            if (element.classList.contains("is-visible")) {
              return; // Skip already fully visible elements
            }
            
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const triggerStart = viewportHeight * 0.2;
            const triggerEnd = viewportHeight * 0.8;
            
            // Check if element is in trigger zone
            if (rect.top < triggerEnd && rect.bottom > triggerStart) {
              const distanceFromTop = rect.top - triggerStart;
              const triggerRange = triggerEnd - triggerStart;
              const progress = Math.max(0, Math.min(1, 1 - (distanceFromTop / triggerRange)));
              element.style.setProperty("--scroll-progress", String(progress));
              
              if (progress > 0.5) {
                element.classList.add("is-visible");
              }
            } else if (rect.top < 0) {
              // Element scrolled past - fully visible
              element.style.setProperty("--scroll-progress", "1");
              element.classList.add("is-visible");
            }
          });
        };

        revealElements.forEach((element) => {
          const dataset = element.dataset as RevealDataset;
          const { revealDelay, revealOrder, revealGroup } = dataset;

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

          // Check if element is already in viewport on load
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const triggerStart = viewportHeight * 0.2;
          const triggerEnd = viewportHeight * 0.8;
          
          if (rect.top < triggerEnd && rect.bottom > triggerStart) {
            // Element is already in trigger zone
            const distanceFromTop = rect.top - triggerStart;
            const triggerRange = triggerEnd - triggerStart;
            const progress = Math.max(0, Math.min(1, 1 - (distanceFromTop / triggerRange)));
            element.style.setProperty("--scroll-progress", String(progress));
            if (progress > 0.5) {
              element.classList.add("is-visible");
            }
          } else if (rect.top < 0) {
            // Element is above viewport - fully visible
            element.style.setProperty("--scroll-progress", "1");
            element.classList.add("is-visible");
          } else {
            // Element is below viewport - initialize to 0
            element.style.setProperty("--scroll-progress", "0");
          }

          observer?.observe(element);
        });

        // Throttled scroll listener for smooth progress updates
        scrollHandler = (): void => {
          if (scrollTimeout === null) {
            scrollTimeout = window.requestAnimationFrame(() => {
              updateScrollProgress();
              scrollTimeout = null;
            });
          }
        };
        window.addEventListener("scroll", scrollHandler, { passive: true });
      }
    }

    if (internalLinks.length) {
      linkHandler = (event: MouseEvent): void => {
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

      internalLinks.forEach((link) => {
        link.addEventListener("click", linkHandler as EventListener);
      });
    }
  };

  const applyMotionPreference = (reduce: boolean): void => {
    if (reduce) {
      activateReducedMotion();
    } else {
      activateStandardMotion();
    }
  };

  applyMotionPreference(prefersReduced.matches);

  const handlePreferenceChange = (event?: MediaQueryListEvent): void => {
    const next = typeof event?.matches === "boolean" ? event.matches : prefersReduced.matches;
    applyMotionPreference(next);
  };

  if (typeof prefersReduced.addEventListener === "function") {
    prefersReduced.addEventListener("change", handlePreferenceChange);
  } else if (typeof prefersReduced.addListener === "function") {
    // Legacy API for older browsers
    prefersReduced.addListener(handlePreferenceChange);
  }
})();
