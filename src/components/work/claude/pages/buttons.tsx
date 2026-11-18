import { TbPaperclip } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Button, VARIANTS } from "@/components/work/claude/specimens"
import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const COLUMNS = ["", "Small", "Medium", "Large", "Leading icon", "Icon only"]

const variant = (name: string) => `.cds-btn[data-variant="${name}"]`

// What the demo cursor tries. On the grid it goes down the variants and
// across the columns at once, pressing one button of each kind.
const GRID_DEMO: Array<DemoStep> = [
  { on: variant("primary"), nth: 0, click: true },
  { on: variant("secondary"), nth: 1, click: true },
  { on: variant("tertiary"), nth: 2, click: true },
  { on: variant("clay"), nth: 3, click: true },
  { on: variant("clay"), nth: 4, rest: 700 },
]

// The buttons at rest take their hover look under the cursor, next to the
// column that shows it held.
const STATES_DEMO: Array<DemoStep> = [
  { on: ".cds-btn", text: "Primary", rest: 700 },
  { on: ".cds-btn", text: "Secondary", rest: 700 },
  { on: ".cds-btn", text: "Tertiary", rest: 700 },
  { on: ".cds-btn", text: "Clay", click: true, rest: 700 },
]

// One button in each theme.
const THEMES_DEMO: Array<DemoStep> = [
  { on: variant("primary"), nth: 0, rest: 600 },
  { on: variant("secondary"), nth: 1, rest: 600 },
  { on: variant("tertiary"), nth: 2, rest: 600 },
  { on: variant("clay"), nth: 3, rest: 600 },
  { on: variant("primary"), nth: 4, click: true, rest: 600 },
]

const LINKS_DEMO: Array<DemoStep> = [
  { on: ".cds-link", rest: 1000 },
  { on: "a.cds-meta-link", rest: 1000 },
  { on: ".cds-card-link", rest: 1400 },
]

export function ButtonsDoc() {
  return (
    <>
      <Section title="Buttons">
        <Specimen className="overflow-x-auto">
          <DemoCursor
            steps={GRID_DEMO}
            className="grid w-max min-w-full grid-cols-[repeat(6,auto)] items-center justify-start gap-x-4 gap-y-5 p-6"
          >
            {COLUMNS.map((column) => (
              <div
                key={column}
                className="cds-caption"
                style={{ color: "var(--cds-fg-3)" }}
              >
                {column}
              </div>
            ))}
            {VARIANTS.map((name) => [
              <div key={name} className="cds-caption">
                {cap(name)}
              </div>,
              <Button key="s" variant={name} size="small" />,
              <Button key="m" variant={name} />,
              <Button key="l" variant={name} size="large" />,
              <Button key="lead" variant={name} icon="leading" />,
              <Button key="only" variant={name} icon="only" />,
            ])}
          </DemoCursor>
        </Specimen>
      </Section>

      <Section title="States & Themes">
        <Specimen>
          <DemoCursor
            steps={STATES_DEMO}
            className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-3 md:p-8"
          >
            {(
              [
                ["At rest", undefined],
                [":hover", "hover"],
                [":focus-visible", "focus"],
              ] as const
            ).map(([label, state]) => (
              <Cell
                key={label}
                label={label}
                className="flex-col !items-start gap-4"
              >
                {VARIANTS.map((name) => (
                  <Button key={name} variant={name} state={state} icon="none">
                    {cap(name)}
                  </Button>
                ))}
              </Cell>
            ))}
          </DemoCursor>
        </Specimen>
        <DemoCursor steps={THEMES_DEMO}>
          <ThemeStrip>
            {VARIANTS.map((name) => (
              <Button key={name} variant={name} size="small" />
            ))}
          </ThemeStrip>
        </DemoCursor>
      </Section>

      <Section title="Links">
        <Specimen>
          <DemoCursor
            steps={LINKS_DEMO}
            className="grid items-start gap-8 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8"
          >
            <div className="flex flex-col gap-8">
              <p
                className="cds-body-3 max-w-[26ch]"
                style={{ color: "var(--cds-fg-3)" }}
              >
                This is a string of words with a{" "}
                <a
                  className="cds-link"
                  href="#links"
                  data-wave-hover="off"
                  data-wave-manual
                  onClick={(e) => e.preventDefault()}
                >
                  link embedded
                </a>{" "}
                within it.
              </p>
              <a
                className="cds-meta-link self-start"
                href="#links"
                data-wave-hover="off"
                data-wave-manual
                onClick={(e) => e.preventDefault()}
              >
                <TbPaperclip aria-hidden />
                Developer doc
              </a>
            </div>
            <a
              className="cds-card-link"
              href="#links"
              data-wave-hover="off"
              data-wave-manual
              onClick={(e) => e.preventDefault()}
            >
              Claude Code documentation
              <span className="cds-meta-link">
                <TbPaperclip aria-hidden />
                Developer doc
              </span>
            </a>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
