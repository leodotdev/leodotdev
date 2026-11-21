import { THEMES } from "@/components/work/claude/docs"
import {
  Figure,
  Section,
  Specimen,
  usePreviewTheme,
} from "@/components/work/claude/ui"
import { cn } from "@/lib/utils"

const GRAYS = [
  ["000", "#ffffff", "White"],
  ["050", "#faf9f5", "Ivory"],
  ["100", "#f5f4ed"],
  ["150", "#f0eee6"],
  ["200", "#e8e6dc"],
  ["250", "#dedcd1"],
  ["300", "#d1cfc5"],
  ["350", "#c2c0b6"],
  ["400", "#b0aea5"],
  ["450", "#9c9a92"],
  ["500", "#87867f"],
  ["550", "#73726c"],
  ["600", "#5e5d59"],
  ["650", "#4d4c48"],
  ["700", "#3d3d3a"],
  ["750", "#30302e"],
  ["800", "#262624"],
  ["850", "#1f1e1d"],
  ["900", "#1a1918"],
  ["950", "#141413", "Slate"],
  ["1000", "#000000", "Black"],
]

// name, value, and whether its label is light
const ACCENTS: Array<[string, string, boolean?]> = [
  ["Heather", "#cbcadb"],
  ["Cactus", "#bcd1ca"],
  ["Peach", "#ebc9b7"],
  ["Plum", "#827dbd", true],
  ["Mineral", "#629987", true],
  ["Sky", "#6a9bcc", true],
]

// Clay and its two darker shades, then the two colors with one job each.
const CLAY = [
  ["Clay", "#d97757"],
  ["Clay Interactive", "#c6613f"],
  ["Clay Dark", "#c46849"],
  ["Error", "#bf4d43"],
  ["Switch", "#2c84db"],
]

export function ColorDoc() {
  const { theme, setTheme } = usePreviewTheme()

  return (
    <>
      <Section
        title="Palette"
        caption="The palette starts from one ramp of neutrals, 000 to 1000, plus accents and Clay."
      >
        <Specimen
          figure
          className="flex flex-col items-center gap-2 px-4 py-10 md:px-8 md:py-16"
        >
          <div className="grid w-full grid-cols-7 gap-1 sm:grid-cols-[repeat(21,minmax(0,1fr))] md:gap-1.5">
            {GRAYS.map(([step, value], i) => (
              <div
                key={step}
                title={value}
                className="cds-micro flex h-16 items-center justify-center rounded-[2px] md:h-24"
                style={{
                  background: value,
                  color: i > 9 ? "#faf9f5" : "#141413",
                  outline: i < 2 ? "1px solid var(--cds-border-3)" : undefined,
                  outlineOffset: -1,
                  letterSpacing: 0,
                }}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="grid w-full max-w-xl grid-cols-3 gap-1 sm:grid-cols-6 md:gap-1.5">
            {ACCENTS.map(([name, value, light]) => (
              <div
                key={name}
                title={value}
                className="cds-micro flex aspect-square items-center justify-center rounded-[2px] p-1 text-center"
                style={{
                  background: value,
                  color: light ? "#faf9f5" : "#141413",
                }}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="grid w-full max-w-[30rem] grid-cols-5 gap-1 md:gap-1.5">
            {CLAY.map(([name, value]) => (
              <div
                key={name}
                title={value}
                className="cds-micro flex aspect-square items-center justify-center rounded-[2px] p-1 text-center"
                style={{ background: value, color: "#faf9f5" }}
              >
                {name}
              </div>
            ))}
          </div>
        </Specimen>
      </Section>

      <Section
        title="Themes"
        caption="Seven themes drawn, five on the site, Ivory the default."
      >
        <Figure>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {THEMES.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                data-wave-hover="off"
                data-wave-manual
                aria-pressed={theme === id}
                className="group flex flex-col gap-1.5 text-left"
                onClick={(e) => setTheme(id, e)}
              >
                <Specimen
                  theme={id}
                  className={cn(
                    // As tall as its three chips: 12px of padding, the 20px corner
                    // less that padding for the chips' own 8px corners.
                    "flex w-full flex-col items-stretch gap-1.5 p-3",
                    theme === id
                      ? "outline-2 outline-tint"
                      : "group-hover:outline-gray"
                  )}
                >
                  {["Primary", "Secondary", "Tertiary"].map((level, i) => (
                    <span
                      key={level}
                      className="cds-caption rounded-[8px] py-1 text-center"
                      style={{
                        background: `var(--cds-bg${i ? `-${i + 1}` : ""})`,
                        border: "1px solid var(--cds-border-3)",
                        color: i === 2 ? "var(--cds-fg)" : "var(--cds-fg-3)",
                      }}
                    >
                      {level}
                    </span>
                  ))}
                </Specimen>
                {/* Named as in the Figma file, which marks Ivory as the default. */}
                <span
                  className={cn(
                    "text-xs",
                    theme !== id && "text-muted-foreground"
                  )}
                >
                  {id === "ivory" ? `${name} (Default)` : name}
                </span>
              </button>
            ))}
          </div>
        </Figure>
      </Section>
    </>
  )
}
