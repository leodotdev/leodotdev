import { useEffect, useRef } from "react"
import {
  TbArrowLeft,
  TbArrowRight,
  TbArrowUp,
  TbSearch,
  TbX,
} from "react-icons/tb"

// The design system's controls as small React components over the `.cds-*`
// classes in src/claude-ds.css. `state` shows a hover or focus state without
// the pointer, for the docs. None of them take the site's hover wave.

export const VARIANTS = ["primary", "secondary", "tertiary", "clay"] as const
export type Variant = (typeof VARIANTS)[number]

export function Button({
  variant = "primary",
  size = "medium",
  icon = "trailing",
  state,
  children = "Button",
}: {
  variant?: Variant
  size?: "small" | "medium" | "large"
  icon?: "trailing" | "leading" | "none" | "only"
  state?: "hover" | "focus"
  children?: string
}) {
  return (
    <button
      type="button"
      className="cds-btn"
      data-variant={variant}
      data-size={size}
      data-icon={icon}
      data-state={state}
      data-wave-hover="off"
      data-wave-manual
      aria-label={icon === "only" ? "Search" : undefined}
    >
      {(icon === "leading" || icon === "only") && <TbSearch aria-hidden />}
      {icon !== "only" && children}
      {icon === "trailing" && <TbArrowRight aria-hidden />}
    </button>
  )
}

const PLACEHOLDER = "How can I help you today?"

export function TextInput({
  size = "medium",
  leading = false,
  trailing,
  state,
  defaultValue,
}: {
  size?: "medium" | "larger"
  leading?: boolean
  trailing?: "icon" | "button"
  state?: "focus"
  defaultValue?: string
}) {
  return (
    <label
      className="cds-input w-full max-w-xs"
      data-size={size}
      data-leading={leading ? "" : undefined}
      data-trailing={trailing}
      data-state={state}
    >
      {leading && <TbSearch aria-hidden />}
      <input
        type="text"
        placeholder={PLACEHOLDER}
        defaultValue={defaultValue}
        aria-label={PLACEHOLDER}
      />
      {trailing === "icon" && <TbX aria-hidden />}
      {trailing === "button" && (
        <button
          type="button"
          className="cds-btn"
          data-variant="clay"
          data-size="small"
          data-icon="only"
          data-wave-hover="off"
          data-wave-manual
          aria-label="Send"
        >
          <TbArrowUp aria-hidden />
        </button>
      )}
    </label>
  )
}

export function Check({
  type = "checkbox",
  name,
  defaultChecked,
  indeterminate,
  state,
  children = "Label",
}: {
  type?: "checkbox" | "radio"
  name?: string
  defaultChecked?: boolean
  /** A checkbox that is neither on nor off: some of what it stands for is. */
  indeterminate?: boolean
  state?: "hover" | "focus"
  children?: string
}) {
  // There is no attribute for it: the state is set on the element, and the
  // browser clears it when the box is pressed.
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (input.current) input.current.indeterminate = !!indeterminate
  }, [indeterminate])
  return (
    <label className="cds-check">
      <input
        ref={input}
        type={type}
        name={name}
        defaultChecked={defaultChecked}
        data-state={state}
      />
      {children}
    </label>
  )
}

export function Switch({
  tone,
  defaultChecked,
  state,
  children = "Label",
}: {
  tone?: "blue"
  defaultChecked?: boolean
  state?: "hover" | "focus"
  children?: string
}) {
  return (
    <label className="cds-switch">
      <input
        type="checkbox"
        role="switch"
        defaultChecked={defaultChecked}
        data-tone={tone}
        data-state={state}
      />
      {children}
    </label>
  )
}

/**
 * A carousel's controls ("Carousel: UI" in the file): previous, a bullet for
 * each stop with the current one dark, and next.
 */
export function CarouselUi({
  count,
  current,
  onStep,
  onPick,
  size,
  spread,
  ends,
}: {
  count: number
  current: number
  onStep: (by: 1 | -1) => void
  /** Makes each bullet a button that goes to its stop. */
  onPick?: (stop: number) => void
  size?: "small"
  /** The arrows at the two ends of the row, the bullets between them. */
  spread?: boolean
  /** Stops at the first and last: the arrow with nowhere to go is dimmed. */
  ends?: boolean
}) {
  const button = {
    type: "button",
    className: "cds-btn",
    "data-variant": "tertiary",
    "data-size": size,
    "data-icon": "only",
    "data-wave-hover": "off",
    "data-wave-manual": true,
  } as const
  const first = ends && current <= 0
  const last = ends && current >= count - 1
  return (
    <div className="cds-carousel-ui" data-spread={spread ? "" : undefined}>
      <button
        {...button}
        aria-label="Previous"
        aria-disabled={first || undefined}
        onClick={() => !first && onStep(-1)}
      >
        <TbArrowLeft aria-hidden />
      </button>
      {onPick ? (
        <div className="cds-bullets">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} of ${count}`}
              aria-current={i === current || undefined}
              data-current={i === current ? "" : undefined}
              data-wave-hover="off"
              data-wave-manual
              onClick={() => onPick(i)}
            />
          ))}
        </div>
      ) : (
        <div className="cds-bullets" aria-hidden>
          {Array.from({ length: count }, (_, i) => (
            <span key={i} data-current={i === current ? "" : undefined} />
          ))}
        </div>
      )}
      <button
        {...button}
        aria-label="Next"
        aria-disabled={last || undefined}
        onClick={() => !last && onStep(1)}
      >
        <TbArrowRight aria-hidden />
      </button>
    </div>
  )
}
