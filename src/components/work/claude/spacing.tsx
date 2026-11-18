import { useEffect, useRef, useSyncExternalStore } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// The docs' spacing view: in every figure (`[data-figure]`), the components'
// elements are outlined, their padding is hatched in blue and the gaps and
// margins inside them in Clay, the way a design tool marks them. It covers the figures only, unlike the
// site's own layout overlay (GridSwitcher), which outlines the whole page.

let on = false
const listeners = new Set<() => void>()
const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => void listeners.delete(notify)
}
const setOn = (next: boolean) => {
  on = next
  listeners.forEach((notify) => notify())
}
const useSpacing = () =>
  useSyncExternalStore(
    subscribe,
    () => on,
    () => false
  )

/**
 * The switch for the spacing view, beside the theme dots. It is the same 20px
 * dot with a 40px hit area as the site's grid switch (GridSwitcher), in the
 * same blue, filled with the diagonal lines the view draws.
 */
export function SpacingToggle() {
  const active = useSpacing()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="Show spacing"
            aria-pressed={active}
            data-wave-manual
            data-wave-hover="off"
            onClick={() => setOn(!active)}
            className="relative h-5 w-5 shrink-0 rounded-full border-[1.5px] border-grid [corner-shape:round] before:absolute before:-inset-2.5 before:content-['']"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--color-grid) 0 1.5px, transparent 1.5px 4.5px)",
            }}
          />
        }
      />
      <TooltipContent>Spacing</TooltipContent>
    </Tooltip>
  )
}

type Box = {
  x: number
  y: number
  w: number
  h: number
  /** The length in the design's own pixels, before a figure is scaled. */
  value: number
  kind: "pad" | "gap"
  /** The direction the length runs in. */
  axis: "x" | "y"
}

// The view's two colors come from the system's palette: its switch blue for
// padding, and Clay for the gaps and margins between things.
const TOKEN = { pad: "--cds-switch-blue", gap: "--cds-clay" } as const
// Text styles and the docs' own helpers: `cds-` classes that are not components.
const NOT_A_COMPONENT = /^cds-(display|headline|body|caption|micro|art|demo)/
const px = (value: string) => parseFloat(value) || 0

/**
 * Every strip of padding, gap and margin inside the components shown in the
 * figures near the window. Only the design system's own parts count (an
 * element with a `cds-` component class, and what is inside it): the figure's
 * padding and the gaps the docs lay the components out with are left out.
 */
function measure(): { boxes: Array<Box>; edges: Array<Edge> } {
  const boxes = new Map<string, Box>()
  const edges: Array<Edge> = []
  for (const figure of document.querySelectorAll<HTMLElement>(
    "[data-figure]"
  )) {
    const frame = figure.getBoundingClientRect()
    if (frame.width < 1 || frame.bottom < -200) continue
    if (frame.top > window.innerHeight + 200) continue
    // A scaled figure is drawn smaller than it is laid out.
    const scale = frame.width / (figure.offsetWidth || frame.width)

    // What an element may draw into: its clipping ancestors, up to the figure.
    const clips = new Map<Element, Rect>()
    const clipOf = (el: Element): Rect => {
      if (el === figure) return frame
      const known = clips.get(el)
      if (known) return known
      const parent = el.parentElement ?? figure
      let clip = clipOf(parent)
      if (
        parent !== figure &&
        getComputedStyle(parent).overflow !== "visible"
      ) {
        const inside = cut(parent.getBoundingClientRect(), clip)
        clip = { x: inside.x, y: inside.y, width: inside.w, height: inside.h }
      }
      clips.set(el, clip)
      return clip
    }
    const add = (
      el: Element,
      kind: Box["kind"],
      axis: Box["axis"],
      value: number,
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      const box = cut({ x, y, width: w, height: h }, clipOf(el))
      if (box.w < 0.5 || box.h < 0.5) return
      const key = kind + [box.x, box.y, box.w, box.h].map(Math.round).join()
      boxes.set(key, { ...box, kind, axis, value })
    }

    const parts = new Map<Element, boolean>()
    const inComponent = (el: Element): boolean => {
      if (el === figure) return false
      const known = parts.get(el)
      if (known !== undefined) return known
      const part =
        [...el.classList].some(
          (name) => name.startsWith("cds-") && !NOT_A_COMPONENT.test(name)
        ) || inComponent(el.parentElement ?? figure)
      parts.set(el, part)
      return part
    }

    for (const el of figure.querySelectorAll<HTMLElement>("*")) {
      if (!(el instanceof HTMLElement) || !inComponent(el)) continue
      const r = el.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) continue
      if (r.bottom < frame.top || r.top > frame.bottom) continue
      const cs = getComputedStyle(el)
      if (cs.display === "contents" || cs.visibility === "hidden") continue
      // The element's own outline, as far as it shows.
      const edge = cut(r, clipOf(el))
      if (edge.w > 0.5 && edge.h > 0.5) edges.push(edge)

      const bt = px(cs.borderTopWidth) * scale
      const br = px(cs.borderRightWidth) * scale
      const bb = px(cs.borderBottomWidth) * scale
      const bl = px(cs.borderLeftWidth) * scale
      const pt = px(cs.paddingTop)
      const pr = px(cs.paddingRight)
      const pb = px(cs.paddingBottom)
      const pl = px(cs.paddingLeft)
      // The padding box, then the content box inside it.
      const x0 = r.left + bl
      const y0 = r.top + bt
      const w0 = r.width - bl - br
      const h0 = r.height - bt - bb
      const cx = x0 + pl * scale
      const cy = y0 + pt * scale
      const cw = w0 - (pl + pr) * scale
      const ch = h0 - (pt + pb) * scale

      if (pt) add(el, "pad", "y", pt, x0, y0, w0, pt * scale)
      if (pb) add(el, "pad", "y", pb, x0, cy + ch, w0, pb * scale)
      if (pl) add(el, "pad", "x", pl, x0, cy, pl * scale, ch)
      if (pr) add(el, "pad", "x", pr, cx + cw, cy, pr * scale, ch)

      // Margins above and below. One set to `auto` is leftover room, not a
      // measurement, and only the typed style map can tell: without it
      // (Firefox) margins are left out.
      const typed = "computedStyleMap" in el ? el.computedStyleMap() : undefined
      if (typed) {
        for (const side of ["top", "bottom"] as const) {
          const margin = typed.get(`margin-${side}`)
          if (!margin || String(margin) === "auto") continue
          const m = px(cs.getPropertyValue(`margin-${side}`))
          if (m <= 0) continue
          const y = side === "top" ? r.top - m * scale : r.bottom
          add(el, "gap", "y", m, r.left, y, r.width, m * scale)
        }
      }

      // Gaps between the children of a flex or grid box.
      if (!/flex|grid/.test(cs.display)) continue
      const rowGap = px(cs.rowGap)
      const columnGap = px(cs.columnGap)
      if (!rowGap && !columnGap) continue

      // A grid reports its tracks, so its gutters are drawn from those: the
      // whole length of the box, between each track and the next.
      if (cs.display.includes("grid")) {
        const tracks = (list: string) =>
          list.split(" ").map(parseFloat).filter(Number.isFinite)
        let x = cx
        for (const track of tracks(cs.gridTemplateColumns).slice(0, -1)) {
          x += track * scale
          if (columnGap)
            add(el, "gap", "x", columnGap, x, cy, columnGap * scale, ch)
          x += columnGap * scale
        }
        let y = cy
        for (const track of tracks(cs.gridTemplateRows).slice(0, -1)) {
          y += track * scale
          if (rowGap) add(el, "gap", "y", rowGap, cx, y, cw, rowGap * scale)
          y += rowGap * scale
        }
        continue
      }

      // A flex box does not, so its gaps are found between neighbors that
      // sit exactly a gap apart.
      const rects = [...el.children]
        .map((child) => child.getBoundingClientRect())
        .filter((c) => c.width > 0 && c.height > 0)
      for (let i = 0; i < rects.length - 1; i++) {
        const before = rects[i]
        const after = rects[i + 1]
        const dx = after.left - before.right
        const dy = after.top - before.bottom
        const beside = before.top < after.bottom && after.top < before.bottom
        if (columnGap && beside && Math.abs(dx - columnGap * scale) < 1)
          add(el, "gap", "x", columnGap, before.right, cy, dx, ch)
        else if (rowGap && Math.abs(dy - rowGap * scale) < 1)
          add(el, "gap", "y", rowGap, cx, before.bottom, cw, dy)
      }
    }
  }
  return { boxes: [...boxes.values()], edges }
}

type Rect = { x: number; y: number; width: number; height: number }
/** An element's outline. */
type Edge = { x: number; y: number; w: number; h: number }

/** The part of a rectangle inside a clip. */
function cut(r: Rect, clip: Rect) {
  const x = Math.max(r.x, clip.x)
  const y = Math.max(r.y, clip.y)
  const w = Math.min(r.x + r.width, clip.x + clip.width) - x
  const h = Math.min(r.y + r.height, clip.y + clip.height) - y
  return { x, y, w, h }
}

/** A tile of diagonal lines, to fill a strip with. */
function hatch(ctx: CanvasRenderingContext2D, color: string, ratio: number) {
  const size = 5
  const tile = document.createElement("canvas")
  tile.width = tile.height = size * ratio
  const t = tile.getContext("2d")
  if (!t) return color
  t.scale(ratio, ratio)
  t.strokeStyle = color
  t.globalAlpha = 0.8
  t.lineWidth = 1
  for (const offset of [-size, 0, size]) {
    t.beginPath()
    t.moveTo(offset, size)
    t.lineTo(offset + size, 0)
    t.stroke()
  }
  const pattern = ctx.createPattern(tile, "repeat")
  pattern?.setTransform(new DOMMatrix().scale(1 / ratio))
  return pattern ?? color
}

/**
 * Draws the spacing view on one canvas that covers the window, under the
 * docs' tab row. The strips are measured again whenever something could have
 * moved them (a scroll, a resize, a click, a change in the page), and drawn
 * in the page's coordinates so the hatching travels with the page.
 *
 * A strip's length is written on it while the pointer is over it. Where
 * nothing hovers (a phone), every strip with room for its number shows it.
 */
export function SpacingOverlay() {
  const active = useSpacing()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!active || !canvas || !ctx) return

    const touch = window.matchMedia("(hover: none)")
    const tokens = getComputedStyle(document.documentElement)
    const color = {
      pad: tokens.getPropertyValue(TOKEN.pad).trim() || "#2c84db",
      gap: tokens.getPropertyValue(TOKEN.gap).trim() || "#d97757",
    }
    let boxes: Array<Box> = []
    let edges: Array<Edge> = []
    let stale = true
    let frame = 0
    let pointer: { x: number; y: number } | null = null
    let ratio = 0
    let fills: Record<Box["kind"], string | CanvasPattern> = {
      pad: "",
      gap: "",
    }

    const label = (box: Box) => {
      const text = String(Math.round(box.value))
      ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif"
      const w = ctx.measureText(text).width + 8
      const x = box.x + box.w / 2
      const y = box.y + box.h / 2
      ctx.fillStyle = color[box.kind]
      // A line across the strip, the way the length runs.
      if (box.axis === "x") ctx.fillRect(box.x, y - 0.5, box.w, 1)
      else ctx.fillRect(x - 0.5, box.y, 1, box.h)
      ctx.beginPath()
      ctx.roundRect(x - w / 2, y - 7, w, 14, 3)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, x, y + 0.5)
    }

    const draw = () => {
      frame = 0
      const next = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      if (
        next !== ratio ||
        canvas.width !== w * next ||
        canvas.height !== h * next
      ) {
        ratio = next
        canvas.width = w * ratio
        canvas.height = h * ratio
        fills = {
          pad: hatch(ctx, color.pad, ratio),
          gap: hatch(ctx, color.gap, ratio),
        }
      }
      if (stale) {
        // Kept in page coordinates, so a scroll only needs a redraw.
        const found = measure()
        const onPage = <T extends Edge>(box: T): T => ({
          ...box,
          x: box.x + window.scrollX,
          y: box.y + window.scrollY,
        })
        boxes = found.boxes.map(onPage)
        edges = found.edges.map(onPage)
        stale = false
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.translate(-window.scrollX, -window.scrollY)
      // Every element's outline, hairline, under the strips.
      ctx.strokeStyle = color.pad
      ctx.globalAlpha = 0.6
      ctx.lineWidth = 0.5
      for (const edge of edges) ctx.strokeRect(edge.x, edge.y, edge.w, edge.h)
      ctx.globalAlpha = 1
      for (const box of boxes) {
        ctx.fillStyle = fills[box.kind]
        ctx.fillRect(box.x, box.y, box.w, box.h)
      }
      if (touch.matches) {
        for (const box of boxes) if (box.w >= 22 && box.h >= 16) label(box)
      } else if (pointer) {
        const x = pointer.x + window.scrollX
        const y = pointer.y + window.scrollY
        // The smallest strip under the pointer.
        let hit: Box | null = null
        for (const box of boxes) {
          if (x < box.x || x > box.x + box.w) continue
          if (y < box.y || y > box.y + box.h) continue
          if (!hit || box.w * box.h < hit.w * hit.h) hit = box
        }
        if (hit) label(hit)
      }
    }
    const redraw = () => {
      frame ||= requestAnimationFrame(draw)
    }
    const remeasure = () => {
      stale = true
      redraw()
    }
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
      redraw()
    }
    const onLeave = () => {
      pointer = null
      redraw()
    }

    // Anything in the page changing (a menu opening, a theme, a tab) can move
    // a strip. The canvas sits outside <main>, so drawing does not count.
    const observer = new MutationObserver(remeasure)
    const main = document.querySelector("main")
    if (main)
      observer.observe(main, {
        subtree: true,
        childList: true,
        attributes: true,
      })
    observer.observe(document.documentElement, { attributes: true })
    const resize = new ResizeObserver(remeasure)
    if (main) resize.observe(main)

    window.addEventListener("scroll", remeasure, { passive: true })
    window.addEventListener("resize", remeasure)
    document.addEventListener("transitionend", remeasure)
    document.addEventListener("pointermove", onMove)
    document.documentElement.addEventListener("pointerleave", onLeave)
    remeasure()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener("scroll", remeasure)
      window.removeEventListener("resize", remeasure)
      document.removeEventListener("transitionend", remeasure)
      document.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-10 h-full w-full",
        !active && "hidden"
      )}
    />
  )
}
