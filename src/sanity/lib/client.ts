import { createClient } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2025-01-01";
const useCdn = import.meta.env.PROD;

if (!projectId || !dataset) {
  throw new Error(
    "Missing required Sanity environment variables: PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET"
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
  perspective: "previewDrafts",
  token: import.meta.env.SANITY_API_READ_TOKEN,
});

export const config = {
  projectId,
  dataset,
  apiVersion,
};
