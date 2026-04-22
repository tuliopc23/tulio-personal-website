import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vite-plus/test";

import { parseMdxYamlFrontmatter } from "../../src/cms/mdx-frontmatter";

function firstPostIndexMdx(): string | null {
  const base = join(process.cwd(), "src/content/posts");
  if (!existsSync(base)) return null;
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = join(base, entry.name, "index.mdx");
    if (existsSync(file)) return file;
  }
  return null;
}

describe("MDX frontmatter parsing (matches Astro fence convention)", () => {
  test("parses the first on-disk post", () => {
    const file = firstPostIndexMdx();
    expect(file, "expected at least one src/content/posts/*/index.mdx").not.toBeNull();
    const raw = readFileSync(file!, "utf8");
    const data = parseMdxYamlFrontmatter(raw);
    expect(data?.slug).toBeTruthy();
    expect(data?.title).toBeTruthy();
  });
});
