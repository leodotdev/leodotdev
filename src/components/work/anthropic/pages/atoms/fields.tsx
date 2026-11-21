import { Fragment, useState } from "react"
import { TbSearch } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"
import {
  Checkbox,
  Radio,
  Select,
  Slider,
  TextInput,
} from "@/components/work/anthropic/specimens"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type {
  FieldSize,
  InputSize,
} from "@/components/work/anthropic/specimens"

// The field atoms: Radio and Checkbox (chapter "selection"), Text Input and
// Select (chapter "inputs"), and the Slider, each as the file's Atoms page
// has them.

const SIZES: Array<FieldSize> = ["small", "medium", "large"]
const STATES = [
  ["Default", undefined],
  ["Hover", "hover"],
  ["Focus", "focus"],
  ["Disabled", undefined],
] as const

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const muted = { color: "var(--ads-fg-3)" }

// The live column of each selection grid: the cursor presses each control
// and presses it back, so it ends as its label says.
const RADIO_DEMO: Array<DemoStep> = [
  { on: '[data-live] input[name="radio-small"]', nth: 1, click: true },
  { on: '[data-live] input[name="radio-small"]', nth: 0, click: true },
  { on: '[data-live] input[name="radio-medium"]', nth: 1, click: true },
  { on: '[data-live] input[name="radio-medium"]', nth: 0, click: true },
  { on: '[data-live] input[name="radio-large"]', nth: 1, click: true },
  { on: '[data-live] input[name="radio-large"]', nth: 0, click: true },
]

const box = "[data-live] .ads-checkbox input"
const CHECK_DEMO: Array<DemoStep> = [
  { on: box, nth: 0, click: true },
  { on: box, nth: 0, click: true, rest: 300 },
  { on: box, nth: 4, click: true },
  { on: box, nth: 4, click: true, rest: 300 },
  { on: box, nth: 8, click: true },
  { on: box, nth: 8, click: true, rest: 300 },
]

/**
 * A selection control in every size and state: the sizes down, each with
 * its values, and the states across. The first column is live.
 */
function SelectionGrid({ kind }: { kind: "radio" | "checkbox" }) {
  const values =
    kind === "radio"
      ? (["Off", "On"] as const)
      : (["Off", "On", "Indeterminate"] as const)
  return (
    <Specimen figure className="max-lg:overflow-x-auto">
      <DemoCursor
        steps={kind === "radio" ? RADIO_DEMO : CHECK_DEMO}
        className="grid w-max min-w-full grid-cols-[auto_repeat(4,auto)] items-start justify-center gap-x-12 gap-y-4 p-6 md:p-8"
      >
        <div />
        {STATES.map(([name]) => (
          <div key={name} className="ads-caption" style={muted}>
            {name}
          </div>
        ))}
        {SIZES.map((size) => (
          <Fragment key={size}>
            <div className="ads-caption pt-1" style={muted}>
              {cap(size)}
            </div>
            {STATES.map(([name, state], col) => (
              <div
                key={name}
                data-live={col === 0 ? "" : undefined}
                className="flex flex-col items-start gap-3"
              >
                {values.map((value) => {
                  const common = {
                    size,
                    state,
                    disabled: name === "Disabled",
                    tabIndex: col === 0 ? undefined : -1,
                  }
                  return kind === "radio" ? (
                    <Radio
                      key={value}
                      {...common}
                      name={`radio-${size}${col === 0 ? "" : `-${col}`}`}
                      defaultChecked={value === "On"}
                    >
                      Label
                    </Radio>
                  ) : (
                    <Checkbox
                      key={value}
                      {...common}
                      defaultChecked={value === "On"}
                      indeterminate={value === "Indeterminate"}
                    >
                      Label
                    </Checkbox>
                  )
                })}
              </div>
            ))}
          </Fragment>
        ))}
      </DemoCursor>
    </Specimen>
  )
}

export function SelectionDoc() {
  return (
    <>
      <Section
        title="Radio"
        caption="Small, Medium, and Large, selected or not, at rest, hovered, focused, or disabled: 24 variants. The colors are the theme’s selection tokens."
      >
        <SelectionGrid kind="radio" />
      </Section>
      <Section
        title="Checkbox"
        caption="The same sizes and states, with a third value, Indeterminate: 36 variants."
      >
        <SelectionGrid kind="checkbox" />
        <ThemeStrip figure>
          <div className="flex flex-col items-start gap-2">
            <Radio size="small" defaultChecked tabIndex={-1}>
              Label
            </Radio>
            <Checkbox size="small" defaultChecked tabIndex={-1}>
              Label
            </Checkbox>
            <Checkbox size="small" tabIndex={-1}>
              Label
            </Checkbox>
          </div>
        </ThemeStrip>
      </Section>
    </>
  )
}

const INPUT_SIZES: Array<InputSize> = ["small", "medium", "large", "larger"]

// The cursor writes in the live field of each size, then hovers the next.
const INPUT_DEMO: Array<DemoStep> = [
  { on: "[data-live] .ads-input", nth: 0, type: "Input value" },
  { on: "[data-live] .ads-input", nth: 1, type: "Input value" },
  { on: "[data-live] .ads-input", nth: 2, type: "Input value" },
  { on: "[data-live] .ads-input", nth: 3, type: "Input value", rest: 800 },
]

const FIELD_STATES = [
  ["Default", {}],
  ["Hover", { state: "hover" }],
  ["Focus", { state: "focus" }],
  ["Filled", { defaultValue: "Input value" }],
  ["Error", { defaultValue: "Input value", error: true }],
  ["Disabled", { disabled: true }],
] as const

/** The file's Text Input board: the four sizes across, the six states down. */
function InputGrid() {
  return (
    <Specimen figure className="max-lg:overflow-x-auto">
      <DemoCursor
        steps={INPUT_DEMO}
        className="grid w-max min-w-full grid-cols-[auto_repeat(4,13.5rem)] items-end justify-center gap-x-6 gap-y-6 p-6 md:p-8"
      >
        <div />
        {INPUT_SIZES.map((size) => (
          <div key={size} className="ads-caption" style={muted}>
            {cap(size)}
          </div>
        ))}
        {FIELD_STATES.map(([name, props], row) => (
          <Fragment key={name}>
            <div className="ads-caption self-end pb-2" style={muted}>
              {name}
            </div>
            {INPUT_SIZES.map((size) => (
              <div key={size} data-live={row === 0 ? "" : undefined}>
                <TextInput
                  size={size}
                  {...props}
                  readOnly={row > 0 && name !== "Disabled" ? true : undefined}
                  tabIndex={row > 0 ? -1 : undefined}
                />
              </div>
            ))}
          </Fragment>
        ))}
      </DemoCursor>
    </Specimen>
  )
}

/** The text field with its other parts shown: help text, icons, a message. */
function InputParts() {
  return (
    <Specimen figure>
      <DemoCursor
        steps={[
          { on: ".ads-input", nth: 0, type: "Claude for Education" },
          { on: ".ads-input", nth: 1, type: "hello@", rest: 900 },
        ]}
        className="grid justify-center gap-x-10 gap-y-6 p-6 sm:grid-cols-[repeat(2,20rem)] md:p-8"
      >
        <TextInput
          label="Search"
          help="Help text"
          leading={<TbSearch aria-hidden />}
        />
        <TextInput
          label="Email"
          required
          error
          message="Message"
          placeholder="Input value"
        />
      </DemoCursor>
    </Specimen>
  )
}

const OPTIONS = ["Value", "Option two", "Option three", "Option four"]

// The cursor opens the live select, picks a choice, and opens it again.
const SELECT_DEMO: Array<DemoStep> = [
  { on: "[data-live] .ads-select", click: "open", rest: 900 },
  { on: "[data-live] [role='option']", nth: 2, click: true, rest: 1200 },
  { on: "[data-live] .ads-select", click: "open", rest: 900 },
  { on: "[data-live] [role='option']", nth: 0, click: true, rest: 1200 },
]

const SELECT_STATES = [
  ["Hover", { state: "hover" }],
  ["Focus", { state: "focus" }],
  ["Filled", { defaultValue: "Value" }],
  ["Error", { defaultValue: "Value", error: true }],
  ["Disabled", { disabled: true }],
] as const

/** The select's states, the first one live (its own state is Default or Open). */
function SelectStates() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Specimen figure className="max-lg:overflow-x-auto">
      <DemoCursor
        steps={SELECT_DEMO}
        className="grid w-max min-w-full grid-cols-[repeat(3,16rem)] justify-center gap-x-8 gap-y-6 p-6 md:p-8"
      >
        <div data-live>
          <Cell label="Default & Open">
            <Select options={OPTIONS} value={value} onValueChange={setValue} />
          </Cell>
        </div>
        {SELECT_STATES.map(([name, props]) => (
          <Cell key={name} label={name}>
            <Select options={OPTIONS} {...props} />
          </Cell>
        ))}
      </DemoCursor>
    </Specimen>
  )
}

export function InputsDoc() {
  return (
    <>
      <Section
        title="Text Input"
        caption="“A data entry component combining input fields with optional icons and action buttons to capture user information.” Four sizes in six states."
      >
        <InputGrid />
        <InputParts />
      </Section>
      <Section
        title="Select"
        caption="The same field with a caret, in the same sizes and states, and one more: Open, where the caret turns up."
      >
        <SelectStates />
      </Section>
    </>
  )
}

// The cursor drags the single knob and the range's two.
const SLIDER_DEMO: Array<DemoStep> = [
  { on: "[role='slider']", nth: 1, drag: 85 },
  { on: "[role='slider']", nth: 1, drag: 40 },
  { on: "[role='slider']", nth: 5, drag: 10 },
  { on: "[role='slider']", nth: 6, drag: 90 },
  { on: "[role='slider']", nth: 5, drag: 25 },
  { on: "[role='slider']", nth: 6, drag: 75, rest: 600 },
]

const SLIDER_TYPES = [
  ["Single", 60],
  ["Range Middle", [25, 75]],
  ["Range Start", [0, 50]],
] as const

export function SliderDoc() {
  return (
    <Section caption="A tertiary pill in three sizes, holding one value or a range: Single, Range Middle, and Range Start.">
      <Specimen figure className="max-lg:overflow-x-auto">
        <DemoCursor
          steps={SLIDER_DEMO}
          className="grid w-max min-w-full grid-cols-[auto_repeat(3,auto)] items-center justify-center gap-x-12 gap-y-8 p-6 md:p-8"
        >
          <div />
          {SIZES.map((size) => (
            <div key={size} className="ads-caption" style={muted}>
              {cap(size)}
            </div>
          ))}
          {SLIDER_TYPES.map(([name, value]) => (
            <Fragment key={name}>
              <div className="ads-caption" style={muted}>
                {name}
              </div>
              {SIZES.map((size) => (
                <Slider
                  key={size}
                  size={size}
                  defaultValue={
                    typeof value === "number" ? value : [value[0], value[1]]
                  }
                />
              ))}
            </Fragment>
          ))}
        </DemoCursor>
      </Specimen>
    </Section>
  )
}
