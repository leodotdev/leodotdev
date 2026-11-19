import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Check, Switch, TextInput } from "@/components/work/claude/specimens"
import {
  Cell,
  Figure,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// What the demo cursor tries on the text inputs: it writes in a few of them
// and sends one. The fields are emptied again when it starts over.
const INPUT_DEMO: Array<DemoStep> = [
  { on: ".cds-input", nth: 0, type: "A week in Lisbon" },
  { on: ".cds-input", nth: 1, type: "Sourdough starter" },
  { on: ".cds-input", nth: 4, type: "Thank-you note" },
  { on: ".cds-input .cds-btn", click: true },
  { on: ".cds-input", nth: 6, type: "A haiku about fog", rest: 600 },
]

const INPUT_THEMES_DEMO: Array<DemoStep> = [
  { on: ".cds-input", nth: 0, type: "Hello" },
  { on: ".cds-input", nth: 2, type: "Hello" },
  { on: ".cds-input", nth: 4, type: "Hello", rest: 600 },
]

const checkbox = '.cds-check input[type="checkbox"]'

// Each control is pressed twice, so it changes and comes back to what its
// label says before the cursor moves on. The radios swap and swap back.
const CHECK_DEMO: Array<DemoStep> = [
  { on: checkbox, nth: 0, click: true },
  { on: checkbox, nth: 0, click: true, rest: 300 },
  { on: checkbox, nth: 1, click: true },
  { on: checkbox, nth: 1, click: true, rest: 300 },
  { on: 'input[name="radio-demo"]', nth: 0, click: true },
  { on: 'input[name="radio-demo"]', nth: 1, click: true },
  { on: ".cds-switch input", nth: 0, click: true },
  { on: ".cds-switch input", nth: 0, click: true, rest: 300 },
  { on: ".cds-switch input", nth: 2, click: true },
  { on: ".cds-switch input", nth: 2, click: true, rest: 300 },
]

// A switch in the first, middle and last theme, on and back off.
const CHECK_THEMES_DEMO: Array<DemoStep> = [
  { on: ".cds-switch input", nth: 0, click: true },
  { on: ".cds-switch input", nth: 0, click: true, rest: 300 },
  { on: ".cds-switch input", nth: 4, click: true },
  { on: ".cds-switch input", nth: 4, click: true, rest: 300 },
  { on: ".cds-switch input", nth: 8, click: true },
  { on: ".cds-switch input", nth: 8, click: true, rest: 300 },
]

export function FormsDoc() {
  return (
    <>
      <Section title="Text Input">
        <Specimen caption="Five icon arrangements in two sizes: ten variants.">
          <DemoCursor
            steps={INPUT_DEMO}
            className="grid justify-center gap-x-8 gap-y-6 p-6 sm:grid-cols-[repeat(2,minmax(0,20rem))] md:p-8 xl:grid-cols-[repeat(3,minmax(0,20rem))]"
          >
            <Cell label="No icon">
              <TextInput />
            </Cell>
            <Cell label="Leading icon">
              <TextInput leading />
            </Cell>
            <Cell label="Trailing icon">
              <TextInput trailing="icon" />
            </Cell>
            <Cell label="Both, with a value">
              <TextInput leading trailing="icon" defaultValue="Value" />
            </Cell>
            <Cell label="Trailing button">
              <TextInput trailing="button" />
            </Cell>
            <Cell label=":focus">
              <TextInput leading state="focus" />
            </Cell>
            <Cell label="Larger">
              <TextInput size="larger" leading />
            </Cell>
          </DemoCursor>
        </Specimen>
        <Figure caption="The input on each theme.">
          <DemoCursor steps={INPUT_THEMES_DEMO}>
            <ThemeStrip>
              <TextInput leading />
            </ThemeStrip>
          </DemoCursor>
        </Figure>
      </Section>

      <Section title="Checkbox, Radio & Switch">
        <Figure>
          <Specimen>
            <DemoCursor
              steps={CHECK_DEMO}
              className="grid justify-center gap-x-16 gap-y-8 p-6 sm:grid-cols-[repeat(3,auto)] md:p-8"
            >
              <Cell label="Checkbox" className="flex-col !items-start">
                <Check>Not selected</Check>
                <Check defaultChecked>Selected</Check>
                <Check indeterminate>Indeterminate</Check>
                <Check state="hover">:hover</Check>
                <Check state="focus">:focus-visible</Check>
              </Cell>
              <Cell label="Radio" className="flex-col !items-start">
                <Check type="radio" name="radio-demo">
                  Not selected
                </Check>
                <Check type="radio" name="radio-demo" defaultChecked>
                  Selected
                </Check>
                <Check type="radio" name="radio-hover" state="hover">
                  :hover
                </Check>
                <Check type="radio" name="radio-focus" state="focus">
                  :focus-visible
                </Check>
              </Cell>
              <Cell label="Switch" className="flex-col !items-start">
                <Switch>Off</Switch>
                <Switch defaultChecked>On</Switch>
                <Switch tone="blue" defaultChecked>
                  On, blue
                </Switch>
                <Switch defaultChecked state="focus">
                  :focus-visible
                </Switch>
              </Cell>
            </DemoCursor>
          </Specimen>
        </Figure>
        <Figure caption="The form controls on each theme.">
          <DemoCursor steps={CHECK_THEMES_DEMO}>
            <ThemeStrip>
              <div className="flex flex-wrap justify-center gap-3">
                <Check defaultChecked>{""}</Check>
                <Check type="radio" defaultChecked>
                  {""}
                </Check>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Switch>{""}</Switch>
                <Switch defaultChecked>{""}</Switch>
              </div>
            </ThemeStrip>
          </DemoCursor>
        </Figure>
      </Section>
    </>
  )
}
