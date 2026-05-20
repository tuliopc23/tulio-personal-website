/** @jsxImportSource react */

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/tailwind-nav.css";
import {
  getSiteSearchOpen,
  registerSiteSearchApi,
  setSiteSearchOpen,
  subscribeSiteSearch,
} from "../../lib/navigation/site-search-store";
import type { SiteSearchRoute } from "../../lib/navigation/site-search-routes";
import { filterSiteSearchRoutes } from "../../lib/navigation/site-search-routes";
import { NavPhosphorIcon } from "./NavPhosphorIcon";
import { SiteSearchCommand } from "./SiteSearchCommand";
import { Popover, PopoverContent } from "../ui/popover";

export default function SiteSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerSiteSearchApi();
    return subscribeSiteSearch(setOpen);
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (isShortcut) {
        event.preventDefault();
        setSiteSearchOpen(!getSiteSearchOpen());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
    <Popover open={open} onOpenChange={setSiteSearchOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="topbar__iconButton topbar__searchButton"
          aria-label="Open search"
          aria-expanded={open}
          aria-haspopup="dialog"
          data-site-search-trigger
          title="Search (Cmd/Ctrl + K)"
        >
          <NavPhosphorIcon name="magnifying-glass" className="topbar__searchIcon" />
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
