import { TbDots, TbX } from "react-icons/tb"
import { quiet } from "@/components/work/anthropic/specimens"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { cn } from "@/lib/utils"

// Pieces the content organisms share: the file's "Tiny More Button", the
// "Menu, Topic, Date" line over a post, the pictures the file's samples use,
// and a few skeleton blocks for the pages they sit on.

/** Where this area's pictures are (exported from the Figma file). */
export const ART = "/work/anthropic/organisms-content"

/**
 * The file's "Tiny More Button": a pill with three dots, or, once what it
 * opens is open, a dark one with a cross.
 */
export function TinyMore({
  open = false,
  label = "More",
  className,
  ...rest
}: {
  open?: boolean
  label?: string
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      type="button"
      className={cn("ads-tiny-more", className)}
      aria-label={open ? "Close" : label}
      aria-expanded={open}
      {...quiet}
      {...rest}
    >
      {open ? <TbX aria-hidden /> : <TbDots aria-hidden />}
    </button>
  )
}

/** The file's "Menu, Topic, Date": the more button, a topic, and a date. */
export function MenuTopicDate({
  tag = "Announcement",
  date = "Jan. 30, 2026",
  more = true,
  className,
}: {
  tag?: string | null
  date?: string
  more?: boolean
  className?: string
}) {
  return (
    <div className={cn("ads-mtd", className)}>
      {more && <TinyMore />}
      {tag && <span>{tag}</span>}
      <span>{date}</span>
    </div>
  )
}

/** A link that goes nowhere, for the samples' titles and buttons. */
export const stay = {
  href: "#",
  onClick: (e: React.MouseEvent) => e.preventDefault(),
  ...quiet,
}

/** A heading over a line, as a section of a page opens. */
export function SkelHeading({
  line = true,
  center = false,
}: {
  line?: boolean
  center?: boolean
}) {
  return (
    <div
      className="ads-oc-skel-heading"
      data-center={center ? "" : undefined}
      aria-hidden
    >
      <Bar w="min(360px, 70%)" h={28} />
      {line && <Bar w="min(260px, 50%)" />}
    </div>
  )
}

/** A stretch of an article's running text. */
export function SkelText({ count = 4 }: { count?: number }) {
  return <Lines count={count} className="ads-oc-skel-text" />
}

/** The top of the site's header: the logo at the left, links at the right. */
export function SkelNav() {
  return (
    <div className="ads-oc-skel-nav" aria-hidden>
      <Bar w={112} h={20} />
      <span>
        {[64, 56, 72, 48].map((w) => (
          <Bar key={w} w={w} />
        ))}
        <Bar w={92} h={32} r={8} className="cds-skel-solid" />
      </span>
    </div>
  )
}
