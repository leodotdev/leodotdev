# Plan 010: Grid/list view toggle for the Projects section (grid paginates at 2×)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0d46a8a..HEAD -- "app/(site)/projects/projects-client.tsx"`
> Plan 009 also modifies this file (the description block inside the row).
> That drift is EXPECTED if 009 landed first — this plan's changes live in
> different regions (header, list wrapper, pagination, new grid branch).
> Locate edit points by content, not line number. On any other structural
> mismatch with the excerpts below, STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW–MED (pure client-side rendering change; no data or schema changes)
- **Depends on**: plans/009 recommended first (both touch `projects-client.tsx`; 009 owns the description block, this plan must render `EditableDescription` in list rows if 009 has landed — see Step 3)
- **Category**: direction / feature
- **Planned at**: commit `0d46a8a`, 2026-06-12

## Why this matters

The Projects section is a single vertical list (8 per "Show more" load). The operator wants a denser browsing option: a grid view, toggled from the top-right of the section header, showing **double the projects per pagination load** (16 vs 8). List stays the default and keeps its current behavior.

## Current state

All in `app/(site)/projects/projects-client.tsx` (`"use client"`), at commit `0d46a8a`:

- Page size constant (line 62): `const PROJECTS_PAGE_SIZE = 8;`
- State (lines 65–69): `selectedCategory`, `visibleCount` (initialized to `PROJECTS_PAGE_SIZE`), and lightbox state.
- Category click resets pagination (lines 122–125):
  ```tsx
  const handleCategoryClick = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setVisibleCount(PROJECTS_PAGE_SIZE);
  };
  ```
- Section header (lines 139–143) — the toggle's future home is the top-right of this block:
  ```tsx
  <div className="px-6 pb-12 md:px-12">
    <div className="font-semibold">Projects</div>
    <div className="text-muted-foreground">
      Shots and embeds of my past work.
    </div>
  ```
  (followed by the category pill buttons, lines 145–166, which stay).
- List rendering (lines 169–247): `<div className="flex flex-col [&:hover>*]:opacity-50">` mapping `visibleProjects` to full-width rows (Avatar + name/client/year, optional description, thumbnail strip with lightbox openers, `Separator` between rows).
- Pagination (lines 249–271): Show more `setVisibleCount((prev) => prev + PROJECTS_PAGE_SIZE)`; Show less resets to `PROJECTS_PAGE_SIZE`.
- Icons come from `react-icons/tb`; active pill styling uses `bg-muted`; the site uses `localStorage` already (scroll restore in `projects-wrapper.tsx`), so persisting the view mode is conventional.
- `project.image` is the hero image URL (may be missing); `getContentImageThumbs(project)` (line 38) returns cropped content-image thumbnails — useful for a grid-card cover fallback.

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Dev server| `npm run dev` (or `npx next dev -p 3005`) | serves |

## Scope

**In scope**:
- `app/(site)/projects/projects-client.tsx` only.

**Out of scope** (do NOT touch):
- The references section, navigation, detail pages, Sanity layer.
- The lightbox implementation (grid cards link to the project page; only list-mode thumbnails open the lightbox).
- `EditableDescription` / `useSanityAdmin` internals (plan 009's files) — consume, don't modify.

## Git workflow

- Branch: `advisor/010-grid-view` (or the session's working branch if the reviewer says so); plain imperative commit subjects.

## Steps

### Step 1: View-mode state and constants

1. Replace the single constant with:
   ```ts
   const PROJECTS_PAGE_SIZE = 8;            // list mode
   const GRID_PAGE_SIZE = PROJECTS_PAGE_SIZE * 2; // grid mode shows double per load
   ```
2. Add state: `const [viewMode, setViewMode] = useState<"list" | "grid">("list");`
3. Derive `const pageSize = viewMode === "grid" ? GRID_PAGE_SIZE : PROJECTS_PAGE_SIZE;` and use `pageSize` everywhere `PROJECTS_PAGE_SIZE` was used for pagination math (initial state stays `PROJECTS_PAGE_SIZE` since list is the default; Show more increments by `pageSize`; Show less resets to `pageSize`; `hasMore` compares against `visibleCount` as today).
4. Mode switch handler resets pagination to the new mode's page size:
   ```ts
   const handleViewModeChange = (mode: "list" | "grid") => {
     setViewMode(mode);
     setVisibleCount(mode === "grid" ? GRID_PAGE_SIZE : PROJECTS_PAGE_SIZE);
   };
   ```
5. Persist across visits (matches the repo's localStorage convention): on change, `localStorage.setItem("projects-view-mode", mode)` inside the handler (guarded by `typeof window !== "undefined"`); on mount, a `useEffect` reads the key and, if `"grid"`, calls `handleViewModeChange("grid")`. Server render defaults to list; a brief flash on grid-preferring clients is acceptable.

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Toggle UI in the section header

Restructure the header block (Current state excerpt) into a flex row with the toggle top-right:

```tsx
<div className="flex items-start justify-between">
  <div>
    <div className="font-semibold">Projects</div>
    <div className="text-muted-foreground">
      Shots and embeds of my past work.
    </div>
  </div>
  <div className="flex gap-1">
    <Button variant="ghost" size="icon" aria-label="List view" aria-pressed={viewMode === "list"}
      onClick={() => handleViewModeChange("list")}
      className={viewMode === "list" ? "bg-muted hover:bg-muted" : ""}>
      <TbList className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" aria-label="Grid view" aria-pressed={viewMode === "grid"}
      onClick={() => handleViewModeChange("grid")}
      className={viewMode === "grid" ? "bg-muted hover:bg-muted" : ""}>
      <TbLayoutGrid className="h-4 w-4" />
    </Button>
  </div>
</div>
```

Add `TbList, TbLayoutGrid` to the existing `react-icons/tb` import. The category pills below stay untouched. Active-state styling mirrors the category pills (`bg-muted`).

**Verify**: `npm run lint` → zero warnings.

### Step 3: Grid rendering branch

Where the list wrapper begins (`<div className="flex flex-col [&:hover>*]:opacity-50">`), branch on `viewMode`:

- **List** (`viewMode === "list"`): the existing markup, unchanged. (If plan 009 landed, the row contains `<EditableDescription …>` — leave it exactly as is.)
- **Grid** (`viewMode === "grid"`): replace the column wrapper with a responsive grid inside the same horizontal padding the rows use (`px-6 md:px-12`):
  ```tsx
  <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-3 md:px-12 lg:grid-cols-4 [&:hover>*]:opacity-50">
    {visibleProjects.map((project) => { … })}
  </div>
  ```
  Each card is a `<Link href={/projects/${project.slug}}>` with `className="group transition-opacity hover:!opacity-100"` containing:
  - Cover: `aspect-[4/3] relative overflow-hidden rounded-lg bg-secondary outline outline-1 -outline-offset-1 outline-border`. Image source: `project.image`, else the first entry of `getContentImageThumbs(project)`, else no image (the `bg-secondary` box with the client's initial centered, mirroring the Avatar fallback pattern). Use `next/image` with `fill`, `sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"`, `className="object-cover"`, `loading="lazy"`.
  - Caption below: project `name` (truncate), then `client · year` in `text-sm text-muted-foreground` (truncate).
  - No description, no thumbnail strip, no lightbox in grid cards — the card itself navigates.
  - No `Separator`s in grid mode.

**Verify**: `npm run verify` → exit 0.

### Step 4: Manual verification (dev server)

1. Default view is list, identical to before (including lightbox on thumbnails and, if 009 landed, double-click editing).
2. Click the grid icon: 16 cards render (with "All" selected and 50 projects, Show more appears); Show more → 32; Show less → back to 16.
3. Switch to a category with few projects (e.g. Graphic Design): grid shows them all, no Show more.
4. Toggle back to list: 8 rows, pagination resets correctly.
5. Reload after choosing grid → grid persists (localStorage).
6. Cards with no hero image show the fallback (content thumb or initial), not a broken image.

**Verify**: report each observation; include a screenshot if your environment supports it, otherwise describe.

## Test plan

No test infra. Step 4's matrix is the regression test. The riskiest interactions: pagination math after mode switches, and not regressing the list mode (it must remain byte-identical in behavior).

## Done criteria

- [ ] `npm run verify` exits 0; lint stays at zero warnings
- [ ] Toggle renders top-right of the Projects header; list is default
- [ ] Grid shows 16 per load (double list's 8); Show more/less use the mode's page size
- [ ] List mode behavior unchanged (lightbox, separators, description block)
- [ ] View mode persists via `localStorage` key `projects-view-mode`
- [ ] Only `app/(site)/projects/projects-client.tsx` modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- The header/list/pagination regions no longer match the excerpts beyond plan 009's description-block change.
- Grid cards trigger the lightbox or otherwise capture clicks that should navigate.
- You find yourself modifying `EditableDescription`, the lightbox, or any second file.

## Maintenance notes

- If a category filter is active when toggling modes, `visibleCount` resets — same UX as the existing category-click reset; intentional.
- The `[&:hover>*]:opacity-50` hover-dimming idiom is reused for grid; if the design evolves, both branches need the change.
- Future: the grid cover could use the same urlBuilder width tuning as `getContentImageThumbs` for `project.image` (currently the raw hero URL) — deferred, cosmetic.
- Reviewer: check pagination math at mode boundaries (switch at visibleCount=24 etc.) and that list mode's JSX is untouched apart from the wrapper branch.
