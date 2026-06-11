import { readFileSync } from "node:fs";
import { join } from "node:path";

const baseLayout = readFileSync(join(process.cwd(), "src/layouts/Base.astro"), "utf8");
const shellCss = readFileSync(join(process.cwd(), "src/styles/system/shell.css"), "utf8");
const mobileNavSource = readFileSync(
  join(process.cwd(), "src/components/navigation/MobileLiquidGlassNav.tsx"),
  "utf8",
);

describe("mobile search discoverability", () => {
  test("drawer includes a dock search hint on mobile", () => {
    expect(baseLayout).toMatch(/sidebar__dockHint/);
    expect(baseLayout).toMatch(/magnifying glass in the dock/);
    expect(shellCss).toMatch(
      /@media \(max-width: 1024px\)[\s\S]*\.sidebar__dockHint[\s\S]*display: block/,
    );
  });

  test("search FAB has a descriptive accessible name", () => {
    expect(mobileNavSource).toMatch(/aria-label="Search every page"/);
  });
});
