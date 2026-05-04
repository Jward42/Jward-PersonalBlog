# Author Desk

Daily writing:

```bash
npm run new
```

Fast writing entry:

```bash
npm run write -- "A small title"
```

Weekly publishing check:

```bash
npm run publish:check
```

Weekly publishing:

```bash
npm run publish:weekly
```

`publish:weekly` builds the site, stages only safe content paths, commits them, and pushes the current branch to GitHub. Vercel deploys after the push.

Safe weekly paths:

- `src/content/`
- `public/uploads/`
- `public/images/`
- `public/media/`
- `public/photos/`
