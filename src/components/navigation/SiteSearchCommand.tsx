/** @jsxImportSource react */

import { useMemo, type ComponentProps, type RefObject } from "react";
import {
  filterSiteSearchRoutes,
  routeSearchHaystack,
  type SiteSearchRoute,
} from "../../lib/navigation/site-search-routes";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { NavPhosphorIcon, type NavPhosphorIconName } from "./NavPhosphorIcon";

const routeIcons: Record<string, NavPhosphorIconName> = {
  Home: "house",
  Blog: "notebook",
  Cases: "briefcase",
  About: "sparkle",
};

type SiteSearchCommandProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (route: SiteSearchRoute) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  className?: string;
  listClassName?: string;
  showInput?: boolean;
  showList?: boolean;
  compactItems?: boolean;
  emptyStateMode?: "default" | "hidden" | "hint";
  hideInputIcon?: boolean;
  listId?: string;
};

function SiteSearchResultsList({
  results,
  onSelect,
  listClassName,
  compactItems = false,
  listId,
}: {
  results: SiteSearchRoute[];
  onSelect: (route: SiteSearchRoute) => void;
  listClassName?: string;
  compactItems?: boolean;
  listId?: string;
}) {
  return (
    <CommandList id={listId} className={listClassName}>
      <CommandEmpty>No pages match your search.</CommandEmpty>
      <CommandGroup>
        {results.map((route) => (
          <CommandItem
            key={route.href}
            value={routeSearchHaystack(route)}
            onSelect={() => onSelect(route)}
          >
            {compactItems ? (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9rem] font-semibold leading-tight text-[var(--text)]">
                  {route.title}
                </span>
              </span>
            ) : (
              <>
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[color-mix(in_srgb,var(--panel-border)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_52%,transparent)] text-[var(--text-secondary)]"
                  aria-hidden
                >
                  <NavPhosphorIcon
                    name={routeIcons[route.title] ?? "house"}
                    className="size-[18px]"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-semibold leading-tight text-[var(--text)]">
                    {route.title}
                  </span>
                  <span className="block truncate text-[0.84rem] font-normal text-[var(--text-secondary)]">
                    {route.description}
                  </span>
                </span>
              </>
            )}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
}

export function SiteSearchCommand({
  query,
  onQueryChange,
  onSelect,
  inputRef,
  placeholder = "Search pages…",
  className,
  listClassName,
  showInput = true,
  showList = true,
  compactItems = false,
  emptyStateMode = "default",
  hideInputIcon = false,
  listId,
}: SiteSearchCommandProps) {
  const results = useMemo(() => filterSiteSearchRoutes(query), [query]);
  const trimmed = query.trim();
  const showResults = showList && (emptyStateMode === "default" || trimmed.length > 0);

  return (
    <Command className={className} shouldFilter={false} value={query} onValueChange={onQueryChange}>
      {showInput ? (
        <div className="liquid-glass--field border-0 border-b border-[color-mix(in_srgb,var(--panel-border)_75%,transparent)] px-4 py-1">
          <CommandInput ref={inputRef} placeholder={placeholder} hideIcon={hideInputIcon} />
        </div>
      ) : null}
      {showResults ? (
        <SiteSearchResultsList
          results={results}
          onSelect={onSelect}
          listClassName={listClassName}
          compactItems={compactItems}
          listId={listId}
        />
      ) : null}
    </Command>
  );
}

/** Renders only the cmdk input — must be used inside a parent `<Command>`. */
export function SiteSearchInputField({
  inputRef,
  placeholder = "Search pages…",
  className,
  hideInputIcon = false,
  ...inputProps
}: Pick<SiteSearchCommandProps, "inputRef" | "placeholder" | "className" | "hideInputIcon"> &
  Omit<ComponentProps<typeof CommandInput>, "hideIcon">) {
  return (
    <div className={className ?? "min-w-0 flex-1"}>
      <CommandInput
        ref={inputRef}
        placeholder={placeholder}
        hideIcon={hideInputIcon}
        {...inputProps}
      />
    </div>
  );
}

export { SiteSearchResultsList };
