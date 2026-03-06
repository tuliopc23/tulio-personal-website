import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const readBuiltHtml = (...parts: string[]) => readFileSync(join(distDir, ...parts), "utf8");
const firstArticleDir = readdirSync(join(distDir, "blog"), { withFileTypes: true }).find(
  (entry) => entry.isDirectory() && entry.name !== "category",
)?.name;

describe("shared layout smoke", () => {
  test("blog index uses the compact developer-journal sidebar header", () => {
    const html = readBuiltHtml("blog", "index.html");
    expect(html).toMatch(/<h2 class="sidebar__title">\s*Developer journal\s*<\/h2>/);
    expect(html).toContain("Build notes, essays, release logs.");
    expect(html).not.toContain("sidebar__eyebrow");
    expect(html).toMatch(/<a[^>]*href="\/blog\/"[^>]*aria-current="page"/);
  });

  test("projects page exposes the updated dev-centric copy and active nav state", () => {
    const html = readBuiltHtml("projects", "index.html");
    expect(html).toContain("Apps, tooling, case studies.");
    expect(html).toMatch(/<a[^>]*href="\/projects"[^>]*aria-current="page"/);
  });

  test("contact page marks the sidebar link as current", () => {
    const html = readBuiltHtml("contact", "index.html");
    expect(html).toContain("Project inquiry and links.");
    expect(html).toMatch(/<a[^>]*href="\/contact"[^>]*aria-current="page"/);
  });

  test("article routes keep the reading-mode treatment", () => {
    if (!firstArticleDir) throw new Error("Expected at least one built blog article in dist/blog");
    const html = readBuiltHtml("blog", firstArticleDir, "index.html");
    expect(html).toContain("Engineering notes · reading mode");
    expect(html).toContain("Tooling, systems, interfaces.");
    expect(html).toMatch(/<a[^>]*href="\/blog\/"[^>]*aria-current="page"/);
  });
});