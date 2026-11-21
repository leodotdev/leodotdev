import { cn } from "@/lib/utils"

// The Anthropic wordmark and its "A" mark, as exported from the system's
// Figma file (public/work/anthropic/organisms-site/). In the file they are
// set as type with a ligature of Anthropic Sans; the exports are outlines.
// Each is drawn as a mask filled with the text color, so the logo takes the
// color of the theme it sits in, as the file's logos do.

const SRC = "/work/anthropic/organisms-site"

/** The wordmark, "ANTHROP\C". */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Anthropic"
      className={cn("ads-logo ads-logo-word", className)}
      style={{ "--logo": `url(${SRC}/wordmark.svg)` } as React.CSSProperties}
    />
  )
}

/** The "A" mark the header and footer use where the wordmark has no room. */
export function Mark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Anthropic"
      className={cn("ads-logo ads-logo-mark", className)}
      style={{ "--logo": `url(${SRC}/mark.svg)` } as React.CSSProperties}
    />
  )
}

/** The four social links of the footer and the expanded menu, in their order. */
export const SOCIALS = [
  ["YouTube", "youtube"],
  ["Instagram", "instagram"],
  ["X", "x"],
  ["LinkedIn", "linkedin"],
] as const

/** A social link's icon, exported from the file, in the text color. */
export function Social({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="ads-logo ads-social-icon"
      style={{ "--logo": `url(${SRC}/${name}.svg)` } as React.CSSProperties}
    />
  )
}
