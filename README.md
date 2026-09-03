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

تُستخدم نسخ محلية مضغوطة للعرض (`scripts/optimize-images.ps1`، عبر `pnpm optimize:images`؛ جودة 80 وأطول ضلع 1600 بكسل، انخفاض الحجم ≈ 93%). `og:image` يبقى على رابط Wikimedia المطلق حتى يُضبط نطاق نهائي.

## ترتيب الأقسام الحالي (بعد التوسعة)
hero → عن السوق → معرض الصور → **التاريخ والمكانة (#history)** → خطط للزيارة (#visit) → المواصلات والخريطة → **المرافق والخدمات (#facilities، أنواع فقط دون أسماء تجارية)** → **الطقس والتوقعات (#weather)** → حول مطرح (#nearby) → **اقتراح جولة (#route)** → الأسئلة الشائعة (#faq) → ملاحظة الاستقلال.

## الطقس (SSR + تخزين مؤقت)
- قسم الطقس مكوّن خادمي (Server Component) يجلب البيانات من Open-Meteo (خدمة مفتوحة بلا مفتاح) بإحداثيات سوق مطرح 23.6204/58.5645.
- التخزين المؤقت: إن وُجد `caches.default` (بيئة Cloudflare Workers) تُخزَّن الاستجابة 30 دقيقة عبر Cache API المشتركة، مع ذاكرة داخل العزل للمزامنة؛ وفي غيابه (التطوير المحلي) تُجلب مباشرة مع ذاكرة TTL داخل العملية. عند أي فشل يظهر بطاقة بديلة دون إسقاط الصفحة.

## ملاحظات حول pnpm-workspace.yaml
- الملف يُعرّف `allowBuilds` لـ esbuild وworkerd (متطلب pnpm 11؛ لم يعد يُقرأ حقل `pnpm` من package.json) وهو **دون `packages:`** فيبقى المشروع وحيد الحزمة.
- عدّلت `scripts/verify-source.mjs` للسماح بملف إعدادات من هذا النوع شرط عدم احتوائه على `packages:` أو `catalog`.
- عدّلت `scripts/verify-build.mjs` بحيث لا يفحص `dist/server` (حزمة إطار العمل تتضمن كلمات مثل example.com وlocalhost من كود Astro نفسه)؛ محتوى المشروع مفحوص أصلاً على مستوى المصدر في verify-source.
