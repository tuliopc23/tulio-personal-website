import { fields } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";
import { createElement as h, type CSSProperties, type ReactElement, type ReactNode } from "react";

const previewSurface: CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "linear-gradient(180deg, rgba(24, 27, 34, 0.96) 0%, rgba(14, 17, 24, 0.98) 100%)",
  boxShadow: "0 20px 48px rgba(6, 10, 20, 0.24)",
  color: "rgba(245,245,247,0.94)",
};

function PreviewFrame(children: ReactNode): ReactElement {
  return h("div", { style: { ...previewSurface, padding: 18 } }, children);
}

function PreviewEyebrow(children: ReactNode): ReactElement {
  return h(
    "div",
    {
      style: {
        marginBottom: 10,
        color: "rgba(102, 194, 255, 0.86)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      },
    },
    children,
  );
}

function PreviewText(children: ReactNode): ReactElement {
  return h(
    "div",
    {
      style: {
        color: "rgba(235, 235, 245, 0.82)",
        fontSize: 14,
        lineHeight: 1.6,
      },
    },
    children,
  );
}

type FigureComponentValue = {
  src: { data: Uint8Array; extension: string; filename: string } | null;
  alt: string;
  caption: string;
};

type NavigationKey =
  | "posts"
  | "taxonomyCategories"
  | "taxonomyTopics"
  | "taxonomySeries"
  | "blogPage"
  | "aboutPage"
  | "projectsPage"
  | "featuredGithub";

function FigurePreview({ value }: { value: FigureComponentValue }): ReactElement {
  const previewUrl =
    value.src && typeof Blob !== "undefined"
      ? URL.createObjectURL(
          new Blob([Uint8Array.from(value.src.data)], { type: `image/${value.src.extension}` }),
        )
      : null;

  const imagePreview = value.src
    ? h("img", {
        src: previewUrl ?? "",
        alt: value.alt || "",
        style: {
          display: "block",
          width: "100%",
          borderRadius: 16,
          aspectRatio: "16 / 10",
          objectFit: "cover",
          background: "rgba(255,255,255,0.06)",
        },
      })
    : h(
        "div",
        {
          style: {
            display: "grid",
            placeItems: "center",
            minHeight: 180,
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(235,235,245,0.58)",
            fontSize: 13,
          },
        },
        "Add a figure image",
      );

  return PreviewFrame([
    imagePreview,
    value.caption
      ? h(
          "p",
          {
            style: {
              margin: "10px 2px 0",
              color: "rgba(235,235,245,0.62)",
              fontSize: 12,
              lineHeight: 1.5,
            },
          },
          value.caption,
        )
      : null,
  ]);
}

export function KeystaticBrandMark({
  colorScheme,
}: {
  colorScheme: "light" | "dark";
}): ReactElement {
  const image = colorScheme === "light" ? "/brand-icon-light.png" : "/brand-icon-dark.png";
  const shellStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 12,
    border:
      colorScheme === "light" ? "1px solid rgba(34,48,88,0.12)" : "1px solid rgba(255,255,255,0.1)",
    background:
      colorScheme === "light"
        ? "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(242,245,252,0.92) 100%)"
        : "linear-gradient(180deg, rgba(24,27,34,0.96) 0%, rgba(14,17,24,0.98) 100%)",
    boxShadow:
      colorScheme === "light"
        ? "0 14px 26px rgba(31, 53, 96, 0.12)"
        : "0 18px 34px rgba(5, 8, 16, 0.28)",
  };

  return h(
    "span",
    { className: "keystatic-admin-mark", style: shellStyle },
    h("img", { src: image, alt: "Tulio Cunha", width: 22, height: 22 }),
  );
}

export const keystaticUi: {
  brand: {
    name: string;
    mark: typeof KeystaticBrandMark;
  };
  navigation: Record<string, NavigationKey[]>;
} = {
  brand: {
    name: "Tulio Cunha",
    mark: KeystaticBrandMark,
  },
  navigation: {
    Editorial: ["posts", "taxonomyCategories", "taxonomyTopics", "taxonomySeries"],
    Pages: ["blogPage", "aboutPage", "projectsPage"],
    Integrations: ["featuredGithub"],
  },
};

export const articleBodyComponents = {
  Callout: wrapper({
    label: "Callout",
    description: "Editorial aside for notes, tips, warnings, and important context.",
    schema: {
      tone: fields.select({
        label: "Tone",
        options: [
          { label: "Note", value: "note" },
          { label: "Tip", value: "tip" },
          { label: "Important", value: "important" },
          { label: "Warning", value: "warning" },
          { label: "Caution", value: "caution" },
        ],
        defaultValue: "note",
      }),
      title: fields.text({ label: "Title" }),
    },
    ContentView: ({ value, children }) =>
      PreviewFrame([PreviewEyebrow(value.title || value.tone), PreviewText(children)]),
  }),
  PullQuote: wrapper({
    label: "Pull quote",
    description: "Large standout quote with optional attribution and source URL.",
    schema: {
      attribution: fields.text({ label: "Attribution" }),
      sourceUrl: fields.text({ label: "Source URL" }),
    },
    ContentView: ({ value, children }) =>
      PreviewFrame([
        PreviewEyebrow("Pull quote"),
        h(
          "div",
          {
            style: {
              fontSize: 18,
              lineHeight: 1.5,
              color: "#fff",
              marginBottom: 10,
            },
          },
          children,
        ),
        value.attribution || value.sourceUrl
          ? PreviewText([value.attribution, value.sourceUrl].filter(Boolean).join(" · "))
          : null,
      ]),
  }),
  Figure: block({
    label: "Figure",
    description: "Image with optional caption for body content and references.",
    schema: {
      src: fields.image({
        label: "Image",
        directory: "src/assets/images/posts",
        publicPath: "@assets/images/posts/",
      }),
      alt: fields.text({ label: "Alt text" }),
      caption: fields.text({ label: "Caption", multiline: true }),
    },
    ContentView: FigurePreview,
  }),
  Lede: wrapper({
    label: "Lede",
    description: "Opening paragraph with editorial drop-cap treatment.",
    schema: {
      dropCap: fields.checkbox({ label: "Drop cap", defaultValue: true }),
    },
    ContentView: ({ children }) => PreviewFrame([PreviewEyebrow("Lede"), PreviewText(children)]),
  }),
  KeyTakeaway: wrapper({
    label: "Key takeaway",
    description: "Single highlighted insight — the line that earns its own breath.",
    schema: {
      label: fields.text({ label: "Eyebrow", defaultValue: "Takeaway" }),
    },
    ContentView: ({ value, children }) =>
      PreviewFrame([PreviewEyebrow(value.label || "Takeaway"), PreviewText(children)]),
  }),
  Compare: wrapper({
    label: "Compare",
    description: "Side-by-side two-column comparison.",
    schema: {
      leftEyebrow: fields.text({ label: "Left eyebrow" }),
      leftTitle: fields.text({ label: "Left title" }),
      rightEyebrow: fields.text({ label: "Right eyebrow" }),
      rightTitle: fields.text({ label: "Right title" }),
    },
    ContentView: ({ value, children }) =>
      PreviewFrame([
        PreviewEyebrow("Compare"),
        h(
          "div",
          { style: { fontSize: 13, color: "rgba(235,235,245,0.7)", marginBottom: 6 } },
          [value.leftTitle, value.rightTitle].filter(Boolean).join("  vs  "),
        ),
        PreviewText(children),
      ]),
  }),
  Stat: block({
    label: "Stat",
    description: "Editorial numeric figure with label and optional caption.",
    schema: {
      value: fields.text({ label: "Value" }),
      label: fields.text({ label: "Label" }),
      caption: fields.text({ label: "Caption" }),
      trend: fields.select({
        label: "Trend",
        options: [
          { label: "—", value: "flat" },
          { label: "Up", value: "up" },
          { label: "Down", value: "down" },
        ],
        defaultValue: "flat",
      }),
    },
    ContentView: ({ value }) =>
      PreviewFrame([
        h(
          "div",
          {
            style: {
              fontSize: 36,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            },
          },
          value.value || "—",
        ),
        h(
          "div",
          {
            style: {
              marginTop: 6,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(102, 194, 255, 0.86)",
            },
          },
          value.label,
        ),
        value.caption ? PreviewText(value.caption) : null,
      ]),
  }),
  SectionDivider: block({
    label: "Section divider",
    description: "Numbered ornamental break placed above a real ## heading.",
    schema: {
      n: fields.text({ label: "Numeral (e.g. 04)" }),
      label: fields.text({ label: "Label" }),
    },
    ContentView: ({ value }) =>
      PreviewFrame([
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "rgba(235,235,245,0.6)",
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            },
          },
          [
            h("span", { style: { flex: 1, height: 1, background: "rgba(255,255,255,0.18)" } }),
            value.n
              ? h(
                  "span",
                  { style: { fontFamily: "ui-monospace, monospace", fontWeight: 700 } },
                  value.n,
                )
              : null,
            value.label ? h("span", null, value.label) : null,
            h("span", { style: { flex: 1, height: 1, background: "rgba(255,255,255,0.18)" } }),
          ].filter(Boolean),
        ),
      ]),
  }),
} as const;
