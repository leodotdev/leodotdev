# leo.dev

Personal portfolio of Leo Succar. Built with Next.js 14 (app router), Sanity CMS, and Tailwind CSS. Deployed on Cloudflare Pages.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values if needed (see .env.example)
npm run dev
```

The dev server runs at **http://localhost:3001** (note: not 3000). The root path `/` permanently redirects to `/projects`.

## Verification

Before committing, run:

```bash
npm run verify
```

This runs typecheck + lint + production build in sequence. There are no automated tests; this script is the gate.

## Content editing

Content lives in Sanity (project `jyqe7nab`, dataset `production`). Edit at [sanity.io/manage](https://www.sanity.io/manage), or run a local studio:

```bash
npx sanity dev
```

The studio config is in `sanity.cli.js`. Do **not** add a `/studio` route to the Next.js app — it was removed in commit `93f6064` for Cloudflare Pages compatibility.

## Deployment

Deployed to Cloudflare Pages. The build is configured in the Cloudflare dashboard using the `@cloudflare/next-on-pages` adapter pattern; output goes to `.vercel/output/static` as set in `wrangler.toml`.

The site is **static** — content edits in Sanity appear only after a redeploy.
