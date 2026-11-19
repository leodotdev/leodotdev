import chapters from "@/lib/claude-work.json"
import type { GalleryFrame } from "@/components/work/frame-gallery"

// The topics of the Claude.com design system docs at /work/claude, in order.
// They are grouped the way the system's Figma file is, by its four pages:
// Atoms (color, type, grid, icons), Molecules (buttons, links, inputs, menus),
// Organisms (the sections built from them) and Templates (whole pages). Each
// group of topics is one page (a tab). A "live" topic is built in HTML and
// CSS (src/components/work/claude/pages); a "frames" topic shows frames
// exported from the Figma file. Only the Templates group is frames now: whole
// pages, kept as pictures.

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
    "Atoms",
    "color",
    "Color",
    "A warm neutral ramp, six secondary colors, Clay, and five themes."
  ),
  live(
    "Atoms",
    "typography",
    "Typography",
    "Three families and fifteen text styles."
  ),
  live(
    "Atoms",
    "layout",
    "Layout",
    "The grid, spacing units, radii and shadow."
  ),
  live(
    "Atoms",
    "iconography",
    "Iconography",
    "Illustrations and pictograms, in three sizes and on every theme."
  ),

  live(
    "Molecules",
    "buttons",
    "Buttons & Links",
    "Four button variants in three sizes, and three kinds of link."
  ),
  live(
    "Molecules",
    "forms",
    "Forms",
    "Text input, checkbox, radio and switch."
  ),
  live(
    "Molecules",
    "menu",
    "Menus",
    "Navigation menus, prompt suggestions and page actions."
  ),
  live(
    "Molecules",
    "tooltip",
    "Tooltip",
    "A short explanation for a term in running text."
  ),

  live(
    "Organisms",
    "navigation",
    "Navigation",
    "The site header, with its menus and breadcrumb bar."
  ),
  live(
    "Organisms",
    "headers",
    "Headers & Footer",
    "Section headers in five sizes, and the site footer."
  ),
  live("Organisms", "heroes", "Page Heroes", "Three page-hero layouts."),
  live(
    "Organisms",
    "features",
    "Feature Highlight",
    "An icon, a title and a paragraph, in columns or across the page."
  ),
  live(
    "Organisms",
    "cards",
    "Cards & Prompts",
    "Link and video cards, the prompt box and clipboard copy."
  ),
  live(
    "Organisms",
    "artifacts",
    "Artifacts & Marginalia",
    "The artifact viewer, and the cards that sit beside long pages."
  ),
  live(
    "Organisms",
    "tabs",
    "Tabs",
    "A segmented control in three sizes, with an overflow menu."
  ),
  live("Organisms", "select", "Select", "A field that opens a list."),
  live("Organisms", "accordion", "Accordion", "Rows that open and close."),
  live(
    "Organisms",
    "carousel",
    "Carousel",
    "Bullets between a previous and a next button."
  ),
  live(
    "Organisms",
    "proof",
    "Proof",
    "Quotes, proof cards, testimonials and customer-story details."
  ),
  live(
    "Organisms",
    "media",
    "Logo Wall & Video",
    "The logo wall, the video lightbox and the video reel."
  ),

  frames(
    "Templates",
    "templates",
    "Templates",
    "The site's pages, on desktop and mobile.",
    "Templates"
  ),
  frames(
    "Templates",
    "b2b-pages",
    "Templates: B2B Pages",
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
