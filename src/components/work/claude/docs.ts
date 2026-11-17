import chapters from "@/lib/claude-work.json"
import type { GalleryFrame } from "@/components/work/frame-gallery"

// The topics of the Claude.com design system docs at /work/claude, in order.
// Each group of topics is one page (a tab). A "live" topic is built in HTML and
// CSS (src/components/work/claude/pages); a "frames" topic still shows frames
// exported from the Figma file and is replaced by a live one as it is rebuilt.

export type Doc = {
  slug: string
  title: string
  group: string
  summary: string
} & (
  | { kind: "live" }
  | { kind: "frames"; ratio: number; frames: Array<GalleryFrame> }
)

// The five palettes claude.com ships: its main, accent and neutral themes,
// and the two they switch to in dark mode.
export const THEMES = [
  { id: "white", name: "White" },
  { id: "ivory", name: "Ivory" },
  { id: "neutral-1", name: "Neutral 1" },
  { id: "dark-2", name: "Dark 2" },
  { id: "dark-3", name: "Dark 3" },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]

const chapter = (title: string) => {
  const found = chapters.find((c) => c.title === title)
  if (!found) throw new Error(`No chapter called ${title}`)
  return found
}

const live = (
  group: string,
  slug: string,
  title: string,
  summary: string
): Doc => ({ slug, title, group, summary, kind: "live" })

/** A frames page: some groups of a chapter's frames (all of them if no labels). */
function frames(
  group: string,
  slug: string,
  title: string,
  summary: string,
  chapterTitle: string,
  labels?: Array<string>
): Doc {
  const source = chapter(chapterTitle)
  return {
    slug,
    title,
    group,
    summary,
    kind: "frames",
    ratio: labels ? 16 / 9 : source.ratio,
    frames: labels
      ? labels.flatMap((label) =>
          source.frames.filter((f) => f.label === label)
        )
      : source.frames,
  }
}

export const DOCS: Array<Doc> = [
  live(
    "Foundations",
    "color",
    "Color",
    "A warm neutral ramp, six secondary colours, Clay, and five themes."
  ),
  live(
    "Foundations",
    "typography",
    "Typography",
    "Three families and fifteen text styles."
  ),
  live(
    "Foundations",
    "layout",
    "Layout",
    "The grid, spacing units, radii and shadow."
  ),
  frames(
    "Foundations",
    "iconography",
    "Iconography",
    "Icons, pictograms and illustrations.",
    "Atoms",
    ["Iconography"]
  ),

  live(
    "Components",
    "buttons",
    "Buttons and links",
    "Four button variants in three sizes, and three kinds of link."
  ),
  live(
    "Components",
    "forms",
    "Forms",
    "Text input, checkbox, radio and switch."
  ),
  live(
    "Components",
    "overlays",
    "Menu and tooltip",
    "Three kinds of menu, and a tooltip for inline terms."
  ),

  live(
    "Patterns",
    "navigation",
    "Navigation",
    "The site header, with its menus and breadcrumb bar."
  ),
  frames(
    "Patterns",
    "footer",
    "Footer and headers",
    "The footer on every breakpoint, and section headers.",
    "Organisms",
    ["Footer", "Headers"]
  ),
  live(
    "Patterns",
    "heroes",
    "Heroes and features",
    "Three page-hero layouts, and feature highlights."
  ),
  live(
    "Patterns",
    "cards",
    "Cards and prompts",
    "Link and video cards, the prompt box and clipboard copy."
  ),
  frames(
    "Patterns",
    "artifacts",
    "Artifacts and marginalia",
    "The artifact viewer on every breakpoint, and the cards that sit beside long pages.",
    "Organisms",
    ["Artifacts", "Marginalia"]
  ),
  live(
    "Patterns",
    "disclosure",
    "Tabs and disclosure",
    "Tabs, select, accordion and carousel."
  ),
  live(
    "Patterns",
    "proof",
    "Proof",
    "Quotes, proof cards, testimonials and customer-story details."
  ),
  frames(
    "Patterns",
    "media",
    "Logo wall and video",
    "The logo wall, the video lightbox and the video reel.",
    "Organisms",
    ["Logo Wall", "Video: Lightbox", "Video: Reel"]
  ),

  frames(
    "Pages",
    "templates",
    "Templates",
    "The site's pages, on desktop and mobile.",
    "Templates"
  ),
  frames(
    "Pages",
    "partner-pages",
    "Partner pages",
    "Partner, startup, campus, contact and newsletter pages.",
    "Partner and program pages"
  ),
]

/** The docs' tabs after Overview: one page per group. */
export const GROUPS = [...new Set(DOCS.map((d) => d.group))].map((name) => ({
  name,
  slug: name.toLowerCase(),
  docs: DOCS.filter((d) => d.group === name),
}))

export const findGroup = (groupSlug: string) =>
  GROUPS.find((g) => g.slug === groupSlug)
