import { useEffect, useRef, useState } from "react"
import {
  TbBook,
  TbBulb,
  TbChartBar,
  TbChevronDown,
  TbChevronLeft,
  TbChevronRight,
  TbCode,
  TbDots,
  TbMinus,
  TbPlus,
  TbSearch,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Cell, Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const VIEWS = [
  ["Learn", TbBook],
  ["Code", TbCode],
  ["Research", TbSearch],
  ["Analyze", TbChartBar],
  ["Create", TbBulb],
] as const

/** Closes a popup when the pointer goes down outside it or Escape is pressed. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, close])
  return ref
}

/**
 * Tabs. With `max`, the tabs beyond it move into an overflow menu behind a
 * "more" button; picking one shows it in that slot as the current tab.
 */
function Tabs({
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

function Select() {
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

function Accordion() {
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

const SLIDES = 7

function Carousel() {
  const [current, setCurrent] = useState(0)
  const step = (by: number) => setCurrent((current + by + SLIDES) % SLIDES)
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="cds-headline-5 flex h-32 w-full max-w-sm items-center justify-center"
        style={{
          background: "var(--cds-card-bg)",
          border: "1px solid var(--cds-card-border)",
          borderRadius: "var(--cds-radius-smaller)",
        }}
        aria-live="polite"
      >
        {current + 1} of {SLIDES}
      </div>
      <div className="cds-carousel-ui">
        <button
          type="button"
          className="cds-btn"
          data-variant="tertiary"
          data-icon="only"
          aria-label="Previous"
          onClick={() => step(-1)}
          {...quiet}
        >
          <TbChevronLeft aria-hidden />
        </button>
        <div className="cds-bullets" aria-hidden>
          {Array.from({ length: SLIDES }, (_, i) => (
            <span key={i} data-current={i === current ? "" : undefined} />
          ))}
        </div>
        <button
          type="button"
          className="cds-btn"
          data-variant="tertiary"
          data-icon="only"
          aria-label="Next"
          onClick={() => step(1)}
          {...quiet}
        >
          <TbChevronRight aria-hidden />
        </button>
      </div>
    </div>
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
      <Section>
        <Specimen>
          <DemoCursor
            steps={TABS_DEMO}
            className="grid gap-x-8 gap-y-8 p-6 pb-28 md:p-8 md:pb-28"
          >
            <Cell label="With icons">
              <Tabs icons />
            </Cell>
            <Cell label="Small, medium & large">
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

export function SelectDoc() {
  return (
    <>
      <Section>
        <Specimen className="p-6 pb-56 md:p-8 md:pb-56">
          <Select />
        </Specimen>
      </Section>
    </>
  )
}

export function AccordionDoc() {
  return (
    <>
      <Section>
        <Specimen className="p-6 md:p-8">
          <Accordion />
        </Specimen>
      </Section>
    </>
  )
}

export function CarouselDoc() {
  return (
    <>
      <Section>
        <Specimen className="flex justify-center p-6 md:p-8">
          <Carousel />
        </Specimen>
      </Section>
    </>
  )
}
