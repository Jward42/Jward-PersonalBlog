# Jward Atlas

Personal site for writing, travel notes, photography, and future vlog posts.

## Start Here

On this laptop, you can run the daily commands from either folder:

```bash
cd /Users/jinyuhan/local_documents/Jinyu-latent-space
```

or the real GitHub repo:

```bash
cd /Users/jinyuhan/local_documents/Jward-PersonalBlog
```

Create something new:

```bash
npm run new
```

Create a fast writing entry:

```bash
npm run write -- "A small title"
```

Preview locally:

```bash
npm run dev
```

Publish weekly content changes:

```bash
npm run publish:check
npm run publish:weekly
```

Vercel deploys automatically after GitHub receives the push.

## What To Edit

Most content lives in Markdown:

- Writing: `src/content/blog/`
- Travel / photography / vlog entries: `src/content/photography/`
- Photo categories: `src/content/photoCategories/`
- Homepage hero copy: `src/content/homepage/hero.md`

Useful top-level docs:

- `USAGE.md`: daily writing and publishing workflow
- `docs/content-workflow.md`: content model details and media workflow
- `docs/STYLEGUIDE.md`: visual and editorial style notes

## Content Rules

Each Markdown file is one published page or entry.

Draft behavior:

- `isDraft: true` is visible in local dev.
- `isDraft: true` is hidden in production builds.
- `isDraft: false` can go online.

Homepage highlights:

- Set `featured: true`.
- Use a smaller `featureRank` for higher priority.

Tags should stay simple and consistent: `writing`, `travel`, `essay`, `quiet`, `city`, `boston`, `banff`, and similar stable words.

## Publishing Safety

`npm run publish:weekly` runs a production build, then stages only safe content/media paths:

- `src/content/`
- `public/uploads/`
- `public/images/`
- `public/media/`
- `public/photos/`

It does not stage `dist`, `.astro`, or `node_modules`.

## Project Shape

The site is Astro + Tailwind CSS.

Main routes:

- `/`
- `/writing`
- `/travel`
- `/photography`
- `/about`
- `/studio`

The public site is deployed by Vercel from the GitHub `main` branch.
