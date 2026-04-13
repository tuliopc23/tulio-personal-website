/** Listing “new” badge window (matches prior inline 7-day checks). */
export const POST_NEW_BADGE_MS = 7 * 24 * 60 * 60 * 1000;

export function isNewPublishedAt(publishedAtIso: string, nowMs = Date.now()): boolean {
  const t = new Date(publishedAtIso).getTime();
  if (Number.isNaN(t)) return false;
  const age = nowMs - t;
  return age >= 0 && age < POST_NEW_BADGE_MS;
}
