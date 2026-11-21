import { useState } from "react"
import { TbChevronDown, TbChevronUp, TbSearch, TbX } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { PageBlock, PageSection } from "@/components/work/anthropic/template"
import {
  Pagination,
  TopicDate,
} from "@/components/work/anthropic/pages/molecules"
import {
  Panning,
  PostGraph,
  RelatedCard,
  TinyMore,
  relatedCount,
} from "@/components/work/anthropic/pages/organisms-content"
import {
  Footer,
  SiteNavigation,
} from "@/components/work/anthropic/pages/organisms-site"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { stay } from "@/components/work/anthropic/pages/organisms-content/shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// A research team's page: the shape the file's Threat Intelligence and
// Economic Futures pages share ("Reskinned pages", frame "Cleaned up"). The
// site navigation; the team's name and what it does, over a row of columns
// ("How we work", "Research fund priorities"); a featured post (the file's
// "Hero Carousel" in its Inset style: the post's text beside its picture);
// the team's posts as a table, with the "Table Filters" over "Table Row"s
// that have no Topic or Images cells here; and the footer. Each page gives
// its own words and picture (threat-intelligence.tsx, economic-futures.tsx).
// Styles: src/anthropic/templates/threat-intelligence.css, `.ads-rp*`.

export type ResearchPost = {
  topic: string
  date: string
  title: string
  summary?: string
}

export type ResearchRow = {
  title: string
  /**
   * The file writes no topic on these rows; each has one of its Filter's
   * topics, so the filter has something to find.
   */
  topic: string
}

export type ResearchPageData = {
  name: string
  intro: React.ReactNode
  /** The columns' label ("How we work") and the columns. */
  columns: {
    label: string
    items: Array<{ name: string; text: React.ReactNode }>
  }
  /** The featured posts; with more than one, the carousel's pagination. */
  featured: Array<ResearchPost>
  /** The featured post's picture, exported from the file. */
  image: string
  rows: Array<ResearchRow>
  /** How the count of articles is written: "3", or "05". */
  padCount?: boolean
  /** A "See more" button under the table. */
  more?: boolean
}

// The Filter menu's topics and the sort menu's orders: the file's own, as
// the Table organism has them.
const TOPICS = [
  "Announcements",
  "Alignment & Safety",
  "Economics",
  "Interpretability",
  "Societal Impacts",
  "Policy and Product",
]
const SORTS = [
  "Most recent",
  "Oldest",
  "Featured",
  "Most viewed",
  "Alphabetical (A–Z)",
  "Recently updated",
]
// The file's row description and date, the same on every row.
const BLURB = "Est totam sit sunt minus sed tempore ut est."
const DATE = "Mon. DD, YYYY"

/** A button that opens a menu under it, as the filters' do. */
function MenuButton({
  label,
  options,
  current,
  onPick,
  align = "start",
}: {
  label: string
  options: ReadonlyArray<string>
  current: ReadonlyArray<string>
  onPick: (option: string) => void
  align?: "start" | "end"
}) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  return (
    <div ref={ref} className="ads-filter-menu-wrap" data-align={align}>
      <Button
        variant={open ? "primary" : "tertiary"}
        size="small"
        icon="trailing"
        glyph={
          open ? <TbChevronUp aria-hidden /> : <TbChevronDown aria-hidden />
        }
        aria-haspopup="menu"
        aria-expanded={open}
        className="ads-filter-menu-button"
        onClick={() => setOpen(!open)}
      >
        {label}
      </Button>
      {open && (
        <div className="ads-filter-menu" role="menu">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemcheckbox"
              aria-checked={current.includes(option)}
              className="ads-filter-menu-item"
              onClick={() => {
                onPick(option)
                setOpen(false)
              }}
              {...quiet}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * The featured post: a rule over its topic and date, title, and summary,
 * beside its picture. With several posts, the pagination under the text
 * steps through them; each post's text is laid in the same cell, so the
 * column keeps the height of the longest.
 */
function Featured({
  posts,
  image,
}: {
  posts: Array<ResearchPost>
  image: string
}) {
  const [page, setPage] = useState(1)
  return (
    <div className="ads-rp-featured">
      <div className="ads-rp-featured-text">
        <div className="ads-rp-featured-slides">
          {posts.map((post, i) => (
            <div
              key={post.title}
              className="ads-rp-featured-post"
              data-current={i === page - 1 ? "" : undefined}
              aria-hidden={i !== page - 1}
              inert={i !== page - 1}
            >
              <TopicDate topic={post.topic} date={post.date} />
              <h2 className="ads-heading-5">
                <a {...stay}>{post.title}</a>
              </h2>
              {post.summary && <p className="ads-caption-1">{post.summary}</p>}
            </div>
          ))}
        </div>
        {posts.length > 1 && (
          <Pagination
            total={posts.length}
            page={page}
            onChange={setPage}
            label="Featured posts"
          />
        )}
      </div>
      <div className="ads-rp-featured-media">
        <img src={image} alt="" loading="lazy" />
      </div>
    </div>
  )
}

/**
 * A post of the table: closed, or open on the team's other posts, as the
 * site's research table draws it. A click anywhere on the row opens it.
 */
function Row({
  row,
  others,
  open,
  onToggle,
}: {
  row: ResearchRow
  others: Array<ResearchRow>
  open: boolean
  onToggle: () => void
}) {
  const [active, setActive] = useState<number | null>(null)
  const related = others.slice(0, relatedCount(row.title))
  return (
    <div className="ads-row" data-open={open ? "" : undefined}>
      <div className="ads-row-top" onClick={onToggle}>
        <a className="ads-row-title" {...stay}>
          <Panning>{row.title}</Panning>
        </a>
        <span className="ads-row-desc">
          <Panning>{BLURB}</Panning>
        </span>
        <span className="ads-row-date">{DATE}</span>
        <span className="ads-row-more">
          <TinyMore
            open={open}
            label="Related articles"
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
          />
        </span>
      </div>
      {open && (
        <div className="ads-row-bottom">
          <PostGraph
            seed={row.title}
            related={related.length}
            active={active}
            onActive={setActive}
            className="ads-row-diagram"
          />
          <div className="ads-row-related">
            <span>Related articles</span>
            <div className="ads-row-related-list">
              {related.map((other, i) => (
                <RelatedCard
                  key={other.title}
                  topic={other.topic}
                  date={DATE}
                  title={other.title}
                  active={active === i}
                  onActive={(on) => setActive(on ? i : null)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * The team's posts: the count, Filter (topics, which add chips), the sort
 * menu, and a search field, over the rows. The file's filters here have no
 * view menu, and its rows no Topic or Images.
 */
function Posts({
  rows,
  padCount,
  more,
}: {
  rows: Array<ResearchRow>
  padCount?: boolean
  more?: boolean
}) {
  const [topics, setTopics] = useState<Array<string>>([])
  const [sort, setSort] = useState(SORTS[0])
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<number | null>(null)

  const q = query.trim().toLowerCase()
  // The rows keep their index, which is their key: the file lists one post
  // twice.
  const shown = rows
    .map((row, i) => ({ row, i }))
    .filter(
      ({ row }) =>
        (topics.length === 0 || topics.includes(row.topic)) &&
        (!q || row.title.toLowerCase().includes(q))
    )
  // The file's order is the newest first; the orders with no data behind
  // them here keep it.
  if (sort === "Oldest") shown.reverse()
  else if (sort === "Alphabetical (A–Z)")
    shown.sort((a, b) => a.row.title.localeCompare(b.row.title))

  const toggleTopic = (topic: string) =>
    setTopics((now) =>
      now.includes(topic) ? now.filter((t) => t !== topic) : [...now, topic]
    )

  return (
    <div className="ads-table ads-rp-table">
      <div className="ads-filters">
        <div className="ads-filters-counts">
          <span>
            <b>
              {padCount ? String(shown.length).padStart(2, "0") : shown.length}
            </b>
            Articles
          </span>
        </div>
        <div className="ads-filters-controls">
          <div className="ads-filters-left">
            <MenuButton
              label="Filter"
              options={TOPICS}
              current={topics}
              onPick={toggleTopic}
            />
            <div className="ads-filters-chips">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="ads-chip"
                  aria-label={`Remove ${topic}`}
                  onClick={() => toggleTopic(topic)}
                  {...quiet}
                >
                  {topic}
                  <TbX aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <div className="ads-filters-right">
            <MenuButton
              label={sort}
              options={SORTS}
              current={[sort]}
              onPick={setSort}
              align="end"
            />
            <label className="ads-search">
              <input
                type="search"
                value={query}
                placeholder="Enter search…"
                aria-label="Search"
                spellCheck={false}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => setQuery("")}
                  {...quiet}
                >
                  <TbX aria-hidden />
                </button>
              ) : (
                <TbSearch aria-hidden />
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="ads-rp-rows">
        <div className="ads-rows" role="table">
          <div className="ads-row ads-row-head" role="row">
            <div className="ads-row-top">
              <span>Title</span>
              {/* The file's own spelling of the heading. */}
              <span className="ads-row-desc">Decription</span>
              <span className="ads-row-date">Date</span>
              <span className="ads-row-more" />
            </div>
          </div>
          {shown.map(({ row, i }) => (
            <Row
              key={i}
              row={row}
              others={rows.filter(
                (other, j) =>
                  other.title !== row.title &&
                  rows.findIndex((r) => r.title === other.title) === j
              )}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
          {shown.length === 0 && <p className="ads-table-empty">No articles</p>}
        </div>
        {more && (
          <Button
            variant="secondary"
            size="large"
            icon="trailing"
            className="ads-rp-more"
          >
            See more
          </Button>
        )}
      </div>
    </div>
  )
}

/** The whole page. Light, it wears Ivory; dark, Slate; the footer is dark. */
export function ResearchPage({ page }: { page: ResearchPageData }) {
  return (
    <div className="ads-rp">
      <PageBlock theme={["ivory", "slate"]}>
        <SiteNavigation />
      </PageBlock>
      <PageSection theme={["ivory", "slate"]} className="ads-rp-hero">
        <div className="ads-rp-mission">
          <h1 className="ads-display-1">{page.name}</h1>
          <p className="ads-body-1-serif">{page.intro}</p>
        </div>
        <div className="ads-rp-columns">
          <h2 className="ads-caption-1-mono">{page.columns.label}</h2>
          <ul
            style={{ "--n": page.columns.items.length } as React.CSSProperties}
          >
            {page.columns.items.map((item) => (
              <li key={item.name} className="ads-rp-column">
                <h3 className="ads-heading-6">{item.name}</h3>
                <p className="ads-caption-1">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>
      <PageSection theme={["ivory", "slate"]} className="ads-rp-feature">
        <Featured posts={page.featured} image={page.image} />
      </PageSection>
      <PageSection theme={["ivory", "slate"]} className="ads-rp-index">
        <Posts rows={page.rows} padCount={page.padCount} more={page.more} />
      </PageSection>
      <Footer />
    </div>
  )
}

/** A link in a page's writing (the file underlines it). */
export function TextLink({ children }: { children: React.ReactNode }) {
  return (
    <a className="ads-rp-link" {...stay}>
      {children}
    </a>
  )
}

/**
 * The demo cursor's steps for a research page: wide, it steps through the
 * featured posts where there are several, goes down to the posts, filters
 * them by a topic and takes it off, sorts them A to Z and back, searches,
 * and opens a row on its related articles. Narrow, it opens a row again.
 * The scrolling round them is the template figure's own.
 */
export function researchSteps(search: string, topic: string) {
  const steps: Array<DemoStep> = [
    { on: ".ads-rp-featured .ads-pagination .ads-btn", nth: 1, click: true },
    { on: ".ads-rp-featured .ads-pagination .ads-btn", nth: 1, click: true },
    { on: ".ads-rp-featured-post[data-current] h2 a", rest: 700 },
    { on: ".ads-rp-featured .ads-pagination .ads-btn", nth: 0, click: true },
    { on: ".ads-rp-featured .ads-pagination .ads-btn", nth: 0, click: true },
    { on: ".cds-tpl-thumb", drag: 80 },
    {
      on: ".ads-filters-left .ads-filter-menu-button",
      click: "open",
      rest: 400,
    },
    { on: ".ads-filter-menu-item", text: topic, click: true, rest: 1200 },
    { on: ".ads-chip", click: true, rest: 600 },
    { on: ".ads-filters-right .ads-filter-menu-button", click: "open" },
    {
      on: ".ads-filter-menu-item",
      text: "Alphabetical",
      click: true,
      rest: 1200,
    },
    { on: ".ads-filters-right .ads-filter-menu-button", click: "open" },
    {
      on: ".ads-filter-menu-item",
      text: "Most recent",
      click: true,
      rest: 600,
    },
    { on: ".ads-search", type: search, rest: 1200 },
    { on: ".ads-search button", click: true, rest: 500 },
    {
      on: ".ads-row:not(.ads-row-head) > .ads-row-top",
      nth: 1,
      at: [0.45, 0.5],
      click: true,
      rest: 1000,
    },
    { on: ".ads-related-card", nth: 0, at: [0.6, 0.6], rest: 900 },
    { on: ".ads-related-card", nth: 1, at: [0.6, 0.6], rest: 900 },
    { on: ".ads-row-more .ads-tiny-more", nth: 1, click: true, rest: 400 },
    { on: ".cds-resize-grip", nth: 1, drag: 390 },
    { on: ".cds-tpl-thumb", drag: 72 },
    { on: ".ads-row-more .ads-tiny-more", nth: 0, click: true, rest: 1200 },
    { on: ".ads-row-more .ads-tiny-more", nth: 0, click: true, rest: 400 },
  ]
  return steps
}
