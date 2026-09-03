import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const dist = join(root,'dist');
if (!existsSync(dist)) { console.error('BUILD AUDIT FAILED: dist missing'); process.exit(1); }
const forbidden = [ ['example','.com'].join(''), ['local','host'].join(''), ['chrome-extension', '://'].join('') ];
const textExt = /\.(?:html|js|mjs|css|xml|txt|json|map)$/i;
function files(dir) { return readdirSync(dir).flatMap(n => { const p=join(dir,n); return statSync(p).isDirectory()?files(p):[p]; }); }
let bad=false;
const all=files(dist);
for (const f of all.filter(f=>textExt.test(f))) {
  const body=readFileSync(f,'utf8');
  for (const x of forbidden) if (body.includes(x)) { console.error(`BUILD AUDIT FAILED: ${x} in ${f}`); bad=true; }
}
const config=readFileSync(join(root,'astro.config.mjs'),'utf8');
const m=config.match(/const SITE_URL = '([^']*)';/);
const site=m?.[1]?.trim() || '';
const maps=all.filter(f=>/sitemap.*\.xml$/i.test(f));
if (!site && maps.length) { console.error('BUILD AUDIT FAILED: sitemap exists while SITE_URL is empty'); bad=true; }
if (site) {
  if (!maps.length) { console.error('BUILD AUDIT FAILED: SITE_URL is set but no sitemap was generated'); bad=true; }
  for (const f of maps) {
    const body=readFileSync(f,'utf8');
    if (/<lastmod>/i.test(body)) { console.error(`BUILD AUDIT FAILED: unexpected lastmod in ${f}`); bad=true; }
    for (const loc of body.matchAll(/<loc>(.*?)<\/loc>/g)) if (!loc[1].startsWith(site)) { console.error(`BUILD AUDIT FAILED: sitemap URL outside configured site: ${loc[1]}`); bad=true; }
  }
}
if (bad) process.exit(1);
console.log('Build audit passed.');
