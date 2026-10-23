import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// النطاق الرسمي للموقع؛ يُستخدم في توليد canonical وsitemap وروابط OG.
const SITE_URL = 'https://muttrahsouk.com';
const site = SITE_URL.trim() || undefined;

export default defineConfig({
  site,
  output: 'server',
  adapter: cloudflare({ configPath: "./wrangler.jsonc" }),
  integrations: site ? [sitemap({ filter: (url) => !/\/404(?:\/|$)/.test(url) })] : [],
  vite: {
    plugins: [tailwindcss()]
  }
});
