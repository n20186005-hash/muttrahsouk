# مصادر الصور الحقيقية

الصور المستخدمة في النسخة الحالية صور حقيقية من سوق مطرح/مطرح وليست مولدة بالذكاء الاصطناعي. المصادر الأصلية مرخّصة عبر Wikimedia Commons، وقد نُسخت محلياً باسم سلس (بدون مسافات أو أقواس) وضُغطت لتحسين سرعة تحميل الصفحة.

## النسخ المحلية المستخدمة في الموقع

| الملف المحلي | الملف الأصلي | المصور | الترخيص |
| --- | --- | --- | --- |
| `mutrah-souq-entrance.jpg` | `واجهة سوق مطرح.jpg` | Sara K | CC BY 2.0 |
| `mutrah-souq-interior-01.jpg` | `Souq Muttrah 9.jpg` | Mohammad hajeer | CC BY 4.0 |
| `mutrah-souq-interior-02.jpg` | `Souq Muttrah 8.jpg` | Mohammad hajeer | CC BY 4.0 |
| `mutrah-souq-khanjar.jpg` | `Muscat Souk (9).jpg` | Keirn | CC BY-SA 2.0 |
| `muttrah-corniche.jpg` | `Muttrah corniche.jpg` | Muiad123 | CC BY-SA 4.0 |

روابط صفحات الملفات الأصلية في Wikimedia Commons:

1. https://commons.wikimedia.org/wiki/File:واجهة_سوق_مطرح.jpg
2. https://commons.wikimedia.org/wiki/File:Souq_Muttrah_9.jpg
3. https://commons.wikimedia.org/wiki/File:Souq_Muttrah_8.jpg
4. https://commons.wikimedia.org/wiki/File:Muscat_Souk_(9).jpg
5. https://commons.wikimedia.org/wiki/File:Muttrah_corniche.jpg

## الضغط

- النص البرمجي: `scripts/optimize-images.ps1` (يعمل عبر `pnpm optimize:images`).
- الإعدادات: JPEG بجودة 80، أطول ضلع 1600 بكسل.
- النتيجة: انخفض الحجم الإجمالي من نحو 19.6 ميغابايت إلى نحو 1.3 ميغابايت (انخفاض ≈ 93%).

## ملاحظات

- الصفحة تستخدم النسخ المحلية للعرض الفوري. عند ضبط النطاق في `astro.config.mjs` تُشتق `og:image` (و`image` داخل JSON-LD) تلقائياً إلى النسخة المحلية برابط مطلق عبر `Astro.site`؛ ويبقى رابط Wikimedia احتياطياً فقط في غياب النطاق.
- عند تحديث أي صورة لاحقاً، احفظ الاعتمادات وشروط الترخيص المرفقة بكل صورة أعلاه.
