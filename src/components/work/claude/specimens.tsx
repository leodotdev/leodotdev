import { TbArrowRight, TbArrowUp, TbSearch, TbX } from "react-icons/tb"

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
  state,
  children = "Label",
}: {
  type?: "checkbox" | "radio"
  name?: string
  defaultChecked?: boolean
  state?: "hover" | "focus"
  children?: string
}) {
  return (
    <label className="cds-check">
      <input
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
