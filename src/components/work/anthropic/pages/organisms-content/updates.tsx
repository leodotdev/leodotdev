import { useState } from "react"
import { TbArrowDown } from "react-icons/tb"
import { Button } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { stay } from "./shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Latest Updates: the file's "Latest Updates Module", a heading over a list
// of its "Updates Item" (a date, perhaps the "New" tag, a headline, a few
// lines, and "Read more"), and a "Load More" button under them.

const TEXT =
  "Inspired by the universality of scaling in statistical physics, we develop scaling laws to help us do systematic, empirically-driven research. We search for simple relations among data, compute, parameters, and performance of large-scale networks."

/** The file's "Updates Item". `isNew` is its "Show New". */
export function UpdatesItem({
  date = "Jan. 12, 2026",
  title = "Introducing Claude Opus 4.5",
  text = TEXT,
  isNew = false,
}: {
  date?: string
  title?: string
  text?: string
  isNew?: boolean
}) {
  return (
    <article className="ads-update">
      <div className="ads-update-meta">
        {isNew && <span className="ads-update-new">New</span>}
        <span>{date}</span>
      </div>
      <a className="ads-update-title" {...stay}>
        {title}
      </a>
      <p>{text}</p>
      <div>
        <Button variant="tertiary" size="small" icon="trailing">
          Read more
        </Button>
      </div>
    </article>
  )
}

// What the module holds: the file's two items, and two more for "Load
// More" to bring in.
const ITEMS = [
  { title: "Introducing Claude Opus 4.5", isNew: true },
  { title: "Introducing Claude Opus 4.5" },
  { title: "Laboriosam omnis voluptates quae deserunt qui natus eius." },
  { title: "Laboriosam omnis voluptates quae deserunt qui natus eius." },
]

/**
 * The file's "Latest Updates Module": the newest posts, and a button that
 * brings in more under them. Here it holds four, so one press shows them
 * all and the button goes.
 */
export function LatestUpdates({ step = 2 }: { step?: number }) {
  const [shown, setShown] = useState(step)
  return (
    <section className="ads-updates">
      <h4>Latest Updates</h4>
      <div className="ads-updates-list">
        {ITEMS.slice(0, shown).map((item, i) => (
          <UpdatesItem key={i} {...item} />
        ))}
      </div>
      {shown < ITEMS.length && (
        <Button
          variant="tertiary"
          icon="trailing"
          glyph={<TbArrowDown aria-hidden />}
          className="w-full"
          onClick={() => setShown(shown + step)}
        >
          Load More
        </Button>
      )}
    </section>
  )
}

// It looks over the two items' buttons, narrows the module as the file's
// tablet and phone frames do, lets it out, and loads the rest.
const UPDATES_DEMO: Array<DemoStep> = [
  { on: ".ads-update .ads-btn", nth: 0, rest: 800 },
  { on: ".ads-update .ads-btn", nth: 1, rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 560 },
  { on: ".cds-resize-grip", nth: 1, drag: 360 },
  { on: ".ads-update .ads-btn", nth: 0, rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: ".ads-updates > .ads-btn", click: true, rest: 600 },
  { on: ".ads-update .ads-btn", nth: 3, rest: 1200 },
]

export function LatestUpdatesDoc() {
  return (
    <Section caption="A date, the New tag on the newest, a headline, a few lines, and Read more. Load More brings in the next posts under them.">
      <Specimen figure>
        <DemoCursor steps={UPDATES_DEMO} className="p-6 md:p-8">
          <Resizable
            label="Module width"
            sizes={[["Desktop"], ["Tablet", 639], ["Mobile", 399]]}
            className="flex min-h-[1340px] justify-center overflow-hidden pt-16 sm:h-[1340px]"
          >
            <LatestUpdates />
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}
