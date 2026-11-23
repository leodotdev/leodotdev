import { YEARS } from "@/components/work/plasmic/years"
import type { Note, Scene } from "@/components/work/plasmic/types"

// What can be said of a part under the visitor's pointer, and where to go
// to read more of it (Leo, 2026-11-22: "if a user hovers over any element
// we can explain, pause the show and reveal an annotation explaining that
// element. and they should be able to click and go a dive of that
// element"). Nothing new is written for it: a part's explanation is a note
// some scene already pins to it, and its dive is the one with the most to
// say of it, a set of its versions counting for the most.

/** A dive to go to. */
export type Target = {
  year: string
  name: string
  slug: string
  title: string
  /** The dive's own line, said of a part that has no note of its own. */
  summary: string
}

type Guide = {
  /** A part's note, by the view that draws it. */
  views: Map<Scene["view"], Map<string, Note>>
  /** A part's note, by the year it is in. */
  years: Map<string, Map<string, Note>>
  /** The dives with something on a part, the most first. */
  dives: Map<string, Array<Target & { score: number }>>
}

let guide: Guide | null = null

function build(): Guide {
  const views: Guide["views"] = new Map()
  const years: Guide["years"] = new Map()
  const dives: Guide["dives"] = new Map()
  // How a system works is the first thing to say of a part; then anything.
  const keep = (into: Map<string, Note>, note: Note, part: string) => {
    const has = into.get(part)
    if (!has || (has.kind !== "concept" && note.kind === "concept"))
      into.set(part, note)
  }
  for (const year of YEARS) {
    const inYear = new Map<string, Note>()
    years.set(year.slug, inYear)
    for (const dive of year.dives) {
      const scores = new Map<string, number>()
      const add = (part: string, by: number) =>
        scores.set(part, (scores.get(part) ?? 0) + by)
      for (const scene of dive.scenes) {
        const inView = views.get(scene.view) ?? new Map<string, Note>()
        views.set(scene.view, inView)
        for (const note of scene.notes ?? []) {
          if (typeof note.on !== "string") continue
          keep(inView, note, note.on)
          keep(inYear, note, note.on)
          add(note.on, 1)
        }
        if (scene.explore && typeof scene.explore.on === "string")
          add(scene.explore.on, 100)
      }
      for (const [part, score] of scores) {
        const list = dives.get(part) ?? []
        dives.set(part, list)
        list.push({
          year: year.slug,
          name: year.name,
          slug: dive.slug,
          title: dive.title,
          summary: dive.summary,
          score,
        })
      }
    }
  }
  for (const list of dives.values()) list.sort((a, b) => b.score - a.score)
  return { views, years, dives }
}

/** What there is to say of a part, as a scene's view in a year draws it. */
export function explain(view: Scene["view"], year: string, part: string) {
  guide ??= build()
  return guide.views.get(view)?.get(part) ?? guide.years.get(year)?.get(part)
}

/**
 * The dive to read more of a part in: the one with the most on it that is
 * not the dive already showing, and that has more than a passing note
 * unless it is a set of the part's versions.
 */
export function diveOf(part: string, here: { year: string; slug: string }) {
  guide ??= build()
  // A set of the part's versions first, then a dive of the year on the
  // stage, then whichever says the most.
  const rank = (d: Target & { score: number }) =>
    (d.score >= 100 ? 2000 : 0) + (d.year === here.year ? 1000 : 0) + d.score
  return guide.dives
    .get(part)
    ?.filter(
      (d) => !(d.year === here.year && d.slug === here.slug) && d.score >= 2
    )
    .sort((a, b) => rank(b) - rank(a))
    .at(0)
}
