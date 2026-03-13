import type { SanityImageSource } from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";

import { config } from "./client";

const builder = createImageUrlBuilder(config);
const CLOUDFLARE_IMAGE_BASE = (import.meta.env.PUBLIC_CLOUDFLARE_IMAGE_BASE ?? "").replace(
  /\/$/,
  "",
);

type CloudflareImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  sharpen?: number;
  fit?: "cover" | "contain" | "scale-down" | "crop" | "pad";
};

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

function mapSanityFit(fit: CloudflareImageOptions["fit"]): string | null {
  switch (fit) {
    case "cover":
      return "crop";
    case "contain":
      return "fillmax";
    case "crop":
      return "crop";
    case "pad":
      return "fill";
    default:
      return "max";
  }
}

function buildSourceUrl(
  source: SanityImageSource,
  {
    width,
    height,
    quality = 85,
    fit = "scale-down",
  }: Pick<CloudflareImageOptions, "width" | "height" | "quality" | "fit"> = {},
): string {
  if (typeof source === "string") {
    const directUrl = new URL(source);
    directUrl.searchParams.set("auto", "format");
    directUrl.searchParams.set("q", String(Math.max(30, Math.min(quality, 100))));

    if (width && width > 0) {
      directUrl.searchParams.set("w", String(Math.round(width)));
    }

    if (height && height > 0) {
      directUrl.searchParams.set("h", String(Math.round(height)));
    }

    const sanityFit = mapSanityFit(fit);
    if (sanityFit) {
      directUrl.searchParams.set("fit", sanityFit);
    }

    return directUrl.toString();
  }

  let imageBuilder = urlFor(source).auto("format").quality(quality);

  if (width) {
    imageBuilder = imageBuilder.width(width);
  }

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  const sanityFit = mapSanityFit(fit);
  if (sanityFit) {
    imageBuilder = imageBuilder.fit(sanityFit as "crop" | "fill" | "fillmax" | "max");
  }

  return imageBuilder.url();
}

export function cloudflareImageUrl(
  sourceUrl: string,
  { width, height, quality = 86, sharpen = 1, fit = "scale-down" }: CloudflareImageOptions = {},
): string {
  if (!sourceUrl) {
    return sourceUrl;
  }

  if (!CLOUDFLARE_IMAGE_BASE) {
    return sourceUrl;
  }

  const params = [
    "format=auto",
    `quality=${Math.max(30, Math.min(quality, 100))}`,
    `sharpen=${Math.max(0, Math.min(sharpen, 10))}`,
    `fit=${fit}`,
  ];

  if (width && width > 0) {
    params.push(`width=${Math.round(width)}`);
  }

  if (height && height > 0) {
    params.push(`height=${Math.round(height)}`);
  }

  const path = `/cdn-cgi/image/${params.join(",")}/${encodeURI(sourceUrl)}`;
  return CLOUDFLARE_IMAGE_BASE ? `${CLOUDFLARE_IMAGE_BASE}${path}` : path;
}

/**
 * Generate responsive image srcset for Sanity images
 * @param source - Sanity image reference
 * @param widths - Array of widths to generate (default: [320, 640, 768, 1024, 1280, 1920])
 * @returns Srcset string for responsive images
 */
export function generateSrcset(
  source: SanityImageSource,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
): string {
  return widths
    .map(
      (width) =>
        `${cloudflareImageUrl(buildSourceUrl(source, { width, quality: 86, fit: "scale-down" }), {
          width,
          quality: 86,
          sharpen: 1,
          fit: "scale-down",
        })} ${width}w`,
    )
    .join(", ");
}

/**
 * Generate optimized image URL with default parameters
 * @param source - Sanity image reference
 * @param width - Target width (optional)
 * @param height - Target height (optional)
 * @returns Optimized image URL
 */
export function optimizedImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
  options: Pick<CloudflareImageOptions, "quality" | "sharpen" | "fit"> = {},
): string {
  const resolvedUrl = buildSourceUrl(source, {
    width,
    height,
    quality: options.quality ?? 85,
    fit: options.fit ?? "scale-down",
  });

  return cloudflareImageUrl(resolvedUrl, {
    width,
    height,
    quality: options.quality ?? 86,
    sharpen: options.sharpen ?? 1,
    fit: options.fit ?? "scale-down",
  });
}

/**
 * Get image dimensions from Sanity image asset
 * @param source - Sanity image reference with asset metadata
 * @returns Object with width and height
 */
export function getImageDimensions(source: {
  asset?: { metadata?: { dimensions?: { width?: number; height?: number } } };
}): { width?: number; height?: number } {
  return {
    width: source.asset?.metadata?.dimensions?.width,
    height: source.asset?.metadata?.dimensions?.height,
  };
}
