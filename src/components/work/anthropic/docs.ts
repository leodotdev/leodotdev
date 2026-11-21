// The topics of the Anthropic.com design system docs at /work/anthropic, in
// order. They are grouped and ordered as /work/claude's are (Leo,
// 2026-11-20): Atoms, the system's base (color, type, grids and spacing,
// effects, and the smallest pieces), then Molecules (buttons, fields, menus,
// and the pieces of a post), Organisms, and whole pages built from them. The
// Figma file (dZm6io2r5P76ME9UMu5ddo) puts its color, type, grids and
// effects on Foundations pages of their own, and its buttons and fields
// among its atoms; the docs do not. Each group is one page (a tab), and
// every topic is built live in HTML and CSS: the pages are in
// src/components/work/anthropic/pages, each area's styles in src/anthropic.

export type Doc = {
  slug: string
  title: string
  group: string
  summary: string
}

/** The system's five themes, the file's "Themes" collection. */
export const THEMES = [
  { id: "ivory", name: "Ivory" },
  { id: "ivory-medium", name: "Ivory Medium" },
  { id: "white", name: "White" },
  { id: "slate", name: "Slate" },
  { id: "image", name: "Image (High Contrast)" },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]

const doc = (
  group: string,
  slug: string,
  title: string,
  summary: string
): Doc => ({ slug, title, group, summary })

export const DOCS: Array<Doc> = [
  doc(
    "Atoms",
    "color",
    "Color",
    "Grays, sixteen secondary colors, and five themes built on them."
  ),
  doc(
    "Atoms",
    "typography",
    "Typography",
    "Sans and serif at every size, with drop caps and small caps for long reads."
  ),
  doc(
    "Atoms",
    "grids",
    "Grids & Spacing",
    "Five breakpoints, a twelve-column grid, and one scale of space."
  ),
  doc(
    "Atoms",
    "effects",
    "Effects",
    "A shadow, hover and focus rings, and twelve radii."
  ),
  doc(
    "Atoms",
    "captions",
    "Caption & Footnote",
    "Small print under media and at the foot of a page."
  ),
  doc(
    "Atoms",
    "rich-text",
    "Rich Text: Headline",
    "Headlines from H1 to a caption heading."
  ),
  doc("Atoms", "media", "Media", "Images and video in the system's frames."),
  doc(
    "Atoms",
    "powered-by-claude",
    "Powered by Claude",
    "The mark for what Claude made."
  ),

  doc(
    "Molecules",
    "buttons",
    "Buttons",
    "Three variants in four sizes, a play button, and a tiny more button."
  ),
  doc(
    "Molecules",
    "button-group",
    "Button Group",
    "Buttons set together, side by side or stacked."
  ),
  doc(
    "Molecules",
    "selection",
    "Radio & Checkbox",
    "Selection controls in three sizes, with their states."
  ),
  doc(
    "Molecules",
    "inputs",
    "Text Input & Select",
    "Fields in four sizes and six states, and a select."
  ),
  doc("Molecules", "slider", "Slider", "One value or a range, in three sizes."),
  doc("Molecules", "menu", "Menu", "Groups of items, with their states."),
  doc(
    "Molecules",
    "menu-button",
    "Menu Button, Topics & Date",
    "A post's topic and date, after a tiny more button that opens a menu."
  ),
  doc("Molecules", "tabs", "Tabs", "A row of views, one showing."),
  doc("Molecules", "pagination", "Pagination", "Pages of a long list."),
  doc(
    "Molecules",
    "audio-player",
    "Audio Player",
    "Listening to a post, with its controls."
  ),
  doc(
    "Molecules",
    "video",
    "Video",
    "A video's frame, and the cover that plays it."
  ),
  doc(
    "Molecules",
    "analysis-metadata",
    "Analysis Metadata",
    "Who wrote a piece, when, and about what."
  ),
  doc(
    "Molecules",
    "article-subnav",
    "Article Subnav",
    "A long piece's contents, kept in reach."
  ),

  doc(
    "Organisms",
    "navigation",
    "Header Navigation & Main Menu",
    "The site's header, its menus, and the menu opened wide."
  ),
  doc("Organisms", "footer", "Footer & Prefooter", ""),
  doc(
    "Organisms",
    "hero-carousel",
    "Hero Carousel",
    "Posts at the top of a page, one at a time."
  ),
  doc(
    "Organisms",
    "article",
    "Article Hero & Table of Contents",
    "The top of a long piece, and its contents beside it."
  ),
  doc("Organisms", "stats", "Stats", "Figures that make a point."),
  doc(
    "Organisms",
    "cards",
    "Asset, Tout & Case Study Cards",
    "Cards for posts, downloads, customers, and an index's grid."
  ),
  doc(
    "Organisms",
    "lists",
    "List Item, News Item & Related List",
    "Rows of posts and links."
  ),
  doc(
    "Organisms",
    "latest-updates",
    "Latest Updates",
    "The newest posts, wherever a page wants them."
  ),
  doc(
    "Organisms",
    "article-typography",
    "Article Typography",
    "A long piece's text: quotes, citations, footnotes, and drop caps."
  ),
  doc(
    "Organisms",
    "code-block",
    "Code Block & Claude Terminal",
    "Code to read, and Claude at work in a terminal."
  ),
  doc(
    "Organisms",
    "claude-narrator",
    "Claude Narrator",
    "Claude reading a piece aloud."
  ),
  doc(
    "Organisms",
    "tooltip",
    "Tooltip",
    "Notes, citations, and related reading, opened from the text."
  ),
  doc(
    "Organisms",
    "table",
    "Table & Table Card",
    "An index of posts to filter, sort, and open, and a card that holds a small table."
  ),
  doc(
    "Organisms",
    "form",
    "Form",
    "Fields, choices, and a button to send, in a piece or beside it."
  ),
  doc("Organisms", "accordion", "Accordion", "Rows that open and close."),
  doc(
    "Organisms",
    "fly-out",
    "Fly-out",
    "A case study in a panel that slides in from the side."
  ),
  doc(
    "Organisms",
    "quotes",
    "Quote Card & Quote Carousel",
    "What people say, one at a time or in a row."
  ),
  doc(
    "Organisms",
    "media-carousel",
    "Media Carousel & Video Playlist",
    "Pictures and videos under tabs, and a playlist beside its video."
  ),

  doc(
    "Templates",
    "about",
    "About",
    "The company's mission, team, values, and governance."
  ),
  doc(
    "Templates",
    "careers",
    "Careers",
    "Joining the company: its support, hiring, and questions."
  ),
  doc("Templates", "news", "News", "Every post, with the newest at the top."),
  doc(
    "Templates",
    "model",
    "Model",
    "A model's page: what it does, what it costs, and how it scores."
  ),
  doc(
    "Templates",
    "threat-intelligence",
    "Threat Intelligence",
    "A research team's page, with its reports."
  ),
  doc(
    "Templates",
    "economic-futures",
    "Economic Futures",
    "A research program's page, with its findings."
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
