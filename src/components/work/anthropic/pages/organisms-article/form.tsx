import { useCallback, useState } from "react"
import { TbArrowRight, TbChevronDown, TbExternalLink } from "react-icons/tb"
import {
  Button,
  Checkbox,
  Radio,
  Select,
  TextInput,
} from "@/components/work/anthropic/specimens"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { cn } from "@/lib/utils"

// The form in a long piece on Anthropic.com, from the Figma file's "Form
// (WIP)" section (Organisms page): the fields, and the four places the file
// puts it in a piece, in its text ("Insitu"), behind a button that leads away
// ("External"), behind a button that opens it under itself ("External -
// Dropdown"), and in a panel from the side ("Flyout form"). The fields are
// the system's own (specimens.tsx); the sample words are the file's. Styles:
// `.ads-form*` in src/anthropic/organisms-article.css.

const HINT =
  "If you're at a university or hospital, enter the institution's name, not your lab's."
const ENTITY_HINT =
  "If you work at a university, hospital, or company, enter your institution as the organization and choose its entity type, even if access is for your lab or team."
const OPTIONS = ["Option 1", "Option 2", "Option 3", "Option 4"]
// An empty field: the file's fields hold no placeholder.
const EMPTY = " "

/** A group of radios or checkboxes, under its question. */
function Choices({
  legend,
  type,
  name,
}: {
  legend: string
  type: "radio" | "checkbox"
  name: string
}) {
  const Control = type === "radio" ? Radio : Checkbox
  return (
    <fieldset className="ads-form-choices">
      <legend className="ads-form-legend">
        {legend}
        <span aria-hidden> *</span>
      </legend>
      <div>
        {OPTIONS.map((option) => (
          <Control key={option} size="small" name={name} value={option}>
            {option}
          </Control>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * The file's form: names, email and organization two to a row; fields with
 * a hint under their label; two dropdowns; a question answered with radios
 * and one with checkboxes; a note; and the button that sends it. Every
 * field is required. `short` is the flyout's version, which leaves out the
 * radios and checkboxes and has a field for the reader's role.
 */
export function InterestForm({
  short = false,
  className,
}: {
  short?: boolean
  className?: string
}) {
  const field = { required: true, size: "small" as const, placeholder: "" }
  return (
    <form
      className={cn("ads-form", className)}
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="ads-form-pair">
        <TextInput label="First name" autoComplete="off" {...field} />
        <TextInput label="Last name" autoComplete="off" {...field} />
      </div>
      {short ? (
        <>
          <TextInput label="Work email" autoComplete="off" {...field} />
          <TextInput label="Your role or title" autoComplete="off" {...field} />
        </>
      ) : (
        <div className="ads-form-pair">
          <TextInput label="Work email" autoComplete="off" {...field} />
          <TextInput label="Organization name" autoComplete="off" {...field} />
        </div>
      )}
      <TextInput
        label="Organization name"
        help={HINT}
        autoComplete="off"
        {...field}
      />
      <TextInput
        label="Organization website"
        help={HINT}
        autoComplete="off"
        {...field}
      />
      <Select
        label="Entity type"
        help={ENTITY_HINT}
        required
        size="small"
        options={OPTIONS}
        placeholder={EMPTY}
      />
      <Select
        label="What are you interested in?"
        required
        size="small"
        options={OPTIONS}
        placeholder={EMPTY}
      />
      {!short && (
        <>
          <Choices
            legend="What is the main area of interest?"
            type="radio"
            name="ads-form-area"
          />
          <Choices
            legend="Select any other areas that you’d be interested in"
            type="checkbox"
            name="ads-form-other"
          />
        </>
      )}
      <p className="ads-caption-2 ads-form-note">
        * Completing this form does not guarantee you will hear from us.
      </p>
      <Button type="submit" size="small" icon="trailing" className="self-start">
        Submit
      </Button>
    </form>
  )
}

/**
 * The form behind a button, under it in the text: the file's "External -
 * Dropdown", a wide secondary button with a chevron that opens the form
 * beneath it and turns as it does.
 */
export function FormDropdown({ label = "Get involved" }: { label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ads-form-dropdown" data-open={open ? "" : undefined}>
      <Button
        variant="secondary"
        size="large"
        icon="trailing"
        glyph={<TbChevronDown aria-hidden />}
        aria-expanded={open}
        className="ads-form-dropdown-button"
        onClick={() => setOpen((now) => !now)}
      >
        {label}
      </Button>
      {open && <InterestForm />}
    </div>
  )
}

/** The button that leads away to the form: the file's "External". */
export function FormLink({
  label = "Get involved",
  onClick,
}: {
  label?: string
  onClick?: () => void
}) {
  return (
    <Button
      variant="secondary"
      size="large"
      icon="trailing"
      glyph={<TbExternalLink aria-hidden />}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

/**
 * The form in a panel from the side of the page: the file's "Flyout form".
 * Its head names it ("Subscribe") beside a button that closes it, then a
 * title, a line about the form, and the short form.
 */
export function FlyoutForm({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const close = useCallback(() => onClose(), [onClose])
  const ref = useDismiss(open, close)
  if (!open) return null
  return (
    <div className="ads-form-flyout-scrim">
      <div
        ref={ref}
        role="dialog"
        aria-label="Getting involved in drug development work"
        className="ads-form-flyout"
      >
        <div className="ads-form-flyout-head">
          <span className="ads-caption-1">Subscribe</span>
          <Button
            variant="secondary"
            icon="only"
            glyph={<TbArrowRight aria-hidden />}
            onClick={close}
          >
            Close
          </Button>
        </div>
        <div className="ads-form-flyout-intro">
          <h2 className="ads-heading-3">
            Getting involved in drug development work
          </h2>
          <p className="ads-body-3">
            If you work at an organization focused on drug development and would
            like to get in touch or register interest, complete the following
            form.
          </p>
        </div>
        <InterestForm short />
      </div>
    </div>
  )
}
