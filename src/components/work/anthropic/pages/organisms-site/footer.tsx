import { useState } from "react"
import {
  TbArrowUpRight,
  TbChevronDown,
  TbDownload,
  TbHelpCircle,
  TbMailbox,
} from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import {
  CONTACTS,
  FOOTER_GROUPS,
} from "@/components/work/anthropic/pages/organisms-site/data"
import {
  Mark,
  SOCIALS,
  Social,
  Wordmark,
} from "@/components/work/anthropic/pages/organisms-site/logo"

// The site's footer (the file's "Footer", 1469:27318) and the two calls
// that can sit over it (its "Prefooter CTA", 12260:22797). The file draws
// both dark on every page, so they wear the Slate theme whatever the page
// wears; `theme` puts them in another.

/**
 * The footer: the wordmark, the copyright and social links; the site's
 * directory, nine groups that open one at a time to their links; and the
 * mission and log-in links. A group's title and excerpt brighten under the
 * pointer while the other groups' titles dim (the file's "Hover" and
 * "Hover Sibling" states), and the same goes for the links of an open
 * group.
 */
export function Footer({
  theme = "slate",
  open: openAtFirst = null,
}: {
  theme?: string
  /** A group open to start with, by its title. */
  open?: string | null
} = {}) {
  const [open, setOpen] = useState<string | null>(openAtFirst)
  return (
    <footer className="ads ads-footer" data-theme={theme}>
      {/* The footer measures its own width (a container), and this grid
          inside it changes its layout by that width. */}
      <div className="ads-footer-grid">
        <div className="ads-footer-brand">
          <Wordmark />
          <Mark />
        </div>
        <div className="ads-footer-end">
          <span className="ads-caption-1">© 2026 Anthropic PBC</span>
          <div className="ads-socials">
            {SOCIALS.map(([label, file]) => (
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
        <ul className="ads-footer-groups">
          {FOOTER_GROUPS.map(([title, links]) => (
            <li
              key={title}
              className="ads-footer-group"
              data-open={open === title ? "" : undefined}
            >
              <button
                type="button"
                className="ads-footer-group-head"
                aria-expanded={open === title}
                onClick={() => setOpen(open === title ? null : title)}
                {...quiet}
              >
                <span className="ads-footer-group-title">{title}</span>
                {/* The file's "Group Excerpt" property: a line about the
                  group. Here its first links stand in. */}
                <span className="ads-footer-group-excerpt">
                  {links.slice(0, 3).join(", ")}
                </span>
                <TbChevronDown aria-hidden />
              </button>
              {open === title && (
                <div className="ads-footer-links">
                  {links.map((link) => (
                    <a
                      key={link}
                      href="#footer"
                      className="ads-footer-link"
                      onClick={(e) => e.preventDefault()}
                      {...quiet}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="ads-footer-colophon">
          <div className="ads-caption-1">
            <p>Our mission</p>
            <p>
              Anthropic is a Public Benefit Corporation. Our mission is the
              responsible development and maintenance of advanced AI for the
              long-term benefit of humanity.
            </p>
          </div>
          <div className="ads-caption-1">
            <p>Log in</p>
            {["Claude.ai", "Claude console"].map((name) => (
              <a
                key={name}
                href="#footer"
                onClick={(e) => e.preventDefault()}
                {...quiet}
              >
                {name}
                <TbArrowUpRight aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

const CONTACT_ICONS = [TbMailbox, TbHelpCircle, TbDownload]

/**
 * The prefooter: a call over the footer. "Media" has its headline beside
 * three cards, for the press, support, and media assets; "Signoff" has a
 * centered headline over two large buttons.
 */
export function Prefooter({
  variant = "media",
  theme = "slate",
}: {
  variant?: "media" | "signoff"
  theme?: string
}) {
  return (
    <section
      className="ads ads-prefooter"
      data-theme={theme}
      data-variant={variant}
    >
      {variant === "media" ? (
        <div className="ads-prefooter-wrap">
          <h2 className="ads-heading-4">
            Need to reach us or access media assets? Start here.
          </h2>
          <div className="ads-prefooter-cards">
            {CONTACTS.map(([title, value], i) => {
              const Icon = CONTACT_ICONS[i]
              return (
                <a
                  key={title}
                  href="#footer"
                  className="ads-contact"
                  onClick={(e) => e.preventDefault()}
                  {...quiet}
                >
                  <span>
                    <Icon aria-hidden />
                    {title}
                  </span>
                  <span>{value}</span>
                </a>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="ads-prefooter-wrap">
          <h2 className="ads-heading-3">Catchy signoff goes here</h2>
          <div className="ads-prefooter-actions">
            <Button variant="secondary" size="large">
              Try Claude
            </Button>
            <Button variant="tertiary" size="large">
              Contact sales
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
