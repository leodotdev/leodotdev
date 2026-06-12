# Plan 003: Fix lightbox unmount leaks (stuck scroll-lock, orphaned timers) in ProjectMediaGallery

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 62cddd8..HEAD -- components/ProjectMediaGallery.tsx`
> NOTE: at planning time this file already had uncommitted local modifications
> in the operator's working tree. Whether or not the diff is empty, compare the
> "Current state" excerpts against the live code before proceeding; if the
> relevant functions have materially changed, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001 (for `npm run verify`)
- **Category**: bug
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

`ProjectMediaGallery` (the lightbox on every `/projects/[slug]` page) locks page scrolling by setting `document.body.style.overflow = "hidden"` when the lightbox opens, and only restores it in `closeLightbox()`. If the user navigates away while the lightbox is open (browser back, clicking the next-project link), the component unmounts without restoring overflow — **the next page cannot be scrolled**. The same code stores fake-progress `setInterval` IDs as ad-hoc globals on `window`, which leak and keep firing after unmount. Finally, the keyboard `useEffect` omits `closeLightbox` from its dependency array (the repo's one remaining `react-hooks/exhaustive-deps` lint warning in live code), so Escape can restore a stale overflow value.

## Current state

`components/ProjectMediaGallery.tsx` — client component, the only lightbox used by live pages. Relevant excerpts at commit `62cddd8`:

- Line 60: `const [originalBodyOverflow, setOriginalBodyOverflow] = useState<string>("");`
- Lines 92–100 (`openLightbox`): sets `originalBodyOverflow` from `document.body.style.overflow`, then sets `document.body.style.overflow = "hidden"`, and calls `simulateProgress(index)`.
- Lines 102–115 (`closeLightbox`): loops `allMedia`, reads `(window as any)["progressInterval_" + index]`, `clearInterval`s and deletes them; restores `document.body.style.overflow = originalBodyOverflow`.
- Lines 138–153 (`simulateProgress`): creates a `setInterval(..., 200)` ticking progress state, then `(window as any)["progressInterval_" + index] = interval;`
- Lines 155–174: keyboard `useEffect`:
  ```tsx
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      switch (e.key) {
        case "Escape": closeLightbox(); break;
        case "ArrowLeft": goToPrevious(); break;
        case "ArrowRight": goToNext(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);
  ```
- Lines 188–201 (`handleImageLoad`): also reads/clears the `window` interval globals.
- Lines 399–404: thumbnail buttons call `simulateProgress(index)` inline.
- There is NO unmount cleanup effect anywhere in the file.

Current lint output for this file (the warning to eliminate):
```
./components/ProjectMediaGallery.tsx
174:6  Warning: React Hook React.useEffect has a missing dependency: 'closeLightbox'.
```

Repo conventions: `"use client"` components, hooks from React namespace (`React.useEffect`) or named imports — either is fine here; match the file's existing style.

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Verify all| `npm run verify`   | exit 0              |
| Lint only | `npm run lint`     | no warnings mentioning `ProjectMediaGallery.tsx` |
| Dev server| `npm run dev`      | http://localhost:3001 |

## Scope

**In scope** (the only file you should modify):
- `components/ProjectMediaGallery.tsx`

**Out of scope** (do NOT touch, even though they have similar code):
- `components/ProjectImageGrid.tsx`, `components/ScatteredPhotos.tsx`, `components/LiquidGlassMagnifier.tsx` — dead code scheduled for deletion in plan 004; fixing their identical warnings is wasted effort.
- The visual/animation behavior of the lightbox (framer-motion props, classNames) — no changes.

## Git workflow

- Branch: `advisor/003-lightbox-effect-hygiene`
- Commit style: short imperative subject, e.g. "Fix lightbox scroll-lock and timer leaks on unmount".
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Move interval bookkeeping off `window` into a ref

1. Add near the other state declarations:
   ```tsx
   const progressIntervals = useRef<Record<number, ReturnType<typeof setInterval>>>({});
   ```
   (import `useRef` alongside `useState` at the top.)
2. In `simulateProgress`, replace `(window as any)[\`progressInterval_${index}\`] = interval;` with: clear any existing `progressIntervals.current[index]` first, then `progressIntervals.current[index] = interval;`
3. In `closeLightbox` and `handleImageLoad`, replace the `(window as any)` reads/deletes with reads/deletes on `progressIntervals.current`.

**Verify**: `grep -c "window as any" components/ProjectMediaGallery.tsx` → `0`; `npx tsc --noEmit` → exit 0.

### Step 2: Stabilize the callbacks and fix the effect dependencies

Wrap `closeLightbox`, `goToPrevious`, and `goToNext` in `useCallback` (import it), with correct dependency arrays — `closeLightbox` depends on `originalBodyOverflow` (and uses `progressIntervals`, which is a stable ref); `goToPrevious`/`goToNext` depend on `selectedIndex`, `allMedia.length`, `loadingStates`, `loadingProgress`. Then change the keyboard effect's dependency array to `[selectedIndex, closeLightbox, goToPrevious, goToNext]`.

Note: `allMedia` is rebuilt every render from props, so don't put the array itself in dependency arrays — use `allMedia.length`. `simulateProgress` only touches state setters and the ref; either wrap it in `useCallback` with `[]` deps or leave it un-memoized and exclude it the way the file currently does — but the lint warning must be gone without any `eslint-disable` comment.

**Verify**: `npm run lint` → zero warnings for `ProjectMediaGallery.tsx`; `grep -c "eslint-disable" components/ProjectMediaGallery.tsx` → `0`.

### Step 3: Add an unmount cleanup effect

Add one effect that runs only on unmount and cleans up everything the lightbox may have left behind:

```tsx
useEffect(() => {
  return () => {
    Object.values(progressIntervals.current).forEach(clearInterval);
    progressIntervals.current = {};
    document.body.style.overflow = "";
  };
}, []);
```

Resetting overflow to `""` (rather than the saved value) is correct on unmount: the component is gone, so the body must be scrollable. The saved-value restore in `closeLightbox` still handles the normal close path. If the linter complains about reading `progressIntervals.current` in cleanup, copy it to a local variable inside the cleanup function — do not suppress the rule.

**Verify**: `npm run verify` → exit 0.

### Step 4: Manual repro check

1. `npm run dev`; open http://localhost:3001/projects/hacker (or any project with images).
2. Click an image to open the lightbox → page behind must not scroll.
3. Press ArrowRight/ArrowLeft → media cycles; press Escape → lightbox closes AND the page scrolls again.
4. Open the lightbox again, then use the browser Back button → on the projects list page, **scrolling must work**. (This is the bug being fixed; before the fix the page stays frozen.)
5. Stop the dev server.

**Verify**: report each of the four observations explicitly in your final summary.

## Test plan

No test infrastructure exists; the manual repro in step 4 is the regression check. If a test harness is added later, the unmount-restores-overflow behavior is the first test to write for this component.

## Done criteria

- [ ] `npm run verify` exits 0
- [ ] `npm run lint` output contains no line mentioning `ProjectMediaGallery.tsx`
- [ ] `grep -c "window as any" components/ProjectMediaGallery.tsx` → 0
- [ ] `grep -c "eslint-disable" components/ProjectMediaGallery.tsx` → 0
- [ ] Manual repro (step 4) passes, including scroll restored after back-navigation
- [ ] Only `components/ProjectMediaGallery.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The live file's `closeLightbox`/`simulateProgress`/keyboard-effect no longer match the Current state excerpts (the operator had uncommitted edits to this file at planning time — drift is likely; report what you find).
- Eliminating the lint warning seems to require an `eslint-disable` comment — that means the callback graph is different from what this plan assumes; report it.
- The lightbox visually breaks (animations stop working, thumbnails disappear) after step 2.

## Maintenance notes

- Other (currently dead) components share this exact `window`-interval pattern; if any are revived instead of deleted in plan 004, apply the same ref-based fix there.
- Reviewer: scrutinize the `useCallback` dependency arrays — the failure mode is keyboard navigation operating on a stale `selectedIndex`. Step 4's arrow-key check covers it.
- The "simulated progress" design (fake percentages on a 200ms timer) is cosmetic debt; replacing it with real load events was considered and deferred — out of scope here.
