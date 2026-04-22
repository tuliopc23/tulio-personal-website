/** Image URL helpers (Sanity CDN + optional Cloudflare Images) — string URLs only. */

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

export function applySanityCdnParams(
  sourceUrl: string,
  {
    width,
    height,
    quality = 85,
    fit = "scale-down",
  }: Pick<CloudflareImageOptions, "width" | "height" | "quality" | "fit"> = {},
): string {
  const directUrl = new URL(sourceUrl);
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

export function optimizedImageUrl(
  sourceUrl: string | null | undefined,
  width?: number,
  height?: number,
  options: Pick<CloudflareImageOptions, "quality" | "sharpen" | "fit"> = {},
): string {
  if (!sourceUrl) return "";

  const resolvedUrl = applySanityCdnParams(sourceUrl, {
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

export function generateSrcset(
  sourceUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
  options: Pick<CloudflareImageOptions, "quality" | "sharpen" | "fit"> = {},
): string {
  return widths
    .map(
      (width) =>
        `${cloudflareImageUrl(
          applySanityCdnParams(sourceUrl, {
            width,
            quality: options.quality ?? 86,
            fit: options.fit ?? "scale-down",
          }),
          {
            width,
            quality: options.quality ?? 86,
            sharpen: options.sharpen ?? 1,
            fit: options.fit ?? "scale-down",
          },
        )} ${width}w`,
    )
    .join(", ");
}
