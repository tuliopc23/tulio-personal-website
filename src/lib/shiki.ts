import { codeToHtml } from "shiki";

/**
 * Highlight code with Shiki using custom themes
 * Supports both light and dark themes with automatic switching
 */
export async function highlightCode(
  code: string,
  lang: string = "plaintext"
): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });

    return html;
  } catch {
    // If language is not recognized, fall back to plaintext
    console.warn(`Shiki: Unknown language "${lang}", falling back to plaintext`);
    return codeToHtml(code, {
      lang: "plaintext",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });
  }
}

/**
 * Parse line highlighting syntax like "1,3-5,8"
 */
export function parseLineHighlights(input?: string): number[] {
  if (!input) return [];

  const lines: number[] = [];
  const parts = input.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        lines.push(i);
      }
    } else {
      lines.push(Number(trimmed));
    }
  }

  return lines;
}
