export type MobileTabId = "home" | "blog" | "cases" | "about";

export type MobileTabLink = {
  id: MobileTabId;
  href: string;
  label: string;
  icon: "house" | "notebook" | "briefcase" | "sparkle";
  match: (pathname: string) => boolean;
};

export const mobileTabLinks: readonly MobileTabLink[] = [
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

export function normalizeMobilePathname(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function getActiveMobileTabId(pathname: string): MobileTabId {
  const normalized = normalizeMobilePathname(pathname);
  const active = mobileTabLinks.find((link) => link.match(normalized));
  return active?.id ?? "home";
}
