# leo.dev

Personal portfolio of Leo Succar. Built with [TanStack Start](https://tanstack.com/start) (React 19, server-rendered), Tailwind CSS 4 and Base UI, running as a Cloudflare Worker, with content in D1, images in R2, and a small admin at `/admin`.

## Local development

```bash
pnpm install
pnpm dev
```

The dev server runs at **http://localhost:3000** (Vite with the Cloudflare plugin, so server code runs in workerd as in production). The home page is `/`; `/projects` renders the same page for old links.

## Verification

Before committing, run:

```bash
pnpm verify
```

This runs typecheck + lint + production build in sequence. There are no automated tests; this script is the gate.

## How content gets to the page

Pages render on the Worker for every request. Route loaders (`src/routes/_site/*.tsx`) call server functions in `src/server/content.ts`, which read the `leodotdev` D1 database. Images are served from the `leodotdev-media` R2 bucket at `/images/*` (see `src/server.ts`). Edits made at `/admin` appear on the next page load; nothing needs rebuilding.

`pnpm dev` reads and writes the production database and bucket (`remote: true` in `wrangler.jsonc`).

## Content editing

Go to **[leo.dev/admin](https://leo.dev/admin)** (behind Cloudflare Access) to edit projects (fields, cover, gallery images, text), experience and references. Uploaded images are resized to WebP in the browser before they're stored.

Schema changes: edit `src/server/db/schema.ts`, then `pnpm db:generate` and `pnpm db:migrate`.

The content was imported from Sanity on 2026-11-09 (`drizzle/seed/sanity-export.sql`). A full local backup of the Sanity dataset, every original image, and the generated WebP files is in `old/sanity-export/` and `old/images-webp/` (git-ignored, on Leo's machine only).

## Deployment

```bash
pnpm run deploy
```

This builds, checks the output for stray secrets (`scripts/check-dist.ts`), and runs `wrangler deploy` (config in `wrangler.jsonc`). Log in first with `pnpm exec wrangler login`.

The Worker is named `leodotdev` and serves `leo.dev/*` through a zone route (`wrangler.jsonc`).

### Admin access setup (once)

1. In Cloudflare Zero Trust → Access → Applications, add a self-hosted application for `leo.dev/admin` (path `admin*`), with a policy that allows only your email.
2. Copy its **Application Audience (AUD) tag** into `ACCESS_AUD` in `wrangler.jsonc`, then `pnpm run deploy`.

Until then, `leo.dev/admin` answers 403.

### Leftovers

- The Pages project `leodotdev` no longer serves leo.dev. Disconnect its Git integration (or delete the project) so pushes stop starting builds of the old Next.js app, which now fail.
- Sanity is no longer used. The webhook `redeploy-leodotdev` can be deleted, and so can the Sanity project `jyqe7nab` itself once you're happy with the backup in `old/sanity-export/`.
