import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { getContainerRenderer as solidContainerRenderer } from "@astrojs/solid-js";

/** Container with React (nav/search) and Solid (homepage widgets) renderers. */
export async function createSiteAstroContainer() {
  return AstroContainer.create({
    renderers: await loadRenderers([reactContainerRenderer(), solidContainerRenderer()]),
  });
}
