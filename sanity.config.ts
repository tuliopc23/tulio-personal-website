import "./src/sanity/studio.css";

import { assist } from "@sanity/assist";
import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import {
  approveAndPublishAction,
  crosspostAction,
  submitForReviewAction,
  unpublishAction,
} from "./src/sanity/actions";
import StudioLogo from "./src/sanity/components/StudioLogo";
import { WorkflowBadge } from "./src/sanity/components/WorkflowBadge";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import theme from "./src/sanity/theme";

const projectId = "61249gtj";
const dataset = "production";
const previewUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.PUBLIC_SANITY_PREVIEW_URL ||
  "https://www.tuliocunha.dev";

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio's Blog",
  projectId,
  dataset,
  basePath: "/studio",
  theme,
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({ resolve, previewUrl }),
    codeInput(),
    markdownSchema(),
    assist(),
  ],
  schema: {
    types: schemaTypes,
  },
  releases: {
    enabled: true,
  },
  scheduledDrafts: {
    enabled: true,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "post") {
        return [
          ...prev,
          crosspostAction,
          submitForReviewAction,
          approveAndPublishAction,
          unpublishAction,
        ];
      }
      return prev;
    },
    badges: (prev, context) => {
      if (context.schemaType === "post") {
        return [...prev, WorkflowBadge];
      }
      return prev;
    },
  },
});
