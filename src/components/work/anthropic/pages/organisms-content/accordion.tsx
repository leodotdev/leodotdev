import { useState } from "react"
import { TbChevronDown } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { SkelHeading, SkelText, stay } from "./shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Accordion: the file's "Accordion Item" (Default and Open: a count, a
// title, and a caret; open, the text and a button under them) and its
// "Accordion Card", which lists the topics an article covers.

const HIROSHIMA =
  "The Hiroshima AI commitments were announced in October 2023 at the G7 Summit. They aim to promote safe, secure, and trustworthy AI worldwide and provide voluntary guidance for actions by organizations developing the most advanced AI systems, with an emphasis on taking a risk-based approach. Below are the aims of the commitments. Please review the commitment documents (linked) to fully understand their scope and context."

export type AccordionEntry = { title: string; text?: string; count?: string }

/**
 * A list of the file's "Accordion Item": one open at a time. `hover` is one
 * of the two hovers the file explores on the card: the row under the
 * pointer filled as a table's row is ("row"), or its siblings dimmed
 * ("dim").
 */
export function Accordion({
  items,
  initial = null,
  hover,
}: {
  items: Array<AccordionEntry>
  initial?: number | null
  hover?: "row" | "dim"
}) {
  const [open, setOpen] = useState<number | null>(initial)
  return (
    <div className="ads-accordion" data-hover={hover}>
      {items.map(({ title, text = HIROSHIMA, count }, i) => (
        <div
          key={i}
          className="ads-accordion-item"
          data-open={open === i ? "" : undefined}
        >
          <button
            type="button"
            className="ads-accordion-row"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            {...quiet}
          >
            <span className="ads-accordion-count">
              {count ?? String(i + 1).padStart(2, "0")}
            </span>
            <span className="ads-accordion-title">{title}</span>
            <TbChevronDown aria-hidden />
          </button>
          <div className="ads-accordion-panel">
            <div>
              <div className="ads-accordion-body">
                <p>{text}</p>
                <div>
                  <Button
                    size="small"
                    icon="trailing"
                    tabIndex={open === i ? 0 : -1}
                  >
                    View more
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const TOPICS: Array<AccordionEntry> = [
  { title: "Agents" },
  { title: "Economic Impacts" },
  {
    title: "How do we know if an AI system is safe to deploy?",
    text: "Safety evaluation involves red-teaming, benchmarks, and real-world testing to identify potential harms before deployment. No single test is sufficient.",
  },
  { title: "Responsible Scaling Policy" },
]

/**
 * The file's "Accordion Card": "Topics covered in this article", a line
 * that links each, and the topics as an accordion.
 */
export function AccordionCard({ hover }: { hover?: "row" | "dim" }) {
  return (
    <div className="ads-accordion-card">
      <div className="ads-accordion-card-head">
        <h4>Topics covered in this article</h4>
        <p>
          This research explores <a {...stay}>Agents</a>,{" "}
          <a {...stay}>Economic Impacts</a>,{" "}
          <a {...stay}>Responsible Scaling Policy</a>, and{" "}
          <a {...stay}>How do we know if an AI system is safe to deploy?</a> —
          testing how AI bridges digital and physical worlds, measuring
          productivity uplift, and tracking capability thresholds that inform
          safety protocols.
        </p>
      </div>
      <Accordion items={TOPICS} initial={2} hover={hover} />
    </div>
  )
}

const ITEMS: Array<AccordionEntry> = [
  { title: "Item Title", count: "01" },
  { title: "Item Title", count: "01" },
  {
    title:
      "Item title with a lengthy character count that will stack on mobile",
    count: "01",
  },
  { title: "Item Title", count: "01" },
  { title: "Item Title", count: "01" },
]

// It opens the third row (which closes the second), reads it, and opens
// the second again.
const ITEMS_DEMO: Array<DemoStep> = [
  { on: ".ads-accordion-row", nth: 2, click: "open", rest: 500 },
  { on: ".ads-accordion-item[data-open] p", rest: 1400 },
  { on: ".ads-accordion-row", nth: 4, rest: 600 },
  { on: ".ads-accordion-row", nth: 1, click: "open", rest: 500 },
  { on: ".ads-accordion-item[data-open] p", rest: 1400 },
]

// It looks down the card's rows (each hover as the figure has it), opens
// the first, and opens the third again.
const CARD_DEMO: Array<DemoStep> = [
  { on: ".ads-accordion-row", nth: 0, rest: 700 },
  { on: ".ads-accordion-row", nth: 1, rest: 700 },
  { on: ".ads-accordion-row", nth: 0, click: "open", rest: 500 },
  { on: ".ads-accordion-item[data-open] .ads-btn", rest: 1000 },
  { on: ".ads-accordion-row", nth: 3, rest: 700 },
  { on: ".ads-accordion-row", nth: 2, click: "open", rest: 1200 },
]

const RESIZE_DEMO: Array<DemoStep> = [
  { on: ".ads-accordion-row", nth: 1, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 560 },
  { on: ".cds-resize-grip", nth: 1, drag: 360 },
  { on: ".ads-accordion-item[data-open] .ads-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function AccordionDoc() {
  return (
    <>
      <Section
        title="Accordion Item"
        caption="Two states, Default and Open: a count, a title, and a caret, and, open, the text and a button under them."
      >
        <Specimen figure>
          <DemoCursor
            steps={ITEMS_DEMO}
            className="flex justify-center px-6 py-16 md:px-8"
          >
            <div className="w-full max-w-[440px]">
              <Accordion items={ITEMS} initial={1} hover="row" />
            </div>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Accordion Card"
        caption="The topics an article covers, linked in a line and listed as an accordion. The file explores two hovers: a row filled like a table’s, and its siblings dimmed."
      >
        <Specimen figure>
          <DemoCursor steps={RESIZE_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Card width"
              sizes={[["Desktop"], ["Mobile", 479]]}
              className="flex min-h-[1120px] justify-center sm:h-[1120px]"
            >
              <div className="ads-oc-c ads-accordion-page">
                <SkelHeading line={false} />
                <SkelText count={3} />
                <AccordionCard hover="row" />
                <SkelText count={4} />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor
            steps={CARD_DEMO}
            className="flex justify-center px-6 py-16 md:px-8"
          >
            <div className="w-full max-w-[540px]">
              <AccordionCard hover="dim" />
            </div>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
