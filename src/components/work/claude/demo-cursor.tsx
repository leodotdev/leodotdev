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
  /** How long to rest on it, in ms. */
  rest?: number
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))
const ease = "cubic-bezier(0.45, 0, 0.2, 1)"

/**
 * A small cursor that tries a figure out by itself: it travels between the
 * figure's own controls, hovers them, clicks them, types in them and drags
 * them, so menus open, tabs change, fields fill and a figure resizes as they
 * would for a visitor, then starts over.
 *
 * It is a guest. The moment the visitor's own pointer (or keyboard focus)
 * enters the figure it leaves, and it comes back a little after they go.
 * It only plays while the figure is on screen, never where nothing hovers
 * (a phone), and not for anyone who prefers reduced motion.
 *
 * A pretend pointer cannot make `:hover` match, so the element it rests on
 * is marked `data-state="hover"`, which the system's controls style the same
 * way, and is sent the pointer events of a real one arriving, so a menu that
 * opens on hover opens. Its clicks are real ones.
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
    if (!window.matchMedia("(hover: hover)").matches) return
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
    let comeback = 0

    const scale = () =>
      root.getBoundingClientRect().width / (root.offsetWidth || 1)

    // Marks the element under the cursor, and unmarks the one it left. An
    // element that already shows a state of its own is left as it is. The
    // elements are also told, with the events a pointer would send, so
    // anything that opens on hover opens for the cursor too.
    let under: Element | null = null
    const hover = (el: Element | null) => {
      hovered?.removeAttribute("data-state")
      hovered = el && !el.hasAttribute("data-state") ? el : null
      hovered?.setAttribute("data-state", "hover")
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

    /** Travels to a point along a slight curve, leaning into the turn. */
    const travel = async (x: number, y: number, opacity = 1) => {
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
      const next = tip.animate(frames, {
        duration: Math.min(900, Math.max(320, length * 2.2)),
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
      // Comes in from just outside the figure's right edge.
      at = { x: root.offsetWidth + 24, y: 40 + Math.random() * 120 }
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
          await travel(point.x, point.y)
          if (!live()) return
          hover(el)
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
      // Back a moment after the visitor has gone.
      comeback = window.setTimeout(() => void play(), 900)
    }

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      visitor = true
      decide()
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      visitor = false
      decide()
    }
    const onFocusIn = () => {
      visitor = true
      decide()
    }
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget instanceof Node && root.contains(e.relatedTarget))
        return
      visitor = false
      decide()
    }
    // On screen means most of the figure is showing, or, for a figure taller
    // than the window, that it fills half the window.
    const watcher = new IntersectionObserver(
      (entries) => {
        // Several updates can arrive together; the last is how things stand.
        const entry = entries[entries.length - 1]
        inView =
          entry.intersectionRatio >= 0.6 ||
          entry.intersectionRect.height >= window.innerHeight * 0.5
        decide()
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    )
    watcher.observe(root)
    root.addEventListener("pointerenter", onEnter)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("focusin", onFocusIn)
    root.addEventListener("focusout", onFocusOut)
    return () => {
      run++
      window.clearTimeout(comeback)
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
        <svg viewBox="0 0 22 24" width="22" height="24">
          <path d="M2 2 L2 19 L6.6 14.9 L9.6 21.6 L12.6 20.3 L9.7 13.8 L16 13.8 Z" />
        </svg>
      </span>
    </div>
  )
}
