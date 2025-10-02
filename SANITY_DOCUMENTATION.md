# Sanity CMS Documentation - Astro Blog Integration

This document contains focused Sanity documentation for integrating a blog with Astro frontend, custom Apple-like CSS design, and visual editing capabilities.

---

## Table of Contents

1. [Astro Integration](#astro-integration)
2. [GROQ Query Language](#groq-query-language)
3. [Visual Editing](#visual-editing)
4. [Portable Text Editor](#portable-text-editor)
5. [Structured Content Fundamentals](#structured-content-fundamentals)
6. [Studio Configuration](#studio-configuration)
7. [TypeScript Type Generation](#typescript-type-generation)

---

## Astro Integration

### Official Sanity Integration for Astro

The official `@sanity/astro` integration enables the Sanity Client in your Astro project and lets you embed Sanity Studio on a route.

### Installation

```bash
npx astro add @sanity/astro @astrojs/react
```

**Note:** `@astrojs/react` is only needed if you plan to embed a Sanity Studio in your project.

### Manual Installation

```bash
npm install @astrojs/react @sanity/astro @sanity/client sanity @types/react-dom @types/react-is @types/react react-dom react-is react styled-components
```

### Adding Types

Add to your `env.d.ts` file:

```typescript
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />
```

### Configuration

Configure in your `astro.config.mjs`:

```typescript
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    sanity({
      projectId: "<YOUR-PROJECT-ID>",
      dataset: "<YOUR-DATASET-NAME>",
      useCdn: false, // Set false for static builds
      apiVersion: "2025-01-28",
    }),
  ],
});
```

### Using Sanity Client

In your Astro templates:

```astro
---
import { sanityClient } from "sanity:client";

const posts = await sanityClient.fetch(`*[_type == "post" && defined(slug)] | order(publishedAt desc)`);
---

<h1>Blog</h1>
<ul>
  {posts.map((post) => (
    <li>
      <a href={'/posts/' + post.slug.current}>
        {post.title}
      </a>
    </li>
  ))}
</ul>
```

### Embedding Studio on a Route

1. Create `sanity.config.ts` in project root:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "project-name",
  title: "Project Name",
  projectId: "<YOUR-PROJECT-ID>",
  dataset: "<YOUR-DATASET-NAME>",
  plugins: [structureTool()],
  schema: {
    types: [
      /* your content types */
    ],
  },
});
```

2. Update `astro.config.mjs`:

```javascript
export default defineConfig({
  integrations: [
    sanity({
      projectId: "YOUR_PROJECT_ID",
      dataset: "YOUR_DATASET",
      useCdn: false,
      studioBasePath: "/admin", // Access Studio at /admin
    }),
    react(),
  ],
});
```

---

## GROQ Query Language

### Introduction

GROQ (Graph-Relational Object Queries) is Sanity's query language for working with JSON documents.

### Basic Syntax

**Get everything:**
```groq
*
```

**Filter by type:**
```groq
*[_type == "post"]
```

**Array slicing:**
```groq
*[_type == "post"][0...3]
```

**Projections (select specific fields):**
```groq
*[_type == "post"][0...3]{
  title,
  slug,
  publishedAt
}
```

**Ordering:**
```groq
*[_type == "post"] | order(publishedAt desc)
```

### Advanced Queries

**Resolving references:**
```groq
*[_type == "post"]{
  title,
  author->{
    name,
    bio
  }
}
```

**Conditional values with coalesce:**
```groq
*[_type == "post"]{
  title,
  "date": coalesce(publishedAt, _createdAt)
}
```

**Custom functions:**
```groq
fn::reference($doc) = $doc->{name};

*[_type == "post"]{
  "author": fn::reference(author)
}
```

### Query Parameters

```groq
*[_type == "post" && slug.current == $slug][0]
```

Used with:
```typescript
await sanityClient.fetch(query, { slug: "hello-world" });
```

---

## Visual Editing

### Overview

Visual Editing provides:
- **Overlays**: Clickable content that links directly to Studio editor
- **Live Mode**: Real-time preview of edits in Studio

**Important:** Visual Editing only works for server-side rendered pages in Astro.

### Setup

1. **Enable VisualEditing Component**

Create/update your layout:

```astro
---
import { VisualEditing } from "@sanity/astro/visual-editing";

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
---

<html lang="en">
  <head>
    <!-- head content -->
  </head>
  <body>
    <slot />
    <VisualEditing enabled={visualEditingEnabled} zIndex={1000} />
  </body>
</html>
```

2. **Environment Variables**

Add to `.env.local`:
```
PUBLIC_SANITY_VISUAL_EDITING_ENABLED="true"
SANITY_API_READ_TOKEN="your_viewer_token"
```

3. **Enable Stega in Config**

```javascript
export default defineConfig({
  integrations: [
    sanity({
      studioBasePath: "/admin",
      stega: {
        studioUrl: "/admin",
      },
    }),
  ],
});
```

4. **Create loadQuery Helper**

```typescript
import { type QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  if (visualEditingEnabled && !token) {
    throw new Error(
      "SANITY_API_READ_TOKEN required for Visual Editing"
    );
  }

  const perspective = visualEditingEnabled ? "previewDrafts" : "published";

  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
      stega: visualEditingEnabled,
      ...(visualEditingEnabled ? { token } : {}),
      useCdn: !visualEditingEnabled,
    }
  );

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  };
}
```

5. **Add Presentation Tool**

In `sanity.config.ts`:

```typescript
import { presentationTool } from "sanity/presentation";

export default defineConfig({
  // ... other config
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: location.origin,
    }),
  ],
});
```

---

## Portable Text Editor

### What is Portable Text?

Portable Text is an open specification for rich text and block content stored as JSON. It's:
- Platform/framework agnostic
- Queryable (e.g., find posts with specific code blocks)
- Flexible for rendering to any output format

### Rendering in Astro

Install `astro-portabletext`:

```bash
npm install astro-portabletext
```

**Basic Component:**

```astro
---
import { PortableText } from 'astro-portabletext';

const { portableText } = Astro.props;
---

<PortableText value={portableText} />
```

### Custom Block Types

**Image Component Example:**

```astro
---
// PortableTextImage.astro
import { urlForImage } from "../sanity/lib/url-for-image";

const { asset, alt } = Astro.props.node;
const url = urlForImage(asset).url();
const webpUrl = urlForImage(asset).format("webp").url();
---

<picture>
  <source srcset={webpUrl} type="image/webp" />
  <img src={url} alt={alt} />
</picture>
```

**Register Custom Components:**

```astro
---
import { PortableText } from 'astro-portabletext';
import PortableTextImage from "./PortableTextImage.astro";

const { portableText } = Astro.props;

const components = {
  type: {
    image: PortableTextImage,
  }
};
---

<PortableText value={portableText} components={components} />
```

### Schema Definition

```typescript
import { defineType, defineArrayMember } from "sanity";

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
  ],
});
```

---

## Structured Content Fundamentals

### What is Structured Content?

Structured content is information broken into its smallest reasonable pieces, explicitly organized and classified to be understandable by computers and humans.

### Benefits

- **Reusable**: Content becomes data that can be used across multiple surfaces
- **Future-friendly**: Easy to update and adapt as needs change
- **Queryable**: Find and filter content based on specific criteria
- **Presentation-agnostic**: Separate content from design

### Content Modeling

**Entity-based thinking:**
- Think about "things" not "pages"
- Examples: Post, Author, Category, Project

**Example Post Schema:**

```typescript
export const postType = defineType({
  name: "post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "author", type: "reference", to: { type: "author" } }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }]
    }),
  ],
});
```

---

## Studio Configuration

### Schema Best Practices

**Field Titles and Descriptions:**

```typescript
defineField({
  name: "publishedAt",
  title: "Published At",
  description: "When this post should be made public",
  type: "datetime",
})
```

**Validation:**

```typescript
defineField({
  name: "title",
  type: "string",
  validation: (Rule) => Rule.required().min(10).max(80),
})
```

**Conditional Fields:**

```typescript
defineField({
  name: "externalUrl",
  type: "url",
  hidden: ({ document }) => !document?.isExternal,
})
```

**Field Groups:**

```typescript
groups: [
  { name: "content", title: "Content" },
  { name: "seo", title: "SEO" },
],
fields: [
  defineField({
    name: "title",
    type: "string",
    group: "content",
  }),
  defineField({
    name: "metaTitle",
    type: "string",
    group: "seo",
  }),
]
```

### Preview Configuration

```typescript
preview: {
  select: {
    title: "title",
    author: "author.name",
    media: "mainImage",
  },
  prepare({ title, author, media }) {
    return {
      title,
      subtitle: author && `by ${author}`,
      media,
    };
  },
}
```

---

## TypeScript Type Generation

### Setup

1. **Extract Schema:**

```bash
npx sanity@latest schema extract
```

This creates `schema.json`.

2. **Generate Types:**

```bash
npx sanity@latest typegen generate
```

This creates `sanity.types.ts`.

### Configuration for Multi-folder Projects

Create `sanity-typegen.json`:

```json
{
  "path": "../your-astro-app/src/**/*.{ts,tsx,js,jsx}",
  "schema": "schema.json",
  "generates": "../your-astro-app/src/sanity/types.ts"
}
```

### Defining Queries

Use `defineQuery` for type generation:

```typescript
import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    body
  }`
);
```

### Using Types

```typescript
import type { POSTS_QUERYResult } from "./sanity.types";

const posts = await loadQuery<POSTS_QUERYResult>({
  query: POSTS_QUERY,
});
```

---

## Project Information

**Your Sanity Project:**
- Project ID: `61249gtj`
- Organization: Tulio Cunha Full Stack Dev
- Dataset: `production` (public)
- Created: 2025-09-13

**Key Integration Points:**
- Astro frontend with custom Apple-like CSS
- Blog content managed in Sanity
- Visual editing for content preview
- Portable Text for rich content
- No templates - custom design integration

---

*Documentation compiled for Astro blog integration*
*Last updated: 2025-10-01*
*Source: Sanity Learn (https://sanity.io/learn) + Official Sanity Astro Integration*
