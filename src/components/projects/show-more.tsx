import { useEffect, useRef, useState } from "react"
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
 * A list that starts with its first `pageSize` items and can be expanded to
 * all of them, then collapsed again. Put `sectionRef` on the section the list
 * sits in, spread `reveal(i)` on each row, and render
 * `<ShowMoreButton toggle={toggle} />` under the list.
 *
 * The rows let in come up one after another, each on the site's spring, and
 * the rows sent away drop out the same way, the last first, before the list
 * shortens (Leo, 2026-11-23: "staggered bouncy reveals/intros and outros";
 * `[data-enter]` and `[data-leave]` in src/styles.css). Under reduced motion
 * the list simply changes.
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
