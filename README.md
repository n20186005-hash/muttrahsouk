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
النطاق الرسمي `muttrahsouk.com` مضبوط في المصدر الوحيد `SITE_URL` داخل `astro.config.mjs`. تُشتق منه تلقائياً عبر `Astro.site`: canonical وsitemap وروابط OG و`@id`/`url`/`image` في JSON-LD — فلا يُكتب النطاق حرفياً في الصفحات. `public/robots.txt` يوجّه إلى sitemap المولَّد.

إذا غُيّر النطاق لاحقاً، عدّل الثابت `SITE_URL` أعلاه فقط ثم أعد البناء (وأعد توليد sitemap). عند إبقاء الثابت فارغاً يستمر البناء دون sitemap ودون روابط مطلقة.

## ربط الكيان (Entity Binding)
- TouristAttraction JSON-LD: `@id #attraction` + `name`/`alternateName`(Mutrah Souq/Muttrah Souq) + `url`/`image` مطلقتان + `address`(مطرح/محافظة مسقط/OM) + `geo` + `hasMap` + `telephone` + `openingHoursSpecification` 09:00–23:00 + `isAccessibleForFree` + `aggregateRating` 4.4 (30,121) + `sameAs` (الخريطة، بوابة عُمان السياحية، ويكيميديا، Wikidata).
- TDK: العنوان `سوق مطرح (مسقط) | دليل الزيارة والموقع`، الوصف يشمل الموقع والمعالم القريبة (كورنيش مطرح).
- H1 + شارة فوقية بالهوية الجغرافية، ومقال الافتتاح يقرن الاسم العربي بالاسمين الدوليين مع الموقع.
- عنصر جغرافي (سلطنة عُمان › محافظة مسقط › مطرح › سوق مطرح) في قسم "عن السوق".
- الخريطة مضبوطة على العربية/عُمان، ووسوم OG تشمل `og:image` و`og:image:alt` على النسخة المحلية برابط مطلق.
- FAQPage Schema (6 أسئلة). المصادر الرسمية (بوابة عُمان السياحية وبلدية مسقط) مرتبطة في قسم "كيف تصل" وفي تذييل الموقع مع فقرة الاستقلالية.

## PWA
- `public/site.webmanifest`: `name/short_name/id/start_url/scope` + `lang=ar-OM` + `dir=rtl` + أيقونات (SVG + 32/180/192/512 PNG).
- `public/sw.js`: استراتيجية شبكة أولاً مع ذاكرة تخزين مؤقت وبديل دون اتصال للصفحة الرئيسية؛ يُسجَّل تلقائياً من `BaseLayout.astro`.
- أيقونات `public/icons/icon-192.png` و`icon-512.png` تُولَّد من أيقونة اللمس عند تغيير الشعار عبر `scripts/gen-pwa-icons.ps1`.

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

تُستخدم نسخ محلية مضغوطة للعرض (`scripts/optimize-images.ps1`، عبر `pnpm optimize:images`؛ جودة 80 وأطول ضلع 1600 بكسل، انخفاض الحجم ≈ 93%). بعد ضبط النطاق تصبح `og:image` و`image` داخل JSON-LD على النسخة المحلية برابط مطلق.

## ترتيب الأقسام الحالي (بعد التوسعة)
hero → عن السوق → معرض الصور → **التاريخ والمكانة (#history)** → خطط للزيارة (#visit) → المواصلات والخريطة → **المرافق والخدمات (#facilities، أنواع فقط دون أسماء تجارية)** → **الطقس والتوقعات (#weather)** → حول مطرح (#nearby) → **اقتراح جولة (#route)** → الأسئلة الشائعة (#faq) → ملاحظة الاستقلال.

## الطقس (SSR + تخزين مؤقت)
- قسم الطقس مكوّن خادمي (Server Component) يجلب البيانات من Open-Meteo (خدمة مفتوحة بلا مفتاح) بإحداثيات سوق مطرح 23.6204/58.5645.
- التخزين المؤقت: إن وُجد `caches.default` (بيئة Cloudflare Workers) تُخزَّن الاستجابة 30 دقيقة عبر Cache API المشتركة، مع ذاكرة داخل العزل للمزامنة؛ وفي غيابه (التطوير المحلي) تُجلب مباشرة مع ذاكرة TTL داخل العملية. عند أي فشل يظهر بطاقة بديلة دون إسقاط الصفحة.

## ملاحظات حول pnpm-workspace.yaml
- الملف يُعرّف `allowBuilds` لـ esbuild وworkerd (متطلب pnpm 11؛ لم يعد يُقرأ حقل `pnpm` من package.json) وهو **دون `packages:`** فيبقى المشروع وحيد الحزمة.
- عدّلت `scripts/verify-source.mjs` للسماح بملف إعدادات من هذا النوع شرط عدم احتوائه على `packages:` أو `catalog`.
- عدّلت `scripts/verify-build.mjs` بحيث لا يفحص `dist/server` (حزمة إطار العمل تتضمن كلمات مثل example.com وlocalhost من كود Astro نفسه)؛ محتوى المشروع مفحوص أصلاً على مستوى المصدر في verify-source.
