/**
 * Optimize repo-root image.png → WebP hero + OG crop, write to public/, upload to Sanity,
 * and patch post-apple-dev-tooling-april-2026 hero + social images.
 *
 * Run from repo root: node scripts/update-apple-dx-post-hero.mjs
 * Requires: image.png at repo root, SANITY_API_WRITE_TOKEN, sharp.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const POST_ID = "post-apple-dev-tooling-april-2026";
const INPUT = path.join(ROOT, "image.png");
const OUT_DIR = path.join(ROOT, "public/images/blog");
const HERO_REL = "images/blog/apple-dev-tooling-hero.webp";
const OG_REL = "images/blog/apple-dev-tooling-og.webp";

const HERO_ALT =
  "Illustration of a messy developer desk: laptop showing Build Failed, cracked Xcode icon with a hammer, spilled coffee, Swift and SwiftUI logos, error banners, and the spinning wait cursor.";
const OG_ALT =
  "Open graph image: stylized developer desk chaos with Build Failed on screen and cracked Xcode icon.";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  token,
  useCdn: false,
});

const webp = {
  quality: 86,
  effort: 6,
  smartSubsample: true,
};

async function main() {
  const pipeline = sharp(INPUT).rotate();

  const meta = await pipeline.metadata();
  console.log("Source:", INPUT, meta.width, "×", meta.height, meta.format);

  mkdirSync(OUT_DIR, { recursive: true });

  const heroPath = path.join(ROOT, "public", HERO_REL);
  const ogPath = path.join(ROOT, "public", OG_REL);

  const heroBuf = await sharp(INPUT)
    .rotate()
    .resize(1920, 1280, {
      fit: "cover",
      position: "attention",
      kernel: sharp.kernel.lanczos3,
    })
    .webp(webp)
    .toBuffer();

  const ogBuf = await sharp(INPUT)
    .rotate()
    .resize(1200, 630, {
      fit: "cover",
      position: "attention",
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ ...webp, quality: 84 })
    .toBuffer();

  writeFileSync(heroPath, heroBuf);
  writeFileSync(ogPath, ogBuf);

  console.log("Wrote", HERO_REL, `(${(heroBuf.length / 1024).toFixed(1)} KB)`);
  console.log("Wrote", OG_REL, `(${(ogBuf.length / 1024).toFixed(1)} KB)`);

  const heroAsset = await client.assets.upload("image", heroBuf, {
    filename: "apple-dev-tooling-hero.webp",
    contentType: "image/webp",
  });
  const ogAsset = await client.assets.upload("image", ogBuf, {
    filename: "apple-dev-tooling-og.webp",
    contentType: "image/webp",
  });

  const doc = await client.getDocument(POST_ID);
  if (!doc || doc._type !== "post") {
    console.error("Post not found:", POST_ID);
    process.exit(1);
  }

  const seo = { ...doc.seo, _type: "seo" };

  await client
    .patch(POST_ID)
    .set({
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: heroAsset._id },
        alt: HERO_ALT,
      },
      seo: {
        ...seo,
        socialImage: {
          _type: "image",
          asset: { _type: "reference", _ref: ogAsset._id },
          alt: OG_ALT,
        },
      },
    })
    .commit();

  console.log("Sanity post patched:", POST_ID);
  console.log("Hero asset:", heroAsset._id);
  console.log("OG asset:", ogAsset._id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
