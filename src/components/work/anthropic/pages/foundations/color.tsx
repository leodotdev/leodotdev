import { THEMES } from "@/components/work/anthropic/docs"
import {
  Figure,
  Section,
  Specimen,
  usePreviewTheme,
} from "@/components/work/claude/ui"
import { cn } from "@/lib/utils"

// The Color page of the Anthropic.com file, laid out as the Claude docs'
// Color chapter is (Leo, 2026-11-19): its primitives in one figure (the
// grayscale as one strip of steps, then the secondary colors), and its themes
// as a row of small cards, each wearing its theme and picking it for the
// docs' figures.

// step and value; the file's names for four of the steps are in the title
const GRAYS: Array<[string, string, string?]> = [
  ["000", "#FFFFFF", "White"],
  ["050", "#FAF9F5", "Ivory"],
  ["100", "#F5F4ED"],
  ["150", "#F0EEE6"],
  ["200", "#E8E6DC"],
  ["250", "#DEDCD1"],
  ["300", "#D1CFC5"],
  ["350", "#C2C0B6"],
  ["400", "#B0AEA5"],
  ["450", "#9C9A92"],
  ["500", "#87867F"],
  ["550", "#73726C"],
  ["600", "#5E5D59"],
  ["650", "#4D4C48"],
  ["700", "#3D3D3A"],
  ["750", "#30302E"],
  ["800", "#262624"],
  ["850", "#1F1E1D"],
  ["900", "#1A1918"],
  ["950", "#141413", "Slate"],
  ["1000", "#000000", "Black"],
]

// name, value, and whether its label is light; in the file's order, each
// darker color beside its lighter partner
const SECONDARY: Array<[string, string, boolean?]> = [
  ["Fig", "#C46686", true],
  ["Orchid", "#E5CADA"],
  ["Poppy", "#DE6262", true],
  ["Coral", "#EBCECE"],
  ["Clay", "#D97757", true],
  ["Peach", "#EBC9B7"],
  ["Pencil", "#F0AC54"],
  ["Oat", "#E3DACC"],
  ["Olive", "#788C5D", true],
  ["Matcha", "#CED6BF"],
  ["Mineral", "#629987", true],
  ["Cactus", "#BCD1CA"],
  ["Sky", "#6A9BCC", true],
  ["Cloud", "#C5D3E0"],
  ["Plum", "#827DBD", true],
  ["Heather", "#CBCADB"],
]

export function ColorDoc() {
  const { theme, setTheme } = usePreviewTheme()

  return (
    <>
      <Section
        title="Primitives"
        caption="A grayscale of 21 steps, from Gray-000 (White) to Gray-1000 (Black), and 16 secondary colors."
      >
        <Specimen
          figure
          className="flex flex-col items-center gap-2 px-4 py-10 md:px-8 md:py-16"
        >
          <div className="grid w-full grid-cols-7 gap-1 sm:grid-cols-[repeat(21,minmax(0,1fr))] md:gap-1.5">
            {GRAYS.map(([step, value, name], i) => (
              <div
                key={step}
                title={name ? `Gray-${step} (${name}) ${value}` : value}
                className="ads-micro flex h-16 items-center justify-center rounded-[2px] md:h-24"
                style={{
                  background: value,
                  color: i > 9 ? "#FAF9F5" : "#141413",
                  outline: i < 2 ? "1px solid var(--ads-border-3)" : undefined,
                  outlineOffset: -1,
                  letterSpacing: 0,
                }}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="grid w-full max-w-3xl grid-cols-4 gap-1 sm:grid-cols-8 md:gap-1.5">
            {SECONDARY.map(([name, value, light]) => (
              <div
                key={name}
                title={value}
                className="ads-micro flex aspect-square items-center justify-center rounded-[2px] p-1 text-center"
                style={{
                  background: value,
                  color: light ? "#FAF9F5" : "#141413",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </Specimen>
      </Section>

      <Section
        title="Themes"
        caption="Five themes, Ivory the default, each setting the same roles from the primitives."
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
                    // As tall as its three chips: 12px of padding, the 20px
                    // corner less that padding for the chips' own 8px corners.
                    "flex w-full flex-col items-stretch gap-1.5 p-3",
                    theme === id
                      ? "outline-2 outline-tint"
                      : "group-hover:outline-gray"
                  )}
                >
                  {["Primary", "Secondary", "Tertiary"].map((level, i) => (
                    <span
                      key={level}
                      className="ads-caption rounded-[8px] py-1 text-center"
                      style={{
                        background: `var(--ads-bg${i ? `-${i + 1}` : ""})`,
                        border: "1px solid var(--ads-border-3)",
                        color: i === 2 ? "var(--ads-fg)" : "var(--ads-fg-3)",
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
