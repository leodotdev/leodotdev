import { TbPaperclip } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Button, VARIANTS } from "@/components/work/claude/specimens"
import {
  Cell,
  Figure,
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

const LINKS_DEMO: Array<DemoStep> = [
  { on: ".cds-link", rest: 1000 },
  { on: "a.cds-meta-link", rest: 1000 },
  { on: ".cds-card-link", rest: 1400 },
]

export function ButtonsDoc() {
  return (
    <>
      <Section title="Buttons" caption="One button, 48 variants.">
        <Specimen figure className="max-lg:overflow-x-auto">
          <DemoCursor
            steps={GRID_DEMO}
            className="grid w-max min-w-full grid-cols-[repeat(6,auto)] items-center justify-center gap-x-4 gap-y-5 p-6"
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

      <Section
        title="States & Themes"
        caption="We wanted a button at rest to hold “a calm, consistent tone.” Labels run thinner on dark backgrounds."
      >
        <Specimen figure>
          <div className="grid justify-center gap-x-16 gap-y-6 p-6 sm:grid-cols-[repeat(3,auto)] md:p-8">
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
          </div>
        </Specimen>
        <ThemeStrip figure>
          {VARIANTS.map((name) => (
            <Button key={name} variant={name} size="small" />
          ))}
        </ThemeStrip>
      </Section>

      <Section title="Links">
        <Figure>
          <Specimen>
            <DemoCursor
              steps={LINKS_DEMO}
              className="grid items-center justify-center gap-x-16 gap-y-8 p-6 md:grid-cols-[auto_auto] md:p-8"
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
        </Figure>
      </Section>
    </>
  )
}
