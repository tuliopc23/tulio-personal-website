import type { QueryParams } from "sanity";

type Perspective = "published" | "drafts";

type LoadQueryArgs = {
  query: string;
  params?: QueryParams;
};

type SanityQueryEnvelope<T> = {
  result: T;
  resultSourceMap?: unknown;
};

export interface LoadQueryResult<T> {
  data: T;
  sourceMap?: unknown;
  perspective: Perspective;
}

const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? "61249gtj";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2025-02-19";
const apiHost = `https://${projectId}.apicdn.sanity.io`;
const liveApiHost = `https://${projectId}.api.sanity.io`;

if (visualEditingEnabled && !token) {
  throw new Error(
    "Sanity visual editing requires SANITY_API_READ_TOKEN. Set the token or disable PUBLIC_SANITY_VISUAL_EDITING_ENABLED.",
  );
}

function isSanityNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toUpperCase();
  const codes = [
    "ENOTFOUND",
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "EAI_AGAIN",
    "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
  ];
  const tlsMessages = [
    "UNABLE TO GET LOCAL ISSUER CERTIFICATE",
    "SELF-SIGNED CERTIFICATE",
    "CERTIFICATE HAS EXPIRED",
    "UNABLE TO VERIFY THE FIRST CERTIFICATE",
  ];

  if (codes.some((code) => message.includes(code))) {
    return true;
  }

  if (tlsMessages.some((entry) => message.includes(entry))) {
    return true;
  }

  const cause = "cause" in error ? error.cause : undefined;
  if (cause && typeof cause === "object" && "code" in cause) {
    const code = String(cause.code).toUpperCase();
    if (codes.includes(code)) {
      return true;
    }
  }

  if (cause && typeof cause === "object" && "message" in cause) {
    const causeMessage = String(cause.message).toUpperCase();
    if (tlsMessages.some((entry) => causeMessage.includes(entry))) {
      return true;
    }
  }

  return message.includes("FETCH FAILED");
}

function createRequestUrl(params: {
  query: string;
  variables: QueryParams;
  perspective: Perspective;
  includeSourceMap: boolean;
}): string {
  const baseHost = params.perspective === "drafts" ? liveApiHost : apiHost;
  const url = new URL(`${baseHost}/v${apiVersion}/data/query/${dataset}`);

  url.searchParams.set("query", params.query);
  url.searchParams.set("perspective", params.perspective);

  for (const [key, value] of Object.entries(params.variables)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  if (params.includeSourceMap) {
    url.searchParams.set("resultSourceMap", "true");
  }

  return url.toString();
}

export async function loadQuery<QueryResponse>({
  query,
  params,
}: LoadQueryArgs): Promise<LoadQueryResult<QueryResponse>> {
  const perspective: Perspective = visualEditingEnabled ? "drafts" : "published";
  const requestUrl = createRequestUrl({
    query,
    variables: params ?? {},
    perspective,
    includeSourceMap: visualEditingEnabled,
  });

  try {
    const response = await fetch(requestUrl, {
      headers: {
        ...(visualEditingEnabled && token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Sanity request failed with ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as SanityQueryEnvelope<QueryResponse>;

    return {
      data: payload.result,
      sourceMap: payload.resultSourceMap,
      perspective,
    };
  } catch (error) {
    if (!isSanityNetworkError(error)) {
      throw error;
    }

    console.warn(
      `[sanity] Network fetch failed during build; returning empty data for query: ${query.slice(0, 80).replace(/\s+/g, " ")}...`,
    );

    return {
      data: null as QueryResponse,
      perspective,
    };
  }
}
