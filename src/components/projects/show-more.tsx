import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"
import { isTap, stopWaves, wave } from "@/lib/wave"

type Toggle = {
  label: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

/**
 * How many rows each of the home page's sections starts with (Leo,
 * 2026-11-23: "for each section, show 3 listitems then show more").
 */
export const PAGE_SIZE = 3

/**
 * A list that starts with its first `pageSize` items and can be expanded to
 * all of them, then collapsed again. Put `sectionRef` on the section the list
 * sits in and render `<ShowMoreButton toggle={toggle} />` under the list.
 */
export function useShowMore<T>(items: Array<T>, pageSize = PAGE_SIZE) {
  const [count, setCount] = useState(pageSize)
  const sectionRef = useRef<HTMLDivElement>(null)

  const show = (next: number, e: React.MouseEvent<HTMLElement>) => {
    const update = () => flushSync(() => setCount(next))
    // On touch the tap plays the wave: it leaves the button and carries the
    // list to its new length. With a mouse the wave is hover-only, so the
    // list just changes (after ending the button's own hover wave, whose
    // snapshot would otherwise sit where the button used to be).
    if (isTap(e)) {
      wave(sectionRef.current, update, {
        source: e.currentTarget,
        focus: e.nativeEvent,
      })
    } else {
      stopWaves(e.currentTarget)
      update()
    }
  }

  const hasMore = count < items.length
  const toggle: Toggle | null = hasMore
    ? { label: "Show more", onClick: (e) => show(items.length, e) }
    : count > pageSize
      ? { label: "Show less", onClick: (e) => show(pageSize, e) }
      : null

  return { sectionRef, visible: items.slice(0, count), toggle }
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
