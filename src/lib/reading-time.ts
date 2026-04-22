import type { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "astro-portabletext";

import { markdownToPlainText } from "./markdown";

/** Shared by content loaders so unit tests do not depend on `astro:content`. */
export function calculateReadingTimeMinutes(
  blocks: PortableTextBlock[],
  markdownContent?: string | null,
): number {
  const plainText =
    Array.isArray(blocks) && blocks.length > 0
      ? toPlainText(blocks)
      : markdownToPlainText(markdownContent);
  const words = plainText.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 225));
}
