import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useFrame } from "@/components/work/claude/frame"
import { cn } from "@/lib/utils"

const STEP = 16
// A grip dragged to within this of the figure's own width takes that width:
// the figure snaps back to where it started, like a magnet.
const SNAP = 28
// The least a widened figure keeps clear of the window's edges, each side.
const EDGE = 24

/**
 * A figure's layouts, widest first: each one's name and the greatest width
 * of its contents it shows at (none for the widest).
 */
export type Sizes = Array<[name: string, upTo?: number]>

/**
 * The corner a figure takes in a layout narrower than its widest, by the
 * layout's name: a tablet's 48px, a phone's 64px; a "Narrow" or "Column"
 * layout is a phone's below 640px and a tablet's above. Desktop-like names
 * keep the figure's own corner (null).
 */
const deviceCorner = (name: string, width: number): number | null => {
  if (/mobile|phablet|phone/i.test(name)) return 64
  if (/tablet/i.test(name)) return 48
  if (/narrow|column/i.test(name)) return width < 640 ? 64 : 48
  return null
}

/**
 * Makes the figure it is in one whose width can be changed, to show a
 * responsive design at each of its sizes. It is the figure itself that is
 * resized (its frame: `FrameContext`, the box a `figure` `Specimen` is drawn
 * in): the figure stays centered where it was, with a grip on its left and
 * right borders, and dragging either narrows or widens it, both sides moving
 * together so the grip stays under the pointer. The grips are sliders: the
 * arrow keys move them, Home and End go to the narrowest and the full width.
 *
 * The widths here (`min`, `sizes`, a grip's value, the demo cursor's drags)
 * are widths of the contents, this box, not of the figure around it, which
 * is wider by its own padding: they are the widths the contents' styles
 * change at.
 *
 * A grip can also be dragged outward, past the width the figure started
 * with, as far as the window has room (the figure then reaches out of the
 * page's column on both sides). Dragged back to near its own width it snaps
 * to it. At that width the figure is fluid again, so it follows the window.
 * Where there is no room to resize in (a phone) the grips are not shown.
 * The demo cursor never widens a figure: its drags stop at the figure's own
 * width.
 *
 * The demo cursor resizes it too, through a `demo-drag` event on a grip
 * carrying the width to take (DemoCursor's `drag` step).
 *
 * Under the figure, outside it, a label names the layout showing ("Desktop", "Tablet",
 * "Mobile"): `sizes` lists the figure's own layouts, widest first, each with
 * the greatest width it shows at (none for the widest).
 */
export function Resizable({
  min = 326,
  label = "Figure width",
  sizes,
  bleed = false,
  className,
  children,
}: {
  min?: number
  label?: string
  sizes?: Sizes
  /**
   * The contents are a page, which fills a figure dragged wider than it
   * started and keeps its own content to the middle. Otherwise the contents
   * stay as wide as they were, in the middle of the wider figure.
   */
  bleed?: boolean
  /**
   * For the box of contents. It gives the box its height, which is fixed
   * from 640px (`min-h-[…] sm:h-[…]`): the figure must not grow as it is
   * narrowed, so the height is the one its tallest layout needs, with a
   * little to spare for a browser that sets the type a line longer. On a
   * phone, where nothing is resized, the box is as tall as what it holds.
   */
  className?: string
  children: React.ReactNode
}) {
  const { el: frame, setWidth: setFigureWidth, note } = useFrame()
  const box = useRef<HTMLDivElement>(null)
  // The width asked for; null is "all the room there is".
  const [width, setWidth] = useState<number | null>(null)
  // The widest the contents can be, and what the figure adds around them
  // (its padding).
  const [max, setMax] = useState(0)
  const [around, setAround] = useState(0)
  // The widest the contents can be dragged: until the figure, as drawn, is
  // nearly as wide as the window. No wider than their own width where the
  // window has no more room than that.
  const [most, setMost] = useState(0)
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => {
    const room = frame?.parentElement
    const el = box.current
    if (!frame || !room || !el) return
    const measure = () => {
      const extra = frame.offsetWidth - el.offsetWidth
      const own = room.clientWidth - extra
      // A scaled figure is drawn smaller than it is laid out.
      const scale =
        frame.getBoundingClientRect().width / (frame.offsetWidth || 1) || 1
      const windowRoom = document.documentElement.clientWidth - 2 * EDGE
      setAround(extra)
      setMax(own)
      setMost(Math.max(own, Math.floor(windowRoom / scale) - extra))
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(room)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [frame])

  // A width for the figure whose two sides both land on a whole pixel as
  // drawn, so its border and grips stay crisp at any width: the figure is
  // centered, so what it leaves each side must be a whole number of drawn
  // pixels (a scaled figure is drawn smaller than it is laid out).
  const settle = (figure: number) => {
    const room = frame?.parentElement
    if (!frame || !room) return figure
    const scale =
      frame.getBoundingClientRect().width / (frame.offsetWidth || 1) || 1
    const pair = 2 / scale
    const spare = room.clientWidth - figure
    return room.clientWidth - Math.round(spare / pair) * pair
  }

  // Takes a width for the contents, and gives the figure the width that
  // leaves them that much. A pointer's drag is pulled to the figure's own
  // width when it comes near (`magnet`); the keys step straight through it.
  const take = (next: number, magnet = false) => {
    const room = frame?.parentElement
    const full = room ? room.clientWidth - around : max
    const own = magnet
      ? Math.abs(next - full) <= SNAP
      : Math.abs(next - full) < 1
    const to = own ? null : Math.min(most, Math.max(min, Math.round(next)))
    setWidth(to)
    setFigureWidth(to === null ? null : settle(to + around))
  }

  // The demo cursor's drags.
  useEffect(() => {
    if (!frame) return
    const onDemo = (e: Event) => {
      const value = (e as CustomEvent<number>).detail
      if (typeof value !== "number") return
      const full = (frame.parentElement?.clientWidth ?? 0) - around
      const to = value >= full - 1 ? null : Math.max(min, Math.round(value))
      setWidth(to)
      if (to === null) return setFigureWidth(null)
      // As in `settle`: both sides on a whole drawn pixel.
      const room = frame.parentElement?.clientWidth ?? 0
      const scale =
        frame.getBoundingClientRect().width / (frame.offsetWidth || 1) || 1
      const pair = 2 / scale
      const spare = room - (to + around)
      setFigureWidth(room - Math.round(spare / pair) * pair)
    }
    frame.addEventListener("demo-drag", onDemo)
    return () => frame.removeEventListener("demo-drag", onDemo)
  }, [frame, min, around, setFigureWidth])

  const now = width ?? max
  const fixed = max <= min + STEP
  // The layout showing: the narrowest one the contents still fit. Before
  // the room is measured it is the widest.
  const size = sizes?.reduce(
    (found, [name, upTo]) =>
      upTo === undefined || (max > 0 && now <= upTo) ? name : found,
    sizes[0][0]
  )

  // Narrowed from its widest layout to a tablet's or a phone's, the figure
  // rounds its corners like the device (Leo, 2026-11-20): `--cds-figure-r`
  // on the frame, which the figure's box and ring read (claude-ds.css).
  const corner = size && size !== sizes?.[0][0] ? deviceCorner(size, now) : null
  useEffect(() => {
    if (!frame) return
    if (corner === null) frame.style.removeProperty("--cds-figure-r")
    else frame.style.setProperty("--cds-figure-r", `${corner}px`)
  }, [frame, corner])
  useEffect(
    () => () => {
      frame?.style.removeProperty("--cds-figure-r")
    },
    [frame]
  )

  const grip = (side: "left" | "right") => (
    <button
      type="button"
      role="slider"
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin={min}
      aria-valuemax={most}
      aria-valuenow={Math.round(now)}
      aria-valuetext={size && `${size}, ${Math.round(now)} pixels`}
      className="cds-resize-grip"
      data-side={side}
      data-dragging={dragging === side ? "" : undefined}
      data-wave-hover="off"
      data-wave-manual
      onPointerDown={(e) => {
        const el = box.current
        if (!el || !frame || e.button !== 0) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        // A scaled figure is drawn smaller than it is laid out, and the
        // pointer moves in drawn pixels.
        const scale =
          frame.getBoundingClientRect().width / (frame.offsetWidth || 1)
        const from = el.offsetWidth
        const start = e.clientX
        const sign = side === "right" ? 1 : -1
        setDragging(side)
        const target = e.currentTarget
        const move = (ev: PointerEvent) =>
          take(from + (sign * 2 * (ev.clientX - start)) / scale, true)
        const end = () => {
          setDragging(null)
          target.removeEventListener("pointermove", move)
          target.removeEventListener("pointerup", end)
          target.removeEventListener("pointercancel", end)
        }
        target.addEventListener("pointermove", move)
        target.addEventListener("pointerup", end)
        target.addEventListener("pointercancel", end)
      }}
      onKeyDown={(e) => {
        const by = e.shiftKey ? STEP * 4 : STEP
        const grow = side === "right" ? "ArrowRight" : "ArrowLeft"
        const shrink = side === "right" ? "ArrowLeft" : "ArrowRight"
        if (e.key === grow) take(now + by)
        else if (e.key === shrink) take(now - by)
        else if (e.key === "Home") take(min)
        else if (e.key === "End") take(now < max ? max : most)
        else return
        e.preventDefault()
      }}
    />
  )

  return (
    <div className="cds-resize">
      <div
        ref={box}
        className={cn("cds-resize-box", className)}
        // Wider than it started, the box pads itself by the difference, so
        // what is in it stays as wide as it was, in the middle.
        style={
          !bleed && max > 0 && now > max
            ? { paddingInline: (now - max) / 2 }
            : undefined
        }
      >
        {children}
      </div>
      {/* The layout's name goes under the figure, outside it. */}
      {size && note && createPortal(size, note)}
      {/* The grips go on the figure's own border: in its frame, which does
          not clip, and not in the box, which does. */}
      {frame &&
        !fixed &&
        createPortal(
          <>
            {grip("left")}
            {grip("right")}
          </>,
          frame
        )}
    </div>
  )
}
