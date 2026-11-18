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
  to?: "/work/claude"
  /** An outside link, for a work without its own page. */
  href?: string
}

export const recentWork: Array<RecentWork> = [
  // Placeholder: replace before sharing the link.
  {
    title: "Placeholder work one",
    summary: "One line on what it is and what you did.",
    client: "Client",
    year: "2026",
    href: "https://example.com",
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
  // Placeholder: replace before sharing the link.
  {
    title: "Placeholder work three",
    summary: "One line on what it is and what you did.",
    year: "2025",
  },
]
