import { Check, Switch, TextInput } from "@/components/work/claude/specimens"
import {
  Cell,
  DocHeader,
  Section,
  Spec,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"

export function FormsDoc() {
  return (
    <>
      <DocHeader group="Components" title="Forms">
        A text input, checkbox, radio and switch. All of them are real controls:
        type in the fields, tick the boxes, flip the switches.
      </DocHeader>

      <Section
        title="Text input"
        description="A data entry component combining input fields with optional icons and action buttons to capture user information. Focus draws a 2px outline 4px away from the field."
      >
        <Specimen className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 md:p-8 xl:grid-cols-3">
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
        </Specimen>
        <Spec>
          Medium 44px tall, 12px text, 12px radius. Larger 50px, 15px, 16px.
          Icons are 20px, 8px from the text.
        </Spec>
      </Section>

      <Section
        title="Checkbox, radio and switch"
        description="Clickable input controls with descriptive labels to capture user choices: checkboxes when a user can make multiple selections, radios for one of a set, and a switch for on and off. Controls step up from Border/Secondary to Border/Primary on hover, and keyboard focus draws an outline in Clay Dark."
      >
        <Specimen className="grid gap-x-8 gap-y-8 p-6 sm:grid-cols-3 md:p-8">
          <Cell label="Checkbox" className="flex-col !items-start">
            <Check>Not selected</Check>
            <Check defaultChecked>Selected</Check>
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
        </Specimen>
        <Spec>
          Checkbox and radio: 20px control, 4px radius on the checkbox, 12px
          check mark, 8px radio dot. Switch: 36 by 22px track with a 16px white
          knob. Labels are Body 3, 12px from the control.
        </Spec>
      </Section>

      <Section
        title="Across themes"
        description="Inputs and toggles change fill and stroke colors to correspond with different color themes. A selected control fills black on light themes and white on dark ones."
      >
        <ThemeStrip>
          <TextInput leading />
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
      </Section>
    </>
  )
}
