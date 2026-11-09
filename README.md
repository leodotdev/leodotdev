# leo.dev

Personal portfolio of Leo Succar. Built with [TanStack Start](https://tanstack.com/start) (React 19, server-rendered), Sanity CMS, Tailwind CSS 4 and Base UI, running as a Cloudflare Worker.

## Local development

```bash
pnpm install
pnpm dev
```

The dev server runs at **http://localhost:3000** (Vite with the Cloudflare plugin, so server code runs in workerd as in production). The root path `/` permanently redirects to `/projects`.

## Verification

Before committing, run:

```bash
pnpm verify
```

This runs typecheck + lint + production build in sequence. There are no automated tests; this script is the gate.

## How content gets to the page

Pages render on the Worker for every request. Route loaders (`src/routes/_site/projects.*.tsx`) call server functions in `src/server/content.ts`, which query Sanity's API CDN and keep the result in the Workers Cache API with stale-while-revalidate (fresh for 60 s, then served stale for up to a day while a background refresh runs; see `src/server/cache.ts`). Client-side navigations call the same server functions over `/_serverfn`, so the browser never queries Sanity directly for reads.

So **Sanity edits show up on the site within about a minute, without a rebuild or redeploy.** (On `*.workers.dev` the Cache API does not persist entries, so there every request reads Sanity's CDN directly; caching takes effect on the leo.dev custom domain.)

## Content editing

Content lives in Sanity (project `jyqe7nab`, dataset `production`). Edit at [sanity.io/manage](https://www.sanity.io/manage), or run the local studio, which lives in `studio/` with its own dependencies (kept out of the site's install):

```bash
pnpm --dir studio install   # once
pnpm studio
```

Do **not** add a `/studio` route to the site. The schemas are in `studio/schemas/`.

Project descriptions on `/projects` can also be edited in place by Sanity project members (see `CLAUDE.md`, "Inline description editing").

## Deployment

```bash
pnpm run deploy
```

This builds, checks the output for stray secrets (`scripts/check-dist.ts`), and runs `wrangler deploy` (config in `wrangler.jsonc`). Log in first with `pnpm exec wrangler login`.

The Worker is named `leodotdev` and is currently reachable only at its `workers.dev` preview URL; leo.dev itself is still served by the old Cloudflare Pages project `leodotdev` until the cutover below.

### Cutover from Cloudflare Pages (one time)

1. Compare the `workers.dev` preview with https://leo.dev.
2. In `wrangler.jsonc`, add `"routes": [{ "pattern": "leo.dev", "custom_domain": true }]` and set `"workers_dev": false` and `"preview_urls": false`, then `pnpm run deploy`. If Cloudflare reports the hostname is in use, first remove the `leo.dev` custom domain from the Pages project (Workers & Pages → `leodotdev` (Pages) → Custom domains), then deploy again.
3. In Sanity (sanity.io/manage → project → API → CORS origins), make sure `https://leo.dev` is listed with **Allow credentials** (inline editing).
4. Delete the Sanity webhook `redeploy-leodotdev` (sanity.io/manage → API → Webhooks). Content no longer needs a rebuild, so the webhook and the Pages deploy hook it calls are unused.
5. Once the Worker has served leo.dev for a while, disconnect Git from the Pages project (or delete it) so pushes stop building the old Next.js app.
