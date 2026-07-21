import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const brandIconsPath = join(root, "src/components/brand-icons.ts");
const logos = JSON.parse(readFileSync(join(root, "node_modules/@iconify-json/logos/icons.json"), "utf8"));
const simpleIcons = JSON.parse(readFileSync(join(root, "node_modules/@iconify-json/simple-icons/icons.json"), "utf8"));

const source = readFileSync(brandIconsPath, "utf8");
const identifiers = new Set(["simple-icons:sparkle"]);
const regex = /(?:icon|fallback):\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(source)) !== null) {
  identifiers.add(m[1]);
}

const sets = {
  logos,
  "simple-icons": simpleIcons,
};

const glyphs = {};
for (const id of identifiers) {
  const [prefix, iconName] = id.split(":");
  const set = sets[prefix];
  if (!set || !set.icons?.[iconName]) {
    console.warn(`Missing icon ${id}`);
    continue;
  }
  const glyph = set.icons[iconName];
  const width = glyph.width ?? set.width ?? 24;
  const height = glyph.height ?? set.height ?? width;
  glyphs[id] = { body: glyph.body, width, height };
}

const out = join(root, "src/components/brand-icon-glyphs.json");
writeFileSync(out, JSON.stringify(glyphs, null, 2), "utf8");
console.log(`Wrote ${Object.keys(glyphs).length} glyphs to ${out}`);
