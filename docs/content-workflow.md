# Content Workflow

The site does not use a hosted CMS. Markdown files are the content database.

## Daily Entry Points

Create new content:

```bash
npm run new
```

Create a fast writing entry:

```bash
npm run write -- "A small title"
```

See `USAGE.md` for the full author workflow.

## Content Folders

Writing:

```text
src/content/blog/
```

Travel, photography, and future vlog entries:

```text
src/content/photography/
```

Photo categories:

```text
src/content/photoCategories/
```

Reusable starter files:

```text
templates/writing-template.md
templates/travel-template.md
```

## Writing Frontmatter

```yaml
title: "My New Essay"
description: "A short one-line summary."
publishDate: 2026-05-04
tags: ["writing", "reflection"]
heroImage: "https://..."
featured: false
featureRank: 999
isDraft: false
```

## Travel Frontmatter

```yaml
title: "Sunrise by the River"
description: "Golden light over still water."
captureDate: 2026-05-04
location: "Boston"
category: "waterside"
tags: ["travel", "sunrise", "quiet"]
imageUrl: "https://..."
aspectRatio: 1.58
mediaType: "image"
featured: false
featureRank: 999
isDraft: false
```

For video entries, add:

```yaml
mediaType: "video"
videoUrl: "https://..."
posterImage: "https://..."
```

## Drafts And Publishing

`isDraft: true` appears in local development and is hidden in production builds.

`isDraft: false` can be published.

Homepage highlights use:

```yaml
featured: true
featureRank: 1
```

Lower `featureRank` appears first.

## Tags

Keep tags short and stable.

Good patterns:

- format: `essay`, `travel`, `vlog`
- mood/topic: `quiet`, `reflection`, `city`
- place: `boston`, `banff`, `kyoto`

Avoid near-duplicates like `photo`, `photos`, and `photography` all at once.

## Media Upload

Cloudinary-backed upload is available through:

```bash
npm run new:travel -- --file /absolute/path/to/media.jpg
```

Create `.env` from `.env.example` and fill in:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`
