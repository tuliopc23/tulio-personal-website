export interface ParsedMarkdownDocument {
  body: string;
  frontmatter: Record<string, string | boolean | string[]>;
}

function parseFrontmatterValue(value: string): string | boolean | string[] {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  return trimmed.replace(/^['"]|['"]$/g, "");
}

export function parseMarkdownDocument(content?: string | null): ParsedMarkdownDocument {
  const source = content?.replace(/\r\n/g, "\n") ?? "";

  if (!source.startsWith("---\n")) {
    return {
      body: source,
      frontmatter: {},
    };
  }

  const frontmatterEnd = source.indexOf("\n---\n", 4);

  if (frontmatterEnd === -1) {
    return {
      body: source,
      frontmatter: {},
    };
  }

  const rawFrontmatter = source.slice(4, frontmatterEnd).trim();
  const body = source.slice(frontmatterEnd + 5).trimStart();
  const frontmatter = Object.fromEntries(
    rawFrontmatter
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");

        if (separatorIndex === -1) {
          return [line, ""];
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = parseFrontmatterValue(line.slice(separatorIndex + 1));
        return [key, value];
      }),
  );

  return {
    body,
    frontmatter,
  };
}

export function markdownToPlainText(content?: string | null): string {
  const { body } = parseMarkdownDocument(content);

  return body
    .replace(/^```[\s\S]*?^```$/gm, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, " $1 ")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~#=-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderMarkdownAlerts(content: string): string {
  return content.replace(
    /(^|\n)(> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][\s\S]*?)(?=\n(?!> )|\n*$)/g,
    (_match, prefix: string, block: string, kind: string) => {
      const lines = block.split("\n").map((line) => line.replace(/^> ?/, ""));
      const [, ...bodyLines] = lines;
      const body = bodyLines.join("\n").trim();
      const variant = kind.toLowerCase();
      const title = kind.charAt(0) + kind.slice(1).toLowerCase();

      return `${prefix}<aside class="markdown-alert markdown-alert--${variant}"><p class="markdown-alert__title">${title}</p>\n\n${body}\n\n</aside>`;
    },
  );
}
