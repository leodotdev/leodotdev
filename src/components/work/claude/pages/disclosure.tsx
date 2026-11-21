import { useState } from "react"
import {
  TbBook,
  TbBulb,
  TbChartBar,
  TbChevronDown,
  TbCode,
  TbDots,
  TbMinus,
  TbPlus,
  TbSearch,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Deck } from "@/components/work/claude/deck"
import { Button } from "@/components/work/claude/specimens"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import {
  SkeletonCards,
  SkeletonContext,
  SkeletonHeader,
} from "@/components/work/claude/skeleton"
import { Cell, Figure, Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const VIEWS = [
  ["Learn", TbBook],
  ["Code", TbCode],
  ["Research", TbSearch],
  ["Analyze", TbChartBar],
  ["Create", TbBulb],
] as const

/**
 * Tabs. With `max`, the tabs beyond it move into an overflow menu behind a
 * "more" button; picking one shows it in that slot as the current tab.
 */
export function Tabs({
  size = "medium",
  icons = false,
  max = VIEWS.length,
}: {
  size?: "small" | "medium" | "large"
  icons?: boolean
  max?: number
}) {
  const [current, setCurrent] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const overflow = VIEWS.slice(max)

  return (
    <div ref={ref} className="cds-tabs" data-size={size} role="tablist">
      {VIEWS.slice(0, max).map(([label, Icon], i) => (
        <button
          key={label}
          type="button"
          role="tab"
          className="cds-tab"
          aria-selected={current === i}
          data-icon={icons ? "" : undefined}
          onClick={() => setCurrent(i)}
          {...quiet}
        >
          {icons && <Icon aria-hidden />}
          {label}
        </button>
      ))}
      {overflow.length > 0 && (
        <>
          <button
            type="button"
            className="cds-tab"
            aria-selected={current >= max}
            aria-expanded={open}
            aria-label={current >= max ? undefined : "More"}
            onClick={() => setOpen(!open)}
            {...quiet}
          >
            {current >= max && VIEWS[current][0]}
            <TbDots aria-hidden />
          </button>
          {open && (
            <div className="cds-menu">
              {overflow.map(([label], i) => (
                <button
                  key={label}
                  type="button"
                  className="cds-menu-item"
                  onClick={() => {
                    setCurrent(max + i)
                    setOpen(false)
                  }}
                  {...quiet}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function Select() {
  const [current, setCurrent] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const [label, Icon] = VIEWS[current]

  return (
    <div ref={ref} className="cds-select-wrap">
      <button
        type="button"
        className="cds-select"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        {...quiet}
      >
        <Icon aria-hidden />
        <span>{label}</span>
        <TbChevronDown aria-hidden />
      </button>
      {open && (
        <div className="cds-menu" role="listbox">
          {VIEWS.map(([option, OptionIcon], i) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={current === i}
              className="cds-menu-item"
              onClick={() => {
                setCurrent(i)
                setOpen(false)
              }}
              {...quiet}
            >
              <OptionIcon aria-hidden />
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// The file's own specimen: the same question twice, one open and one closed.
const QUESTION = "How do I get started with Claude?"
const ANSWER =
  "There are two ways to access Claude Code: with your Claude Pro or Max subscription, or with an Anthropic Console account. In both cases, you can download Claude Code using these instructions and then sign in with your respective Claude or Console account."

export function Accordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="cds-accordion">
      {[0, 1].map((i) => (
        <div key={i} className="cds-accordion-item">
          <button
            type="button"
            className="cds-accordion-head"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            {...quiet}
          >
            {QUESTION}
            {open === i ? <TbMinus aria-hidden /> : <TbPlus aria-hidden />}
          </button>
          {open === i && <div className="cds-accordion-body">{ANSWER}</div>}
        </div>
      ))}
    </div>
  )
}

// The deck's cards: customer stories, as the site's margins carry them.
const STORIES = [
  ["asana.svg", "Asana", "Asana supercharges work management with Claude"],
  [
    "google-cloud.svg",
    "Google Cloud",
    "Building on Google Cloud’s Vertex AI with Claude",
  ],
  ["asana.svg", "Asana", "How Asana’s teams plan their work with Claude"],
] as const

/**
 * The carousel as the site uses it: a deck of marginalia cards, the current
 * one on top and the next leaning out from behind it, over the controls
 * (`Deck`, which is claude.com's own).
 */
export function Carousel() {
  return (
    <Deck
      cards={STORIES.map(([file, name, text], i) => (
        <div key={i} className="cds-margin">
          <div className="cds-margin-card">
            <div className="cds-margin-head">Customer story</div>
            <img
              className="cds-margin-logo"
              src={`/work/claude/logos/${file}`}
              alt={name}
            />
            <p>{text}</p>
            <div>
              <Button variant="tertiary" size="small" icon="none">
                Read story
              </Button>
            </div>
          </div>
        </div>
      ))}
    />
  )
}

// What the demo cursor tries on the tabs figure. The figure has five sets of
// tabs with the same names, so a step says which set it means (`nth`): the
// first, the medium and large ones, and the last, whose overflow menu it
// opens to pick a tab from. It ends with every set back on its first tab.
const TABS_DEMO: Array<DemoStep> = [
  { on: '[aria-expanded="true"]', click: "close", rest: 200 },
  { on: ".cds-tab", text: "Code", click: true },
  { on: ".cds-tab", text: "Research", click: true },
  { on: ".cds-tab", text: "Create", click: true },
  { on: ".cds-tab", text: "Code", nth: 2, click: true },
  { on: ".cds-tab", text: "Research", nth: 3, click: true },
  { on: ".cds-tab[aria-expanded]", nth: 3, click: "open" },
  { on: ".cds-menu-item", text: "Analyze" },
  { on: ".cds-menu-item", text: "Create", click: true },
  { on: ".cds-tab", text: "Learn", nth: 4, click: true, rest: 600 },
  { on: ".cds-tab", text: "Learn", nth: 3, click: true },
  { on: ".cds-tab", text: "Learn", nth: 2, click: true },
  { on: ".cds-tab", text: "Learn", click: true, rest: 700 },
]

export function TabsDoc() {
  return (
    <>
      <Section caption="When tabs run out of room they overflow into a menu.">
        <Specimen figure>
          <DemoCursor
            steps={TABS_DEMO}
            // Each label and its row of tabs sit on the figure's center line.
            className="grid grid-cols-[auto] justify-center justify-items-center gap-x-8 gap-y-8 px-6 py-28 md:px-8 [&>div]:items-center"
          >
            <Cell label="With icons">
              <Tabs icons />
            </Cell>
            <Cell label="Small, medium, large" className="flex-col">
              <Tabs size="small" max={3} />
              <Tabs max={3} />
              <Tabs size="large" max={3} />
            </Cell>
            <Cell label="Overflow menu">
              <Tabs max={3} />
            </Cell>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

// It opens the list, looks down it and picks an option, twice, ending on the
// first again.
const SELECT_DEMO: Array<DemoStep> = [
  { on: ".cds-select", click: "open" },
  { on: ".cds-menu-item", text: "Code" },
  { on: ".cds-menu-item", text: "Research", click: true, rest: 500 },
  { on: ".cds-select", click: "open", rest: 700 },
  { on: ".cds-menu-item", text: "Create" },
  { on: ".cds-menu-item", text: "Learn", click: true, rest: 700 },
]

// It opens the second row, which closes the first, reads the answer, and
// opens the first again.
const ACCORDION_DEMO: Array<DemoStep> = [
  { on: ".cds-accordion-head", nth: 1, click: "open" },
  { on: ".cds-accordion-body", rest: 1600 },
  { on: ".cds-accordion-head", nth: 0, click: "open" },
  { on: ".cds-accordion-body", rest: 1600 },
]

// Through the deck to its last card, where the arrow has nowhere to go, and
// back to the first by its bullets and its other arrow.
const CAROUSEL_DEMO: Array<DemoStep> = [
  { on: '[aria-label="Next"]', click: true, rest: 500 },
  { on: ".cds-deck-slide[data-active] .cds-btn", rest: 700 },
  { on: '[aria-label="Next"]', click: true, rest: 500 },
  { on: ".cds-deck-slide[data-active] .cds-btn", rest: 700 },
  { on: '[aria-label="2 of 3"]', click: true, rest: 600 },
  { on: '[aria-label="Previous"]', click: true, rest: 700 },
]

export function SelectDoc() {
  return (
    <>
      <Section caption="One heuristic repeated here, a hovered list-item's siblings dim on hover.">
        <Specimen figure>
          <DemoCursor
            steps={SELECT_DEMO}
            className="flex justify-center px-6 py-56 md:px-8"
          >
            <Select />
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

export function AccordionDoc() {
  return (
    <>
      <Section>
        <Figure>
          <Specimen>
            {/* On its page: the section's header above it and the next
                section under it, as a skeleton. */}
            <DemoCursor steps={ACCORDION_DEMO} className="p-6 md:p-8">
              <SkeletonContext
                // As on the Claude Code page: under a one-line heading,
                // with the link cards' section after it.
                before={<SkeletonHeader pictogram={false} />}
                after={
                  <>
                    <SkeletonHeader />
                    <SkeletonCards />
                  </>
                }
                className="flex justify-center"
              >
                <Accordion />
              </SkeletonContext>
            </DemoCursor>
          </Specimen>
        </Figure>
      </Section>
    </>
  )
}

export function CarouselDoc() {
  return (
    <>
      <Section>
        <Figure>
          <Specimen>
            <DemoCursor
              steps={CAROUSEL_DEMO}
              className="flex justify-center px-6 py-16 md:px-8"
            >
              {/* As wide as a margin's column. */}
              <div className="w-[216px]">
                <Carousel />
              </div>
            </DemoCursor>
          </Specimen>
        </Figure>
      </Section>
    </>
  )
}
