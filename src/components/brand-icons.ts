export type BrandIconKey =
  | "astro"
  | "bun"
  | "docker"
  | "fiverr"
  | "github"
  | "instagram"
  | "linkedin"
  | "node"
  | "go"
  | "rust"
  | "swift"
  | "typescript"
  | "react"
  | "solid"
  | "svelte"
  | "vue"
  | "zig";

type BrandEntry = {
  icon: string;
  fallback?: string;
  accent?: string;
  ink?: string;
};

const registry: Record<BrandIconKey, BrandEntry> = {
  astro: {
    icon: "logos:astro-icon",
    fallback: "simple-icons:astro",
    accent: "#BC52EE",
    ink: "#BC52EE",
  },
  bun: {
    icon: "logos:bun",
    fallback: "simple-icons:bun",
    accent: "#F9C784",
    ink: "#4A3222",
  },
  docker: {
    icon: "logos:docker-icon",
    fallback: "simple-icons:docker",
    accent: "#2496ED",
    ink: "#2496ED",
  },
  fiverr: {
    icon: "logos:fiverr",
    fallback: "simple-icons:fiverr",
    accent: "#1DBF73",
    ink: "#1DBF73",
  },
  github: {
    icon: "logos:github",
    fallback: "simple-icons:github",
    accent: "#24292F",
    ink: "#24292F",
  },
  instagram: {
    icon: "logos:instagram",
    fallback: "simple-icons:instagram",
    accent: "#E4405F",
    ink: "#E4405F",
  },
  linkedin: {
    icon: "logos:linkedin-icon",
    fallback: "simple-icons:linkedin",
    accent: "#0A66C2",
    ink: "#0A66C2",
  },
  node: {
    icon: "logos:nodejs",
    fallback: "simple-icons:nodedotjs",
    accent: "#339933",
    ink: "#339933",
  },
  go: {
    icon: "logos:go",
    fallback: "simple-icons:go",
    accent: "#00ADD8",
    ink: "#00ADD8",
  },
  rust: {
    icon: "logos:rust",
    fallback: "simple-icons:rust",
    accent: "#B7410E",
    ink: "#2C1913",
  },
  swift: {
    icon: "logos:swift",
    fallback: "simple-icons:swift",
    accent: "#FA7343",
    ink: "#FA7343",
  },
  typescript: {
    icon: "logos:typescript-icon",
    fallback: "simple-icons:typescript",
    accent: "#3178C6",
    ink: "#3178C6",
  },
  react: {
    icon: "logos:react",
    fallback: "simple-icons:react",
    accent: "#61DAFB",
    ink: "#61DAFB",
  },
  solid: {
    icon: "logos:solidjs-icon",
    fallback: "simple-icons:solid",
    accent: "#2C4F7C",
    ink: "#2C4F7C",
  },
  svelte: {
    icon: "logos:svelte-icon",
    fallback: "simple-icons:svelte",
    accent: "#FF3E00",
    ink: "#FF3E00",
  },
  vue: {
    icon: "logos:vue",
    fallback: "simple-icons:vuedotjs",
    accent: "#41B883",
    ink: "#41B883",
  },
  zig: {
    icon: "logos:zig",
    fallback: "simple-icons:zig",
    accent: "#F7A41D",
    ink: "#F7A41D",
  },
};

export const brandIcons = registry;

export const getBrandIcon = (name: string): BrandEntry | null => {
  return registry[name as BrandIconKey] ?? null;
};
