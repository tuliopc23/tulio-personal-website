import type { QueryParams } from "sanity";
import { getPreviewSanityClient, getSanityClient } from "./client";

type Perspective = "published" | "drafts";
type FailureMode = "fail" | "fallback";

type LoadQueryArgs = {
  query: string;
  params?: QueryParams;
  failureMode?: FailureMode;
  queryLabel?: string;
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
const allowBuildFallback =
  import.meta.env.DEV || import.meta.env.SANITY_ALLOW_BUILD_FALLBACK === "true";

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

function formatQueryLabel(query: string, queryLabel?: string): string {
  return queryLabel ?? query.slice(0, 80).replace(/\s+/g, " ");
}

export async function loadQuery<QueryResponse>({
  query,
  params,
  failureMode = allowBuildFallback ? "fallback" : "fail",
  queryLabel,
}: LoadQueryArgs): Promise<LoadQueryResult<QueryResponse>> {
  const perspective: Perspective = visualEditingEnabled ? "drafts" : "published";
  const client = visualEditingEnabled ? await getPreviewSanityClient() : await getSanityClient();

  try {
    const resultSourceMap = visualEditingEnabled ? "withKeyArraySelector" : false;
    const payload = (await client.fetch(query, params ?? {}, {
      // `@sanity/client` types only allow `filterResponse: true`, but runtime supports `false`
      // to return the full envelope (including `resultSourceMap`).
      filterResponse: false,
      resultSourceMap,
    } as unknown as {
      filterResponse?: true;
      resultSourceMap?: boolean | "withKeyArraySelector";
    })) as unknown as SanityQueryEnvelope<QueryResponse>;

    return {
      data: payload.result,
      sourceMap: payload.resultSourceMap,
      perspective,
    };
  } catch (error) {
    if (!isSanityNetworkError(error) || failureMode !== "fallback") {
      throw error;
    }

    console.warn(
      `[sanity] Network fetch failed and fallback was allowed for ${formatQueryLabel(query, queryLabel)}. Returning empty data.`,
    );

    return {
      data: null as QueryResponse,
      perspective,
    };
  }
}
