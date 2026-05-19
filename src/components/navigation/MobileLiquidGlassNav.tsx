/** @jsxImportSource react */

import { Button } from "@base-ui/react/button";
import { Tabs } from "@base-ui/react/tabs";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/tailwind-nav.css";
import {
  getActiveMobileTabId,
  mobileTabLinks,
  normalizeMobilePathname,
} from "../../lib/navigation/mobile-tab-links";
import type { SiteSearchRoute } from "../../lib/navigation/site-search-routes";
import { filterSiteSearchRoutes } from "../../lib/navigation/site-search-routes";
import {
  registerSiteSearchApi,
  setSiteSearchOpen,
  subscribeSiteSearch,
} from "../../lib/navigation/site-search-store";
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
  const normalizedPath = useMemo(() => normalizeMobilePathname(pathname), [pathname]);
  const activeId = useMemo(() => getActiveMobileTabId(normalizedPath), [normalizedPath]);
  const showBack = normalizedPath !== "/";

  const [chromeHidden, setChromeHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(readPrefersReducedMotion);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerSiteSearchApi();
    return subscribeSiteSearch((open) => {
      setSearchOpen(open);
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(readPrefersReducedMotion());
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

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
  }, []);

  const navigateTo = useCallback((route: SiteSearchRoute) => {
    setSiteSearchOpen(false);
    window.location.assign(route.href);
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign("/");
  }, []);

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
        {searchOpen ? (
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
        ) : null}
      </AnimatePresence>

      {showBack ? (
        <motion.div
          className="mobileLiquidNav__back"
          initial={shouldAnimateChrome ? { opacity: 0, x: -12 } : false}
          animate={{ opacity: chromeMotion.opacity, x: 0, y: chromeMotion.y }}
          transition={chromeTransition}
          style={{ pointerEvents: chromeHidden && !searchOpen ? "none" : "auto" }}
        >
          <Button
            type="button"
            className="mobileLiquidNav__backBtn liquid-glass liquid-glass-chrome"
            aria-label="Go back"
            onClick={goBack}
          >
            <NavPhosphorIcon name="caret-left" className="mobileLiquidNav__tabIcon" />
          </Button>
        </motion.div>
      ) : null}

      <motion.nav
        className="mobileLiquidNav"
        aria-label="Mobile navigation"
        initial={shouldAnimateChrome ? { opacity: 0, y: 28 } : false}
        animate={{ opacity: chromeMotion.opacity, y: chromeMotion.y }}
        transition={chromeTransition}
        style={{ pointerEvents: chromeHidden && !searchOpen ? "none" : "none" }}
      >
        <motion.div
          className={cn(
            "mobileLiquidNav__dockWrap",
            searchOpen && "mobileLiquidNav__dockWrap--searchOpen",
          )}
          style={{ pointerEvents: chromeHidden && !searchOpen ? "none" : "auto" }}
          layout
        >
          {searchOpen ? (
            <Command
              className="mobileLiquidNav__searchShell"
              shouldFilter={false}
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={onSearchKeyDown}
            >
              <AnimatePresence>
                <motion.div
                  key="search-results"
                  className="mobileLiquidNav__searchResults liquid-glass liquid-glass-chrome"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.22 }}
                >
                  <SiteSearchResultsList
                    results={filterSiteSearchRoutes(searchQuery)}
                    onSelect={navigateTo}
                    listClassName="mobileLiquidNav__searchList"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mobileLiquidNav__dockRow">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key="search-pill"
                    className="mobileLiquidNav__searchPill liquid-glass liquid-glass-chrome"
                    layoutId="searchChrome"
                    initial={{ opacity: 0, scaleX: 0.88 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0.88 }}
                    transition={{ type: "spring", stiffness: 480, damping: 38 }}
                    style={{ originX: 1 }}
                  >
                    <div className="mobileLiquidNav__searchPillInner">
                      <NavPhosphorIcon
                        name="magnifying-glass"
                        className="mobileLiquidNav__tabIcon"
                      />
                      <SiteSearchInputField
                        inputRef={searchInputRef}
                        placeholder="Search pages…"
                        className="mobileLiquidNav__searchInputCommand"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
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
                    <Tabs.Indicator className="mobileLiquidNav__indicator liquid-glass-segment" />
                    {mobileTabLinks.map((link) => (
                      <Tabs.Tab
                        key={link.id}
                        value={link.id}
                        nativeButton={false}
                        className="mobileLiquidNav__tab"
                        render={
                          <a
                            href={link.href}
                            aria-current={link.match(normalizedPath) ? "page" : undefined}
                          />
                        }
                      >
                        <NavPhosphorIcon name={link.icon} />
                        <span className="mobileLiquidNav__tabLabel">{link.label}</span>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.Root>
              </motion.div>

              <motion.div layoutId="searchChrome">
                <Button
                  type="button"
                  className="mobileLiquidNav__searchFab liquid-glass liquid-glass-chrome"
                  aria-label="Open search"
                  aria-expanded={searchOpen}
                  onClick={openSearch}
                >
                  <NavPhosphorIcon name="magnifying-glass" className="mobileLiquidNav__tabIcon" />
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.nav>
    </>
  );
}
