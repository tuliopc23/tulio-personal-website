/**
 * Newsletter subscribe / confirm / broadcast flows (Resend + KV).
 * Adapted from legacy `worker-archive/index.ts`.
 */
import { Resend } from "resend";

export interface NewsletterEnv {
  CACHE: KVNamespace;
  NEWSLETTER?: KVNamespace;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_SEGMENT_ID?: string;
  NEWSLETTER_WEBHOOK_SECRET?: string;
}

function json(request: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function baseUrl(request: Request): string {
  return new URL(request.url).origin;
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

function newsletterFrom(env: NewsletterEnv): string {
  return env.RESEND_FROM?.trim() || "Tulio Cunha <newsletter@tuliocunha.dev>";
}

function newsletterSegmentId(env: NewsletterEnv): string {
  const id = env.RESEND_SEGMENT_ID?.trim();
  if (!id) throw new Error("Missing RESEND_SEGMENT_ID");
  return id;
}

function ensureResend(env: NewsletterEnv): Resend {
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

function newsletterKv(env: NewsletterEnv): KVNamespace {
  if (env.NEWSLETTER) return env.NEWSLETTER;
  return env.CACHE;
}

export async function handleNewsletterSubscribe(
  request: Request,
  env: NewsletterEnv,
): Promise<Response> {
  if (request.method !== "POST") {
    return json(request, 405, { ok: false, error: "Method not allowed" });
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const source = String(form.get("source") ?? "unknown").trim();
  const company = String(form.get("company") ?? "").trim();

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
    { expirationTtl: 60 * 60 * 48 },
  );

  try {
    await resend.contacts.create({
      email,
      unsubscribed: true,
    } as never);
  } catch {
    // Contact may already exist
  }

  try {
    await resend.contacts.update({
      email,
      unsubscribed: true,
    } as never);
  } catch {
    // proceed
  }

  try {
    await (
      resend.contacts as unknown as {
        segments: { add: (e: string, o: { segmentId: string }) => Promise<void> };
      }
    ).segments.add(email, { segmentId });
  } catch {
    // optional
  }

  const confirmUrl = `${baseUrl(request)}/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const subject = "Confirm your subscription";
  const text = `Confirm your subscription:\n\n${confirmUrl}\n\nIf you didn’t request this, ignore this email.`;
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
  } as never);

  if (error) {
    console.error("newsletter_confirm_send_failed", error, email, source);
    return json(request, 500, { ok: false, error: "Failed to send confirmation email." });
  }

  return json(request, 200, {
    ok: true,
    message: "Check your inbox to confirm your subscription.",
  });
}

export async function handleNewsletterConfirm(
  request: Request,
  env: NewsletterEnv,
): Promise<Response> {
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
  } as never);

  if (error) {
    console.error("newsletter_confirm_update_failed", error, email);
    return Response.redirect(`${redirectBase}?status=error`, 302);
  }

  await kv.delete(`pending:${token}`);
  return Response.redirect(`${redirectBase}?status=ok`, 302);
}

export async function handleNewsletterPostPublished(
  request: Request,
  env: NewsletterEnv,
): Promise<Response> {
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
    hero_image_url?: string;
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
  const text = `${title}\n\n${summary ? `${summary}\n\n` : ""}Read: ${postUrl}\n`;
  const heroImageUrl =
    typeof payload.hero_image_url === "string" && payload.hero_image_url.trim().length > 0
      ? payload.hero_image_url.trim()
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
  } as never);

  if (error) {
    console.error("newsletter_broadcast_failed", error, payload);
    return json(request, 500, { ok: false, error: "Failed to send broadcast." });
  }

  await kv.put(dedupeKey, JSON.stringify({ broadcastId: (data as { id?: string })?.id ?? null }), {
    expirationTtl: 60 * 60 * 24 * 90,
  });

  return json(request, 200, { ok: true, broadcastId: (data as { id?: string })?.id ?? null });
}
