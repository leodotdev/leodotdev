# Plan 009: Placeholder descriptions + double-click inline editing for the Sanity admin

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0d46a8a..HEAD -- "app/(site)/projects/projects-client.tsx" sanity/client.ts types/Project.ts`
> If these files changed since `0d46a8a`, compare the "Current state" excerpts
> against the live code; on a material mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (touches live list rendering; introduces authenticated writes)
- **Depends on**: none (works without plan 008's webhook, but pairs well with it)
- **Category**: direction / feature
- **Planned at**: commit `0d46a8a`, 2026-06-12

## Why this matters

48 of the 50 projects in Sanity have no `description` (verified via the public query API on 2026-06-12), so most list rows show nothing between the title row and the thumbnails. The operator wants (a) a visible placeholder on description-less projects "for now", and (b) the ability to fix descriptions directly on the site: as the Sanity admin, double-click a description (or its placeholder), type, save — no Studio round-trip. The site is fully static, so this works via browser-credentialed Sanity mutations: no token ships in the bundle; writes succeed only for a browser logged into sanity.io as a project member.

## Current state

- `app/(site)/projects/projects-client.tsx` — `"use client"` component rendering the projects list. Each row is wrapped in a `<Link href={/projects/${project.slug}}>` (line 181). The description block at lines 208–212 renders only when present:
  ```tsx
  {project.description && (
    <div className="mt-2 pl-11 text-sm text-muted-foreground">
      {project.description}
    </div>
  )}
  ```
  The component receives `projects: Project[]` as a prop from the server page; there is existing state (`selectedCategory`, `visibleCount`, lightbox state) — leave it all alone.
- `sanity/client.ts` — shared read client (CDN, no credentials), exports `projectId`, `dataset`, `apiVersion`, `client`.
- `types/Project.ts` — `description?: string`.
- Repo conventions: components in `components/`, helpers in `lib/`, `"use client"` + hooks, Tailwind classes, `react-icons/tb` icons.
- **Important platform fact**: pages are statically built. A successful Sanity patch updates the CMS and the local React state (optimistic), but a page reload shows the OLD build until the site rebuilds. With plan 008's webhook configured, the patch itself triggers the rebuild. Document this in the UI copy or accept it silently (see Step 6).

## Operator prerequisites (dashboard, before or alongside execution)

Sanity manage (sanity.io/manage → project `jyqe7nab` → API → CORS origins) must list, **with "Allow credentials" checked**:
- `http://localhost:3001` (dev)
- `https://leo.dev` (prod)

Without this, the admin check and mutations fail in the browser with CORS errors — the UI must degrade to read-only (that's also how every non-admin visitor experiences the page).

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Dev server| `npm run dev` (or `npx next dev -p 3005` if 3001 is taken) | serves |
| Description census | `curl -s 'https://jyqe7nab.api.sanity.io/v2023-10-07/data/query/production?query=%7B%22total%22%3A%20count(*%5B_type%3D%3D%22project%22%5D)%2C%20%22noDesc%22%3A%20count(*%5B_type%3D%3D%22project%22%20%26%26%20!defined(description)%5D)%7D'` | JSON counts |

## Scope

**In scope**:
- Create `sanity/write-client.ts`
- Create `hooks/useSanityAdmin.ts`
- Create `components/EditableDescription.tsx`
- Edit `app/(site)/projects/projects-client.tsx` (description block only)

**Out of scope** (do NOT touch):
- The project detail page (`app/(site)/projects/[slug]/page.tsx`) — descriptions there stay read-only for now (deferred; noted in Maintenance).
- The Sanity schema (`description` already exists as a plain string field).
- All other list-row markup, the lightbox, categories, pagination.
- No tokens, no API keys, nothing secret — the write path is cookie-credentialed only.

## Git workflow

- Branch: `advisor/009-inline-descriptions` (or commit directly on the session's working branch if the reviewer says so)
- Plain imperative commit subjects, no prefixes.

## Steps

### Step 1: Write client

`sanity/write-client.ts`:

```ts
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./client";

// Cookie-credentialed client: mutations succeed only in a browser logged in
// to sanity.io as a member of this project. No token — safe to ship.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  withCredentials: true,
});
```

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Admin detection hook

`hooks/useSanityAdmin.ts` — returns `isAdmin: boolean` (default false). On mount (client only), call Sanity's `users/me` endpoint with credentials:

```ts
"use client";
import { useEffect, useState } from "react";
import { writeClient } from "@/sanity/write-client";

export function useSanityAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let cancelled = false;
    writeClient
      .request<{ id?: string | null }>({ uri: "/users/me", withCredentials: true })
      .then((user) => {
        if (!cancelled && typeof user?.id === "string" && user.id.length > 0) {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        /* not logged in, CORS not configured, offline — all mean read-only */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return isAdmin;
}
```

Treat ANY failure as not-admin; never surface an error to visitors.

**Verify**: `npx tsc --noEmit` → exit 0; `npm run lint` → no new warnings.

### Step 3: EditableDescription component

`components/EditableDescription.tsx` — `"use client"`. Props: `{ projectId: string; description?: string; isAdmin: boolean; className?: string }`. Behavior:

- **Display mode**: renders the description, or — when absent/empty — the placeholder `Description coming soon.` in `italic opacity-60` (appended to the passed className). Always rendered (no more conditional row).
- **Admin affordances** (only when `isAdmin`):
  - `onClick`: `e.preventDefault(); e.stopPropagation();` — the block lives inside the row's `<Link>`; without this, the first click of a double-click navigates. Non-admins keep normal link behavior (no handlers attached at all).
  - `onDoubleClick`: `preventDefault/stopPropagation`, then switch to edit mode. Add `title="Double-click to edit"` and `cursor-text` class when admin.
- **Edit mode**: a `<textarea>` pre-filled with the current description (empty for placeholder), auto-focused, styled to match (`w-full bg-transparent text-sm text-muted-foreground outline-none border border-border rounded-md p-2`), with keyboard handling: `Escape` cancels; `Cmd/Ctrl+Enter` saves; blur saves (if changed). Clicks inside the textarea must also `stopPropagation` so the Link never fires.
- **Save**: `writeClient.patch(projectId).set({ description: trimmed }).commit()` — or `.unset(["description"])` when the trimmed value is empty. While saving, disable the textarea (`opacity-50`). On success, update local display state (optimistic — the prop won't change because the page is static). On failure, `alert("Could not save — are you still logged in to sanity.io?")` and return to edit mode with the draft preserved.
- Keep internal state minimal: `mode: "view" | "edit"`, `draft: string`, `saving: boolean`, `localValue: string | undefined` (initialized from the prop, replaced on successful save).

**Verify**: `npx tsc --noEmit` → exit 0; `npm run lint` → zero warnings (mind exhaustive-deps; this repo's lint must stay clean).

### Step 4: Wire into the list

In `app/(site)/projects/projects-client.tsx`:

1. Import `EditableDescription` and `useSanityAdmin`; call `const isAdmin = useSanityAdmin();` once at the top of `ProjectsClient`.
2. Replace the conditional description block (lines 208–212 excerpt above) with an unconditional:
   ```tsx
   <EditableDescription
     projectId={project._id}
     description={project.description}
     isAdmin={isAdmin}
     className="mt-2 pl-11 text-sm text-muted-foreground"
   />
   ```

**Verify**: `npm run verify` → exit 0.

### Step 5: Manual verification (dev server)

1. Logged OUT (or normal browser profile not authenticated to sanity.io): every project without a description shows the italic placeholder; clicking anywhere on the row (including the placeholder) navigates to the project page; no console errors (the users/me failure must be swallowed).
2. Logged IN to sanity.io (same browser) **with the localhost CORS origin configured**: double-click a placeholder → textarea appears; type "test description", Cmd+Enter → text persists in place; reload the page → the old (build-time) value returns — expected on a static build; confirm in Sanity Studio/API that the document actually updated:
   `curl -s 'https://jyqe7nab.api.sanity.io/v2023-10-07/data/query/production?query=*%5B_id%3D%3D%22<that-id>%22%5D%7Bdescription%7D'`
3. Revert the test edit (double-click → clear → save, which unsets the field).

If you (the executor) cannot authenticate to sanity.io, do part 1 only and mark part 2 as DEFERRED TO OPERATOR in your report — do not fake it.

**Verify**: behaviors above; report each observation.

### Step 6: Document

Add to `CLAUDE.md` (conventions or a new "Inline editing" note): descriptions are editable in-place by project members via cookie-credentialed Sanity mutations (`sanity/write-client.ts`); CORS origins with credentials are required; edits publish immediately (no draft) and appear for visitors after the next rebuild.

**Verify**: `grep -c "write-client" CLAUDE.md` → ≥1.

## Test plan

No test infra. The two-browser-state manual check in Step 5 is the regression test. Record the description census before and after (Step 5 should leave counts unchanged after the revert).

## Done criteria

- [ ] `npm run verify` exits 0; lint stays at zero warnings
- [ ] Placeholder shows on description-less projects for anonymous visitors; rows still navigate normally
- [ ] Admin (logged in + CORS configured) can double-click → edit → save; document updates in Sanity (verified by query); UI updates optimistically
- [ ] No tokens or secrets anywhere in the diff (`grep -rn "sk[A-Za-z0-9]\{20,\}" <changed files>` → 0)
- [ ] Anonymous browsers produce no console errors from the admin check
- [ ] `plans/README.md` status row updated

## STOP conditions

- The description block in `projects-client.tsx` no longer matches the excerpt (drift).
- `next-sanity`'s `createClient` rejects `withCredentials` (type error) — the installed version may differ from what this plan assumes; report the version and the error instead of casting around it.
- The single-click suppression for admins breaks row navigation for ANONYMOUS visitors in Step 5.1 — that's a hard fail; the non-admin path must attach no handlers.
- You find yourself wanting to add a token or env secret — never; STOP and report.

## Maintenance notes

- Sanity Studio edits create drafts; this in-place editor patches the **published** document directly. If a draft exists for the same project, Studio may later overwrite the inline edit on publish — acceptable for a single-author site, worth knowing.
- The detail page (`[slug]/page.tsx`) still renders `project.description` read-only; extending editing there is a natural follow-up (same component, server-passed `_id`).
- If plan 008's webhook is configured, every save triggers a site rebuild (~minutes); rapid consecutive edits = multiple builds. Fine at this scale.
- Reviewer: scrutinize that visitor-path renders attach zero event handlers, and that lint stays clean without suppressions.
