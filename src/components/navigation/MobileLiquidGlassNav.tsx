/** @jsxImportSource react */

import { Button } from "@base-ui/react/button";
import { Tabs } from "@base-ui/react/tabs";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getActiveMobileTabId,
  mobileTabLinks,
  normalizeMobilePathname,
} from "../../lib/navigation/mobile-tab-links";
import { NavPhosphorIcon } from "./NavPhosphorIcon";

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

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(readPrefersReducedMotion());
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const shouldAnimateChrome = !motionReduced && !reducedMotion;

  useEffect(() => {
    if (!shouldAnimateChrome) {
      setChromeHidden(false);
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
  }, [shouldAnimateChrome]);

  const openSearch = useCallback(() => {
    const trigger = document.querySelector<HTMLButtonElement>("[data-site-search-open]");
    trigger?.click();
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
        y: chromeHidden ? "calc(100% + 24px)" : 0,
        opacity: chromeHidden ? 0 : 1,
      }
    : { y: 0, opacity: 1 };

  const chromeTransition = shouldAnimateChrome
    ? { type: "spring" as const, stiffness: 420, damping: 36 }
    : { duration: 0 };

  return (
    <>
      {showBack ? (
        <motion.div
          className="mobileLiquidNav__back"
          initial={shouldAnimateChrome ? { opacity: 0, x: -12 } : false}
          animate={{ opacity: chromeMotion.opacity, x: 0, y: chromeMotion.y }}
          transition={chromeTransition}
          style={{ pointerEvents: chromeHidden ? "none" : "auto" }}
        >
          <Button
            type="button"
            className="mobileLiquidNav__backBtn liquid-surface"
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
        style={{ pointerEvents: chromeHidden ? "none" : "none" }}
      >
        <div
          className="mobileLiquidNav__dock"
          style={{ pointerEvents: chromeHidden ? "none" : "auto" }}
        >
          <Tabs.Root value={activeId} className="mobileLiquidNav__tabbar liquid-surface">
            <Tabs.List className="mobileLiquidNav__tabList">
              <Tabs.Indicator className="mobileLiquidNav__indicator" />
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

          <Button
            type="button"
            className="mobileLiquidNav__searchFab liquid-surface"
            aria-label="Open quick search"
            onClick={openSearch}
          >
            <NavPhosphorIcon name="magnifying-glass" className="mobileLiquidNav__tabIcon" />
          </Button>
        </div>
      </motion.nav>
    </>
  );
}
