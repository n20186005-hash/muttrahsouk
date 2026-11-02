# دليل سوق مطرح
Arabic RTL visitor guide, Astro SSR with Cloudflare Workers. The home page (`/`) is a hub linking 40 independently indexable Arabic guide pages, plus legal pages. Routes: legal `/privacy/`, `/terms/`, `/cookies/`; the guide pages are grouped as `visit/*` (12: `location`, `opening-hours`, `parking`, `entrances`, `bus`, `from-airport`, `best-time`, `cruise-port`, `accessible-route`, `family-practical`, `ramadan`, `hot-weather`), `souq/*` (11: `history`, `al-dhalam`, `what-to-buy`, `frankincense`, `silver-khanjar`, `perfume-spices`, `bargaining-payment`, `wholesale-vs-main`, `architecture`, `textiles-clothing`, `photography-etiquette`), `food/*` (5: `nearby-restaurants`, `omani-food`, `cafes`, `seafood`, `quick-drinks`), `around/*` (6: `corniche`, `fort`, `fish-market`, `riyam-park`, `place-people-museum`, `old-muscat`), and `itineraries/*`+`stay/*` (6: `2-hour-walk`, `half-day`, `one-hour`, `family`, `sunset-photo`, `stay/nearby`). All guide pages share `src/layouts/GuideLayout.astro`, and the internal link mesh is defined once in `src/lib/nav.ts` and consumed by the header and footer. `/404` and unknown routes are error responses, not sitemap pages.

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
