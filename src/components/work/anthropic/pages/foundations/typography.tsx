import { useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type { Sizes } from "@/components/work/claude/resizable"

// The Typography page of the Anthropic.com file: its text styles (in
// src/anthropic-ds.css), each in a sans and a serif version and fluid from
// the Mobile SM breakpoint to Desktop XXL, and its two editorial styles,
// drop caps and small caps (src/anthropic/foundations.css).

// The file's own sample words: its specimens' headline and paragraph, the
// captions' placeholder, and the editorial styles' passage.
const HEADLINE = "AI that thinks with you"
const BODY =
  "Millions of people now use AI every day. As a company developing AI systems, we want to know how and why they’re doing so, and how it affects them. In part, this is because we want to use people’s feedback to develop better products—but it’s also because understanding people’s interactions with AI is one of the great sociological questions of our time."
const CAPTION =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit similique amet id expedit"
const PASSAGE = [
  "Claude’s constitution describes Anthropic’s vision for Claude’s character and behavior. We want Claude to be safe, to have good values, and to act well in its role. This document explains what we mean, and some of the reasoning behind our choices.",
  "Anthropic’s mission is to ensure that the world safely makes the transition through transformative AI. We hope that Claude can be a partner in this project, and that humans and AIs can work towards a better world together.",
]
// The words the small caps set, at the passage's start.
const LEAD = "Claude’s constitution describes"

/** The file's five breakpoints, as a resizable figure's labels. */
export const BREAKPOINTS: Sizes = [
  ["Desktop XXL"],
  ["Desktop XL", 1919],
  ["Laptop LG", 1511],
  ["Tablet MD", 1279],
  ["Mobile SM", 767],
]

const FAMILIES = [
  ["Anthropic Sans", "var(--ads-sans)", 500],
  ["Anthropic Serif", "var(--ads-serif)", 400],
  ["Anthropic Mono", "var(--ads-mono)", 400],
] as const

// name, class (without its "-serif"), sample. The fluid styles have a serif
// twin; the captions are sans, each with a mono twin of its own.
const FLUID: Array<[string, string, string]> = [
  ["Display 1", "ads-display-1", HEADLINE],
  ["Display 2", "ads-display-2", HEADLINE],
  ["Heading 1", "ads-heading-1", HEADLINE],
  ["Heading 2", "ads-heading-2", HEADLINE],
  ["Heading 3", "ads-heading-3", HEADLINE],
  ["Heading 4", "ads-heading-4", HEADLINE],
  ["Heading 5", "ads-heading-5", HEADLINE],
  ["Heading 6", "ads-heading-6", HEADLINE],
  ["Body 1", "ads-body-1", BODY],
  ["Body 2", "ads-body-2", BODY],
  ["Body 3", "ads-body-3", BODY],
]

const FIXED: Array<[string, string]> = [
  ["Caption 1", "ads-caption-1"],
  ["Caption 2", "ads-caption-2"],
  ["Caption 1 Mono", "ads-caption-1-mono"],
  ["Caption 2 Mono", "ads-caption-2-mono"],
]

// Sizes as written beside each style: a whole number, or one decimal.
const px = (value: string) => {
  const n = parseFloat(value)
  return Number.isFinite(n) ? String(Math.round(n * 10) / 10) : ""
}

/** The family switch: two of the system's small buttons, one pressed. */
function FamilySwitch({
  serif,
  onChange,
}: {
  serif: boolean
  onChange: (serif: boolean) => void
}) {
  return (
    <div className="ads-type-switch" role="group" aria-label="Family">
      {(["Sans", "Serif"] as const).map((name) => {
        const on = (name === "Serif") === serif
        return (
          <Button
            key={name}
            size="small"
            variant={on ? "primary" : "tertiary"}
            aria-pressed={on}
            onClick={() => onChange(name === "Serif")}
          >
            {name}
          </Button>
        )
      })}
    </div>
  )
}

// The cursor turns the scale to the serif, narrows the figure through the
// breakpoints to a phone, and back, then turns it to the sans again.
const SCALE_DEMO: Array<DemoStep> = [
  { on: ".ads-type-switch .ads-btn", text: "Serif", click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 640 },
  { on: ".cds-resize-grip", nth: 1, drag: 390, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: ".ads-type-switch .ads-btn", text: "Sans", click: true, rest: 900 },
]

/**
 * The type scale, every style on one line, in a figure that resizes: the
 * sizes are fluid, so they follow the figure's width as they would the
 * window's, and each style's size and leading are written beside it as they
 * are at that width.
 */
function TypeScale() {
  const [serif, setSerif] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<Array<string>>([])

  useLayoutEffect(() => {
    const el = list.current
    if (!el) return
    const measure = () => {
      const samples = el.querySelectorAll<HTMLElement>("[data-sample]")
      setSizes(
        [...samples].map((sample) => {
          const style = getComputedStyle(sample)
          return `${px(style.fontSize)}/${px(style.lineHeight)}`
        })
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // Measured again whenever the list is resized, and when the family
    // switch changes the styles (this effect runs again).
    measure()
    return () => observer.disconnect()
  }, [serif])

  return (
    <Specimen figure>
      <DemoCursor steps={SCALE_DEMO} className="flex flex-col gap-4 p-6 md:p-8">
        <FamilySwitch serif={serif} onChange={setSerif} />
        <Resizable
          label="Type scale width"
          min={390}
          sizes={BREAKPOINTS}
          className="sm:h-[820px]"
        >
          <div ref={list} className="ads-type-scale">
            {FLUID.map(([name, cls, sample], i) => (
              <div key={name} className="ads-type-row">
                <div className="ads-type-name">
                  <span>{name}</span>
                  <span>{sizes[i]}</span>
                </div>
                <div data-sample className={serif ? `${cls}-serif` : cls}>
                  {sample}
                </div>
              </div>
            ))}
            {FIXED.map(([name, cls], i) => (
              <div key={name} className="ads-type-row">
                <div className="ads-type-name">
                  <span>{name}</span>
                  <span>{sizes[FLUID.length + i]}</span>
                </div>
                <div data-sample className={cls}>
                  {CAPTION}
                </div>
              </div>
            ))}
          </div>
        </Resizable>
      </DemoCursor>
    </Specimen>
  )
}

const CAP_DEMO: Array<DemoStep> = [
  {
    on: ".ads-type-switch .ads-btn",
    text: "Drop Cap 2",
    click: true,
    rest: 1100,
  },
  {
    on: ".ads-type-switch .ads-btn",
    text: "Drop Cap 3",
    click: true,
    rest: 1100,
  },
  { on: ".cds-resize-grip", nth: 1, drag: 390, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  {
    on: ".ads-type-switch .ads-btn",
    text: "Drop Cap 1",
    click: true,
    rest: 1100,
  },
]

/**
 * The passage as the file sets it for long reads: a drop cap, the rest of
 * the first words in small caps, then the body, in each of the three sizes,
 * each set with the body size it goes with; the figure narrows to the
 * mobile size.
 */
function DropCaps() {
  const [size, setSize] = useState(1)
  const [first, second] = PASSAGE
  return (
    <Specimen figure>
      <DemoCursor steps={CAP_DEMO} className="flex flex-col gap-4 p-6 md:p-8">
        <div className="ads-type-switch" role="group" aria-label="Drop cap">
          {[1, 2, 3].map((n) => (
            <Button
              key={n}
              size="small"
              variant={n === size ? "primary" : "tertiary"}
              aria-pressed={n === size}
              onClick={() => setSize(n)}
            >
              {`Drop Cap ${n}`}
            </Button>
          ))}
        </div>
        <Resizable
          label="Paragraph width"
          min={390}
          sizes={[["Desktop"], ["Mobile", 767]]}
          className="sm:h-[420px]"
        >
          <div className={`ads-type-page ads-drop-para ads-body-${size}-serif`}>
            <p>
              <span className={`ads-drop-cap-${size}`}>{first[0]}</span>
              <span className={`ads-small-caps-${size}`}>{LEAD.slice(1)}</span>
              {first.slice(LEAD.length)}
            </p>
            <p>{second}</p>
          </div>
        </Resizable>
      </DemoCursor>
    </Specimen>
  )
}

// The file pairs each heading with the three body sizes.
const PAIRS: Array<[string, string]> = [
  ["Display 1", "ads-display-1"],
  ["Display 2", "ads-display-2"],
  ["Heading 1", "ads-heading-1"],
  ["Heading 2", "ads-heading-2"],
  ["Heading 3", "ads-heading-3"],
  ["Heading 4", "ads-heading-4"],
  ["Heading 5", "ads-heading-5"],
]

const PAIRS_DEMO: Array<DemoStep> = [
  { on: ".ads-type-switch .ads-btn", text: "Display 2", click: true },
  { on: ".ads-type-switch .ads-btn", text: "Heading 2", click: true },
  { on: ".ads-type-switch .ads-btn", text: "Heading 4", click: true },
  { on: ".ads-type-switch .ads-btn", text: "Display 1", click: true },
]

/** A heading over each body size, in the sans over the serif. */
function Pairs() {
  const [picked, setPicked] = useState(0)
  const [name, cls] = PAIRS[picked]
  return (
    <Specimen figure>
      <DemoCursor steps={PAIRS_DEMO} className="flex flex-col gap-8 p-6 md:p-8">
        <div className="ads-type-switch" role="group" aria-label="Heading">
          {PAIRS.map(([label], i) => (
            <Button
              key={label}
              size="small"
              variant={i === picked ? "primary" : "tertiary"}
              aria-pressed={i === picked}
              onClick={() => setPicked(i)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="ads-type-page grid min-h-[480px] items-start gap-8 md:grid-cols-3">
          {[3, 2, 1].map((n) => (
            <div key={n} className="flex flex-col gap-4">
              <div
                className="ads-caption-1-mono"
                style={{ color: "var(--ads-fg-3)" }}
              >
                {`${name} + Body ${n}`}
              </div>
              <div className={cls}>{HEADLINE}</div>
              <p className={`ads-body-${n}-serif`}>{BODY}</p>
            </div>
          ))}
        </div>
      </DemoCursor>
    </Specimen>
  )
}

export function TypographyDoc() {
  return (
    <>
      <Section
        title="Families"
        caption="Anthropic Sans, Anthropic Serif, and Anthropic Mono."
      >
        <Specimen figure className="grid sm:grid-cols-3">
          {FAMILIES.map(([name, stack, weight], i) => (
            <div
              key={name}
              className="flex flex-col items-center gap-6 p-6 text-center md:p-8"
              style={
                i ? { borderInlineStart: "1px solid var(--ads-border-3)" } : {}
              }
            >
              {/* One line height for all three, so the baselines meet
                  whatever each family's own ascent is. */}
              <div
                style={{
                  fontFamily: "var(--ads-sans)",
                  fontSize: 96,
                  lineHeight: "96px",
                }}
              >
                <span
                  style={{
                    fontFamily: stack,
                    fontWeight: weight,
                    lineHeight: 0,
                  }}
                >
                  Aa
                </span>
              </div>
              <div className="ads-caption-1">{name}</div>
            </div>
          ))}
        </Specimen>
      </Section>

      <Section
        title="Scale"
        caption="Display 1 and 2, Heading 1 to 6, and Body 1 to 3, each in the sans and the serif and sized for each breakpoint; two captions, each with a mono twin."
      >
        <TypeScale />
      </Section>

      <Section
        title="Headings & Body"
        caption="Each heading is set with the three body sizes: the heading in the sans, the body in the serif."
      >
        <Pairs />
      </Section>

      <Section
        title="Drop Cap & Small Caps"
        caption="Drop Cap 1 to 3, in Anthropic Serif Display Light, and Small Caps 1 to 3, bold and uppercase, open a passage in the serif, one size for each body size."
      >
        <DropCaps />
      </Section>
    </>
  )
}
