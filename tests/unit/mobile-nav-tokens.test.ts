import { readFileSync } from "node:fs";
import { join } from "node:path";

const materialsCss = readFileSync(join(process.cwd(), "src/styles/tokens/materials.css"), "utf8");

describe("mobile nav bottom spacing tokens", () => {
  const defaultRootBlock = materialsCss.slice(
    0,
    materialsCss.indexOf("@media (display-mode: standalone)"),
  );

  test("uses a constant bottom offset in browser mode (no safe-area-bottom)", () => {
    expect(defaultRootBlock).toMatch(/--mobile-nav-bottom-space:\s*14px;/);
    expect(defaultRootBlock).not.toMatch(
      /--mobile-nav-bottom-space:\s*max\(14px,\s*var\(--safe-area-bottom\)\);/,
    );
  });

  test("restores safe-area bottom offset in standalone display mode", () => {
    expect(materialsCss).toMatch(
      /@media\s*\(\s*display-mode:\s*standalone\s*\)\s*\{[\s\S]*--mobile-nav-bottom-space:\s*max\(14px,\s*var\(--safe-area-bottom\)\);/,
    );
  });

  test("restores safe-area bottom offset in fullscreen display mode", () => {
    expect(materialsCss).toMatch(
      /@media\s*\(\s*display-mode:\s*fullscreen\s*\)\s*\{[\s\S]*--mobile-nav-bottom-space:\s*max\(14px,\s*var\(--safe-area-bottom\)\);/,
    );
  });
});
