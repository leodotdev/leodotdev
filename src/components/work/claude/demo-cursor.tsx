import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * One thing for the demo cursor to try: go to an element of the figure, rest
 * on it as if hovering, and perhaps click it.
 */
export type DemoStep = {
  /** A selector inside the figure. A step whose element is missing or hidden is skipped. */
  on: string
  /** Narrows `on` to the element whose text starts with this. */
  text?: string
  /** Which of the matches to use, counting from 0; the first by default. */
  nth?: number
  /**
   * Click it. "open" and "close" only click a control that is not yet in that
   * state (`aria-expanded`), so a menu the visitor left open is not flipped.
   */
  click?: true | "open" | "close"
  /**
   * Drag it to this value. For a slider-like control (the grips of a
   * `Resizable`): the value moves there from the control's `aria-valuenow`,
   * sent to it as `demo-drag` events, and the cursor rides along.
   */
  drag?: number
  /**
   * Type this into it: a text field, or a box with one inside. The field is
   * not really focused (that would take the visitor's focus); its box is
   * marked `data-state="focus"`, which the system's fields style the same
   * way. What a field held before comes back when the steps start over, or
   * when the cursor leaves.
   */
  type?: string
  /**
   * Where on it to rest, as fractions of its width and height. Without this
   * the cursor picks a spot a little off its middle.
   */
  at?: [x: number, y: number]
  /**
   * Only go there and wait: the element is not marked as hovered or told
   * the pointer has come. With `at`, a way to rest on a figure's empty
   * middle between two things, so everything shows at rest.
   */
  idle?: true
  /** How long to rest on it, in ms. */
  rest?: number
}

// The cursor's shapes: the system's arrow, and what a real pointer turns into
// over something to press, a text field and a control dragged sideways. The
// pictures are macOS-style cursors from the apple_cursor project (GPL-3.0;
// public/cursors, with their license). Their size and hot spots are set in
// src/claude-ds.css.
const SHAPES = ["arrow", "pointer", "text", "ew-resize"] as const
type Shape = (typeof SHAPES)[number]

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))
const ease = "cubic-bezier(0.45, 0, 0.2, 1)"

/**
 * A small cursor that tries a figure out by itself: it travels between the
 * figure's own controls, hovers them, clicks them, types in them and drags
 * them, so menus open, tabs change, fields fill and a figure resizes as they
 * would for a visitor, then starts over.
 *
 * It is a guest. The moment the visitor's own pointer (or keyboard focus)
 * enters the figure it leaves, and it comes back a little after they go; on
 * a touch screen a tap in the figure sends it away for a few seconds. It
 * only plays while the figure is on screen, and not for anyone who prefers
 * reduced motion.
 *
 * A pretend pointer cannot make `:hover` match, so the element it rests on
 * is marked `data-state="hover"`, which the system's controls style the same
 * way, and is sent the pointer events of a real one arriving, so a menu that
 * opens on hover opens. Its clicks are real ones. It changes shape as a real
 * pointer does: a hand over a button or a link, an I-beam in a text field,
 * sideways arrows on a grip.
 */
export function DemoCursor({
  steps,
  className,
  children,
}: {
  steps: Array<DemoStep>
  className?: string
  children: React.ReactNode
}) {
  const figure = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = figure.current
    const tip = cursor.current
    if (!root || !tip) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const arrow = tip.firstElementChild
    if (!arrow) return

    // Where the cursor is, in the figure's own (unscaled) pixels.
    let at = { x: 0, y: 0 }
    let shown = false
    let motion: Animation | null = null
    let hovered: Element | null = null
    // Each run holds the number it started with; a newer number ends it.
    let run = 0
    let playing = false
    let inView = false
    let visitor = false
    // The visitor has just left the figure.
    let away = false
    let comeback = 0

    const scale = () =>
      root.getBoundingClientRect().width / (root.offsetWidth || 1)

    // The shape a real pointer would have over an element: a hand where its
    // style asks for one or it is a link, the sideways arrows on something
    // dragged that way, an I-beam in a text field, and the arrow otherwise.
    const shapeOver = (el: Element): Shape => {
      const asked = getComputedStyle(el).cursor
      if (asked === "pointer" || el.closest("a[href]")) return "pointer"
      if (asked === "ew-resize" || asked === "col-resize") return "ew-resize"
      if (asked === "text" || el.matches("input, textarea")) return "text"
      return "arrow"
    }
    const wear = (shape: Shape) => tip.setAttribute("data-shape", shape)

    // Marks the element under the cursor, and unmarks the one it left. An
    // element that already shows a state of its own is left as it is. The
    // elements are also told, with the events a pointer would send, so
    // anything that opens on hover opens for the cursor too.
    let under: Element | null = null
    const hover = (el: Element | null) => {
      hovered?.removeAttribute("data-state")
      hovered = el && !el.hasAttribute("data-state") ? el : null
      hovered?.setAttribute("data-state", "hover")
      wear(el ? shapeOver(el) : "arrow")
      if (el === under) return
      const event = (type: string, relatedTarget: Element | null) =>
        new PointerEvent(type, {
          bubbles: true,
          pointerType: "mouse",
          relatedTarget,
        })
      // Leaving one element for another is one "out" naming where it went;
      // arriving from nowhere is an "over".
      if (under?.isConnected) under.dispatchEvent(event("pointerout", el))
      else if (el) el.dispatchEvent(event("pointerover", null))
      under = el
    }

    // The fields it has typed in, and what each held before.
    const typed = new Map<HTMLInputElement | HTMLTextAreaElement, string>()
    const restore = () => {
      for (const [field, value] of typed) field.value = value
      typed.clear()
    }

    /** A press: the arrow dips, and a ring spreads from its tip. */
    const press = async () => {
      arrow.animate([{ scale: 1 }, { scale: 0.8, offset: 0.4 }, { scale: 1 }], {
        duration: 260,
        easing: ease,
      })
      tip.toggleAttribute("data-press", true)
      await sleep(520)
      tip.toggleAttribute("data-press", false)
    }

    const find = (step: DemoStep) => {
      let skip = step.nth ?? 0
      for (const el of root.querySelectorAll<HTMLElement>(step.on)) {
        if (step.text && !el.textContent.trim().startsWith(step.text)) continue
        const box = el.getBoundingClientRect()
        if (box.width === 0 || box.height === 0) continue
        if (skip-- === 0) return el
      }
      return null
    }

    /**
     * Travels to a point along a slight curve, leaning into the turn. Its
     * first trip, the one that brings it into the figure, is a brisk one.
     */
    const travel = async (x: number, y: number, opacity = 1, brisk = false) => {
      const from = at
      const dx = x - from.x
      const dy = y - from.y
      const length = Math.hypot(dx, dy)
      // The curve's high point sits off the straight line, to one side.
      const bend = (Math.random() - 0.5) * 0.35 * length
      const mx = from.x + dx / 2 - (dy / (length || 1)) * bend
      const my = from.y + dy / 2 + (dx / (length || 1)) * bend
      const frames: Array<Keyframe> = []
      for (let i = 0; i <= 12; i++) {
        const t = i / 12
        const px = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * mx + t ** 2 * x
        const py = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * my + t ** 2 * y
        const lean = Math.sin(t * Math.PI) * Math.sign(dx || 1) * 8
        frames.push({
          transform: `translate(${px}px, ${py}px) rotate(${lean}deg)`,
          opacity: shown ? opacity : t * opacity,
        })
      }
      // On its way it is over nothing in particular: an arrow again.
      wear("arrow")
      const next = tip.animate(frames, {
        duration: brisk
          ? Math.min(420, Math.max(220, length * 1.2))
          : Math.min(900, Math.max(320, length * 2.2)),
        easing: ease,
        fill: "forwards",
      })
      motion?.cancel()
      motion = next
      at = { x, y }
      shown = opacity > 0
      await next.finished.catch(() => {})
    }

    /**
     * A point on an element, in the figure's pixels: the spot asked for, or
     * else one a little off its middle.
     */
    const pointOn = (el: Element, spot?: [number, number]) => {
      const frame = root.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      const k = scale()
      const fx = spot ? spot[0] : 0.4 + Math.random() * 0.25
      const fy = spot ? spot[1] : 0.5 + Math.random() * 0.2
      return {
        x: (box.left - frame.left + box.width * fx) / k,
        y: (box.top - frame.top + box.height * fy) / k,
      }
    }

    const leave = () => {
      run++
      playing = false
      hover(null)
      restore()
      if (!shown) return
      // Off, up and away.
      void travel(at.x + 36, at.y - 28, 0)
    }

    const play = async () => {
      playing = true
      const mine = ++run
      const live = () => mine === run
      // Comes in from somewhere in the left half of the figure, within the
      // part of the figure that is in the window.
      const bounds = root.getBoundingClientRect()
      const zoom = scale()
      const top = Math.max(0, -bounds.top) / zoom
      const bottom =
        Math.min(bounds.height, window.innerHeight - bounds.top) / zoom
      at = {
        x: Math.random() * root.offsetWidth * 0.5,
        y: top + Math.random() * Math.max(0, bottom - top),
      }
      shown = false
      while (live()) {
        for (const step of steps) {
          const el = find(step)
          if (!el) continue
          const open = el.getAttribute("aria-expanded") === "true"
          if (step.click === "open" && open) continue
          if (step.click === "close" && !open) continue
          // Something to be gripped is taken by its exact middle.
          const point = pointOn(
            el,
            step.at ?? (step.drag !== undefined ? [0.5, 0.5] : undefined)
          )
          // Going to rest on nothing, it lets go of what it was on as it
          // leaves, not when it arrives.
          if (step.idle) hover(null)
          await travel(point.x, point.y, 1, !shown)
          if (!live()) return
          hover(step.idle ? null : el)
          await sleep(step.rest ?? 420)
          if (!live()) return
          if (step.drag !== undefined && el.isConnected) {
            // Press, pull the control to its new value, let go. The cursor
            // keeps its place on the control as the control moves.
            const from = Number(el.getAttribute("aria-valuenow")) || 0
            const to = step.drag
            const box = el.getBoundingClientRect()
            const frame = root.getBoundingClientRect()
            const k = scale()
            const fx = (at.x * k - (box.left - frame.left)) / (box.width || 1)
            const fy = (at.y * k - (box.top - frame.top)) / (box.height || 1)
            el.setAttribute("data-dragging", "")
            const duration = Math.min(
              1600,
              Math.max(600, Math.abs(to - from) * 4)
            )
            await new Promise<void>((done) => {
              const t0 = performance.now()
              const tick = (time: number) => {
                if (!live()) return done()
                const t = Math.min(1, (time - t0) / duration)
                const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
                el.dispatchEvent(
                  new CustomEvent("demo-drag", {
                    detail: from + (to - from) * eased,
                    bubbles: true,
                  })
                )
                const b = el.getBoundingClientRect()
                const f = root.getBoundingClientRect()
                const kk = scale()
                at = {
                  x: (b.left - f.left + b.width * fx) / kk,
                  y: (b.top - f.top + b.height * fy) / kk,
                }
                const held = tip.animate(
                  [
                    {
                      transform: `translate(${at.x}px, ${at.y}px)`,
                      opacity: 1,
                    },
                  ],
                  { duration: 0, fill: "forwards" }
                )
                motion?.cancel()
                motion = held
                if (t < 1) requestAnimationFrame(tick)
                else done()
              }
              requestAnimationFrame(tick)
            })
            el.removeAttribute("data-dragging")
            if (!live()) return
            await sleep(700)
            if (!live()) return
          }
          if (step.type !== undefined && el.isConnected) {
            const field = el.matches("input, textarea")
              ? el
              : el.querySelector("input, textarea")
            if (
              field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement
            ) {
              // A click into the field, which then looks focused, and the
              // text a letter at a time, at an uneven pace.
              // In the field the pointer is an I-beam.
              wear("text")
              await press()
              if (!live()) return
              if (!typed.has(field)) typed.set(field, field.value)
              if (hovered === el) el.setAttribute("data-state", "focus")
              field.value = ""
              for (const letter of step.type) {
                field.value += letter
                await sleep(30 + Math.random() * 60)
                if (!live()) return
              }
              await sleep(600)
              if (!live()) return
            }
          }
          if (step.click && el.isConnected) {
            const pressed = press()
            el.click()
            await pressed
            if (!live()) return
          }
        }
        await sleep(900)
        if (!live()) return
        restore()
      }
    }

    const decide = () => {
      window.clearTimeout(comeback)
      if (visitor || !inView) return leave()
      if (playing) return
      // In at once when the figure comes into view; a moment later when it
      // is the visitor who has just gone.
      comeback = window.setTimeout(() => void play(), away ? 700 : 150)
      away = false
    }

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      visitor = true
      decide()
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      visitor = false
      away = true
      decide()
    }
    // A finger does not hover, so on a touch screen the visitor's turn is a
    // tap in the figure (not a touch that scrolls the page): the cursor
    // leaves, and comes back a few seconds after their last tap. Its own
    // clicks are not the visitor's.
    let lastDown = "mouse"
    let turn = 0
    const onDown = (e: PointerEvent) => {
      lastDown = e.pointerType
    }
    const onTap = (e: MouseEvent) => {
      if (!e.isTrusted || lastDown === "mouse") return
      visitor = true
      decide()
      window.clearTimeout(turn)
      turn = window.setTimeout(() => {
        visitor = false
        away = true
        decide()
      }, 4000)
    }
    const onFocusIn = () => {
      visitor = true
      decide()
    }
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget instanceof Node && root.contains(e.relatedTarget))
        return
      visitor = false
      away = true
      decide()
    }
    // On screen means most of the figure's height is showing, or, for a
    // figure taller than the window, that it fills half the window. Its
    // width is left out of it: a figure wider than its box (a grid scrolled
    // sideways on a phone) is cut off at the side however it is scrolled.
    const watcher = new IntersectionObserver(
      (entries) => {
        // Several updates can arrive together; the last is how things stand.
        const entry = entries[entries.length - 1]
        const showing = entry.intersectionRect.height
        inView =
          entry.isIntersecting &&
          (showing >= entry.boundingClientRect.height * 0.6 ||
            showing >= window.innerHeight * 0.5)
        decide()
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    )
    watcher.observe(root)
    root.addEventListener("pointerenter", onEnter)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("focusin", onFocusIn)
    root.addEventListener("focusout", onFocusOut)
    root.addEventListener("pointerdown", onDown, { passive: true })
    root.addEventListener("click", onTap)
    return () => {
      run++
      window.clearTimeout(comeback)
      window.clearTimeout(turn)
      root.removeEventListener("pointerdown", onDown)
      root.removeEventListener("click", onTap)
      watcher.disconnect()
      root.removeEventListener("pointerenter", onEnter)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("focusin", onFocusIn)
      root.removeEventListener("focusout", onFocusOut)
      hover(null)
      restore()
      motion?.cancel()
    }
  }, [steps])

  return (
    <div ref={figure} className={cn("relative", className)}>
      {children}
      <span ref={cursor} aria-hidden className="cds-demo-cursor">
        {/* Its shapes, one showing at a time, each placed so its hot spot
            (the arrow's tip, the fingertip) is the cursor's point. */}
        <span>
          {SHAPES.map((shape) => (
            <img
              key={shape}
              data-shape={shape}
              src={`/cursors/${shape}.svg`}
              alt=""
              draggable={false}
            />
          ))}
        </span>
      </span>
    </div>
  )
}
