import { parse as parseYaml } from "yaml";

/** First MDX frontmatter fence only (same convention as Astro MDX loader). */
export function parseMdxYamlFrontmatter(source: string): Record<string, unknown> | null {
  const trimmed = source.replace(/^\uFEFF/, "").trimStart();
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\s|$|\r?\n)/);
  if (!match?.[1]) return null;
  try {
    return parseYaml(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}
