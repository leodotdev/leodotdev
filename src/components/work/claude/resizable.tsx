import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const STEP = 16

/**
 * A figure's layouts, widest first: each one's name and the greatest box
 * width it shows at (none for the widest).
 */
export type Sizes = Array<[name: string, upTo?: number]>

/**
 * A figure whose width can be changed, to show a responsive design at each of
 * its sizes. The box sits centered in the room it has; dragging the grip on
 * either side narrows or widens it, both sides moving together so the grip
 * stays under the pointer. The grips are sliders: the arrow keys move them,
 * Home and End go to the narrowest and the full width.
 *
 * At full width the box is fluid again, so it follows the window. Where the
 * room is no wider than `min` (a phone) there is nothing to resize and the
 * grips are not shown.
 *
 * The demo cursor resizes it too, through a `demo-drag` event on a grip
 * carrying the width to take (DemoCursor's `drag` step).
 *
 * Under the box a label names the layout showing ("Desktop", "Tablet",
 * "Mobile"): `sizes` lists the figure's own layouts, widest first, each with
 * the greatest box width it shows at (none for the widest), which are the
 * widths its styles change at.
 */
export function Resizable({
  min = 326,
  label = "Figure width",
  sizes,
  className,
  children,
}: {
  min?: number
  label?: string
  sizes?: Sizes
  /** For the box that is resized (a height, say, which also centers the grips). */
  className?: string
  children: React.ReactNode
}) {
  const room = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  // The width asked for; null is "all the room there is".
  const [width, setWidth] = useState<number | null>(null)
  const [max, setMax] = useState(0)
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => {
    const el = room.current
    if (!el) return
    const measure = () => setMax(el.clientWidth)
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const take = (next: number) => {
    const full = room.current?.clientWidth ?? max
    setWidth(next >= full - 1 ? null : Math.max(min, Math.round(next)))
  }

  // The demo cursor's drags.
  useEffect(() => {
    const el = room.current
    if (!el) return
    const onDemo = (e: Event) => {
      const value = (e as CustomEvent<number>).detail
      if (typeof value !== "number") return
      setWidth(
        value >= el.clientWidth - 1 ? null : Math.max(min, Math.round(value))
      )
    }
    el.addEventListener("demo-drag", onDemo)
    return () => el.removeEventListener("demo-drag", onDemo)
  }, [min])

  const now = Math.min(width ?? max, max)
  const fixed = max <= min + STEP
  // The layout showing: the narrowest one the box still fits. Before the
  // room is measured it is the widest.
  const size = sizes?.reduce(
    (found, [name, upTo]) =>
      upTo === undefined || (max > 0 && now <= upTo) ? name : found,
    sizes[0][0]
  )

  const grip = (side: "left" | "right") => (
    <button
      type="button"
      role="slider"
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(now)}
      aria-valuetext={size && `${size}, ${Math.round(now)} pixels`}
      className="cds-resize-grip"
      data-side={side}
      data-dragging={dragging === side ? "" : undefined}
      data-wave-hover="off"
      data-wave-manual
      onPointerDown={(e) => {
        const el = box.current
        if (!el || e.button !== 0) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        // A scaled figure is drawn smaller than it is laid out, and the
        // pointer moves in drawn pixels.
        const scale = el.getBoundingClientRect().width / (el.offsetWidth || 1)
        const from = el.offsetWidth
        const start = e.clientX
        const sign = side === "right" ? 1 : -1
        setDragging(side)
        const target = e.currentTarget
        const move = (ev: PointerEvent) =>
          take(from + (sign * 2 * (ev.clientX - start)) / scale)
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
        else if (e.key === "End") take(max)
        else return
        e.preventDefault()
      }}
    />
  )

  return (
    <div ref={room} className="cds-resize" data-fixed={fixed ? "" : undefined}>
      <div
        ref={box}
        className={cn("cds-resize-box", className)}
        style={{ width: width === null ? undefined : width }}
      >
        {children}
        {grip("left")}
        {grip("right")}
      </div>
      {size && (
        <div className="cds-resize-size" aria-hidden>
          {size}
        </div>
      )}
    </div>
  )
}
