import "./src/sanity/studio.css";

import { codeInput } from "@sanity/code-input";
import { DocumentTextIcon, EditIcon } from "@sanity/icons";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { geminiAIImages } from "sanity-plugin-gemini-ai-images";
import { markdownSchema } from "sanity-plugin-markdown/next";
import {
  approveAction,
  crosspostAction,
  generateDistributionPackageAction,
  generateRefreshDraftAction,
  publishApprovedAction,
  refreshTagsAction,
  submitForReviewAction,
  unpublishAction,
} from "./src/sanity/actions";
import { editorialHomeTool } from "./src/sanity/components/EditorialHomeTool";
import { EditorialReadinessBadge } from "./src/sanity/components/EditorialReadinessBadge";
import { postAssistPlugin } from "./src/sanity/components/PostAssistFieldActions";
import StudioLogo from "./src/sanity/components/StudioLogo";
import StudioNavbar from "./src/sanity/components/StudioNavbar";
import { WorkflowBadge } from "./src/sanity/components/WorkflowBadge";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const projectId = "61249gtj";
const dataset = "production";
const previewUrl =
  import.meta.env.SANITY_STUDIO_PREVIEW_URL ||
  import.meta.env.PUBLIC_SANITY_PREVIEW_URL ||
  "https://www.tuliocunha.dev";
const geminiApiEndpoint = import.meta.env.SANITY_STUDIO_GEMINI_API_ENDPOINT;

const truthy = (value: string | boolean | undefined) =>
  value === true || value === "true" || value === "1";

/** Lighter Studio: drops presentation, editorial home tool, canvas, tasks/releases/scheduled drafts/media library. */
const studioMinimal = truthy(import.meta.env.SANITY_STUDIO_MINIMAL);

/** Emergency off-switch for @sanity/assist field actions (Editorial AI menu). */
const studioDisableAssist = truthy(import.meta.env.SANITY_STUDIO_DISABLE_ASSIST);

const basePlugins = [
  structureTool({ structure }),
  ...(studioMinimal ? [] : [presentationTool({ resolve, previewUrl })]),
  codeInput(),
  markdownSchema(),
  ...(studioDisableAssist ? [] : [postAssistPlugin]),
  ...(geminiApiEndpoint ? [geminiAIImages({ apiEndpoint: geminiApiEndpoint })] : []),
];

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio's Blog",
  projectId,
  dataset,
  studio: {
    components: {
      logo: StudioLogo,
      navbar: StudioNavbar,
    },
  },
  plugins: basePlugins,
  tools: (prev) => (studioMinimal ? prev : [editorialHomeTool, ...prev]),
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((template) => template.id !== "post"),
      {
        id: "post-essay",
        title: "Essay",
        schemaType: "post",
        icon: DocumentTextIcon,
        value: {
          status: "draft",
          coverVariant: "default",
          featured: false,
          keyTakeaways: [],
          tags: [],
        },
      },
      {
        id: "post-shipping-note",
        title: "Shipping note",
        schemaType: "post",
        icon: EditIcon,
        value: {
          status: "draft",
          coverVariant: "minimal",
          featured: false,
          keyTakeaways: [],
          tags: ["Writing"],
        },
      },
      {
        id: "content-brief",
        title: "Content brief",
        schemaType: "contentBrief",
        icon: DocumentTextIcon,
        value: {
          status: "idea",
        },
      },
    ],
  },
  apps: {
    canvas: {
      enabled: !studioMinimal,
    },
  },
  tasks: {
    enabled: !studioMinimal,
  },
  releases: {
    enabled: !studioMinimal,
  },
  scheduledDrafts: {
    enabled: !studioMinimal,
  },
  mediaLibrary: {
    enabled: !studioMinimal,
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
          generateDistributionPackageAction,
          generateRefreshDraftAction,
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
    comments: {
      enabled: ({ documentType }) =>
        [
          "post",
          "contentBrief",
          "sourceReference",
          "series",
          "topic",
          "project",
          "blogPage",
          "aboutPage",
          "nowPage",
          "projectsPage",
        ].includes(documentType),
    },
    newDocumentOptions: (prev, context) => {
      if (context.creationContext.schemaType === "post") {
        return prev
          .filter((item) => item.templateId !== "post")
          .concat([
            {
              templateId: "post-essay",
              title: "Essay",
              icon: DocumentTextIcon,
            },
            {
              templateId: "post-shipping-note",
              title: "Shipping note",
              icon: EditIcon,
            },
          ]);
      }

      if (context.creationContext.schemaType === "contentBrief") {
        return prev.concat([
          {
            templateId: "content-brief",
            title: "Content brief",
            icon: DocumentTextIcon,
          },
        ]);
      }

      return prev;
    },
  },
});
