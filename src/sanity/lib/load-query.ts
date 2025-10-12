import { sanityClient } from "sanity:client";
import type { QueryParams } from "sanity";

type Perspective = "published" | "previewDrafts";

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

export async function loadQuery<QueryResponse>({
  query,
  params,
}: LoadQueryArgs): Promise<LoadQueryResult<QueryResponse>> {
  const perspective: Perspective = visualEditingEnabled ? "previewDrafts" : "published";

  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(query, params ?? {}, {
    filterResponse: false,
    perspective,
    resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
    stega: visualEditingEnabled,
    ...(visualEditingEnabled ? { token } : {}),
  });

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  };
}
