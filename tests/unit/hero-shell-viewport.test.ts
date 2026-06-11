import { readFileSync } from "node:fs";
import { join } from "node:path";

const heroPlayerSource = readFileSync(
  join(process.cwd(), "src/components/HeroPlayer.tsx"),
  "utf8",
);
const materialsCss = readFileSync(join(process.cwd(), "src/styles/tokens/materials.css"), "utf8");
const shellViewportSource = readFileSync(
  join(process.cwd(), "src/lib/navigation/shell-viewport.ts"),
  "utf8",
);

describe("hero mobile viewport alignment", () => {
  test("HeroPlayer uses the same shell breakpoint as mobile liquid nav", () => {
    expect(shellViewportSource).toMatch(/MOBILE_SHELL_MEDIA_QUERY = "\(max-width: 1024px\)"/);
    expect(heroPlayerSource).toMatch(/MOBILE_SHELL_MEDIA_QUERY/);
    expect(heroPlayerSource).not.toMatch(/max-width: 768px/);
  });

  test("StaticFallback uses MOBILE_MAC geometry when isMobile is true", () => {
    expect(heroPlayerSource).toMatch(/StaticFallback\(\{ isMobile \}/);
    expect(heroPlayerSource).toMatch(/MOBILE_MAC/);
  });
});

describe("short phone dock clearance", () => {
  test("reserves extra bottom space on short mobile viewports", () => {
    expect(materialsCss).toMatch(
      /@media\s*\(\s*max-width:\s*1024px\s*\)\s*and\s*\(\s*max-height:\s*700px\s*\)/,
    );
    expect(materialsCss).toMatch(/--mobile-nav-reserved-bottom:[\s\S]*38px/);
  });
});
