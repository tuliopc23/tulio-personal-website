import { describe, expect, test } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const distClient = join(process.cwd(), "dist", "client");
const readBuiltHtml = (...parts: string[]) => readFileSync(join(distClient, ...parts), "utf8");
const blogDir = join(distClient, "blog");
const firstArticleDir = existsSync(blogDir)
  ? readdirSync(blogDir, { withFileTypes: true }).find(
      (entry) =>
        entry.isDirectory() &&
        !["category", "topic", "series"].includes(entry.name) &&
        existsSync(join(blogDir, entry.name, "index.html")),
    )?.name
  : undefined;

describe("shared layout smoke", () => {
  test.skipIf(!existsSync(join(distClient, "blog", "index.html")))(
    "blog index uses the programming-essays sidebar header",
    () => {
      const html = readBuiltHtml("blog", "index.html");
      expect(html).toMatch(/<h2 class="sidebar__title">\s*Programming essays\s*<\/h2>/);
      expect(html).toContain("Writing on what I build and why.");
      expect(html).toContain("sidebar__eyebrow");
      expect(html).toContain(">Menu<");
      expect(html).toMatch(/<a[^>]*href="\/blog\/"[^>]*aria-current="page"/);
    },
  );

  test.skipIf(!existsSync(join(distClient, "projects", "index.html")))(
    "projects page exposes the updated dev-centric copy and active nav state",
    () => {
      const html = readBuiltHtml("projects", "index.html");
      expect(html).toContain("Client work, indie builds, real constraints.");
      expect(html).toMatch(/<a[^>]*href="\/projects\/"[^>]*aria-current="page"/);
    },
  );

  test.skipIf(!existsSync(join(distClient, "contact", "index.html")))(
    "contact page marks the sidebar link as current",
    () => {
      const html = readBuiltHtml("contact", "index.html");
      expect(html).toContain("Reach out. Email preferred.");
      expect(html).toMatch(/<a[^>]*href="\/contact\/"[^>]*aria-current="page"/);
    },
  );

  test("article routes keep the reading-mode treatment", () => {
    if (!firstArticleDir) {
      throw new Error("Expected at least one built blog article in dist/client/blog");
    }
    const html = readBuiltHtml("blog", firstArticleDir, "index.html");
    expect(html).toContain("Dev notes · reader mode");
    expect(html).toContain("Notes on platforms, code, and tools.");
    expect(html).toMatch(/<a[^>]*href="\/blog\/"[^>]*aria-current="page"/);
  });
});
