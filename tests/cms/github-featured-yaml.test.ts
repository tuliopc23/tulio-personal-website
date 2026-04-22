import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vite-plus/test";

describe("Featured GitHub YAML (feeds /api/github.json)", () => {
  test("curated repos parse and at least one featured entry is eligible for the API merge", async () => {
    const { featuredReposFromSiteYaml } = await import("../../src/server/github-json");
    const raw = readFileSync(
      join(process.cwd(), "src/content/site/featured-github/index.yaml"),
      "utf8",
    );
    const curated = featuredReposFromSiteYaml(raw);
    expect(curated.length).toBeGreaterThan(0);
    expect(curated.every((r) => r.repoFullName.includes("/"))).toBe(true);
  });
});
