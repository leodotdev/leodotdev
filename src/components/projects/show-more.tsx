import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"
import { isTap, stopWaves, wave, wavesOn } from "@/lib/wave"

type Toggle = {
  label: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

/**
 * How many rows each of the home page's sections starts with (Leo,
 * 2026-11-23: "for each section, show 3 listitems then show more").
 */
export const PAGE_SIZE = 3

/** The most rows that wait their turn; any more come with the last. */
const STAGGER = 8

/**
 * The rows' own timing, as src/styles.css has it: a row coming in takes the
 * site's spring, a turn every 50ms; one leaving takes 220ms, a turn every
 * 30ms.
 */
const IN = { time: 850, turn: 50 }
const OUT = { time: 220, turn: 30 }

/**
 * The site's spring (`--ease-spring` in src/styles.css is this, sampled):
 * how far along it is at `x` of its time, running a little past 1 on the
 * way.
 */
function spring(x: number) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const t = x * 0.85
  const w = (2 * Math.PI) / 0.5
  return (
    1 -
    Math.exp(-0.6 * w * t) *
      (Math.cos(0.8 * w * t) + 0.75 * Math.sin(0.8 * w * t))
  )
}

/** A strong ease-out, close to the curve the leaving rows are on. */
const easeOut = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 5)

/**
 * The list's height while its rows come or go (Leo, 2026-11-23: the
 * sections "close and open abruptly before and after show more/less
 * animations, they should be more fluid"). Before this the list took its
 * new height at once, the rows then coming into the room already made, and
 * kept its old one until the last row had left, then dropped.
 *
 * The height is the rows' own motion added up: each row adds its height on
 * its own turn, on the curve it moves on, so the bottom of the list (and
 * the button and the sections under it) is carried by the rows, and what
 * a row has not yet made room for is cut off at that edge. Returns the
 * animation, held at its end, to be cancelled once the list's real height
 * is the one it ended on.
 */
function glide(rows: Array<HTMLElement>, leaving: boolean, from: number) {
  const list = rows[0].parentElement
  if (!list) return null
  // Heights from the layout (offsets), not from the rows as drawn: they
  // are already moved by their own animation.
  const bottom = (el: HTMLElement) => el.offsetTop + el.offsetHeight
  const before = rows[0].previousElementSibling
  let edge = before instanceof HTMLElement ? bottom(before) : rows[0].offsetTop
  const parts = rows.map((row) => {
    const size = bottom(row) - edge
    edge = bottom(row)
    return { size, turn: Number(row.style.getPropertyValue("--i")) || 0 }
  })
  const full = list.getBoundingClientRect().height
  const { time, turn } = leaving ? OUT : IN
  const total = time + Math.max(...parts.map((part) => part.turn)) * turn
  const rest = full - parts.reduce((sum, part) => sum + part.size, 0)
  const steps = Math.ceil(total / 16)
  const frames = Array.from({ length: steps + 1 }, (_, n) => {
    const at = (n / steps) * total
    let height = rest
    for (const part of parts) {
      const x = (at - part.turn * turn) / time
      height += part.size * (leaving ? 1 - easeOut(x) : spring(x))
    }
    // (A list sent back while still opening starts from where it had got.)
    return { height: `${Math.min(height, leaving ? from : Infinity)}px` }
  })
  list.style.overflowY = "clip"
  const motion = list.animate(frames, { duration: total, fill: "forwards" })
  return { list, motion }
}

/**
 * A list that starts with its first `pageSize` items and can be expanded to
 * all of them, then collapsed again. Put `sectionRef` on the section the list
 * sits in, spread `reveal(i)` on each row, and render
 * `<ShowMoreButton toggle={toggle} />` under the list.
 *
 * The rows let in come up one after another, each on the site's spring, and
 * the rows sent away drop out the same way, the last first, before the list
 * shortens (Leo, 2026-11-23: "staggered bouncy reveals/intros and outros";
 * `[data-enter]` and `[data-leave]` in src/styles.css). The list's own
 * height goes with them (`glide`, below), so what is under the list is
 * pushed down a row at a time and drawn back up the same way. Under reduced
 * motion the list simply changes.
 */
export function useShowMore<T>(items: Array<T>, pageSize = PAGE_SIZE) {
  const [count, setCount] = useState(pageSize)
  const sectionRef = useRef<HTMLDivElement>(null)
  // The first of the rows just let in, and whether the extra rows are on
  // their way out.
  const [entered, setEntered] = useState<number | null>(null)
  const [leaving, setLeaving] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // The list's height, carried by its rows (`glide`). It is started before
  // the first frame the rows are drawn in, and dropped once the list is at
  // rest at the height it ended on: opened, when the last row has settled;
  // closed, when the rows that left are gone from the list.
  const gliding = useRef<ReturnType<typeof glide>>(null)
  useLayoutEffect(() => {
    const drop = () => {
      const was = gliding.current
      gliding.current = null
      if (!was) return Infinity
      const height = was.list.getBoundingClientRect().height
      was.motion.cancel()
      was.list.style.overflowY = ""
      return height
    }
    const from = drop()
    const rows = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>(
        leaving ? "[data-leave]" : "[data-enter]"
      ) ?? []
    )
    if (!rows.length || (entered === null && !leaving)) return
    const now = glide(rows, leaving, from)
    gliding.current = now
    if (now && !leaving)
      now.motion.finished.then(
        () => gliding.current === now && drop(),
        () => {}
      )
  }, [entered, leaving])
  useEffect(
    () => () => {
      gliding.current?.motion.cancel()
    },
    []
  )

  const show = (next: number, e: React.MouseEvent<HTMLElement>) => {
    if (leaving) return
    const plain = () =>
      flushSync(() => {
        setEntered(null)
        setCount(next)
      })
    // On touch, with waves on, the tap plays the wave: it leaves the button
    // and carries the list to its new length, and the rows do not also come
    // in one by one. With a mouse the wave is hover-only (the button's own
    // hover wave is ended first: its snapshot would otherwise sit where the
    // button used to be), so the rows make the change themselves.
    if (isTap(e) && wavesOn()) {
      wave(sectionRef.current, plain, {
        source: e.currentTarget,
        focus: e.nativeEvent,
      })
      return
    }
    stopWaves(e.currentTarget)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return plain()
    if (next > count) {
      setEntered(count)
      setCount(next)
      return
    }
    // The extra rows drop out, then the list is its first page again.
    setLeaving(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(
      () => {
        setLeaving(false)
        setEntered(null)
        setCount(next)
      },
      200 + Math.min(count - next, STAGGER) * 30
    )
  }

  /** A row's part in the coming and going, by its place in the list. */
  const reveal = (i: number) =>
    leaving && i >= pageSize
      ? {
          "data-leave": "",
          style: { "--i": Math.min(count - 1 - i, STAGGER) } as CSSProperties,
        }
      : entered !== null && i >= entered
        ? {
            "data-enter": "",
            style: { "--i": Math.min(i - entered, STAGGER) } as CSSProperties,
          }
        : {}

  const hasMore = count < items.length
  const toggle: Toggle | null = hasMore
    ? { label: "Show more", onClick: (e) => show(items.length, e) }
    : count > pageSize
      ? { label: "Show less", onClick: (e) => show(pageSize, e) }
      : null

  return { sectionRef, visible: items.slice(0, count), toggle, reveal }
}

/** The button under an expandable list; nothing when the list fits its page. */
export function ShowMoreButton({ toggle }: { toggle: Toggle | null }) {
  if (!toggle) return null
  return (
    <div className="flex justify-center px-6 pt-8 md:px-12">
      <Button variant="pill" data-wave-manual onClick={toggle.onClick}>
        {toggle.label}
      </Button>
    </div>
  )
}
