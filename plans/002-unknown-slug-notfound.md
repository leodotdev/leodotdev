# Plan 002: Return a 404 instead of crashing on unknown project slugs

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- "app/(site)/projects/[slug]/page.tsx" sanity/sanity-utils.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001 (for `npm run verify`; if 001 hasn't landed, run `npx tsc --noEmit && npm run lint && npm run build` instead)
- **Category**: bug
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

`app/(site)/projects/[slug]/page.tsx` fetches a project by slug and immediately renders `project.name` with no null check. The Sanity GROQ query ends in `[0]`, which returns `null` when no document matches, so visiting `/projects/anything-that-does-not-exist` throws `Cannot read properties of null (reading 'name')` instead of showing a 404. The page has `generateStaticParams`, and Next.js defaults `dynamicParams` to `true`, so unknown slugs do attempt a render (always in `npm run dev`; in production it depends on the host's handling). The fix is the standard Next.js `notFound()` guard.

## Current state

- `app/(site)/projects/[slug]/page.tsx` — project detail page. Lines 15–24:
  ```tsx
  export default async function ProjectPage({
    params,
  }: {
    params: { slug: string };
  }) {
    const project = await getProject(params.slug);
    const allProjects = await getProjects();

    // Find current project index
    const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);
  ```
  First use of `project` without a guard is line 38 (`project.content`), then line 72 (`project.name`).
- `sanity/sanity-utils.ts:36` — `export async function getProject(slug: string): Promise<Project>` — the declared return type lies: the `*[...][0]` query returns `null` on no match.
- Convention: the repo has no custom `not-found.tsx`; `notFound()` from `next/navigation` renders Next's default 404, which is fine (the build already emits `/_not-found`).

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Dev server| `npm run dev`      | serves on http://localhost:3001 |
| Repro     | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/projects/zzz-no-such-slug` | `404` after fix (`500` before) |

## Scope

**In scope** (the only files you should modify):
- `app/(site)/projects/[slug]/page.tsx`
- `sanity/sanity-utils.ts` (return type of `getProject` only)

**Out of scope** (do NOT touch):
- The GROQ queries themselves.
- `generateStaticParams` (lines 136–150 of the page) — leave as is.
- Any other route or component.

## Git workflow

- Branch: `advisor/002-unknown-slug-notfound`
- Commit style: short imperative subject, e.g. "Return 404 for unknown project slugs".
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix the `getProject` return type

In `sanity/sanity-utils.ts`, change the signature to:

```ts
export async function getProject(slug: string): Promise<Project | null> {
```

**Verify**: `npx tsc --noEmit` → now FAILS with an error in `app/(site)/projects/[slug]/page.tsx` (object is possibly null). That error proves the type is doing its job; step 2 fixes it.

### Step 2: Add the `notFound()` guard

In `app/(site)/projects/[slug]/page.tsx`:

1. Add to imports: `import { notFound } from "next/navigation";`
2. Immediately after `const project = await getProject(params.slug);` insert:
   ```tsx
   if (!project) {
     notFound();
   }
   ```

**Verify**: `npx tsc --noEmit` → exit 0, no errors.

### Step 3: Reproduce and confirm

1. Start the dev server: `npm run dev` (port 3001).
2. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/projects/zzz-no-such-slug` → `404`.
3. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/projects/hacker` → `200` (a real slug from the build output; if it 404s, list real slugs with `curl 'https://jyqe7nab.api.sanity.io/v2023-10-07/data/query/production?query=*%5B_type%3D%3D%22project%22%5D%5B0...3%5D%7B%22slug%22%3A%20slug.current%7D'` and use one).
4. Stop the dev server.

**Verify**: both status codes as expected.

## Test plan

No test infrastructure exists (and adding one is not in scope). The curl checks in step 3 are the regression test; record both status codes in your final report.

## Done criteria

- [ ] `npm run verify` exits 0
- [ ] `grep -n "notFound" "app/(site)/projects/[slug]/page.tsx"` shows the import and the guard
- [ ] `grep -n "Promise<Project | null>" sanity/sanity-utils.ts` → 1 match
- [ ] Unknown slug returns 404 in dev, real slug returns 200 (step 3)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The excerpt at lines 15–24 doesn't match the live file (drift).
- After step 2, `tsc` reports null-related errors in files OTHER than the two in-scope files — that means `getProject` has callers this plan didn't account for; report them.
- The dev server can't reach `*.sanity.io` (network); the curl repro is impossible — report instead of skipping verification.

## Maintenance notes

- If a custom 404 design is ever wanted, add `app/not-found.tsx`; the `notFound()` call here will pick it up automatically.
- Reviewer should confirm the guard sits BEFORE the first property access on `project` (line 38's `project.content`).
