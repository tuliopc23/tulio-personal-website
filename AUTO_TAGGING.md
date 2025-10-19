# Auto-Tagging Feature Documentation

## Overview

The auto-tagging feature automatically generates relevant tags for blog posts using AI-powered content analysis. Tags are generated based on the article's title, summary, and content whenever a post is created or updated.

## How It Works

### Trigger Events
Tags are automatically generated when:
- A new post is created
- An existing post is updated (if title, summary, or content changes)

### Generation Process
1. **Content Analysis**: The AI agent analyzes your article's content, title, and summary
2. **Tag Generation**: Creates 3 relevant tags based on content
3. **Tag Reuse**: Prefers to reuse existing tags from your content library for consistency
4. **Available Tags**: `Design`, `Engineering`, `Tooling`, `Accessibility`, `Swift`, `Frontend`, `Writing`

### Field Configuration

#### Schema Type
- **Document Type**: `post`
- **Field Name**: `tags`
- **Type**: `array` of `string`
- **Max Items**: 6 tags
- **Auto-Generated**: Yes

#### Trigger Fields
Tags are regenerated when any of these fields change:
- `title`
- `summary`
- `content`

## Files Modified/Created

### New Files
- `functions/auto-tag/index.ts` - Document event handler for tag generation
- `sanity.blueprint.ts` - Blueprint configuration for function events
- `AUTO_TAGGING.md` - This documentation file

### Modified Files
- `src/sanity/schemaTypes/post.ts` - Updated tags field description
- `package.json` - Added `@sanity/blueprints` and `@sanity/functions`

## Query Field Names for Other Projects

To fetch articles with tags from another project, use these exact field names:

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
  "heroImage": heroImage {
    alt,
    "url": asset->url
  },
  "author": author-> {
    _id,
    name
  }
}
```

### Schema Field Names Reference
| Field | Type | Notes |
|-------|------|-------|
| `_type` | string | Always `"post"` |
| `_id` | string | Sanity document ID |
| `title` | string | Article title |
| `slug.current` | string | URL-friendly slug |
| `summary` | string | Article summary |
| `content` | array | Rich text (Portable Text blocks) |
| `tags` | string[] | Auto-generated tags |
| `publishedAt` | datetime | Publication date |
| `featured` | boolean | Featured status |
| `heroImage` | image | Main article image |
| `author` | reference | Reference to author document |
| `categories` | reference[] | References to category documents |

## Sanity Project Credentials

```
Project ID: 61249gtj
Dataset: production
API Version: 2025-01-01
```

## Local Development

### Testing Auto-Tagging Locally

1. **Start the development server**:
   ```fish
   bun run dev
   ```

2. **Create or update a post** in the Sanity Studio at `/studio`

3. **Check console logs** for tag generation output:
   - Local mode: `Generated tags (LOCAL TEST MODE - Content Lake not updated):`
   - Production mode: `Generated tags:`

### Environment Variables

Optional - for write token testing:
```fish
set -x SANITY_API_TOKEN your_token_with_write_scope
```

## Production Deployment

1. **Commit changes**:
   ```fish
   git add functions/ sanity.blueprint.ts src/sanity/schemaTypes/post.ts package.json
   git commit -m "feat: add automatic blog post tagging with AI"
   ```

2. **Deploy to Sanity**:
   ```fish
   sanity deploy
   ```

3. **Verify in Studio**: Create or update a post and confirm tags are auto-generated

4. **Verify via API**: Query posts to ensure tags are persisted:
   ```groq
   *[_type == "post"] | order(_updatedAt desc)[0]{title, tags}
   ```

## Fetching from Another Project

### JavaScript/TypeScript Example
```typescript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '61249gtj',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
});

async function getLast3Articles() {
  const articles = await client.fetch(`
    *[_type == "post" && publishedAt <= now() && !coalesce(seo.noIndex, false)] 
    | order(publishedAt desc)[0..2] {
      _id,
      title,
      "slug": slug.current,
      summary,
      publishedAt,
      tags,
      featured,
      "heroImage": heroImage {
        alt,
        "url": asset->url
      },
      "author": author-> {
        _id,
        name
      }
    }
  `);
  
  return articles;
}
```

## Troubleshooting

### Tags Not Generating

**Issue**: New posts don't have tags after creation.

**Solutions**:
1. Verify the post has content in the `content` field
2. Check browser console for errors
3. Ensure `@sanity/blueprints` and `@sanity/functions` are installed:
   ```fish
   bun list @sanity/blueprints @sanity/functions
   ```
4. Confirm `sanity.blueprint.ts` is in the project root

### Tags Not Reusing Existing Tags

**Issue**: Generated tags don't match existing tags from other posts.

**Solutions**:
1. Ensure existing posts have tags populated
2. Check the GROQ query reuses tags correctly:
   ```groq
   array::unique(*[_type == 'post' && _id != $id && defined(tags)].tags[])
   ```
3. Verify tag options in schema: `TAG_OPTIONS` in `post.ts`

### Function Timeout

**Issue**: Generation takes too long (>30 seconds).

**Solutions**:
1. Current timeout is 30 seconds - increase if needed in `sanity.blueprint.ts`
2. Reduce content complexity if possible
3. Check Sanity's AI agent service status

## Related Documentation

- [Sanity Functions](https://www.sanity.io/docs/functions)
- [Sanity Blueprints](https://www.sanity.io/docs/blueprints)
- [Sanity AI Agent API](https://www.sanity.io/docs/ai-agent-api)
- [GROQ Query Language](https://www.sanity.io/docs/groq)

## Rollback

To disable auto-tagging:

```fish
# Restore original files
git restore functions/auto-tag/index.ts sanity.blueprint.ts src/sanity/schemaTypes/post.ts package.json

# Remove function directory
rm -rf functions/

# Reinstall dependencies
bun install

# Deploy
sanity deploy
```
