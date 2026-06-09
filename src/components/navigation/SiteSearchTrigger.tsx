/** @jsxImportSource react */

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/tailwind-nav.css";
import { setSiteSearchOpen, subscribeSiteSearch } from "../../lib/navigation/site-search-store";
import type { SiteSearchRoute } from "../../lib/navigation/site-search-routes";
import { filterSiteSearchRoutes } from "../../lib/navigation/site-search-routes";
import { NavPhosphorIcon } from "./NavPhosphorIcon";
import { SiteSearchCommand } from "./SiteSearchCommand";
import { Popover, PopoverContent } from "../ui/popover";

export default function SiteSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => subscribeSiteSearch(setOpen), []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");

    const syncMobileNav = () => {
      setMobileNavActive(document.body.dataset.mobileLiquidNav === "true" && media.matches);
    };

    syncMobileNav();
    media.addEventListener("change", syncMobileNav);

    const observer = new MutationObserver(syncMobileNav);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-mobile-liquid-nav"],
    });

    return () => {
      media.removeEventListener("change", syncMobileNav);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const id = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const navigateTo = useCallback((route: SiteSearchRoute) => {
    setSiteSearchOpen(false);
    window.location.assign(route.href);
  }, []);

  const onDesktopKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const first = filterSiteSearchRoutes(query)[0];
        if (first) {
          navigateTo(first);
        }
      }
    },
    [navigateTo, query],
  );

  return (
    <Popover
      open={open && !mobileNavActive}
      onOpenChange={(nextOpen) => {
        if (!mobileNavActive) {
          setSiteSearchOpen(nextOpen);
        }
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="topbar__iconButton topbar__searchButton"
          aria-label="Open site search. Keyboard shortcut: Command K."
          aria-keyshortcuts="Meta+K Control+K"
          aria-expanded={open}
          aria-haspopup="dialog"
          data-site-search-trigger
          title="Search (Cmd/Ctrl + K)"
        >
          <NavPhosphorIcon name="magnifying-glass" className="topbar__searchIcon" />
          <kbd className="topbar__searchKbd" aria-hidden="true">
            ⌘K
          </kbd>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverContent
        className="siteLiquidSearch__desktopPopover"
        align="end"
        side="bottom"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div onKeyDown={onDesktopKeyDown}>
          <SiteSearchCommand
            query={query}
            onQueryChange={setQuery}
            onSelect={navigateTo}
            inputRef={inputRef}
            placeholder="Search pages…"
            hideInputIcon
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
