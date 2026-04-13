/// <reference types="@cloudflare/workers-types" />
import * as Sentry from "@sentry/cloudflare";
import { Resend } from "resend";

/**
 * Cloudflare Worker entry point.
 *
 * Static assets (Astro build output in ./dist) are served automatically
 * by the assets binding. This Worker only handles dynamic API routes.
 */

interface Env {
  GITHUB_TOKEN?: string;
  GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  SANITY_API_READ_TOKEN?: string;
  SENTRY_DSN?: string;
  SENTRY_RELEASE?: string;
  CACHE: KVNamespace;

  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_SEGMENT_ID?: string;
  NEWSLETTER_WEBHOOK_SECRET?: string;
  NEWSLETTER?: KVNamespace;
}

// ─── GitHub API handler ──────────────────────────────────────────────────────

interface SanityFeaturedRepo {
  _id: string;
  repoFullName: string;
  displayTitle?: string;
  description?: string;
  category?: string;
  featured: boolean;
  order: number;
  showRepositoryLink: boolean;
  showPrivate: boolean;
  visibleInProofOfWork: boolean;
}

interface GitHubRestRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  updated_at: string;
  private: boolean;
}

interface GitHubRestCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

const SANITY_PROJECT_ID = "61249gtj";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-02-19";

const LANGUAGE_OVERRIDES: Record<string, string> = {
  "tuliopc23/tulio-personal-website": "TypeScript",
};

/** Origins allowed to call /api/github.json from the browser (www + apex). */
const CORS_ALLOWED_ORIGINS = new Set(["https://www.tuliocunha.dev", "https://tuliocunha.dev"]);

function accessControlAllowOrigin(request: Request): string | undefined {
  const origin = request.headers.get("Origin");
  if (!origin) return "https://www.tuliocunha.dev";
  return CORS_ALLOWED_ORIGINS.has(origin) ? origin : undefined;
}

function withCors(request: Request, headers: Record<string, string>): Record<string, string> {
  const allow = accessControlAllowOrigin(request);
  if (allow) {
    return { ...headers, "Access-Control-Allow-Origin": allow };
  }
  return { ...headers };
}

function json(request: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: withCors(request, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    }),
  });
}

function baseUrl(request: Request): string {
  const url = new URL(request.url);
  return url.origin;
}

function isValidEmail(email: string): boolean {
  const value = email.trim();
  if (value.length < 6 || value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function base64Url(bytes: Uint8Array): string {
  const bin = String.fromCharCode(...bytes);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function newToken(bytes = 32): string {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return base64Url(data);
}

function newsletterFrom(env: Env): string {
  return env.RESEND_FROM?.trim() || "Tulio Cunha <newsletter@tuliocunha.dev>";
}

function newsletterSegmentId(env: Env): string {
  const id = env.RESEND_SEGMENT_ID?.trim();
  if (!id) throw new Error("Missing RESEND_SEGMENT_ID");
  return id;
}

function ensureResend(env: Env): Resend {
  const key = env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const NEW_PUBLICATION_TEMPLATE_HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html dir="ltr" lang="en">   <head>     <meta content="width=device-width" name="viewport" />     <link       rel="preload"       as="image"       href="https://tuliocunha.dev/Brand-icon-light.webp" />     <link rel="preload" as="image" href="{{hero_image_url}}" />     <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />     <meta name="x-apple-disable-message-reformatting" />     <meta content="IE=edge" http-equiv="X-UA-Compatible" />     <meta name="x-apple-disable-message-reformatting" />     <meta       content="telephone=no,address=no,email=no,date=no,url=no"       name="format-detection" />     <style>       body {                   margin: 0;                   padding: 0;                   background-color: #f5f5f7;                   -webkit-font-smoothing: antialiased;                   -moz-osx-font-smoothing: grayscale;               }                /* --- Exact .cta-pill--accent implementation --- */               .cta-pill {                   display: inline-block;                   text-decoration: none;                   border-radius: 999px;                   padding: 10px 14px;                   font-size: 14px;                   font-weight: 500;                   line-height: 1.2;                   letter-spacing: -0.006em;                   color: #f7f9ff;                   background-color: #0071e3;                   background-color: color-mix(in srgb, #0071e3 26%, rgba(255,255,255,0.9) 74%);                   border: 1px solid rgba(0, 113, 227, 0.46);                   border-color: color-mix(in srgb, #0071e3 46%, transparent);                   box-shadow: 0 6px 16px rgba(0, 113, 227, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.24);                   transition: all 0.2s ease-out;               }                .cta-pill:hover {                   box-shadow: 0 10px 24px rgba(0, 113, 227, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.28) !important;               }                /* --- Tahoe 26 Dark Mode Native Overrides --- */               @media (prefers-color-scheme: dark) {                   body, .wrapper-table {                       background-color: #050505 !important;                   }                   .main-card {                       background-color: #101115 !important;                       border-color: rgba(255, 255, 255, 0.08) !important;                       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.12), 0 20px 48px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;                   }                   .text-primary {                       color: #f5f5f7 !important;                   }                   .text-secondary {                       color: rgba(220, 232, 255, 0.76) !important;                   }                   .eyebrow {                       color: #5fd4ff !important;                   }                   .cta-pill {                       background-color: #0d8aff !important;                       background-color: color-mix(in srgb, #0d8aff 26%, #101115 74%) !important;                       border: 1px solid rgba(13, 138, 255, 0.46) !important;                       border-color: color-mix(in srgb, #0d8aff 46%, transparent) !important;                       box-shadow: 0 6px 16px rgba(10, 132, 255, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.24) !important;                   }                   .cta-pill:hover {                       box-shadow: 0 10px 24px rgba(10, 132, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.28) !important;                   }                   .footer-text {                       color: rgba(174, 190, 220, 0.5) !important;                   }                   .footer-link {                       color: rgba(220, 232, 255, 0.76) !important;                   }                   .hero-img {                       border-color: rgba(255, 255, 255, 0.09) !important;                       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 18px 36px rgba(0, 0, 0, 0.25) !important;                   }               }     </style>   </head>   <body>     <table       border="0"       width="100%"       cellpadding="0"       cellspacing="0"       role="presentation"       align="center">       <tbody>         <tr>           <td>             <table               align="center"               width="100%"               border="0"               cellpadding="0"               cellspacing="0"               role="presentation"               style="width:100%">               <tbody>                 <tr style="width:100%">                   <td>                     <table                       width="100%"                       border="0"                       cellpadding="0"                       cellspacing="0"                       role="presentation"                       class="wrapper-table"                       style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:40px;padding-right:16px;padding-bottom:40px;padding-left:16px;background-color:#f5f5f7">                       <tbody>                         <tr>                           <td>                             <tr style="margin:0;padding:0">                               <td                                 align="center"                                 data-id="__react-email-column"                                 style="margin:0;padding:0">                                 <table                                   width="100%"                                   border="0"                                   cellpadding="0"                                   cellspacing="0"                                   role="presentation"                                   class="main-card"                                   style="margin-top:0;margin-right:auto;margin-bottom:0;margin-left:auto;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;background-color:#ffffff;max-width:600px;border-radius:20px;border-style:solid;border-width:1px solid rgba(34, 48, 88, 0.08);border-color:black;box-shadow:0 2px 4px rgba(31, 35, 53, 0.08), 0 8px 16px rgba(31, 35, 53, 0.1), 0 18px 36px rgba(31, 35, 53, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)">                                   <tbody>                                     <tr>                                       <td>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:32px 32px 0 32px">                                             <table                                               width="100%"                                               border="0"                                               cellpadding="0"                                               cellspacing="0"                                               role="presentation"                                               style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">                                               <tbody>                                                 <tr>                                                   <td>                                                     <tr                                                       style="margin:0;padding:0">                                                       <td                                                         data-id="__react-email-column"                                                         style="margin:0;padding:0;width:42px;vertical-align:middle">                                                         <img                                                           alt="Tulio Cunha"                                                           height="36"                                                           src="https://tuliocunha.dev/Brand-icon-light.webp"                                                           style="display:block;outline:none;border:0;text-decoration:none;max-width:100%"                                                           width="36" />                                                       </td>                                                       <td                                                         data-id="__react-email-column"                                                         style="margin:0;padding:0;padding-left:12px;vertical-align:middle">                                                         <div                                                           class="text-primary"                                                           style="margin:0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#1d1d1f;line-height:1.22;letter-spacing:-0.028em">                                                           <p                                                             style="margin:0;padding:0">                                                             Tulio Cunha                                                           </p>                                                         </div>                                                         <div                                                           class="text-secondary"                                                           style="margin:0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;color:rgba(28, 42, 76, 0.68);margin-top:2px;line-height:1.4;letter-spacing:-0.01em">                                                           <p                                                             style="margin:0;padding:0">                                                             Systems &amp; Web                                                             Developer                                                           </p>                                                         </div>                                                       </td>                                                     </tr>                                                   </td>                                                 </tr>                                               </tbody>                                             </table>                                           </td>                                         </tr>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:0;height:32px;font-size:32px;line-height:32px">                                             <p style="margin:0;padding:0"> </p>                                           </td>                                         </tr>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:0 32px 12px 32px">                                             <div                                               class="eyebrow"                                               style="margin:0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#0071e3">                                               <p style="margin:0;padding:0">                                                 New Publication                                               </p>                                             </div>                                           </td>                                         </tr>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:0 32px 24px 32px">                                             <h1                                               class="text-primary"                                               style="margin:0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:28px;font-weight:800;color:#1d1d1f;line-height:1.08;letter-spacing:-0.035em">                                               {{post_title}}                                             </h1>                                             <p                                               class="text-secondary"                                               style="margin:12px 0 0 0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;color:rgba(28, 42, 76, 0.68);line-height:1.62">                                               {{post_summary}}                                             </p>                                           </td>                                         </tr>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:0 32px">                                             <img                                               class="hero-img"                                               alt="Post Cover"                                               height="auto"                                               src="{{hero_image_url}}"                                               style="display:block;outline:none;border:1px solid rgba(60, 60, 67, 0.12);text-decoration:none;max-width:536px;width:100%;border-radius:12px;box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 18px 36px rgba(31, 35, 53, 0.12)"                                               width="536" />                                           </td>                                         </tr>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:0;height:24px;font-size:24px;line-height:24px">                                             <p style="margin:0;padding:0"> </p>                                           </td>                                         </tr>                                         <tr style="margin:0;padding:0">                                           <td                                             data-id="__react-email-column"                                             style="margin:0;padding:0 32px 40px 32px">                                             <p style="margin:0;padding:0">                                               <a                                                 href="{{post_url}}"                                                 rel="noopener noreferrer nofollow"                                                 style="color:#067df7;text-decoration-line:none"                                                 target="_blank"                                                 >Read Article →</a                                               >                                             </p>                                           </td>                                         </tr>                                       </td>                                     </tr>                                   </tbody>                                 </table>                                 <table                                   width="100%"                                   border="0"                                   cellpadding="0"                                   cellspacing="0"                                   role="presentation"                                   style="margin-top:0;margin-right:auto;margin-bottom:0;margin-left:auto;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;max-width:600px">                                   <tbody>                                     <tr>                                       <td>                                         <tr style="margin:0;padding:0">                                           <td                                             align="center"                                             data-id="__react-email-column"                                             style="margin:0;padding:32px 16px">                                             <p                                               class="footer-text"                                               style="margin:0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;color:rgba(84, 102, 140, 0.46);line-height:1.5;letter-spacing:0.006em">                                               Sent from Tulio Cunha's                                               developer journal.                                             </p>                                             <p                                               class="footer-text"                                               style="margin:8px 0 0 0;padding:0;font-family:'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;color:rgba(84, 102, 140, 0.46);line-height:1.5">                                               Don't want these emails?                                               Unsubscribe at any time from                                               <a                                                 href="{{{RESEND_UNSUBSCRIBE_URL}}}"                                                 rel="noopener noreferrer nofollow"                                                 style="color:rgba(28, 42, 76, 0.68);text-decoration-line:none;text-decoration:underline"                                                 target="_blank"                                                 ><u>preferences</u></a                                               >.                                             </p>                                           </td>                                         </tr>                                       </td>                                     </tr>                                   </tbody>                                 </table>                               </td>                             </tr>                           </td>                         </tr>                       </tbody>                     </table>                     <p style="margin:0;padding:0"><br /></p>                   </td>                 </tr>               </tbody>             </table>           </td>         </tr>       </tbody>     </table>   </body> </html>`;

function renderNewPublicationHtml(input: {
  postTitle: string;
  postSummary: string;
  postUrl: string;
  heroImageUrl: string;
}): string {
  return NEW_PUBLICATION_TEMPLATE_HTML.replaceAll("{{post_title}}", escapeHtml(input.postTitle))
    .replaceAll("{{post_summary}}", escapeHtml(input.postSummary))
    .replaceAll("{{post_url}}", escapeHtml(input.postUrl))
    .replaceAll("{{hero_image_url}}", escapeHtml(input.heroImageUrl));
}

function newsletterKv(env: Env): KVNamespace {
  if (env.NEWSLETTER) return env.NEWSLETTER;
  // Temporary fallback so local/dev doesn’t crash if binding isn't set up yet.
  // The binding is still required for production.
  return env.CACHE;
}

async function handleNewsletterSubscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json(request, 405, { ok: false, error: "Method not allowed" });
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const source = String(form.get("source") ?? "unknown").trim();
  const company = String(form.get("company") ?? "").trim();

  // Honeypot: treat as success to avoid tipping off bots.
  if (company.length > 0) {
    return json(request, 200, {
      ok: true,
      message: "Check your inbox to confirm your subscription.",
    });
  }

  if (!isValidEmail(email)) {
    return json(request, 400, { ok: false, error: "Please enter a valid email address." });
  }

  const resend = ensureResend(env);
  const segmentId = newsletterSegmentId(env);
  const token = newToken();

  const kv = newsletterKv(env);
  await kv.put(
    `pending:${token}`,
    JSON.stringify({
      email,
      source,
      createdAt: new Date().toISOString(),
    }),
    { expirationTtl: 60 * 60 * 48 }, // 48h
  );

  // Create (or update) the contact as unsubscribed until confirmation.
  try {
    await resend.contacts.create({
      email,
      unsubscribed: true,
    } as any);
  } catch {
    // Contact may already exist; keep going and update below.
  }

  try {
    await resend.contacts.update({
      email,
      unsubscribed: true,
    } as any);
  } catch {
    // If update fails we still proceed with confirmation email.
  }

  // Ensure contact is in the newsletter segment (broadcasts are sent to segment).
  try {
    await (resend.contacts as any).segments.add(email, { segmentId });
  } catch {
    // Fine if already added / segment call fails; confirmation still works.
  }

  const confirmUrl = `${baseUrl(request)}/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const subject = "Confirm your subscription";
  const text = `Confirm your subscription:\\n\\n${confirmUrl}\\n\\nIf you didn’t request this, ignore this email.`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6;">
      <h1 style="margin: 0 0 12px; font-size: 20px;">Confirm your subscription</h1>
      <p style="margin: 0 0 16px;">One last step—click the button below to confirm.</p>
      <p style="margin: 0 0 18px;">
        <a href="${confirmUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#6366f1;color:#fff;text-decoration:none;font-weight:600;">
          Confirm subscription
        </a>
      </p>
      <p style="margin: 0; color: rgba(60,60,67,.72); font-size: 14px;">
        If the button doesn’t work, paste this link into your browser:<br />
        <a href="${confirmUrl}">${confirmUrl}</a>
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: newsletterFrom(env),
    to: email,
    subject,
    html,
    text,
  } as any);

  if (error) {
    Sentry.captureMessage("newsletter_confirm_send_failed", {
      level: "error",
      extra: { error, email, source },
    });
    return json(request, 500, { ok: false, error: "Failed to send confirmation email." });
  }

  return json(request, 200, {
    ok: true,
    message: "Check your inbox to confirm your subscription.",
  });
}

async function handleNewsletterConfirm(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim() ?? "";
  const redirectBase = `${url.origin}/newsletter/subscribed/`;

  if (!token) {
    return Response.redirect(`${redirectBase}?status=missing`, 302);
  }

  const kv = newsletterKv(env);
  const raw = await kv.get(`pending:${token}`);
  if (!raw) {
    return Response.redirect(`${redirectBase}?status=invalid`, 302);
  }

  let record: { email?: string } | null = null;
  try {
    record = JSON.parse(raw) as { email?: string };
  } catch {
    record = null;
  }

  const email = record?.email?.trim().toLowerCase() ?? "";
  if (!email || !isValidEmail(email)) {
    return Response.redirect(`${redirectBase}?status=invalid`, 302);
  }

  const resend = ensureResend(env);

  const { error } = await resend.contacts.update({
    email,
    unsubscribed: false,
  } as any);

  if (error) {
    Sentry.captureMessage("newsletter_confirm_update_failed", {
      level: "error",
      extra: { error, email },
    });
    return Response.redirect(`${redirectBase}?status=error`, 302);
  }

  await kv.delete(`pending:${token}`);
  return Response.redirect(`${redirectBase}?status=ok`, 302);
}

async function handleNewsletterPostPublished(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json(request, 405, { ok: false, error: "Method not allowed" });
  }

  const secret = env.NEWSLETTER_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return json(request, 500, { ok: false, error: "Newsletter webhook not configured." });
  }

  const provided = request.headers.get("X-Newsletter-Secret")?.trim();
  if (!provided || provided !== secret) {
    return json(request, 401, { ok: false, error: "Unauthorized" });
  }

  const payload = (await request.json().catch(() => null)) as {
    postId?: string;
    slug?: string;
    title?: string;
    summary?: string;
    publishedAt?: string;
  } | null;

  if (!payload) {
    return json(request, 400, { ok: false, error: "Invalid JSON payload." });
  }

  const slug = (payload.slug ?? "").trim();
  const postId = (payload.postId ?? "").trim();
  const title = (payload.title ?? "").trim();
  const summary = (payload.summary ?? "").trim();

  if (!slug || !title) {
    return json(request, 400, { ok: false, error: "Missing required fields (slug, title)." });
  }

  const kv = newsletterKv(env);
  const dedupeKey = `sent:${postId || slug}`;
  const already = await kv.get(dedupeKey);
  if (already) {
    return json(request, 200, { ok: true, skipped: true });
  }

  const resend = ensureResend(env);
  const segmentId = newsletterSegmentId(env);
  const postUrl = `${baseUrl(request)}/blog/${slug}/`;

  const subject = `New post: ${title}`;
  const previewText = summary || "A new post just dropped.";
  const text = `${title}\\n\\n${summary ? `${summary}\\n\\n` : ""}Read: ${postUrl}\\n`;
  const heroImageUrl =
    typeof (payload as any).hero_image_url === "string" &&
    (payload as any).hero_image_url.trim().length > 0
      ? (payload as any).hero_image_url.trim()
      : "https://tuliocunha.dev/Brand-icon-light.webp";
  const html = renderNewPublicationHtml({
    postTitle: title,
    postSummary: summary,
    postUrl,
    heroImageUrl,
  });

  const { data, error } = await resend.broadcasts.create({
    name: `Post: ${title}`,
    segmentId,
    from: newsletterFrom(env),
    subject,
    previewText,
    html,
    text,
    send: true,
  } as any);

  if (error) {
    Sentry.captureMessage("newsletter_broadcast_failed", {
      level: "error",
      extra: { error, payload },
    });
    return json(request, 500, { ok: false, error: "Failed to send broadcast." });
  }

  await kv.put(dedupeKey, JSON.stringify({ broadcastId: (data as any)?.id ?? null }), {
    expirationTtl: 60 * 60 * 24 * 90, // 90d
  });

  return json(request, 200, { ok: true, broadcastId: (data as any)?.id ?? null });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "recently";
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
}

function stripEmojis(str: string): string {
  return (str ?? "")
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .trim();
}

async function fetchSanityRepos(readToken?: string): Promise<SanityFeaturedRepo[]> {
  const query = encodeURIComponent(
    `*[_type == "featuredGithubRepo" && featured == true && visibleInProofOfWork == true] | order(order asc) { _id, repoFullName, displayTitle, description, category, featured, order, showRepositoryLink, showPrivate, visibleInProofOfWork }`,
  );
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (readToken) headers.Authorization = `Bearer ${readToken}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = (await res.json()) as { result: SanityFeaturedRepo[] };
  return json.result ?? [];
}

async function fetchGitHub<T>(path: string, tokens: string[]): Promise<T | null> {
  if (tokens.length === 0) return null;
  let lastFailureStatus: number | null = null;

  for (const token of tokens) {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "tulio-personal-website-worker",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (res.ok) {
      return res.json() as Promise<T>;
    }

    if (res.status === 404) {
      return null;
    }

    lastFailureStatus = res.status;
    console.warn(`[github] ${path} failed with ${res.status}; trying next token if available`);
  }

  if (lastFailureStatus !== null) {
    throw new Error(
      `GitHub request failed for ${path} after exhausting configured tokens (last status: ${lastFailureStatus})`,
    );
  }

  return null;
}

const GITHUB_CACHE_KEY = "github:api:v1";
const GITHUB_CACHE_TTL = 300; // 5 minutes

async function handleGitHubApi(request: Request, env: Env): Promise<Response> {
  // Serve from KV cache if available
  const cached = await env.CACHE.get(GITHUB_CACHE_KEY);
  if (cached) {
    return new Response(cached, {
      status: 200,
      headers: withCors(request, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "X-Cache": "HIT",
      }),
    });
  }

  const githubTokens = [env.GITHUB_PERSONAL_ACCESS_TOKEN, env.GITHUB_TOKEN].filter(
    (value): value is string => Boolean(value?.trim()),
  );
  const sanityToken = env.SANITY_API_READ_TOKEN;

  try {
    const sanityRepos = await fetchSanityRepos(sanityToken);
    const results = (
      await Promise.all(
        sanityRepos.map(async (repo) => {
          const [ghRepo, ghCommits] = await Promise.all([
            fetchGitHub<GitHubRestRepo>(`/repos/${repo.repoFullName}`, githubTokens),
            fetchGitHub<GitHubRestCommit[]>(
              `/repos/${repo.repoFullName}/commits?per_page=5`,
              githubTokens,
            ),
          ]);

          if (!ghRepo) return null;
          if (ghRepo.private && !repo.showPrivate) return null;

          const commits = (ghCommits ?? [])
            .filter((c) => c.commit?.message)
            .map((c) => ({
              sha: c.sha,
              shortSha: c.sha.substring(0, 7).toUpperCase(),
              message: c.commit.message.split("\n")[0].trim(),
              committedAt: formatRelativeTime(c.commit.author.date),
              url: c.html_url,
            }));

          const primaryLanguage = LANGUAGE_OVERRIDES[ghRepo.full_name] ?? ghRepo.language ?? "Code";

          return {
            id: repo._id,
            repoFullName: ghRepo.full_name,
            repoName: ghRepo.name,
            displayTitle: repo.displayTitle ?? ghRepo.name,
            description: repo.description ?? stripEmojis(ghRepo.description ?? ""),
            category: repo.category ?? "Code",
            primaryLanguage,
            primaryLanguageIcon:
              primaryLanguage.toLowerCase() in { astro: 1, javascript: 1, swift: 1, typescript: 1 }
                ? primaryLanguage.toLowerCase()
                : null,
            updatedAt: ghRepo.updated_at,
            isPrivate: ghRepo.private,
            repoUrl: ghRepo.html_url,
            showRepositoryLink: repo.showRepositoryLink,
            commits,
          };
        }),
      )
    ).filter((repo): repo is NonNullable<typeof repo> => repo !== null);

    const body = JSON.stringify(results);
    await env.CACHE.put(GITHUB_CACHE_KEY, body, {
      expirationTtl: GITHUB_CACHE_TTL,
    });

    return new Response(body, {
      status: 200,
      headers: withCors(request, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      }),
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: {
        route: "/api/github.json",
        handler: "handleGitHubApi",
      },
      extra: {
        githubTokenCount: githubTokens.length,
        hasSanityToken: Boolean(sanityToken),
      },
    });
    console.error("[/api/github.json] Error:", err);

    // Fallback: return stale KV cache if fresh fetch failed
    try {
      const stale = await env.CACHE.get(GITHUB_CACHE_KEY);
      if (stale) {
        return new Response(stale, {
          status: 200,
          headers: withCors(request, {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=30, stale-while-revalidate=600",
            "X-Cache": "STALE",
            "X-Stale-Reason": "upstream-error",
          }),
        });
      }
    } catch {
      // KV also failed — fall through to 500
    }

    return new Response(JSON.stringify({ error: "Failed to load GitHub data" }), {
      status: 500,
      headers: withCors(request, { "Content-Type": "application/json" }),
    });
  }
}

// ─── Worker fetch handler ────────────────────────────────────────────────────

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN ?? undefined,
    enabled: Boolean(env.SENTRY_DSN),
    tracesSampleRate: 1.0,
    environment: "production",
    release: env.SENTRY_RELEASE ?? undefined,
  }),
  {
    async fetch(request: Request, env: Env): Promise<Response> {
      const url = new URL(request.url);

      if (url.pathname === "/api/newsletter/subscribe") {
        return handleNewsletterSubscribe(request, env);
      }

      if (url.pathname === "/newsletter/confirm") {
        return handleNewsletterConfirm(request, env);
      }

      if (url.pathname === "/api/newsletter/post-published") {
        return handleNewsletterPostPublished(request, env);
      }

      if (url.pathname === "/api/github.json" && request.method === "GET") {
        return handleGitHubApi(request, env);
      }

      // All static assets are served by the assets binding before reaching here.
      // If we get here, nothing matched — return 404.
      const notFoundHeaders: Record<string, string> = {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      };
      return new Response("Not Found", {
        status: 404,
        headers: notFoundHeaders,
      });
    },
  } satisfies ExportedHandler<Env>,
);
