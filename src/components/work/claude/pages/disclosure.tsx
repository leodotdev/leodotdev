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
import {
  Cell,
  DocHeader,
  Section,
  Spec,
  Specimen,
} from "@/components/work/claude/ui"

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

export function DisclosureDoc() {
  return (
    <>
      <DocHeader group="Patterns" title="Tabs and disclosure">
        Four ways to show one thing at a time: tabs, a select, an accordion and
        a carousel. All of them work.
      </DocHeader>

      <Section
        title="Tabs and select"
        description="A navigational component that organizes related content into labeled panels, allowing users to switch between different views within the same interface area. The current tab sits on a white pill; a hovered one darkens its label. When tabs run out of room the rest move into an overflow menu, and on narrow screens a select takes their place."
      >
        <Specimen className="grid gap-x-8 gap-y-8 p-6 md:p-8">
          <Cell label="With icons">
            <Tabs icons />
          </Cell>
          <Cell label="Small, medium and large">
            <Tabs size="small" max={3} />
            <Tabs max={3} />
            <Tabs size="large" max={3} />
          </Cell>
          <div className="grid gap-8 pb-28 sm:grid-cols-2">
            <Cell label="Overflow menu">
              <Tabs max={3} />
            </Cell>
            <Cell label="Select">
              <Select />
            </Cell>
          </div>
        </Specimen>
        <Spec>
          Tabs sit in a track with 4px padding and a 12px radius (2px and 8px at
          the small size); each tab is a 28, 36 or 40px button with medium 500
          text. The select is 36px tall with a 12px radius and 20px icons.
        </Spec>
      </Section>

      <Section
        title="Accordion and carousel"
        description="The accordion is a space-efficient content organization component that displays collapsible question-and-answer pairs or content sections with expand/collapse functionality. The carousel's controls are two icon buttons either side of a row of bullets."
      >
        <Specimen className="grid items-start gap-x-12 gap-y-10 p-6 md:p-8 xl:grid-cols-[minmax(0,1fr)_auto]">
          <Accordion />
          <Carousel />
        </Specimen>
        <Spec>
          Accordion rows have 32px above and below a serif 19/24 question, a
          20px plus or minus, and a 17/28 answer. Carousel bullets are 5px, 16px
          apart, 32px from the buttons.
        </Spec>
      </Section>
    </>
  )
}
