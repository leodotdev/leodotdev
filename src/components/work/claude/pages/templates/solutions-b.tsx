import { useState } from "react"
import { TbPaperclip } from "react-icons/tb"
import { GutterCards } from "@/components/work/claude/pages/artifacts"
import { Button } from "@/components/work/claude/specimens"
import type { IconType } from "react-icons"

// What the Education, Financial Services, and Government templates share
// (three of the "Solutions" frames on the Figma file's Templates page): the
// two-column hero, the logo wall as a page uses it, feature highlights in
// ruled columns, the list of features with marginalia in the gutters beside
// it, a row of tabs, and a list of links. Their styles are `.cds-solb-*` in
// src/claude-templates/solutions-b.css; the rest is the system's own classes.

export const ART = "/work/claude/illustrations"
export const LOGOS = "/work/claude/logos"

/** What the docs' own buttons carry: no hover wave of the site's. */
export const quiet = {
  "data-wave-hover": "off",
  "data-wave-manual": true,
} as const

/**
 * The hero in two columns: a headline, a line under it, and one button,
 * beside the page's illustration.
 */
export function Hero({
  title,
  lead,
  action,
  art,
}: {
  title: string
  lead: string
  action: string
  art: string
}) {
  return (
    <div className="cds-hero cds-solb-hero">
      <div className="cds-hero-columns">
        <div className="cds-hero-copy">
          <h3>{title}</h3>
          <p className="cds-hero-lead">{lead}</p>
          <Button size="large" icon="none">
            {action}
          </Button>
        </div>
        <img src={`${ART}/${art}.svg`} alt="" />
      </div>
    </div>
  )
}

export type Logo = [file: string, name: string]

/**
 * The logo wall under a rule, with an optional title: five logos to a row,
 * or six. Each file is a logo in the middle of the wall's own cell.
 */
export function LogoWall({
  logos,
  title,
  per = 5,
  rule = true,
}: {
  logos: Array<Logo>
  title?: string
  per?: 5 | 6
  /** The rule above the wall. */
  rule?: boolean
}) {
  return (
    <div
      className="cds-logo-wall cds-solb-wall"
      data-per={per}
      data-rule={rule ? undefined : "none"}
    >
      {title && <h4>{title}</h4>}
      <div>
        {logos.map(([file, name]) => (
          <img
            key={file}
            src={`${LOGOS}/${file}.svg`}
            alt={name}
            width={279}
            height={64}
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}

export type Feature = [Icon: IconType, title: string, text: string]

/** Feature highlights side by side, each with its icon above. */
export function Features({ items }: { items: Array<Feature> }) {
  return (
    <div className="cds-features cds-solb-features" data-count={items.length}>
      {items.map(([Icon, title, text]) => (
        <div key={title} className="cds-feature">
          <Icon aria-hidden />
          <div>
            <div className="cds-card-title">{title}</div>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * A list of features down the middle of the page, each a title beside its
 * text, with marginalia in the gutters at either side: the right-hand card
 * level with the list, the left-hand one further down. `cards` are the
 * gutters' own cards (`.cds-margin` boxes marked `data-gutter`); where the
 * left gutter holds a batch, `batch` is its cards, shown there as a deck.
 * Narrow, the cards leave the gutters for one row under the list that
 * scrolls sideways, the batch's cards first (`GutterCards`).
 */
export function Gutters({
  rows,
  size = "p2",
  ink = false,
  low = false,
  batch,
  cards,
}: {
  rows: Array<Feature>
  /** The titles' size: the file's P1, or its smaller P2. */
  size?: "p1" | "p2"
  /** The rows' text in the page's ink, not its grey. */
  ink?: boolean
  /** The left-hand card set lower still, beside a long list. */
  low?: boolean
  batch?: Array<React.ReactNode>
  cards: React.ReactNode
}) {
  return (
    <div
      className="cds-gutters cds-solb-gutters"
      data-low={low ? "" : undefined}
    >
      <div className="cds-gutters-body">
        <div
          className="cds-solb-list"
          data-size={size}
          data-ink={ink ? "" : undefined}
        >
          {rows.map(([Icon, title, text]) => (
            <div key={title} className="cds-feature-inline">
              <div>
                <h4>
                  <Icon aria-hidden />
                  {title}
                </h4>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <GutterCards batch={batch}>{cards}</GutterCards>
      </div>
    </div>
  )
}

/** A row of tabs with a page's own names. The file draws one view of each. */
export function Segments({
  label,
  tabs,
}: {
  label: string
  tabs: Array<[name: string, Icon?: IconType]>
}) {
  const [current, setCurrent] = useState(0)
  return (
    <div className="cds-tabs cds-solb-tabs" role="tablist" aria-label={label}>
      {tabs.map(([name, Icon], i) => (
        <button
          key={name}
          type="button"
          role="tab"
          className="cds-tab"
          aria-selected={current === i}
          data-icon={Icon ? "" : undefined}
          onClick={() => setCurrent(i)}
          {...quiet}
        >
          {Icon && <Icon aria-hidden />}
          {name}
        </button>
      ))}
    </div>
  )
}

/**
 * A list of links, each a title over the kind of thing it leads to. The one
 * under the pointer sits on a card of its own. `plain` rows have no box at
 * rest, and show an arrow after the title under the pointer.
 */
export function LinkRows({
  items,
  plain = false,
}: {
  items: Array<[title: string, kind: string]>
  plain?: boolean
}) {
  return (
    <div className="cds-solb-rows" data-plain={plain ? "" : undefined}>
      {items.map(([title, kind]) => (
        <a key={title} href="#" className="cds-solb-row">
          <span>{title}</span>
          <span className="cds-meta-link">
            <TbPaperclip aria-hidden />
            {kind}
          </span>
        </a>
      ))}
    </div>
  )
}
