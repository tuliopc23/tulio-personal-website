/** @deprecated Import from `primary-nav-links` instead. */
export type {
  PrimaryNavId as MobileTabId,
  PrimaryNavLink as MobileTabLink,
} from "./primary-nav-links";
export {
  getActivePrimaryNavId as getActiveMobileTabId,
  normalizePathname as normalizeMobilePathname,
  primaryNavLinks as mobileTabLinks,
} from "./primary-nav-links";
