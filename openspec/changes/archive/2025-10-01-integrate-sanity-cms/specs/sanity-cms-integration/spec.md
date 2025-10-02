## ADDED Requirements

This change introduces the complete `sanity-cms-integration` specification.

See: `/openspec/specs/sanity-cms-integration/spec.md` for full specification details.

### Key Requirements Summary

1. **Sanity Project Configuration**: Environment setup with project ID (61249gtj), production dataset, API tokens
2. **Embedded Sanity Studio**: Studio at `/admin` route with authentication and deployment
3. **Content Schema Foundation**: Blog posts, authors, categories with future marketplace extensibility
4. **GROQ Query Integration**: Type-safe content fetching with filtering, pagination, and reference resolution
5. **Portable Text Rendering**: Custom Astro components using repository CSS tokens exclusively
6. **Visual Editing with Live Preview**: Clickable overlays linking to Studio fields with draft content preview
7. **Custom Design System Integration**: No Sanity templates or visual builder classes, only repository CSS
8. **Content API and Data Fetching**: Sanity client with perspective switching and caching strategies
9. **Content Source Maps**: Field-level editing precision in visual mode
10. **Image Optimization**: Responsive sources, modern formats, lazy loading
11. **SEO and Metadata Integration**: Open Graph, structured data, RSS/Atom feeds
12. **Type Safety and TypeScript**: Generated types from schemas for compile-time validation
13. **Error Handling and Resilience**: Graceful API failure handling with retries
14. **Development and Production Workflows**: Streamlined content creation, preview, and publishing
15. **Future Marketplace Foundation**: Extensible schemas for services, pricing, transactions
16. **Performance and Optimization**: Fast builds, minimal bundle size, optimal Lighthouse scores
17. **Accessibility and Standards**: WCAG AA compliance, semantic HTML, screen reader support
18. **Documentation and Maintainability**: Comprehensive docs for developers and content editors
