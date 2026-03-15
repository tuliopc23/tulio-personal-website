import type { ClientConfig, SanityClient } from "@sanity/client";

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";
const isDevelopment = import.meta.env.DEV;

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET;
const apiVersion = "2025-02-19";
const useCdn = import.meta.env.PROD;

if (
  isDevelopment &&
  (!import.meta.env.PUBLIC_SANITY_PROJECT_ID || !import.meta.env.PUBLIC_SANITY_DATASET)
) {
  console.warn(
    `[sanity] Using default project (${DEFAULT_PROJECT_ID}) and dataset (${DEFAULT_DATASET}) for local development. Override via PUBLIC_SANITY_PROJECT_ID/PUBLIC_SANITY_DATASET.`,
  );
}

type CreateClientModule = typeof import("@sanity/client");

const baseConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
};

const previewConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: import.meta.env.SANITY_API_READ_TOKEN,
};

let clientModulePromise: Promise<CreateClientModule> | null = null;
let publishedClientPromise: Promise<SanityClient> | null = null;
let previewClientPromise: Promise<SanityClient> | null = null;

async function getClientModule(): Promise<CreateClientModule> {
  clientModulePromise ??= import("@sanity/client");
  return clientModulePromise;
}

export async function getSanityClient(): Promise<SanityClient> {
  publishedClientPromise ??= getClientModule().then(({ createClient }) => createClient(baseConfig));
  return publishedClientPromise;
}

export async function getPreviewSanityClient(): Promise<SanityClient> {
  previewClientPromise ??= getClientModule().then(({ createClient }) =>
    createClient(previewConfig),
  );
  return previewClientPromise;
}

export const config = {
  projectId,
  dataset,
  apiVersion,
};
