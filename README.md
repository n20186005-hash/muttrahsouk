# دليل سوق مطرح
Arabic RTL visitor guide, Astro SSR with Cloudflare Workers. Existing routes: `/`, `/privacy/`, `/terms/`, `/cookies/`; `/404` and unknown routes are error responses, not sitemap pages.

Use Node 24.20.0 and pnpm 11.24.0. Dependencies are pinned; the existing dependency audit/install policy remains in pnpm-workspace.yaml.

```
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
npx wrangler deploy --dry-run
```

Cloudflare project `muttrahsouk`, source `wrangler.jsonc` explicitly used by the adapter. The generated entry retains src/worker.js before the adapter/static fast path. Apex HTTP and the exact indexed www host redirect to HTTPS apex with path/query preserved. DNS/domain binding is an external prerequisite for serving www.

Weather and marine data remain server-rendered, with validated provider/cache data, a 4.5-second full-operation deadline, independent fallbacks and up to 30-minute model caching. Marine variables are distinct; hourly mean-sea-level model peaks are not an official tide table or a navigation/swimming safety service. HTML is not stored by the service worker; offline static assets remain supported.

Google Analytics is optional through the existing banner/settings. Choice writes are read back; refusal disables the current page immediately. Storage failures can leave a previous shared grant, and the interface discloses that limitation. Map and hosting performance services are separately described in privacy information.

Official content references: SOURCES.md. Per-file archival photo attribution and licences are visitor-accessible at `/CREDITS.txt`; the local Souq Muttrah 8 derivative uses an upright Commons thumbnail.
