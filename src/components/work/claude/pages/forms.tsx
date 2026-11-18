import { Check, Switch, TextInput } from "@/components/work/claude/specimens"
import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"

export function FormsDoc() {
  return (
    <>
      <Section title="Text Input">
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
        <ThemeStrip>
          <TextInput leading />
        </ThemeStrip>
      </Section>

      <Section title="Checkbox, Radio & Switch">
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
      </Section>
    </>
  )
}
