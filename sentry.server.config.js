import * as Sentry from "@sentry/astro";

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: import.meta.env.MODE,
  sendDefaultPii: true,
  enableLogs: true,
  tracesSampleRate: 1.0,
});
