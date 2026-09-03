import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// ضع النطاق الرسمي هنا بعد تسجيله، واتركه فارغاً قبل ذلك.
const SITE_URL = '';
const site = SITE_URL.trim() || undefined;

export default defineConfig({
  site,
  output: 'server',
  adapter: cloudflare(),
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()]
  }
});
