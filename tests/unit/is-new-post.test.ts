import { describe, expect, test } from "vitest";

import { isNewPublishedAt, POST_NEW_BADGE_MS } from "../../src/lib/is-new-post";

describe("isNewPublishedAt", () => {
  test("is true within the badge window after publish", () => {
    const published = new Date("2026-04-10T12:00:00.000Z").getTime();
    const now = published + POST_NEW_BADGE_MS - 60_000;
    expect(isNewPublishedAt("2026-04-10T12:00:00.000Z", now)).toBe(true);
  });

  test("is false once older than the badge window", () => {
    const published = new Date("2026-04-01T12:00:00.000Z").getTime();
    const now = published + POST_NEW_BADGE_MS + 60_000;
    expect(isNewPublishedAt("2026-04-01T12:00:00.000Z", now)).toBe(false);
  });

  test("is false for invalid dates", () => {
    expect(isNewPublishedAt("not-a-date", Date.now())).toBe(false);
  });

  test("is false for future publish dates", () => {
    const now = Date.now();
    const future = new Date(now + 86_400_000).toISOString();
    expect(isNewPublishedAt(future, now)).toBe(false);
  });
});
