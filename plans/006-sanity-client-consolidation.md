# Plan 006: One shared Sanity client, env-driven config, and validated embed URLs

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- sanity/sanity-utils.ts "app/(site)/projects" components/ProjectMediaGallery.tsx components/ProjectImageGrid.tsx`
> Plans 003/004 intentionally modify some of these files — that drift is
> expected. What must still hold: the `createClient({...})` call sites listed
> in Current state (minus any file plan 004 deleted). Re-run the grep in
> Step 2 to get the live list before editing.

## Status

- **Priority**: P2
- **Effort**: S–M
- **Risk**: LOW
- **Depends on**: plans/004 (recommended first — it deletes one call site; this plan tolerates either order)
- **Category**: tech-debt / security
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

The Sanity client is constructed from scratch at nine call sites, each hardcoding `projectId: "jyqe7nab"`, `dataset: "production"`, `apiVersion: "2023-10-07"`. Meanwhile `.env.local` defines `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` that **no code reads**. Any config change (API version bump, dataset switch) means nine edits. Separately, the CMS `embed` field is rendered straight into `<iframe src={...}>` with no URL validation — low severity for a single-author CMS, but a compromised Sanity account would get arbitrary iframe injection on every project page; an https + hostname allowlist closes it cheaply.

## Current state

`createClient(` call sites at commit `62cddd8` (re-enumerate before editing — plan 004 deletes `ProjectImageGrid.tsx`):

- `sanity/sanity-utils.ts:6, 38, 70` — one per query function (`getProjects`, `getProject`, `getBooks`); all use `useCdn: true`. Example (lines 5–11):
  ```ts
  export async function getProjects(): Promise<Project[]> {
      const client = createClient({
          projectId: "jyqe7nab",
          dataset: "production",
          apiVersion: "2023-10-07",
          useCdn: true,
      });
  ```
- `app/(site)/projects/page.tsx:29` — module-level page; client used only for `urlBuilder` in a PortableText image component. (No `useCdn` set here.)
- `app/(site)/projects/[slug]/page.tsx:31` (inside the page component, for `urlBuilder`) and `:137` (inside `generateStaticParams`, for a slug query).
- `components/ProjectMediaGallery.tsx:19` — module scope, client component, used only for `urlBuilder`.
- `components/ProjectImageGrid.tsx:11` — module scope; **deleted by plan 004** — skip if absent.
- `app/(site)/projects/projects-client.tsx:26` — module scope, client component, used only for `urlBuilder`:
  ```ts
  const client = createClient({
    projectId: "jyqe7nab",
    dataset: "production",
    apiVersion: "2023-10-07",
  });
  ```
- `sanity.config.ts` and `sanity.cli.js` also hardcode the IDs — **leave them**; the studio config doesn't run through Next's env pipeline and keeping literals there is conventional.

Embed rendering sites, both in `components/ProjectMediaGallery.tsx`:
- Line 227: inline preview `<iframe src={embedUrl} ... />` (embedUrl prop comes from `project.embed` via `app/(site)/projects/[slug]/page.tsx:112`).
- Line 357: lightbox `<iframe src={allMedia[selectedIndex].embedUrl} ... />`.

`types/Project.ts` types `embed` as a plain `string`. The Sanity dataset is public; you can see the real embed values with:

```bash
curl -s 'https://jyqe7nab.api.sanity.io/v2023-10-07/data/query/production?query=*%5B_type%3D%3D%22project%22%20%26%26%20defined(embed)%5D%7Bembed%7D'
```

Conventions: path alias `@/*`; small helpers live in `lib/` (see `lib/utils.ts`).

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Call-site census | `grep -rn "createClient(" app components sanity lib --include="*.ts*"` | after: exactly 1 hit, in `sanity/client.ts` |
| Embed census | the curl above | JSON list of current embed URLs |

## Scope

**In scope**:
- Create `sanity/client.ts` and `lib/embed.ts`
- Edit: `sanity/sanity-utils.ts`, `app/(site)/projects/page.tsx`, `app/(site)/projects/[slug]/page.tsx`, `app/(site)/projects/projects-client.tsx`, `components/ProjectMediaGallery.tsx`, and `components/ProjectImageGrid.tsx` only if it still exists

**Out of scope** (do NOT touch):
- `sanity.config.ts`, `sanity.cli.js` (studio tooling keeps literals)
- The GROQ query strings
- `.env.local` (read names only, never commit)
- Caching/revalidate options on fetches — content freshness is plan 008's domain

## Git workflow

- Branch: `advisor/006-sanity-client-consolidation`
- Commits: one for the client consolidation, one for embed validation.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the shared client

`sanity/client.ts`:

```ts
import { createClient } from "next-sanity";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jyqe7nab";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2023-10-07";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
```

Keep the hardcoded fallbacks — the build must not start failing for contributors without `.env.local` (the IDs are public identifiers, not secrets).

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Switch every call site to the shared client

Re-run the call-site census. In each listed file: delete the local `createClient({...})` block and the now-unused `import { createClient } from "next-sanity"`, and import the shared one instead: `import { client } from "@/sanity/client";`. Notes:

- `sanity/sanity-utils.ts`: all three functions share the one import; remove the three inline blocks.
- `app/(site)/projects/[slug]/page.tsx`: both the page component (line 31) and `generateStaticParams` (line 137) use the same shared client. `generateStaticParams` currently omits `useCdn` — using the CDN there too is fine for a public dataset.
- Client components (`ProjectMediaGallery.tsx`, `projects-client.tsx`): importing the shared module from a `"use client"` file is fine — `NEXT_PUBLIC_*` env vars are inlined at build time.

**Verify**: `grep -rn "createClient(" app components sanity lib --include="*.ts*"` → exactly one match (`sanity/client.ts`); `npm run verify` → exit 0.

### Step 3: Enumerate real embed hosts

Run the embed-census curl. Collect the distinct hostnames (expect Figma and possibly YouTube/Vimeo — the lightbox's fallback thumbnail icon is `TbBrandFigma`, a strong hint).

**Verify**: you have the JSON output; paste the distinct hostnames into your report. If the curl fails (network), STOP.

### Step 4: Add the allowlist helper

`lib/embed.ts`:

```ts
const ALLOWED_EMBED_HOSTS = new Set([
  "www.figma.com",
  "figma.com",
  "embed.figma.com",
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  // add any additional hosts found in Step 3
]);

export function safeEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!ALLOWED_EMBED_HOSTS.has(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
```

Add every hostname from Step 3 to the set (https hosts only). In `components/ProjectMediaGallery.tsx`, normalize once where `allMedia` is assembled: pass `embedUrl` through `safeEmbedUrl` when pushing the embed item (around lines 76–82) and when rendering the inline preview (line 221's `{embedUrl && ...}` guard becomes a check on the sanitized value). A clean shape: compute `const sanitizedEmbedUrl = safeEmbedUrl(embedUrl);` at the top of the component and use it everywhere `embedUrl` was used. A null result means the embed simply doesn't render — same as no embed.

**Verify**: `npm run verify` → exit 0; `grep -n "safeEmbedUrl" components/ProjectMediaGallery.tsx` → at least 2 uses.

### Step 5: Visual smoke check

`npm run dev`; open a project that has an embed (pick one whose slug you saw in Step 3's query, e.g. query `*[_type=="project" && defined(embed)][0]{ "slug": slug.current }`). Confirm the embed iframe still renders inline and in the lightbox. Stop the server.

**Verify**: embed visible; no console errors about blocked URLs.

## Test plan

No test infrastructure. The embed-census + smoke check is the regression test: every embed that rendered before must render after (Step 3's list vs Step 5). If any real embed is filtered out by the allowlist, that's a STOP (the list is wrong), not a silent drop.

## Done criteria

- [ ] `grep -rn "createClient(" app components sanity lib --include="*.ts*"` → exactly 1 match in `sanity/client.ts`
- [ ] `grep -rn "jyqe7nab" app components --include="*.ts*"` → 0 matches (the literal survives only in `sanity/client.ts` fallback, `sanity.config.ts`, `sanity.cli.js`)
- [ ] `lib/embed.ts` exists; both iframe render paths go through `safeEmbedUrl`
- [ ] Every embed URL from the Step 3 census passes `safeEmbedUrl` (report the list)
- [ ] `npm run verify` exits 0
- [ ] `plans/README.md` status row updated

## STOP conditions

- The live call-site census differs from Current state in a way other than `ProjectImageGrid.tsx` being deleted.
- Step 3's census shows an embed URL that is not https or whose host you cannot confidently allowlist — report it instead of guessing.
- Step 5's smoke check shows a previously-working embed gone blank.

## Maintenance notes

- New embed providers must be added to `ALLOWED_EMBED_HOSTS` — the symptom of forgetting is "embed doesn't show on the project page."
- If a preview/draft mode is ever added, the shared client is the one place to branch `useCdn`/tokens.
- Reviewer: check no call site silently kept its own client (the grep done-criterion covers it) and that the allowlist matches the census output.
