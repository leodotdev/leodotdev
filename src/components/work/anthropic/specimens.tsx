import { useEffect, useId, useRef, useState } from "react"
import {
  TbArrowRight,
  TbCheck,
  TbChevronDown,
  TbChevronUp,
  TbDots,
  TbMinus,
} from "react-icons/tb"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { cn } from "@/lib/utils"

// The Anthropic.com system's controls that every page of its docs uses. The
// Button's tokens and styles are in src/anthropic-ds.css (`.ads-btn`); the
// other atoms' styles are in src/anthropic/atoms.css. `state` shows a hover
// or focus state without the pointer, for the docs (`data-state`, which the
// demo cursor also sets).

/** Props a docs control takes so the site's hover and click waves leave it alone. */
export const quiet = {
  "data-wave-hover": "off",
  "data-wave-manual": true,
} as const

type State = "hover" | "focus"

export type ButtonVariant = "primary" | "secondary" | "tertiary"
export type ButtonSize = "tiny" | "small" | "medium" | "large"
export type ButtonCorner = "squircle" | "round"
export type ButtonIcon = "none" | "leading" | "trailing" | "only"

/**
 * The system's button: Primary, Secondary, or Tertiary; Tiny, Small, Medium,
 * or Large; a squircle or fully round ("Rounded-full"); and an icon before
 * the label, after it, or alone (the file's "Format"). The icon is the
 * file's arrow unless another is given.
 */
export function Button({
  variant = "primary",
  size = "medium",
  corner = "squircle",
  icon = "none",
  glyph,
  state,
  className,
  children = "Button",
  ...rest
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  corner?: ButtonCorner
  icon?: ButtonIcon
  /** The icon, where the button has one; the arrow by default. */
  glyph?: React.ReactNode
  state?: State
  className?: string
  children?: React.ReactNode
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const mark = glyph ?? <TbArrowRight aria-hidden />
  return (
    <button
      type="button"
      className={cn("ads-btn", className)}
      data-variant={variant}
      data-size={size}
      data-corner={corner}
      data-icon={icon === "none" ? undefined : icon}
      data-state={state}
      aria-label={
        icon === "only" && typeof children === "string" ? children : undefined
      }
      {...quiet}
      {...rest}
    >
      {icon === "leading" && mark}
      {icon !== "only" && children}
      {icon === "trailing" && mark}
      {icon === "only" && mark}
    </button>
  )
}

/**
 * The play button: a tertiary button with the file's play mark, Small or
 * Large, lifted off what it sits on by a soft shadow. Over a picture it
 * starts a video.
 */
export function PlayButton({
  size = "large",
  state,
  className,
  label = "Play",
  ...rest
}: {
  size?: "small" | "large"
  state?: State
  className?: string
  label?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      type="button"
      className={cn("ads-play", className)}
      data-size={size}
      data-state={state}
      aria-label={label}
      {...quiet}
      {...rest}
    >
      <span aria-hidden />
    </button>
  )
}

/**
 * The tiny more button: three dots in a small secondary pill. Pressed
 * ("Active") it turns primary with an arrow, and what it stands for opens
 * beside it.
 */
export function MoreButton({
  active,
  onActiveChange,
  state,
  className,
  label = "More",
  ...rest
}: {
  active?: boolean
  onActiveChange?: (active: boolean) => void
  state?: State
  className?: string
  label?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const [own, setOwn] = useState(false)
  const on = active ?? own
  return (
    <button
      type="button"
      className={cn("ads-btn ads-more", className)}
      data-variant={on ? "primary" : "secondary"}
      data-size="tiny"
      data-corner="round"
      data-icon="only"
      data-active={on ? "" : undefined}
      data-state={state}
      aria-label={label}
      aria-expanded={on}
      onClick={() => {
        setOwn(!on)
        onActiveChange?.(!on)
      }}
      {...quiet}
      {...rest}
    >
      {on ? <TbArrowRight aria-hidden /> : <TbDots aria-hidden />}
    </button>
  )
}

export type FieldSize = "small" | "medium" | "large"

/**
 * A radio button and its label, Small, Medium, or Large. Selected, its
 * circle fills and a dot shows in it.
 */
export function Radio({
  size = "medium",
  state,
  className,
  children = "Label",
  ...rest
}: {
  size?: FieldSize
  state?: State
  className?: string
  children?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">) {
  return (
    <label
      className={cn("ads-choice", className)}
      data-size={size}
      data-disabled={rest.disabled ? "" : undefined}
    >
      <span className="ads-choice-wrap">
        <input
          type="radio"
          className="ads-radio"
          data-state={state}
          {...quiet}
          {...rest}
        />
      </span>
      {children}
    </label>
  )
}

/**
 * A checkbox and its label, Small, Medium, or Large: off, on (a check), or
 * neither (a dash: "Indeterminate").
 */
export function Checkbox({
  size = "medium",
  indeterminate,
  state,
  className,
  children = "Label",
  ...rest
}: {
  size?: FieldSize
  /** Neither on nor off: some of what it stands for is. */
  indeterminate?: boolean
  state?: State
  className?: string
  children?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">) {
  // There is no attribute for it: the state is set on the element, and the
  // browser clears it when the box is pressed.
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (input.current) input.current.indeterminate = !!indeterminate
  }, [indeterminate])
  return (
    <label
      className={cn("ads-choice", className)}
      data-size={size}
      data-disabled={rest.disabled ? "" : undefined}
    >
      <span className="ads-choice-wrap">
        <span className="ads-checkbox">
          <input
            ref={input}
            type="checkbox"
            data-state={state}
            {...quiet}
            {...rest}
          />
          <TbCheck aria-hidden data-mark="check" />
          <TbMinus aria-hidden data-mark="dash" />
        </span>
      </span>
      {children}
    </label>
  )
}

export type InputSize = "small" | "medium" | "large" | "larger"

/** The parts every field shares: its label (and help text) and its message. */
function FieldFrame({
  id,
  label,
  help,
  required,
  message,
  error,
  disabled,
  className,
  children,
}: {
  id: string
  label?: React.ReactNode
  help?: React.ReactNode
  required?: boolean
  message?: React.ReactNode
  error?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn("ads-field", className)}
      data-error={error ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      {(label || help) && (
        <div className="ads-field-head">
          {label && (
            <label className="ads-field-label" htmlFor={id}>
              {label}
              {required && <span aria-hidden> *</span>}
            </label>
          )}
          {help && (
            <p className="ads-field-help" id={`${id}-help`}>
              {help}
            </p>
          )}
        </div>
      )}
      {children}
      {message && (
        <p className="ads-field-message" id={`${id}-message`}>
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * A text field: a label (with help text, if any), the input, and a message
 * under it. Small, Medium, Large, or Larger; at rest, hovered, focused,
 * filled, in error, or disabled. An icon can sit before or after the value.
 */
export function TextInput({
  size = "medium",
  label = "Label",
  help,
  message,
  error,
  required,
  leading,
  trailing,
  state,
  className,
  placeholder = "Input value",
  ...rest
}: {
  size?: InputSize
  label?: React.ReactNode
  help?: React.ReactNode
  message?: React.ReactNode
  error?: boolean
  leading?: React.ReactNode
  trailing?: React.ReactNode
  state?: State
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">) {
  const id = useId()
  return (
    <FieldFrame
      id={id}
      label={label}
      help={help}
      required={required}
      message={message}
      error={error}
      disabled={rest.disabled}
      className={className}
    >
      <div className="ads-input" data-size={size} data-state={state}>
        {leading}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={
            [help && `${id}-help`, message && `${id}-message`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...quiet}
          {...rest}
        />
        {trailing}
      </div>
    </FieldFrame>
  )
}

/**
 * The select ("Dropdown" in the file): the text field's box with a caret,
 * which opens a list of choices under it. It has the field's states and one
 * more, Open, where the caret turns up. Arrow keys move through the choices,
 * Enter or Space picks one, and Escape closes the list.
 */
export function Select({
  size = "medium",
  label = "Label",
  help,
  message,
  error,
  required,
  disabled,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Value",
  open: openProp,
  state,
  className,
}: {
  size?: InputSize
  label?: React.ReactNode
  help?: React.ReactNode
  message?: React.ReactNode
  error?: boolean
  required?: boolean
  disabled?: boolean
  options: ReadonlyArray<string>
  value?: string | null
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  /** Shows the list open, for the docs. */
  open?: boolean
  state?: State
  className?: string
}) {
  const id = useId()
  const [own, setOwn] = useState<string | null>(defaultValue ?? null)
  const picked = value === undefined ? own : value
  const [open, setOpen] = useState(!!openProp)
  // The choice the arrow keys are on while the list is open.
  const [active, setActive] = useState(0)
  const ref = useDismiss(open, () => setOpen(false))
  const button = useRef<HTMLButtonElement>(null)

  const show = (at = Math.max(0, options.indexOf(picked ?? ""))) => {
    setActive(at)
    setOpen(true)
  }
  const pick = (choice: string) => {
    setOwn(choice)
    onValueChange?.(choice)
    setOpen(false)
    button.current?.focus({ preventScroll: true })
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (disabled) return
    const last = options.length - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
    }
    if (e.key in moves) {
      e.preventDefault()
      if (!open) show()
      else setActive(moves[e.key])
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (open) pick(options[active])
      else show()
    } else if (e.key === "Escape" && open) {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === "Tab" && open) {
      setOpen(false)
    }
  }

  return (
    <FieldFrame
      id={id}
      label={label}
      help={help}
      required={required}
      message={message}
      error={error}
      disabled={disabled}
      className={className}
    >
      <div ref={ref} className="ads-select-anchor">
        <button
          ref={button}
          id={id}
          type="button"
          className="ads-input ads-select"
          data-size={size}
          data-state={state}
          data-filled={picked ? "" : undefined}
          data-open={open ? "" : undefined}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={open ? `${id}-${active}` : undefined}
          aria-invalid={error || undefined}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={onKey}
          {...quiet}
        >
          <span className="ads-select-value">{picked ?? placeholder}</span>
          {open ? <TbChevronUp aria-hidden /> : <TbChevronDown aria-hidden />}
        </button>
        {open && (
          <ul
            id={`${id}-list`}
            role="listbox"
            className="ads-select-list"
            data-size={size}
            aria-labelledby={id}
          >
            {options.map((choice, i) => (
              <li
                key={choice}
                id={`${id}-${i}`}
                role="option"
                aria-selected={choice === picked}
                data-active={i === active ? "" : undefined}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(choice)}
                {...quiet}
              >
                {choice}
                {choice === picked && <TbCheck aria-hidden />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldFrame>
  )
}

/**
 * The slider: a tertiary pill holding a line and a knob, Small, Medium, or
 * Large. With two values it is a range ("Range Middle", or "Range Start"
 * with the lower knob at the start). The knobs are sliders for the keyboard
 * (the arrow keys, Home, and End) and follow the demo cursor's drags.
 */
export function Slider({
  size = "medium",
  defaultValue = 60,
  min = 0,
  max = 100,
  label = "Value",
  className,
}: {
  size?: FieldSize
  /** One value, or the two ends of a range. */
  defaultValue?: number | [number, number]
  min?: number
  max?: number
  label?: string
  className?: string
}) {
  const [values, setValues] = useState<Array<number>>(
    typeof defaultValue === "number" ? [defaultValue] : [...defaultValue]
  )
  const track = useRef<HTMLDivElement>(null)
  const range = values.length === 2
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  const clamp = (v: number) => Math.min(max, Math.max(min, v))

  // Moves one knob, which stays on its side of the other.
  const set = (i: number, v: number) =>
    setValues((now) => {
      const next = [...now]
      const lo = range && i === 1 ? now[0] : min
      const hi = range && i === 0 ? now[1] : max
      next[i] = Math.round(Math.min(hi, Math.max(lo, clamp(v))))
      return next
    })

  const fromPointer = (x: number) => {
    const box = track.current?.getBoundingClientRect()
    if (!box || box.width === 0) return min
    return min + ((x - box.left) / box.width) * (max - min)
  }

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const v = fromPointer(e.clientX)
    // The knob nearer the pointer is the one that moves.
    const i = range && Math.abs(v - values[1]) < Math.abs(v - values[0]) ? 1 : 0
    set(i, v)
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    const knob = el.querySelectorAll<HTMLElement>('[role="slider"]')[i]
    knob.focus({ preventScroll: true })
    const move = (ev: PointerEvent) => set(i, fromPointer(ev.clientX))
    const up = () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", up)
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", up)
  }

  // The demo cursor drags a knob by sending it the value to take.
  const knobs = useRef<Array<HTMLSpanElement | null>>([])
  useEffect(() => {
    const els = knobs.current
    const offs = els.map((el, i) => {
      if (!el) return () => {}
      const on = (e: Event) => set(i, (e as CustomEvent<number>).detail)
      el.addEventListener("demo-drag", on)
      return () => el.removeEventListener("demo-drag", on)
    })
    return () => offs.forEach((off) => off())
    // `set` only reads state through its updater.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.length])

  const onKey = (i: number) => (e: React.KeyboardEvent) => {
    const step = (max - min) / 20
    const to: Record<string, number> = {
      ArrowRight: values[i] + step,
      ArrowUp: values[i] + step,
      ArrowLeft: values[i] - step,
      ArrowDown: values[i] - step,
      PageUp: values[i] + step * 4,
      PageDown: values[i] - step * 4,
      Home: min,
      End: max,
    }
    if (!(e.key in to)) return
    e.preventDefault()
    set(i, to[e.key])
  }

  const lo = range ? pct(values[0]) : 0
  const hi = pct(values[range ? 1 : 0])
  return (
    <div className={cn("ads-slider", className)} data-size={size}>
      <div ref={track} className="ads-slider-track" onPointerDown={onDown}>
        <span
          className="ads-slider-fill"
          style={{ left: `${lo}%`, width: `${hi - lo}%` }}
        />
        {values.map((v, i) => (
          <span
            key={i}
            ref={(el) => {
              knobs.current[i] = el
            }}
            role="slider"
            tabIndex={0}
            className="ads-slider-knob"
            style={{ left: `${pct(v)}%` }}
            aria-label={range ? `${label}, ${i ? "upper" : "lower"}` : label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={v}
            onKeyDown={onKey(i)}
            {...quiet}
          />
        ))}
      </div>
    </div>
  )
}
