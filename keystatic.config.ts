import { config, fields, collection, singleton } from "@keystatic/core";

const repo =
  process.env.KEYSTATIC_GITHUB_REPO?.trim() ||
  (process.env.GITHUB_REPOSITORY_OWNER && process.env.GITHUB_REPOSITORY_NAME
    ? `${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.GITHUB_REPOSITORY_NAME}`
    : "tuliopc23/tulio-personal-website");

export default config({
  // Always use GitHub storage so the `/keystatic/setup` flow is available.
  // Keystatic falls back to a setup prompt when OAuth secrets are missing.
  storage: {
    kind: "github",
    repo: repo as `${string}/${string}`,
  },
  singletons: {
    blogPage: singleton({
      label: "Blog page",
      path: "src/content/site/blog-page",
      format: { data: "yaml" },
      schema: {
        pageDescription: fields.text({ label: "Page description", multiline: true }),
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroTitle: fields.text({ label: "Hero title" }),
        heroLede: fields.text({ label: "Hero lede", multiline: true }),
        emptyStateTitle: fields.text({ label: "Empty state title" }),
        emptyStateBody: fields.text({ label: "Empty state body", multiline: true }),
        archiveHeading: fields.text({ label: "Archive heading" }),
        archiveLede: fields.text({ label: "Archive lede", multiline: true }),
        allArticlesLabel: fields.text({ label: "All articles label" }),
        loadOlderLabel: fields.text({ label: "Load older label" }),
        filterEmptyState: fields.text({ label: "Filter empty state" }),
        spotlightTags: fields.array(fields.text({ label: "Tag" }), { label: "Spotlight tags" }),
        placeholderCards: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            summary: fields.text({ label: "Summary", multiline: true }),
            href: fields.text({ label: "Link href" }),
            tags: fields.array(fields.text({ label: "Tag" }), { label: "Tags" }),
          }),
          { label: "Placeholder cards" },
        ),
      },
    }),
    aboutPage: singleton({
      label: "About page",
      path: "src/content/site/about-page",
      format: { data: "yaml" },
      schema: {
        seoDescription: fields.text({ label: "SEO description", multiline: true }),
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroTitle: fields.text({ label: "Hero title" }),
        heroLede: fields.text({ label: "Hero lede", multiline: true }),
        sections: fields.array(
          fields.object({
            icon: fields.text({ label: "Icon" }),
            eyebrow: fields.text({ label: "Eyebrow" }),
            title: fields.text({ label: "Title" }),
            body: fields.text({ label: "Body", multiline: true }),
          }),
          { label: "Sections" },
        ),
      },
    }),
    projectsPage: singleton({
      label: "Projects page",
      path: "src/content/site/projects-page",
      format: { data: "yaml" },
      schema: {
        description: fields.text({ label: "SEO description", multiline: true }),
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroTitle: fields.text({ label: "Hero title" }),
        heroLede: fields.text({ label: "Hero lede", multiline: true }),
        filterEmptyTitle: fields.text({ label: "Filter empty title" }),
        filterEmptyBody: fields.text({ label: "Filter empty body", multiline: true }),
        pageEmptyTitle: fields.text({ label: "Page empty title" }),
        pageEmptyBody: fields.text({ label: "Page empty body", multiline: true }),
        contactEmail: fields.text({ label: "Contact email" }),
        caseStudies: fields.array(
          fields.object({
            icon: fields.text({ label: "Icon" }),
            eyebrow: fields.text({ label: "Eyebrow" }),
            title: fields.text({ label: "Title" }),
            headline: fields.text({ label: "Headline" }),
            lede: fields.text({ label: "Lede", multiline: true }),
            role: fields.text({ label: "Role" }),
            status: fields.select({
              label: "Status",
              options: [
                { label: "Live", value: "live" },
                { label: "Maintained", value: "maintained" },
                { label: "Exploration", value: "exploration" },
              ],
              defaultValue: "live",
            }),
            href: fields.text({ label: "Href" }),
            stack: fields.array(fields.text({ label: "Item" }), { label: "Stack" }),
            images: fields.array(
              fields.object({
                alt: fields.text({ label: "Alt" }),
                file: fields.image({
                  label: "Image",
                  directory: "public/images/case-studies",
                  publicPath: "/images/case-studies/",
                }),
              }),
              { label: "Images" },
            ),
          }),
          { label: "Case studies" },
        ),
      },
    }),
    featuredGithub: singleton({
      label: "Featured GitHub repos",
      path: "src/content/site/featured-github",
      format: { data: "yaml" },
      schema: {
        repos: fields.array(
          fields.object({
            id: fields.text({ label: "ID" }),
            repoFullName: fields.text({ label: "owner/repo" }),
            displayTitle: fields.text({ label: "Display title" }),
            description: fields.text({ label: "Description override", multiline: true }),
            category: fields.text({ label: "Category" }),
            featured: fields.checkbox({ label: "Featured", defaultValue: true }),
            order: fields.number({ label: "Order" }),
            showRepositoryLink: fields.checkbox({ label: "Show repo link", defaultValue: true }),
            showPrivate: fields.checkbox({ label: "Show private repos", defaultValue: false }),
            visibleInProofOfWork: fields.checkbox({
              label: "Visible in proof of work",
              defaultValue: true,
            }),
          }),
          { label: "Repositories" },
        ),
      },
    }),
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "slug",
      path: "src/content/posts/*",
      format: { contentField: "body" },
      schema: {
        title: fields.text({ label: "Title" }),
        slug: fields.text({ label: "Slug" }),
        publishedAt: fields.datetime({ label: "Published at" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tags" }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        audience: fields.text({ label: "Audience" }),
        intent: fields.text({ label: "Intent" }),
        targetKeyword: fields.text({ label: "Target keyword" }),
        evergreenStatus: fields.text({ label: "Evergreen status" }),
        series: fields.text({ label: "Series label" }),
        coverVariant: fields.select({
          label: "Cover variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Cinematic", value: "cinematic" },
            { label: "Minimal", value: "minimal" },
          ],
          defaultValue: "default",
        }),
        categorySlugs: fields.array(fields.text({ label: "Slug" }), { label: "Category slugs" }),
        topicSlugs: fields.array(fields.text({ label: "Slug" }), { label: "Topic slugs" }),
        seriesSlugs: fields.array(fields.text({ label: "Slug" }), { label: "Series slugs" }),
        keyTakeaways: fields.array(fields.text({ label: "Takeaway" }), { label: "Key takeaways" }),
        pullQuotes: fields.array(
          fields.object({
            quote: fields.text({ label: "Quote", multiline: true }),
            attribution: fields.text({ label: "Attribution" }),
            // Allow empty values (matches `seoCanonicalUrl: string | ""` pattern in content schema)
            sourceUrl: fields.text({ label: "Source URL" }),
          }),
          { label: "Pull quotes" },
        ),
        furtherReading: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            // Allow empty values
            href: fields.text({ label: "URL" }),
            note: fields.text({ label: "Note" }),
          }),
          { label: "Further reading" },
        ),
        sourceReferences: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            // Allow empty values
            url: fields.text({ label: "URL" }),
            sourceType: fields.text({ label: "Source type" }),
            author: fields.text({ label: "Author" }),
            capturedExcerpt: fields.text({ label: "Excerpt", multiline: true }),
          }),
          { label: "Sources" },
        ),
        distributionPackage: fields.object({
          newsletterBlurb: fields.text({ label: "Newsletter blurb", multiline: true }),
          shortSocialPost: fields.text({ label: "Short social", multiline: true }),
          longSocialPost: fields.text({ label: "Long social", multiline: true }),
          teaserQuote: fields.text({ label: "Teaser quote" }),
          ctaLabel: fields.text({ label: "CTA label" }),
        }),
        seoMetaTitle: fields.text({ label: "SEO title" }),
        seoMetaDescription: fields.text({ label: "SEO description", multiline: true }),
        // Allow empty (your zod schema allows url OR "")
        seoCanonicalUrl: fields.text({ label: "Canonical URL" }),
        seoNoIndex: fields.checkbox({ label: "No index", defaultValue: false }),
        seoJsonLd: fields.text({ label: "JSON-LD", multiline: true }),
        authorName: fields.text({ label: "Author name", defaultValue: "Tulio Cunha" }),
        authorSlug: fields.text({ label: "Author slug", defaultValue: "tulio-cunha" }),
        authorRole: fields.text({ label: "Author role" }),
        heroImage: fields.image({
          label: "Hero image",
          directory: "src/assets/images/posts",
          publicPath: "@assets/images/posts/",
        }),
        heroCaption: fields.text({ label: "Hero caption" }),
        body: fields.mdx({
          label: "Body",
          options: {
            bold: true,
            italic: true,
            strikethrough: true,
            code: true,
            heading: true,
            blockquote: true,
            orderedList: true,
            unorderedList: true,
            link: true,
            table: true,
            codeBlock: true,
            image: {
              directory: "src/assets/images/posts",
              publicPath: "@assets/images/posts/",
            },
          },
        }),
      },
    }),
    taxonomyCategories: collection({
      label: "Categories",
      slugField: "slug",
      path: "src/content/taxonomy/categories/*",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        slug: fields.text({ label: "Slug" }),
        description: fields.text({ label: "Description", multiline: true }),
        archiveIntro: fields.text({ label: "Archive intro", multiline: true }),
      },
    }),
    taxonomyTopics: collection({
      label: "Topics",
      slugField: "slug",
      path: "src/content/taxonomy/topics/*",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        slug: fields.text({ label: "Slug" }),
        description: fields.text({ label: "Description", multiline: true }),
        archiveIntro: fields.text({ label: "Archive intro", multiline: true }),
      },
    }),
    taxonomySeries: collection({
      label: "Series",
      slugField: "slug",
      path: "src/content/taxonomy/series/*",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        slug: fields.text({ label: "Slug" }),
        description: fields.text({ label: "Description", multiline: true }),
        positioning: fields.text({ label: "Positioning", multiline: true }),
      },
    }),
  },
});
