import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import { handleNewsletterSubscribe, type NewsletterEnv } from "../../../server/newsletter-handlers";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  return handleNewsletterSubscribe(request, env as unknown as NewsletterEnv);
};
