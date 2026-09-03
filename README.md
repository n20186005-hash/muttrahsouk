# دليل سوق مطرح — Astro / Tailwind / Cloudflare Workers

موقع عربي أحادي اللغة مخصص لسوق مطرح في مسقط، عُمان.

## الإصدارات المثبتة
- Node.js 24.20.0 LTS
- pnpm 11.24.0
- Astro 7.2.10
- Tailwind CSS 4.3.3
- TypeScript 6.0.3 (ضمن نطاق الدعم المعلن لـ @astrojs/check 0.9.10؛ دعم TS 6 أضيف في 0.9.9)
- @astrojs/check 0.9.10
- @astrojs/cloudflare 14.2.6
- @astrojs/sitemap 3.7.4
- Wrangler 4.128.0

## إعداد النطاق
لا يوجد نطاق افتراضي وهمي. افتح `astro.config.mjs` وضع النطاق المسجّل في الثابت `SITE_URL` الوحيد. لا تضف النطاق في أي ملف آخر.

إذا بقي `SITE_URL` فارغاً، يستمر البناء دون canonical مطلق ودون sitemap، ولا يُحقن أي نطاق تجريبي أو عنوان محلي.

## أوامر التحقق
```bash
rm -rf node_modules
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build
```

## Cloudflare Workers
بعد البناء:
```bash
pnpm deploy
```

## الصور
راجع `public/images/IMAGE_SOURCES.md`. الصور حقيقية ومرتبطة بالمكان، مع توثيق المصدر والترخيص.
