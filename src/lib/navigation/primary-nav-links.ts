/** Shared primary site routes for topbar, drawer navigation, and search. */

export type PrimaryNavId = "home" | "blog" | "cases" | "about";

export type PrimaryNavLink = {
  id: PrimaryNavId;
  href: string;
  label: string;
  icon: "house" | "notebook" | "briefcase" | "sparkle";
  match: (pathname: string) => boolean;
};

export const primaryNavLinks: readonly PrimaryNavLink[] = [
  {
    id: "home",
    href: "/",
    label: "Home",
    icon: "house",
    match: (pathname) => pathname === "/",
  },
  {
    id: "blog",
    href: "/blog/",
    label: "Blog",
    icon: "notebook",
    match: (pathname) => pathname === "/blog" || pathname.startsWith("/blog/"),
  },
  {
    id: "cases",
    href: "/projects/",
    label: "Cases",
    icon: "briefcase",
    match: (pathname) => pathname === "/projects" || pathname.startsWith("/projects/"),
  },
  {
    id: "about",
    href: "/about/",
    label: "About",
    icon: "sparkle",
    match: (pathname) => pathname === "/about" || pathname.startsWith("/about/"),
  },
] as const;

export function normalizePathname(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function getActivePrimaryNavId(pathname: string): PrimaryNavId {
  const normalized = normalizePathname(pathname);
  const active = primaryNavLinks.find((link) => link.match(normalized));
  return active?.id ?? "home";
}

export function isPrimaryNavActive(pathname: string, id: PrimaryNavId): boolean {
  return getActivePrimaryNavId(pathname) === id;
}
