# Plan 007: Dependency hygiene — remove unused packages, apply non-breaking audit fixes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- package.json package-lock.json`
> If dependencies changed since planning, re-run every usage grep in Step 1
> before uninstalling anything.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW (each step gated by a full build)
- **Depends on**: plans/001 (verify script); run AFTER plans/004 and 006 if possible (fewer files, cleaner greps) — not a hard dependency
- **Category**: dependencies / security
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

`package.json` carries packages nothing imports — including one literally named `latest` (almost certainly an accidental `npm i latest`), `clipboard-copy`, and `vaul`. Meanwhile `npm audit` reports 72 vulnerabilities (7 critical, 29 high) — overwhelmingly in the Sanity Studio toolchain, with low runtime exposure for a static site, but several have non-breaking fixes available (`ws`, `yaml`, others). This plan removes the dead weight and applies only the safe fixes; it deliberately does NOT chase a zero-vulnerability count.

## Current state

At commit `62cddd8`:

- Unused (verified by grep across `app/`, `components/`, `lib/`, `hooks/` — zero imports): `clipboard-copy`, `vaul`, `latest`.
- `styled-components` is also never imported by app code **but must stay**: Sanity Studio v3 requires it as a peer dependency (`npm ls styled-components` shows it under `sanity`). Removing it breaks `npx sanity dev` and the `app/studio` build path if present.
- Two icon libraries: `react-icons` (used in ~10 live files, all via `react-icons/tb`) and `lucide-react` (live usage only in `app/(site)/life-calendar/page.tsx` and `app/(site)/life-calendar/life-calendar-client.tsx`; its third user, `components/ScatteredPhotos.tsx`, is deleted by plan 004).
- `npm audit` (2026-06-11): `72 vulnerabilities (2 low, 34 moderate, 29 high, 7 critical)`; audit names non-breaking fixes for at least `ws` (high, DoS) and `yaml` (moderate) via plain `npm audit fix`.
- Engines: `"node": "22.x"`. Lockfile: `package-lock.json` (npm).

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Usage check | `grep -rn "<pkg-name>" app components lib hooks --include="*.ts*"` | 0 matches for the three removal candidates |
| Peer check | `npm ls styled-components` | shows `sanity@…` as the dependent |
| Audit | `npm audit` | vulnerability count, before vs after |

## Scope

**In scope**:
- `package.json`, `package-lock.json` (via npm commands only — no hand-editing the lockfile)
- (Optional Step 4 only) `app/(site)/life-calendar/page.tsx`, `app/(site)/life-calendar/life-calendar-client.tsx`

**Out of scope** (do NOT touch):
- `npm audit fix --force` — never. It would jump `next-sanity` across major versions.
- Upgrading `next`, `react`, `sanity`, `eslint` majors — separate migration decisions, not hygiene.
- `styled-components` — stays (peer dep of sanity).
- Any other source file.

## Git workflow

- Branch: `advisor/007-dependency-hygiene`
- One commit per step.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Re-verify the removal candidates are unused

```bash
for p in clipboard-copy vaul latest; do echo "== $p =="; grep -rn "$p" app components lib hooks --include="*.ts*"; done
```

Note: the word "latest" may appear in prose/strings (e.g. the hero text says "using the latest tools") — only `from "latest"` / `require("latest")` style matches count as usage.

**Verify**: zero import-style matches for all three.

### Step 2: Uninstall them

```bash
npm uninstall clipboard-copy vaul latest
```

**Verify**: `grep -c "clipboard-copy\|\"vaul\"\|\"latest\"" package.json` → 0; `npm run verify` → exit 0.

### Step 3: Apply non-breaking audit fixes

```bash
npm audit | tail -5          # record the BEFORE count
npm audit fix                # no --force
npm audit | tail -5          # record the AFTER count
```

**Verify**: `npm run verify` → exit 0; `git diff package.json` shows no major-version jumps of direct dependencies (audit fix without --force shouldn't change `package.json` ranges at all in most cases — lockfile-only changes are expected). Report before/after vulnerability counts.

### Step 4 (OPTIONAL — skip if anything is unclear): consolidate to one icon library

Only if plan 004 has landed (so ScatteredPhotos is gone): the live `lucide-react` usage is two files in `life-calendar/`. `react-icons` ships the same Lucide icon set under `react-icons/lu`. Swap the lucide imports in those two files to `react-icons/lu` equivalents (e.g. `CalendarDays` → `LuCalendarDays`; check each icon exists in `react-icons/lu` first — if any has no direct equivalent, ABORT this step, keep both libraries, and note it). Then `npm uninstall lucide-react`.

**Verify**: `npm run verify` → exit 0; load http://localhost:3001/life-calendar in dev and confirm icons render.

## Test plan

No tests. Gates: `npm run verify` after every step; the dev-server icon check for Step 4.

## Done criteria

- [ ] `clipboard-copy`, `vaul`, `latest` absent from `package.json`
- [ ] `styled-components` still present in `package.json`
- [ ] `npm audit fix` applied; before/after counts reported
- [ ] `npm run verify` exits 0
- [ ] (If Step 4 done) `lucide-react` removed and `/life-calendar` icons render
- [ ] Only `package.json`/`package-lock.json` (+ the two life-calendar files if Step 4) modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- Step 1 finds a real import of any removal candidate.
- `npm audit fix` changes a direct dependency's major version in `package.json`, or the build breaks afterward — `git checkout -- package.json package-lock.json && npm install` to revert, then report.
- Step 4: any lucide icon lacks a `react-icons/lu` equivalent.

## Maintenance notes

- The bulk of the remaining audit noise lives in the `sanity`/studio toolchain; it shrinks only with a Sanity major upgrade — flagged as a future migration decision, deliberately not attempted here.
- Reviewer: the diff should be `package.json` + lockfile (+ two optional icon-import files); anything else is scope creep.
