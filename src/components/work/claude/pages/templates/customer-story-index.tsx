import { useState } from "react"
import {
  TbChevronDown,
  TbLayoutGrid,
  TbList,
  TbPlayerPlayFilled,
  TbSearch,
} from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { Deck } from "@/components/work/claude/deck"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Button, CarouselUi, Check } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Customer Story Index template (the "Customer story / Grid" and
// "/ List" frames on the Figma file's Templates page, here one page with
// the file's own switch between the two): every customer story, as a grid
// of logos or a list of facts, beside the filters. It is built from the
// organisms the other tabs document: the site navigation, the section
// header, marginalia cards, the text input, tabs, the select, checkboxes,
// the testimonial, the carousel's controls, and the footer. Its words are
// the file's. What is new here is only what the page adds around them: the
// story cards, the list's rows, and the folding filter blocks.

const LOGOS = "/work/claude/logos"
const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

/** A customer's logo: its name, its file, and the size the file draws it at. */
type Brand = [name: string, file: string, width: number, height: number]

const ASANA: Brand = ["Asana", "asana.svg", 139, 40]
const ASAPP: Brand = ["ASAPP", "asapp.svg", 279, 64]
const BRIDGEWATER: Brand = ["Bridgewater", "bridgewater.svg", 157, 16]

// The hero's three stories, the one on top first.
const PROMOS = [
  "Asana supercharges work management across the company with Claude.",
  "The European Parliament expands access to their archives with Claude",
  "Intercom provides customer service tech that delivers up to 86% resolution rates",
]

// The grid's cards, as the file has them: twenty-four, ASAPP's twice, and
// one story's title under two logos.
const STORIES: Array<[brand: Brand, title: string]> = [
  [
    ["Windsurf", "windsurf.svg", 145, 20],
    "Windsurf enables collaborative software development agents with Claude",
  ],
  [
    ["Augment Code", "augment-code.svg", 191, 26],
    "Augment unlocks complex codebases with Claude on Google Cloud’s Vertex AI",
  ],
  [
    ["Replit", "replit.svg", 127, 32],
    "Replit democratizes software development with Claude on Google Cloud's Vertex AI",
  ],
  [
    ["Humach", "humach.png", 146, 39],
    "Humach enhances AI-powered customer experience solutions with Claude",
  ],
  [
    ["GitLab", "gitlab.svg", 280, 64],
    "GitLab powers stable, secure software development with Claude",
  ],
  [
    ["Coinbase", "coinbase.svg", 136, 24],
    "Coinbase enhances customer support and operational efficiency with Claude",
  ],
  [
    ["Ramp", "ramp-left.svg", 124, 33],
    "How Ramp's engineering operates at hyperspeed with Claude Code",
  ],
  [
    ["Zapier", "zapier.svg", 104, 28],
    "Zapier builds an AI-first remote culture with Claude for Enterprise",
  ],
  [
    BRIDGEWATER,
    "Sourcegraph streamlines product and community insights with Claude",
  ],
  [
    ["Assembled", "assembled.svg", 150, 20],
    "Assembled transforms support operations with Claude",
  ],
  [
    ["Canva", "canva.svg", 96, 30],
    "Canva empowers employees across teams with Claude",
  ],
  [ASAPP, "ASAPP brings human-level AI to customer service with Claude"],
  [
    ["Intuit", "intuit.svg", 109, 30],
    "Intuit helps millions of customers confidently file taxes with federal tax explainers powered by Claude",
  ],
  [
    ["Kodif", "kodif.svg", 104, 20],
    "Kodif transforms customer support into a revenue center with Claude in Amazon Bedrock",
  ],
  [
    ["Quantium", "quantium.svg", 148, 37],
    "Quantium drives company-wide AI adoption with Claude",
  ],
  [
    ["Box", "box.svg", 58, 31],
    "Box transforms customer support into a revenue center with Claude in Amazon Bedrock",
  ],
  [
    ["Intercom", "intercom.svg", 279, 64],
    "Intercom provides customer service tech that delivers up to 86% resolution rates with Claude",
  ],
  [
    ["Sourcegraph", "sourcegraph.svg", 185, 26],
    "Sourcegraph streamlines product and community insights with Claude",
  ],
  [
    ["StubHub", "stubhub.svg", 107, 48],
    "StubHub transforms live event ticketing with Claude",
  ],
  [ASAPP, "ASAPP brings human-level AI to customer service with Claude"],
  [
    ["Factory", "factory.svg", 163, 24],
    "Factory is building Droids for software engineering with Claude",
  ],
  [
    ["Snowflake", "snowflake.svg", 154, 35],
    "Snowflake powers enterprise data intelligence with Claude",
  ],
  [
    ["Bito", "bito.svg", 88, 36],
    "Bito powers agentic AI tools for software development with Claude",
  ],
  [ASANA, "Asana supercharges work management with Claude"],
]

const COLUMNS = [
  "Company",
  "Industry",
  "Company size",
  "Product",
  "Location",
  "Partner",
]

// The list's rows, a cell for each column. The file names a partner on four
// of them.
const ROWS: Array<Array<string>> = [
  ["Cred", "Technology", "500+", "Claude Code", "Asia/Pacific"],
  [
    "Spring.new",
    "Technology",
    "1,000+",
    "AI Platform",
    "North America",
    "Google",
  ],
  ["Lindy", "Technology", "50+", "AI Platform", "North America"],
  ["RileyBot", "Education", "20+", "Claude for Enterprise", "Europe", "AWS"],
  ["Legora", "Legal", "10+", "AI Platform", "Europe"],
  ["Circleback", "Technology", "6", "AI Platform", "North America"],
  ["Tines", "Technology", "250+", "AI Platform", "Europe"],
  ["Windsurf", "Software", "100+", "AI Platform", "United States", "AWS"],
  ["Stubhub", "Retail", "1,000+", "AI Platform", "North America"],
  ["Dust", "Technology", "400+", "Claude for Enterprise", "Europe"],
  ["Zapier", "Software", "1,000+", "Claude Code", "North America"],
  ["Tahoe Lead Removal Project", "Legal", "20+", "AI Platform", "Europe"],
  ["Grafana Labs", "Technology", "1,500+", "AI Platform", "North America"],
  ["ClassDojo", "Education", "400+", "AI Platform", "United States"],
  [
    "Snowflake",
    "Technology & Software",
    "400+",
    "AI Platform",
    "United States",
  ],
  ["Audience Strategies", "Entertainment", "1,000+", "AI Platform", "Europe"],
  ["Dolly", "Education", "400+", "AI Platform", "Europe", "Google"],
  ["Biomni", "Science", "1,000+", "AI Platform", "North America"],
  ["Rakuten", "Retail", "25+", "AI Platform", "United States"],
  ["Brex", "Finance", "30+", "Claude Code", "United States"],
  ["cubic", "Software", "400+", "AI Platform", "United States"],
  ["Harvey", "Software", "400+", "AI Platform", "United States"],
  ["Zoom", "Software", "400+", "AI Platform", "United States"],
  ["Copy.ai", "Software", "400+", "AI Platform", "United States"],
]

// The filters: a block's name, its choices, and the one the file has ticked.
const FILTERS: Array<[name: string, options: Array<string>, ticked?: string]> =
  [
    [
      "Industry",
      [
        "Beneficial deployments",
        "Cybersecurity",
        "Education",
        "Financial services",
        "Government",
        "Healthcare",
        "Recruiting",
        "Insurance",
        "Legal",
        "Entertainment",
        "Professional services",
        "Ecommerce",
        "Scientific research",
        "Tech & software",
      ],
      "Beneficial deployments",
    ],
    ["Size", ["Large", "Medium", "Small"], "Large"],
    ["Product", ["API Platform", "Claude Code", "Claude for Enterprise"]],
    ["Partner", ["Amazon Web Services", "Google Cloud Platform"]],
    [
      "Geography",
      ["Africa", "Asia Pacific", "Europe", "North America", "South America"],
    ],
  ]

// The two testimonials the file shows, one in each of its frames.
const QUOTES: Array<[brand: Brand, quote: string, by: string, role: string]> = [
  [
    ASANA,
    "With Claude, we’re able to more accurately draw insights and nuances from large sets of data, and overall tell an honest assessment of the state of work.",
    "Eric Pelz",
    "Head of Technology, AI",
  ],
  [
    BRIDGEWATER,
    "Claude is the highly capable model behind our upcoming Investment Analyst Assistant on Amazon Bedrock, which is able to take basic instructions, generate Python code, work through errors, and output charts and tables much like a first or second-year analyst would.",
    "Aaron Linsky",
    "CTO (AI/ML)",
  ],
]

const VIEWS = [
  ["grid", "Grid", TbLayoutGrid],
  ["list", "List", TbList],
] as const

type View = (typeof VIEWS)[number][0]

/**
 * The hero's stories: a deck of marginalia cards, the current one on top
 * and the next leaning out from behind it, over the carousel's controls
 * (`Deck`). On a phone the cards are a row instead, which the controls
 * scroll along.
 */
function Promos() {
  return (
    <Deck
      className="cds-stories-stack"
      cards={PROMOS.map((story) => (
        <div key={story} className="cds-margin">
          <div className="cds-margin-card">
            <div className="cds-margin-head">Customer story</div>
            <div className="cds-margin-media" data-type="video">
              <button
                type="button"
                className="cds-play"
                aria-label="Play"
                {...quiet}
              >
                <TbPlayerPlayFilled aria-hidden />
              </button>
            </div>
            <p>{story}</p>
            <div>
              <Button variant="tertiary" size="small" icon="none">
                Read customer story
              </Button>
            </div>
          </div>
        </div>
      ))}
    />
  )
}

/**
 * The filters beside the stories: blocks that fold, shut until pressed, as
 * the grid's frame has them. The first holds the order's select, the rest
 * checkboxes. They are for show: nothing is filtered.
 */
function Filters() {
  const [open, setOpen] = useState<Array<string>>([])
  const block = (name: string, children: React.ReactNode) => {
    const shown = open.includes(name)
    return (
      <div key={name} className="cds-stories-filter">
        <button
          type="button"
          aria-expanded={shown}
          onClick={() =>
            setOpen(shown ? open.filter((o) => o !== name) : [...open, name])
          }
          {...quiet}
        >
          {name}
          <TbChevronDown aria-hidden />
        </button>
        {/* Folded, a block keeps what was ticked in it. */}
        <div hidden={!shown}>{children}</div>
      </div>
    )
  }
  return (
    <div className="cds-stories-filters">
      <h4>Filter & sort</h4>
      {block(
        "Sort by",
        <button type="button" className="cds-select" {...quiet}>
          <span>Most recent</span>
          <TbChevronDown aria-hidden />
        </button>
      )}
      {FILTERS.map(([name, options, ticked]) =>
        block(
          name,
          options.map((option) => (
            <Check key={option} defaultChecked={option === ticked}>
              {option}
            </Check>
          ))
        )
      )}
    </div>
  )
}

/** The testimonials, one at a time, over the carousel's controls. */
function Quotes() {
  const [current, setCurrent] = useState(0)
  const count = QUOTES.length
  const step = (by: 1 | -1) => setCurrent((current + by + count) % count)
  return (
    <div className="cds-stories-quotes">
      <div>
        {QUOTES.map(([[name, file, width, height], quote, by, role], i) => (
          <div
            key={by}
            className="cds-testimonial"
            data-current={i === current ? "" : undefined}
            aria-hidden={i !== current}
          >
            <div>
              <div className="cds-testimonial-logo">
                <img
                  src={`${LOGOS}/${file}`}
                  alt={name}
                  width={width}
                  height={height}
                  draggable={false}
                />
              </div>
              <figure>
                <blockquote>“{quote}”</blockquote>
                <figcaption className="cds-attribution">
                  {by}
                  <span>{role}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        ))}
      </div>
      <CarouselUi count={count} current={current} onStep={step} />
    </div>
  )
}

/**
 * The page. The hero and the stories are one stretch of Ivory, the
 * testimonial is on White, and the closing call is on Dark 3 like the footer
 * under it. On the site's dark mode they are Dark 3 and Dark 2.
 */
function CustomerStoryIndex() {
  const [view, setView] = useState<View>("grid")
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Customer stories"]} />
        <div className="cds-stories-hero">
          <Header
            size="p2"
            align="left"
            title="Meet the teams building what’s next"
            subtitle="Businesses build with Claude for the problems that matter most. Our customers include enterprises and startups across financial services, healthcare, legal, and more."
            pictogram={null}
            actions={
              <Button size="large" icon="none">
                Contact sales
              </Button>
            }
          />
          <Promos />
        </div>
      </TemplateBlock>

      <TemplateSection
        theme={["ivory", "dark-3"]}
        className="cds-stories-section"
      >
        <div className="cds-stories-body">
          <div className="cds-stories-head">
            <label className="cds-input" data-leading="">
              <TbSearch aria-hidden />
              <input
                type="text"
                placeholder="Search stories"
                aria-label="Search stories"
              />
            </label>
            {/* The switch between the file's two frames. */}
            <div className="cds-tabs" role="tablist" aria-label="View">
              {VIEWS.map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  className="cds-tab"
                  data-icon=""
                  aria-selected={view === id}
                  aria-label={label}
                  onClick={() => setView(id)}
                  {...quiet}
                >
                  <Icon aria-hidden />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Filters />

          {view === "grid" ? (
            <div className="cds-stories-grid">
              {STORIES.map(([[name, file, width, height], title], i) => (
                <a key={i} href="#" className="cds-stories-card" {...quiet}>
                  <span>
                    <img
                      src={`${LOGOS}/${file}`}
                      alt={name}
                      width={width}
                      height={height}
                      style={{ "--w": width } as React.CSSProperties}
                      draggable={false}
                    />
                  </span>
                  {title}
                </a>
              ))}
            </div>
          ) : (
            <div className="cds-stories-list">
              <div className="cds-stories-row cds-micro">
                {COLUMNS.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
              {ROWS.map((cells) => (
                <a
                  key={cells[0]}
                  href="#"
                  className="cds-stories-row"
                  {...quiet}
                >
                  {COLUMNS.map((column, i) => (
                    <span key={column}>{cells[i]}</span>
                  ))}
                </a>
              ))}
            </div>
          )}

          <div className="cds-stories-more">
            <Button size="large" variant="tertiary" icon="none">
              View more
            </Button>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Quotes />
      </TemplateSection>

      <TemplateSection
        theme={["dark-3", "dark-3"]}
        className="cds-stories-close"
      >
        <Header
          size="p1"
          title="Transform how your organization operates with Claude"
          subtitle={null}
          pictogram={null}
          actions={
            <Button size="large" variant="secondary" icon="none">
              Get started
            </Button>
          }
        />
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <Footer />
      </TemplateBlock>
    </>
  )
}

const deck = (on: string) => `.cds-stories-stack ${on}`

// The page's own things for the demo cursor: the hero's button, its deck of
// stories (through it and back to the first), and the stories' two views.
// The scrolling and resizing around them are the template figure's.
const CUSTOMER_STORY_INDEX_DEMO: Array<DemoStep> = [
  { on: ".cds-stories-hero .cds-btn", text: "Contact sales", rest: 700 },
  // Through the hero's deck of stories, and back to the first.
  { on: deck('[aria-label="Next"]'), click: true, rest: 600 },
  { on: deck(".cds-deck-slide[data-active] .cds-btn"), rest: 700 },
  { on: deck('[aria-label="Next"]'), click: true, rest: 600 },
  { on: deck(".cds-deck-slide[data-active] .cds-play"), rest: 700 },
  { on: deck('[aria-label="Previous"]'), click: true, rest: 400 },
  { on: deck('[aria-label="Previous"]'), click: true, rest: 600 },
  { on: ".cds-stories-head .cds-tab", text: "List", click: true, rest: 1100 },
  { on: ".cds-stories-head .cds-tab", text: "Grid", click: true, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-stories-hero .cds-btn", text: "Contact sales", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function CustomerStoryIndexDoc() {
  return (
    <Section>
      <TemplateFigure steps={CUSTOMER_STORY_INDEX_DEMO}>
        <CustomerStoryIndex />
      </TemplateFigure>
    </Section>
  )
}
