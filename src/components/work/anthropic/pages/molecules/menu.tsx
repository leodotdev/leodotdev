import { useCallback, useId, useRef, useState } from "react"
import { TbDots } from "react-icons/tb"
import { quiet } from "@/components/work/anthropic/specimens"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { cn } from "@/lib/utils"

// The Menu molecule (the file's "Menu" component set, with its helpers Menu
// Group and Menu Item) and the Menu Button, Topics, Date row whose tiny more
// button opens one. Both are exported for the organisms and templates.

/** One group of a menu: its items, under a label where it has one. */
export type MenuGroup = { label?: string; items: Array<string> }

/**
 * Moves the keyboard through a menu's items: up and down a column (round
 * from the last to the first), left and right to the same row of the next
 * column, Home and End to the first and last.
 */
export function onMenuKeys(e: React.KeyboardEvent<HTMLElement>) {
  const items = [
    ...e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ]
  const now = items.indexOf(document.activeElement as HTMLElement)
  if (items.length === 0) return
  const at = (el: HTMLElement) => ({
    col: Number(el.dataset.col),
    row: Number(el.dataset.row),
  })
  let next: HTMLElement | undefined
  if (e.key === "ArrowDown") next = items[(now + 1) % items.length]
  else if (e.key === "ArrowUp")
    next = items[(now - 1 + items.length) % items.length]
  else if (e.key === "Home") next = items[0]
  else if (e.key === "End") next = items[items.length - 1]
  else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && now >= 0) {
    const { col, row } = at(items[now])
    const to = col + (e.key === "ArrowRight" ? 1 : -1)
    const column = items.filter((el) => at(el).col === to)
    next = column.at(Math.min(row, column.length - 1))
  } else return
  e.preventDefault()
  next?.focus()
}

/**
 * The menu: a floating box of items, in groups. "desktop" items are small;
 * "mobile" ones are a medium tertiary button's size. Several groups sit in
 * columns (`columns`), each under its label: the file's Sections variants.
 */
export function Menu({
  groups,
  device = "desktop",
  columns = 1,
  tabbable = false,
  onPick,
  label,
  id,
  className,
}: {
  groups: Array<MenuGroup>
  device?: "desktop" | "mobile"
  columns?: number
  /**
   * Its items take focus from Tab as well as the arrow keys: for a menu
   * shown open on its own, not one opened from a button.
   */
  tabbable?: boolean
  onPick?: (item: string, e: React.MouseEvent) => void
  label?: string
  id?: string
  className?: string
}) {
  return (
    <div
      id={id}
      role="menu"
      aria-label={label}
      className={cn("ads-menu", className)}
      data-device={device}
      style={{ "--cols": columns } as React.CSSProperties}
      onKeyDown={onMenuKeys}
    >
      {groups.map((group, g) => (
        <div
          key={g}
          role="group"
          aria-label={group.label}
          className="ads-menu-group"
        >
          {group.label && (
            <div className="ads-menu-label" aria-hidden>
              {group.label}
            </div>
          )}
          {group.items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              tabIndex={tabbable ? 0 : -1}
              className="ads-menu-item"
              data-col={g % columns}
              data-row={i + Math.floor(g / columns) * 100}
              onClick={(e) => onPick?.(item, e)}
              {...quiet}
            >
              {item}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * The tiny more button and the menu it opens under itself. It opens on a
 * click, and from the keyboard on Enter, Space, or the down arrow, which
 * also put the keyboard on the first item; Escape, a pick, or a press
 * outside close it, and the keyboard goes back to the button.
 */
export function MenuButton({
  groups,
  label = "More",
  device,
}: {
  groups: Array<MenuGroup>
  label?: string
  device?: "desktop" | "mobile"
}) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const menu = useId()
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)
  // Opened from the keyboard, the first item takes the focus once drawn.
  const first = useRef(false)
  const focusFirst = (el: HTMLDivElement | null) => {
    if (el && first.current) {
      first.current = false
      el.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    }
  }

  return (
    <div
      ref={ref}
      className="ads-menu-anchor"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation()
          setOpen(false)
          button.current?.focus()
        } else if (e.key === "Tab" && open) setOpen(false)
      }}
    >
      <button
        ref={button}
        type="button"
        className="ads-menu-btn"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menu : undefined}
        onClick={(e) => {
          // A click from the keyboard (Enter or Space) has no pointer
          // position; the demo cursor's are not trusted and take no focus.
          first.current = !open && e.isTrusted && e.detail === 0
          setOpen(!open)
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault()
            first.current = true
            setOpen(true)
          }
        }}
        {...quiet}
      >
        <TbDots aria-hidden />
      </button>
      {open && (
        <div ref={focusFirst} className="contents">
          <Menu
            id={menu}
            label={label}
            groups={groups}
            device={device}
            onPick={(_, e) => {
              setOpen(false)
              // Back to the button after a pick from the keyboard only.
              if (e.isTrusted && e.detail === 0)
                button.current?.focus({ preventScroll: true })
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * A post's topic and date, after the tiny more button that opens the rest
 * of its menu: the file's "Menu, Topic, Date".
 */
export function TopicDate({
  topic = "Announcement",
  date = "Jan. 30, 2026",
  groups = [{ items: ["Nav Item", "Nav Item", "Nav Item"] }],
}: {
  topic?: string
  date?: string
  groups?: Array<MenuGroup>
}) {
  return (
    <div className="ads-topic-date">
      <MenuButton groups={groups} />
      <span>{topic}</span>
      <span>{date}</span>
    </div>
  )
}
