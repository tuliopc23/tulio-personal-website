import {
  type AssistFieldActionProps,
  assist,
  defineAssistFieldAction,
  defineAssistFieldActionGroup,
} from "@sanity/assist";
import { SparklesIcon } from "@sanity/icons";
import { useMemo } from "react";
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
- Use the article title, hook, body, categories, and tags as context.
- Write one high-signal paragraph in English.
- Keep it between 100 and 220 characters when possible.
- Make it useful for blog cards, listings, and SEO fallback copy.
- Do not repeat the title verbatim.
`,
  },
  hook: {
    title: "Draft hook",
    instruction: `
Write a short hook for the "hook" field.
- The hook is a kicker used in article cards and the article hero.
- Keep it to one sentence fragment or one compact line.
- Aim for 6 to 14 words.
- It should feel specific, sharp, and editorial rather than generic marketing copy.
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
- Use the title, hook, summary, and article body as context.
- Avoid generic filler phrases.
`,
  },
};

export function usePostAssistFieldActions(props: AssistFieldActionProps) {
  const workspace = useWorkspace();
  const client = useMemo(() => workspace.getClient({ apiVersion: "2025-02-19" }), [workspace]);
  const pathKey = pathToString(props.path);

  return useMemo(() => {
    if (props.documentSchemaType.name !== "post" || props.actionType !== "field") {
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
              await client.agent.action.generate({
                schemaId: props.schemaId,
                targetDocument: {
                  operation: "createIfNotExists",
                  _id: props.documentIdForAction,
                  _type: props.documentSchemaType.name,
                  initialValues: props.getDocumentValue(),
                },
                instruction: config.instruction,
                instructionParams: {
                  doc: { type: "document" },
                },
                target: {
                  path: props.path,
                },
                conditionalPaths: {
                  paths: props.getConditionalPaths(),
                },
              });
            },
          }),
        ],
      }),
    ];
  }, [client, pathKey, props]);
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
