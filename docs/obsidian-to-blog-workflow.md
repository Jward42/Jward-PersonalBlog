# Obsidian To Blog Workflow

This repo is the publishing layer for the public website. Obsidian remains the thinking layer.

## Source Of Truth

Use this split:

| Layer | Location | Role |
| --- | --- | --- |
| Thinking | `/Users/jinyuhan/local_documents/obsidian/Notes` | Capture, journal, learning notes, private reflections, area knowledge |
| Editorial buffer | `/Users/jinyuhan/local_documents/obsidian/Notes/blog/drafts` | Public-facing drafts that are not ready for the site yet |
| Publishing | `/Users/jinyuhan/local_documents/repos/Jward-PersonalBlog/src/content/blog` | Final Astro Markdown entries for the website |

Do not sync the whole Obsidian vault into this repo. Only copy or rewrite posts that are ready for public review.

## Recommended Flow

```text
journal / areas / resources / inbox
        ↓
Obsidian blog/drafts
        ↓ public rewrite
Jward-PersonalBlog/src/content/blog
        ↓ local preview
isDraft: false
        ↓ publish
public website
```

## When A Note Is Ready To Become A Blog Draft

A note can move into Obsidian `blog/drafts/` when at least one of these is true:

- It says something useful to a stranger, not only to the author.
- It contains a personal angle that makes a general topic feel specific.
- It can be made public without exposing private people, private finances, customers, or raw journal detail.
- It has a clear ending or takeaway.

If it is still mainly source material, keep it in `resources/` or the relevant `areas/*/raw/`.
If it is still mainly private processing, keep it in `journal/`.
If it is a durable concept, compile it into `areas/*/wiki/` first.

## Public Rewrite Checklist

Before copying a draft into this repo:

- Remove or blur private people, private amounts, client names, and internal company details.
- Convert Obsidian wikilinks into normal prose or public links.
- Replace long quotations with short excerpts, summaries, or source links.
- Check that the article has a title, one-sentence description, and stable tags.
- Make sure the draft reads as an essay, note, field report, or guide rather than a raw transcript.

## Astro Writing Frontmatter

Website writing posts use:

```yaml
---
title: "Post Title"
description: "One clear sentence for listing pages and previews."
publishDate: 2026-05-05
tags: ["writing", "essay"]
heroImage: "https://example.com/cover.jpg"
featured: false
featureRank: 999
isDraft: true
---
```

Notes:

- Start new imported posts with `isDraft: true`.
- Set `isDraft: false` only after local preview.
- `heroImage` is optional for the blog collection, but use one when the post benefits from a visual anchor.
- Keep tags short and stable.

## Content Categories

Use these broad patterns:

| Category | Typical Obsidian source | Suggested tags |
| --- | --- | --- |
| Essay | `journal/`, `areas/*/notes/` | `writing`, `essay`, `reflection` |
| Learning note | `projects/learning-roadmaps/`, `areas/*/wiki/` | `writing`, `learning`, `finance`, `ai` |
| System note | `maintenance/`, project retrospectives | `writing`, `system`, `workflow` |
| Field note | `areas/photography/`, `journal/` | `travel`, `city`, place tag |

## Import Steps

1. Finish the public rewrite in Obsidian `blog/drafts/`.
2. Create a new site entry:

   ```bash
   npm run write -- "Post Title" --draft
   ```

3. Copy the rewritten body into the generated Markdown file under `src/content/blog/`.
4. Adjust frontmatter to match the final title, description, tags, and optional hero image.
5. Preview locally:

   ```bash
   npm run dev
   ```

6. When ready, set `isDraft: false`.
7. Run:

   ```bash
   npm run publish:check
   ```

8. Publish through the existing weekly flow when the check looks right.

## What Not To Publish

Avoid publishing directly from:

- Raw journal entries.
- Private relationship notes.
- Private finance amounts or account details.
- Raw imported highlights with long copied passages.
- Client/customer/internal company material.
- Half-finished learning checklists.

The website should feel like a curated public voice, not a mirror of the whole vault.
