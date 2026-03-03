#!/usr/bin/env node

import { access, copyFile, mkdir, mkdtemp, rm, rename } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const sourceDir = path.join(repoRoot, "Sf fonts");
const outputDir = path.join(repoRoot, "public", "fonts", "sf", "v1");

const manifest = [
  {
    source: "SF-Pro.ttf",
    target: "sf-pro.woff2",
  },
  {
    source: "SF-Mono-Medium.otf",
    target: "sf-mono-medium.woff2",
  },
];

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          [
            `Command failed: ${command} ${args.join(" ")}`,
            stderr.trim() ? `stderr: ${stderr.trim()}` : "",
            stdout.trim() ? `stdout: ${stdout.trim()}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        ),
      );
    });
  });
}

async function ensureSourceExists(fileName) {
  const sourcePath = path.join(sourceDir, fileName);
  await access(sourcePath);
}

async function main() {
  for (const entry of manifest) {
    await ensureSourceExists(entry.source);
  }

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "sf-font-build-"));

  try {
    for (const entry of manifest) {
      const sourcePath = path.join(sourceDir, entry.source);
      const tempSourcePath = path.join(tempRoot, entry.source);
      const tempWoff2Path = tempSourcePath.replace(/\.(otf|ttf)$/i, ".woff2");
      const outputPath = path.join(outputDir, entry.target);

      await copyFile(sourcePath, tempSourcePath);
      await run("woff2_compress", [tempSourcePath]);
      await rename(tempWoff2Path, outputPath);

      console.log(`built ${entry.target}`);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }

  console.log(`\nGenerated ${manifest.length} fonts in ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
