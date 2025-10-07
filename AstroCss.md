# Styles and CSS

Astro was designed to make styling and writing CSS a breeze. Write your own CSS directly inside of an Astro component or import your favorite CSS library like [Tailwind](https://tailwindcss.com/docs/installation/framework-guides/astro). Advanced styling languages like [Sass](https://sass-lang.com/) and [Less](https://lesscss.org/) are also supported.

## Styling in Astro

Styling an Astro component is as easy as adding a `<style>` tag to your component or page template. When you place a `<style>` tag inside of an Astro component, Astro will detect the CSS and handle your styles for you, automatically.

src/components/MyComponent.astro

```
<style>

  h1 { color: red; }

</style>
```

### Scoped Styles

Astro `<style>` CSS rules are automatically **scoped by default**. Scoped styles are compiled behind-the-scenes to only apply to HTML written inside of that same component. The CSS that you write inside of an Astro component is automatically encapsulated inside of that component.

This CSS:

src/pages/index.astro

```
<style>

  h1 {

    color: red;

  }




  .text {

    color: blue;

  }

</style>
```

Compiles to this:

```
<style>

  h1[data-astro-cid-hhnqfkh6] {

     color: red;

  }




  .text[data-astro-cid-hhnqfkh6] {

    color: blue;

  }

</style>
```

Scoped styles don’t leak and won’t impact the rest of your site. In Astro, it is okay to use low-specificity selectors like `h1 {}` or `p {}` because they will be compiled with scopes in the final output.

Scoped styles also won’t apply to other Astro components contained inside of your template. If you need to style a child component, consider wrapping that component in a `<div>` (or other element) that you can then style.

The specificity of scoped styles is preserved, allowing them to work consistently alongside other CSS files or CSS libraries while still preserving the exclusive boundaries that prevent styles from applying outside the component.

### Global Styles

While we recommend scoped styles for most components, you may eventually find a valid reason to write global, unscoped CSS. You can opt-out of automatic CSS scoping with the `<style is:global>` attribute.

src/components/GlobalStyles.astro

```
<style is:global>

  /* Unscoped, delivered as-is to the browser.

     Applies to all <h1> tags on your site. */

  h1 { color: red; }

</style>
```

You can also mix global & scoped CSS rules together in the same `<style>` tag using the `:global()` selector. This becomes a powerful pattern for applying CSS styles to children of your component.

src/components/MixedStyles.astro

```
<style>

  /* Scoped to this component, only. */

  h1 { color: red; }

  /* Mixed: Applies to child `h1` elements only. */

  article :global(h1) {

    color: blue;

  }

</style>

<h1>Title</h1>

<article><slot /></article>
```

This is a great way to style things like blog posts, or documents with CMS-powered content where the contents live outside of Astro. But be careful: components whose appearance differs based on whether or not they have a certain parent component can become difficult to troubleshoot.

Scoped styles should be used as often as possible. Global styles should be used only as-needed.

### Combining classes with `class:list`

If you need to combine classes on an element dynamically, you can use the `class:list` utility attribute in `.astro` files.

src/components/ClassList.astro

```
---

const { isRed } = Astro.props;

---

<!-- If `isRed` is truthy, class will be "box red". -->

<!-- If `isRed` is falsy, class will be "box". -->

<div class:list={['box', { red: isRed }]}><slot /></div>




<style>

  .box { border: 1px solid blue; }

  .red { border-color: red; }

</style>
```

See our [directives reference](https://docs.astro.build/en/reference/directives-reference/#classlist) page to learn more about `class:list`.

### CSS Variables

**Added in:** `astro@0.21.0`

The Astro `<style>` can reference any CSS variables available on the page. You can also pass CSS variables directly from your component frontmatter using the `define:vars` directive.

src/components/DefineVars.astro

```
---

const foregroundColor = "rgb(221 243 228)";

const backgroundColor = "rgb(24 121 78)";

---

<style define:vars={{ foregroundColor, backgroundColor }}>

  h1 {

    background-color: var(--backgroundColor);

    color: var(--foregroundColor);

  }

</style>

<h1>Hello</h1>
```

See our [directives reference](https://docs.astro.build/en/reference/directives-reference/#definevars) page to learn more about `define:vars`.

### Passing a `class` to a child component

In Astro, HTML attributes like `class` do not automatically pass through to child components.

Instead, accept a `class` prop in the child component and apply it to the root element. When destructuring, you must rename it, because `class` is a [reserved word](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words) in JavaScript.

Using the default scoped style strategy, you must also pass the `data-astro-cid-*` attribute. You can do this by passing the `...rest` of the props to the component. If you have changed `scopedStyleStrategy` to `'class'` or `'where'`, the `...rest` prop is not necessary.

src/components/MyComponent.astro

```
---

const { class: className, ...rest } = Astro.props;

---

<div class={className} {...rest}>

  <slot/>

</div>
```

src/pages/index.astro

```
---

import MyComponent from "../components/MyComponent.astro"

---

<style>

  .red {

    color: red;

  }

</style>

<MyComponent class="red">This will be red!</MyComponent>
```

Scoped styles from parent components

Because the `data-astro-cid-*` attribute includes the child in its parent’s scope, it is possible for styles to cascade from parent to child. To avoid this having unintended side effects, ensure you use unique class names in the child component.

### Inline styles

You can style HTML elements inline using the `style` attribute. This can be a CSS string or an object of CSS properties:

src/pages/index.astro

```
// These are equivalent:

<p style={{ color: "brown", textDecoration: "underline" }}>My text</p>

<p style="color: brown; text-decoration: underline;">My text</p>
```

## External Styles

There are two ways to resolve external global stylesheets: an ESM import for files located within your project source, and an absolute URL link for files in your `public/` directory, or hosted outside of your project.

Read more about using [static assets](https://docs.astro.build/en/guides/imports/) located in `public/` or `src/`.

### Import a local stylesheet

Using an npm package?

You may need to update your `astro.config` when importing from npm packages. See the [“import stylesheets from an npm package” section](https://docs.astro.build/en/guides/styling/#import-a-stylesheet-from-an-npm-package) below.

You can import stylesheets in your Astro component frontmatter using ESM import syntax. CSS imports work like [any other ESM import in an Astro component](https://docs.astro.build/en/basics/astro-components/#the-component-script), which should be referenced as **relative to the component** and must be written at the **top** of your component script, with any other imports.

src/pages/index.astro

```
---

// Astro will bundle and optimize this CSS for you automatically

// This also works for preprocessor files like .scss, .styl, etc.

import '../styles/utils.css';

---

<html><!-- Your page here --></html>
```

CSS `import` via ESM are supported inside of any JavaScript file, including JSX components like React & Preact. This can be useful for writing granular, per-component styles for your React components.

### Import a stylesheet from an npm package

You may also need to load stylesheets from an external npm package. This is especially common for utilities like [Open Props](https://open-props.style/). If your package **recommends using a file extension** (i.e. `package-name/styles.css` instead of `package-name/styles`), this should work like any local stylesheet:

src/pages/random-page.astro

```
---

import 'package-name/styles.css';

---

<html><!-- Your page here --></html>
```

If your package **does not suggest using a file extension** (i.e. `package-name/styles`), you’ll need to update your Astro config first!

Say you are importing a CSS file from `package-name` called `normalize` (with the file extension omitted). To ensure we can prerender your page correctly, add `package-name` to [the `vite.ssr.noExternal` array](https://vite.dev/config/ssr-options.html#ssr-noexternal):

astro.config.mjs

```
import { defineConfig } from 'astro/config';




export default defineConfig({

  vite: {

    ssr: {

      noExternal: ['package-name'],

    }

  }

})
```

Note

This is a [Vite-specific setting](https://vite.dev/config/ssr-options.html#ssr-noexternal) that does *not* relate to (or require) [Astro SSR](https://docs.astro.build/en/guides/on-demand-rendering/).

Now, you are free to import `package-name/normalize`. This will be bundled and optimized by Astro like any other local stylesheet.

src/pages/random-page.astro

```
---

import 'package-name/normalize';

---

<html><!-- Your page here --></html>
```

### Load a static stylesheet via “link” tags

You can also use the `<link>` element to load a stylesheet on the page. This should be an absolute URL path to a CSS file located in your `/public` directory, or an URL to an external website. Relative `<link>` href values are not supported.

src/pages/index.astro

```
<head>

  <!-- Local: /public/styles/global.css -->

  <link rel="stylesheet" href="/styles/global.css" />

  <!-- External -->

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css" />

</head>
```

Because this approach uses the `public/` directory, it skips the normal CSS processing, bundling and optimizations that are provided by Astro. If you need these transformations, use the [Import a Stylesheet](https://docs.astro.build/en/guides/styling/#import-a-local-stylesheet) method above.

## Cascading Order

Astro components will sometimes have to evaluate multiple sources of CSS. For example, your component might import a CSS stylesheet, include its own `<style>` tag, *and* be rendered inside a layout that imports CSS.

When conflicting CSS rules apply to the same element, browsers first use *specificity* and then *order of appearance* to determine which value to show.

If one rule is more *specific* than another, no matter where the CSS rule appears, its value will take precedence:

src/components/MyComponent.astro

```
<style>

  h1 { color: red }

  div > h1 {

    color: purple

  }

</style>

<div>

  <h1>

    This header will be purple!

  </h1>

</div>
```

If two rules have the same specificity, then the *order of appearance* is evaluated, and the last rule’s value will take precedence:

src/components/MyComponent.astro

```
<style>

  h1 { color: purple }

  h1 { color: red }

</style>

<div>

  <h1>

    This header will be red!

  </h1>

</div>
```

Astro CSS rules are evaluated in this order of appearance:

- **`<link>` tags in the head** (lowest precedence)
- **imported styles**
- **scoped styles** (highest precedence)

### Scoped Styles

Depending on your chosen value for [`scopedStyleStrategy`](https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy), scoped styles may or may not increase the [CLASS column specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity#class_column).

However, [scoped styles](https://docs.astro.build/en/guides/styling/#scoped-styles) will always come last in the order of appearance. These styles will therefore take precedence over other styles of the same specificity. For example, if you import a stylesheet that conflicts with a scoped style, the scoped style’s value will apply:

src/components/make-it-purple.css

```
h1 {

  color: purple;

}
```

src/components/MyComponent.astro

```
---

import "./make-it-purple.css"

---

<style>

  h1 { color: red }

</style>

<div>

  <h1>

    This header will be red!

  </h1>

</div>
```

Scoped styles will be overwritten if the imported style is more specific. The style with a higher specificity will take precedence over the scoped style:

src/components/make-it-purple.css

```
#intro {

  color: purple;

}
```

src/components/MyComponent.astro

```
---

import "./make-it-purple.css"

---

<style>

  h1 { color: red }

</style>

<div>

  <h1 id="intro">

    This header will be purple!

  </h1>

</div>
```

### Import Order

When importing multiple stylesheets in an Astro component, the CSS rules are evaluated in the order that they are imported. A higher specificity will always determine which styles to show, no matter when the CSS is evaluated. But, when conflicting styles have the same specificity, the *last one imported* wins:

src/components/make-it-purple.css

```
div > h1 {

  color: purple;

}
```

src/components/make-it-green.css

```
div > h1 {

  color: green;

}
```

src/components/MyComponent.astro

```
---

import "./make-it-green.css"

import "./make-it-purple.css"

---

<style>

  h1 { color: red }

</style>

<div>

  <h1>

    This header will be purple!

  </h1>

</div>
```

While `<style>` tags are scoped and only apply to the component that declares them, *imported*CSS can “leak”. Importing a component applies any CSS it imports, even if the component is never used:

src/components/PurpleComponent.astro

```
---

import "./make-it-purple.css"

---

<div>

  <h1>I import purple CSS.</h1>

</div>
```

src/components/MyComponent.astro

```
---

import "./make-it-green.css"

import PurpleComponent from "./PurpleComponent.astro";

---

<style>

  h1 { color: red }

</style>

<div>

  <h1>

    This header will be purple!

  </h1>

</div>
```

Tip

A common pattern in Astro is to import global CSS inside a [Layout component](https://docs.astro.build/en/basics/layouts/). Be sure to import the Layout component before other imports so that it has the lowest precedence.

### Link Tags

Style sheets loaded via [link tags](https://docs.astro.build/en/guides/styling/#load-a-static-stylesheet-via-link-tags) are evaluated in order, before any other styles in an Astro file. Therefore, these styles will have lower precedence than imported stylesheets and scoped styles:

src/pages/index.astro

```
---

import "../components/make-it-purple.css"

---




<html lang="en">

  <head>

    <meta charset="utf-8" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta name="viewport" content="width=device-width" />

    <meta name="generator" content={Astro.generator} />

    <title>Astro</title>

    <link rel="stylesheet" href="/styles/make-it-blue.css" />

  </head>

  <body>

    <div>

      <h1>This will be purple</h1>

    </div>

  </body>

</html>
```