import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function ensureArray(obj, key) {
  if (!Array.isArray(obj[key])) obj[key] = [];
}

function ensureString(obj, key, fallback = "") {
  if (obj[key] == null) obj[key] = fallback;
}

function ensureBool(obj, key, fallback = false) {
  if (typeof obj[key] !== "boolean") obj[key] = fallback;
}

function ensureObject(obj, key, fallbackObj) {
  if (!isObject(obj[key])) obj[key] = fallbackObj;
}

function parseFrontmatter(mdx) {
  if (!mdx.startsWith("---\n")) return { data: {}, body: mdx };
  const end = mdx.indexOf("\n---\n", 4);
  if (end === -1) return { data: {}, body: mdx };
  const raw = mdx.slice(4, end);
  const body = mdx.slice(end + "\n---\n".length);
  const data = YAML.parse(raw) ?? {};
  return { data, body };
}

function stringifyFrontmatter(data) {
  // Keep it readable + stable.
  return YAML.stringify(data, { lineWidth: 90 }).trimEnd();
}

function normalizePostFrontmatter(data, slugFromDir) {
  if (!isObject(data)) data = {};

  // Required basics
  ensureString(data, "title", slugFromDir);
  ensureString(data, "slug", slugFromDir);
  ensureString(data, "publishedAt", new Date().toISOString());
  ensureString(data, "summary", "");

  // Common optionals (match your Zod schema defaults)
  ensureArray(data, "tags");
  ensureBool(data, "featured", false);
  ensureString(data, "coverVariant", "default");
  ensureArray(data, "categorySlugs");
  ensureArray(data, "topicSlugs");
  ensureArray(data, "seriesSlugs");

  // Content blocks
  ensureArray(data, "keyTakeaways");
  ensureArray(data, "pullQuotes");
  ensureArray(data, "furtherReading");
  ensureArray(data, "sourceReferences");

  // Author defaults (Keystatic defaults too, but we persist for stability)
  ensureString(data, "authorName", "Tulio Cunha");
  ensureString(data, "authorSlug", "tulio-cunha");
  ensureString(data, "authorRole", data.authorRole ?? "");

  // Hero image fields (kept optional)
  if (data.heroImage == null) data.heroImage = null;
  ensureString(data, "heroAlt", data.heroAlt ?? "");
  ensureString(data, "heroCaption", data.heroCaption ?? "");

  // SEO fields (your schema allows empty canonical)
  ensureString(data, "seoMetaTitle", data.title ?? slugFromDir);
  ensureString(data, "seoMetaDescription", data.summary ?? "");
  ensureString(data, "seoCanonicalUrl", data.seoCanonicalUrl ?? "");
  ensureBool(data, "seoNoIndex", false);
  ensureString(data, "seoJsonLd", data.seoJsonLd ?? "");

  // Nested object
  ensureObject(data, "distributionPackage", {
    newsletterBlurb: "",
    shortSocialPost: "",
    longSocialPost: "",
    teaserQuote: "",
    ctaLabel: "",
  });

  // Optional editorial fields
  ensureString(data, "audience", data.audience ?? "");
  ensureString(data, "intent", data.intent ?? "");
  ensureString(data, "targetKeyword", data.targetKeyword ?? "");
  ensureString(data, "evergreenStatus", data.evergreenStatus ?? "");
  ensureString(data, "series", data.series ?? "");

  return data;
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  if (slugs.length === 0) {
    console.error(`No post directories found at ${POSTS_DIR}`);
    process.exit(1);
  }

  let changed = 0;

  for (const slug of slugs) {
    const file = path.join(POSTS_DIR, slug, "index.mdx");
    let mdx;
    try {
      mdx = await fs.readFile(file, "utf8");
    } catch {
      console.warn(`Skipping missing ${file}`);
      continue;
    }

    const { data: original, body } = parseFrontmatter(mdx);
    const normalized = normalizePostFrontmatter(original, slug);

    const out = `---\n${stringifyFrontmatter(normalized)}\n---\n${body.replace(/^\n+/, "\n")}`;
    if (out !== mdx) {
      await fs.writeFile(file, out, "utf8");
      changed++;
    }
  }

  console.log(`Seeded/normalized ${slugs.length} posts. Updated files: ${changed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
