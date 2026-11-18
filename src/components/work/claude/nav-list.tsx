import { cn } from "@/lib/utils"

/**
 * The docs' one kind of navigation, used twice. Across the top it is the
 * tabs: each name swaps the whole page under it. Down the side it is a
 * page's chapters: each name scrolls to its chapter, and the one in view is
 * marked. Both are the same row of names, muted except the current one,
 * which is heavier and in the text color (`aria-current`); only the direction
 * differs. The styles are `.nav-list` in src/styles.css.
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
