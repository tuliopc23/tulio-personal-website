import type { ImageMetadata } from "astro";

import HackerfolioImage from "../assets/hackerfolio.png";
import LiquidifyImage from "../assets/liquidify.png";

type BadgeTone = "blue" | "teal" | "pink" | "indigo" | "orange";

type ProjectCategory = "native" | "web" | "tooling" | "design-system" | "experience";

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
  impact?: string;
  status?: "Live" | "Maintained" | "Exploration";
  stack: string[];
  href: string;
  cta: string;
  releaseDate: string;
  categories: ProjectCategory[];
  media: ProjectMedia;
};

export const projects: Project[] = [
  {
    id: "liquidify",
    title: "LiqUIdify",
    summary:
      "React component library inspired by Apple's latest OS glassmorphism, built for makers shipping fluid web interfaces.",
    role: "Creator & UI Engineer",
    impact: "Used as a design system accelerator for premium UI prototypes.",
    status: "Live",
    stack: ["React", "Ark UI", "Panda CSS"],
    href: "https://www.useliquidify.dev",
    cta: "Explore LiqUIdify",
    releaseDate: "2024-08-01",
    categories: ["web", "design-system"],
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
    impact: "Personal flagship portfolio proving command-first interaction design.",
    status: "Live",
    stack: ["Bun", "Elysia", "Tailwind v4", "TanStack Query", "TanStack Router"],
    href: "https://portfolio.tuliocunha.dev",
    cta: "Visit Hackerfolio",
    releaseDate: "2024-02-01",
    categories: ["web", "experience"],
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
    impact: "Improved desktop task switching ergonomics for keyboard-first workflows.",
    status: "Maintained",
    stack: ["Swift", "SwiftUI", "AppKit"],
    href: "https://github.com/tuliopc23/Switchify",
    cta: "View Switchify on GitHub",
    releaseDate: "2023-06-15",
    categories: ["native", "tooling"],
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
    impact: "Reduced browsing friction with command-palette interaction patterns.",
    status: "Maintained",
    stack: ["Swift", "Safari App Extensions", "SwiftUI"],
    href: "https://github.com/tuliopc23/Cockpit.app",
    cta: "View Cockpit repo",
    releaseDate: "2023-01-20",
    categories: ["native", "experience"],
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
    impact: "Built a practical CLI utility for fast network and file workflows.",
    status: "Exploration",
    stack: ["Swift", "CLI", "Networking"],
    href: "https://github.com/tuliopc23/swiftgetcli",
    cta: "View Swiftget CLI repo",
    releaseDate: "2022-07-10",
    categories: ["tooling", "native"],
    media: {
      type: "icon",
      icon: "github",
      tint: "orange",
    },
  },
];

export const projectsSorted = [...projects].sort((a, b) =>
  a.releaseDate > b.releaseDate ? -1 : a.releaseDate < b.releaseDate ? 1 : 0,
);
