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
  fieldClassName?: string;
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
    <CommandList id={listId} className={listClassName ?? "siteSearchPanel__list"}>
      <CommandEmpty className="siteSearchPanel__empty">No pages match your search.</CommandEmpty>
      <CommandGroup>
        {results.map((route) => (
          <CommandItem
            key={route.href}
            value={routeSearchHaystack(route)}
            onSelect={() => onSelect(route)}
          >
            <NavPhosphorIcon
              name={routeIcons[route.title] ?? "house"}
              className="siteSearchItem__icon"
            />
            <span className="siteSearchItem__body">
              <span className="siteSearchItem__title">{route.title}</span>
              {!compactItems && route.description ? (
                <span className="siteSearchItem__desc">{route.description}</span>
              ) : null}
            </span>
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
  fieldClassName,
}: SiteSearchCommandProps) {
  const results = useMemo(() => filterSiteSearchRoutes(query), [query]);
  const trimmed = query.trim();
  const showResults = showList && (emptyStateMode === "default" || trimmed.length > 0);

  return (
    <Command
      className={className ?? "siteSearchPanel"}
      shouldFilter={false}
      value={query}
      onValueChange={onQueryChange}
    >
      {showInput ? (
        <div className={fieldClassName ?? "siteSearchPanel__field"}>
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
