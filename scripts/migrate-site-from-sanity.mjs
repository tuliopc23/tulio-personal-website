/**
 * Writes Keystatic-shaped YAML singletons / collections from Sanity (public CDN OK).
 */
import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "yaml";

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  useCdn: true,
});

async function writeYaml(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, yaml.stringify(data), "utf8");
}

async function main() {
  const blogPage = await client.fetch(`*[_type == "blogPage"][0]{...}`);
  if (blogPage)
    await writeYaml("src/content/site/blog-page/index.yaml", {
      pageDescription: blogPage.pageDescription,
      heroEyebrow: blogPage.heroEyebrow,
      heroTitle: blogPage.heroTitle,
      heroLede: blogPage.heroLede,
      emptyStateTitle: blogPage.emptyStateTitle,
      emptyStateBody: blogPage.emptyStateBody,
      archiveHeading: blogPage.archiveHeading,
      archiveLede: blogPage.archiveLede,
      allArticlesLabel: blogPage.allArticlesLabel,
      loadOlderLabel: blogPage.loadOlderLabel,
      filterEmptyState: blogPage.filterEmptyState,
      spotlightTags: blogPage.spotlightTags ?? [],
      placeholderCards: blogPage.placeholderCards ?? [],
    });

  const aboutPage = await client.fetch(`*[_type == "aboutPage"][0]{...}`);
  if (aboutPage)
    await writeYaml("src/content/site/about-page/index.yaml", {
      seoDescription: aboutPage.seoDescription,
      heroEyebrow: aboutPage.heroEyebrow,
      heroTitle: aboutPage.heroTitle,
      heroLede: aboutPage.heroLede,
      sections: (aboutPage.sections ?? []).map((s) => ({
        icon: s.icon,
        eyebrow: s.eyebrow,
        title: s.title,
        body: s.body,
      })),
    });

  const projectsPage = await client.fetch(`*[_type == "projectsPage"][0]{
    ...,
    caseStudies[]{
      _key,
      icon,
      eyebrow,
      title,
      headline,
      lede,
      role,
      status,
      href,
      stack,
      images[]{
        alt,
        "url": asset->url
      }
    }
  }`);
  if (projectsPage) {
    await writeYaml("src/content/site/projects-page/index.yaml", {
      description: projectsPage.description,
      heroEyebrow: projectsPage.heroEyebrow,
      heroTitle: projectsPage.heroTitle,
      heroLede: projectsPage.heroLede,
      filterEmptyTitle: projectsPage.filterEmptyTitle,
      filterEmptyBody: projectsPage.filterEmptyBody,
      pageEmptyTitle: projectsPage.pageEmptyTitle,
      pageEmptyBody: projectsPage.pageEmptyBody,
      contactEmail: projectsPage.contactEmail,
      caseStudies: (projectsPage.caseStudies ?? []).map((cs) => ({
        icon: cs.icon,
        eyebrow: cs.eyebrow,
        title: cs.title,
        headline: cs.headline,
        lede: cs.lede,
        role: cs.role,
        status: cs.status,
        href: cs.href,
        stack: cs.stack ?? [],
        images: (cs.images ?? []).map((img) => ({
          alt: img.alt,
          url: img.url,
        })),
      })),
    });
  }

  const repos = await client.fetch(
    `*[_type == "featuredGithubRepo" && featured == true && visibleInProofOfWork == true] | order(order asc) {
      _id,
      repoFullName,
      displayTitle,
      description,
      category,
      featured,
      order,
      showRepositoryLink,
      showPrivate,
      visibleInProofOfWork
    }`,
  );
  await writeYaml("src/content/site/featured-github/index.yaml", {
    repos: (repos ?? []).map((r) => ({
      id: r._id,
      repoFullName: r.repoFullName,
      displayTitle: r.displayTitle,
      description: r.description,
      category: r.category,
      featured: r.featured,
      order: r.order,
      showRepositoryLink: r.showRepositoryLink,
      showPrivate: r.showPrivate,
      visibleInProofOfWork: r.visibleInProofOfWork,
    })),
  });

  const categories = await client.fetch(
    `*[_type == "category"] | order(title asc){ title, "slug": slug.current, description, archiveIntro }`,
  );
  for (const c of categories ?? []) {
    if (!c?.slug) continue;
    await writeYaml(`src/content/taxonomy/categories/${c.slug}/index.yaml`, {
      title: c.title,
      slug: c.slug,
      description: c.description,
      archiveIntro: c.archiveIntro,
    });
  }

  const topics = await client.fetch(
    `*[_type == "topic"] | order(title asc){ title, "slug": slug.current, description, archiveIntro }`,
  );
  for (const t of topics ?? []) {
    if (!t?.slug) continue;
    await writeYaml(`src/content/taxonomy/topics/${t.slug}/index.yaml`, {
      title: t.title,
      slug: t.slug,
      description: t.description,
      archiveIntro: t.archiveIntro,
    });
  }

  const series = await client.fetch(
    `*[_type == "series"] | order(title asc){ title, "slug": slug.current, description, positioning }`,
  );
  for (const s of series ?? []) {
    if (!s?.slug) continue;
    await writeYaml(`src/content/taxonomy/series/${s.slug}/index.yaml`, {
      title: s.title,
      slug: s.slug,
      description: s.description,
      positioning: s.positioning,
    });
  }

  const projects = await client.fetch(
    `*[_type == "project"] | order(coalesce(order, 9999) asc, releaseDate desc) {
      title,
      "slug": slug.current,
      role,
      summary,
      status,
      href,
      cta,
      releaseDate,
      categories,
      stack,
      order,
      coverImage {
        alt,
        "url": asset->url
      }
    }`,
  );
  for (const p of projects ?? []) {
    if (!p?.slug) continue;
    await writeYaml(`src/content/projects/${p.slug}/index.yaml`, {
      title: p.title,
      slug: p.slug,
      role: p.role,
      summary: p.summary,
      status: p.status,
      href: p.href,
      cta: p.cta,
      releaseDate: p.releaseDate,
      categories: p.categories ?? [],
      stack: p.stack ?? [],
      order: p.order,
      coverImageUrl: p.coverImage?.url ?? null,
      coverImageAlt: p.coverImage?.alt ?? null,
    });
  }

  console.log("Site content migrated from Sanity.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
