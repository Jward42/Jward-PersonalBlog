> 说明：本模板按你的“Gemini 项目自述 + 系统设计”生成，并结合 Astro 最佳实践（使用官方 Tailwind 集成 `@astrojs/tailwind` 与内容集合 `astro:content`）。把下面所有文件粘到你的新仓库即可跑通。AI IDE（Cursor / Claude Code）会优先读取 `.cursorrules`、`TASKS.md`、`DECISIONS.md` 等，让模型能“记住规则、跟踪任务”。

---

# 0) 文件树（最小可运行集）

```
/ (repo root)
├─ .cursorrules
├─ TASKS.md
├─ DECISIONS.md
├─ SCOPE.md
├─ STYLEGUIDE.md
├─ PROMPTS/
│  ├─ system.md
│  ├─ coding-guidelines.md
│  ├─ pull-request-review.md
│  └─ content-authoring.md
├─ docs/
│  ├─ REQUIREMENTS.md
│  ├─ IA.md
│  └─ SEO.md
├─ public/
│  └─ favicon.svg
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ package.json
└─ src/
   ├─ assets/
   │  └─ global.css
   ├─ components/
   │  ├─ BaseHead.astro
   │  ├─ Header.astro
   │  ├─ Footer.astro
   │  ├─ BlogPostCard.astro
   │  ├─ PhotoCard.astro
   │  └─ Tag.astro
   ├─ content/
   │  ├─ config.ts
   │  ├─ blog/
   │  │  ├─ 2025-11-04-hello-world.md
   │  │  └─ 2025-11-04-astro-tailwind.md
   │  └─ photography/
   │     ├─ 2025-10-01-sunrise-river.md
   │     └─ 2025-09-20-boston-street.md
   ├─ layouts/
   │  └─ BaseLayout.astro
   └─ pages/
      ├─ index.astro
      ├─ about.astro
      ├─ blog/
      │  ├─ index.astro
      │  └─ [slug].astro
      └─ photography/
         └─ index.astro
```

---

# 1) 基础规则 & 任务追踪

## `.cursorrules`

```md
# Project Rules (Astro + Tailwind + Content Collections)
- Always read TASKS.md, DECISIONS.md, STYLEGUIDE.md before coding.
- Do NOT add dependencies without updating DECISIONS.md (explain WHY).
- Every commit references a Task ID (e.g. T-003) and includes a 1-line WHY.
- Use semantic HTML and a11y: landmarks, labels, alt text.
- All pages must include proper SEO meta per docs/SEO.md (via <BaseHead/>).
- Styling: Tailwind utility-first; typography via @tailwindcss/typography.
- Images: hosted on Cloudinary. When rendering, add transformations like `f_auto,q_auto,w_800` unless layout requires otherwise.
- Content model: Manage posts & photos via src/content collections only.
- If requirements unclear: propose 2–3 options in PR comment; don't guess.
```

## `TASKS.md`

```md
# Task Board

## Backlog
- [ ] T-001 Scaffold Astro project; integrate Tailwind; add typography plugin
- [ ] T-002 Implement Base layout + Header + Footer + BaseHead
- [ ] T-003 Define content collections schema (blog, photography) and samples
- [ ] T-004 Build pages: Home (hooks), Blog (list/detail), Photography (grid)
- [ ] T-005 Wire Cloudinary image transforms (components use w_800,q_auto,f_auto)
- [ ] T-006 Add basic SEO: title/desc/og + canonical; sitemap later
- [ ] T-007 Deploy to Vercel (CI/CD); set domain; preview links
- [ ] T-008 Add tags filtering/search (client-side) [optional]

## In Progress
- [ ] T-001

## Done
- [ ]
```

## `DECISIONS.md`

```md
# Decisions (ADR-lite)
- 2025-11-04 Stack: Astro + Tailwind + @tailwindcss/typography + Content Collections.
  Reason: Hybrid static site, markdown-first, zero-JS by default, great perf.
- Images hosted on Cloudinary; use URL transforms for perf (w_*, q_auto, f_auto).
- Deployment: Vercel. Reason: seamless CI/CD from GitHub, preview URLs.
```

## `SCOPE.md`

```md
# Scope
In-scope (MVP): Home (bio + latest posts + featured photos), Blog (list & post), Photography (grid), About (skills + resume links), basic Contact (social links).
Out-of-scope (MVP): Comments system, search indexing service, RSS/sitemap automation, CMS.
```

## `STYLEGUIDE.md`

```md
# Code
- TypeScript in content config; Astro components prefer script setup minimalism.
- Folder-by-feature; co-locate small styles with components when needed.

# UI
- Tailwind spacing: 4px grid; container max-w-screen-lg for articles.
- Typography: use `prose` for article body, `lg:prose-xl` on desktop.
- Color tokens: text, muted, border; prefer system color scheme (dark via media).
- Cards: rounded-2xl, shadow-sm (no heavy shadows), hover:opacity-95.
```

---

# 2) Prompt 模板（让 AI IDE“按规矩办事”）

## `PROMPTS/system.md`

```md
You are a senior full-stack engineer working in this Astro repo.
Before coding, read .cursorrules, TASKS.md, DECISIONS.md, STYLEGUIDE.md.
When finishing a task, update TASKS.md and note decisions in DECISIONS.md.
Prefer accessibility and performance. Use Cloudinary transforms for images.
```

## `PROMPTS/coding-guidelines.md`

```md
Always:
1) Briefly explain reasoning before code.
2) Touch only files relevant to the task and list them.
3) Keep diffs small (<300 LOC) unless unavoidable; otherwise split tasks.
4) Keep SEO & a11y intact; verify with docs/SEO.md.
5) Update examples/tests/docs when you add or change public-facing APIs.
```

## `PROMPTS/pull-request-review.md`

```md
Review for:
- Consistency with DECISIONS.md & STYLEGUIDE.md
- Accessibility (landmarks, labels, alt text) and SEO (title/desc/og)
- Bundle/asset size (too-large images; add Cloudinary transforms)
- Content schema integrity (frontmatter fields)
Return: summary + must-fix + nice-to-have suggestions.
```

## `PROMPTS/content-authoring.md`

```md
Act as an editor. Improve clarity and structure, keep author's voice.
- Enforce single H1 and logical H2/H3.
- Ensure frontmatter fields are complete (title, description, publishDate, tags).
- Suggest 3 SEO titles + a 160-char meta description when missing.
```

---

# 3) 文档（需求 / 信息架构 / SEO）

## `docs/REQUIREMENTS.md`

```md
# Requirements (from Gemini brief)
- Dual-purpose site: personal blog + photography, and MLE portfolio.
- Blog with markdown posts, tags; Photography grid with tags.
- About: bio, skill stack, resume link; Contact via social links or form.
- Hybrid static: text in Git; images on Cloudinary. Deploy on Vercel.
```

## `docs/IA.md`

```md
# Information Architecture
- Global Nav: Home, Blog, Photography, About
- Home hooks: latest 3 blog posts; featured 6 photos
- Blog list: cards with title, date, tags; filters by tag (later)
- Blog detail: article (prose), hero image optional
- Photography: responsive grid (2/3/4 columns)
- About: bio, skills, resume link, social links
```

## `docs/SEO.md`

```md
# SEO Checklist
- Each page sets <title> and meta description via <BaseHead/>.
- Include og:title, og:description, og:type, og:image, twitter:card.
- Canonical URL on main pages.
- Images: use alt text; Cloudinary transforms (q_auto,f_auto,w_*) for perf.
```

---

# 4) 项目配置（Astro + Tailwind）

## `package.json`

```json
{
  "name": "astro-portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "echo 'add eslint if needed'"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/tailwind": "^5.1.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14"
  }
}
```

> 备注：Tailwind 的官方 Astro 集成是 `@astrojs/tailwind`，`@tailwindcss/typography` 通过 `tailwind.config.mjs` 插件启用。

## `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true
    })
  ],
  site: 'https://your-domain.com' // 替换为你的域名（用于绝对链接/OG）
});
```

## `tailwind.config.mjs`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
};
```

## `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="black"/>
  <text x="50" y="57" text-anchor="middle" font-size="52" fill="white" font-family="Arial, Helvetica">EH</text>
</svg>
```

---

# 5) 全局样式

## `src/assets/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 可加入你的自定义 token */
:root {
  --radius: 1rem;
}

.prose img {
  border-radius: var(--radius);
}
```

---

# 6) 内容集合 Schema 与示例内容

## `src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';

// Blog collection (.md)
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().url().optional(), // Cloudinary URL
    isDraft: z.boolean().default(false)
  })
});

// Photography collection (.md used for metadata; image hosted on Cloudinary)
const photographyCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    captureDate: z.date(),
    tags: z.array(z.string()).default([]),
    imageUrl: z.string().url(), // Cloudinary URL
    aspectRatio: z.number().default(1)
  })
});

export const collections = {
  blog: blogCollection,
  photography: photographyCollection
};
```

## 示例 Blog：`src/content/blog/2025-11-04-hello-world.md`

```md
---
title: Hello World
description: My first post on the Astro + Tailwind portfolio site.
publishDate: 2025-11-04
tags: [intro, astro]
heroImage: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/sample.jpg
isDraft: false
---

Welcome to my site! This post is rendered with **Astro content collections** and styled by Tailwind **typography**.
```

## 示例 Blog：`src/content/blog/2025-11-04-astro-tailwind.md`

```md
---
title: Astro + Tailwind: Fast by Default
description: Why hybrid static sites are great for blogs and portfolios.
publishDate: 2025-11-04
tags: [astro, tailwind, portfolio]
heroImage: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/landscapes/nature.jpg
isDraft: false
---

Astro ships zero JS by default and pairs nicely with Tailwind for quick UI work.
```

## 示例 Photography：`src/content/photography/2025-10-01-sunrise-river.md`

```md
---
title: Sunrise by the River
captureDate: 2025-10-01
tags: [sunrise, nature]
imageUrl: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/samples/landscapes/landscape-panorama.jpg
aspectRatio: 1.5
---

Golden hour light over calm waters.
```

## 示例 Photography：`src/content/photography/2025-09-20-boston-street.md`

```md
---
title: Boston Street
captureDate: 2025-09-20
tags: [street, boston]
imageUrl: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/samples/landscapes/beach-boat.jpg
aspectRatio: 1.2
---

Morning walk with long shadows and crisp air.
```

---

# 7) 复用组件

## `src/components/BaseHead.astro`

```astro
---
const {
  title = 'Portfolio',
  description = 'Personal blog + MLE portfolio',
  image = 'https://your-domain.com/og-default.png',
  canonical
} = Astro.props as {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
};
---

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  {canonical && <link rel="canonical" href={canonical} />}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
```

## `src/components/Header.astro`

```astro
<header class="border-b">
  <div class="mx-auto max-w-screen-xl px-4 py-4 flex items-center justify-between">
    <a href="/" class="font-bold">EH • Portfolio</a>
    <nav class="flex items-center gap-6">
      <a href="/blog" class="hover:underline">Blog</a>
      <a href="/photography" class="hover:underline">Photography</a>
      <a href="/about" class="hover:underline">About</a>
    </nav>
  </div>
</header>
```

## `src/components/Footer.astro`

```astro
<footer class="border-t mt-16">
  <div class="mx-auto max-w-screen-xl px-4 py-8 text-sm text-neutral-500">
    © {new Date().getFullYear()} Edward Han. All rights reserved.
  </div>
</footer>
```

## `src/components/Tag.astro`

```astro
---
const { label, href = '#' } = Astro.props as { label: string; href?: string };
---
<a href={href} class="inline-flex items-center rounded-full border px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50">
  #{label}
</a>
```

## `src/components/BlogPostCard.astro`

```astro
---
import Tag from './Tag.astro';
const { post } = Astro.props as { post: any };
const url = `/blog/${post.slug}`;
---
<article class="rounded-2xl border p-5 hover:shadow-sm transition">
  {post.data.heroImage && (
    <a href={url} class="block mb-4">
      <img
        src={`${post.data.heroImage.replace('/upload/', '/upload/f_auto,q_auto,w_800/')}`}
        alt={post.data.title}
        class="w-full h-48 object-cover rounded-xl"
        loading="lazy"
      />
    </a>
  )}
  <a href={url} class="text-lg font-semibold hover:underline">{post.data.title}</a>
  <p class="mt-2 text-sm text-neutral-600">{post.data.description}</p>
  <div class="mt-3 flex flex-wrap gap-2">
    {post.data.tags?.map((t: string) => <Tag label={t} />)}
  </div>
</article>
```

## `src/components/PhotoCard.astro`

```astro
---
const { photo } = Astro.props as { photo: any };
const transformed = photo.data.imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
---
<div class="group rounded-2xl overflow-hidden border">
  <img src={transformed} alt={photo.data.title} class="w-full object-cover" loading="lazy" />
  <div class="p-3 text-sm">
    <div class="font-medium">{photo.data.title}</div>
    {photo.data.tags?.length ? <div class="mt-1 text-neutral-500">{photo.data.tags.join(', ')}</div> : null}
  </div>
</div>
```

---

# 8) 布局 & 页面

## `src/layouts/BaseLayout.astro`

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
const { title, description, canonical } = Astro.props as {
  title?: string; description?: string; canonical?: string;
};
---
<html lang="zh-CN">
  <BaseHead {title} {description} {canonical} />
  <body class="min-h-dvh bg-white text-neutral-900">
    <a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>
    <Header />
    <main id="main" class="mx-auto max-w-screen-xl px-4 pt-8 pb-16">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

## `src/pages/index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import BlogPostCard from '../components/BlogPostCard.astro';
import PhotoCard from '../components/PhotoCard.astro';

const posts = (await getCollection('blog'))
  .filter((p) => !p.data.isDraft)
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 3);
const photos = (await getCollection('photography')).slice(0, 6);
---
<BaseLayout title="Edward Han · Portfolio" description="个人博客与 MLE 作品集">
  <section class="grid gap-8 md:grid-cols-3 md:items-start">
    <div class="md:col-span-2">
      <h1 class="text-3xl font-bold tracking-tight">Hi, I'm Edward (Jinyu) Han</h1>
      <p class="mt-3 text-neutral-600">Data Science / MLE. I write about ML systems and share photography.</p>
    </div>
    <div class="md:justify-self-end">
      <img src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_320/sample.jpg" alt="Edward Han" class="rounded-2xl border" />
    </div>
  </section>

  <section class="mt-12">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Latest Posts</h2>
      <a href="/blog" class="text-sm text-blue-600 hover:underline">All posts →</a>
    </div>
    <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => <BlogPostCard post={post} />)}
    </div>
  </section>

  <section class="mt-12">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Featured Photography</h2>
      <a href="/photography" class="text-sm text-blue-600 hover:underline">See gallery →</a>
    </div>
    <div class="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => <PhotoCard photo={photo} />)}
    </div>
  </section>
</BaseLayout>
```

## `src/pages/about.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About — Edward Han" description="Bio, skills, resume">
  <h1 class="text-2xl font-bold">About</h1>
  <p class="mt-4 max-w-prose">I'm a data science student and MLE-in-progress. This site hosts my blog and photography. Skills: Python, Pandas/NumPy, PyTorch, Docker, GCP/AWS; Web: Astro, Tailwind.</p>
  <ul class="mt-6 list-disc pl-6 text-neutral-700">
    <li>Resume: <a class="text-blue-600 hover:underline" href="#">PDF</a></li>
    <li>GitHub: <a class="text-blue-600 hover:underline" href="#">@your-github</a></li>
    <li>LinkedIn: <a class="text-blue-600 hover:underline" href="#">Profile</a></li>
  </ul>
</BaseLayout>
```

## `src/pages/blog/index.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import BlogPostCard from '../../components/BlogPostCard.astro';
const posts = (await getCollection('blog'))
  .filter((p) => !p.data.isDraft)
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
---
<BaseLayout title="Blog — Edward Han" description="Technical posts and notes">
  <h1 class="text-2xl font-bold">Blog</h1>
  <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {posts.map((post) => <BlogPostCard post={post} />)}
  </div>
</BaseLayout>
```

## `src/pages/blog/[slug].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEntryBySlug } from 'astro:content';

export async function getStaticPaths() {
  // Astro 自动基于 content collection 生成路径
  return { params: (await Astro.glob('../../content/blog/*.md')).map((p) => ({ slug: p.file.split('/').pop().replace('.md','') })) };
}

const { slug } = Astro.params;
const post = await getEntryBySlug('blog', slug!);
if (!post) throw new Error(`Post not found: ${slug}`);
const { Content, data } = await post.render();
---
<BaseLayout title={`${post.data.title} — Blog`} description={post.data.description}>
  {post.data.heroImage && (
    <img src={`${post.data.heroImage.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')}`} alt={post.data.title} class="w-full h-72 object-cover rounded-2xl border" />
  )}
  <article class="prose lg:prose-xl mt-6">
    <h1>{post.data.title}</h1>
    <p class="text-sm text-neutral-500">{post.data.publishDate.toDateString()}</p>
    <Content />
  </article>
</BaseLayout>
```

> 说明：上面的 `getStaticPaths` 写法是一个简洁实现。如果更偏官方写法，可在前置脚本中用 `getCollection('blog')` 映射 `slug`。

## `src/pages/photography/index.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
const photos = await getCollection('photography');
---
<BaseLayout title="Photography — Edward Han" description="Selected photos">
  <h1 class="text-2xl font-bold">Photography</h1>
  <div class="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {photos.map((p) => (
      <div class="rounded-2xl overflow-hidden border">
        <img src={p.data.imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_800/')} alt={p.data.title} loading="lazy" />
        <div class="p-3 text-sm">
          <div class="font-medium">{p.data.title}</div>
          {p.data.tags?.length ? <div class="mt-1 text-neutral-500">{p.data.tags.join(', ')}</div> : null}
        </div>
      </div>
    ))}
  </div>
</BaseLayout>
```

---

# 9) 本地运行与部署

**初始化**

```bash
# 使用 pnpm / npm / yarn 均可
npm create astro@latest  # 可先创建空项目后替换为本文文件
npm i
npm i -D @astrojs/tailwind tailwindcss postcss autoprefixer
npm run dev
```

**部署到 Vercel**

1. 新建 GitHub 仓库，push。
2. Vercel 连接该仓库，Framework 选 Astro，环境变量按需设置（如 CLOUDINARY_BASE）。
3. 每次 `git push` 自动构建并生成 Preview/Production。

---

# 10) 后续增强（可写入 Backlog）

* RSS & sitemap 生成脚本；
* 标签筛选与搜索（前端 Fuse.js 或 Pagefind for static）；
* 文章/照片列表分页；
* 动态 OG 生成（Satori / @vercel/og，部署在边缘函数）；
* Contact 表单（例如使用 Basin / Formspree）。

---

> 完毕：以上即是“可落地”的最小模板 + 规则/任务/文档一整套。将它们粘到你的仓库根目录即可使用。Cursor/Claude Code 会依据 `.cursorrules` 与 `TASKS.md` 跟进开发。
