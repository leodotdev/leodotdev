import { Fragment, useState } from "react"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"
import {
  Button,
  MoreButton,
  PlayButton,
  quiet,
} from "@/components/work/anthropic/specimens"
import { cn } from "@/lib/utils"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type {
  ButtonCorner,
  ButtonIcon,
  ButtonSize,
  ButtonVariant,
} from "@/components/work/anthropic/specimens"

// The Buttons chapter: the file's Button (its 96 variants, their states and
// themes), the Play Button, and the Tiny More Button (Atoms page, sections
// "Buttons", "Play Button", and "Tiny More Button").

const VARIANTS: Array<ButtonVariant> = ["primary", "secondary", "tertiary"]
const SIZES: Array<ButtonSize> = ["tiny", "small", "medium", "large"]
const FORMATS: Array<[ButtonIcon, string]> = [
  ["none", "None"],
  ["leading", "Leading"],
  ["trailing", "Trailing"],
  ["only", "Icon-only"],
]
const CORNERS: Array<[ButtonCorner, string]> = [
  ["squircle", "Squircle"],
  ["round", "Rounded-full"],
]

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const muted = { color: "var(--ads-fg-3)" }

const variant = (name: ButtonVariant) => `.ads-btn[data-variant="${name}"]`

// The grid: the cursor presses a button of each variant down the formats,
// moving across the sizes, then turns the corners round and back. Its notes
// are the file's own: the description beside the Button on its Atoms page,
// and the component's properties.
const GRID_DEMO: Array<DemoStep> = [
  {
    on: variant("primary"),
    nth: 0,
    click: true,
    note: {
      kind: "concept",
      title: "Button",
      text: "“An interactive component combining text, icons, and styling to trigger actions across multiple contexts.”",
    },
  },
  { on: variant("secondary"), nth: 5, click: true },
  { on: variant("tertiary"), nth: 10, click: true },
  {
    on: variant("primary"),
    nth: 15,
    click: true,
    rest: 500,
    note: {
      kind: "concept",
      title: "96 variants",
      text: "Four properties beside its label: Variant, Format, Corner, and Size.",
    },
  },
  {
    on: '[data-corner-pick="round"]',
    click: true,
    rest: 600,
    note: {
      kind: "concept",
      title: "Corner",
      text: "A property of the button, so every variant comes with either corner.",
    },
  },
  { on: variant("secondary"), nth: 2, click: true },
  { on: variant("tertiary"), nth: 7, click: true },
  { on: variant("primary"), nth: 13, click: true, rest: 500 },
  { on: '[data-corner-pick="squircle"]', click: true, rest: 600 },
]

// The states: the cursor rests on each button at rest, which shows its
// hover beside the drawn one. Its notes are the designers' own, from the
// file's "Button Interactive States".
const STATES_DEMO: Array<DemoStep> = [
  {
    on: "[data-col='rest'] .ads-btn",
    nth: 0,
    rest: 900,
    note: {
      kind: "concept",
      title: "At rest",
      text: "“At rest, the button holds a calm, consistent tone.”",
    },
  },
  {
    on: "[data-col='rest'] .ads-btn",
    nth: 1,
    rest: 900,
    note: {
      kind: "concept",
      title: "Hover",
      text: "A shadow with no blur animates in. Secondary and tertiary foregrounds become primary.",
    },
  },
  { on: "[data-col='rest'] .ads-btn", nth: 2, rest: 900 },
  { on: "[data-col='rest'] .ads-btn", nth: 3, click: true },
  { on: "[data-col='rest'] .ads-btn", nth: 4, click: true },
  {
    on: "[data-col='rest'] .ads-btn",
    nth: 5,
    click: true,
    rest: 700,
    note: {
      kind: "concept",
      title: "Focus",
      on: "[data-col='focus']",
      text: "An outline in Sky, set off from the button. Secondary and tertiary foregrounds become primary here too.",
    },
  },
]

const PLAY_DEMO: Array<DemoStep> = [
  { on: "[data-col='rest'] .ads-play", nth: 0, click: true, rest: 900 },
  { on: "[data-col='rest'] .ads-play", nth: 1, click: true, rest: 900 },
]

// The more button opens, rests, and closes again.
const MORE_DEMO: Array<DemoStep> = [
  { on: ".ads-more", click: "open", rest: 1600 },
  { on: ".ads-more", click: "close", rest: 900 },
]

/** The docs' own switch between the button's two corners, over the grid. */
function CornerSwitch({
  corner,
  onChange,
}: {
  corner: ButtonCorner
  onChange: (corner: ButtonCorner) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Corner"
      className="ads-caption flex gap-4"
    >
      {CORNERS.map(([id, name]) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={corner === id}
          data-corner-pick={id}
          onClick={() => onChange(id)}
          className={cn(
            "cursor-pointer underline-offset-4",
            corner === id && "underline"
          )}
          style={{ color: corner === id ? "var(--ads-fg)" : "var(--ads-fg-3)" }}
          {...quiet}
        >
          {name}
        </button>
      ))}
    </div>
  )
}

/**
 * Every variant of one corner: the sizes across, and down the page each
 * format with the three variants under it. The switch above turns the
 * corners, so the grid shows all 96.
 */
function ButtonGrid() {
  const [corner, setCorner] = useState<ButtonCorner>("squircle")
  return (
    <Specimen figure className="max-lg:overflow-x-auto">
      <DemoCursor
        steps={GRID_DEMO}
        className="flex w-max min-w-full flex-col items-center gap-6 p-6 md:p-8"
      >
        <CornerSwitch corner={corner} onChange={setCorner} />
        <div className="grid grid-cols-[auto_auto_repeat(4,auto)] items-center gap-x-8 gap-y-3">
          <div />
          <div />
          {SIZES.map((size) => (
            <div key={size} className="ads-caption pb-1" style={muted}>
              {cap(size)}
            </div>
          ))}
          {FORMATS.map(([format, name], f) => (
            <Fragment key={format}>
              <div
                className="ads-caption self-start pt-1"
                style={{
                  ...muted,
                  gridColumn: 1,
                  gridRow: `${f * 3 + 2} / span 3`,
                }}
              >
                {name}
              </div>
              {VARIANTS.map((v, i) => (
                <Fragment key={v}>
                  <div
                    className="ads-caption"
                    style={{
                      ...muted,
                      gridColumn: 2,
                      gridRow: f * 3 + i + 2,
                      marginBottom: i === 2 && f < 3 ? 16 : 0,
                    }}
                  >
                    {cap(v)}
                  </div>
                  {SIZES.map((size, s) => (
                    <div
                      key={size}
                      style={{
                        gridColumn: s + 3,
                        gridRow: f * 3 + i + 2,
                        marginBottom: i === 2 && f < 3 ? 16 : 0,
                      }}
                    >
                      <Button
                        variant={v}
                        size={size}
                        corner={corner}
                        icon={format}
                      >
                        Button
                      </Button>
                    </div>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </DemoCursor>
    </Specimen>
  )
}

const STATE_COLUMNS = [
  ["rest", "Default", undefined],
  ["hover", "Hover", "hover"],
  ["focus", "Focus", "focus"],
] as const

/** The file's "Button Interactive States": each variant, labelled and icon-only. */
function ButtonStates() {
  return (
    <Specimen figure className="max-lg:overflow-x-auto">
      <DemoCursor
        steps={STATES_DEMO}
        className="grid w-max min-w-full grid-cols-[repeat(3,auto)] justify-center gap-x-16 p-6 md:p-8"
      >
        {STATE_COLUMNS.map(([col, label, state]) => (
          <div key={col} data-col={col}>
            <Cell label={label} className="flex-col !items-start gap-4">
              {(["none", "only"] as const).flatMap((icon) =>
                VARIANTS.map((v) => (
                  <Button
                    key={`${icon}-${v}`}
                    variant={v}
                    size="small"
                    icon={icon}
                    state={state}
                  >
                    {icon === "only" ? cap(v) : "Button"}
                  </Button>
                ))
              )}
            </Cell>
          </div>
        ))}
      </DemoCursor>
    </Specimen>
  )
}

function PlayStates() {
  return (
    <Specimen figure>
      <DemoCursor
        steps={PLAY_DEMO}
        className="grid grid-cols-[repeat(3,auto)] justify-center gap-x-16 p-6 md:p-8"
      >
        {STATE_COLUMNS.map(([col, label, state]) => (
          <div key={col} data-col={col}>
            <Cell label={label} className="flex-col !items-start gap-6">
              <PlayButton size="large" state={state} />
              <PlayButton size="small" state={state} />
            </Cell>
          </div>
        ))}
      </DemoCursor>
    </Specimen>
  )
}

/** One live tiny more button; its label names the state it is in. */
function MoreStates() {
  const [open, setOpen] = useState(false)
  return (
    <Specimen figure>
      <DemoCursor steps={MORE_DEMO} className="flex justify-center p-6 md:p-8">
        <Cell label={open ? "Active" : "Default"} className="justify-center">
          <MoreButton active={open} onActiveChange={setOpen} />
        </Cell>
      </DemoCursor>
    </Specimen>
  )
}

export function ButtonsDoc() {
  return (
    <>
      <Section
        title="Button"
        caption="“An interactive component combining text, icons, and styling to trigger actions.” Three variants, four formats, two corners, and four sizes: 96 variants."
      >
        <ButtonGrid />
      </Section>

      <Section
        title="States & Themes"
        caption="At rest, the button “holds a calm, consistent tone.” Hover animates in a ring with no blur; focus draws a ring set off from the button. On both, secondary and tertiary labels turn primary."
      >
        <ButtonStates />
        <ThemeStrip figure>
          {VARIANTS.map((v) => (
            <Button key={v} variant={v} size="small">
              {cap(v)}
            </Button>
          ))}
        </ThemeStrip>
      </Section>

      <Section
        title="Play Button"
        caption="Small and Large: a tertiary button with a play mark, lifted by a soft shadow. Its states are the button’s."
      >
        <PlayStates />
      </Section>

      <Section
        title="Tiny More Button"
        caption="Default and Active. Pressed, it turns primary and opens its tooltip."
      >
        <MoreStates />
      </Section>
    </>
  )
}
