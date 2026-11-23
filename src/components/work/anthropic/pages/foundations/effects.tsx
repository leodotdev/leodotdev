import { quiet } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Cell, Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Effects page of the Anthropic.com file: its effect styles (a shadow,
// the buttons' hover rings, and two focus rings) and the "Effects"
// collection's radii, named from Tiniest to Hugest. The effects' styles are
// in src/anthropic/foundations.css.

const RADII = [
  ["Tiniest", 2],
  ["Tinier", 4],
  ["Tiny", 8],
  ["Smallest", 12],
  ["Smaller", 16],
  ["Small", 24],
  ["Big", 32],
  ["Bigger", 48],
  ["Biggest", 64],
  ["Huge", 96],
  ["Huger", 128],
  ["Hugest", 200],
] as const

/** A card of plain bars, standing in for what a card holds. */
function Card() {
  return (
    <div
      className="ads-lift flex w-56 flex-col gap-3 p-5"
      style={{
        background: "var(--ads-bg)",
        borderRadius: "var(--ads-radius-smaller)",
      }}
    >
      <span
        className="block aspect-[16/9] w-full"
        style={{
          background: "var(--ads-bg-3)",
          borderRadius: "var(--ads-radius-tiny)",
        }}
      />
      {["80%", "100%", "55%"].map((w, i) => (
        <span
          key={i}
          className="block h-2.5 rounded-full"
          style={{ width: w, background: "var(--ads-bg-4)" }}
        />
      ))}
    </div>
  )
}

/**
 * An effect on a sample, twice: at rest, where hovering or focusing it
 * brings the effect in, and with the effect on.
 */
function Effect({
  label,
  effect,
  variant,
}: {
  label: string
  effect: string
  variant: "primary" | "secondary" | "tertiary"
}) {
  const focus = effect.startsWith("focus")
  return (
    <Cell label={label} className="gap-6 p-2">
      <span
        className="ads-effect"
        data-effect={effect}
        data-variant={variant}
        tabIndex={focus ? 0 : undefined}
        {...quiet}
      >
        Button
      </span>
      <span
        className="ads-effect"
        data-effect={effect}
        data-variant={variant}
        data-on=""
      >
        Button
      </span>
    </Cell>
  )
}

// The cursor hovers the two samples whose effect is a hover, then goes to
// the focus ring and the shadow, which it only points at. Its notes are the
// file's: how each effect style is made, and the Button's note on hover
// ("On hover, animate in a … box-shadow with no blur").
const EFFECTS_DEMO: Array<DemoStep> = [
  {
    on: '[data-effect="secondary-hover"]',
    nth: 0,
    rest: 1400,
    note: {
      kind: "concept",
      title: "Secondary Hover",
      text: "A shadow with no blur, its color bound to a variable. The buttons animate it in on hover.",
    },
  },
  { on: '[data-effect="tertiary-hover"]', nth: 0, rest: 1400 },
  {
    on: '[data-effect="focus"]',
    nth: 1,
    idle: true,
    at: [0.5, 0.5],
    rest: 500,
    note: {
      kind: "concept",
      title: "Focus Outline Ring",
      text: "Two shadows with no blur, one inside the other. Alt draws the pair closer in.",
    },
  },
  {
    on: ".ads-lift",
    idle: true,
    at: [0.5, 0.5],
    rest: 500,
    note: {
      kind: "concept",
      title: "Lift Small",
      text: "A drop shadow, blurred and faint. The other four styles here have no blur.",
    },
  },
]

export function EffectsDoc() {
  return (
    <>
      <Section
        title="Shadows & Rings"
        caption="Shadow: Lift Small; Secondary Hover and Tertiary Hover, a ring in the button’s border color; and two focus rings, Focus Outline Ring and a closer Alt."
      >
        <Specimen figure>
          <DemoCursor
            steps={EFFECTS_DEMO}
            className="grid items-center justify-center gap-x-16 gap-y-10 px-6 py-10 md:grid-cols-[auto_auto] md:px-8 md:py-12"
          >
            <Cell label="Shadow: Lift Small" className="p-4">
              <Card />
            </Cell>
            <div className="flex flex-col gap-8">
              <Effect
                label="Secondary Hover"
                effect="secondary-hover"
                variant="secondary"
              />
              <Effect
                label="Tertiary Hover"
                effect="tertiary-hover"
                variant="tertiary"
              />
              <Effect
                label="Focus Outline Ring"
                effect="focus"
                variant="primary"
              />
              <Effect
                label="Focus Outline Ring Alt"
                effect="focus-alt"
                variant="primary"
              />
            </div>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section title="Radii" caption="Twelve radii, from Tiniest to Hugest.">
        <Specimen
          figure
          className="flex flex-wrap items-end justify-center gap-x-8 gap-y-10 px-6 py-10 md:px-8 md:py-12"
        >
          {RADII.map(([name, r]) => {
            // Each corner is drawn at its true size: a box a little larger
            // than its radius, rounded at its top left.
            const side = Math.max(r * 1.25, 40)
            return (
              <div key={name} className="ads-radius">
                <div
                  style={{ width: side, height: side, borderTopLeftRadius: r }}
                />
                <div className="ads-caption-2">
                  {name}
                  <span
                    className="ads-caption-2-mono block"
                    style={{ color: "var(--ads-fg-3)" }}
                  >
                    {r}
                  </span>
                </div>
              </div>
            )
          })}
        </Specimen>
      </Section>
    </>
  )
}
