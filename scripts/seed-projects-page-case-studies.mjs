import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing required env vars. Expected PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.",
  );
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-03-16",
  useCdn: false,
});

const heroDefaults = {
  description:
    "Case studies on native apps, web platforms, backend systems, and developer tools — client work and indie projects that shipped.",
  heroEyebrow: "Case Studies",
  heroTitle: "Case Studies",
  heroLede:
    "Real work, real constraints, real deadlines. Client builds and indie projects that made it to production — with the decisions, tradeoffs, and technical details behind them.",
  contactEmail: "contact@tuliocunha.dev",
  filterEmptyTitle: "No projects in this slice yet",
  filterEmptyBody:
    "Try another track, or email if you want technical context on work that is not written up here:",
  pageEmptyTitle: "Project notes are being prepared",
  pageEmptyBody:
    "The work exists. The write-ups are catching up. Email if you want implementation details:",
};

const caseStudies = [
  {
    _key: "cardmaniacs",
    _type: "caseStudy",
    icon: "desktop-tower",
    eyebrow: "Indie App",
    title: "CardManiacs",
    headline: "A native content platform built from scratch with Swift and strict concurrency.",
    lede: "Three apps in one — reader, aggregator, and discovery engine. Mac-first, optimized for iOS and iPadOS. Vim-style keyboard navigation on the card grid, on-device AI summaries, and the ability to parse everything from RSS feeds to YouTube videos and podcasts. No Electron. No wrappers. Pure platform code.",
    role: "Creator & Solo Developer",
    stack: ["Swift", "SwiftUI", "AppKit", "Strict Concurrency"],
    status: "live",
    images: [
      {
        file: "Case Studies/Cardmaniacs-images/Cardmaniacs-mac - 1.png",
        alt: "CardManiacs dark mode card grid with article previews",
      },
      {
        file: "Case Studies/Cardmaniacs-images/Cardmaniacs-mac - 2.png",
        alt: "CardManiacs article reader with on-device AI summary",
      },
    ],
  },
  {
    _key: "offside",
    _type: "caseStudy",
    icon: "soccer-ball",
    eyebrow: "Publication",
    title: "The Offside",
    headline:
      "A football publication with league tables, real-time data, and a Highbury-inspired soul.",
    lede: "International football publication focused on the Premier League and European football. Svelte components powering live league tables, aggressive caching, load balancing, and a design language inspired by Highbury and Aimé Leon Dore — designed and built for a long-time friend. Arsenal through and through. Go Gunners.",
    role: "Designer & Lead Developer",
    stack: ["Svelte", "SvelteKit", "Tailwind CSS"],
    href: "https://theoffside.club",
    status: "live",
    images: [
      {
        file: "Case Studies/The Offside/theoffside 1.jpeg",
        alt: "The Offside editorial homepage with Highbury-inspired design",
      },
      {
        file: "Case Studies/The Offside/theoffside 2.jpeg",
        alt: "The Offside Premier League table and matchday board",
      },
    ],
  },
  {
    _key: "capital",
    _type: "caseStudy",
    icon: "chart-line-up",
    eyebrow: "Client Work",
    title: "Capital Financial Consulting",
    headline:
      "A wealth management platform with dashboards, charts, and guided financial planning.",
    lede: "Rich web platform for an independent financial consulting firm in Brazil. Beautiful data visualizations, fast dashboards, and an intuitive experience for both consultants and clients. Think a top-notch personal finance app, but with a real professional guiding your financial health — not an algorithm.",
    role: "Full Stack Developer",
    stack: ["React", "PostgreSQL", "Hono"],
    status: "live",
    images: [
      {
        file: "Case Studies/Capital-Financial-Consulting/Capital.jpeg",
        alt: "Capital Financial Consulting landing page",
      },
      {
        file: "Case Studies/Capital-Financial-Consulting/relatorioscapital.png",
        alt: "Capital Financial Consulting consultant dashboard with charts",
      },
    ],
  },
  {
    _key: "nomadz",
    _type: "caseStudy",
    icon: "compass",
    eyebrow: "Client Work",
    title: "Nomadz Trips",
    headline:
      "A travel platform that handles bookings, content, and payments behind one seamless experience.",
    lede: "International travel agency specializing in group experiences. SSR pages tuned for SEO with a full operational backend — custom dashboard, Stripe integration, CMS-driven content, and a blog that actually ranks. The frontend looks effortless; the infrastructure behind it is anything but.",
    role: "Full Stack Developer",
    stack: ["Payload CMS", "React", "Tailwind CSS", "Stripe"],
    status: "live",
    images: [
      {
        file: "Case Studies/Nomadz-trips/Nomadz-landscapes.jpeg",
        alt: "Nomadz Trips homepage with aerial beach photography",
      },
      {
        file: "Case Studies/Nomadz-trips/Nomadz-landscapes 1.jpeg",
        alt: "Nomadz Trips trip listing and booking interface",
      },
    ],
  },
];

async function uploadImage(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  const stream = fs.createReadStream(absolutePath);
  const fileName = path.basename(absolutePath);
  const asset = await client.assets.upload("image", stream, { filename: fileName });
  return asset._id;
}

async function main() {
  console.log(`Seeding projectsPage.caseStudies in ${projectId}/${dataset}`);

  const existing = await client.fetch(
    '*[_type == "projectsPage" && _id == "projectsPage"][0]{_id}',
  );
  if (!existing?._id) {
    await client.create({
      _id: "projectsPage",
      _type: "projectsPage",
      ...heroDefaults,
      caseStudies: [],
    });
    console.log("Created projectsPage singleton.");
  }

  const prepared = [];
  for (const study of caseStudies) {
    const images = [];
    for (const image of study.images) {
      const assetId = await uploadImage(image.file);
      images.push({
        _type: "image",
        _key: `${study._key}-${path
          .basename(image.file)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`,
        asset: { _type: "reference", _ref: assetId },
        alt: image.alt,
      });
      console.log(`Uploaded ${image.file}`);
    }
    prepared.push({
      _key: study._key,
      _type: "caseStudy",
      icon: study.icon,
      eyebrow: study.eyebrow,
      title: study.title,
      headline: study.headline,
      lede: study.lede,
      role: study.role,
      stack: study.stack,
      status: study.status,
      href: study.href,
      images,
    });
  }

  await client.patch("projectsPage").set({ caseStudies: prepared }).commit();
  console.log("Updated projectsPage.caseStudies successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
