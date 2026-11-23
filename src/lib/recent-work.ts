/**
 * The "Recent work" section's entries, written by hand here (not in the
 * /admin CMS). The section only shows at leo.dev/work, an unlisted link:
 * see src/routes/_site/work.index.tsx.
 */
export type RecentWork = {
  title: string
  /** One line on what it is. */
  summary: string
  /**
   * The mark shown before the title: a file in `public/`, drawn like the
   * experience logos (a 72px square). A work without one shows its first
   * letter.
   */
  logo?: string
  /** Clip the mark to a circle, for a logo drawn as one. */
  roundLogo?: boolean
  /** Who it was for, shown on the right. */
  client?: string
  /** Where the work was done, shown before the year. */
  location?: string
  /** When, written like the experience list's dates ("2025–'26"). */
  year: string
  /** The work's own page on this site (a route under /work). */
  to?: "/work/claude" | "/work/anthropic" | "/work/plasmic" | "/work/amo"
  /** An outside link, for a work without its own page. */
  href?: string
}

export const recentWork: Array<RecentWork> = [
  {
    title: "Anthropic.com Design System & Web Design",
    summary:
      "The design system, components and pages of the Anthropic website.",
    logo: "/logo-anthropic.svg",
    client: "Design Business Company",
    location: "Remote",
    year: "2026",
    to: "/work/anthropic",
  },
  {
    title: "Claude.com Design System & Web Design",
    summary:
      "The design system, patterns and pages of the Claude marketing website.",
    logo: "/logo-claude.svg",
    client: "Design Business Company",
    location: "Remote",
    year: "2025–'26",
    to: "/work/claude",
  },
  {
    title: "Plasmic",
    summary:
      "A visual tool for building React apps, year by year, rebuilt from the design files.",
    logo: "/logo-pl.svg",
    client: "Plasmic",
    location: "Remote",
    year: "2020–'24",
    to: "/work/plasmic",
  },
  {
    title: "iOS Contacts, Reimagined",
    summary:
      "What if Apple made the Contacts app better and more powerful? A one-day design exercise.",
    // (Amo's own mark: its whole wordmark, from its site's icon file at
    // amo.co, set across a white tile. The icon itself shows only the
    // first letter, cut off at the tile's edge, which Leo did not want:
    // 2026-11-23.)
    logo: "/logo-amo.svg",
    client: "Amo",
    year: "2023",
    to: "/work/amo",
  },
]
