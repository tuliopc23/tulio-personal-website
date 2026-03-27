import { defineBlueprint, defineDocumentWebhook } from "@sanity/blueprints";

const DEFAULT_OWNER = "tuliopc23";
const DEFAULT_REPO = "tulio-personal-website";
const DEFAULT_DATASET = "production";

function getDispatchTarget() {
  const owner = process.env.GITHUB_REPOSITORY_OWNER || DEFAULT_OWNER;
  const repo = process.env.GITHUB_REPOSITORY_NAME || DEFAULT_REPO;

  return {
    url: `https://api.github.com/repos/${owner}/${repo}/dispatches`,
  };
}

function getDispatchToken() {
  return (
    process.env.GITHUB_REPOSITORY_DISPATCH_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  );
}

const dispatchTarget = getDispatchTarget();
const dispatchToken = getDispatchToken();

if (!dispatchToken) {
  throw new Error(
    "Missing GitHub dispatch token. Set GITHUB_REPOSITORY_DISPATCH_TOKEN or GITHUB_TOKEN / GITHUB_PERSONAL_ACCESS_TOKEN before deploying the Blueprint.",
  );
}

export default defineBlueprint({
  resources: [
    defineDocumentWebhook({
      name: "cloudflare-workers-rebuild",
      displayName: "Cloudflare Workers Rebuild",
      description:
        "Triggers a GitHub Actions rebuild/deploy for the Cloudflare Worker when published site content changes.",
      url: dispatchTarget.url,
      on: ["create", "update", "delete"],
      dataset: process.env.PUBLIC_SANITY_DATASET || DEFAULT_DATASET,
      apiVersion: "v2025-02-19",
      filter:
        '_type in ["aboutPage","author","blogPage","category","featuredGithubRepo","post","project","projectsPage","series","topic"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))',
      projection: `{
        "event_type": "sanity-rebuild",
        "client_payload": {
          "source": "sanity",
          "documentId": _id,
          "documentType": _type,
          "slug": select(defined(slug.current) => slug.current, null),
          "operation": select(
            delta::operation() == "create" => "created",
            delta::operation() == "update" => "updated",
            delta::operation() == "delete" => "deleted"
          ),
          "dataset": sanity::dataset(),
          "projectId": sanity::projectId()
        }
      }`,
      status: "enabled",
      httpMethod: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${dispatchToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "X-Sanity-Webhook": "cloudflare-workers-rebuild",
      },
      includeDrafts: false,
      includeAllVersions: false,
    }),
  ],
});
