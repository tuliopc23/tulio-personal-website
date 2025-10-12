import { createClient } from "@sanity/client";

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";
const isDevelopment = import.meta.env.DEV;

const projectId =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? (isDevelopment ? DEFAULT_PROJECT_ID : undefined);
const dataset =
  import.meta.env.PUBLIC_SANITY_DATASET ?? (isDevelopment ? DEFAULT_DATASET : undefined);
const apiVersion = "2025-01-01";
const useCdn = import.meta.env.PROD;

if (!projectId || !dataset) {
  throw new Error(
    "Missing required Sanity environment variables: set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET. See README.md#environment-configuration.",
  );
}

if (
  isDevelopment &&
  (!import.meta.env.PUBLIC_SANITY_PROJECT_ID || !import.meta.env.PUBLIC_SANITY_DATASET)
) {
  console.warn(
    `[sanity] Using default project (${DEFAULT_PROJECT_ID}) and dataset (${DEFAULT_DATASET}) for local development. Override via PUBLIC_SANITY_PROJECT_ID/PUBLIC_SANITY_DATASET.`,
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: import.meta.env.SANITY_API_READ_TOKEN,
});

export const config = {
  projectId,
  dataset,
  apiVersion,
};
