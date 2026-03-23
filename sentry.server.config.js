import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://f090b59c9b0694fd72a5f9347d2fb7d2@o4510704923246592.ingest.us.sentry.io/4511095064821760",
  sendDefaultPii: true,
  enableLogs: true,
  tracesSampleRate: 1.0,
});
