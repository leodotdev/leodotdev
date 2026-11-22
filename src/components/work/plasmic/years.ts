import { DIVES_2020 } from "@/components/work/plasmic/y2020"
import { DIVES_2021 } from "@/components/work/plasmic/y2021"
import type { Year } from "@/components/work/plasmic/types"

// /work/plasmic's years, the tabs. A year with no dives yet shows in the
// overview as to come, with no tab. Each year's frames are in
// public/work/plasmic/<year>/.

export const YEARS: Array<Year> = [
  {
    slug: "2020",
    name: "2020",
    summary:
      "From the first dark comps to the light editor: the tree, artboards, variants, layout, tokens, and code.",
    dives: DIVES_2020,
  },
  {
    slug: "2021",
    name: "2021",
    summary:
      "Docked again: the project panel, behavioral components, recording from the canvas, data, preview, and the rail’s end.",
    dives: DIVES_2021,
  },
  { slug: "2022", name: "2022", summary: "", dives: [] },
  { slug: "2023", name: "2023", summary: "", dives: [] },
  { slug: "2024", name: "2024", summary: "", dives: [] },
]

export const findYear = (slug: string) => YEARS.find((y) => y.slug === slug)
