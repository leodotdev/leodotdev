import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
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

// The topics read as chapters of one piece, with the figures leading. From
// 1024px a group's page keeps its list of chapters in the left three columns
// (work.claude.$doc.tsx) and the chapters fill the nine beside it, so
// everything here is laid out for that nine-column box: a chapter's name (set
// by the page), then each block's name and its figures, each figure with a
// caption under it.

/**
 * One block of a chapter: its name, then its figures. A chapter with a single
 * block leaves the name off, since the chapter's own title already says it.
 */
export function Section({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 pb-12">
      {title && <h3 className="font-medium">{title}</h3>}
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </section>
  )
}

/**
 * A figure and its caption. Every figure is a small copy of the real thing:
 * from 1024px it is laid out a quarter wider than its box (1080px for the
 * page's twelve columns, 864px) and drawn at 80% of its size. So a figure
 * that needs the room (the site header folds into a menu button below 760px,
 * the footer stacks) shows whole, and all figures are reduced by the same
 * amount. The caption sits outside the scaled box, at the page's own size.
 *
 * `Specimen` and `ThemeStrip` wrap themselves in one when given a `caption`;
 * use it directly around a figure made of several boxes, one with a demo
 * cursor outside its box, or one that has no caption (it is still scaled).
 */
export function Figure({
  caption,
  children,
}: {
  /** One line on how it was built. A figure may go without. */
  caption?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-2">
      <Scaled>{children}</Scaled>
      {caption && (
        <figcaption className="text-xs text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// How much smaller a figure is drawn from 1024px. (The class in `Scaled`
// that shrinks the page as first served has the same number.)
const SCALE = 0.8

/**
 * The box that draws a figure smaller. The page arrives from the server with
 * the figure shrunk by CSS `zoom`, which needs no script. Once the page is
 * running, the figure is shrunk with a transform instead, in a box given the
 * shrunken height. Zoom is not kept because Safari measures a zoomed box for
 * its container queries after the zoom, where Chrome measures it before: in
 * Safari every figure thought it was three quarters as wide as it is laid
 * out, and the footer, the header and the cards showed their narrow layouts.
 * A transform changes no measurements, so both browsers agree.
 */
function Scaled({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  // The shrunken height, once measured; until then (and below 1024px, where
  // figures are full size) the box is as tall as what it holds.
  const [height, setHeight] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const wide = window.matchMedia("(min-width: 1024px)")
    const measure = () =>
      setHeight(wide.matches ? el.offsetHeight * SCALE : null)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    wide.addEventListener("change", measure)
    return () => {
      observer.disconnect()
      wide.removeEventListener("change", measure)
    }
  }, [])
  return (
    <div className="min-w-0" style={height === null ? undefined : { height }}>
      <div
        ref={inner}
        className={height === null ? "min-w-0 lg:[zoom:0.8]" : "min-w-0"}
        style={
          height === null
            ? undefined
            : {
                width: `${100 / SCALE}%`,
                transform: `scale(${SCALE})`,
                transformOrigin: "0 0",
              }
        }
      >
        {children}
      </div>
    </div>
  )
}

/**
 * A box of the real thing: its contents use the design system's own tokens,
 * in the theme the page is wearing (or a fixed `theme`).
 */
export function Specimen({
  theme,
  caption,
  className,
  children,
}: {
  /** A theme the figure always wears; otherwise the one picked for figures. */
  theme?: ThemeId
  /** Makes the box a figure of its own, with this under it. */
  caption?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  const { picked } = usePreviewTheme()
  const box = (
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
  return caption ? <Figure caption={caption}>{box}</Figure> : box
}

/** The same contents once per theme, side by side in one strip. */
export function ThemeStrip({
  caption,
  children,
}: {
  /** Makes the strip a figure of its own, with this under it. */
  caption?: React.ReactNode
  children: React.ReactNode
}) {
  const strip = (
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
  return caption ? <Figure caption={caption}>{strip}</Figure> : strip
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
