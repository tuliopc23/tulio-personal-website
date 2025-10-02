import type { SanityCodegenConfig } from "sanity-codegen";

const config: SanityCodegenConfig = {
  schemaPath: "./src/sanity/schemaTypes",
  outputPath: "./src/types/sanity.generated.ts",
};

export default config;
