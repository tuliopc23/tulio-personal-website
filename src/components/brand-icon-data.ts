import glyphs from "./brand-icon-glyphs.json";
import { getBrandIcon } from "./brand-icons";

export type BrandGlyph = {
  body: string;
  width: number;
  height: number;
};

function resolveGlyph(identifier?: string | null): BrandGlyph | null {
  if (!identifier) return null;
  return (glyphs as Record<string, BrandGlyph>)[identifier] ?? null;
}

export function resolveBrandGlyph(name: string): BrandGlyph | null {
  const entry = getBrandIcon(name);

  let resolved: BrandGlyph | null = null;
  if (name === "github" || name === "instagram") {
    resolved = resolveGlyph(entry?.fallback);
  } else {
    resolved = resolveGlyph(entry?.icon);
  }

  return resolved ?? resolveGlyph(entry?.fallback) ?? resolveGlyph("simple-icons:sparkle");
}
