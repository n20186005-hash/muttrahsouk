import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const fail = (m) => { console.error(`SOURCE AUDIT FAILED: ${m}`); process.exitCode = 1; };
const read = (p) => readFileSync(join(root,p),'utf8');

for (const p of ['src/pages/index.astro','src/pages/privacy.astro','src/pages/terms.astro','src/pages/cookies.astro','astro.config.mjs','package.json','.node-version','wrangler.jsonc']) {
  if (!existsSync(join(root,p))) fail(`missing ${p}`);
}
if (existsSync(join(root,'pnpm-workspace.yaml'))) {
  // pnpm 11 hosts settings (e.g. allowBuilds) in pnpm-workspace.yaml.
  // Allowed here ONLY as a settings file: it must not turn the repo into a
  // multi-package workspace nor define catalogs.
  const ws = readFileSync(join(root,'pnpm-workspace.yaml'),'utf8');
  if (/^\s*packages\s*:/m.test(ws)) fail('pnpm-workspace.yaml must stay single-package (no packages:)');
  if (/^\s*catalogu?e?s?\s*:/m.test(ws)) fail('pnpm-workspace.yaml must not define catalogs');
}

const pkg = JSON.parse(read('package.json'));
for (const group of ['dependencies','devDependencies']) {
  for (const [name,v] of Object.entries(pkg[group] || {})) if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(v)) fail(`${name} is not pinned exactly: ${v}`);
}
if (pkg.packageManager !== 'pnpm@11.24.0') fail('packageManager is not pinned to pnpm@11.24.0');
if (pkg.engines?.node !== read('.node-version').trim()) fail('engines.node and .node-version differ');

const src = read('src/pages/index.astro') + read('src/layouts/BaseLayout.astro');
if (!src.includes('lang="ar-OM"') || !src.includes('dir="rtl"')) fail('Arabic Oman locale/RTL is missing');
if (!src.includes('!1sar!2som')) fail('Google map is not localized to Arabic/Oman');
if (!src.includes('FAQPage')) fail('FAQPage schema missing');
if (!src.includes("'TouristAttraction'")) fail('TouristAttraction schema missing');
if (!src.includes("'LocalBusiness'")) fail('LocalBusiness schema missing');

const config = read('astro.config.mjs');
if (!config.includes("const SITE_URL = '';")) fail('single empty SITE_URL configuration point missing');
if (!config.includes('integrations: site ? [sitemap()] : []')) fail('conditional sitemap configuration missing');

const forbidden = [ ['example','.com'].join(''), ['local','host'].join(''), ['chrome-extension', '://'].join('') ];
function files(dir) { return readdirSync(dir).flatMap(n => { const p=join(dir,n); return statSync(p).isDirectory()?files(p):[p]; }); }
for (const f of files(join(root,'src'))) {
  const body=readFileSync(f,'utf8');
  for (const x of forbidden) if (body.includes(x)) fail(`forbidden value found in ${f}`);
  if (/[\u4E00-\u9FFF]/u.test(body)) fail(`Chinese characters found in public source ${f}`);
}
if (!process.exitCode) console.log('Source audit passed.');
