import { TbPaperclip } from "react-icons/tb"
import { Button, VARIANTS } from "@/components/work/claude/specimens"
import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const COLUMNS = ["", "Small", "Medium", "Large", "Leading icon", "Icon only"]

export function ButtonsDoc() {
  return (
    <>
      <Section title="Buttons">
        <Specimen className="overflow-x-auto p-6">
          <div className="grid w-max grid-cols-[repeat(6,auto)] items-center gap-x-4 gap-y-5">
            {COLUMNS.map((column) => (
              <div
                key={column}
                className="cds-caption"
                style={{ color: "var(--cds-fg-3)" }}
              >
                {column}
              </div>
            ))}
            {VARIANTS.map((variant) => [
              <div key={variant} className="cds-caption">
                {cap(variant)}
              </div>,
              <Button key="s" variant={variant} size="small" />,
              <Button key="m" variant={variant} />,
              <Button key="l" variant={variant} size="large" />,
              <Button key="lead" variant={variant} icon="leading" />,
              <Button key="only" variant={variant} icon="only" />,
            ])}
          </div>
        </Specimen>
      </Section>

      <Section title="States & Themes">
        <Specimen className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-3 md:p-8">
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
              {VARIANTS.map((variant) => (
                <Button
                  key={variant}
                  variant={variant}
                  state={state}
                  icon="none"
                >
                  {cap(variant)}
                </Button>
              ))}
            </Cell>
          ))}
        </Specimen>
        <ThemeStrip>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} size="small" />
          ))}
        </ThemeStrip>
      </Section>

      <Section title="Links">
        <Specimen className="grid items-start gap-8 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
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
        </Specimen>
      </Section>
    </>
  )
}
