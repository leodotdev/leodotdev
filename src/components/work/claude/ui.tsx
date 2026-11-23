import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { THEMES } from "@/components/work/claude/docs"
import { FrameContext } from "@/components/work/claude/frame"
import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"
import { wave } from "@/lib/wave"
import type { ThemeId } from "@/components/work/claude/docs"

// Shared pieces of the design system pages: the theme their figures wear, and
// the page furniture (chapter opening, block, figure box, captions).

/** A theme a system's figures can wear: its id (`data-theme`) and name. */
export type DocsTheme = { readonly id: string; readonly name: string }

const ThemeContext = createContext<{
  /** The theme the figures show: the one picked, or else Ivory. */
  theme: string
  /** The theme picked for the figures, if one has been. */
  picked: string | null
  /** Picks a theme. `from` is the click that asked, where the wave starts. */
  setTheme: (theme: string, from?: React.MouseEvent) => void
  /**
   * The class that scopes a design system's tokens and components: `cds`
   * for the Claude.com docs, `ads` for the Anthropic.com ones. Every figure
   * box carries it.
   */
  scope: string
  /** The system's themes, in the order its dots show them. */
  themes: ReadonlyArray<DocsTheme>
}>({
  theme: "ivory",
  picked: null,
  setTheme: () => {},
  scope: "cds",
  themes: THEMES,
})

/**
 * The theme of the docs' figures. The page itself always wears the site's
 * own theme (White, or Dark 3 in dark mode) and its light switch; the five
 * dots in the docs' tab row only change what is inside the figures
 * (`Specimen`), which take the picked theme as their own `data-theme`.
 *
 * With nothing picked the figures wear Ivory, the system's default theme,
 * whatever the page is wearing (Leo, 2026-11-19: "ivory should always be the
 * default"). Using the site's light switch drops the pick, back to Ivory.
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

export function ThemeProvider({
  scope = "cds",
  themes = THEMES,
  children,
}: {
  /** The class that scopes the system's tokens (see `ThemeContext`). */
  scope?: string
  themes?: ReadonlyArray<DocsTheme>
  children: React.ReactNode
}) {
  const { resolved } = useTheme()
  const dark = resolved === "dark"
  const [picked, setPicked] = useState<string | null>(null)

  const [wasDark, setWasDark] = useState(dark)
  if (wasDark !== dark) {
    setWasDark(dark)
    setPicked(null)
  }

  // Ivory, the system's own default theme, until another is picked.
  const theme = picked ?? "ivory"

  const setTheme = (id: string, from?: React.MouseEvent) => {
    // The same look: nothing to carry.
    if (id === theme) return setPicked(id)
    let made = false
    const change = () => {
      if (made) return
      made = true
      flushSync(() => setPicked(id))
    }
    // A figure of a fixed theme with a part that wears the pick (the
    // footer's, whose page end above it does) takes the wave too.
    const figures = [
      ...document.querySelectorAll(
        '[data-figure="themed"], [data-figure="fixed"]:has([data-picked-theme])'
      ),
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
    <ThemeContext value={{ theme, picked, setTheme, scope, themes }}>
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
// by the page), then each block's name, the caption under that name, and its
// figures. The writing is all under titles; a figure has none of its own.

/**
 * One block of a chapter: its name, a caption under the name, then its
 * figures. The caption is the block's whole text (Leo, 2026-11-19: captions
 * under titles only, none under figures), so it speaks for every figure in
 * the block. A chapter with a single block leaves the name off, since the
 * chapter's own title already says it; its caption then tucks up under the
 * chapter's own line, as a second line of it.
 */
export function Section({
  title,
  caption,
  children,
}: {
  title?: string
  caption?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 pb-12">
      {(title || caption) && (
        <div className={cn("flex flex-col gap-1", !title && "-mt-5")}>
          {title && <h3 className="font-medium">{title}</h3>}
          {caption && (
            <p className="max-w-cols-11 text-xs text-pretty text-muted-foreground">
              {caption}
            </p>
          )}
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </section>
  )
}

/**
 * A figure. Every figure is a small copy of the real thing: from 1024px it
 * is laid out a quarter wider than its box (1080px for the page's twelve
 * columns, 864px) and drawn at 80% of its size. So a figure that needs the
 * room (the site header folds into a menu button below 760px, the footer
 * stacks) shows whole, and all figures are reduced by the same amount.
 *
 * `Specimen` and `ThemeStrip` wrap themselves in one when marked `figure`;
 * use it directly around a figure made of several boxes or one with a demo
 * cursor outside its box.
 */
export function Figure({
  note,
  children,
}: {
  /** Takes the element under the figure where a line about it can go. */
  note?: (el: HTMLDivElement | null) => void
  children: React.ReactNode
}) {
  return (
    // (Relative: a demo cursor's notes are drawn in it, over and beside
    // the figure: figure-notes.tsx.)
    <figure className="relative m-0 min-w-0">
      <Scaled>{children}</Scaled>
      {/* Under the figure, centered, at the page's own size: the name of
          the layout a resizable figure is showing. Nothing while empty. */}
      {note && (
        <div
          ref={note}
          className="mt-2 text-center text-xs text-muted-foreground empty:hidden"
        />
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
  // The shrunken height, once measured, and the height it is shrunk from;
  // until then (and below 1024px, where figures are full size) the box is
  // as tall as what it holds.
  const [size, setSize] = useState<{ from: number; to: number } | null>(null)
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const wide = window.matchMedia("(min-width: 1024px)")
    const measure = (entries?: Array<ResizeObserverEntry>) => {
      // The height as laid out, to a fraction of a pixel (`offsetHeight`
      // is rounded), which the observer reports.
      const from = entries?.[0]?.borderBoxSize[0]?.blockSize ?? el.offsetHeight
      // A whole number of pixels, so what follows starts on one: a chapter's
      // rule then meets the bar's line exactly when the page stops on it.
      const to = Math.round(from * SCALE)
      setSize((now) =>
        !wide.matches || !from
          ? null
          : now?.from === from && now.to === to
            ? now
            : { from, to }
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    const onWide = () => measure()
    wide.addEventListener("change", onWide)
    return () => {
      observer.disconnect()
      wide.removeEventListener("change", onWide)
    }
  }, [])
  return (
    <div
      className="min-w-0"
      style={size === null ? undefined : { height: size.to }}
    >
      <div
        ref={inner}
        // A line of `--cds-hair` is one pixel wide once the figure is drawn
        // at its scale (1px / 0.8), so the figure's border and grips are
        // crisp. `--cds-unscale` is the same as a number, for what must be
        // drawn at its true size inside the figure (the demo cursor).
        className={cn(
          "min-w-0 lg:[--cds-hair:1.25px] lg:[--cds-unscale:1.25]",
          size === null && "lg:[zoom:0.8]"
        )}
        style={
          size === null
            ? undefined
            : {
                width: `${100 / SCALE}%`,
                // Down the page the figure is shrunk to exactly its whole
                // number of pixels (a hair off the scale, under a
                // thousandth), so its bottom edge is drawn on a pixel as
                // its other three are.
                transform: `scale(${SCALE}, ${size.to / size.from})`,
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
 *
 * As a figure of its own (`figure`) the box sits in a frame of its
 * exact size that does not clip (`FrameContext`). A `Resizable` inside
 * narrows that frame, so it is the figure itself that is resized, with the
 * grips on its border; the demo cursor is drawn in the frame too, so it can
 * reach them.
 */
export function Specimen({
  theme,
  figure,
  className,
  children,
}: {
  /** A theme the figure always wears; otherwise the one picked for figures. */
  theme?: ThemeId | (string & {})
  /** Makes the box a figure of its own (scaled, and in a frame). */
  figure?: boolean
  className?: string
  children: React.ReactNode
}) {
  const { theme: current, scope } = usePreviewTheme()
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  // A width of its own, when a `Resizable` inside has narrowed the figure.
  const [width, setWidth] = useState<number | null>(null)
  const [note, setNote] = useState<HTMLDivElement | null>(null)
  const frame = useMemo(() => ({ el, setWidth, note }), [el, note])
  const box = (
    <div
      // "themed" figures take the picked theme; the wave looks for them.
      data-figure={theme ? "fixed" : "themed"}
      data-theme={theme ?? current}
      className={cn(
        // Ringed in its own theme's border color, as the theme dots are, so
        // a dark figure has a dark theme's edge whatever the page wears
        // (`.cds-ring` in src/claude-ds.css: a ring just inside the box's
        // edge, on a layer over its contents).
        scope,
        "cds-ring relative isolate overflow-hidden rounded-[var(--cds-figure-r,20px)]",
        className
      )}
    >
      {children}
    </div>
  )
  return figure ? (
    <Figure note={setNote}>
      <div
        ref={setEl}
        className="cds-frame"
        // A width of its own is centered on the figure's place, and may
        // be wider than it: the figure then reaches out both sides.
        style={
          width === null
            ? undefined
            : {
                width,
                maxWidth: "none",
                marginLeft: `calc(50% - ${width / 2}px)`,
              }
        }
      >
        <FrameContext value={frame}>{box}</FrameContext>
      </div>
    </Figure>
  ) : (
    box
  )
}

/** The same contents once per theme, side by side in one strip. */
export function ThemeStrip({
  figure,
  children,
}: {
  /** Makes the strip a figure of its own (scaled). */
  figure?: boolean
  children: React.ReactNode
}) {
  const { scope, themes } = usePreviewTheme()
  const strip = (
    <div
      data-figure
      className="cds-ring relative isolate grid grid-cols-2 overflow-hidden rounded-[20px] [--cds-ring:var(--color-border)] sm:grid-cols-3 md:grid-cols-5"
    >
      {themes.map(({ id, name }) => (
        <div
          key={id}
          data-theme={id}
          className={cn(scope, "flex min-w-0 flex-col items-center gap-4 p-4")}
        >
          <span
            className={cn(`${scope}-micro`, "self-start")}
            style={{ color: "var(--cds-fg-3)" }}
          >
            {name}
          </span>
          {children}
        </div>
      ))}
    </div>
  )
  return figure ? <Figure>{strip}</Figure> : strip
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
      <div
        className={`${usePreviewTheme().scope}-caption`}
        style={{ color: "var(--cds-fg-3)" }}
      >
        {label}
      </div>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {children}
      </div>
    </div>
  )
}
