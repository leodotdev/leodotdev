# Plan 005: Repo hygiene — drop the committed 150MB `dist/`, ignore `old/`, resolve the `app/studio/` re-add

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- dist .gitignore sanity.config.ts` and `git status --short -- app/studio old`
> If `app/studio/` has been committed since planning, or `dist/` already
> removed, adjust per the steps' idempotency notes; on anything surprising,
> STOP and report.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED (touches deploy-adjacent config; one decision is gated on the operator)
- **Depends on**: plans/001 (CLAUDE.md must exist for Step 4's doc edit; if 001 hasn't landed, create the note as a README section instead)
- **Category**: tech-debt
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

Three things in the working tree are traps:

1. **`dist/` is committed** — 92 tracked files, ~150MB. It's a stale build of the Sanity Studio (committed in `04e30a4` alongside Sanity CLI config; `sanity build` outputs to `dist/` by default). Nothing in the app references it, and every clone pays for it.
2. **`old/` (≈1.5GB)** is an untracked snapshot of the previous version of the site sitting inside the working tree, not gitignored — one careless `git add .` away from being committed.
3. **`app/studio/` (untracked)** re-adds the self-hosted Sanity Studio route that commit `93f6064` explicitly removed "for Cloudflare Pages compatibility". The current production build confirms the problem: with this directory present, `next build` emits `ƒ /studio/[[...index]]` as a **dynamic server-rendered route with 991kB first-load JS** — on the static Cloudflare Pages deploy that route cannot be served. Committing it would break or bloat the deploy. The repo already has the right alternative wired up: `sanity.cli.js` exists, so `npx sanity dev` serves a local studio without touching the Next app.

## Current state

- `git ls-files dist | wc -l` → 92. `du -sh dist` → ~150MB. Contents: `index.html`, compiled studio JS, favicons, SVGs.
- `git status --short` shows untracked: `app/studio/`, `old/`, `public/resume/`.
- `app/studio/[[...index]]/page.tsx` (untracked) is exactly:
  ```tsx
  "use client";

  import { NextStudio } from "next-sanity/studio";
  import config from "@/sanity.config";

  export default function StudioPage() {
    return <NextStudio config={config} />;
  }
  ```
  plus an `app/studio/layout.tsx` wrapper.
- `sanity.config.ts:12` has `basePath: "/studio"` (restored; `93f6064` had removed it). For a standalone `npx sanity dev` studio the basePath is harmless, but it only exists to serve the embedded route.
- `.gitignore` currently ignores `/node_modules`, `/.next/`, `/out/`, `/build`, `.env*.local`, `.vercel`, `*.tsbuildinfo`, etc. It does NOT ignore `old/`, `dist/`, or `.wrangler/`.
- The deploy (per `wrangler.toml`) serves `.vercel/output/static`; nothing reads `dist/`.

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Reference check | `grep -rn '"/dist\|dist/' app components lib next.config.js wrangler.toml package.json` | no matches (or only irrelevant ones like `redist` — judge by eye, then STOP if a real reference exists) |

## Scope

**In scope**:
- `git rm -r dist`
- `.gitignore` (add entries)
- Delete untracked `app/studio/` (after the operator-gate below)
- `sanity.config.ts` (remove `basePath` line only, same gate)
- `CLAUDE.md` (add the studio constraint note)

**Out of scope** (do NOT touch):
- `old/` — **never delete it**; it gets a `.gitignore` entry and a recommendation in your report, nothing more.
- `public/resume/` and `public/` media — report-only (see Step 5).
- `sanity.cli.js`, `sanity/schemas/**` — the working content tooling.
- Git history rewriting (the 150MB stays in history; removing it from history is a separate operator decision — note it in the report).

## Git workflow

- Branch: `advisor/005-repo-hygiene`
- Commits: one for `dist` removal + gitignore, one for the studio resolution.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm nothing references `dist/`

Run the reference check from the commands table. Also confirm the app's favicon/assets come from `public/`, not `dist/`: `grep -rn "favicon" app/layout.tsx` and `ls public/ | grep -i favicon`.

**Verify**: no source/config file references `dist/`; favicon resolves from `public/`.

### Step 2: Remove `dist/` from tracking and ignore it

```bash
git rm -r --quiet dist
printf "\n# build artifacts / local junk\n/dist/\n/old/\n/.wrangler/\n" >> .gitignore
git add .gitignore
```

`git rm -r` also deletes the working copy — that's intended for `dist/` (it's a regenerable build artifact). `old/` is only ignored, never removed.

**Verify**: `git ls-files dist | wc -l` → 0; `git check-ignore old dist .wrangler` → prints all three paths; `npm run verify` → exit 0.

### Step 3: OPERATOR GATE — resolve `app/studio/`

The recommended action (consistent with commit `93f6064` and the Cloudflare deploy) is:

1. Delete the untracked directory: `rm -rf app/studio`
2. In `sanity.config.ts`, delete the line `basePath: "/studio",`
3. Local content editing happens via `npx sanity dev` (already works — `sanity.cli.js` is configured), hosted editing at sanity.io/manage.

**However**: the operator re-created this directory after it was removed once, which may signal they want an embedded studio back. If the operator approved this plan as written (check `plans/README.md` or the dispatch instructions), proceed with the deletion. If there is no explicit approval recorded, STOP and ask before deleting — present the alternative: keep the route but accept that the Cloudflare Pages deploy must then handle a dynamic route (requires verifying `next-on-pages` supports it; likely not on the current static setup).

**Verify** (after deletion): `ls app/studio 2>&1` → No such file; `grep -c "basePath" sanity.config.ts` → 0; `npm run build` → exit 0 AND the route table does NOT contain `/studio` (before this step it shows `ƒ /studio/[[...index]] 828 kB`).

### Step 4: Document the constraint

Append to the deployment-constraints section of `CLAUDE.md` (created by plan 001):

> Do not add a `/studio` route (NextStudio) to the Next app. It builds as a dynamic, server-rendered route (~1MB first-load JS) which the static Cloudflare Pages deploy cannot serve — this was removed in `93f6064` and again in plan 005. Use `npx sanity dev` for a local studio.

**Verify**: `grep -c "sanity dev" CLAUDE.md` → ≥1.

### Step 5: Report-only items

Include in your final report (no file changes):
- `old/` is ~1.5GB and now gitignored; recommend the operator archives it outside the repo (e.g. `mv old ~/Archive/leodotdev-old`) or deletes it.
- `public/resume/` is untracked; the live `/resume` route rewrites to `/resume.html` (per `next.config.js`) — `ls public/resume.html public/resume/` and report which exists, so the operator can commit or remove the leftover.
- `dist/` remains in git history (~150MB); shrinking history would need `git filter-repo` and a force-push — operator decision, not attempted.

## Test plan

No tests. Gates: the reference grep (Step 1), `npm run verify`, and the build route table no longer listing `/studio`.

## Done criteria

- [ ] `git ls-files dist | wc -l` → 0 and `dist/` absent from the working tree
- [ ] `.gitignore` contains `/dist/`, `/old/`, `/.wrangler/`
- [ ] `old/` still present on disk, untouched
- [ ] `app/studio/` deleted and `basePath` removed (or an explicit STOP report explaining why not)
- [ ] Build route table contains no `/studio` entry
- [ ] `npm run verify` exits 0
- [ ] `plans/README.md` status row updated
- [ ] Report includes the three report-only items from Step 5

## STOP conditions

- Step 1 finds a real reference to `dist/` anywhere in app code or deploy config.
- `app/studio/` has been COMMITTED since planning (drift check) — the operator made a decision this plan contradicts; report instead of deleting.
- No explicit operator approval is recorded for Step 3 and you cannot ask — leave `app/studio/` and `sanity.config.ts` untouched, complete the other steps, and mark the plan PARTIAL/BLOCKED in the index with one line.
- Removing `basePath` produces a Sanity/TypeScript error (would indicate the config is consumed somewhere unexpected).

## Maintenance notes

- If an embedded studio is ever genuinely wanted, the deploy platform has to change (or move to Cloudflare's full next-on-pages dynamic support) — that's an infrastructure decision, not a code tweak.
- Reviewer: confirm the diff deletes `dist/` wholesale and touches nothing under `sanity/schemas/`.
- Follow-up deliberately deferred: history rewrite to purge `dist/` blobs; `old/` archival.
