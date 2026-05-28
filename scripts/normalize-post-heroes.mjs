/**
 * Normalize Keystatic post hero assets under src/assets/images/posts/.
 * Converts PNG/JPEG to WebP (max width 1920, no upscale) and recompresses large WebPs.
 *
 *   node scripts/normalize-post-heroes.mjs
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/assets/images/posts");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;
const RECOMPRESS_WEBP_BYTES = 500_000;

async function toWebp(inputPath, outputPath) {
  const pipeline = sharp(inputPath).rotate().resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  });
  const info = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(outputPath);
  return info.size;
}

const entries = await readdir(dir, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile()) continue;
  const name = entry.name;
  const inputPath = join(dir, name);
  const lower = name.toLowerCase();

  if (/\.(png|jpe?g)$/.test(lower)) {
    const webpName = name.replace(/\.(png|jpe?g)$/i, ".webp");
    const outputPath = join(dir, webpName);
    const size = await toWebp(inputPath, outputPath);
    await unlink(inputPath);
    console.log(`converted ${name} -> ${webpName} (${size} bytes)`);
    continue;
  }

  if (lower.endsWith(".webp")) {
    const { size: before } = await stat(inputPath);
    if (before <= RECOMPRESS_WEBP_BYTES) {
      console.log(`skip ${name} (${before} bytes)`);
      continue;
    }
    const tmp = join(dir, `.${name}.tmp`);
    const after = await toWebp(inputPath, tmp);
    await unlink(inputPath);
    const { rename } = await import("node:fs/promises");
    await rename(tmp, inputPath);
    console.log(`recompressed ${name}: ${before} -> ${after} bytes`);
  }
}

console.log("done");
