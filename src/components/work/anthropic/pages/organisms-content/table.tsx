import { useState } from "react"
import { TbChevronDown, TbChevronUp, TbSearch, TbX } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { Section, Specimen } from "@/components/work/claude/ui"
import { TableGridItem } from "./cards"
import { GraphIcon, PostGraph } from "./graph"
import { Panning } from "./panning"
import { ART, SkelText, TinyMore, stay } from "./shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Table & Table Card. The table is the file's index of posts: its "Table
// Filters" (counts; Filter, sort, and view menus; a search field) over its
// "Table Row" (Header, Closed, and Open, at four widths). An open row shows
// the post's constellation and its related articles, as anthropic.com's
// research table draws them (read from the site on 2026-11-19): a click
// anywhere on a row opens it. The "Table Card" holds
// a small table of its own, in three layouts: 3x3, 2x2, and 1 Column.

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
const VIEWS = ["Gallery", "Grid", "Table"] as const
type View = (typeof VIEWS)[number]

type Post = {
  title: string
  description: string
  topic: string
  /** For sorting. */
  date: string
  /** As the file writes it, where that is not the ISO date. */
  shown?: string
}

const BLURB = "Est totam sit sunt minus sed tempore ut est."

// The file's own rows, in its order (which "Featured" keeps). It writes
// "Category" for every row's topic; here each has one of its filter's
// topics, so the filter has something to find.
const POSTS: Array<Post> = [
  {
    title:
      "Introducing Bloom: an open source tool for automated behavioral evaluations",
    description: BLURB,
    topic: "Alignment & Safety",
    date: "2025-12-19",
  },
  {
    title: "Project Vend: Phase two",
    description: BLURB,
    topic: "Societal Impacts",
    date: "2025-12-10",
    shown: "Mon. DD, YYYY",
  },
  {
    title:
      "Introducing Anthropic Interviewer: What 1,250 professionals told us about working with AI",
    description: BLURB,
    topic: "Societal Impacts",
    date: "2025-12-04",
  },
  {
    title: "How AI is transforming work at Anthropic",
    description: BLURB,
    topic: "Economics",
    date: "2025-12-02",
  },
  {
    title: "Estimating AI productivity gains from Claude conversations",
    description:
      "What do real conversations with Claude tell us about the effects of AI on labor productivity?",
    topic: "Economics",
    date: "2026-01-12",
    shown: "Jan. 12, 2026",
  },
  {
    title: "Mitigating the risk of prompt injections in browser use",
    description: BLURB,
    topic: "Alignment & Safety",
    date: "2025-11-24",
  },
  {
    title:
      "From shortcuts to sabotage: natural emergent misalignment from reward hacking",
    description: BLURB,
    topic: "Alignment & Safety",
    date: "2025-11-21",
  },
  {
    title: "Project Fetch: Can Claude train a robot dog?",
    description: BLURB,
    topic: "Announcements",
    date: "2025-11-12",
  },
  {
    title: "Commitments on model deprecation and preservation",
    description: BLURB,
    topic: "Policy and Product",
    date: "2025-11-04",
  },
  {
    title: "Signs of introspection in large language models",
    description: BLURB,
    topic: "Interpretability",
    date: "2025-10-28",
  },
]

const RELATED = [
  "Preparing for AI’s Economics impact: exploring policy responses",
  "How Claude learned to forget: Memory degradation at scale",
  "Can language models detect their own hallucinations?",
  "The persuasion gap: How tone changes belief",
  "Predicting catastrophic model drift before it happens",
]
const RELATED_DATES = [
  "2025-11-18",
  "2025-10-30",
  "2025-09-24",
  "2025-08-12",
  "2025-07-08",
]

/** How many related articles a post has: three to five. */
export const relatedCount = (title: string) => 3 + (title.length % 3)

// The pictures a row's Images cell shows: the constellation's.
const THUMBS = [1, 2, 3, 4, 5].map((i) => `${ART}/node-${i}.webp`)
const GRID_ART = [
  `${ART}/office.webp`,
  `${ART}/servicenow.webp`,
  `${ART}/economic-index.webp`,
]

/** A button that opens a menu under it, as the filters' three do. */
function MenuButton({
  label,
  options,
  current,
  onPick,
  align = "start",
}: {
  label: string
  options: ReadonlyArray<string>
  current?: ReadonlyArray<string>
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
              aria-checked={current?.includes(option) ?? false}
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
 * A related article in an open row, as the site's: its topic and date over
 * its title, in a card that lightens under the pointer, as does its node in
 * the constellation.
 */
export function RelatedCard({
  topic,
  date,
  title,
  active,
  onActive,
}: {
  topic: string
  date: string
  title: string
  active: boolean
  onActive: (on: boolean) => void
}) {
  return (
    <div
      className="ads-related-card"
      data-active={active ? "" : undefined}
      onPointerEnter={() => onActive(true)}
      onPointerLeave={() => onActive(false)}
    >
      <div className="ads-related-card-head">
        <span>{topic}</span>
        <span>{date}</span>
      </div>
      <a className="ads-related-card-title" {...stay}>
        {title}
      </a>
    </div>
  )
}

/** One of the file's "Table Row": closed, or open on its related articles. */
export function TableRow({
  post,
  open,
  onToggle,
}: {
  post: Post
  open: boolean
  onToggle: () => void
}) {
  const [active, setActive] = useState<number | null>(null)
  const related = RELATED.slice(0, relatedCount(post.title))
  return (
    <div className="ads-row" data-open={open ? "" : undefined}>
      {/* The whole row opens and closes it. */}
      <div className="ads-row-top" onClick={onToggle}>
        <a className="ads-row-title" {...stay}>
          <Panning>{post.title}</Panning>
        </a>
        <span className="ads-row-desc">
          <Panning>{post.description}</Panning>
        </span>
        <span className="ads-row-topic">{post.topic}</span>
        <span className="ads-row-images" aria-hidden>
          {THUMBS.map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </span>
        <span className="ads-row-date">{post.shown ?? post.date}</span>
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
            seed={post.title}
            related={related.length}
            active={active}
            onActive={setActive}
            className="ads-row-diagram"
          />
          <div className="ads-row-related">
            <span>Related articles</span>
            <div className="ads-row-related-list">
              {related.map((title, i) => (
                <RelatedCard
                  key={title}
                  topic={post.topic}
                  date={RELATED_DATES[i]}
                  title={title}
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
 * The file's index of posts: counts, then Filter (topics, which add chips),
 * the sort and view menus, and a search field, over the posts as a table
 * (rows that open), a grid, or a gallery.
 */
export function Table({
  initialOpen = "Estimating AI productivity gains from Claude conversations",
}: {
  initialOpen?: string | null
}) {
  const [topics, setTopics] = useState<Array<string>>([])
  const [sort, setSort] = useState(SORTS[0])
  const [view, setView] = useState<View>("Table")
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<string | null>(initialOpen)

  const q = query.trim().toLowerCase()
  const shown = POSTS.filter(
    (post) =>
      (topics.length === 0 || topics.includes(post.topic)) &&
      (!q || post.title.toLowerCase().includes(q))
  )
  // "Featured" keeps the file's order; the others have no data behind them
  // here, so they keep the newest first.
  if (sort === "Oldest") shown.sort((a, b) => a.date.localeCompare(b.date))
  else if (sort === "Alphabetical (A–Z)")
    shown.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort !== "Featured")
    shown.sort((a, b) => b.date.localeCompare(a.date))

  const toggleTopic = (topic: string) =>
    setTopics((now) =>
      now.includes(topic) ? now.filter((t) => t !== topic) : [...now, topic]
    )

  return (
    <div className="ads-table">
      <div className="ads-filters">
        <div className="ads-filters-counts">
          <span>
            <b>{shown.length}</b> Articles
          </span>
          <span>
            <b>23</b> Authors
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
            <MenuButton
              label={`${view} view`}
              options={VIEWS}
              current={[view]}
              onPick={(v) => setView(v as View)}
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

      {view === "Table" ? (
        <div className="ads-rows" role="table">
          <div className="ads-row ads-row-head" role="row">
            <div className="ads-row-top">
              <span>Title</span>
              <span className="ads-row-desc">Description</span>
              <span className="ads-row-topic">Topic</span>
              <span className="ads-row-images">Images</span>
              <span className="ads-row-date">Date</span>
              <span className="ads-row-more">
                <GraphIcon />
              </span>
            </div>
          </div>
          {shown.map((post) => (
            <TableRow
              key={post.title}
              post={post}
              open={open === post.title}
              onToggle={() => setOpen(open === post.title ? null : post.title)}
            />
          ))}
        </div>
      ) : (
        <div className="ads-post-grid" data-view={view}>
          {shown.map((post, i) => (
            <TableGridItem
              key={post.title}
              tag={post.topic}
              date={post.shown ?? post.date}
              title={post.title}
              image={GRID_ART[i % GRID_ART.length]}
            />
          ))}
        </div>
      )}
      {shown.length === 0 && <p className="ads-table-empty">No articles</p>}
    </div>
  )
}

type Cell = string | { lead: string; rest: string } | Array<string>

/**
 * The file's "Table Card": a title, a subtitle, and a button over a small
 * table, and a caption under the card. Its layouts are the file's 3x3, 2x2,
 * and 1 Column; narrow, a wide table scrolls sideways in the card.
 */
export function TableCard({
  title = "Card title goes right here",
  subtitle = "Optional subtitle right here",
  head,
  rows,
  caption = [
    "Step 1a",
    "Example quotations from creatives, organized by topic.",
  ],
}: {
  title?: string
  subtitle?: string
  head: Array<string>
  rows: Array<Array<Cell>>
  caption?: [label: string, text: string] | null
}) {
  return (
    <figure className="ads-table-card" style={{ margin: 0 }}>
      <div className="ads-table-card-box">
        <div className="ads-table-card-title">
          <div>
            <h4>{title}</h4>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div>
            <Button size="small" icon="trailing">
              View more
            </Button>
          </div>
        </div>
        <div className="ads-table-card-scroll">
          <table data-cols={head.length}>
            <thead>
              <tr>
                {head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      {typeof cell === "string" ? (
                        cell
                      ) : Array.isArray(cell) ? (
                        <ul>
                          {cell.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <b>{cell.lead}</b> <span>{cell.rest}</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {caption && (
        <figcaption className="ads-table-card-caption">
          <span>{caption[0]}</span>
          {caption[1]}
        </figcaption>
      )}
    </figure>
  )
}

const PROS = [
  "Faster iteration",
  "Fully reproducible",
  "No user impact",
  "Can run on every commit",
  "Tests scenarios at scale without requiring a prod deployment",
]
const CONS = [
  "Requires more upfront investment to build",
  "Requires ongoing maintenance as product and model evolves to avoid drift",
  "Can create false confidence if it doesn’t match real usage patterns",
]
const METHODS: Array<Array<Cell>> = [
  [
    {
      lead: "Automated evals",
      rest: "Running tests programmatically without real users",
    },
    PROS,
    CONS,
  ],
  [
    {
      lead: "Production monitoring",
      rest: "Tracking metrics and errors in live systems",
    },
    PROS,
    CONS,
  ],
  [
    { lead: "A/B testing", rest: "Comparing variants with real user traffic" },
    PROS,
    CONS,
  ],
]
const CONTROL: Cell = {
  lead: "Control boundaries.",
  rest: "Gamebook writer: “During these storytelling sessions, I would say that there’s only the illusion of collaboration for the most part… there’s rarely a point where I’ve really felt like the AI is driving the creative decision-making.”",
}
const DISPLACEMENT: Cell = {
  lead: "Writer displacement.",
  rest: "Creative fiction writer: “A novel written by AI might have a great plot and be technically brilliant. But it won’t have the deeper nuances that only a human can weave throughout the story.”",
}
const QUOTES: Array<Array<Cell>> = [
  [
    CONTROL,
    {
      lead: "Workflow automation.",
      rest: "Social media manager: “I’m less stressed, honestly. It has created a ton of efficiency for me so I can focus on my favorite aspects of the job (filming and editing).”",
    },
  ],
  [
    DISPLACEMENT,
    {
      lead: "Music production.",
      rest: "Music producer: “Sometimes, when it comes time to add lyrics, I’ll ask ChatGPT or Claude for lists of interesting word pairings. Just getting a long list to try out over the instrumental often leads to finding a hook or at least a seed for a song idea.”",
    },
  ],
]

// It filters by a topic and takes it off again, sorts the rows A to Z and
// back, switches to the grid and back, looks at the open row's related
// articles (each lights its node), closes it and opens another with a click
// on the row, then narrows the table to a tablet and a phone, and back.
const ROW = ".ads-row:not(.ads-row-head) > .ads-row-top"
const TABLE_DEMO: Array<DemoStep> = [
  { on: ".ads-row-more .ads-tiny-more", nth: 1, rest: 700 },
  { on: ".ads-filters-left .ads-filter-menu-button", click: "open", rest: 400 },
  { on: ".ads-filter-menu-item", text: "Alignment", click: true, rest: 1200 },
  { on: ".ads-chip", click: true, rest: 600 },
  { on: ".ads-filters-right .ads-filter-menu-button", nth: 0, click: "open" },
  {
    on: ".ads-filter-menu-item",
    text: "Alphabetical",
    click: true,
    rest: 1200,
  },
  { on: ".ads-filters-right .ads-filter-menu-button", nth: 0, click: "open" },
  { on: ".ads-filter-menu-item", text: "Most recent", click: true, rest: 600 },
  { on: ".ads-filters-right .ads-filter-menu-button", nth: 1, click: "open" },
  { on: ".ads-filter-menu-item", text: "Grid", click: true, rest: 1400 },
  { on: ".ads-filters-right .ads-filter-menu-button", nth: 1, click: "open" },
  { on: ".ads-filter-menu-item", text: "Table", click: true, rest: 500 },
  { on: ".ads-related-card", nth: 0, at: [0.6, 0.6], rest: 900 },
  { on: ".ads-related-card", nth: 1, at: [0.6, 0.6], rest: 900 },
  {
    on: ".ads-row-more .ads-tiny-more[aria-expanded='true']",
    click: true,
    rest: 600,
  },
  { on: ROW, nth: 2, at: [0.45, 0.5], click: true, rest: 1400 },
  { on: ".ads-related-card", nth: 0, at: [0.6, 0.6], rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".ads-related-card", nth: 1, at: [0.6, 0.6], rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 400 },
  { on: ROW, nth: 4, at: [0.5, 0.5], click: true, rest: 1400 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const CARD_DEMO: Array<DemoStep> = [
  { on: ".ads-table-card .ads-btn", rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 560 },
  { on: ".ads-table-card-scroll", scroll: 100, rest: 900 },
  { on: ".ads-table-card-scroll", scroll: 0, rest: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function TableDoc() {
  return (
    <>
      <Section
        title="Table"
        caption="An index of posts: filter by topic, sort, switch between Gallery, Grid, and Table, and search. A click on a row opens it on its related articles."
      >
        <Specimen figure>
          <DemoCursor steps={TABLE_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Table width"
              sizes={[["Desktop"], ["Tablet", 959], ["Mobile", 559]]}
              // Clipped to its height, but 16px wider than itself each side:
              // a row under the pointer, or open, reaches that far past the
              // table (`overflow-hidden` cut it off at the title).
              className="min-h-[1120px] [clip-path:inset(0_-16px)] sm:h-[1120px]"
            >
              <div className="ads-oc-c">
                <Table />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Table Card"
        caption="A title, a subtitle, and a button over a small table, in three layouts: 3x3, 2x2, and 1 Column. On a phone the table scrolls sideways."
      >
        <Specimen figure>
          <DemoCursor steps={CARD_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Card width"
              sizes={[["Desktop"], ["Mobile", 639]]}
              className="flex min-h-[1240px] flex-col justify-center sm:h-[1240px]"
            >
              <div className="ads-oc-c flex flex-col items-center gap-10">
                <SkelText count={3} />
                <TableCard head={["Method", "Pros", "Cons"]} rows={METHODS} />
                <SkelText count={3} />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <div className="ads-oc-c grid items-start gap-8 px-6 py-16 md:grid-cols-2 md:px-8">
            <TableCard head={["Pessimistic", "Optimistic"]} rows={QUOTES} />
            <TableCard
              head={["Pessimistic"]}
              rows={[[CONTROL], [DISPLACEMENT]]}
            />
          </div>
        </Specimen>
      </Section>
    </>
  )
}
