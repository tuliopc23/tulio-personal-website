import { describe, expect, test } from "vite-plus/test";

import { validateAllCmsContent } from "../../src/cms/validate-cms-content";

describe("CMS integrity (Keystatic + Astro content)", () => {
  test("on-disk posts, taxonomy, singletons match collection schemas and slug references", () => {
    const issues = validateAllCmsContent();
    expect(
      issues,
      issues.length > 0 ? issues.map((i) => `${i.path}: ${i.message}`).join("\n") : undefined,
    ).toEqual([]);
  });
});
