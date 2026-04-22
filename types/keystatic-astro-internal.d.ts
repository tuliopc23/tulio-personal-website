declare module "@keystatic/astro/internal/keystatic-api.js" {
  export const prerender: boolean;
  export const all: (context: unknown) => Promise<Response> | Response;
}
