import {
  type AssistFieldActionProps,
  assist,
  defineAssistFieldAction,
  defineAssistFieldActionGroup,
} from "@sanity/assist";
import { SparklesIcon } from "@sanity/icons";
import { useMemo, useRef } from "react";
import { pathToString, useWorkspace } from "sanity";

const POST_FIELD_INSTRUCTIONS: Record<
  string,
  {
    title: string;
    instruction: string;
  }
> = {
  summary: {
    title: "Draft summary",
    instruction: `
Write a compact article summary for the "summary" field.
- Use the article title, body, categories, and tags as context.
- Write one high-signal paragraph in English.
- Keep it between 100 and 220 characters when possible.
- Make it useful for blog cards, listings, and SEO fallback copy.
- Do not repeat the title verbatim.
`,
  },
  keyTakeaways: {
    title: "Draft takeaways",
    instruction: `
Generate key takeaways for this article.
- Output 3 or 4 concise takeaway bullets.
- Each takeaway should be short, concrete, and useful on its own.
- Focus on what the reader should leave with after reading the article.
- Avoid repeating the title or summary.
`,
  },
  "seo.metaTitle": {
    title: "Draft meta title",
    instruction: `
Write an SEO meta title for this article.
- Keep it under 70 characters.
- Optimize for clarity and search relevance.
- Preserve the article's editorial tone.
- Prefer a stronger search-oriented framing than the on-page title when that helps.
`,
  },
  "seo.metaDescription": {
    title: "Draft meta description",
    instruction: `
Write an SEO meta description for this article.
- Keep it under 160 characters.
- Make it informative, specific, and readable.
- Use the title, summary, and article body as context.
- Avoid generic filler phrases.
`,
  },
  "distributionPackage.newsletterBlurb": {
    title: "Draft newsletter blurb",
    instruction: `
Write a short newsletter blurb for this article.
- Keep it to 2 or 3 compact sentences.
- Use the title, summary, and body as context.
- Make it feel editorial and useful, not promotional fluff.
`,
  },
  "distributionPackage.shortSocialPost": {
    title: "Draft short social post",
    instruction: `
Write a short social post for this article.
- Keep it punchy and compact.
- Use the title and strongest takeaway as context.
- Make it readable on X, LinkedIn, or similar feeds without sounding generic.
`,
  },
  "distributionPackage.longSocialPost": {
    title: "Draft long social post",
    instruction: `
Write a longer social post for this article.
- Use 2 or 3 short paragraphs.
- Lead with a sharp framing line.
- Use the body and takeaways as context, but keep it skimmable.
`,
  },
  "distributionPackage.teaserQuote": {
    title: "Draft teaser quote",
    instruction: `
Write a teaser quote for this article.
- Keep it to one compelling line.
- Make it quotable, specific, and editorial.
- Avoid generic inspirational language.
`,
  },
  "distributionPackage.ctaLabel": {
    title: "Draft CTA label",
    instruction: `
Write a CTA label for this article's distribution package.
- Keep it to 2 to 5 words.
- Make it feel direct, human, and high-signal.
`,
  },
  "refreshReview.summary": {
    title: "Draft refresh review",
    instruction: `
Review this article and write a compact refresh summary.
- Look for stale framing, outdated examples, and missing nuance.
- Say whether it should be monitored, refreshed soon, rewritten, or archived.
- Keep it editorial and practical.
`,
  },
};

const ASSIST_API_VERSION = "2025-02-19";

export function usePostAssistFieldActions(props: AssistFieldActionProps) {
  const workspace = useWorkspace();
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;

  const propsRef = useRef(props);
  propsRef.current = props;

  const pathKey = pathToString(props.path);
  const documentSchemaName = props.documentSchemaType.name;
  const actionType = props.actionType;

  return useMemo(() => {
    if (documentSchemaName !== "post" || actionType !== "field") {
      return [];
    }

    const config = POST_FIELD_INSTRUCTIONS[pathKey];
    if (!config) {
      return [];
    }

    return [
      defineAssistFieldActionGroup({
        title: "Editorial AI",
        icon: SparklesIcon,
        children: [
          defineAssistFieldAction({
            title: config.title,
            icon: SparklesIcon,
            onAction: async () => {
              const latest = propsRef.current;
              const client = workspaceRef.current.getClient({ apiVersion: ASSIST_API_VERSION });
              await client.agent.action.generate({
                schemaId: latest.schemaId,
                targetDocument: {
                  operation: "createIfNotExists",
                  _id: latest.documentIdForAction,
                  _type: latest.documentSchemaType.name,
                  initialValues: latest.getDocumentValue(),
                },
                instruction: config.instruction,
                instructionParams: {
                  doc: { type: "document" },
                },
                target: {
                  path: latest.path,
                },
                conditionalPaths: {
                  paths: latest.getConditionalPaths(),
                },
              });
            },
          }),
        ],
      }),
    ];
  }, [pathKey, documentSchemaName, actionType]);
}

export const postAssistPlugin = assist({
  assist: {
    temperature: 0.25,
  },
  fieldActions: {
    title: "Editorial AI",
    useFieldActions: usePostAssistFieldActions,
  },
});
