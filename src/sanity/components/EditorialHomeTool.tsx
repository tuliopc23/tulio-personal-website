/** @jsxImportSource react */
import {
  CalendarIcon,
  CheckmarkCircleIcon,
  ComposeIcon,
  DocumentsIcon,
  EditIcon,
  SearchIcon,
  SparklesIcon,
  StackCompactIcon,
  TagIcon,
} from "@sanity/icons";
import { Badge, Box, Card, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { type ComponentType, startTransition, useEffect, useMemo, useState } from "react";
import type { Tool } from "sanity";
import { useWorkspace } from "sanity";
import { IntentLink } from "sanity/router";

type DashboardData = {
  drafts: number;
  inReview: number;
  approved: number;
  needsSeo: number;
  needsMedia: number;
  needsDistribution: number;
  refreshCandidates: number;
  briefs: Array<{ _id: string; title?: string; status?: string; dueDate?: string }>;
  posts: Array<{ _id: string; title?: string; status?: string; updatedAt?: string }>;
};

type MetricTone = "default" | "primary" | "positive" | "caution";

type MetricDefinition = {
  title: string;
  valueKey: keyof Pick<
    DashboardData,
    | "drafts"
    | "inReview"
    | "approved"
    | "needsSeo"
    | "needsMedia"
    | "needsDistribution"
    | "refreshCandidates"
  >;
  tone?: MetricTone;
  icon: ComponentType;
  context: string;
};

const DASHBOARD_QUERY = `{
  "drafts": count(*[_type == "post" && status == "draft"]),
  "inReview": count(*[_type == "post" && status == "in-review"]),
  "approved": count(*[_type == "post" && status == "approved"]),
  "needsSeo": count(*[_type == "post" && status != "archived" && (!defined(seo.metaTitle) || !defined(seo.metaDescription) || !defined(seo.socialImage.asset))]),
  "needsMedia": count(*[_type == "post" && status != "archived" && (!defined(heroImage.asset) || !defined(heroImage.alt))]),
  "needsDistribution": count(*[_type == "post" && status in ["approved", "published"] && (!defined(distributionPackage.newsletterBlurb) || !defined(distributionPackage.shortSocialPost) || !defined(distributionPackage.ctaLabel))]),
  "refreshCandidates": count(*[_type == "post" && status == "published" && dateTime(publishedAt) < dateTime(now()) - 60*60*24*180]),
  "briefs": *[_type == "contentBrief"] | order(_updatedAt desc)[0...5]{_id, title, status, dueDate},
  "posts": *[_type == "post"] | order(_updatedAt desc)[0...5]{_id, title, status, "updatedAt": _updatedAt}
}`;

const METRICS: MetricDefinition[] = [
  {
    title: "Drafts",
    valueKey: "drafts",
    icon: DocumentsIcon,
    context: "Pieces that are still being shaped.",
  },
  {
    title: "In Review",
    valueKey: "inReview",
    icon: SearchIcon,
    tone: "caution",
    context: "Articles currently waiting for editorial attention.",
  },
  {
    title: "Approved",
    valueKey: "approved",
    icon: CheckmarkCircleIcon,
    tone: "positive",
    context: "Ready for release planning or direct publishing.",
  },
  {
    title: "Needs SEO",
    valueKey: "needsSeo",
    icon: SparklesIcon,
    context: "Missing metadata or social image coverage.",
  },
  {
    title: "Needs Media",
    valueKey: "needsMedia",
    icon: DocumentsIcon,
    context: "Hero image or alt text is still incomplete.",
  },
  {
    title: "Needs Distribution",
    valueKey: "needsDistribution",
    icon: CalendarIcon,
    tone: "primary",
    context: "Published or approved posts still missing promo packaging.",
  },
  {
    title: "Refresh Candidates",
    valueKey: "refreshCandidates",
    icon: EditIcon,
    tone: "caution",
    context: "Published posts old enough to review for freshness.",
  },
];

function formatShortDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function MetricCard(props: {
  title: string;
  value: number;
  tone?: MetricTone;
  icon: ComponentType;
  context: string;
}) {
  return (
    <Card
      className="editorialHome__metric"
      padding={4}
      radius={4}
      border
      tone={props.tone ?? "default"}
    >
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={1} muted>
            {props.title}
          </Text>
          <Badge tone={props.tone ?? "default"}>
            <props.icon />
          </Badge>
        </Flex>
        <Heading size={2}>{props.value}</Heading>
        <Text size={1} muted>
          {props.context}
        </Text>
      </Stack>
    </Card>
  );
}

function EmptyPanelState(props: { title: string; body: string }) {
  return (
    <Card padding={3} radius={3} tone="transparent" border>
      <Stack space={2}>
        <Text weight="semibold">{props.title}</Text>
        <Text size={1} muted>
          {props.body}
        </Text>
      </Stack>
    </Card>
  );
}

function EditorialHome(_props: { tool: Tool }) {
  const workspace = useWorkspace();
  const client = useMemo(() => workspace.getClient({ apiVersion: "2025-02-19" }), [workspace]);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    client
      .fetch<DashboardData>(DASHBOARD_QUERY)
      .then((result) => {
        if (cancelled) return;
        startTransition(() => {
          setData(result);
          setLoading(false);
        });
      })
      .catch(() => {
        if (cancelled) return;
        startTransition(() => {
          setData(null);
          setLoading(false);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  return (
    <Box padding={5}>
      <Stack space={5}>
        <Card className="editorialHome__hero" padding={5} radius={4} border tone="primary">
          <Stack space={4}>
            <Flex align="center" justify="space-between" gap={4} wrap="wrap">
              <Box>
                <Text size={1} weight="semibold" muted>
                  Editorial OS
                </Text>
                <Heading size={3}>Publishing control room</Heading>
              </Box>
              <Flex gap={2} wrap="wrap">
                <IntentLink
                  className="editorialHome__quickLink"
                  intent="create"
                  params={{ type: "contentBrief" }}
                >
                  New brief
                </IntentLink>
                <IntentLink
                  className="editorialHome__quickLink"
                  intent="create"
                  params={{ type: "post", template: "post-essay" }}
                >
                  New essay
                </IntentLink>
                <IntentLink
                  className="editorialHome__quickLink"
                  intent="create"
                  params={{ type: "post", template: "post-shipping-note" }}
                >
                  Shipping note
                </IntentLink>
                <IntentLink
                  className="editorialHome__quickLink"
                  intent="create"
                  params={{ type: "series" }}
                >
                  New series
                </IntentLink>
                <IntentLink
                  className="editorialHome__quickLink"
                  intent="create"
                  params={{ type: "topic" }}
                >
                  New topic
                </IntentLink>
                <IntentLink
                  className="editorialHome__quickLink"
                  intent="create"
                  params={{ type: "sourceReference" }}
                >
                  New source
                </IntentLink>
              </Flex>
            </Flex>
            <Text muted>
              Draft smarter, keep review moving, and catch publishing gaps before they leak into the
              public site.
            </Text>
          </Stack>
        </Card>

        {loading ? (
          <Flex justify="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : (
          <>
            <Grid columns={[1, 2, 3, 4]} gap={3}>
              {METRICS.map((metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={data?.[metric.valueKey] ?? 0}
                  tone={metric.tone}
                  icon={metric.icon}
                  context={metric.context}
                />
              ))}
            </Grid>

            <Grid columns={[1, 1, 2, 2]} gap={4}>
              <Card className="editorialHome__panel" padding={4} radius={4} border>
                <Stack space={4}>
                  <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                    <Heading size={1}>Recent briefs</Heading>
                    <Flex gap={2} wrap="wrap">
                      <Badge tone="primary">{data?.briefs.length ?? 0}</Badge>
                      <IntentLink
                        className="editorialHome__inlineLink"
                        intent="create"
                        params={{ type: "contentBrief" }}
                      >
                        Create brief
                      </IntentLink>
                    </Flex>
                  </Flex>
                  <Stack space={3}>
                    {(data?.briefs ?? []).length > 0 ? (
                      (data?.briefs ?? []).map((brief) => (
                        <IntentLink
                          key={brief._id}
                          className="editorialHome__listLink"
                          intent="edit"
                          params={{ id: brief._id, type: "contentBrief" }}
                        >
                          <Card padding={3} radius={3} tone="transparent" border>
                            <Stack space={2}>
                              <Text weight="semibold">{brief.title ?? "Untitled brief"}</Text>
                              <Flex gap={2} wrap="wrap">
                                {brief.status && <Badge>{brief.status}</Badge>}
                                {brief.dueDate && (
                                  <Badge tone="caution">Due {formatShortDate(brief.dueDate)}</Badge>
                                )}
                              </Flex>
                            </Stack>
                          </Card>
                        </IntentLink>
                      ))
                    ) : (
                      <EmptyPanelState
                        title="No briefs yet"
                        body="Capture the next idea as a brief first so draft work starts from a clearer strategy."
                      />
                    )}
                  </Stack>
                </Stack>
              </Card>

              <Card className="editorialHome__panel" padding={4} radius={4} border>
                <Stack space={4}>
                  <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                    <Heading size={1}>Recently touched posts</Heading>
                    <Flex gap={2} wrap="wrap">
                      <Badge tone="positive">{data?.posts.length ?? 0}</Badge>
                      <IntentLink
                        className="editorialHome__inlineLink"
                        intent="create"
                        params={{ type: "post", template: "post-essay" }}
                      >
                        New article
                      </IntentLink>
                    </Flex>
                  </Flex>
                  <Stack space={3}>
                    {(data?.posts ?? []).length > 0 ? (
                      (data?.posts ?? []).map((post) => (
                        <IntentLink
                          key={post._id}
                          className="editorialHome__listLink"
                          intent="edit"
                          params={{ id: post._id, type: "post" }}
                        >
                          <Card padding={3} radius={3} tone="transparent" border>
                            <Stack space={2}>
                              <Text weight="semibold">{post.title ?? "Untitled article"}</Text>
                              <Flex gap={2} wrap="wrap">
                                {post.status && <Badge>{post.status}</Badge>}
                                {post.updatedAt && (
                                  <Badge tone="primary">
                                    Updated {formatShortDate(post.updatedAt)}
                                  </Badge>
                                )}
                              </Flex>
                            </Stack>
                          </Card>
                        </IntentLink>
                      ))
                    ) : (
                      <EmptyPanelState
                        title="No recent article activity"
                        body="Start an essay or shipping note to populate the live editorial pipeline."
                      />
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            <Grid columns={[1, 1, 2, 2]} gap={4}>
              <Card className="editorialHome__panel" padding={4} radius={4} border>
                <Stack space={4}>
                  <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                    <Heading size={1}>Strategy shortcuts</Heading>
                    <Badge tone="primary">Taxonomy + planning</Badge>
                  </Flex>
                  <Grid columns={[1, 2, 2, 2]} gap={3}>
                    <IntentLink
                      className="editorialHome__shortcut"
                      intent="create"
                      params={{ type: "topic" }}
                    >
                      <Flex align="center" gap={2}>
                        <TagIcon />
                        <Text size={1} weight="semibold">
                          New topic
                        </Text>
                      </Flex>
                    </IntentLink>
                    <IntentLink
                      className="editorialHome__shortcut"
                      intent="create"
                      params={{ type: "series" }}
                    >
                      <Flex align="center" gap={2}>
                        <StackCompactIcon />
                        <Text size={1} weight="semibold">
                          New series
                        </Text>
                      </Flex>
                    </IntentLink>
                    <IntentLink
                      className="editorialHome__shortcut"
                      intent="create"
                      params={{ type: "sourceReference" }}
                    >
                      <Flex align="center" gap={2}>
                        <SearchIcon />
                        <Text size={1} weight="semibold">
                          New source
                        </Text>
                      </Flex>
                    </IntentLink>
                    <IntentLink
                      className="editorialHome__shortcut"
                      intent="create"
                      params={{ type: "contentBrief" }}
                    >
                      <Flex align="center" gap={2}>
                        <ComposeIcon />
                        <Text size={1} weight="semibold">
                          New brief
                        </Text>
                      </Flex>
                    </IntentLink>
                  </Grid>
                </Stack>
              </Card>

              <Card className="editorialHome__panel" padding={4} radius={4} border tone="caution">
                <Stack space={3}>
                  <Heading size={1}>Operational surfaces</Heading>
                  <Text muted>
                    Comments, Tasks, Scheduled Drafts, Releases, Presentation, and the Media Library
                    are now part of the Studio operating model. Use the release navbar and document
                    panes for scheduling, review, and launch coordination.
                  </Text>
                  <Flex gap={2} wrap="wrap">
                    <Badge tone="caution">Refresh candidates: {data?.refreshCandidates ?? 0}</Badge>
                    <Badge tone="primary">Releases enabled</Badge>
                    <Badge tone="positive">Tasks enabled</Badge>
                    <Badge tone="positive">Comments enabled</Badge>
                    <Badge tone="primary">Media library enabled</Badge>
                  </Flex>
                </Stack>
              </Card>
            </Grid>
          </>
        )}
      </Stack>
    </Box>
  );
}

export const editorialHomeTool: Tool = {
  name: "editorial-home",
  title: "Editorial Home",
  icon: ComposeIcon,
  component: EditorialHome,
};
