import {
  markdownToPlainText,
  parseMarkdownDocument,
  renderMarkdownAlerts,
} from "../../src/lib/markdown";

describe("parseMarkdownDocument", () => {
  test("parses frontmatter values and body", () => {
    const document = parseMarkdownDocument(`---
title: "Hello"
published: true
tags: ["astro", 'testing']
---

Body copy`);

    expect(document.frontmatter).toEqual({
      title: "Hello",
      published: true,
      tags: ["astro", "testing"],
    });
    expect(document.body).toBe("Body copy");
  });

  test("returns plain body when frontmatter is missing", () => {
    expect(parseMarkdownDocument("Just content")).toEqual({
      body: "Just content",
      frontmatter: {},
    });
  });
});

describe("markdownToPlainText", () => {
  test("strips markdown syntax into readable text", () => {
    const plainText = markdownToPlainText(
      [
        "---",
        "title: Example",
        "---",
        "",
        "# Heading",
        "",
        "> quoted",
        "",
        "Text with [link](https://example.com) and ![image](img.png).",
        "",
        "Use `inline code` too.",
      ].join("\n")
    );

    expect(plainText).toContain("Heading");
    expect(plainText).toContain("quoted");
    expect(plainText).toContain("Text with link and image");
    expect(plainText).toContain("inline code");
    expect(plainText).not.toContain("[");
  });
});

describe("renderMarkdownAlerts", () => {
  test("wraps github-style alerts in asides", () => {
    const rendered = renderMarkdownAlerts(`Intro
> [!WARNING]
> Be careful here.

Tail`);

    expect(rendered).toContain('<aside class="markdown-alert markdown-alert--warning">');
    expect(rendered).toContain('<p class="markdown-alert__title">Warning</p>');
    expect(rendered).toContain("Be careful here.");
  });
});
