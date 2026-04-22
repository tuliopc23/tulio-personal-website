/**
 * Validates Keystatic-backed files on disk against the same Zod schemas as Astro collections.
 * Used by CI tests so bad edits fail before merge/deploy.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { parse as parseYaml } from "yaml";

import { z } from "astro/zod";

import {
  aboutPageSingletonSchema,
  blogPageSingletonSchema,
  featuredGithubSingletonSchema,
  postSchema,
  projectsPageSingletonSchema,
  projectSchema,
  taxonomySchema,
} from "./content-schemas";
import { parseMdxYamlFrontmatter } from "./mdx-frontmatter";

export interface CmsValidationIssue {
  /** Repo-relative POSIX path for readable CI output */
  path: string;
  message: string;
}

function toPosixPath(absPath: string, cwd: string): string {
  return relative(cwd, absPath).split("\\").join("/");
}

function* walkFilesRecursive(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFilesRecursive(full);
    else yield full;
  }
}

function collectTaxonomySlugs(absBase: string): Set<string> {
  const slugs = new Set<string>();
  if (!existsSync(absBase)) return slugs;
  for (const full of walkFilesRecursive(absBase)) {
    if (!full.endsWith("index.yaml")) continue;
    try {
      const raw = readFileSync(full, "utf8");
      const doc = parseYaml(raw) as { slug?: string };
      if (typeof doc.slug === "string" && doc.slug.trim()) slugs.add(doc.slug.trim());
    } catch {
      /* handled elsewhere */
    }
  }
  return slugs;
}

/** Fixed taxonomy roots — must match `src/content.config.ts` loader bases. */
function taxonomyRoots(cwd: string): { categories: string; topics: string; series: string } {
  return {
    categories: join(cwd, "src/content/taxonomy/categories"),
    topics: join(cwd, "src/content/taxonomy/topics"),
    series: join(cwd, "src/content/taxonomy/series"),
  };
}

export function validateAllCmsContent(cwd = process.cwd()): CmsValidationIssue[] {
  const issues: CmsValidationIssue[] = [];

  const postsBase = join(cwd, "src/content/posts");
  const projectsBase = join(cwd, "src/content/projects");
  const tax = taxonomyRoots(cwd);

  const categorySlugs = collectTaxonomySlugs(tax.categories);
  const topicSlugs = collectTaxonomySlugs(tax.topics);
  const seriesSlugs = collectTaxonomySlugs(tax.series);

  if (existsSync(postsBase)) {
    for (const full of walkFilesRecursive(postsBase)) {
      if (!full.endsWith("index.mdx")) continue;
      const rel = toPosixPath(full, cwd);
      let raw: string;
      try {
        raw = readFileSync(full, "utf8");
      } catch (err) {
        issues.push({ path: rel, message: `Cannot read file: ${String(err)}` });
        continue;
      }

      const data = parseMdxYamlFrontmatter(raw);
      if (!data) {
        issues.push({
          path: rel,
          message: "Missing or invalid YAML frontmatter between --- fences",
        });
        continue;
      }

      const parsed = postSchema.safeParse(data);
      if (!parsed.success) {
        issues.push({
          path: rel,
          message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
        });
        continue;
      }

      const post = parsed.data;
      const folderSlug = basename(dirname(full));
      if (post.slug !== folderSlug) {
        issues.push({
          path: rel,
          message: `Frontmatter slug "${post.slug}" must match folder name "${folderSlug}"`,
        });
      }

      for (const s of post.categorySlugs ?? []) {
        if (!categorySlugs.has(s)) {
          issues.push({
            path: rel,
            message: `Unknown category slug "${s}" — no taxonomy/categories/**/index.yaml with slug "${s}"`,
          });
        }
      }
      for (const s of post.topicSlugs ?? []) {
        if (!topicSlugs.has(s)) {
          issues.push({
            path: rel,
            message: `Unknown topic slug "${s}" — no taxonomy/topics/**/index.yaml with slug "${s}"`,
          });
        }
      }
      for (const s of post.seriesSlugs ?? []) {
        if (!seriesSlugs.has(s)) {
          issues.push({
            path: rel,
            message: `Unknown series slug "${s}" — no taxonomy/series/**/index.yaml with slug "${s}"`,
          });
        }
      }
    }
  }

  if (existsSync(projectsBase)) {
    for (const full of walkFilesRecursive(projectsBase)) {
      if (!full.endsWith("index.yaml")) continue;
      const rel = toPosixPath(full, cwd);
      let raw: string;
      try {
        raw = readFileSync(full, "utf8");
      } catch (err) {
        issues.push({ path: rel, message: `Cannot read file: ${String(err)}` });
        continue;
      }

      let data: unknown;
      try {
        data = parseYaml(raw);
      } catch (err) {
        issues.push({ path: rel, message: `Invalid YAML: ${String(err)}` });
        continue;
      }

      const parsed = projectSchema.safeParse(data);
      if (!parsed.success) {
        issues.push({
          path: rel,
          message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
        });
      }
    }
  }

  for (const [kind, absBase] of Object.entries(tax) as Array<[string, string]>) {
    if (!existsSync(absBase)) continue;
    for (const full of walkFilesRecursive(absBase)) {
      if (!full.endsWith("index.yaml")) continue;
      const rel = toPosixPath(full, cwd);
      let raw: string;
      try {
        raw = readFileSync(full, "utf8");
      } catch (err) {
        issues.push({ path: rel, message: `Cannot read file: ${String(err)}` });
        continue;
      }

      let data: unknown;
      try {
        data = parseYaml(raw);
      } catch (err) {
        issues.push({ path: rel, message: `Invalid YAML: ${String(err)}` });
        continue;
      }

      const parsed = taxonomySchema.safeParse(data);
      if (!parsed.success) {
        issues.push({
          path: rel,
          message: `[taxonomy ${kind}] ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
        });
      } else {
        const folder = basename(dirname(full));
        if (parsed.data.slug !== folder) {
          issues.push({
            path: rel,
            message: `Taxonomy slug "${parsed.data.slug}" must match folder name "${folder}"`,
          });
        }
      }
    }
  }

  const singletons: Array<{ rel: string; schema: z.ZodTypeAny }> = [
    { rel: "src/content/site/blog-page/index.yaml", schema: blogPageSingletonSchema },
    { rel: "src/content/site/about-page/index.yaml", schema: aboutPageSingletonSchema },
    { rel: "src/content/site/projects-page/index.yaml", schema: projectsPageSingletonSchema },
    { rel: "src/content/site/featured-github/index.yaml", schema: featuredGithubSingletonSchema },
  ];

  for (const { rel, schema } of singletons) {
    const abs = join(cwd, rel);
    if (!existsSync(abs)) {
      issues.push({
        path: rel,
        message: "Missing singleton file required for site + /api/github.json curation",
      });
      continue;
    }
    let raw: string;
    try {
      raw = readFileSync(abs, "utf8");
    } catch (err) {
      issues.push({ path: rel, message: `Cannot read file: ${String(err)}` });
      continue;
    }

    let data: unknown;
    try {
      data = parseYaml(raw);
    } catch (err) {
      issues.push({ path: rel, message: `Invalid YAML: ${String(err)}` });
      continue;
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      issues.push({
        path: rel,
        message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      });
    }
  }

  return issues;
}
