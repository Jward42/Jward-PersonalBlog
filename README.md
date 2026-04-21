# Jward Atlas

This is your personal site for:

- writing
- travel notes
- photography
- future vlog posts

You can think of it as a small publication, not a software dashboard.

## The Main Idea

You do **not** need a separate database right now.

The content files are the database:

- `src/content/blog/` for writing
- `src/content/photography/` for travel, photos, and future vlog entries

Each Markdown file is one post.

## If You Are Using This As An Author

The easiest mental model is:

1. Write or import a piece of text
2. Add tags and a short description
3. Add a photo or video link
4. Mark it featured if you want it on the homepage

That is it.

## Site Structure

- `/` homepage
- `/writing` writing archive
- `/travel` travel archive
- `/about` about page
- `/studio` local author desk

The homepage automatically pulls:

- highlighted writing and travel posts
- the latest writing posts
- the latest travel posts

## How Writing Works

Writing lives in:

```text
src/content/blog/
```

Each file looks like this:

```md
---
title: "My New Essay"
description: "A short one-line summary."
publishDate: 2026-04-21
tags: ["writing", "reflection"]
heroImage: "https://..."
featured: true
featureRank: 1
isDraft: false
---

Your text starts here.
```

### Important fields

- `title`: post title
- `description`: short summary used on lists and homepage
- `publishDate`: the date
- `tags`: used for grouping and filtering
- `heroImage`: optional cover image
- `featured`: whether it can appear in homepage highlights
- `featureRank`: lower number means higher priority
- `isDraft`: set `true` if you do not want it published yet

## How Travel / Photography / Vlog Works

Travel content lives in:

```text
src/content/photography/
```

Each file looks like this:

```md
---
title: "Sunrise by the River"
description: "Golden light over still water."
captureDate: 2026-04-21
location: "Boston"
category: "waterside"
tags: ["travel", "sunrise", "quiet"]
imageUrl: "https://..."
aspectRatio: 1.58
mediaType: "image"
featured: true
featureRank: 2
isDraft: false
---

Travel notes go here.
```

### Extra fields for travel

- `location`: place name shown on cards
- `category`: broad grouping like `street`, `landscape`, `vlog`
- `imageUrl`: main image or poster image
- `aspectRatio`: supports both vertical and horizontal work
- `mediaType`: `image` or `video`
- `videoUrl`: only needed for vlog/video posts
- `posterImage`: optional preview image for video

## Recommended Tag Style

Keep tags simple and consistent.

Good pattern:

- format: `writing`, `travel`, `vlog`, `essay`
- mood/topic: `reflection`, `quiet`, `city`, `morning`
- place: `boston`, `banff`, `kyoto`

Try to avoid near-duplicates like:

- `photo`
- `photos`
- `photography`

Pick one system and stay with it.

## Two Ways To Add Content

### Option 1: Edit files directly

This is the most author-friendly method.

You can:

- duplicate an existing post
- rename it
- change the frontmatter
- paste in your writing or notes

This is the best default workflow if you like thinking in folders.

### Option 1.5: Use the Studio page

There is also a browser-based author page at:

```text
/studio
```

It can:

- generate the Markdown for writing and travel posts
- suggest the correct filename
- let you copy the result
- let you download the file
- in supported browsers, save directly into your local repo folder

This is the easiest option if you want a more visual workflow without adopting a full CMS.

### Option 2: Use the helper commands

These are optional. They save time when you want to create posts quickly.

Create a writing post:

```bash
npm run new:writing
```

Create a travel post:

```bash
npm run new:travel
```

Import an existing diary file into writing:

```bash
npm run new:writing -- --from /absolute/path/to/diary.md
```

Upload a local photo or video and create a travel entry:

```bash
npm run new:travel -- --file /absolute/path/to/media.jpg
```

Or:

```bash
npm run new:travel -- --file /absolute/path/to/video.mov
```

## How Media Upload Works

You currently use Cloudinary for hosted media.

If Cloudinary is configured, the travel helper script can:

- upload a local image
- upload a local video
- generate the Markdown entry automatically

That means you no longer need to:

1. upload manually
2. copy the URL by hand
3. paste it back into the content file

## Cloudinary Setup

Create a local `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then fill in:

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=jward-atlas
```

Once that is filled in, `npm run new:travel -- --file ...` becomes your easiest upload flow.

## Homepage Curation

If you want a post to show up in homepage highlights:

- set `featured: true`
- set a smaller `featureRank`

Example:

```yaml
featured: true
featureRank: 1
```

Lower number means stronger priority.

## Local Preview

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the built version:

```bash
npm run preview
```

## Deployment

This site is deployed on Vercel.

Typical flow:

1. make content or design changes
2. commit to GitHub
3. push to `main`
4. Vercel deploys automatically

## Current Working Rule

If you are choosing between “folder workflow” and “CLI workflow”:

- use **folders** as the main way to think
- use **CLI** only when it saves repetitive work

That keeps the site author-friendly while still letting automation help you.

## Related Notes

More workflow notes live in:

```text
docs/content-workflow.md
```
