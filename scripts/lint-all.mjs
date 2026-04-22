#!/usr/bin/env node
/**
 * Runs `vp lint` on all repo TypeScript entrypoints. `vp lint .` can match zero
 * files in some environments; expanding globs avoids silent lint skips.
 */
import { execFileSync } from "node:child_process";
import { globSync } from "node:fs";

const patterns = [
  "src/**/*.ts",
  "src/**/*.tsx",
  "tests/**/*.ts",
  "tests/**/*.tsx",
  "scripts/**/*.mjs",
];

const files = [...new Set(patterns.flatMap((p) => globSync(p)))].sort();
if (files.length === 0) {
  console.error("lint-all: no files matched patterns");
  process.exit(1);
}

const fix = process.argv.includes("--fix");
const args = ["exec", "vp", "lint", ...files];
if (fix) args.push("--fix");

execFileSync("pnpm", args, { stdio: "inherit" });
