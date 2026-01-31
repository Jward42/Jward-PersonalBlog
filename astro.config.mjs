// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // 你的部署域名，用于 SEO 和生成绝对 URL（请替换为真实域名）
  site: 'https://astro-portfolio.vercel.app',

  // 需要 Tailwind 样式支持
  integrations: [tailwind({
    applyBaseStyles: true,
  }), sitemap()],

  // 输出模式：默认是静态站点（static）
  output: 'static',

  // 可选：设置路径别名，方便引入文件
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@content': '/src/content',
        '@assets': '/src/assets',
      },
    },
  },

  // 可选：如果你要在 Vercel 部署，可以显式开启适配器
  // adapter: vercel(), // npm i @astrojs/vercel 之后启用
})