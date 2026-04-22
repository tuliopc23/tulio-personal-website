import { markdownToPlainText } from "./markdown";

/** Shared by content loaders so unit tests do not depend on `astro:content`. */
export function calculateReadingTimeMinutes(markdownContent?: string | null): number {
  const plainText = markdownToPlainText(markdownContent);
  const words = plainText.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 225));
}
