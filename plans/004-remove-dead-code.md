# Plan 004: Remove the dead photos pipeline, unused components, and the unreachable home page

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- app/page.tsx app/api/photos components/ScatteredPhotos.tsx components/ProjectImageGrid.tsx components/LiquidGlassMagnifier.tsx hooks/useScrollPosition.ts`
> If any of these files changed since `62cddd8`, the operator may have resumed
> work on them — treat as a STOP condition (see below). Then re-run the
> importer checks in Step 1 yourself; do not delete anything the checks show
> as imported.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (deletions are verified-unreferenced and revertible via git)
- **Depends on**: plans/001 (for `npm run verify`)
- **Category**: tech-debt
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

About 1,200 lines of this small (~47-file) codebase are unreachable: four modules have zero importers, an API route's only consumer is one of those dead modules, and `app/page.tsx` can never render because `next.config.js` permanently redirects `/` → `/projects`. Dead code here is not free — three of the five outstanding lint warnings live in it, it confuses every future change ("which gallery component is the real one?"), and the dead `/api/photos` route implies `public/photos` (≈140MB of media) is load-bearing when it isn't. The operator approved this cleanup on 2026-06-11, with the caveat that some files had uncommitted local edits at planning time (possible work-in-progress — hence the STOP conditions).

## Current state

Verified at commit `62cddd8` (re-verify in Step 1):

- `components/ScatteredPhotos.tsx` (461 lines) — photo-collage component; **zero importers**. Sole consumer of `/api/photos`.
- `components/ProjectImageGrid.tsx` (227 lines) — older image grid superseded by `ProjectMediaGallery`; **zero importers**. Had uncommitted local modifications at planning time.
- `components/LiquidGlassMagnifier.tsx` — magnifier effect; **zero importers**.
- `hooks/useScrollPosition.ts` — scroll-save hook; **zero importers** (scroll persistence is done independently in `app/(site)/projects/projects-wrapper.tsx`, which stays).
- `app/api/photos/route.ts` — lists `public/photos` filenames with `fs.readdirSync`. Statically prerendered at build time (build output shows `○ /api/photos`), so it's a frozen JSON snapshot — and its only consumer is the dead `ScatteredPhotos`.
- `app/page.tsx` — placeholder home page with dummy content ("Company Name • 2022 - Present"); unreachable because of this in `next.config.js` (lines 19–26, which STAY):
  ```js
  async redirects() {
      return [
        {
          source: '/',
          destination: '/projects',
          permanent: true,
        },
      ];
    },
  ```
- `next.config.js` also allowlists `via.placeholder.com` in `images.remotePatterns` — check in Step 4 whether any live code still uses it.
- `components/ui/*.tsx` (shadcn-style primitives) — each currently has ≥1 importer, but some importers are the dead components above; Step 5 re-checks after deletion.
- The hero section (`app/(site)/projects/hero-section.tsx`) does NOT use ScatteredPhotos — verified; it's a plain text block.

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Importer check | see Step 1 grep loop | `0` importers per dead module |

## Scope

**In scope** (modify/delete only these):
- Delete: `components/ScatteredPhotos.tsx`, `components/ProjectImageGrid.tsx`, `components/LiquidGlassMagnifier.tsx`, `hooks/useScrollPosition.ts`, `app/api/photos/route.ts` (and the then-empty `app/api/` dir), `app/page.tsx`
- `next.config.js` — ONLY the `via.placeholder.com` remotePatterns entry, and ONLY if Step 4 proves it unused
- `components/ui/*.tsx` — ONLY files Step 5 proves orphaned

**Out of scope** (do NOT touch):
- `public/photos/` and all media under `public/` — **operator decision, do not delete media files** (Step 6 only reports).
- `app/(site)/projects/projects-wrapper.tsx` — live scroll-restoration code that merely resembles the dead hook.
- The commented-out "Book Shelf" block and unused `getBooks()` call in `app/(site)/projects/page.tsx` — tied to a pending direction decision (books page); leave them.
- The redirect in `next.config.js` — it becomes the only thing serving `/`; it stays.
- `app/(site)/soon/` — unlinked but deliberately so (soft launch); not dead code.

## Git workflow

- Branch: `advisor/004-remove-dead-code`
- One commit per step (deletions, config trim, ui orphans) or a single commit "Remove dead photos pipeline and unused components" — either is fine.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Re-verify each module is unimported

```bash
for name in ScatteredPhotos ProjectImageGrid LiquidGlassMagnifier useScrollPosition "api/photos"; do
  echo "== $name =="
  grep -rn "$name" app components lib hooks --include="*.ts" --include="*.tsx" -l | grep -v "components/ScatteredPhotos\|components/ProjectImageGrid\|components/LiquidGlassMagnifier\|hooks/useScrollPosition\|app/api/photos"
done
```

**Verify**: every block prints nothing (no importers outside the modules themselves). If ANY line prints, that module is now in use — exclude it from deletion and report.

### Step 2: Delete the dead modules

```bash
git rm components/ScatteredPhotos.tsx components/ProjectImageGrid.tsx components/LiquidGlassMagnifier.tsx hooks/useScrollPosition.ts app/api/photos/route.ts app/page.tsx
rmdir app/api/photos app/api 2>/dev/null || true
```

(If a file shows uncommitted modifications that `git rm` refuses, that's a STOP condition — see below.)

**Verify**: `npx tsc --noEmit` → exit 0; `npm run lint` → the warnings previously reported for `LiquidGlassMagnifier.tsx` (lines 170, 233), `ProjectImageGrid.tsx` (line 80), and `ScatteredPhotos.tsx` (line 182) are gone.

### Step 3: Confirm `/` still redirects

`npm run dev`, then `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:3001/` → `308 http://localhost:3001/projects`. Stop the server.

**Verify**: as above (307/308 both acceptable).

### Step 4: Trim the placeholder image host if unused

`grep -rn "via.placeholder.com" app components lib --include="*.ts*"` — if zero matches, remove the `via.placeholder.com` block from `images.remotePatterns` in `next.config.js` (keep `cdn.sanity.io`). If there are matches, leave the config alone and note it.

**Verify**: `npm run build` → exit 0.

### Step 5: Remove newly orphaned ui primitives

```bash
for f in components/ui/*.tsx; do n=$(basename "$f" .tsx); c=$(grep -rl "ui/$n" app components --include="*.tsx" | grep -v "components/ui/" | wc -l | tr -d ' '); echo "$n: $c importers"; done
```

For each primitive now reporting `0` importers, also check it isn't imported by a sibling ui file (`grep -rn "ui/$n" components/ui/`); if truly orphaned, `git rm` it. At planning time, `progress` was imported only by `ProjectMediaGallery` (lives on) and most primitives are used by live pages — expect at most one or two orphans (`tooltip`, `badge`, `dropdown-menu` each had exactly 1 importer; check whose).

**Verify**: `npm run verify` → exit 0.

### Step 6: Report on `public/photos` (no action)

`du -sh public/photos 2>/dev/null; ls public/photos | wc -l` — include the size and count in your final report with this note: "media is now referenced by nothing in the app; deleting or archiving it is the operator's call." **Do not delete it.**

## Test plan

No test infrastructure. The gates are: typecheck, lint (3 warnings disappear), build, and the redirect curl in Step 3.

## Done criteria

- [ ] `npm run verify` exits 0
- [ ] Step 1 importer checks all print nothing (run before AND after deletion)
- [ ] `ls components/ScatteredPhotos.tsx components/ProjectImageGrid.tsx components/LiquidGlassMagnifier.tsx hooks/useScrollPosition.ts app/api/photos/route.ts app/page.tsx 2>&1` → all "No such file"
- [ ] `npm run lint` no longer mentions the three deleted components
- [ ] `curl` on `/` returns 308 (or 307) to `/projects`
- [ ] `public/photos` untouched (`git status` shows no changes under `public/`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The drift check shows post-`62cddd8` commits touching `ProjectImageGrid.tsx` or `ScatteredPhotos.tsx`, or `git rm` reports local modifications — the operator may have resumed the photos feature. Report and await direction; delete nothing in that case.
- Step 1 finds an importer for any module slated for deletion.
- After deletions, `tsc` or the build fails with an error referencing a deleted file — an importer the greps missed; restore (`git checkout -- <file>`) and report.

## Maintenance notes

- If the photos feature is ever revived, note that `/api/photos` was statically prerendered (a build-time snapshot) — on this Cloudflare Pages static deploy a runtime `fs` listing can't work; generate a manifest at build time instead.
- `public/photos` (~140MB) and `public/resume/` disposition deliberately deferred to the operator (also see plan 005's report step).
- Reviewer: the diff should be almost entirely deletions; scrutinize any non-deletion edits.
