import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import {
  handleNewsletterPostPublished,
  type NewsletterEnv,
} from "../../../server/newsletter-handlers";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  return handleNewsletterPostPublished(request, env as unknown as NewsletterEnv);
};
