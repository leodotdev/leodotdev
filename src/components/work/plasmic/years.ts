import { inline } from "@/components/work/plasmic/inline"
import { DIVES_2020 } from "@/components/work/plasmic/y2020"
import { DIVES_2021 } from "@/components/work/plasmic/y2021"
import { DIVES_2022 } from "@/components/work/plasmic/y2022"
import { DIVES_2023 } from "@/components/work/plasmic/y2023"
import { DIVES_BEFORE } from "@/components/work/plasmic/ybefore"
import type { Year } from "@/components/work/plasmic/types"

// /work/plasmic's tabs after the Overview: the research before 2020, then
// the years. One with no dives yet shows in the overview as to come, with
// no tab. Each one's dives are rebuilt in HTML (ybefore.tsx, y2020.tsx …
// y2023.tsx, with the kit in kit/). The research has a tab of its own
// (Leo, 2026-11-23: "i dont like it on overview", whose stage used to play
// it).

export const YEARS: Array<Year> = [
  {
    slug: "research",
    name: "Research",
    summary:
      "Before 2020: naming the parts, regrouping them, and a north star.",
    dives: inline(DIVES_BEFORE),
  },
  {
    slug: "2020",
    name: "2020",
    summary:
      "From the first dark comps to the light editor: the tree, arenas panned and zoomed, variants, layout, tokens, a team at once, and code with its history.",
    dives: inline(DIVES_2020),
  },
  {
    slug: "2021",
    name: "2021",
    summary:
      "Docked again: the project panel, behavioral components, recording from the canvas, data, teams and plans, a codebase connected, and the rail’s end.",
    dives: inline(DIVES_2021),
  },
  {
    slug: "2022",
    name: "2022",
    summary:
      "Panels as tabs; the ribbon, a concept car with every control over the canvas; A/B tests and a CMS; the way back to a rail; components that act; and a site’s settings.",
    dives: inline(DIVES_2022),
  },
  {
    slug: "2023",
    name: "2023",
    summary:
      "Breadcrumbs, a team on one page, branches, publishing with tests, Logic, an app builder, and Copilot.",
    dives: inline(DIVES_2023),
  },
  { slug: "2024", name: "2024", summary: "", dives: [] },
]

export const findYear = (slug: string) => YEARS.find((y) => y.slug === slug)
