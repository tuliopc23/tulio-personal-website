/**
 * Canonical public profile URLs — single source of truth for rel="me",
 * footer, profile card, JSON-LD sameAs, and structured data.
 */
export const SITE_GITHUB_PROFILE_URL = "https://github.com/tuliopc23";
export const SITE_LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/tuliopinheirocunha/";
export const SITE_INSTAGRAM_PROFILE_URL = "https://www.instagram.com/tuliopinheirocunha/";

/** Typical sameAs list for Blog / Person schema. */
export const SITE_SAME_AS_URLS: readonly string[] = [
  SITE_GITHUB_PROFILE_URL,
  SITE_LINKEDIN_PROFILE_URL,
  SITE_INSTAGRAM_PROFILE_URL,
];
