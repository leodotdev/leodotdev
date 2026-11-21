import { useState } from "react"
import { TbArrowLeft } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"

// Three molecules made of the system's buttons: Button Group, Tabs, and
// Pagination. Exported for the organisms and templates.

/**
 * Button Group: small buttons edge to edge, Secondary or Tertiary, with
 * labels or with the arrow alone (the file's Variant and Type). `state`
 * shows one of the file's states on the first button.
 */
export function ButtonGroup({
  variant = "secondary",
  type = "labels",
  count = 5,
  state,
  labels,
}: {
  variant?: "secondary" | "tertiary"
  type?: "labels" | "icons"
  count?: number
  state?: "hover" | "focus"
  labels?: Array<string>
}) {
  const names = labels ?? Array.from({ length: count }, () => "Button")
  return (
    <div className="ads-btn-group" role="group" data-variant={variant}>
      {names.map((name, i) => (
        <Button
          key={i}
          variant={variant}
          size="small"
          icon={type === "icons" ? "only" : "none"}
          data-state={i === 0 ? state : undefined}
        >
          {name}
        </Button>
      ))}
    </div>
  )
}

/**
 * Tabs: a track of small round buttons, the current one filled. They are
 * ARIA tabs: the arrow keys, Home, and End move between them and show the
 * one they land on. `children` draws the view of the current tab.
 */
export function Tabs({
  labels = ["Label", "Label", "Label", "Label", "Label"],
  current: controlled,
  onChange,
  label = "Views",
  idBase,
}: {
  labels?: Array<string>
  current?: number
  onChange?: (index: number) => void
  label?: string
  /** For the tabs' ids, so a panel can name its tab (`${idBase}-tab-${i}`). */
  idBase?: string
}) {
  const [own, setOwn] = useState(0)
  const current = controlled ?? own
  const pick = (i: number) => {
    setOwn(i)
    onChange?.(i)
  }
  return (
    <div
      className="ads-tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={(e) => {
        const last = labels.length - 1
        const to =
          e.key === "ArrowRight"
            ? current === last
              ? 0
              : current + 1
            : e.key === "ArrowLeft"
              ? current === 0
                ? last
                : current - 1
              : e.key === "Home"
                ? 0
                : e.key === "End"
                  ? last
                  : null
        if (to === null) return
        e.preventDefault()
        pick(to)
        ;[...e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')]
          .at(to)
          ?.focus()
      }}
    >
      {labels.map((name, i) => (
        <button
          key={i}
          id={idBase && `${idBase}-tab-${i}`}
          type="button"
          role="tab"
          aria-selected={current === i}
          aria-controls={idBase && `${idBase}-panel`}
          tabIndex={current === i ? 0 : -1}
          className="ads-tab"
          onClick={() => pick(i)}
          {...quiet}
        >
          {name}
        </button>
      ))}
    </div>
  )
}

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Pagination: back and forward arrows either side of the page and the
 * count ("01 / 12"). At either end the arrow that has nowhere to go is
 * dimmed and does nothing. Controlled by `page` and `onChange`, or keeps
 * its own page.
 */
export function Pagination({
  total = 12,
  page: controlled,
  onChange,
  label = "Pages",
}: {
  total?: number
  page?: number
  onChange?: (page: number) => void
  label?: string
}) {
  const [own, setOwn] = useState(1)
  const page = controlled ?? own
  const go = (to: number) => {
    if (to < 1 || to > total) return
    setOwn(to)
    onChange?.(to)
  }
  return (
    <nav className="ads-pagination" aria-label={label}>
      <Button
        variant="tertiary"
        size="small"
        icon="only"
        glyph={<TbArrowLeft aria-hidden />}
        aria-label="Previous"
        aria-disabled={page <= 1}
        onClick={() => go(page - 1)}
      />
      <span className="ads-pagination-count" aria-live="polite">
        <span className="sr-only">Page </span>
        {pad(page)}
        {"  /  "}
        {pad(total)}
      </span>
      <Button
        variant="tertiary"
        size="small"
        icon="only"
        aria-label="Next"
        aria-disabled={page >= total}
        onClick={() => go(page + 1)}
      />
    </nav>
  )
}
