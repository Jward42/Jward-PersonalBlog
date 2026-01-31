# Decisions (ADR-lite)
- 2025-11-04 Stack: Astro + Tailwind + @tailwindcss/typography + Content Collections.
Reason: Hybrid static site, markdown-first, zero-JS by default, great perf.
- Images hosted on Cloudinary; use URL transforms for perf (w_*, q_auto, f_auto).
- Deployment: Vercel. Reason: seamless CI/CD from GitHub, preview URLs.