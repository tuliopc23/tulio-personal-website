import { sanityClient } from "sanity:client";
import type { QueryParams } from "sanity";

type Perspective = "published" | "drafts";

type LoadQueryArgs = {
  query: string;
  params?: QueryParams;
};

export interface LoadQueryResult<T> {
  data: T;
  sourceMap?: unknown;
  perspective: Perspective;
}

const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

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
  const codes = ["ENOTFOUND", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EAI_AGAIN"];

  if (codes.some((code) => message.includes(code))) {
    return true;
  }

  const cause = "cause" in error ? error.cause : undefined;
  if (cause && typeof cause === "object" && "code" in cause) {
    const code = String(cause.code).toUpperCase();
    return codes.includes(code);
  }

  return message.includes("FETCH FAILED");
}

export async function loadQuery<QueryResponse>({
  query,
  params,
}: LoadQueryArgs): Promise<LoadQueryResult<QueryResponse>> {
  const perspective: Perspective = visualEditingEnabled ? "drafts" : "published";

  try {
    const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
      query,
      params ?? {},
      {
        filterResponse: false,
        perspective,
        resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
        stega: visualEditingEnabled,
        ...(visualEditingEnabled ? { token } : {}),
      },
    );

    return {
      data: result,
      sourceMap: resultSourceMap,
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
