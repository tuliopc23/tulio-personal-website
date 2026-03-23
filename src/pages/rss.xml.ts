import type { APIRoute } from "astro";

import { createRssFeedResponse } from "../lib/rss";
import { RSS_FEED_PATH } from "../lib/seo.js";

export const prerender = true;

export const GET: APIRoute = (context) => createRssFeedResponse(context, RSS_FEED_PATH);
