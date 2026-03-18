/** @jsxImportSource react */
import { Box, Card, Flex, Stack, Text } from "@sanity/ui";
import type { ReactNode } from "react";
import type { StringInputProps, TextInputProps } from "sanity";

type GuidanceConfig = {
  min?: number;
  max?: number;
  ideal?: string;
};

const FIELD_GUIDANCE: Record<string, GuidanceConfig> = {
  thesis: {
    min: 60,
    max: 240,
    ideal: "State the core argument or promise plainly before the draft sprawls.",
  },
  summary: {
    min: 100,
    max: 220,
    ideal: "Compact, specific, and useful as card copy plus SEO fallback.",
  },
  metaTitle: {
    max: 70,
    ideal: "Search-friendly title that preserves the editorial voice.",
  },
  metaDescription: {
    max: 160,
    ideal: "One clear promise with strong specificity and no filler.",
  },
  newsletterBlurb: {
    min: 90,
    max: 220,
    ideal: "Two or three compact sentences that feel editorial, not promotional.",
  },
  shortSocialPost: {
    min: 60,
    max: 180,
    ideal: "A punchy social version with one strong angle and no wasted setup.",
  },
  longSocialPost: {
    min: 120,
    max: 420,
    ideal: "Use short paragraphs and keep it skimmable enough for LinkedIn or newsletters.",
  },
  teaserQuote: {
    min: 24,
    max: 120,
    ideal: "One quotable line that can carry a card, social tile, or pull quote treatment.",
  },
  ctaLabel: {
    min: 2,
    max: 24,
    ideal: "Short, direct, and human. This should feel clickable, not corporate.",
  },
};

function getValueLength(value: unknown): number {
  return typeof value === "string" ? value.trim().length : 0;
}

function getTone(length: number, min?: number, max?: number): "default" | "caution" | "critical" {
  if (max && length > max) {
    return "critical";
  }

  if (min && length > 0 && length < min) {
    return "caution";
  }

  return "default";
}

function EditorialInputHint(props: { fieldName: string; value: unknown; children: ReactNode }) {
  const guidance = FIELD_GUIDANCE[props.fieldName];

  if (!guidance) {
    return <>{props.children}</>;
  }

  const length = getValueLength(props.value);
  const tone = getTone(length, guidance.min, guidance.max);

  return (
    <Stack space={3}>
      {props.children}
      <Card padding={3} radius={3} tone={tone} className="editorialInputHint" border>
        <Flex justify="space-between" align="flex-start" gap={3}>
          <Box flex={1}>
            <Text size={1} weight="semibold">
              Editorial guidance
            </Text>
            {guidance.ideal && (
              <Text size={1} muted>
                {guidance.ideal}
              </Text>
            )}
          </Box>
          <Text size={1} weight="semibold">
            {length} chars
          </Text>
        </Flex>
      </Card>
    </Stack>
  );
}

export function EditorialStringInput(props: StringInputProps) {
  return (
    <EditorialInputHint fieldName={props.schemaType.name} value={props.value}>
      {props.renderDefault(props)}
    </EditorialInputHint>
  );
}

export function EditorialTextAreaInput(props: TextInputProps) {
  return (
    <EditorialInputHint fieldName={props.schemaType.name} value={props.value}>
      {props.renderDefault(props)}
    </EditorialInputHint>
  );
}
