import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import { handleNewsletterConfirm, type NewsletterEnv } from "../../server/newsletter-handlers";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return handleNewsletterConfirm(request, env as unknown as NewsletterEnv);
};
