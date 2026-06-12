# Plan 001: Establish a one-command verification baseline and accurate docs

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- package.json README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

This repo has no tests and no CI, so the only way to know a change is safe is to run the typechecker, linter, and production build by hand — and nothing documents that. Worse, the README is the untouched create-next-app boilerplate: it says the dev server runs on port 3000 (it runs on 3001), and tells you to deploy on Vercel (the site deploys to Cloudflare Pages; Vercel support was deliberately removed in commit `b2a96cd`). Every other plan in `plans/` uses the verification script this plan creates as its gate, so this plan goes first.

## Current state

- `package.json` — scripts are only:
  ```json
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
  ```
- `README.md` — word-for-word create-next-app boilerplate ("Open http://localhost:3000", "Deploy on Vercel"). Actively wrong.
- No `CLAUDE.md`, no `.env.example` exist.
- `.env.local` exists (gitignored) and defines exactly two variables: `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`. **As of this plan, no source file reads them** — the values are hardcoded (plan 006 fixes that). The `.env.example` you create documents them anyway so the code can start reading them later. Never copy values out of `.env.local`; the project ID `jyqe7nab` is public by design (Sanity project IDs are not secrets) and is fine to use as an example value.
- Known facts to document: Next.js 14 app router, TypeScript strict, Tailwind, Sanity CMS (project `jyqe7nab`, dataset `production`), deployed to Cloudflare Pages (`wrangler.toml` sets `pages_build_output_dir = ".vercel/output/static"`, i.e. an `@cloudflare/next-on-pages`-style build configured in the Cloudflare dashboard — the package is intentionally not in `package.json`). `next.config.js` permanently redirects `/` → `/projects`. Commit `93f6064` removed the self-hosted Sanity Studio route because it is incompatible with this deploy target; content is edited at https://www.sanity.io/manage or locally via `npx sanity dev` (config in `sanity.cli.js`).
- `npx tsc --noEmit` currently exits 0. `npm run lint` currently exits 0 **with 5 warnings** (react-hooks/exhaustive-deps) — warnings do not fail the command.

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Install   | `npm install`      | exit 0              |
| Typecheck | `npx tsc --noEmit` | exit 0, no output   |
| Lint      | `npm run lint`     | exit 0 (warnings OK)|
| Build     | `npm run build`    | exit 0, route table printed |

## Scope

**In scope** (the only files you should modify/create):
- `package.json` (scripts block only)
- `README.md` (full rewrite)
- `CLAUDE.md` (create)
- `.env.example` (create)

**Out of scope** (do NOT touch):
- Any source file under `app/`, `components/`, `lib/`, `hooks/`, `sanity/`, `types/`.
- `.env.local` — never read it beyond variable names, never commit it.
- `next.config.js`, `wrangler.toml`, `tsconfig.json`.

## Git workflow

- Branch: `advisor/001-verification-baseline`
- Commit style: short imperative subject line, matching repo history (e.g. "Add resume page and simplify navigation").
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add `typecheck` and `verify` scripts

In `package.json`, change the scripts block to:

```json
"scripts": {
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "verify": "npm run typecheck && npm run lint && npm run build"
}
```

**Verify**: `npm run verify` → all three sub-commands run; exit 0. (Build needs network access to `*.sanity.io`; see STOP conditions.)

### Step 2: Create `.env.example`

```
# Sanity CMS — values for this project are public identifiers, not secrets.
# Copy to .env.local. Note: as of plan 001 the code still hardcodes these
# (see plans/006); they are documented here for when that changes.
NEXT_PUBLIC_SANITY_PROJECT_ID=jyqe7nab
NEXT_PUBLIC_SANITY_DATASET=production
```

**Verify**: `cat .env.example` → matches above; `git check-ignore .env.example` → exits 1 (NOT ignored, will be committed).

### Step 3: Rewrite `README.md`

Replace the whole file. Required content (write naturally, keep it short):

1. **Title/intro**: leo.dev — personal portfolio of Leo Succar. Next.js 14 (app router) + Sanity CMS + Tailwind, deployed on Cloudflare Pages.
2. **Local development**: `npm install`, copy `.env.example` → `.env.local`, `npm run dev` → http://localhost:3001 (note the port). `/` redirects to `/projects`.
3. **Verification**: `npm run verify` (typecheck + lint + production build). There are no automated tests; this is the gate before committing.
4. **Content editing**: content lives in Sanity (project `jyqe7nab`). Edit at sanity.io/manage, or run a local studio with `npx sanity dev` (uses `sanity.cli.js`). Do not add a `/studio` route to the Next app — it was removed in commit `93f6064` for Cloudflare Pages compatibility.
5. **Deployment**: Cloudflare Pages, build configured in the CF dashboard (`@cloudflare/next-on-pages`-style; output dir `.vercel/output/static` per `wrangler.toml`). The site is static — content edits in Sanity appear only after a redeploy.

**Verify**: `grep -c "Vercel Platform\|localhost:3000" README.md` → `0`.

### Step 4: Create `CLAUDE.md`

Sections and the facts they must contain:

- **Project**: personal portfolio site, Next.js 14 app router, TypeScript strict, Tailwind + shadcn-style `components/ui/` primitives (migrated Radix → Base UI in `62cddd8`), Sanity CMS, framer-motion.
- **Commands**: `npm run dev` (port 3001), `npm run verify` (typecheck + lint + build — run before every commit), `npm run lint`, `npx tsc --noEmit`.
- **Deployment constraints (important)**: Cloudflare Pages static build. No Node.js runtime at request time — no `fs`, no dynamic API routes unless edge-compatible. Do NOT re-add a self-hosted Sanity Studio route under `app/` (removed in `93f6064`); use `npx sanity dev` locally instead. Content updates require a redeploy.
- **Routing facts**: `/` permanently redirects to `/projects` (`next.config.js`); `/resume` rewrites to `/resume.html`.
- **Conventions**: path alias `@/*` → repo root; client components marked `"use client"`; icons from `react-icons/tb`; styling via Tailwind classes and `cn()` from `lib/utils.ts`.

**Verify**: `npx tsc --noEmit` → exit 0 (sanity check nothing else changed); `ls CLAUDE.md .env.example` → both exist.

## Test plan

No automated tests exist or are added here. Verification is the `verify` script itself plus the greps above.

## Done criteria

- [ ] `npm run verify` exits 0
- [ ] `package.json` contains `typecheck` and `verify` scripts
- [ ] `.env.example` and `CLAUDE.md` exist and are tracked (`git status` shows them staged/committed)
- [ ] `grep -c "Vercel Platform\|localhost:3000" README.md` returns 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `npm run build` fails for a reason unrelated to your edits (e.g. cannot reach `*.sanity.io` — the build fetches CMS data at build time). Report the error; do not "fix" source files to make it pass.
- `package.json` scripts differ from the excerpt in Current state.
- You find yourself wanting to edit any file under `app/` or `components/` — that's another plan's job.

## Maintenance notes

- Every later plan's done criteria assume `npm run verify` exists — land this first.
- If tests are ever added, fold them into `verify`.
- Reviewer should check the README claims against `wrangler.toml` and `next.config.js` — accuracy is the whole point.
