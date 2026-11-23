import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FigureNotes } from "@/components/work/claude/figure-notes"
import { useFrame } from "@/components/work/claude/frame"
import type { FigureNote, Noted } from "@/components/work/claude/figure-notes"
import { cn } from "@/lib/utils"

/**
 * One thing for the demo cursor to try: go to an element of the figure, rest
 * on it as if hovering, and perhaps click it.
 */
export type DemoStep = {
  /**
   * A selector inside the figure. A step whose element is missing, hidden,
   * disabled (`aria-disabled`), or out of the figure's sight (scrolled out of a page that scrolls
   * inside it) is skipped; of several matches, the first in sight is used.
   */
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
   * sent to it as `demo-drag` events, and the cursor rides along. A drag
   * to where the control already is is skipped.
   */
  drag?: number
  /**
   * Scroll it, as a wheel would, to this far down what it holds, from 0 to
   * 100, with the cursor resting on it. Skipped where it has nothing to
   * scroll.
   */
  scroll?: number
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
   * the cursor picks a spot a little off its middle. With `click`, the click
   * carries that spot (`clientX`, `clientY`), as a real one does, for a
   * control that acts on where it is pressed, like an audio player's bar.
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
  /**
   * The figure's story at this step: a note beside the figure, on this
   * step's element (or `note.on`), which comes up once the step is done
   * and stays long enough to read, the cursor resting there meanwhile.
   */
  note?: FigureNote
}

// The figures on screen whose cursors have a story to tell. Only one of
// them speaks at a time, the one nearest the middle of what shows of the
// page under the docs' bar: two stories at once are hard to keep up with.
// The others' cursors still play, without their notes.
const tellers = new Set<Element>()
const leads = (root: Element) => {
  const top =
    document.querySelector("[data-docs-bar]")?.getBoundingClientRect().bottom ??
    0
  const middle = (Math.max(0, top) + window.innerHeight) / 2
  let lead: Element | null = null
  let least = Infinity
  for (const el of tellers) {
    const box = el.getBoundingClientRect()
    const off =
      box.top <= middle && box.bottom >= middle
        ? 0
        : Math.min(Math.abs(box.top - middle), Math.abs(box.bottom - middle))
    if (off < least) {
      least = off
      lead = el
    }
  }
  return lead === root
}

/** How long a note stays up: a moment to find it, then its words read. */
const readTime = (note: FigureNote) =>
  Math.max(2600, 1100 + (note.title.length + note.text.length) * 42)

// The cursor's shapes: the system's arrow, and what a real pointer turns into
// over something to press, a text field and a control dragged sideways. The
// pictures are vectors of the macOS cursors from the Figma Community file
// "Vector macOS cursors" (Leo, 2026-11-19: "lets use the cursors from
// here"), kept as files in public/cursors with a note of their source. Their
// sizes and hot spots are set in src/claude-ds.css. (Two sets came before
// them that day: macOS-style pictures with a soft shadow from the
// apple_cursor project, and a flat set from the site's icons.)
const SHAPES = ["arrow", "pointer", "text", "ew-resize"] as const
type Shape = (typeof SHAPES)[number]

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))

/** A CSS `cubic-bezier()` easing as a function of time (0 to 1). */
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const at = (s: number, a: number, b: number) =>
    3 * (1 - s) ** 2 * s * a + 3 * (1 - s) * s ** 2 * b + s ** 3
  return (t: number) => {
    let lo = 0
    let hi = 1
    let s = t
    for (let i = 0; i < 24; i++) {
      const x = at(s, x1, x2)
      if (Math.abs(x - t) < 1e-5) break
      if (x < t) lo = s
      else hi = s
      s = (lo + hi) / 2
    }
    return at(s, y1, y2)
  }
}
const ease = bezier(0.45, 0, 0.2, 1)
const easeOut = bezier(0, 0, 0.58, 1)

/**
 * Calls `draw` once a frame for `ms`, with the time as a fraction (0 to 1),
 * until it is done or `live` says to stop. The cursor is moved this way, from
 * script, not with animations: an element being animated is drawn on a layer
 * of its own, and in Safari that lifts the scaled figure around it onto one
 * too, so the figure's text was drawn a fraction of a pixel off while the
 * cursor moved, and came back when it stopped.
 */
const everyFrame = (
  ms: number,
  draw: (t: number) => void,
  live: () => boolean
) =>
  new Promise<void>((done) => {
    const t0 = performance.now()
    const tick = (now: number) => {
      if (!live()) return done()
      const t = Math.min(1, (now - t0) / ms)
      draw(t)
      if (t < 1) requestAnimationFrame(tick)
      else done()
    }
    requestAnimationFrame(tick)
  })

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
 * reduced motion. When it comes back it carries on from the step it was
 * sent away at, not from the start (Leo, 2026-11-23: after a visitor
 * clicks around and goes, "that figure story and demo cursor should
 * resume"); a step whose element is no longer there is skipped, as ever.
 *
 * Its steps can tell the figure's story (`note`): a card beside the figure
 * with an arrow to the step's element (`FigureNotes`), up while the cursor
 * rests there, and gone when the cursor moves on or the visitor comes in.
 * Under reduced motion, where no cursor plays, the notes of everything in
 * the figure as it stands all show while it is on screen.
 *
 * A pretend pointer cannot make `:hover` match, so the element it rests on
 * is marked `data-state="hover"`, which the system's controls style the same
 * way, and is sent the pointer events of a real one arriving, so a menu that
 * opens on hover opens. Its clicks are real ones. It changes shape as a real
 * pointer does: a hand over a button or a link, an I-beam in a text field,
 * sideways arrows on a grip.
 *
 * In a figure with a frame (a `figure` `Specimen`: `FrameContext`) the
 * cursor is drawn in the frame and not in the figure's box, which clips: so
 * it can go to the grips on the figure's border, which are in the frame
 * too, and ride one as the figure narrows. The frame is then also where the
 * visitor is watched for, so a pointer on a grip counts as in the figure.
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
  const frame = useFrame().el
  // The notes showing beside the figure, set from the cursor's own loop.
  const [noted, setNoted] = useState<Noted | null>(null)

  useEffect(() => {
    const root = figure.current
    const tip = cursor.current
    if (!root || !tip) return
    // The cursor's ground: where it is drawn and measured from, and where
    // the visitor is watched for.
    const stage = frame ?? root
    // The notes are drawn in the figure's own element, outside its scaled
    // box, at the page's size.
    const host = root.closest("figure")
    let fading = 0
    const say = (items: Noted["items"]) => {
      window.clearTimeout(fading)
      if (host && items.length) setNoted({ host, items })
    }
    // A note leaves with a short fade, then is taken away.
    const hush = () => {
      window.clearTimeout(fading)
      setNoted((now) => (now ? { ...now, leaving: true } : now))
      fading = window.setTimeout(() => setNoted(null), 200)
    }
    const partOf = (note: FigureNote, el: Element) =>
      (note.on ? root.querySelector(note.on) : null) ?? el
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No cursor: while the figure is on screen, the notes of what is in
      // it as it stands.
      const still = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1]
        if (!entry.isIntersecting) return hush()
        say(
          steps.flatMap((step) => {
            if (!step.note) return []
            const el = step.note.on
              ? root.querySelector(step.note.on)
              : Array.from(root.querySelectorAll(step.on)).at(step.nth ?? 0)
            return el ? [{ note: step.note, el }] : []
          })
        )
      })
      still.observe(root)
      return () => {
        still.disconnect()
        window.clearTimeout(fading)
        setNoted(null)
      }
    }
    const arrow = tip.firstElementChild
    if (!arrow) return

    // Where the cursor is, in the stage's own (unscaled) pixels.
    let at = { x: 0, y: 0 }
    let shown = false
    // Each trip holds the number it started with; a newer number (another
    // trip, or the cursor put at rest) ends it.
    let trip = 0
    let hovered: Element | null = null
    // Each run holds the number it started with; a newer number ends it.
    let run = 0
    let playing = false
    let inView = false
    let visitor = false
    // The visitor has just left the figure.
    let away = false
    let comeback = 0
    // The step to carry on from when it comes back.
    let resume = 0

    const scale = () =>
      stage.getBoundingClientRect().width / (stage.offsetWidth || 1)

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
      // The dip is a transform: the `scale` property is the styles', which
      // use it to draw the pictures at their true size in a scaled figure.
      // The ring is the cursor's ::after, drawn from two properties.
      const el = arrow as HTMLElement
      void everyFrame(
        260,
        (t) => {
          const k = ease(t)
          const s =
            k < 0.4 ? 1 - 0.2 * (k / 0.4) : 0.8 + 0.2 * ((k - 0.4) / 0.6)
          el.style.transform = t < 1 ? `scale(${s})` : ""
        },
        () => true
      )
      await everyFrame(
        500,
        (t) => {
          const k = easeOut(t)
          tip.style.setProperty("--demo-ring-opacity", String(0.9 * (1 - k)))
          tip.style.setProperty("--demo-ring-scale", String(0.3 + 1.2 * k))
        },
        () => true
      )
      tip.style.removeProperty("--demo-ring-opacity")
      tip.style.removeProperty("--demo-ring-scale")
      await sleep(20)
    }

    // A step's element is looked for in the figure and, failing that, among
    // what sits on the frame itself (the grips of a resizable figure).
    const find = (step: DemoStep) => {
      let skip = step.nth ?? 0
      let found = root.querySelectorAll<HTMLElement>(step.on)
      if (found.length === 0 && stage !== root)
        found = stage.querySelectorAll<HTMLElement>(`:scope > ${step.on}`)
      // What the figure shows: an element whose middle is outside it has
      // been scrolled out of sight (a page scrolling inside the figure), and
      // the cursor does not follow it out. The grips sit on the edge itself.
      const sight = stage.getBoundingClientRect()
      const slack = 16
      for (const el of found) {
        if (step.text && !el.textContent.trim().startsWith(step.text)) continue
        const box = el.getBoundingClientRect()
        if (box.width === 0 || box.height === 0) continue
        // A control with nowhere to go (a carousel's arrow at its end).
        if (el.getAttribute("aria-disabled") === "true") continue
        const x = box.left + box.width / 2
        const y = box.top + box.height / 2
        if (
          x < sight.left - slack ||
          x > sight.right + slack ||
          y < sight.top - slack ||
          y > sight.bottom + slack
        )
          continue
        if (skip-- === 0) return el
      }
      return null
    }

    /**
     * Puts the cursor at a point to stay, on a whole pixel of the screen,
     * ending any trip under way. (On its way it is between pixels, which is
     * no matter while it moves; at rest the SVG pictures are drawn crisp.)
     */
    const rest = (x: number, y: number, opacity = 1) => {
      trip++
      const ground = stage.getBoundingClientRect()
      const kx = ground.width / (stage.offsetWidth || 1) || 1
      const ky = ground.height / (stage.offsetHeight || 1) || 1
      const fine = window.devicePixelRatio || 1
      const px = Math.round(x * kx * fine) / (kx * fine)
      const py = Math.round(y * ky * fine) / (ky * fine)
      tip.style.transform = `translate(${px}px, ${py}px)`
      tip.style.opacity = String(opacity)
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
      const wasShown = shown
      // On its way it is over nothing in particular: an arrow again.
      wear("arrow")
      const mine = ++trip
      at = { x, y }
      shown = opacity > 0
      await everyFrame(
        brisk
          ? Math.min(420, Math.max(220, length * 1.2))
          : Math.min(900, Math.max(320, length * 2.2)),
        (time) => {
          const t = ease(time)
          const px = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * mx + t ** 2 * x
          const py = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * my + t ** 2 * y
          const lean = Math.sin(t * Math.PI) * Math.sign(dx || 1) * 8
          tip.style.transform = `translate(${px}px, ${py}px) rotate(${lean}deg)`
          tip.style.opacity = String(wasShown ? opacity : t * opacity)
        },
        () => trip === mine
      )
      // Arrived, and nothing newer has taken over: it rests.
      if (trip === mine) rest(x, y, opacity)
    }

    /**
     * A point on an element, in the figure's pixels: the spot asked for, or
     * else one a little off its middle.
     */
    const pointOn = (el: Element, spot?: [number, number]) => {
      const ground = stage.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      const k = scale()
      const fx = spot ? spot[0] : 0.4 + Math.random() * 0.25
      const fy = spot ? spot[1] : 0.5 + Math.random() * 0.2
      return {
        x: (box.left - ground.left + box.width * fx) / k,
        y: (box.top - ground.top + box.height * fy) / k,
      }
    }

    const leave = () => {
      run++
      playing = false
      tellers.delete(root)
      hover(null)
      restore()
      hush()
      if (!shown) return
      // Off, up and away.
      void travel(at.x + 36, at.y - 28, 0)
    }

    const play = async () => {
      playing = true
      if (steps.some((step) => step.note)) tellers.add(root)
      const mine = ++run
      const live = () => mine === run
      // Comes in from somewhere in the left half of the figure, within the
      // part of the figure that is in the window.
      const bounds = stage.getBoundingClientRect()
      const zoom = scale()
      const top = Math.max(0, -bounds.top) / zoom
      const bottom =
        Math.min(bounds.height, window.innerHeight - bounds.top) / zoom
      at = {
        x: Math.random() * stage.offsetWidth * 0.5,
        y: top + Math.random() * Math.max(0, bottom - top),
      }
      shown = false
      while (live()) {
        for (let i = resume; i < steps.length; i++) {
          // Sent away during this step, it comes back to it.
          resume = i
          const step = steps[i]
          const el = find(step)
          if (!el) continue
          const open = el.getAttribute("aria-expanded") === "true"
          if (step.click === "open" && open) continue
          if (step.click === "close" && !open) continue
          // Nothing to do: the control is where the drag would leave it,
          // or the box has nothing to scroll, or is there already.
          if (
            step.drag !== undefined &&
            Math.abs(
              (Number(el.getAttribute("aria-valuenow")) || 0) - step.drag
            ) < 1
          )
            continue
          if (step.scroll !== undefined) {
            const most = el.scrollHeight - el.clientHeight
            if (
              most <= 1 ||
              Math.abs(el.scrollTop - (step.scroll / 100) * most) < 2
            )
              continue
          }
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
            const ground = stage.getBoundingClientRect()
            const k = scale()
            const fx = (at.x * k - (box.left - ground.left)) / (box.width || 1)
            const fy = (at.y * k - (box.top - ground.top)) / (box.height || 1)
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
                const f = stage.getBoundingClientRect()
                const kk = scale()
                at = {
                  x: (b.left - f.left + b.width * fx) / kk,
                  y: (b.top - f.top + b.height * fy) / kk,
                }
                rest(at.x, at.y)
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
          if (step.scroll !== undefined && el.isConnected) {
            // A wheel's scroll: the cursor stays where it is, and what is
            // under it moves.
            const from = el.scrollTop
            const to = (step.scroll / 100) * (el.scrollHeight - el.clientHeight)
            const duration = Math.min(
              1600,
              Math.max(600, Math.abs(to - from) * 1.5)
            )
            hover(null)
            await new Promise<void>((done) => {
              const t0 = performance.now()
              const tick = (time: number) => {
                if (!live()) return done()
                const t = Math.min(1, (time - t0) / duration)
                const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
                el.scrollTop = from + (to - from) * eased
                if (t < 1) requestAnimationFrame(tick)
                else done()
              }
              requestAnimationFrame(tick)
            })
            if (!live()) return
            await sleep(500)
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
            if (step.at) {
              // A click at the cursor's spot, where the step names one: a
              // plain click() reports none (0, 0).
              const ground = stage.getBoundingClientRect()
              const k = scale()
              el.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  view: window,
                  detail: 1,
                  clientX: ground.left + at.x * k,
                  clientY: ground.top + at.y * k,
                })
              )
            } else el.click()
            await pressed
            if (!live()) return
          }
          if (step.note && leads(root)) {
            // What the step did is drawn; now what it shows is said, and
            // the cursor waits while it is read.
            await sleep(120)
            if (!live()) return
            say([{ note: step.note, el: partOf(step.note, el) }])
            await sleep(readTime(step.note))
            if (!live()) return
            hush()
          }
        }
        resume = 0
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
      if (e.relatedTarget instanceof Node && stage.contains(e.relatedTarget))
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
    stage.addEventListener("pointerenter", onEnter)
    stage.addEventListener("pointerleave", onLeave)
    stage.addEventListener("focusin", onFocusIn)
    stage.addEventListener("focusout", onFocusOut)
    stage.addEventListener("pointerdown", onDown, { passive: true })
    stage.addEventListener("click", onTap)
    return () => {
      run++
      window.clearTimeout(comeback)
      window.clearTimeout(turn)
      window.clearTimeout(fading)
      setNoted(null)
      tellers.delete(root)
      stage.removeEventListener("pointerdown", onDown)
      stage.removeEventListener("click", onTap)
      watcher.disconnect()
      stage.removeEventListener("pointerenter", onEnter)
      stage.removeEventListener("pointerleave", onLeave)
      stage.removeEventListener("focusin", onFocusIn)
      stage.removeEventListener("focusout", onFocusOut)
      hover(null)
      restore()
      trip++
      tip.style.transform = ""
      tip.style.opacity = ""
    }
  }, [steps, frame])

  const tip = (
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
  )
  return (
    <div ref={figure} className={cn("relative", className)}>
      {children}
      {frame ? createPortal(tip, frame) : tip}
      {noted && createPortal(<FigureNotes noted={noted} />, noted.host)}
    </div>
  )
}
