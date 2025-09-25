import type { ImageMetadata } from "astro";

import HackerfolioImage from "../assets/hackerfolio.png";
import LiquidifyImage from "../assets/liquidify.png";

type BadgeTone = "blue" | "teal" | "pink" | "indigo" | "orange";

type ProjectBadge = {
  label: string;
  tone?: BadgeTone;
};

type ProjectMedia =
  | {
      type: "image";
      src: ImageMetadata;
      alt: string;
    }
  | {
      type: "icon";
      icon: "github";
      tint?: BadgeTone;
    };

export type Project = {
  id: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  href: string;
  cta: string;
  releaseDate: string;
  badge?: ProjectBadge;
  media: ProjectMedia;
};

export const projects: Project[] = [
  {
    id: "liquidify",
    title: "LiqUIdify",
    summary:
      "React component library inspired by Apple's latest OS glassmorphism, built for makers shipping fluid web interfaces.",
    role: "Creator & UI Engineer",
    stack: ["React", "Ark UI", "Panda CSS"],
    href: "https://www.useliquidify.dev",
    cta: "Explore LiqUIdify",
    releaseDate: "2024-08-01",
    badge: {
      label: "Design system",
      tone: "teal",
    },
    media: {
      type: "image",
      src: LiquidifyImage,
      alt: "Screenshot of the LiqUIdify interface showcasing the liquid glass UI.",
    },
  },
  {
    id: "hackerfolio",
    title: "Hackerfolio",
    summary:
      "Terminal-inspired personal site that accepts commands like ls, grep, and whoami while revealing my story as output.",
    role: "Designer & Full Stack Developer",
    stack: ["Bun", "Elysia", "Tailwind v4", "TanStack Query", "TanStack Router"],
    href: "https://www.tuliocunha.dev",
    cta: "Visit Hackerfolio",
    releaseDate: "2024-02-01",
    media: {
      type: "image",
      src: HackerfolioImage,
      alt: "Screenshot of the Hackerfolio terminal-style homepage.",
    },
  },
  {
    id: "switchify",
    title: "Switchify",
    summary:
      "SwiftUI macOS switcher that keeps windows close at hand with blazing-fast keyboard driven navigation.",
    role: "Swift Engineer",
    stack: ["Swift", "SwiftUI", "AppKit"],
    href: "https://github.com/tuliopc23/Switchify",
    cta: "View Switchify on GitHub",
    releaseDate: "2023-06-15",
    badge: {
      label: "macOS app",
      tone: "indigo",
    },
    media: {
      type: "icon",
      icon: "github",
      tint: "indigo",
    },
  },
  {
    id: "cockpit",
    title: "Cockpit",
    summary:
      "Safari extension command palette paired with a native companion app to remove friction from keyboard-first iPadOS browsing.",
    role: "Product Engineer",
    stack: ["Swift", "Safari App Extensions", "SwiftUI"],
    href: "https://github.com/tuliopc23/Cockpit.app",
    cta: "View Cockpit repo",
    releaseDate: "2023-01-20",
    badge: {
      label: "Safari extension",
      tone: "pink",
    },
    media: {
      type: "icon",
      icon: "github",
      tint: "blue",
    },
  },
  {
    id: "swiftget-cli",
    title: "Swiftget CLI",
    summary:
      "Swift command-line tool for lightning fast file downloads plus a friendly HTTP and API client experience.",
    role: "Systems Engineer",
    stack: ["Swift", "CLI", "Networking"],
    href: "https://github.com/tuliopc23/swiftgetcli",
    cta: "View Swiftget CLI repo",
    releaseDate: "2022-07-10",
    badge: {
      label: "CLI tooling",
      tone: "orange",
    },
    media: {
      type: "icon",
      icon: "github",
      tint: "orange",
    },
  },
];

export const projectsSorted = [...projects].sort((a, b) =>
  a.releaseDate > b.releaseDate ? -1 : a.releaseDate < b.releaseDate ? 1 : 0
);
