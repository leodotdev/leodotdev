import { createContext, useContext, useState } from "react"
import { flushSync } from "react-dom"
import { THEMES } from "@/components/work/claude/docs"
import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"
import { wave } from "@/lib/wave"
import type { ThemeId } from "@/components/work/claude/docs"

// Shared pieces of the design system pages: the theme their figures wear, and
// the page furniture (chapter opening, block, figure box, captions).

const ThemeContext = createContext<{
  /** The theme the figures show: the one picked, or else the page's. */
  theme: ThemeId
  /** The theme picked for the figures, if one has been. */
  picked: ThemeId | null
  /** Picks a theme. `from` is the click that asked, where the wave starts. */
  setTheme: (theme: ThemeId, from?: React.MouseEvent) => void
}>({ theme: "white", picked: null, setTheme: () => {} })

/**
 * The theme of the docs' figures. The page itself always wears the site's
 * own theme (White, or Dark 3 in dark mode) and its light switch; the five
 * dots in the docs' tab row only change what is inside the figures
 * (`Specimen`), which take the picked theme as their own `data-theme`.
 *
 * With nothing picked the figures have no theme of their own and take the
 * page's, so the server's HTML is right before any script runs. Using the
 * site's light switch drops the pick, and the figures follow the page again.
 *
 * A pick is carried by the site's distortion wave, on the figures: each
 * figure in the window that takes the pick waves from its old theme to the
 * new one, starting from the dot that was clicked. The figures share the one
 * change, which the first wave to be ready makes. The wave's renderer runs
 * four at a time; a fifth figure in view just changes.
 *
 * The wrapper's `data-claude-page` marks these pages for the site's styles
 * (their accent is Clay, not the site's blue).
 */
// Counts theme picks, so only the last one's waves lower the tab row again.
let lifts = 0

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolved } = useTheme()
  const dark = resolved === "dark"
  const [picked, setPicked] = useState<ThemeId | null>(null)

  const [wasDark, setWasDark] = useState(dark)
  if (wasDark !== dark) {
    setWasDark(dark)
    setPicked(null)
  }

  const theme = picked ?? (dark ? "dark-3" : "white")

  const setTheme = (id: ThemeId, from?: React.MouseEvent) => {
    // The same look: nothing to carry.
    if (id === theme) return setPicked(id)
    let made = false
    const change = () => {
      if (made) return
      made = true
      flushSync(() => setPicked(id))
    }
    const figures = [
      ...document.querySelectorAll('[data-figure="themed"]'),
    ].filter((figure) => {
      const box = figure.getBoundingClientRect()
      return box.bottom > 0 && box.top < window.innerHeight
    })
    if (figures.length === 0) return change()
    const waves = figures.map((figure) =>
      wave(figure, change, {
        source: from?.currentTarget,
        focus: from?.nativeEvent,
      })
    )
    // The docs' tab row stays on top of the waves for as long as they play.
    const bar = document.querySelector("[data-docs-bar]")
    const turn = ++lifts
    bar?.setAttribute("data-lifted", "")
    void Promise.allSettled(waves).then(() => {
      if (turn === lifts) bar?.removeAttribute("data-lifted")
    })
  }

  return (
    <ThemeContext value={{ theme, picked, setTheme }}>
      <div data-claude-page className="contents">
        {children}
      </div>
    </ThemeContext>
  )
}

export const usePreviewTheme = () => useContext(ThemeContext)

// The topics read as chapters of one piece, with the figures leading and very
// little writing. From 1024px a group's page keeps its list of chapters in
// the left three columns (work.claude.$doc.tsx) and the chapters fill the
// nine beside it, so everything here is laid out for that nine-column box: a
// chapter's name (set by the page), then each block's name, a short note
// under it where one is needed, and its figures.

/**
 * One block of a chapter: its name and a short note, then its figures. A
 * chapter with a single block leaves the name off, since the chapter's own
 * title already says it.
 *
 * In a group whose chapters are marked `data-scaled` (Organisms), every
 * figure is a small copy of the real thing: from 1024px, where the box is
 * nine columns (642px), it is laid out at the page's full twelve (864px) and
 * drawn at 642/864 of its size. So a figure that needs the room (the site
 * header folds into a menu button below 760px, the footer stacks) shows
 * whole, and all of a group's figures are reduced by the same amount.
 */
export function Section({
  title,
  description,
  children,
}: {
  title?: string
  /** One short sentence about what is shown. */
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 pb-12">
      {title && (
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-xs text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex min-w-0 flex-col gap-4 lg:group-data-[scaled]/chapter:[zoom:0.743]">
          {children}
        </div>
        {/* The figures' caption, where they are drawn scaled down. It sits
            outside the scaled box, at the page's own size. */}
        <p className="hidden text-xs text-muted-foreground lg:group-data-[scaled]/chapter:block">
          Scaled down
        </p>
      </div>
    </section>
  )
}

/**
 * A box of the real thing: its contents use the design system's own tokens,
 * in the theme the page is wearing (or a fixed `theme`).
 */
export function Specimen({
  theme,
  className,
  children,
}: {
  /** A theme the figure always wears; otherwise the one picked for figures. */
  theme?: ThemeId
  className?: string
  children: React.ReactNode
}) {
  const { picked } = usePreviewTheme()
  return (
    <div
      // "themed" figures take the picked theme; the wave looks for them.
      data-figure={theme ? "fixed" : "themed"}
      data-theme={theme ?? picked ?? undefined}
      className={cn(
        "cds overflow-hidden rounded-[20px] outline outline-1 -outline-offset-1 outline-border",
        className
      )}
    >
      {children}
    </div>
  )
}

/** The same contents once per theme, side by side in one strip. */
export function ThemeStrip({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-figure
      className="grid grid-cols-2 overflow-hidden rounded-[20px] outline outline-1 -outline-offset-1 outline-border sm:grid-cols-3 md:grid-cols-5"
    >
      {THEMES.map(({ id, name }) => (
        <div
          key={id}
          data-theme={id}
          className="cds flex min-w-0 flex-col items-center gap-4 p-4"
        >
          <span
            className="cds-micro self-start"
            style={{ color: "var(--cds-fg-3)" }}
          >
            {name}
          </span>
          {children}
        </div>
      ))}
    </div>
  )
}

/** A labelled cell inside a specimen: what is shown, then the thing itself. */
export function Cell({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="cds-caption" style={{ color: "var(--cds-fg-3)" }}>
        {label}
      </div>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {children}
      </div>
    </div>
  )
}
