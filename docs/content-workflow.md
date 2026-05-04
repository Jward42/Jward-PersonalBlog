# Content Workflow

This site does not use a separate hosted database yet.

The content files under `src/content/blog` and `src/content/photography` are the database.

## Two-Step Author Workflow

Most days, use one simple entry point:

```bash
npm run new
```

For a fast writing entry:

```bash
npm run write -- "A small title"
```

Once a week, check what would be published:

```bash
npm run publish:check
```

Then publish:

```bash
npm run publish:weekly
```

The weekly script runs a production build, stages only safe content paths, commits them, and pushes to GitHub. Vercel deploys from GitHub after the push.

Safe weekly paths are:

- `src/content/`
- `public/uploads/`
- `public/images/`
- `public/media/`
- `public/photos/`

There is also a local author page at `/studio` for generating and saving markdown entries from the browser.

If you want clean starter files without publishing fake content, use:

- `templates/writing-template.md`
- `templates/travel-template.md`

## Writing

Create a new writing entry:

```bash
npm run new:writing
```

Import body text from an existing diary file:

```bash
npm run new:writing -- --from /absolute/path/to/diary.md
```

## Travel / Photo / Vlog

Create a new travel entry:

```bash
npm run new:travel
```

If Cloudinary credentials exist in `.env`, you can pass a local photo or video file and the script will upload it first, then generate the markdown entry automatically.

```bash
npm run new:travel -- --file /absolute/path/to/media.mov
```

If you already have hosted media, skip upload and paste the URL when prompted.

## Tags

Tags are just arrays in frontmatter, for example:

```yaml
tags: [travel, sunrise, quiet]
```

Use a small stable vocabulary and avoid synonyms like `photo`, `photos`, `photography` all at once.

Suggested pattern:

- format tags: `essay`, `travel`, `vlog`
- mood or topic tags: `quiet`, `reflection`, `city`
- place tags: `boston`, `banff`, `kyoto`

## Cloudinary Setup

Create `.env` from `.env.example` and fill in:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

Once that is set, local media import becomes a one-step flow instead of upload + copy URL + paste URL.
