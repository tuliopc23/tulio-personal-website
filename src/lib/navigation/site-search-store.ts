type SiteSearchListener = (open: boolean) => void;

const listeners = new Set<SiteSearchListener>();
let searchOpen = false;

export function getSiteSearchOpen(): boolean {
  return searchOpen;
}

export function setSiteSearchOpen(open: boolean): void {
  if (searchOpen === open) {
    return;
  }
  searchOpen = open;
  document.body.classList.toggle("is-search-open", open);
  listeners.forEach((listener) => listener(searchOpen));
}

export function subscribeSiteSearch(listener: SiteSearchListener): () => void {
  listeners.add(listener);
  listener(searchOpen);
  return () => listeners.delete(listener);
}

export function toggleSiteSearch(): void {
  setSiteSearchOpen(!searchOpen);
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
