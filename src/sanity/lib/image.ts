import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { config } from "./client";

const builder = imageUrlBuilder(config);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Generate responsive image srcset for Sanity images
 * @param source - Sanity image reference
 * @param widths - Array of widths to generate (default: [320, 640, 768, 1024, 1280, 1920])
 * @returns Srcset string for responsive images
 */
export function generateSrcset(
  source: SanityImageSource,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map(
      (width) =>
        `${urlFor(source).width(width).auto("format").quality(80).url()} ${width}w`
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
  height?: number
): string {
  let imageBuilder = urlFor(source).auto("format").quality(80);

  if (width) {
    imageBuilder = imageBuilder.width(width);
  }

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  return imageBuilder.url();
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
