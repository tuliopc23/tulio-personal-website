type SiteSearchListener = (open: boolean) => void;

type SiteSearchStoreState = {
  open: boolean;
  listeners: Set<SiteSearchListener>;
};

const STORE = Symbol.for("tulio.site-search-store");

function storeState(): SiteSearchStoreState {
  const root = globalThis as typeof globalThis & {
    [key: symbol]: SiteSearchStoreState | undefined;
  };

  if (!root[STORE]) {
    root[STORE] = { open: false, listeners: new Set() };
  }

  return root[STORE];
}

export function getSiteSearchOpen(): boolean {
  return storeState().open;
}

export function setSiteSearchOpen(open: boolean): void {
  const state = storeState();
  if (state.open === open) {
    return;
  }

  state.open = open;
  document.body?.classList.toggle("is-search-open", open);
  state.listeners.forEach((listener) => listener(state.open));
}

export function subscribeSiteSearch(listener: SiteSearchListener): () => void {
  const state = storeState();
  state.listeners.add(listener);
  listener(state.open);
  return () => state.listeners.delete(listener);
}

export function toggleSiteSearch(): void {
  setSiteSearchOpen(!getSiteSearchOpen());
}

declare global {
  interface Window {
    __siteSearch?: {
      open: () => void;
      close: () => void;
      toggle: () => void;
      isOpen: () => boolean;
    };
  }
}

export function registerSiteSearchApi(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.__siteSearch = {
    open: () => setSiteSearchOpen(true),
    close: () => setSiteSearchOpen(false),
    toggle: toggleSiteSearch,
    isOpen: getSiteSearchOpen,
  };
}
