import { Figure, Section, Specimen } from "@/components/work/claude/ui"

const HEADLINE = "Meet Claude, your thinking partner"
const SUBHEAD = "AI that thinks with you, not for you"
// From the file's own specimen copy.
const BODY =
  "Its purpose is to showcase how the type system performs across different scales."

const FAMILIES = [
  {
    name: "Anthropic Serif",
    stack: "var(--cds-serif)",
    weight: 500,
    note: "Display, headlines, large paragraphs",
  },
  {
    name: "Anthropic Sans",
    stack: "var(--cds-sans)",
    weight: 400,
    note: "Body text, captions, labels",
  },
  {
    name: "Anthropic Mono",
    stack: "var(--cds-mono)",
    weight: 400,
    note: "Code",
  },
]

// name, class, size in px (on a 320px screen, then at 1440px and up) and
// leading as a ratio, sample
const STYLES: Array<[string, string, string, string]> = [
  ["Display 1", "cds-display-1", "42–72 · 1.1", HEADLINE],
  ["Display 2", "cds-display-2", "36–64 · 1.1", HEADLINE],
  ["Headline 1", "cds-headline-1", "34–52 · 1.2", HEADLINE],
  ["Headline 2", "cds-headline-2", "30–44 · 1.2", HEADLINE],
  ["Headline 3", "cds-headline-3", "28–36 · 1.3", HEADLINE],
  ["Headline 4", "cds-headline-4", "23–32 · 1.1", SUBHEAD],
  ["Headline 5", "cds-headline-5", "20–25 · 1.2", SUBHEAD],
  ["Headline 6", "cds-headline-6", "16–19 · 1.2", SUBHEAD],
  ["Body Large 1", "cds-body-large-1", "22–24 · 1.6", BODY],
  ["Body Large 2", "cds-body-large-2", "20–23 · 1.5", BODY],
  ["Body 1", "cds-body-1", "19–20 · 1.6", BODY],
  ["Body 2", "cds-body-2", "17 · 1.6", BODY],
  ["Body 3", "cds-body-3", "15 · 1.6", BODY],
  ["Caption", "cds-caption", "12 · 1.6", BODY],
  ["Micro", "cds-micro", "10 · 1.6", "Navigating AI in education together"],
]

export function TypographyDoc() {
  return (
    <>
      <Section
        title="Families"
        caption="Body is set in the sans and Body Large in the serif; each also comes in the other."
      >
        <Specimen figure className="grid sm:grid-cols-3">
          {FAMILIES.map((family, i) => (
            <div
              key={family.name}
              className="flex flex-col items-center gap-6 p-6 text-center md:p-8"
              style={
                i ? { borderInlineStart: "1px solid var(--cds-border-3)" } : {}
              }
            >
              {/* The line is set in the sans for all three, and the sample
                  adds no height of its own, so the three baselines line up
                  whatever each family's own ascent is. */}
              <div
                style={{
                  fontFamily: "var(--cds-sans)",
                  fontSize: 96,
                  lineHeight: "96px",
                }}
              >
                <span
                  style={{
                    fontFamily: family.stack,
                    fontWeight: family.weight,
                    lineHeight: 0,
                  }}
                >
                  Aa
                </span>
              </div>
              <div>
                <div className="cds-body-3">{family.name}</div>
                <div
                  className="cds-caption"
                  style={{ color: "var(--cds-fg-3)" }}
                >
                  {family.note}
                </div>
              </div>
            </div>
          ))}
        </Specimen>
      </Section>

      <Section title="Scale">
        <Figure>
          <Specimen>
            {STYLES.map(([name, className, size, sample], i) => (
              <div
                key={name}
                className="flex flex-col gap-2 px-6 py-5 md:px-8"
                style={
                  i ? { borderTop: "1px solid var(--cds-border-3)" } : undefined
                }
              >
                <div
                  className="cds-caption"
                  style={{ color: "var(--cds-fg-3)" }}
                >
                  <span style={{ color: "var(--cds-fg)" }}>{name}</span> {size}
                </div>
                <div className={className}>{sample}</div>
              </div>
            ))}
          </Specimen>
        </Figure>
      </Section>
    </>
  )
}
