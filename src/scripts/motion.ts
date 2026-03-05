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
  let body = doc.body as HTMLBodyElement & { dataset: BodyDataset };
  if (!body) {
    return;
  }

  const fallbackMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointerTiltMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
  const revealSelector = "[data-reveal]";
  const internalLinkSelector = 'a[href^="/"]:not([target]):not([download])';
  const MAX_REVEAL_DELAY = 180;

  let revealElements: HTMLElement[] = [];
  let internalLinks: HTMLAnchorElement[] = [];
  let glassFrame = 0;
  let readyFrame: number | null = null;
  let pendingLoadHandler: (() => void) | null = null;
  let leaveTimeout: number | null = null;
  let currentReducedMotion =
    window.themeController?.prefersReducedMotion?.() ?? fallbackMotionQuery.matches;
  let unsubscribeMotionPreference: (() => void) | null = null;
  let cleanupFallbackMotionListener: (() => void) | null = null;

  const refreshMotionTargets = (): void => {
    body = doc.body as HTMLBodyElement & { dataset: BodyDataset };
    revealElements = Array.from(doc.querySelectorAll<HTMLElement>(revealSelector));
    internalLinks = Array.from(doc.querySelectorAll<HTMLAnchorElement>(internalLinkSelector));
  };

  const clearReadyTransition = (): void => {
    if (readyFrame !== null) {
      window.cancelAnimationFrame(readyFrame);
      readyFrame = null;
    }

    if (pendingLoadHandler) {
      window.removeEventListener("load", pendingLoadHandler);
      pendingLoadHandler = null;
    }
  };

  const clearLeaveNavigation = (): void => {
    if (leaveTimeout !== null) {
      window.clearTimeout(leaveTimeout);
      leaveTimeout = null;
    }
  };

  const applyRevealDelay = (element: HTMLElement, groups: Map<string, number>): void => {
    const dataset = element.dataset as RevealDataset;
    const { revealDelay, revealOrder, revealGroup } = dataset;

    if (revealDelay) {
      element.style.setProperty("--reveal-delay", revealDelay);
      return;
    }

    if (revealOrder !== undefined) {
      const numericOrder = Number(revealOrder);
      if (!Number.isNaN(numericOrder)) {
        const computed = Math.min(Math.max(numericOrder, 0) * 60, MAX_REVEAL_DELAY);
        element.style.setProperty("--reveal-delay", `${computed}ms`);
      }
      return;
    }

    if (!revealGroup) {
      return;
    }

    const nextIndex = groups.get(revealGroup) ?? 0;
    const computed = Math.min(nextIndex * 60, MAX_REVEAL_DELAY);
    element.style.setProperty("--reveal-delay", `${computed}ms`);
    groups.set(revealGroup, nextIndex + 1);
  };

  const revealElement = (element: HTMLElement): void => {
    element.style.setProperty("--scroll-progress", "1");
    element.classList.add("is-visible");
  };

  const shouldRevealOnLoad = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();

    if (rect.bottom <= 0) {
      return true;
    }

    const viewportHeight = window.innerHeight;
    return rect.top <= viewportHeight * 0.88 && rect.bottom >= 0;
  };

  const resetRevealState = (): void => {
    revealElements.forEach((el) => {
      el.classList.remove("is-visible");
      el.style.removeProperty("--reveal-delay");
      el.style.removeProperty("--scroll-progress");
    });
  };

  const showAllReveals = (): void => {
    revealElements.forEach((el) => {
      el.style.removeProperty("--reveal-delay");
      revealElement(el);
    });
  };

  const ensureGlassState = (): void => {
    if (!body.dataset.glassState) {
      body.dataset.glassState = "rest";
    }
  };

  const updateGlassState = (): void => {
    glassFrame = 0;

    const nextState: GlassState = window.scrollY > 32 ? "scrolled" : "rest";
    if (body.dataset.glassState !== nextState) {
      body.dataset.glassState = nextState;
    }
  };

  const handleScroll = (): void => {
    if (glassFrame !== 0) {
      return;
    }

    glassFrame = window.requestAnimationFrame(updateGlassState);
  };

  ensureGlassState();
  updateGlassState();
  window.addEventListener("scroll", handleScroll, { passive: true });

  let observer: IntersectionObserver | null = null;
  let linkHandler: ((event: MouseEvent) => void) | null = null;
  let parallaxCleanups: Array<() => void> = [];

  const setupParallaxCards = (): void => {
    parallaxCleanups.forEach((dispose) => {
      dispose();
    });
    parallaxCleanups = [];

    if (currentReducedMotion || !pointerTiltMedia.matches) {
      return;
    }

    const cards = Array.from(doc.querySelectorAll<HTMLElement>("[data-parallax-card]"));
    if (!cards.length) {
      return;
    }

    cards.forEach((card) => {
      let frame = 0;
      let trackingPointer = false;
      const maxTilt = 4;
      const maxShift = 6;

      const applyTilt = (event: PointerEvent): void => {
        const rect = card.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
        const clamp = (value: number, limit: number): number =>
          Math.min(Math.max(value, -limit), limit);

        const rotateX = clamp(-relativeY * maxTilt * 2, maxTilt);
        const rotateY = clamp(relativeX * maxTilt * 2, maxTilt);
        const translateY = clamp(-relativeY * maxShift, maxShift);

        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          card.style.setProperty("--parallax-rotate-x", `${rotateX}deg`);
          card.style.setProperty("--parallax-rotate-y", `${rotateY}deg`);
          card.style.setProperty("--parallax-translate", `${translateY}px`);
        });
      };

      const resetTilt = (): void => {
        if (frame) window.cancelAnimationFrame(frame);
        card.style.setProperty("--parallax-rotate-x", "0deg");
        card.style.setProperty("--parallax-rotate-y", "0deg");
        card.style.setProperty("--parallax-translate", "0px");
      };

      const handlePointerMove = (event: PointerEvent): void => applyTilt(event);

      const handlePointerEnter = (event: PointerEvent): void => {
        if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
          return;
        }

        if (!trackingPointer) {
          card.addEventListener("pointermove", handlePointerMove, { passive: true });
          trackingPointer = true;
        }

        card.classList.add("is-tilting");
        applyTilt(event);
      };

      const handlePointerEnd = (): void => {
        if (trackingPointer) {
          card.removeEventListener("pointermove", handlePointerMove);
          trackingPointer = false;
        }

        card.classList.remove("is-tilting");
        resetTilt();
      };

      card.addEventListener("pointerenter", handlePointerEnter, { passive: true });
      card.addEventListener("pointerleave", handlePointerEnd, { passive: true });
      card.addEventListener("pointercancel", handlePointerEnd, { passive: true });

      parallaxCleanups.push(() => {
        card.removeEventListener("pointerenter", handlePointerEnter);
        card.removeEventListener("pointerleave", handlePointerEnd);
        card.removeEventListener("pointercancel", handlePointerEnd);
        handlePointerEnd();
      });
    });
  };

  const cleanup = (): void => {
    clearReadyTransition();
    clearLeaveNavigation();

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

    if (parallaxCleanups.length > 0) {
      parallaxCleanups.forEach((dispose) => {
        dispose();
      });
      parallaxCleanups = [];
    }

    if (glassFrame !== 0) {
      window.cancelAnimationFrame(glassFrame);
      glassFrame = 0;
    }
  };

  const activateReducedMotion = (): void => {
    cleanup();
    body.dataset.pageState = "ready";
    ensureGlassState();
    showAllReveals();
  };

  const activateStandardMotion = (): void => {
    cleanup();
    body.dataset.pageState = "entering";
    ensureGlassState();
    resetRevealState();

    const onReady = (): void => {
      readyFrame = requestAnimationFrame(() => {
        readyFrame = null;
        body.dataset.pageState = "ready";
      });
    };

    if (doc.readyState === "complete") {
      onReady();
    } else {
      pendingLoadHandler = () => {
        pendingLoadHandler = null;
        onReady();
      };
      window.addEventListener("load", pendingLoadHandler, { once: true });
    }

    // Check if we're on an article page - show reveals immediately
    const isArticlePage =
      window.location.pathname.startsWith("/blog/") &&
      window.location.pathname !== "/blog/" &&
      !window.location.pathname.startsWith("/blog/category/");

    if (revealElements.length) {
      const groups = new Map<string, number>();

      revealElements.forEach((element) => {
        applyRevealDelay(element, groups);
      });

      if (isArticlePage) {
        requestAnimationFrame(() => {
          revealElements.forEach((element) => {
            revealElement(element);
          });
        });
      } else {
        observer = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              const target = entry.target as HTMLElement;
              revealElement(target);
              observer?.unobserve(target);
            });
          },
          {
            root: null,
            rootMargin: "0px 0px -12% 0px",
            threshold: 0.12,
          },
        );

        revealElements.forEach((element) => {
          if (shouldRevealOnLoad(element)) {
            revealElement(element);
            return;
          }

          observer?.observe(element);
        });
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

        clearLeaveNavigation();
        leaveTimeout = window.setTimeout(() => {
          leaveTimeout = null;
          window.location.assign(url.toString());
        }, 160);

        event.preventDefault();
      };

      internalLinks.forEach((link) => {
        link.addEventListener("click", linkHandler as EventListener);
      });
    }

    setupParallaxCards();
  };

  const applyMotionPreference = (reduce: boolean): void => {
    if (reduce) {
      activateReducedMotion();
    } else {
      activateStandardMotion();
    }
  };

  const initializeMotionRuntime = (): void => {
    refreshMotionTargets();
    applyMotionPreference(currentReducedMotion);
  };

  const bindMotionPreference = (): void => {
    if (unsubscribeMotionPreference || cleanupFallbackMotionListener) {
      return;
    }

    const handlePreferenceChange = (next: boolean): void => {
      if (next === currentReducedMotion) {
        return;
      }

      currentReducedMotion = next;
      applyMotionPreference(next);
    };

    if (window.themeController?.subscribeMotionPreference) {
      unsubscribeMotionPreference =
        window.themeController.subscribeMotionPreference(handlePreferenceChange);
      return;
    }

    const fallbackHandler = (event?: MediaQueryListEvent): void => {
      handlePreferenceChange(
        typeof event?.matches === "boolean" ? event.matches : fallbackMotionQuery.matches,
      );
    };

    if (typeof fallbackMotionQuery.addEventListener === "function") {
      fallbackMotionQuery.addEventListener("change", fallbackHandler);
      cleanupFallbackMotionListener = () => {
        fallbackMotionQuery.removeEventListener("change", fallbackHandler);
      };
      return;
    }

    if (typeof fallbackMotionQuery.addListener === "function") {
      fallbackMotionQuery.addListener(fallbackHandler);
      cleanupFallbackMotionListener = () => {
        fallbackMotionQuery.removeListener(fallbackHandler);
      };
    }
  };

  bindMotionPreference();
  initializeMotionRuntime();

  document.addEventListener("astro:before-swap", cleanup);
  document.addEventListener("astro:page-load", initializeMotionRuntime);
  window.addEventListener("pagehide", cleanup);
})();
