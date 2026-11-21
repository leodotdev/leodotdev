import { useEffect, useRef, useState } from "react"
import {
  TbAlignLeft,
  TbChevronDown,
  TbDownload,
  TbHelpCircle,
  TbMailbox,
} from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { cn } from "@/lib/utils"
import {
  ChevronIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "@/components/work/anthropic/pages/organisms-site/icons"
import {
  CONTACTS,
  LEFT_MENUS,
  RIGHT_MENUS,
  groupLinks,
} from "@/components/work/anthropic/pages/organisms-site/data"
import {
  Mark,
  SOCIALS,
  Social,
  Wordmark,
} from "@/components/work/anthropic/pages/organisms-site/logo"
import type { MenuColumn } from "@/components/work/anthropic/pages/organisms-site/data"

// The site's header (the file's "Navigation", 1121:8796) as anthropic.com
// shipped it (read from the site on 2026-11-19): pills for the sections
// either side of the wordmark, a dropdown under each, and two icon buttons,
// for search and the expanded menu. Its layout changes at the widths the
// site's changes at: the wordmark in the middle from 1400px; at the left,
// with the left-hand pills beside the right-hand ones, from 1100px; below
// that, the wordmark, Try Claude, search, and the menu; on a phone the "A"
// mark in place of the wordmark. Search swaps the right-hand pills for a
// field. The menu button opens the expanded navigation (6204:58173), a dark
// sheet from the right.

/** A dropdown's columns: a heading over each, perhaps, then its links. */
function Columns({ columns }: { columns: Array<MenuColumn> }) {
  return (
    <div
      className="ads-nav-menu"
      role="menu"
      style={{ "--cols": columns.length } as React.CSSProperties}
    >
      {columns.map((column, i) => (
        <div key={i} className="ads-nav-menu-col">
          {column.heading && (
            <span className="ads-nav-menu-label">{column.heading}</span>
          )}
          {column.links.map((link) => (
            <button
              key={link}
              type="button"
              role="menuitem"
              className="ads-nav-menu-item"
              {...quiet}
            >
              {link}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

/** One of the header's 28px square buttons, with a 20px icon. */
function IconButton({
  label,
  className,
  children,
  ...rest
}: {
  label: string
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant="tertiary"
      size="small"
      icon="only"
      glyph={children}
      aria-label={label}
      className={cn("ads-nav-icon", className)}
      {...rest}
    />
  )
}

export function SiteNavigation({
  children,
}: {
  /** The page under the header, where a figure shows one. */
  children?: React.ReactNode
} = {}) {
  // The open dropdown (a pill's label), or "panel" for the expanded menu.
  const [open, setOpen] = useState<string | null>(null)
  const [search, setSearch] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const toggle = (name: string) => setOpen(open === name ? null : name)

  // A dropdown opens while the pointer is on its pill or on the dropdown,
  // and closes when it leaves both; a tap or the keyboard, which do not
  // hover, toggle it with a press. (The file draws each menu under a
  // hovering cursor.)
  const hover = (name: string) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setOpen(name)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse")
        setOpen((now) => (now === name ? null : now))
    },
  })
  const press = (e: React.MouseEvent, name: string) => {
    const pointer = (e.nativeEvent as PointerEvent).pointerType
    if (e.detail > 0 && pointer === "mouse") setOpen(name)
    else toggle(name)
  }

  useEffect(() => {
    if (!open || open === "panel") return
    const onDown = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // A dropdown hangs from its pill's outer side: Company's, the one pill
  // whose dropdown would otherwise run past the header, from its right.
  const pill = (label: string, columns?: Array<MenuColumn>) =>
    columns ? (
      <div
        key={label}
        className={cn("ads-nav-item", label === "Company" && "ads-nav-company")}
        data-align={label === "Company" ? "end" : undefined}
        {...hover(label)}
      >
        <Button
          variant={open === label ? "primary" : "tertiary"}
          size="small"
          corner="round"
          icon="trailing"
          glyph={<ChevronIcon />}
          className="ads-nav-pill"
          aria-expanded={open === label}
          onClick={(e) => press(e, label)}
        >
          {label}
        </Button>
        {open === label && <Columns columns={columns} />}
      </div>
    ) : (
      <Button
        key={label}
        variant="tertiary"
        size="small"
        corner="round"
        className="ads-nav-pill"
      >
        {label}
      </Button>
    )

  return (
    <div className="ads-nav" data-search={search ? "" : undefined}>
      <div ref={bar} className="ads-nav-bar">
        <div className="ads-nav-start">
          {LEFT_MENUS.map(([label, columns]) => pill(label, columns))}
        </div>
        <span className="ads-nav-logo">
          <Wordmark />
          <Mark />
        </span>
        <div className="ads-nav-end">
          <div className="ads-nav-actions">
            {/* The right-hand pills and the search field share one place:
                opening search fades the pills and wipes the field in from
                the right. */}
            <div className="ads-nav-swap">
              <div className="ads-nav-idle" inert={search}>
                {RIGHT_MENUS.map(([label, columns]) => pill(label, columns))}
              </div>
              <div className="ads-nav-find" inert={!search}>
                <label className="ads-nav-field">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder="Enter search..."
                    aria-label="Search"
                    {...quiet}
                  />
                </label>
              </div>
            </div>
            <div className="ads-nav-utilities">
              {search ? (
                <Button
                  size="small"
                  icon="only"
                  glyph={<CloseIcon />}
                  aria-label="Close search"
                  className="ads-nav-icon ads-nav-search-close"
                  onClick={() => setSearch(false)}
                />
              ) : (
                <IconButton
                  label="Search"
                  className="ads-nav-search"
                  onClick={() => setSearch(true)}
                >
                  <SearchIcon />
                </IconButton>
              )}
              <IconButton
                label="Menu"
                className="ads-nav-burger"
                aria-expanded={open === "panel"}
                onClick={() => toggle("panel")}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      {children}
      <ExpandedNavigation
        open={open === "panel"}
        onClose={() => setOpen(null)}
      />
    </div>
  )
}

// The expanded navigation's sections: each a large link, and the ones with
// a caret open to their links underneath. Company's also has the press,
// support, and media cards, as the file's "Company open" frames show.
const SECTIONS: Array<[label: string, links?: Array<string>]> = [
  ["Home"],
  ["Research", groupLinks("Research")],
  ["News"],
  [
    "Company",
    [
      "Anthropic",
      "Careers",
      "Economic Futures",
      "Research",
      "News",
      "Claude’s Constitution",
      "Responsible Scaling Policy",
      "Security and compliance",
      "Transparency",
    ],
  ],
  ["Resources", groupLinks("Resources")],
]

// The smaller rows under the sections, which open as an accordion.
const ROWS = [
  "Products",
  "Models",
  "Solutions",
  "Help and security",
  "Terms and policies",
]
const ROW_LINKS: Record<string, string> = {
  Products: "Product",
}

const CONTACT_ICONS = [TbMailbox, TbHelpCircle, TbDownload]

/**
 * The expanded navigation: a sheet in the Slate theme that slides over the
 * page from the right (the whole width on a phone), with the site's
 * sections in large type, the rest of the directory as an accordion, and
 * the calls to action and social links at its foot.
 */
export function ExpandedNavigation({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [section, setSection] = useState<string | null>(null)
  const [row, setRow] = useState<string | null>(null)
  const [tryOpen, setTryOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <div
      className="ads ads-xnav"
      data-theme="slate"
      data-open={open ? "" : undefined}
      // Closed, it is out of reach of the keyboard and screen readers.
      inert={!open}
    >
      <div className="ads-xnav-bar">
        <Button
          variant="tertiary"
          size="small"
          icon="only"
          glyph={<TbAlignLeft aria-hidden />}
          aria-label="Close menu"
          aria-expanded={open}
          className="ads-nav-icon ads-xnav-close"
          onClick={onClose}
        />
      </div>
      <div className="ads-xnav-body">
        <ul className="ads-xnav-sections">
          {SECTIONS.map(([label, links], i) => (
            <li key={label}>
              {links ? (
                <button
                  type="button"
                  className="ads-xnav-link ads-heading-3"
                  aria-expanded={section === label}
                  onClick={() => setSection(section === label ? null : label)}
                  {...quiet}
                >
                  {label}
                  <TbChevronDown aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  className="ads-xnav-link ads-heading-3"
                  aria-current={i === 0 ? "page" : undefined}
                  {...quiet}
                >
                  {label}
                </button>
              )}
              {links && section === label && (
                <div className="ads-xnav-sub">
                  <div className="ads-xnav-sub-links">
                    {links.map((link) => (
                      <button
                        key={link}
                        type="button"
                        className="ads-xnav-sub-link"
                        {...quiet}
                      >
                        {link}
                      </button>
                    ))}
                  </div>
                  {label === "Company" && (
                    <div className="ads-xnav-cards">
                      {CONTACTS.map(([title, value], j) => {
                        const Icon = CONTACT_ICONS[j]
                        return (
                          <button
                            key={title}
                            type="button"
                            className="ads-contact"
                            {...quiet}
                          >
                            <span>
                              <Icon aria-hidden />
                              {title}
                            </span>
                            <span>{value}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <ul className="ads-xnav-rows">
          {ROWS.map((name) => (
            <li key={name}>
              <button
                type="button"
                className="ads-xnav-row"
                aria-expanded={row === name}
                onClick={() => setRow(row === name ? null : name)}
                {...quiet}
              >
                {name}
                <TbChevronDown aria-hidden />
              </button>
              {row === name && (
                <div className="ads-xnav-row-links">
                  {groupLinks(ROW_LINKS[name] ?? name).map((link) => (
                    <button
                      key={link}
                      type="button"
                      className="ads-xnav-sub-link"
                      {...quiet}
                    >
                      {link}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="ads-xnav-foot">
          <div className="ads-xnav-actions">
            <div className="ads-nav-item" data-align="start" data-up="">
              <Button
                variant="tertiary"
                size="small"
                icon="trailing"
                glyph={<TbChevronDown aria-hidden />}
                aria-expanded={tryOpen}
                onClick={() => setTryOpen(!tryOpen)}
              >
                Try Claude
              </Button>
              {tryOpen && <Columns columns={RIGHT_MENUS[1][1]} />}
            </div>
            <Button variant="tertiary" size="small">
              Contact sales
            </Button>
            <Button variant="tertiary" size="small">
              Download app
            </Button>
          </div>
          <div className="ads-socials">
            {/* The menu's own order of the four. */}
            {[0, 2, 3, 1]
              .map((n) => SOCIALS[n])
              .map(([label, file]) => (
                <a
                  key={file}
                  href="#footer"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  {...quiet}
                >
                  <Social name={file} />
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
