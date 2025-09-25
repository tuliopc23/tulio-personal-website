# The official Sanity integration for Astro

Featured Tool

Official(made by Sanity team)

By [Rune Botten](https://www.sanity.io/exchange/community/runeb) & [Cody Olsen](https://www.sanity.io/exchange/community/stipsan)

Integrate content from Sanity on Astro websites

![ ](https://cdn.sanity.io/images/81pocpw8/production/aa234680c8a9ecd1b89ee6d0bb07099c89d210b4-64x79.svg?h=99&fit=max&auto=format)

## [The Official Sanity integration for Astro](https://www.sanity.io/plugins/sanity-astro#the-official-sanity-integration-for-astro)

This integration enables the [Sanity Client](https://www.sanity.io/docs/js-client) in your [Astro](https://astro.build/) project and lets you embed Sanity Studio on a route. Astro is an all-in-one web framework that supports a range of UI languages and can be deployed in most places.

- [Installation](https://www.sanity.io/plugins/sanity-astro#installation)
  - [Manual installation of dependencies](https://www.sanity.io/plugins/sanity-astro#manual-installation-of-dependencies)
  - [Adding types for `sanity:client`](https://www.sanity.io/plugins/sanity-astro#adding-types-for-sanityclient)
- [Usage](https://www.sanity.io/plugins/sanity-astro#usage)
  - [Setting up the Sanity client](https://www.sanity.io/plugins/sanity-astro#setting-up-the-sanity-client)
  - [Embedding Sanity Studio on a route](https://www.sanity.io/plugins/sanity-astro#embedding-sanity-studio-on-a-route)
- [Rendering rich text and block content with Portable Text](https://www.sanity.io/plugins/sanity-astro#rendering-rich-text-and-block-content-with-portable-text)
- [Presenting images](https://www.sanity.io/plugins/sanity-astro#presenting-images)
  - [Resources](https://www.sanity.io/plugins/sanity-astro#resources)
- [Enabling Visual Editing](https://www.sanity.io/plugins/sanity-astro#enabling-visual-editing)

## [Installation](https://www.sanity.io/plugins/sanity-astro#installation)

In your Astro project, run the following command to install the Sanity integration:

```bash
npx astro add @sanity/astro @astrojs/react
```



Note: `@astrojs/react` is only needed if you plan to embed a Sanity Studio in your project.

## [Manual installation of dependencies](https://www.sanity.io/plugins/sanity-astro#manual-installation-of-dependencies)

```bash
npm install @astrojs/react @sanity/astro @sanity/client sanity @types/react-dom @types/react-is @types/react react-dom react-is react styled-components
```



## [Adding types for `sanity:client`](https://www.sanity.io/plugins/sanity-astro#adding-types-for-sanityclient)

This integration leverages [Vite.js' virtual modules](https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention) with Astro's naming convention (e.g. `astro:assets`). Since it's not possible to automatically include module declarations from npm packages, you'll have to add the following line to the `env.d.ts` file that usually resides in the `src` folder of an Astro project:

```
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />
```



You might have to restart the TS Server running in your code editor to get it to resolve types after updating this file. The easiest way to do this is to restart the application.

## [Usage](https://www.sanity.io/plugins/sanity-astro#usage)

## [Setting up the Sanity client](https://www.sanity.io/plugins/sanity-astro#setting-up-the-sanity-client)

Configure the integration in your `astro.config.mjs` file. The configuration options and methods are the same as for [@sanity/client](https://github.com/sanity-io/client#readme):

```typescript
import sanity from '@sanity/astro'
import {defineConfig} from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: '<YOUR-PROJECT-ID>',
      dataset: '<YOUR-DATASET-NAME>',
      // Set useCdn to false if you're building statically.
      useCdn: false,
    }),
  ],
})
```



This enables the use of `sanityClient` in your template files. For example:

```
---
// /blog/index.astro
import { sanityClient } from "sanity:client";

const posts = await sanityClient.fetch(`*[_type == "post" && defined(slug)] | order(publishedAt desc)`);
---

<h1>Blog</h1>
<ul>
  {posts.map((post) => (
    <li>
      <a href={'/posts/' + post.slug.current} class="post-link">
        {post.title}
      </a>
    </li>
  ))}
</ul>
```



[Check out this guide](https://www.sanity.io/guides/sanity-astro-blog) for a more elaborate introduction to how to integrate content from Sanity into Astro. You can also look in the `examples` folder in this repository for complete implementation examples.

## [Embedding Sanity Studio on a route](https://www.sanity.io/plugins/sanity-astro#embedding-sanity-studio-on-a-route)

Sanity Studio is a customizable content workspace where you can edit your content. It‘s a Single Page Application that you can keep in its own repository, together with your Astro project as a monorepo, or embedded in your website.

To initialize a Studio in a dedicated folder, you can run `npm create sanity@latest` and follow the instructions.

This integration lets you embed a Sanity Studio on a route in your Astro project. To enable it:

1. Create a new file in your project root called `sanity.config.ts` (or `.js`)
2. Add the following code, and add your `projectId` and `dataset` to it:

```typescript
// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

export default defineConfig({
  name: 'project-name',
  title: 'Project Name',
  projectId: '<YOUR-PROJECT-ID>',
  dataset: '<YOUR-DATASET-NAME>',
  plugins: [structureTool()],
  schema: {
    types: [
      /* your content types here*/
    ],
  },
})
```



You can use this configuration file to install plugins, add a schema with document types, add customizations etc. Note that the Studio will be using Astro‘s development server which is built on top of [Vite](https://vitejs.dev/).

1. Add the following to your `astro.config.mjs`:
   - `studioBasePath: '/admin'`: The route/path for where you want to access your studio
   - Import the [React integration for Astro](https://docs.astro.build/en/guides/integrations-guide/react/), and add it to the `integrations` array.

```javascript
// astro.config.mjs
import sanity from '@sanity/astro'
import {defineConfig} from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [
    sanity({
      projectId: '3do82whm',
      dataset: 'next',
      // Set useCdn to false if you're building statically.
      useCdn: false,
      // Access the Studio on your.url/admin
      studioBasePath: '/admin',
    }),
    react(),
  ],
})
```



1. You have to [enable CORS origins for authenticated requests](https://www.sanity.io/docs/cors) for the domains you're running your website project on. The Studio should automatically detect and let you add this when you access the Studio on a new URL. Typically you need to add your local development server URL and your production URL to the CORS origin settings. It's important that you only enable CORS for authenticated requests on domains that *you*control.

## [Rendering rich text and block content with Portable Text](https://www.sanity.io/plugins/sanity-astro#rendering-rich-text-and-block-content-with-portable-text)

Sanity uses an open specification for rich text and block content called [Portable Text](https://portabletext.org/). Portable Text stores content from the editor as JSON (and not HTML or Markdown). This makes it platform/framework agnostic, and also queryable (for example, you can query for blog posts that have more than 4 TypeScript code blocks).

While it's possible to loop over the JSON structure manually, we recommend using a Portable Text library to do the heavy lifting. It will automatically render the default editor configuration to HTML. If you do customizations like adding custom block types, then you need to map those to a component in your front end.

We recommend using [astro-portabletext](https://github.com/theisel/astro-portabletext) to render your PortableText fields in Astro. See an example of this in [apps/example/src/components/PortableText.astro](https://github.com/sanity-io/sanity-astro/blob/main/apps/example/src/components/PortableText.astro), including using custom components to render custom blocks and annotations.

```
---
import {PortableText as PortableTextInternal} from "astro-portabletext"
import CallToActionBox from "./CallToActionBox.astro";
import Code from "./Code.astro";
import SanityImage from "./SanityImage.astro";
import YouTube from "./YouTube.astro";
import InternalLink from "./InternalLink.astro";

const components = {
  type: {
    callToActionBox: CallToActionBox,
    code: Code,
    image: SanityImage,
    youtube: YouTube,
  },
  mark: {
    internalLink: InternalLink
  }
};

---

<PortableTextInternal value={Astro.props.value} components={components} />
```



## [Presenting images](https://www.sanity.io/plugins/sanity-astro#presenting-images)

Sanity comes with [a native asset pipeline for your images and files](https://www.sanity.io/docs/image-urls). It has on-demand transforms, automatic optimization for browsers that supports webp, and serves images from a global CDN network. When you upload images to Sanity, it will also automatically analyze the image and add [a metadata document](https://www.sanity.io/docs/image-metadata) with information like dimensions, color palette, generate blurhash, and LQIP strings.

We recommend using [@sanity/image-url](https://www.sanity.io/docs/image-url) to help you generate URLs for presenting Sanity images in your Astro app. See an example of this in [apps/example/src/components/SanityImage.astro](https://github.com/sanity-io/sanity-astro/blob/main/apps/example/src/components/SanityImage.astro)

You can also use community-contributed integrations like [astro-sanity-picture](https://github.com/otterdev-io/astro-sanity-picture)to integrate images from Sanity into your website.

## [Enabling Visual Editing](https://www.sanity.io/plugins/sanity-astro#enabling-visual-editing)

To enable [Visual Editing](https://www.sanity.io/docs/introduction-to-visual-editing), you need to:

1. [Enable Overlays using the `VisualEditing` component](https://www.sanity.io/plugins/sanity-astro#1-enable-overlays-using-the-visualediting-component)
2. [Add the Presentation tool to the Studio](https://www.sanity.io/plugins/sanity-astro#2-add-the-presentation-tool-to-the-studio)
3. [Enable Stega](https://www.sanity.io/plugins/sanity-astro#3-enable-stega)

**Please note that Visual Editing only works for [server-side rendered](https://docs.astro.build/en/guides/server-side-rendering/) pages.**This means you probably want to configure your Astro project something like this:

```js
import vercel from '@astrojs/vercel'

// astro.config.mjs
export default defineConfig({
  integrations: [
    sanity({
      useCdn: true,
      // ...
    }),
    // ...
  ],
  output: 'server',
  adapter: vercel(),
})
```



## [1. Enable ](https://www.sanity.io/plugins/sanity-astro#1-enable-overlays-using-the-visualediting-component)[Overlays](https://www.sanity.io/docs/visual-editing-overlays) using the `VisualEditing` component

Add `VisualEditing` from `@sanity/astro/visual-editing` in your ["page shell" layout](https://docs.astro.build/en/basics/layouts/):

```ts
---
import {VisualEditing} from '@sanity/astro/visual-editing'

export type props = {
  title: string
}
const {title} = Astro.props
const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED == 'true'
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
    <VisualEditing enabled={visualEditingEnabled} zIndex={1000} />
    <!--                                          ^optional -->
  </body>
</html>
```



`VisualEditing` is needed to render Overlays. It's a React component under the hood, so you'll need the [React integration for Astro](https://docs.astro.build/en/guides/integrations-guide/react/) if you don't already use that at this point.

`VisualEditing` takes two props:

- `enabled`: so you can control whether or not visual editing is enabled depending on your environment.
- `zIndex` (optional): allows you to change the `z-index` of overlay elements.

In the example above, `enabled` is controlled using an [environment variable](https://docs.astro.build/en/guides/environment-variables/):

```
// .env.local
PUBLIC_SANITY_VISUAL_EDITING_ENABLED="true"
```



## [2. Add the Presentation tool to the Studio](https://www.sanity.io/plugins/sanity-astro#2-add-the-presentation-tool-to-the-studio)

Follow the instructions on [how to configure the Presentation tool](https://www.sanity.io/docs/configuring-the-presentation-tool).

## [3. Enable ](https://www.sanity.io/plugins/sanity-astro#3-enable-stega)[Stega](https://www.sanity.io/docs/stega)

If you already run Studio on an Astro route, then you can set the `stega.studioUrl` to the same relative path:

```js
export default defineConfig({
  integrations: [
    sanity({
      studioBasePath: '/admin',
      stega: {
        studioUrl: '/admin',
      },
    }),
  ],
})
```



Now, all you need is a `loadQuery` helper function akin to this one:

```ts
// load-query.ts
import {type QueryParams} from 'sanity'
import {sanityClient} from 'sanity:client'

const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'
const token = import.meta.env.SANITY_API_READ_TOKEN

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string
  params?: QueryParams
}) {
  if (visualEditingEnabled && !token) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.',
    )
  }

  const perspective = visualEditingEnabled ? 'drafts' : 'published'

  const {result, resultSourceMap} = await sanityClient.fetch<QueryResponse>(query, params ?? {}, {
    filterResponse: false,
    perspective,
    resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
    stega: visualEditingEnabled,
    ...(visualEditingEnabled ? {token} : {}),
    useCdn: !visualEditingEnabled,
  })

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  }
}
```



You'll notice that we rely on a "read token" which is required in order to enable stega encoding and for authentication when Sanity Studio is live previewing your application.

1. Go to https://sanity.io/manage and select your project.
2. Click on the 🔌 API tab.
3. Click on + Add API token.
4. Name it "SANITY_API_READ_TOKEN" and set Permissions to Viewer and hit Save.
5. Copy the token and add it to your `.env.local` file: `SANITY_API_READ_TOKEN="<paste your token here>"`

Now, you can query and interact with stega-enabled data using the visual editing overlays:

```ts
// some.astro file
import {loadQuery} from '../load-query'

const {data: movies} = await loadQuery<Array<{title: string}>>({
  query: `*[_type == 'movie']`,
})
```



## [Resources](https://www.sanity.io/plugins/sanity-astro#resources)





A complete guide to setting up your blog using Astro and Sanity



This developer guide was contributed by Knut Melvær (Head of Developer Community and Education), Chris LaRocque (Senior Solution Architect), and Rune Botten (Principal Solutions Engineer and Architect at Sanity working mainly with our enterprise clients.).

Use the official Sanity Astro integration to build a blog

In this guide, we will dive deeper into what you will need to know in order to make a blog with Astro and Sanity. You will learn how to:

- Set up static and dynamic routes based on content from your Sanity project
- Implement block content with [Portable Text](https://www.sanity.io/docs/developer-guides/presenting-block-text), and add custom block types
- Work with images from the [Sanity CDN](https://www.sanity.io/docs/apis-and-sdks/presenting-images)
- Configure Sanity's [Presentation](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool) tool for live [Visual Editing](https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing)

If you prefer to see the code in your own IDE first, you can find the finished code [here](https://github.com/ChrisLaRocque/sanity-astro).

This guide will not add styling to the markup, we will leave that up to you. That said, it‘s often easier to develop the design when the basic markup and content are in place.



Prerequisites

This guide does not assume that you know Sanity or Astro. However, it will not go in-depth into Astro concepts (we recommend exploring the rest of [the documentation](https://docs.astro.build/en/getting-started/) for this). This guide uses light TypeScript. If you don't use TypeScript, you should be able to delete the extra syntax without that much extra effort.

Before taking on the guide, make sure that you have [Node.js 18 and npm 9](https://nodejs.org/en/download/package-manager) (or another package manager) or a version above installed.

Initialize a new Astro project

**Run** the following in your shell (like Terminal, iTerm, PowerShell):

```
npm create astro@latest
```



Follow the instructions. When asked `How would you like to start your new project?` select `A basic, minimal starter` . You don't need to use Typescript, but the examples in this guide will be using it.

Add dependencies

Start by installing the official [Sanity integration for Astro](https://www.sanity.io/plugins/sanity-astro):

```
npx astro add @sanity/astro @astrojs/react
```



The command should add the Sanity and React configuration to your `astro.config.mjs` file. This is where you will tell Astro what your Sanity project ID is, as well as the name of your dataset (most likely `production`).

The `@astrojs/react` dependency is needed to embed the Studio on a route.

**Create** a file `/src/env.d.ts` and add the types for the Astro module:

```
// ./src/env.d.ts/// <reference types="astro/client" />/// <reference types="@sanity/astro/module" />
```



You may need to restart your TypeScript server for this file to be recognized.

Initialize a new Sanity Project

**Run** the following command to initialize a Sanity project and store the `projectId` and `dataset` variables in an `.env` file. That's the only thing you need to query published content in a dataset that‘s not private.

```
npx sanity@latest init --env
```



Follow the instructions from the CLI, and don't worry about messing up, with Sanity, you can make as many projects as you want. You can always go to [sanity.io/manage](https://sanity.io/manage) to find information about your projects.

When the init command is completed Astro will have written 2 new environment variables to your `.env` file: `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. These variables are prefixed with `PUBLIC_` because they're not considered secrets. 

Sanity Client configuration

Astro has a unique limitation where you can't use variables from `.env` files directly in your `astro.config.mjs` file. Because your project ID and dataset name aren't considered sensitive you can directly copy + paste their values from your `.env` file. [Go here for instructions](https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file) if you wish to use the `.env` file instead.

**Update** the `sanity` integration in your `astro.config.mjs` file to include the information needed by the Sanity client.

```
// astro.config.mjsimport { defineConfig } from "astro/config";import sanity from "@sanity/astro";import react from "@astrojs/react";// https://astro.build/configexport default defineConfig({  integrations: [    sanity({      projectId: '<your-project-id>',      dataset: '<dataset-name>',      useCdn: false, // See note on using the CDN      apiVersion: "2025-01-28", // insert the current date to access the latest version of the API    }),    react(),  ],});
```





**CDN or not?**

Sanity lets you query content through a global CDN. If you plan to keep the site static and set up webhooks that trigger rebuilds when updates are published, then you probably want `useCdn` to be `false`to make sure you don't hit stale content when the site builds.

If you plan to use Server Side Rendering, then you probably want to set `useCdn` to `true` for performance and cost. You can also override this setting if you run the site in hybrid, for example:

`useSanityClient.config({useCdn: false}).fetch(*[_type == "liveBlog"])`.

Embedding Sanity Studio

Sanity Studio is where you can edit and manage your content. It‘s a Single Page Application that is easy to configure and that can be customized in a lot of ways. It‘s up to you to keep the Studio in a separate repository, in a separate folder (as a monorepo), or embed it into your Astro website. 

For the sake of simplicity, this guide will show you how to embed the Studio on a dedicated route (remember `/wp-admin`?).

**Update** `astro.config.mjs` to add a Studio at `yoursite.com/studio`

```
// astro.config.mjsimport { defineConfig } from "astro/config";import sanity from "@sanity/astro";import react from "@astrojs/react";// https://astro.build/configexport default defineConfig({  integrations: [sanity({    projectId: '<your-project-id>',    dataset: '<dataset-name>',    useCdn: false, // See note on using the CDN    apiVersion: "2025-01-28", // insert the current date to access the latest version of the API    studioBasePath: '/studio' // If you want to access the Studio on a route  }), react()]});
```



You must also add a configuration file for Sanity Studio in the project root. **Create** a new file called `sanity.config.ts` and add the following, note that we're able to use environment variables here:

```
// ./sanity.config.tsimport { defineConfig } from "sanity";import { structureTool } from "sanity/structure";export default defineConfig({  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,  dataset: import.meta.env.PUBLIC_SANITY_DATASET,  plugins: [structureTool()],  schema: {    types: [],  },});
```



**Start** the Astro local development server, you should be able to visit the Studio at http://localhost:4321/studio. The first time you load this URL, you will be asked to add the URL to your project's CORS Origins. This is to enable authenticated requests from the browser to the Sanity APIs. Follow the instructions and reload the Studio route once you have added the setting.

Your project folder should now look like this:

```
.├── public/│   └── favicon.svg├── src/│   ├── assets/│   │   ├── astro.svg│   │   └── background.svg│   ├── components/│   │   └── Welcome.astro│   ├── layouts/│   │   └── Layout.astro│   ├── pages/│   │   └── index.astro│   └── env.d.ts├── .env├── .gitignore├── astro.config.mjs├── package-lock.json├── package.json├── README.md├── sanity.config.ts└── tsconfig.json
```



Defining the Studio schema

Sanity is different from most headless CMSes. Content Lake, where your content is stored, is a schema-less backend that lets you store any JSON document and makes it instantly queryable with GROQ. Sanity Studio is a decoupled application that enables you to define a schema using simple JavaScript objects. The Studio uses the schema to build an editor interface where you can collaborate on content in real-time.

This guide isn't going to cover schema creation in-depth, for now we'll copy and paste some starting schema definitions.

**Create** a new directory inside the `src` directory, called `sanity` with a directory `schemaTypes` inside of it. **Create** the following files inside `/src/sanity/schemaTypes` :

```
// ./src/sanity/schemaTypes/author.tsimport { defineField, defineType } from "sanity";export const authorType = defineType({  name: "author",  type: "document",  fields: [    defineField({      name: "name",      type: "string",    }),    defineField({      name: "slug",      type: "slug",      options: {        source: "name",        maxLength: 96,      },    }),    defineField({      name: "image",      type: "image",      options: {        hotspot: true,      },      fields: [        {          name: "alt",          type: "string",          title: "Alternative Text",        },      ],    }),    defineField({      name: "bio",      type: "array",      of: [        {          type: "block",          styles: [{ title: "Normal", value: "normal" }],          lists: [],        },      ],    }),  ],  preview: {    select: {      title: "name",      media: "image",    },  },});
```



```
// ./src/sanity/schemaTypes/blockContent.tsimport { defineType, defineArrayMember } from "sanity";/** * This is the schema type for block content used in the post document type * Importing this type into the studio configuration's `schema` property * lets you reuse it in other document types with: *  { *    name: 'someName', *    title: 'Some title', *    type: 'blockContent' *  } */export const blockContentType = defineType({  title: "Block Content",  name: "blockContent",  type: "array",  of: [    defineArrayMember({      type: "block",      // Styles let you define what blocks can be marked up as. The default      // set corresponds with HTML tags, but you can set any title or value      // you want, and decide how you want to deal with it where you want to      // use your content.      styles: [        { title: "Normal", value: "normal" },        { title: "H1", value: "h1" },        { title: "H2", value: "h2" },        { title: "H3", value: "h3" },        { title: "H4", value: "h4" },        { title: "Quote", value: "blockquote" },      ],      lists: [{ title: "Bullet", value: "bullet" }],      // Marks let you mark up inline text in the Portable Text Editor      marks: {        // Decorators usually describe a single property – e.g. a typographic        // preference or highlighting        decorators: [          { title: "Strong", value: "strong" },          { title: "Emphasis", value: "em" },        ],        // Annotations can be any object structure – e.g. a link or a footnote.        annotations: [          {            title: "URL",            name: "link",            type: "object",            fields: [              {                title: "URL",                name: "href",                type: "url",              },            ],          },        ],      },    }),    // You can add additional types here. Note that you can't use    // primitive types such as 'string' and 'number' in the same array    // as a block type.    defineArrayMember({      type: "image",      options: { hotspot: true },      fields: [        {          name: "alt",          type: "string",          title: "Alternative Text",        },      ],    }),  ],});
```



```
// ./src/sanity/schemaTypes/category.tsimport { defineField, defineType } from "sanity";export const categoryType = defineType({  name: "category",  type: "document",  fields: [    defineField({      name: "title",      type: "string",    }),    defineField({      name: "description",      type: "text",    }),  ],});
```



```
// ./src/sanity/schemaTypes/post.tsimport { defineField, defineType } from "sanity";export const postType = defineType({  name: "post",  type: "document",  fields: [    defineField({      name: "title",      type: "string",    }),    defineField({      name: "slug",      type: "slug",      options: {        source: "title",        maxLength: 96,      },    }),    defineField({      name: "author",      type: "reference",      to: { type: "author" },    }),    defineField({      name: "mainImage",      type: "image",      options: {        hotspot: true,      },      fields: [        {          name: "alt",          type: "string",          title: "Alternative Text",        },      ],    }),    defineField({      name: "categories",      type: "array",      of: [{ type: "reference", to: { type: "category" } }],    }),    defineField({      name: "publishedAt",      type: "datetime",    }),    defineField({      name: "body",      type: "blockContent",    }),  ],  preview: {    select: {      title: "title",      author: "author.name",      media: "mainImage",    },    prepare(selection) {      const { author } = selection;      return { ...selection, subtitle: author && `by ${author}` };    },  },});
```



**Create** a file `index.ts` inside `/src/sanity/schemaTypes`

```
// ./src/sanity/schemaTypes/index.tsimport type { SchemaTypeDefinition } from "sanity";import { authorType } from "./author";import { blockContentType } from "./blockContent";import { categoryType } from "./category";import { postType } from "./post";export const schema: { types: SchemaTypeDefinition[] } = {  types: [authorType, blockContentType, categoryType, postType],};
```



Update your `sanity.config.ts` file to include the new schema:

```
import { defineConfig } from "sanity";import { structureTool } from "sanity/structure";import { schema } from "./src/sanity/schemaTypes";export default defineConfig({  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,  dataset: import.meta.env.PUBLIC_SANITY_DATASET,  plugins: [    structureTool(),  ],  schema,});
```



To recap: you created 3 document types - `author`, `category`, and `post`; as well as a reusable array type `blockContent` for editing Portable Text. If you refresh your Studio at `http://localhost:4321/studio` you should see the 3 document types listed, and the `blockContent` array will be visible when creating a post in the next step.

Create some example content

**Create** a post titled “Hello world” inside your Studio. At the slug field, press “Generate” to make a slug. Then press “Publish” – this makes the content publicly available via the API.

What's a better way to get started with your blog than creating some Hello World content? 

With the content created, the next step is to return to your Astro site and set it up to display your content.

Set up a blog post route in Astro

When you selected `A basic, minimal starter` template while creating this project, your Astro site was generated with only one route: an index page. To surface posts on our site, you'll want to create routes for each post. In Astro, routes exist as files on the file system in `src/pages` and are picked up by Astro as routes. 

You could manually create routes for each post, but your posts are dynamic: when everything is up and running, you probably want to publish new content without pushing code. Astro, like most web frameworks, offers dynamic routing to make your life easier: you can create one route to catch them all using parameters.

In your blog's schema, every post has a slug, the unique bit of the URL (eg “hello-world” for your “Hello world” post). To use a slug parameter in the route, you must wrap the filename in brackets. So, if you want your posts route to be `/post/slug`, you need to create a folder called `post`, which contains a file named `[slug].astro`.

In `[slug].astro`, you need to export a function called [`getStaticPaths`](https://docs.astro.build/en/reference/api-reference/#getstaticpaths) that returns an array of objects. In our case, at the minimum, each object needs to include `slug` in its `params`. To get started, use this as the contents of your `[slug].astro` file:

```
---// ./src/pages/post/[slug].astroexport function getStaticPaths() {  return [    {params: {slug: 'hello-world'}},    {params: {slug: 'my-favorite-things'}},    {params: {slug: 'summertime'}},  ];}const { slug } = Astro.params;---<h1>A post about {slug}</h1>
```



This code sets up the data in this route within the code fences (`---`). Data returned from `getStaticPaths` is available in the `Astro.params` variable. This is a bit of magic the framework does for you. Now you can use the `slug` in your template. In this case, it results in a heading that contains whatever the slug is. 

With the example above, Astro will generate three files, 'hello-world', 'my-favorite-things', and 'summertime' in the production build, with a heading that includes the slug. You can now browse to these on your local server. For instance, `localhost:4321/post/summertime` will display the heading “A post about summertime”.

We can use 'slug' in our content

Of course, you want to display more than just the slugs, and you don't want to hardcode the slugs in this file. Let's get your data from Sanity and dynamically populate your post routes with your content.

Integrate your blog posts from Sanity in Astro

**Create** a new directory at `./src/sanity` called `lib` and add a new file `load-query.ts`:

```
// ./src/sanity/lib/load-query.tsimport { type QueryParams } from "sanity";import { sanityClient } from "sanity:client";export async function loadQuery<QueryResponse>({  query,  params,}: {  query: string;  params?: QueryParams;}) {  const { result } = await sanityClient.fetch<QueryResponse>(    query,    params ?? {},    { filterResponse: false }  );  return {    data: result,  };}
```





You may ask "Why wouldn't I use the client directly in my Astro template?" and that's a very valid question. We're setting up a wrapper around the Sanity integration's client to make implementing Presentation later easier, but if you don't plan to use Presentation you can feel free to just use the client directly in your Astro files.

Head back to your `[slug].astro` file, import the `loadQuery` function, and use it to fetch your posts' slugs, like this:

```
---// ./src/pages/post/[slug].astroimport type { SanityDocument } from "@sanity/client";import { loadQuery } from "../../sanity/lib/load-query";export async function getStaticPaths() {  const { data: posts } = await loadQuery<SanityDocument[]>({    query: `*[_type == "post"]`,  });  return posts.map(({ slug }) => {    return {      params: {        slug: slug.current,      },    };  });}const { slug } = Astro.params;---<h1>A post about {slug}</h1>
```



Within the code fences, we export that same `getStaticPaths` function as before, but we've made it automatic so that we can wait for the data before returning the posts. With the `loadQuery` function, we fetch the posts using the Sanity client's fetch method (note: this is Sanity's fetch, not the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)). 

The argument we're passing into this fetch function, if you've not seen this syntax before, is a [GROQ query](https://www.sanity.io/docs/content-lake/how-queries-work).



The GROQ syntax in this tutorial can be read like this:

- `*` 👈 select all documents
- `[_type == 'post' && slug.current == $slug]` 👈 filter the selection down to documents with the type "post" and those of them who have the same slug to that we have in the parameters
- `[0]` 👈 select the first and only one in that list

Now you need to fetch the right blog post given a certain slug. **Update**`[slug].astro` with the following:

```
---// ./src/pages/post/[slug].astroimport type { SanityDocument } from "@sanity/client";import { loadQuery } from "../../sanity/lib/load-query";export async function getStaticPaths() {  const { data: posts } = await loadQuery<SanityDocument[]>({    query: `*[_type == "post"]`,  });  return posts.map(({ slug }) => {    return {      params: {        slug: slug.current,      },    };  });}const { params } = Astro;const { data: post } = await loadQuery({  query: `*[_type == "post" && slug.current == $slug][0]`,  params,});---<h1>A post about {post.title}</h1>
```



So that's it! You should now be able to see the title of your "Hello World" post under `/post/hello-world`. 

If you have a post titled “Hello world” with “hello-world” as the slug, you should be able to find it in localhost:3000/post/hello-world.



"Why not return the post during getStaticPaths?" - another excellent question dear reader. Similar to the reasoning for wrapping our client in loadQuery, we're fetching data outside getStaticPaths to allow it to refresh when using Presentation. If you don't plan to use Presentation you can return all the data in getStaticPaths.

Render images and block content

Now that you've seen how to display the title, continue to add the other bits of our posts: block content and images.

Background

With Sanity, your blog posts are part of your content model. They can be set up to be whatever you want, but we've used some boilerplate blog post schemas. Your post's title is a [string](https://www.sanity.io/docs/studio/string-type), the published date is saved as a [datetime](https://www.sanity.io/docs/studio/datetime-type) and so on. Sanity has specific tooling for **images** and **block content**, so we'll add those first.

Images

When you use the [`image`](https://www.sanity.io/docs/studio/image-type) field type to allow users to upload images in your Studio, the images are uploaded to [Sanity's CDN (the Asset Pipeline)](https://www.sanity.io/docs/apis-and-sdks/asset-cdn). It's set up so you can request them however you need them: in specific dimensions, image formats, or crops, just to name a few [image transformations](https://www.sanity.io/docs/apis-and-sdks/presenting-images). The way this works is that the image is represented as an ID in your data structure. You can then use this ID to construct image URLs. 

Use the image URL builder from the [@sanity/image-url package](https://www.sanity.io/docs/apis-and-sdks/image-urls) for this. First install the dependency:

```
npm i @sanity/image-url
```



**Create** a new file inside `./src/sanity/lib` called `url-for-image.ts`:

```
// ./src/sanity/lib/url-for-image.tsimport { sanityClient } from 'sanity:client';import imageUrlBuilder from "@sanity/image-url";import type { SanityAsset } from '@sanity/image-url/lib/types/types';export const imageBuilder = imageUrlBuilder(sanityClient);export function urlForImage(source: SanityAsset) {  return imageBuilder.image(source);}
```



As you set up block content in the next step you'll use this function to performantly render your images

Block content and rich text

The blog template saves your blog content in a `array` field of the [`block`](https://www.sanity.io/docs/studio/block-type) type. This will give you block content with rich text, which Sanity saves in a structured format called [Portable Text](https://github.com/portabletext/portabletext). From Portable Text, you can generate Markdown, HTML, PDFs, or whatever else you want. It's very flexible. For this tutorial, you'll convert your Portable Text content to Astro components with the `astro-portabletext` library:

```
npm i astro-portabletext
```



If you're using TypeScript it may be helpful to include the types for Portable Text: 

```
npm install @portabletext/types
```



Then, for convenience, create an Astro component to render our Portable Text for us. **Create** a new file called `PortableText.astro` inside of `./src/components`:

```
---// ./src/components/PortableText.astroimport { PortableText as PortableTextInternal } from 'astro-portabletext'const { portableText } = Astro.props;---<PortableTextInternal value={portableText} />
```



This will render our Portable Text blocks, but we have not yet added a component to handle any custom blocks we added to the Portable Text field, like `image`.

**Create** a file called `PortableTextImage.astro` in the same `components` folder:

```
---// ./src/components/PortableTextImage.astroimport { urlForImage } from "../sanity/lib/url-for-image";const { asset, alt } = Astro.props.node;const url = urlForImage(asset).url();const webpUrl = urlForImage(asset).format("webp").url();---<picture>  <source srcset={webpUrl} type="image/webp" />  <img class="responsive__img" src={url} alt={alt} /></picture>
```



This component will pass the relevant node from the Portable Text content, and we use our `urlForImage` function to calculate the asset URLs to display. Now, you can register this component to be rendered when PortableText encounters an `image` block:

```
---// ./src/components/PortableText.astroimport { PortableText as PortableTextInternal } from 'astro-portabletext'import PortableTextImage from "./PortableTextImage.astro";const { portableText } = Astro.props;const components = {  type: {    image: PortableTextImage,  }};---<PortableTextInternal value={portableText} components={components} />
```



**Update** `[slug].astro` to use the `PortableText` component to render the post content:

```
---// ./src/pages/post/[slug].astroimport type { SanityDocument } from "@sanity/client";import { loadQuery } from "../../sanity/lib/load-query";import PortableText from "../../components/PortableText.astro";export async function getStaticPaths() {  const { data: posts } = await loadQuery<SanityDocument[]>({    query: `*[_type == "post"]`,  });  return posts.map(({ slug }) => {    return {      params: {        slug: slug.current,      },    };  });}const { params } = Astro;const { data: post } = await loadQuery<{ title: string; body: any[] }>({  query: `*[_type == "post" && slug.current == $slug][0]`,  params,});---<h1>A post about {post.title}</h1><PortableText portableText={post.body} />
```



This uses the `PortableText` component we just added renders any content you've added, including links, images, and headings. This is an example of what it could look like:

Bold text, links, images: authored in one rich text field and rendered in one PortableText component

Enable Presentation

Live Visual Editing is made possible via Sanity's Presentation Tool. To enable Presentation we'll follow the steps outlined in the [documentation for the Astro integration](https://www.sanity.io/plugins/sanity-astro#enabling-visual-editing). Presentation provides 2 key benefits:

- **Overlays** - All content stored in Sanity has an overlay added that when clicked brings users directly to editing that content in the Studio
- **Live mode** - Edits made in the Studio are reflected on the front-end to provide authors immediate feedback

Create a layout file with the VisualEditing component

**Update** the `Layout.astro` file inside the `src/layouts` directory with the following:

```
---// ./src/layouts/Layout.astroimport { VisualEditing } from "@sanity/astro/visual-editing";const visualEditingEnabled =  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED == "true";---<!doctype html><html lang="en">  <head>    <meta charset="UTF-8" />		<meta name="viewport" content="width=device-width" />		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />		<meta name="generator" content={Astro.generator} />		<title>Astro Basics</title>  </head>  <body>    <slot />    <VisualEditing enabled={visualEditingEnabled} />  </body></html><style>	html,	body {		margin: 0;		width: 100%;		height: 100%;	}</style>
```



In `Layout.astro` you're importing the `VisualEditing` component, which enables overlays and live mode for Presentation. Note the `visualEditingEnabled` constant tied to an environment variable `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` set to `true`. If you haven't already, update your `.env` file to include this variable. When you're ready to deploy your site you'll want to have this variable set to `false` in production, but have another environment that's a copy of production with this variable set to `true`.

**Update** your `[slug].astro` template to be wrapped in the new layout:

```
---// ./src/pages/post/[slug].astroimport type { SanityDocument } from "@sanity/client";import { loadQuery } from "../../sanity/lib/load-query";import Layout from "../../layouts/Layout.astro";import PortableText from "../../components/PortableText.astro";export async function getStaticPaths() {  const { data: posts } = await loadQuery<SanityDocument[]>({    query: `*[_type == "post"]`,  });  return posts.map(({ slug }) => {    return {      params: {        slug: slug.current,      },    };  });}const { params } = Astro;const { data: post } = await loadQuery<{ title: string; body: any[] }>({  query: `*[_type == "post" && slug.current == $slug][0]`,  params,});---<Layout>  <h1>A post about {post.title}</h1>  <PortableText portableText={post.body} /></Layout>
```



Update settings in `astro.config` file

**Update** the Sanity integration settings in `astro.config.mjs` to include `stega.studioUrl`

```
// astro.config.mjsimport { defineConfig } from "astro/config";import sanity from "@sanity/astro";import react from "@astrojs/react";import { loadEnv } from "vite";const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(  process.env.NODE_ENV,  process.cwd(),  "",);// https://astro.build/configexport default defineConfig({  integrations: [    sanity({      projectId: PUBLIC_SANITY_PROJECT_ID,      dataset: PUBLIC_SANITY_DATASET,      useCdn: false, // See note on using the CDN      apiVersion: "2025-01-28", // insert the current date to access the latest version of the API      studioBasePath: "/studio",      stega: {        studioUrl: "/studio",      },    }),    react(),  ],});
```



Adding this to the configuration allows the overlays to link to the appropriate place.

Generate a viewer token

In Sanity, drafts are considered private and are not accessible without a token. 

In the top right of the Studio click on your user avatar, and click "Manage project"

Select "manage project" from this drop down

In your manage dashboard, navigate to "API" and down to "Tokens". Click "Add token", give it any name you wish, ensure it has "Viewer" permissions, and click "Save"

Navigate to the token settings in manage and create a viewer token

**Add** this token to your `.env` file with the name `SANITY_API_READ_TOKEN`.

Update `loadQuery` to work with Presentation

**Update** `./src/sanity/lib/load-query.ts` to the following:

```
// ./src/sanity/lib/load-query.tsimport { type QueryParams } from "sanity";import { sanityClient } from "sanity:client";const visualEditingEnabled =  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";const token = import.meta.env.SANITY_API_READ_TOKEN;export async function loadQuery<QueryResponse>({  query,  params,}: {  query: string;  params?: QueryParams;}) {  if (visualEditingEnabled && !token) {    throw new Error(      "The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.",    );  }  const perspective = visualEditingEnabled ? "previewDrafts" : "published";  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(    query,    params ?? {},    {      filterResponse: false,      perspective,      resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,      stega: visualEditingEnabled,      ...(visualEditingEnabled ? { token } : {}),    },  );  return {    data: result,    sourceMap: resultSourceMap,    perspective,  };}
```



There are a few things going on here, you're:

- Modifying the `perspective` setting in the client to use `previewDrafts` when Visual Editing is enabled
- Returning a `resultSourceMap` for the overlays to know where to link to
- Passing the token to the client to view drafts and enable Stega encoding (which powers the overlays)

Add the Presentation tool to the Studio

**Update** your `sanity.config.ts` file to include the Presentation tool in the `plugins` array:

```
// ./sanity.config.tsimport { defineConfig } from "sanity";import { structureTool } from "sanity/structure";import { schema } from "./src/sanity/schemaTypes";import { presentationTool } from "sanity/presentation";export default defineConfig({  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,  dataset: import.meta.env.PUBLIC_SANITY_DATASET,  plugins: [    structureTool(),    presentationTool({      previewUrl: location.origin,    }),  ],  schema,});
```



Note the `previewUrl`, set to `location.origin` due to the Studio being embedded in your existing Astro app. If your Studio and front-end were hosted at different URLs you would update this value to point to the hosted front-end.

If you navigate to `http://localhost:4321/studio/presentation` you should see the Presentation tool, and if you put the path to your blog post (`/post/hello-world`) in the tool's address bar you should see your front-end with overlays that bring you directly to your blog post. 

Add Document Location Resolver

[The Document Locations Resolver API](https://www.sanity.io/docs/visual-editing/presentation-resolver-api#k8d8bca7bfcd7) allows you to define *where* data is being used in your application(s), and it also allows you to quickly preview a document from the Structure.

For example if you have an author document open, enabling locations puts a widget at the top of the document with links to all documents on the site where this author is linked to.



Location resolver adds this widget on top of the document

Create a new location resolver

**Create** a new file in `**.**/src/sanity/lib/` , called `resolve.ts`

```
// ./src/sanity/lib/resolve.tsimport { defineLocations } from "sanity/presentation";import type { PresentationPluginOptions } from "sanity/presentation";export const resolve: PresentationPluginOptions["resolve"] = {  locations: {    // Add more locations for other post types    post: defineLocations({      select: {        title: "title",        slug: "slug.current",      },      resolve: (doc) => ({        locations: [          {            title: doc?.title || "Untitled",            href: `/post/${doc?.slug}`,          },        ],      }),    }),  },};
```



Add location resolver to the Studio

**Update** your `sanity.config.ts` file to include the Location tool (`resolve`) inside the `presentationTool`

```
import { defineConfig } from "sanity";import { structureTool } from "sanity/structure";import { schema } from "./src/sanity/schemaTypes";import { presentationTool } from "sanity/presentation";import { resolve } from "./src/sanity/lib/resolve";export default defineConfig({  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,  dataset: import.meta.env.PUBLIC_SANITY_DATASET,  plugins: [    structureTool(),    presentationTool({	  resolve,      previewUrl: location.origin,    }),  ],  schema,});
```



Now each `post` document in your Studio should include a link to open it in Presentation

Document locations show on "post" type documents

[
](https://www.sanity.io/docs/developer-guides/sanity-astro-blog#afbb37941a34)