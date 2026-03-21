import logos from "@iconify-json/logos/icons.json";
import simpleIcons from "@iconify-json/simple-icons/icons.json";
import { getBrandIcon } from "./brand-icons";

type IconifySet = {
  width?: number;
  height?: number;
  icons?: Record<
    string,
    {
      body: string;
      width?: number;
      height?: number;
    }
  >;
};

export type BrandGlyph = {
  body: string;
  width: number;
  height: number;
};

const iconSets: Record<string, IconifySet> = {
  logos: logos as IconifySet,
  "simple-icons": simpleIcons as IconifySet,
};

function resolveGlyph(identifier?: string | null): BrandGlyph | null {
  if (!identifier) return null;

  const [prefix, iconName] = identifier.split(":");
  const set = iconSets[prefix];
  if (!set) return null;

  const glyph = set.icons?.[iconName];
  if (!glyph) return null;

  const width = glyph.width ?? set.width ?? 24;
  const height = glyph.height ?? set.height ?? width;

  return {
    body: glyph.body,
    width,
    height,
  };
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
