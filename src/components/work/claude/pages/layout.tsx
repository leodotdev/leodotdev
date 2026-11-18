import { Section, Specimen } from "@/components/work/claude/ui"

// The outer margin grows from 32px on a 320px screen to 64px at 1440px, where
// the content stops growing; these are its values at four common widths.
const BREAKPOINTS = [
  { name: "Mobile", width: 390, columns: 1, gutter: 0, margin: 34 },
  { name: "Tablet", width: 744, columns: 1, gutter: 0, margin: 44 },
  { name: "Laptop", width: 1280, columns: 12, gutter: 32, margin: 59 },
  { name: "Desktop", width: 1920, columns: 12, gutter: 32, margin: 240 },
]

const UNITS = [
  2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 200,
] as const

const RADII = [2, 4, 6, 8, 12, 16, 24, 32, 48, 64] as const

const SHADOWS = [
  ["Small", "var(--cds-shadow-sm)", "0 2px 8px, black at 4%"],
  ["Medium", "var(--cds-shadow-md)", "0 4px 20px, black at 4%"],
  ["Large", "var(--cds-shadow-lg)", "0 4px 16px, black at 10%"],
] as const

export function LayoutDoc() {
  return (
    <>
      <Section
        title="Grid"
        description="Twelve columns from 834px wide, one below. Drawn to scale against the desktop frame."
      >
        <Specimen className="flex flex-col gap-6 p-6 md:p-8">
          {BREAKPOINTS.map((b) => (
            <div key={b.name} className="flex flex-col gap-2">
              <div className="cds-caption" style={{ color: "var(--cds-fg-3)" }}>
                <span style={{ color: "var(--cds-fg)" }}>{b.name}</span>{" "}
                {b.width}px ·{" "}
                {b.columns > 1
                  ? `${b.columns} columns · ${b.gutter}px gutter`
                  : "1 column"}{" "}
                · {b.margin}px margin
              </div>
              {/* The frame, as a share of the 1920px desktop frame. */}
              <div
                style={{ width: `${(b.width / 1920) * 100}%`, minWidth: 72 }}
              >
                <div
                  style={{
                    height: 88,
                    display: "grid",
                    gridTemplateColumns: `repeat(${b.columns}, minmax(0, 1fr))`,
                    // Percentages: padding is of the frame, gap of what is
                    // left inside the margins.
                    columnGap: `${(b.gutter / (b.width - 2 * b.margin)) * 100}%`,
                    paddingInline: `${(b.margin / b.width) * 100}%`,
                    background: "var(--cds-bg-2)",
                    borderRadius: "var(--cds-radius-tinier)",
                    outline: "1px solid var(--cds-border-3)",
                  }}
                >
                  {Array.from({ length: b.columns }, (_, i) => (
                    <div
                      key={i}
                      style={{ background: "var(--cds-border-2)" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Specimen>
      </Section>

      <Section
        title="Spacing, Radius & Shadow"
        description="Spacing from 2px to 200px, radii from 2px to 64px, and three soft shadows."
      >
        <Specimen className="grid gap-x-12 gap-y-8 p-6 md:grid-cols-2 md:p-8">
          <div className="flex flex-col gap-3">
            {UNITS.map((px) => (
              <div key={px} className="flex items-center gap-4">
                <span className="cds-caption w-12 shrink-0">{px}px</span>
                <span
                  className="block"
                  style={{
                    width: px,
                    height: 12,
                    background: "var(--cds-fg-2)",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-5 gap-3">
              {RADII.map((px) => (
                <div key={px} className="flex flex-col gap-2">
                  <div
                    className="aspect-square"
                    style={{
                      borderRadius: px,
                      background: "var(--cds-bg-3)",
                      border: "1px solid var(--cds-border-2)",
                    }}
                  />
                  <div className="cds-caption">{px}px</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {SHADOWS.map(([name, shadow, spec]) => (
                <div
                  key={name}
                  className="cds-caption p-4"
                  style={{
                    background: "var(--cds-card-bg)",
                    borderRadius: "var(--cds-radius-smaller)",
                    border: "1px solid var(--cds-card-border)",
                    boxShadow: shadow,
                  }}
                >
                  {name}
                  <div style={{ color: "var(--cds-fg-3)" }}>{spec}</div>
                </div>
              ))}
            </div>
          </div>
        </Specimen>
      </Section>
    </>
  )
}
