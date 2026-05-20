/** @jsxImportSource react */

import { Tabs } from "@base-ui/react/tabs";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { navigateBack } from "../../lib/navigation/go-back";
import { setSiteSearchOpen, subscribeSiteSearch } from "../../lib/navigation/site-search-store";
import "../../styles/tailwind-nav.css";
import {
  getActivePrimaryNavId,
  normalizePathname,
  primaryNavLinks,
} from "../../lib/navigation/primary-nav-links";
import type { SiteSearchRoute } from "../../lib/navigation/site-search-routes";
import { filterSiteSearchRoutes } from "../../lib/navigation/site-search-routes";
import { cn } from "../../lib/utils";
import { NavPhosphorIcon } from "./NavPhosphorIcon";
import { Command } from "../ui/command";
import { SiteSearchInputField, SiteSearchResultsList } from "./SiteSearchCommand";

type MobileLiquidGlassNavProps = {
  pathname: string;
};

function readPrefersReducedMotion(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return (
    document.documentElement.dataset.motion === "reduced" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function MobileLiquidGlassNav({ pathname }: MobileLiquidGlassNavProps) {
  const motionReduced = useReducedMotion();
  const normalizedPath = useMemo(() => normalizePathname(pathname), [pathname]);
  const activeId = useMemo(() => getActivePrimaryNavId(normalizedPath), [normalizedPath]);
  const showBack = normalizedPath !== "/";

  const [chromeHidden, setChromeHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(readPrefersReducedMotion);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(readPrefersReducedMotion());
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const syncVisualViewportOffset = () => {
      const bottomOffset =
        searchOpen && viewport
          ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
          : 0;
      root.style.setProperty("--mobile-nav-keyboard-offset", `${Math.round(bottomOffset)}px`);
    };

    syncVisualViewportOffset();
    viewport?.addEventListener("resize", syncVisualViewportOffset);
    viewport?.addEventListener("scroll", syncVisualViewportOffset);
    window.addEventListener("resize", syncVisualViewportOffset);
    window.addEventListener("orientationchange", syncVisualViewportOffset);

    return () => {
      viewport?.removeEventListener("resize", syncVisualViewportOffset);
      viewport?.removeEventListener("scroll", syncVisualViewportOffset);
      window.removeEventListener("resize", syncVisualViewportOffset);
      window.removeEventListener("orientationchange", syncVisualViewportOffset);
      root.style.removeProperty("--mobile-nav-keyboard-offset");
    };
  }, [searchOpen]);

  useEffect(() => subscribeSiteSearch(setSearchOpen), []);

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery("");
      return;
    }

    const id = requestAnimationFrame(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(id);
  }, [searchOpen]);

  const shouldAnimateChrome = !motionReduced && !reducedMotion;

  useEffect(() => {
    if (!shouldAnimateChrome || searchOpen) {
      if (searchOpen) {
        setChromeHidden(false);
      }
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;

        if (Math.abs(delta) > 10 && y > 72) {
          setChromeHidden(delta > 0);
        } else if (delta < 0) {
          setChromeHidden(false);
        }

        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldAnimateChrome, searchOpen]);

  const openSearch = useCallback(() => {
    setSiteSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSiteSearchOpen(false);
    requestAnimationFrame(() => {
      searchFabRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const navigateTo = useCallback(
    (route: SiteSearchRoute) => {
      closeSearch();
      window.location.assign(route.href);
    },
    [closeSearch],
  );

  const goBack = useCallback(() => {
    navigateBack("/");
  }, []);

  const searchListId = useId();
  const trimmedSearchQuery = searchQuery.trim();

  const chromeMotion = shouldAnimateChrome
    ? {
        y: chromeHidden ? "calc(100% + var(--mobile-nav-chrome-offset, 12px))" : 0,
        opacity: chromeHidden ? 0 : 1,
      }
    : { y: 0, opacity: 1 };

  const chromeTransition = shouldAnimateChrome
    ? { type: "spring" as const, stiffness: 420, damping: 36 }
    : { duration: 0 };

  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const first = filterSiteSearchRoutes(searchQuery)[0];
        if (first) {
          navigateTo(first);
        }
      }
    },
    [closeSearch, navigateTo, searchQuery],
  );

  return (
    <>
      <AnimatePresence>
        {searchOpen && (
          <motion.button
            type="button"
            key="search-backdrop"
            className="mobileLiquidNav__searchBackdrop"
            aria-label="Close search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={closeSearch}
          />
        )}
      </AnimatePresence>

      {showBack ? (
        <motion.div
          className="mobileLiquidNav__back"
          initial={false}
          animate={{ opacity: chromeMotion.opacity, x: 0, y: chromeMotion.y }}
          transition={chromeTransition}
          style={{
            pointerEvents: chromeHidden && !searchOpen ? "none" : "auto",
          }}
        >
          <button
            type="button"
            className="mobileLiquidNav__backBtn liquid-glass liquid-glass-chrome"
            aria-label="Go back"
            onClick={goBack}
          >
            <NavPhosphorIcon name="caret-left" className="mobileLiquidNav__tabIcon" />
          </button>
        </motion.div>
      ) : null}

      <motion.nav
        className="mobileLiquidNav"
        aria-label="Mobile navigation"
        initial={false}
        animate={{ opacity: chromeMotion.opacity, y: chromeMotion.y }}
        transition={chromeTransition}
        style={{ pointerEvents: chromeHidden && !searchOpen ? "none" : "auto" }}
      >
        <motion.div
          className={cn(
            "mobileLiquidNav__dockWrap",
            searchOpen && "mobileLiquidNav__dockWrap--searchOpen",
          )}
          style={{
            pointerEvents: chromeHidden && !searchOpen ? "none" : "auto",
          }}
          layout
        >
          {searchOpen ? (
            <Command
              className="siteSearchPanel siteSearchPanel--mobile"
              shouldFilter={false}
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={onSearchKeyDown}
            >
              <motion.div
                className="siteSearchPanel__chrome liquid-glass liquid-glass-chrome"
                layoutId="searchChrome"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 480, damping: 38 }}
              >
                <div className="siteSearchPanel__field">
                  <NavPhosphorIcon name="magnifying-glass" className="siteSearchItem__icon" />
                  <SiteSearchInputField
                    inputRef={searchInputRef}
                    placeholder="Search pages…"
                    className="mobileLiquidNav__searchInputCommand"
                    hideInputIcon
                    role="combobox"
                    aria-expanded={trimmedSearchQuery.length > 0}
                    aria-controls={searchListId}
                    aria-autocomplete="list"
                  />
                  <button
                    type="button"
                    className="siteSearchPanel__close"
                    aria-label="Close search"
                    onClick={closeSearch}
                  >
                    <span aria-hidden>×</span>
                  </button>
                </div>
                {trimmedSearchQuery.length > 0 ? (
                  <SiteSearchResultsList
                    results={filterSiteSearchRoutes(searchQuery)}
                    onSelect={navigateTo}
                    listClassName="siteSearchPanel__list"
                    compactItems
                    listId={searchListId}
                  />
                ) : null}
              </motion.div>
            </Command>
          ) : (
            <div className="mobileLiquidNav__dockRow">
              <motion.div
                key="tabbar"
                className="mobileLiquidNav__tabbarWrap"
                layout
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Tabs.Root
                  value={activeId}
                  className="mobileLiquidNav__tabbar liquid-glass liquid-glass-chrome"
                >
                  <Tabs.List className="mobileLiquidNav__tabList">
                    {primaryNavLinks.map((link) => (
                      <Tabs.Tab
                        key={link.id}
                        value={link.id}
                        nativeButton={false}
                        className="mobileLiquidNav__tab"
                        render={
                          <motion.a
                            href={link.href}
                            aria-current={link.match(normalizedPath) ? "page" : undefined}
                            whileTap={shouldAnimateChrome ? { scale: 0.96 } : undefined}
                          />
                        }
                      >
                        {activeId === link.id ? (
                          <motion.span
                            layoutId="mobilePrimaryNavIndicator"
                            className="mobileLiquidNav__indicator liquid-glass-segment"
                            aria-hidden
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        ) : null}
                        <NavPhosphorIcon name={link.icon} />
                        <span className="mobileLiquidNav__tabLabel">{link.label}</span>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.Root>
              </motion.div>

              <motion.div layoutId="searchChrome">
                <button
                  ref={searchFabRef}
                  type="button"
                  className="mobileLiquidNav__searchFab liquid-glass liquid-glass-chrome"
                  aria-label="Open search"
                  aria-expanded={searchOpen}
                  aria-controls={searchOpen ? searchListId : undefined}
                  onClick={openSearch}
                >
                  <NavPhosphorIcon name="magnifying-glass" className="mobileLiquidNav__tabIcon" />
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.nav>
    </>
  );
}
