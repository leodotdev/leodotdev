import { useId, useState } from "react"
import { TbChevronDown, TbHelp } from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import { Button } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Contact Sales template (the two "Contact sales" frames on the Figma
// file's Templates page): the site navigation, a section header, the form on
// a card with a help card in the margin beside it, a dark call to action,
// and the footer. Its words are the file's. The file draws the form in two
// states, which are one form here: only its first question, and, once that
// is answered "Contact sales", the rest of it.

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

// What a select says while nothing is chosen.
const PLACEHOLDER = "Please select"

// The form's first question, and the one answer the file gives it.
const TOPIC = "What can we help you with?"
const TOPICS = ["Contact sales"]

type Field = {
  label: string
  /** A line of text by default. */
  kind?: "select" | "area"
  /** Takes the form's whole width, not half of it. */
  wide?: true
  /** Every field is required but the last. */
  optional?: true
  /** A line under the label. */
  note?: string
}

// The rest of the form, in order. The file names no options for its
// selects, so each offers only its empty state.
const FIELDS: Array<Field> = [
  { label: "First name" },
  { label: "Last name" },
  {
    label: "Business email",
    wide: true,
    note: "If you’re an existing user, please enter your account email.",
  },
  { label: "Phone number" },
  { label: "Job title" },
  { label: "Company or organization name" },
  { label: "Company or organization website" },
  { label: "Industry", kind: "select" },
  { label: "Company headquarters location", kind: "select" },
  { label: "Primary product interest", kind: "select", wide: true },
  {
    label:
      "Please describe the Gen AI SaaS solution you’re currently using, if any",
    kind: "area",
    wide: true,
  },
  {
    label: "Where are you in your evaluation journey?",
    kind: "select",
    wide: true,
  },
  {
    label:
      "Please share a bit more about why you’re contacting us and how the Anthropic team can support you",
    kind: "area",
    wide: true,
  },
  {
    label: "How did you hear about us?",
    kind: "select",
    wide: true,
    optional: true,
  },
]

/** A field's label, with the star of a required one. */
function Label({ field }: { field: Field }) {
  return (
    <>
      {field.label}
      {!field.optional && <i aria-hidden>*</i>}
    </>
  )
}

/**
 * A select: the system's own, at the size and in the colors of the form's
 * fields. Its list opens under it, with the empty state first.
 */
function Choice({
  field,
  options = [],
  value,
  onPick,
}: {
  field: Field
  options?: Array<string>
  value: string | null
  onPick: (option: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const id = useId()

  return (
    <div className="cds-contact-field" data-wide={field.wide ? "" : undefined}>
      <span id={id}>
        <Label field={field} />
      </span>
      <div ref={ref} className="cds-select-wrap">
        <button
          type="button"
          className="cds-select"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id} ${id}-value`}
          data-filled={value === null ? undefined : ""}
          onClick={() => setOpen(!open)}
          {...quiet}
        >
          <span id={`${id}-value`}>{value ?? PLACEHOLDER}</span>
          <TbChevronDown aria-hidden />
        </button>
        {open && (
          <div className="cds-menu" role="listbox" aria-labelledby={id}>
            {[null, ...options].map((option) => (
              <button
                key={option ?? ""}
                type="button"
                role="option"
                aria-selected={value === option}
                className="cds-menu-item"
                onClick={() => {
                  onPick(option)
                  setOpen(false)
                }}
                {...quiet}
              >
                <span>{option ?? PLACEHOLDER}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** A field to write in: one line, or a few. */
function Entry({ field }: { field: Field }) {
  return (
    <label
      className="cds-contact-field"
      data-wide={field.wide ? "" : undefined}
    >
      <span>
        <Label field={field} />
      </span>
      {field.note && <small>{field.note}</small>}
      <span
        className="cds-input"
        data-size="larger"
        data-area={field.kind === "area" ? "" : undefined}
      >
        {field.kind === "area" ? (
          <textarea aria-required={!field.optional} />
        ) : (
          <input
            type="text"
            autoComplete="off"
            aria-required={!field.optional}
          />
        )}
      </span>
    </label>
  )
}

/**
 * The form. It can be filled in, and its button sends nothing. Answering
 * the first question brings the rest of the form; clearing the answer takes
 * it away again.
 */
function ContactForm() {
  // What each select is set to, by its label.
  const [picked, setPicked] = useState<Record<string, string | null>>({
    [TOPIC]: TOPICS[0],
  })
  const choice = (field: Field, options?: Array<string>) => (
    <Choice
      key={field.label}
      field={field}
      options={options}
      value={picked[field.label] ?? null}
      onPick={(option) => setPicked({ ...picked, [field.label]: option })}
    />
  )

  return (
    <form className="cds-contact-form" onSubmit={(e) => e.preventDefault()}>
      {choice({ label: TOPIC, kind: "select", wide: true }, TOPICS)}
      {(picked[TOPIC] ?? null) !== null && (
        <>
          {FIELDS.map((field) =>
            field.kind === "select" ? (
              choice(field)
            ) : (
              <Entry key={field.label} field={field} />
            )
          )}
          <div className="cds-contact-submit">
            <Button size="large" icon="none">
              Submit
            </Button>
          </div>
        </>
      )}
    </form>
  )
}

/**
 * The page: Ivory down to the end of the form, then the call to action and
 * the footer on Dark 3. On the site's dark mode they are Dark 3 and Dark 2.
 */
function ContactSales() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Contact sales"]} />
        <div className="cds-contact-main">
          <Header
            size="p1"
            align="left"
            title="Contact sales"
            subtitle="Our sales team can provide additional resources and support for the Anthropic API and Claude for Work."
            pictogram={null}
            actions={null}
          />
          <ContactForm />
          {/* The file's "Marginalia - Support center" card. */}
          <aside className="cds-margin cds-contact-help">
            <div className="cds-margin-card">
              <div className="cds-margin-head">
                <TbHelp aria-hidden />
                More help, right this way
              </div>
              <p>
                Browse articles, see product details, and get answers to
                technical questions.
              </p>
              <div>
                <Button size="small" variant="tertiary" icon="none">
                  Visit Support Center
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </TemplateBlock>

      <TemplateSection
        theme={["dark-3", "dark-2"]}
        className="cds-contact-prefooter"
      >
        <Header
          size="p1"
          // The headline's lines break where the file breaks them.
          title={"Transform how\nyour organization\noperates with Claude"}
          subtitle={null}
          pictogram={null}
          actions={
            <Button size="large" variant="secondary" icon="none">
              Get started
            </Button>
          }
        />
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <Footer />
      </TemplateBlock>
    </>
  )
}

const form = ".cds-contact-form"

// The page's own things for the demo cursor, wide and again at a phone's
// width. The scrolling and resizing around them are the template figure's
// (`around` in template.tsx), which also leaves the site's header alone.
const CONTACT_SALES_DEMO: Array<DemoStep> = [
  { on: `${form} .cds-select`, click: "open" },
  { on: `${form} .cds-menu-item`, text: "Contact sales", click: true },
  { on: `${form} .cds-input`, type: "Johnnie", rest: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: `${form} .cds-select`, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function ContactSalesDoc() {
  return (
    <Section>
      <TemplateFigure steps={CONTACT_SALES_DEMO}>
        <ContactSales />
      </TemplateFigure>
    </Section>
  )
}
