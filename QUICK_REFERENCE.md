# Quick Reference: Auto-Tagging & Cross-Project Fetching

## Project Credentials

```
Project ID:  61249gtj
Dataset:     production
API Version: 2025-01-01
```

## Fetch Last 3 Articles (from Another Project)

### Quick Copy-Paste GROQ
```groq
*[_type == "post" && publishedAt <= now() && !coalesce(seo.noIndex, false)] 
| order(publishedAt desc)[0..2] {
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  tags,
  featured,
  "heroImage": heroImage { alt, "url": asset->url },
  "author": author-> { _id, name }
}
```

### Quick Copy-Paste JavaScript
```typescript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '61249gtj',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
});

const articles = await client.fetch(`
  *[_type == "post" && publishedAt <= now() && !coalesce(seo.noIndex, false)] 
  | order(publishedAt desc)[0..2] {
    _id, title, "slug": slug.current, summary, publishedAt, tags, featured,
    "heroImage": heroImage { alt, "url": asset->url },
    "author": author-> { _id, name }
  }
`);
```

## Auto-Tagging

### How It Works
- ✅ Triggers on post create/update
- ✅ Analyzes: `title`, `summary`, `content`
- ✅ Generates: 3 relevant tags
- ✅ Reuses: Existing tags from other posts
- ✅ Available tags: Design, Engineering, Tooling, Accessibility, Swift, Frontend, Writing

### Local Testing
```fish
bun run dev
# Open Studio at /studio
# Create or update a post
# Check console for "Generated tags..." log
```

### Deploy
```fish
sanity deploy
```

## Schema Field Names

| Purpose | Field Name | Type |
|---------|-----------|------|
| Document Type | `_type` | `"post"` |
| Article Title | `title` | `string` |
| URL Slug | `slug.current` | `string` |
| Summary | `summary` | `string` |
| Main Content | `content` | `array` (Portable Text) |
| Tags | `tags` | `string[]` |
| Publish Date | `publishedAt` | `datetime` |
| Featured | `featured` | `boolean` |
| Hero Image | `heroImage.asset->url` | `string` |
| Author | `author->name` | `string` |
| Categories | `categories[]` | `reference[]` |

## Files Changed

```
✓ functions/auto-tag/index.ts              (NEW)
✓ sanity.blueprint.ts                      (NEW)
✓ src/sanity/schemaTypes/post.ts           (MODIFIED)
✓ package.json                             (MODIFIED)
✓ AUTO_TAGGING.md                          (NEW - Full Docs)
✓ IMPLEMENTATION_SUMMARY.md                (NEW - Implementation Details)
```

## Verification Status

```
✅ Linting:     Passed (biome lint)
✅ Types:       Passed (tsc --noEmit)
✅ Build:       Passed (astro build)
✅ Dependencies: Installed (@sanity/blueprints@0.3.0, @sanity/functions@1.0.3)
```

## Troubleshooting

**Q: Tags not generating?**
- Check post has `content` field filled
- Verify `sanity.blueprint.ts` exists in project root
- Check dependencies installed: `bun list @sanity/blueprints @sanity/functions`

**Q: How to disable auto-tagging?**
- Remove `sanity.blueprint.ts`
- Run `sanity deploy`

**Q: How to modify trigger fields?**
- Edit filter in `sanity.blueprint.ts` line 13-14
- Current: `delta::changedAny(['title', 'summary', 'content'])`

**Q: How to increase timeout?**
- Edit `timeout` in `sanity.blueprint.ts` line 10
- Current: 30 seconds

## Next Steps

1. ✅ Review files created/modified
2. ⏳ Test locally with `bun run dev`
3. ⏳ Deploy with `sanity deploy`
4. ⏳ Verify in production Studio
5. ⏳ Use GROQ/JS in other projects

---

See `AUTO_TAGGING.md` for full documentation.
