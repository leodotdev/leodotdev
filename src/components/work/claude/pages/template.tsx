import { useEffect, useMemo, useRef, useState } from "react"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { RevealContext, useReveals } from "@/components/work/claude/reveal"
import { Specimen, usePreviewTheme } from "@/components/work/claude/ui"
import { cn } from "@/lib/utils"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type { ThemeId } from "@/components/work/claude/docs"
import type { Sizes } from "@/components/work/claude/resizable"

// What every template page is built in (the Templates tab: a whole page of
// the site, live, made from the organisms the other tabs document).
//
// The page fills its figure edge to edge, in a window of one height that
// scrolls inside the figure, and narrows with the figure's grips. Every
// size on a page follows the page's own width (the window is the
// container: use `cqw`, and `@container` for the phone layout), so a page
// keeps its proportions as the figure narrows. The shared styles are
// `.cds-tpl*` in src/claude-ds.css; a page's own are in
// src/claude-templates/<page>.css.

/**
 * Whether the page wears its dark themes: when the theme picked for the
 * figures is a dark one (the Templates tab offers Ivory and Dark 3). With
 * nothing picked the figures wear Ivory, so a page is light whatever the
 * site wears, as every other figure is.
 */
// (The Anthropic.com docs' dark themes are Slate and Image.)
export const useTemplateDark = () =>
  /^(dark|slate|image)/.test(usePreviewTheme().theme)

/**
 * A stretch of a page in a theme of its own: `theme` is the one it wears
 * when the figures' theme is a light one and the one when it is dark. Use it bare around the
 * header and hero, or the footer.
 */
export function TemplateBlock({
  theme,
  className,
  children,
  ...rest
}: {
  theme: [light: ThemeId, dark: ThemeId]
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const dark = useTemplateDark()
  return (
    <div
      {...rest}
      className={cn("cds", className)}
      data-theme={dark ? theme[1] : theme[0]}
    >
      {children}
    </div>
  )
}

/**
 * One section of a page: a `TemplateBlock` with the page's section padding,
 * a rule above it, and its children in a column. `tone={2}` sets it on its
 * theme's second background.
 */
export function TemplateSection({
  theme,
  tone,
  className,
  children,
}: {
  theme: [light: ThemeId, dark: ThemeId]
  tone?: 2
  className?: string
  children: React.ReactNode
}) {
  return (
    <TemplateBlock
      theme={theme}
      className={cn("cds-tpl-section", className)}
      data-tone={tone}
    >
      {children}
    </TemplateBlock>
  )
}

/**
 * The window a page scrolls in, with a scrollbar of its own, so it is plain
 * that the page is longer than the figure and scrolls inside it. Like a
 * system's it shows only while the page is scrolling, or under the pointer
 * (Leo, 2026-11-19: "only show once the demo cursor starts actually
 * scrolls"; for a few hours it always showed). The thumb can be dragged,
 * and the demo cursor drags it too: it is a scrollbar whose value is how far
 * down the page is, from 0 to 100, taken from the cursor's `demo-drag`
 * events as a `Resizable`'s grip takes a width.
 */
function TemplateWindow({ children }: { children: React.ReactNode }) {
  const win = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLButtonElement>(null)
  // How much of the page shows, and how far down it is, both from 0 to 1.
  const [bar, setBar] = useState({ size: 1, at: 0 })
  // Whether the page is scrolling, or was a moment ago.
  const [active, setActive] = useState(false)
  // The page's parts come in as they are scrolled to, as the site's do.
  useReveals(() => win.current?.firstElementChild)

  useEffect(() => {
    const el = win.current
    const handle = thumb.current
    if (!el || !handle) return
    let frame = 0
    const measure = () => {
      frame = 0
      const most = el.scrollHeight - el.clientHeight
      setBar({
        size: Math.min(1, el.clientHeight / (el.scrollHeight || 1)),
        at: most > 0 ? el.scrollTop / most : 0,
      })
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(queue)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    let idle = 0
    const onScroll = () => {
      queue()
      setActive(true)
      clearTimeout(idle)
      idle = window.setTimeout(() => setActive(false), 900)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    // The demo cursor's drags: a value from 0 to 100. They are this
    // scrollbar's alone, and go no further up (a `Resizable` listens for
    // its grips' on the figure's frame).
    const onDemo = (e: Event) => {
      e.stopPropagation()
      const value = (e as CustomEvent<number>).detail
      if (typeof value !== "number") return
      el.scrollTop = (value / 100) * (el.scrollHeight - el.clientHeight)
    }
    handle.addEventListener("demo-drag", onDemo)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(idle)
      observer.disconnect()
      el.removeEventListener("scroll", onScroll)
      handle.removeEventListener("demo-drag", onDemo)
    }
  }, [])

  return (
    <div className="cds-tpl-frame">
      <div ref={win} className="cds-tpl-window">
        {children}
      </div>
      <Edge win={win} />
      <div
        className="cds-tpl-scrollbar"
        hidden={bar.size >= 1}
        data-active={active || undefined}
      >
        <button
          ref={thumb}
          type="button"
          role="scrollbar"
          aria-label="Scroll the page"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(bar.at * 100)}
          className="cds-tpl-thumb"
          data-wave-hover="off"
          data-wave-manual
          style={{
            height: `${bar.size * 100}%`,
            top: `${bar.at * (1 - bar.size) * 100}%`,
          }}
          onPointerDown={(e) => {
            const el = win.current
            const track = e.currentTarget.parentElement
            if (!el || !track || e.button !== 0) return
            e.preventDefault()
            e.currentTarget.setPointerCapture(e.pointerId)
            const target = e.currentTarget
            // The thumb's travel, in the pixels the pointer moves in.
            const travel =
              track.getBoundingClientRect().height -
              target.getBoundingClientRect().height
            const most = el.scrollHeight - el.clientHeight
            const from = el.scrollTop
            const start = e.clientY
            const move = (ev: PointerEvent) => {
              if (travel > 0)
                el.scrollTop = from + ((ev.clientY - start) / travel) * most
            }
            const end = () => {
              target.removeEventListener("pointermove", move)
              target.removeEventListener("pointerup", end)
              target.removeEventListener("pointercancel", end)
            }
            target.addEventListener("pointermove", move)
            target.addEventListener("pointerup", end)
            target.addEventListener("pointercancel", end)
          }}
        />
      </div>
    </div>
  )
}

/** A stretch of the figure's edge, from the top of its ring's layer, in px. */
type Band = { top: number; bottom: number; color: string }

/**
 * A themed box's ring color: its theme's `--cds-border-2`, which both
 * systems' themes set (an `.ads` theme's ring is the same color). Not
 * `--cds-ring`, which the page's root also sets, for the site's own theme,
 * so a `.cds` box inherits that one rather than its theme's.
 */
const ringOf = (el: Element) =>
  getComputedStyle(el).getPropertyValue("--cds-border-2").trim()

/**
 * The figure's edge, drawn here in the colors of the page under it (Leo,
 * 2026-11-20: the light edge ran down the sides and across the foot of the
 * dark footer). A page's sections each wear a theme of their own, so where
 * one that spans the window lies against the edge, the edge there is in its
 * theme's ring color, and the rest is in the figure's own; as the page
 * scrolls, the bands move with it. Each band is the figure's ring
 * (`.cds-ring` in src/claude-ds.css, whose own ring is then hidden) cut to
 * its stretch (`.cds-tpl-edge`). Until it has measured, the figure's own
 * ring shows.
 */
function Edge({ win }: { win: React.RefObject<HTMLDivElement | null> }) {
  const [bands, setBands] = useState<Array<Band> | null>(null)
  useEffect(() => {
    const el = win.current
    const box = el?.closest<HTMLElement>("[data-figure]")
    if (!el || !box) return
    let frame = 0
    let last = ""
    const measure = () => {
      frame = 0
      const outer = box.getBoundingClientRect()
      const height = box.offsetHeight
      // The figure is drawn scaled; the bands are in its own pixels.
      const scale = outer.height / (height || 1)
      const view = el.getBoundingClientRect()
      // The ring's layer reaches 2px past the box on every side.
      const end = height + 4
      let list: Array<Band> = [{ top: 0, bottom: end, color: ringOf(box) }]
      const paint = (top: number, bottom: number, color: string) => {
        const next: Array<Band> = []
        for (const band of list) {
          if (band.top < top)
            next.push({ ...band, bottom: Math.min(band.bottom, top) })
          if (band.bottom > bottom)
            next.push({ ...band, top: Math.max(band.top, bottom) })
        }
        next.push({ top, bottom, color })
        list = next.sort((a, b) => a.top - b.top)
      }
      // In the page's order, so a section inside another paints over it.
      // Only a section that is showing and lies across the whole window
      // counts: the header's menu, folded on a phone, is a full-width Slate
      // sheet kept hidden and moved off to the right while it is closed.
      for (const block of el.querySelectorAll("[data-theme]")) {
        const rect = block.getBoundingClientRect()
        if (rect.left > view.left + 1 || rect.right < view.right - 1) continue
        // (Safari before 17.4 has no `checkVisibility`.)
        const showing =
          "checkVisibility" in block
            ? block.checkVisibility({ visibilityProperty: true })
            : getComputedStyle(block).visibility !== "hidden"
        if (!showing) continue
        const top = Math.max(rect.top, view.top)
        const bottom = Math.min(rect.bottom, view.bottom)
        if (bottom <= top) continue
        // A section at the window's top or foot takes the corners too.
        paint(
          top <= view.top + 0.5 ? 0 : (top - outer.top) / scale + 2,
          bottom >= view.bottom - 0.5 ? end : (bottom - outer.top) / scale + 2,
          ringOf(block)
        )
      }
      const merged: Array<Band> = []
      for (const band of list) {
        const prev = merged.at(-1)
        if (band.bottom - band.top < 0.01) continue
        if (prev && prev.color === band.color) prev.bottom = band.bottom
        else merged.push({ ...band })
      }
      const key = JSON.stringify(merged)
      if (key === last) return
      last = key
      setBands(merged)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    el.addEventListener("scroll", queue, { passive: true })
    // The page's size, the figure's width, and the theme picked.
    const sizes = new ResizeObserver(queue)
    sizes.observe(el)
    if (el.firstElementChild) sizes.observe(el.firstElementChild)
    // The theme picked, and a themed sheet opening or closing (the header's
    // menu), measured again when its slide in or out has ended.
    const themes = new MutationObserver(queue)
    themes.observe(box, {
      attributes: true,
      attributeFilter: ["data-theme", "data-open"],
      subtree: true,
    })
    const slid = (e: TransitionEvent) => {
      if (e.target instanceof Element && e.target.matches("[data-theme]"))
        queue()
    }
    el.addEventListener("transitionend", slid)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("scroll", queue)
      el.removeEventListener("transitionend", slid)
      sizes.disconnect()
      themes.disconnect()
    }
  }, [win])

  if (!bands) return null
  return (
    <div className="cds-tpl-edge" aria-hidden>
      {bands.map((band) => (
        <span
          key={band.top}
          style={
            {
              "--edge": band.color,
              clipPath: `inset(${band.top}px 0 calc(100% - ${band.bottom}px) 0)`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

const GRIP = ".cds-resize-grip"
const THUMB = ".cds-tpl-thumb"
// Something on the page to rest on, wherever the page has been scrolled to:
// the cursor takes the first link or button in sight.
// (The Anthropic.com templates' header is `.ads-nav`.)
const LOOK = ".cds-tpl :is(a, button):not(:is(.cds-nav, .ads-nav) *)"
// The site's own header is left alone on a template (Leo, 2026-11-19: "no
// point interacting with it, it's about showcasing the current page"): a
// page's step that goes to it is dropped, and so is nothing in it looked at.
const inHeader = (step: DemoStep) =>
  /\.[ac]ds-nav\b|\.[ac]ds-nav-/.test(step.on)
// A deck of marginalia in sight is gone through: on a card, and back.
const DECK: Array<DemoStep> = [
  { on: '.cds-deck [aria-label="Next"]', click: true, rest: 500 },
  { on: ".cds-deck-slide[data-active]", rest: 700 },
  { on: '.cds-deck [aria-label="Previous"]', click: true, rest: 400 },
]

/**
 * What the demo cursor does on a template page, around the page's own
 * steps (Leo, 2026-11-19: "scroll down, resize, scroll up, while also
 * interacting with the page"). It tries the page's own things at the top;
 * pulls the scrollbar down the page, stopping to look at what comes into
 * sight and to go through a deck of marginalia that has; narrows the page to a tablet and a phone; pulls the scrollbar back
 * up; tries the page's things again at a phone's width; and lets the page
 * out again. A page's steps are its own things only, the ones before its
 * first grip step for the wide page and the ones after for the narrow one;
 * the grip steps themselves are these.
 */
const around = (steps: Array<DemoStep>): Array<DemoStep> => {
  const own = steps.filter((step) => !inHeader(step))
  const first = own.findIndex((step) => step.on === GRIP)
  const wide = first < 0 ? own : own.slice(0, first)
  const narrow =
    first < 0 ? [] : own.slice(first).filter((step) => step.on !== GRIP)
  return [
    // Back to the top, if a visitor left the page part-way down.
    { on: THUMB, drag: 0 },
    ...wide,
    { on: THUMB, drag: 30 },
    { on: LOOK, rest: 800 },
    ...DECK,
    { on: THUMB, drag: 65 },
    { on: LOOK, nth: 1, rest: 800 },
    ...DECK,
    { on: GRIP, nth: 1, drag: 760 },
    { on: LOOK, rest: 700 },
    { on: GRIP, nth: 1, drag: 390 },
    { on: LOOK, nth: 1, rest: 700 },
    { on: THUMB, drag: 30 },
    { on: LOOK, rest: 800 },
    { on: THUMB, drag: 0 },
    ...narrow,
    { on: GRIP, nth: 1, drag: 4000 },
  ]
}

/**
 * The figure a template page is shown in: resizable, 900px tall, the page
 * scrolling inside it. `steps` are the demo cursor's for this page's own
 * things; the scrolling and the resizing around them are `around`'s.
 */
export function TemplateFigure({
  steps,
  sizes = [["Desktop"], ["Tablet", 900], ["Mobile", 760]],
  children,
}: {
  steps: Array<DemoStep>
  sizes?: Sizes
  children: React.ReactNode
}) {
  const sequence = useMemo(() => around(steps), [steps])
  return (
    <Specimen figure>
      {/* The page fills the figure, edge to edge. */}
      <DemoCursor steps={sequence}>
        <Resizable
          label="Page width"
          min={390}
          bleed
          sizes={sizes}
          className="h-[900px]"
        >
          <TemplateWindow>
            <RevealContext value>
              <div
                className="cds-tpl"
                // The links and buttons are for show: none goes anywhere.
                onClick={(e) => {
                  if ((e.target as Element).closest("a")) e.preventDefault()
                }}
              >
                {children}
              </div>
            </RevealContext>
          </TemplateWindow>
        </Resizable>
      </DemoCursor>
    </Specimen>
  )
}
