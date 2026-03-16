import "./src/sanity/studio.css";

import { assist } from "@sanity/assist";
import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { geminiAIImages } from "sanity-plugin-gemini-ai-images";
import { markdownSchema } from "sanity-plugin-markdown/next";
import {
  approveAction,
  crosspostAction,
  publishApprovedAction,
  refreshTagsAction,
  submitForReviewAction,
  unpublishAction,
} from "./src/sanity/actions";
import { EditorialReadinessBadge } from "./src/sanity/components/EditorialReadinessBadge";
import StudioLogo from "./src/sanity/components/StudioLogo";
import StudioNavbar from "./src/sanity/components/StudioNavbar";
import { WorkflowBadge } from "./src/sanity/components/WorkflowBadge";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import theme from "./src/sanity/theme";

const projectId = "61249gtj";
const dataset = "production";
const previewUrl =
  import.meta.env.SANITY_STUDIO_PREVIEW_URL ||
  import.meta.env.PUBLIC_SANITY_PREVIEW_URL ||
  "https://www.tuliocunha.dev";
const geminiApiEndpoint = import.meta.env.SANITY_STUDIO_GEMINI_API_ENDPOINT;

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio's Blog",
  projectId,
  dataset,
  theme,
  studio: {
    components: {
      logo: StudioLogo,
      navbar: StudioNavbar,
    },
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({ resolve, previewUrl }),
    codeInput(),
    markdownSchema(),
    assist(),
    ...(geminiApiEndpoint ? [geminiAIImages({ apiEndpoint: geminiApiEndpoint })] : []),
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
        const baseActions = prev.map((previousAction) => {
          if (previousAction.action === "publish") return publishApprovedAction;
          if (previousAction.action === "unpublish") return unpublishAction;
          return previousAction;
        });

        return [
          ...baseActions,
          refreshTagsAction,
          crosspostAction,
          submitForReviewAction,
          approveAction,
        ];
      }
      return prev;
    },
    badges: (prev, context) => {
      if (context.schemaType === "post") {
        return [...prev, WorkflowBadge, EditorialReadinessBadge];
      }
      return prev;
    },
  },
});
