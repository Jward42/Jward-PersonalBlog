# Usage

This is the everyday author workflow for Jward Atlas.

## Where To Run Commands

On this laptop, both of these work:

```bash
cd /Users/jinyuhan/local_documents/Jinyu-latent-space
```

```bash
cd /Users/jinyuhan/local_documents/Jward-PersonalBlog
```

`Jward-PersonalBlog` is the real GitHub repo. `Jinyu-latent-space` has local shortcut commands that forward into the repo.

## Daily Writing

Create a new entry:

```bash
npm run new
```

Fast writing entry:

```bash
npm run write -- "A small title"
```

Preview what would be created without writing a file:

```bash
npm run write -- "A small title" --dry-run
```

Create a draft:

```bash
npm run write -- "A small title" --draft
```

Drafts show locally but stay hidden from production builds.

## Travel And Photos

For the simple generic flow:

```bash
npm run new
```

For the Cloudinary upload flow from the real repo:

```bash
cd /Users/jinyuhan/local_documents/Jward-PersonalBlog
npm run new:travel -- --file /absolute/path/to/media.jpg
```

Video works the same way:

```bash
npm run new:travel -- --file /absolute/path/to/video.mov
```

Cloudinary credentials live in `.env`, based on `.env.example`.

## Local Preview

Run the local site:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

## Weekly Publishing

Check what would be published:

```bash
npm run publish:check
```

Publish safe content changes:

```bash
npm run publish:weekly
```

The publishing script:

- runs `npm run build`
- stages only safe content/media paths
- commits with a dated message
- pushes the current branch to GitHub

Vercel deploys after the push.

## Manual Publishing

If you want to do it by hand:

```bash
cd /Users/jinyuhan/local_documents/Jward-PersonalBlog
npm run build
git add src/content public/uploads public/images public/media public/photos
git commit -m "Publish site updates"
git push origin main
```

Do not use `git add .` unless you really intend to include generated files.
