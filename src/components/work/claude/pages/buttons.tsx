import { TbPaperclip } from "react-icons/tb"
import { Button, VARIANTS } from "@/components/work/claude/specimens"
import {
  Cell,
  DocHeader,
  Section,
  Spec,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const COLUMNS = ["", "Small", "Medium", "Large", "Leading icon", "Icon only"]

export function ButtonsDoc() {
  return (
    <>
      <DocHeader group="Components" title="Buttons and links">
        Buttons are an interactive component combining text, icons, and styling
        to trigger actions across multiple contexts including navigation, forms,
        and menus. Everything here is real: hover it, or tab to it.
      </DocHeader>

      <Section
        title="Buttons"
        description="Four variants in three sizes, with an icon after the label, before it, or alone. The side with the icon gets less padding."
      >
        <Specimen className="overflow-x-auto p-6 md:p-8">
          <div className="grid w-max grid-cols-[repeat(6,auto)] items-center gap-x-6 gap-y-5">
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
              <div key={variant} className="cds-caption pr-2">
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
        <Spec>
          Small 28px tall, 12px text, 16px icon. Medium 36px, 15px, 18px. Large
          40px, 17px, 20px. Every size has an 8px radius, and an icon on its own
          is 14px. Labels are weight 480 on dark fills and 500 on light ones.
        </Spec>
      </Section>

      <Section
        title="States and themes"
        description="On hover Primary and Clay grow a 2px ring of their own colour; Secondary and Tertiary grow by 1px and darken their label. Keyboard focus draws a 2px Clay Dark outline 4px away. Buttons change their fill and stroke colors to correspond with different color modes on devices and browsers."
      >
        <Specimen className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-3 md:p-8">
          {(
            [
              ["At rest", undefined],
              [":hover", "hover"],
              [":focus-visible", "focus"],
            ] as const
          ).map(([label, state]) => (
            <Cell key={label} label={label} className="gap-4">
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

      <Section
        title="Links"
        description="A link inside a sentence carries a light underline that darkens with the text on hover. A meta link pairs an icon with a caption. A link card lifts on hover and darkens its meta line."
      >
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
        <Spec>
          Link card: 300 by 200px, 32px radius, padding 32/48/24/24, a serif
          17/28 title, and the medium shadow on hover.
        </Spec>
      </Section>
    </>
  )
}
