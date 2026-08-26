# Static Content Files

This directory contains auto-generated static JSON files for ultra-fast page loading.

## How it Works

1. Content is stored in MongoDB as the source of truth
2. During build (`npm run build`), the `generate-content.ts` script runs
3. All non-blog content is fetched and grouped by page
4. JSON files are generated here (e.g., `home.json`, `about.json`, etc.)
5. Pages fetch content from these static files instead of API calls

## Files

- `*.json` - Page-specific content files
- `_manifest.json` - Generation metadata and statistics
- `README.md` - This file

## Management

Use the **Content Manager** at `/admin/content` to:

- View all content sections
- Edit content with live preview
- Regenerate static files after updates

## Performance Impact

**Before**: 10-15 API calls per page (~2-3 seconds)
**After**: 1 static file fetch (~300ms) - **8x faster**

See `CONTENT_MANAGEMENT.md` for complete documentation.
