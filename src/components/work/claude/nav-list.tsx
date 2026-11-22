import { useEffect, useRef, useState } from "react"
import { TbChevronLeft, TbChevronRight } from "react-icons/tb"
import { cn } from "@/lib/utils"

/**
 * The docs' row of tabs (`NavRow`): each name swaps the whole page under
 * it. The names are muted except the current one, which is heavier and in
 * the text color (`aria-current`). The styles are `.nav-list` in
 * src/styles.css. (The chapters under the tabs are a bar of their own,
 * `ChapterNav`.)
 *
 * The entries are whatever links the caller needs (a router link, a plain
 * anchor) with the class `nav-link`, each wrapping its name in a `NavLabel`.
 */
export function NavList({
  label,
  orientation,
  className,
  ref,
  children,
}: {
  /** What the list is for, read out by screen readers. */
  label: string
  /**
   * A horizontal list scrolls sideways when it runs out of room. A vertical
   * one is a column from 1024px and a wrapping row below that.
   */
  orientation: "horizontal" | "vertical"
  className?: string
  ref?: React.Ref<HTMLElement>
  children: React.ReactNode
}) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      data-orientation={orientation}
      className={cn(
        "nav-list",
        orientation === "horizontal" && "scrollbar-hide",
        className
      )}
    >
      {children}
    </nav>
  )
}

/**
 * A horizontal `NavList` that scrolls sideways when it runs out of room,
 * with an arrow button over whichever end has entries out of sight, and the
 * current entry kept in view, clear of those buttons: the docs' tabs.
 */
export function NavRow({
  label,
  current,
  className,
  children,
}: {
  label: string
  /** Changes when the current entry does, to bring the new one into view. */
  current: string
  className?: string
  children: React.ReactNode
}) {
  const row = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = row.current
    const entry = el?.querySelector<HTMLElement>("[aria-current]")
    if (!el || !entry) return
    const start = entry.offsetLeft - 48
    const end = entry.offsetLeft + entry.offsetWidth + 48 - el.clientWidth
    if (el.scrollLeft > start) el.scrollLeft = start
    else if (el.scrollLeft < end) el.scrollLeft = end
  }, [current])

  // Which sides have entries out of sight: each gets an arrow button.
  const [hidden, setHidden] = useState({ left: false, right: false })
  const measure = () => {
    const el = row.current
    if (!el) return
    const left = el.scrollLeft > 4
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    setHidden((was) =>
      was.left === left && was.right === right ? was : { left, right }
    )
  }
  useEffect(() => {
    const el = row.current
    if (!el) return
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // The entries themselves can change (another page's chapters) without
    // the row changing size. Watched for, not re-measured after every
    // render: that ran into React's limit on updates from effects on a long
    // row of names.
    const entries = new MutationObserver(measure)
    entries.observe(el, { childList: true, subtree: true, characterData: true })
    el.addEventListener("scroll", measure, { passive: true })
    return () => {
      observer.disconnect()
      entries.disconnect()
      el.removeEventListener("scroll", measure)
    }
  }, [])

  const page = (direction: 1 | -1) => {
    const el = row.current
    if (!el) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({
      left: direction * el.clientWidth * 0.7,
      behavior: still ? "auto" : "smooth",
    })
  }

  return (
    <div className={cn("relative flex min-w-0", className)}>
      <NavList ref={row} label={label} orientation="horizontal">
        {children}
      </NavList>
      {/* For the mouse and touch only: the keyboard reaches every entry by
          tabbing, which scrolls it into view. */}
      {hidden.left && (
        <div className="nav-list-more -left-1 bg-linear-to-r pr-6 pl-1">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => page(-1)}
          >
            <TbChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}
      {hidden.right && (
        <div className="nav-list-more -right-1 bg-linear-to-l pr-1 pl-6">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => page(1)}
          >
            <TbChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * An entry's name. It reserves the width of its heavier, current form (a
 * hidden copy), so the list does not shift when the current entry changes.
 */
export function NavLabel({ children }: { children: string }) {
  return (
    <span className="nav-label" data-label={children}>
      {children}
    </span>
  )
}
