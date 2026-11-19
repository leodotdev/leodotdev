import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  TbArrowsExchange,
  TbCompass,
  TbCopy,
  TbDots,
  TbDownload,
  TbFileDownload,
  TbMarkdown,
  TbPaperclip,
  TbPlayerPlayFilled,
  TbPrompt,
  TbSparkles,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { Button, CarouselUi } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const ROLES = [
  "Founders",
  "Developers",
  "Marketers",
  "Sales",
  "Product Management",
]

const PROMPT =
  "You are an AI assistant specialized in classifying customer support tickets. Your task is to analyze the content of a given ticket and assign it to the most appropriate..."

/**
 * The artifact viewer. The tabs pick an audience; the stage shows a prompt
 * and its attachments beside the artifact they produced. The Figma file has
 * the one example, so every tab shows it.
 *
 * The tabs that do not fit the viewer's width move into an overflow menu
 * behind a "more" button, as the system's tabs do; a tab picked from the
 * menu shows in that button as the current one. How many fit is worked out
 * from the tabs' own widths, measured once with all of them laid out (and
 * again when the fonts have loaded), each time the viewer changes width.
 */
function Artifact() {
  const [role, setRole] = useState(0)
  // Narrow, the stage shows one side at a time.
  const [view, setView] = useState<"result" | "prompt">("result")

  const viewer = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const tabs = useDismiss(open, () => setOpen(false))
  // How many tabs fit. Not known yet: every tab is laid out, to be measured.
  const [fit, setFit] = useState<number | null>(null)
  const widths = useRef<{
    tabs: Array<number>
    more: number
    track: number
    dots: number
  } | null>(null)

  const unmeasured = fit === null
  useLayoutEffect(() => {
    const el = viewer.current
    const row = tabs.current
    if (!el || !row) return
    if (unmeasured) {
      const all = [...row.querySelectorAll<HTMLElement>('[role="tab"]')]
      const more = row.querySelector<HTMLElement>("[aria-haspopup]")
      if (all.length !== ROLES.length || !more) return
      const track = getComputedStyle(row)
      const tab = getComputedStyle(more)
      widths.current = {
        tabs: all.map((t) => t.offsetWidth),
        more: more.offsetWidth,
        track: parseFloat(track.paddingLeft) + parseFloat(track.paddingRight),
        // What the dots add to a tab that also carries a name.
        dots:
          more.offsetWidth -
          parseFloat(tab.paddingLeft) -
          parseFloat(tab.paddingRight) +
          (parseFloat(tab.columnGap) || 0),
      }
    }
    const measure = () => {
      const w = widths.current
      if (!w) return
      const room = el.clientWidth
      const need = (count: number) =>
        w.track +
        w.tabs.slice(0, count).reduce((sum, width) => sum + width, 0) +
        (count === ROLES.length
          ? 0
          : role >= count
            ? w.tabs[role] + w.dots
            : w.more)
      let count = ROLES.length
      while (count > 0 && need(count) > room) count--
      setFit(count)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [unmeasured, role, tabs])

  // The tabs are a little wider once their own font is in: measure again.
  useEffect(() => {
    let live = true
    void document.fonts.ready.then(() => {
      if (live) setFit(null)
    })
    return () => {
      live = false
    }
  }, [])

  const shown = fit ?? ROLES.length
  const rest = ROLES.slice(shown)

  return (
    <div ref={viewer} className="cds-artifact" data-view={view}>
      <div
        ref={tabs}
        className="cds-tabs"
        role="tablist"
        data-measuring={fit === null ? "" : undefined}
      >
        {ROLES.slice(0, shown).map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            className="cds-tab"
            aria-selected={role === i}
            onClick={() => setRole(i)}
            {...quiet}
          >
            {label}
          </button>
        ))}
        {(fit === null || rest.length > 0) && (
          <button
            type="button"
            className="cds-tab"
            aria-haspopup="menu"
            aria-selected={role >= shown}
            aria-expanded={open}
            aria-label={role >= shown ? undefined : "More"}
            onClick={() => setOpen(!open)}
            {...quiet}
          >
            {role >= shown && ROLES[role]}
            <TbDots aria-hidden />
          </button>
        )}
        {open && rest.length > 0 && (
          <div className="cds-menu">
            {rest.map((label, i) => (
              <button
                key={label}
                type="button"
                className="cds-menu-item"
                onClick={() => {
                  setRole(shown + i)
                  setOpen(false)
                }}
                {...quiet}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="cds-artifact-stage">
        <button
          type="button"
          className="cds-artifact-toggle"
          onClick={() => setView(view === "result" ? "prompt" : "result")}
          {...quiet}
        >
          <TbArrowsExchange aria-hidden />
          {view === "result" ? "View prompt" : "View result"}
        </button>

        <div className="cds-artifact-side">
          <div className="cds-artifact-card">
            <header>
              <TbPrompt aria-hidden />
              Prompt
            </header>
            <p>{PROMPT}</p>
            View more…
          </div>
          <div className="cds-artifact-card">
            <header>
              <TbPaperclip aria-hidden />
              Attachments
            </header>
            <div className="cds-artifact-files">
              {["Lecture #1", "Lecture #2"].map((name) => (
                <div key={name}>
                  <span>
                    <b>{name}</b>
                    <small>1,113 lines</small>
                  </span>
                  <i>PDF</i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cds-artifact-sheet">
          <div>
            <h4>Psychology 101: Comprehensive Study Guide</h4>
            <h5>Introduction to Psychology</h5>
            <h6>Definition and Core Concepts</h6>
            <div>
              <p>
                Psychology: The scientific study of behavior and mental
                processes.
              </p>
              <p>Key Components:</p>
              <ul>
                <li>Behavior: Observable actions of humans and animals</li>
                <li>
                  Mental processes: Internal, subjective experiences such as
                  thoughts, feelings, perceptions, memories, and dreams
                </li>
              </ul>
              <p>Important Characteristics of Psychology:</p>
              <ul>
                <li>It is a science using empirical methods</li>
                <li>Studies both overt behavior and internal mental states</li>
                <li>Examines both humans and animals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ACTIONS = [
  ["Copy as markdown", TbCopy],
  ["Download PDF", TbDownload],
  ["View as markdown", TbMarkdown],
  ["Ask about this page", TbSparkles],
] as const

const STORY =
  "How Intercom uses Claude to deliver higher-quality customer AI agent experiences"

const LOGOS = "/work/claude/logos"
const PICTOGRAM = "/work/claude/illustrations/hand-link.svg"
const SESSIONS = "Increase in complex problem-solving sessions for Max users"

/** A customer's logo, as the file's cards carry one (its Proof: Logo atom). */
function Logo({ name }: { name: "asana" | "google-cloud" | "humach" }) {
  return name === "humach" ? (
    <img
      className="cds-margin-logo"
      data-raster
      src={`${LOGOS}/humach.png`}
      alt="Humach"
    />
  ) : (
    <img
      className="cds-margin-logo"
      src={`${LOGOS}/${name}.svg`}
      alt={name === "asana" ? "Asana" : "Google Cloud"}
    />
  )
}

/** The card for a prompt to try: a question, the prompt, and a way to send it. */
function PromptCard({
  children,
  ...rest
}: { children: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div className="cds-margin" {...rest}>
      <div className="cds-margin-card">
        <div className="cds-margin-head">How can I help?</div>
        <p>{children}</p>
        <div>
          <Button size="small" variant="clay" icon="none">
            Ask Claude
          </Button>
        </div>
      </div>
    </div>
  )
}

/** The card for something to read, under a pictogram. */
function ReadCard({
  label,
  children,
  ...rest
}: {
  label: string
  children: React.ReactNode
} & React.ComponentProps<"div">) {
  return (
    <div className="cds-margin" {...rest}>
      <div className="cds-margin-head">{label}</div>
      <div className="cds-margin-card">
        <div className="cds-margin-media" data-type="pictogram">
          <img className="cds-art" src={PICTOGRAM} alt="" />
        </div>
        <p>{children}</p>
        <div>
          <Button size="small" variant="secondary" icon="none">
            Read more
          </Button>
        </div>
      </div>
    </div>
  )
}

// The file's thirteen types, each once, with the sample content its own
// variants carry.
function Marginalia() {
  return (
    <div className="cds-marginalia">
      {/* Menu list */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">
            <TbCompass aria-hidden />
            Explore here
          </div>
          <div className="cds-margin-menu">
            {ACTIONS.map(([label, Icon]) => (
              <button key={label} type="button" {...quiet}>
                <Icon aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Single stat */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Deep work productivity</div>
          <div className="cds-margin-stat">
            <b>47%</b>
            {SESSIONS}
          </div>
        </div>
      </div>

      {/* PDF download */}
      <div className="cds-margin">
        <div className="cds-margin-head">
          <TbFileDownload aria-hidden />
          Download a PDF
        </div>
        <div className="cds-margin-card">
          <div className="cds-margin-media">
            <div className="cds-margin-file">
              <i>PDF</i>
              <div>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="cds-margin-page" />
          </div>
          <p>Ready to bring Claude to your company? Take this PDF.</p>
        </div>
      </div>

      {/* Single stat with logo */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-stat">
            <Logo name="google-cloud" />
            <b>750+</b>
            {SESSIONS}
          </div>
        </div>
      </div>

      {/* Caption and CTA */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Webinar</div>
          <p>How Anthropic and Asana Transform Work at Scale with AI Agents</p>
          <div>
            <Button size="small" variant="secondary">
              Watch webinar
            </Button>
          </div>
        </div>
      </div>

      {/* Double stats */}
      <div className="cds-margin">
        <div className="cds-margin-head">Clay + Claude</div>
        <div className="cds-margin-card">
          <div>
            <div className="cds-margin-stat">
              <b>89%</b>
              AI adoption across all employees
            </div>
            <div className="cds-margin-stat">
              <b>750+</b>
              {SESSIONS}
            </div>
          </div>
        </div>
      </div>

      {/* Logo with caption */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">MCP</div>
          <div className="cds-margin-caption">
            <Logo name="asana" />
            <p>
              Interact with your Asana workspace to reference tasks, assign
              work, update project status, track team progress, and ensure
              projects remain on track
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Customer story</div>
          <div className="cds-margin-media" data-type="image" />
          <p>{STORY}</p>
          <div>
            <Button size="small" variant="secondary" icon="none">
              Read story
            </Button>
          </div>
        </div>
      </div>

      {/* Double stats with logos */}
      <div className="cds-margin">
        <div className="cds-margin-head">Results with Claude</div>
        <div className="cds-margin-card">
          <div>
            <div className="cds-margin-stat">
              <Logo name="humach" />
              <b>89%</b>
              AI adoption across all employees
            </div>
            <div className="cds-margin-stat">
              <Logo name="google-cloud" />
              <b>750+</b>
              {SESSIONS}
            </div>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="cds-margin">
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
          <p>{STORY}</p>
        </div>
      </div>

      {/* Pictogram */}
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Featured article</div>
          <div className="cds-margin-media" data-type="pictogram">
            <img className="cds-art" src={PICTOGRAM} alt="" />
          </div>
          <p>
            Building effective agents: Keep it simple, test thoroughly, evolve
            thoughtfully
          </p>
          <div>
            <Button size="small" variant="secondary" icon="none">
              Read more
            </Button>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <PromptCard>
        Hey Claude, help me forecast the upcoming year so I can make some
        informed plans.
      </PromptCard>

      {/* Below card CTA */}
      <div className="cds-margin">
        <div className="cds-margin-head">
          <TbSparkles aria-hidden />
          Clay + Claude
        </div>
        <div className="cds-margin-card">
          <div className="cds-margin-head">
            <TbPrompt aria-hidden />
            <span className="flex-1">Prompt</span>
            <TbCopy aria-hidden />
          </div>
          <p>
            Write a short professional compliment to send to a person based on
            this...
          </p>
          <span className="cds-micro" style={{ color: "var(--cds-fg)" }}>
            See more...
          </span>
        </div>
        <div className="cds-margin-below">
          What&rsquo;s your sales challenge?
          <Button size="small" variant="clay" icon="none">
            Ask Claude
          </Button>
        </div>
      </div>
    </div>
  )
}

// Where a card's heading goes: the file's three settings, on one card.
function Headings() {
  const stat = (
    <div className="cds-margin-stat">
      <Logo name="google-cloud" />
      <b>750+</b>
      {SESSIONS}
    </div>
  )
  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <div className="cds-margin">
        <div className="cds-margin-head">Results with Claude</div>
        <div className="cds-margin-card">{stat}</div>
      </div>
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Deep work productivity</div>
          <div className="cds-margin-caption">{stat}</div>
        </div>
      </div>
      <div className="cds-margin">
        <div className="cds-margin-card">{stat}</div>
      </div>
    </div>
  )
}

// A page with marginalia in its gutters: a section of the file's education
// template. Wide, the page's text keeps to the middle and the cards take the
// columns at either side, the right one set higher than the left; the left
// gutter holds a batch of prompts, one showing at a time, with the carousel's
// controls under it. Narrow, the cards leave the gutters for one row under
// the text that scrolls sideways.
const AUDIENCES = [
  [
    "For students",
    "Claude’s learning mode works like a tutor—it asks the questions that help you find the answers yourself.",
  ],
  [
    "For educators",
    "Anthropic provides training resources and ongoing support for practical implementation.",
  ],
  [
    "For administrators",
    "Claude helps you scale personalized support across thousands of students.",
  ],
]

const BATCH = [
  "Hey Claude, help me forecast the upcoming year so I can make some informed plans.",
  "I’m writing an essay. After each paragraph I write, analyze it for 1) clarity, 2) evidence quality, 3) logic.",
  "Review this grant proposal draft and suggest stronger evidence for the methodology section.",
]

function Gutters() {
  const [current, setCurrent] = useState(0)
  const row = useRef<HTMLDivElement>(null)
  const step = (by: number) => {
    const next = (current + by + BATCH.length) % BATCH.length
    setCurrent(next)
    // Narrow, the batch is laid out in a row: bring its card into view.
    const el = row.current
    const card = el?.children[next]
    if (el && card instanceof HTMLElement && el.scrollWidth > el.clientWidth)
      el.scrollTo({ left: card.offsetLeft, behavior: "smooth" })
  }
  return (
    <div className="cds-gutters">
      <div className="cds-gutters-head">
        <h3 className="cds-headline-1">Claude for education</h3>
        <p className="cds-body-1">
          A comprehensive university-wide plan for institutions, including its
          students, faculty, and staff.
        </p>
        <Button icon="none">Contact our Education team</Button>
      </div>
      <div className="cds-gutters-body">
        <div className="cds-gutters-main">
          {AUDIENCES.map(([title, text]) => (
            <div key={title}>
              <h4 className="cds-headline-5">{title}</h4>
              <p className="cds-body-2">{text}</p>
            </div>
          ))}
        </div>
        <div className="cds-gutters-cards">
          <div ref={row} className="cds-gutters-row">
            {BATCH.map((prompt, i) => (
              <PromptCard
                key={prompt}
                data-gutter="left"
                data-current={i === current ? "" : undefined}
              >
                {prompt}
              </PromptCard>
            ))}
            <ReadCard label="Report" data-gutter="right">
              How university students use Claude
            </ReadCard>
          </div>
          <CarouselUi
            count={BATCH.length}
            current={current}
            onStep={step}
            size="small"
          />
        </div>
      </div>
    </div>
  )
}

// What the demo cursor does on the artifact: it takes the right-hand grip
// and pulls the figure through its five device sizes, pausing on each, and
// where the stage shows one side at a time it switches to the prompt and
// back. Narrow, the last tab has moved into the overflow menu, and it picks
// it from there. Then it lets the figure out to full width and tries the
// tabs, ending on the first.
const ARTIFACT_DEMO: Array<DemoStep> = [
  { on: ".cds-resize-grip", nth: 1, drag: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 480 },
  { on: ".cds-tab[aria-haspopup]", click: "open" },
  { on: ".cds-menu-item", text: "Product Management", click: true, rest: 500 },
  { on: ".cds-artifact-toggle", click: true, rest: 500 },
  { on: ".cds-artifact-toggle", click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 340 },
  { on: ".cds-artifact-toggle", click: true, rest: 500 },
  { on: ".cds-artifact-toggle", click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: ".cds-tab", text: "Developers", click: true },
  { on: ".cds-tab", text: "Marketers", click: true },
  { on: ".cds-tab", text: "Founders", click: true, rest: 800 },
]

// On the marginalia it looks down the first card's menu and presses the
// cards' buttons.
const MARGINALIA_DEMO: Array<DemoStep> = [
  { on: ".cds-margin-menu button", nth: 0 },
  { on: ".cds-margin-menu button", nth: 1 },
  { on: ".cds-margin-menu button", nth: 2, click: true },
  { on: ".cds-margin .cds-btn", text: "Watch webinar", click: true },
  { on: ".cds-margin .cds-btn", text: "Read story", click: true },
  { on: ".cds-margin .cds-play", click: true },
  { on: ".cds-margin .cds-btn", text: "Read more", click: true },
  { on: ".cds-margin .cds-btn", text: "Ask Claude", click: true, rest: 700 },
]

// On the page it steps through the batch of prompts in the left gutter and
// looks at the card in the right one, then narrows the page until the cards
// leave the gutters for a row, steps along the row, and lets the page out
// again. It ends on the first prompt, where it began.
const GUTTERS_DEMO: Array<DemoStep> = [
  { on: '.cds-gutters [aria-label="Next"]', click: true },
  { on: '.cds-gutters [aria-label="Next"]', click: true, rest: 500 },
  { on: ".cds-gutters .cds-btn", text: "Read more", rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: '.cds-gutters [aria-label="Next"]', click: true },
  { on: '.cds-gutters [aria-label="Next"]', click: true, rest: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: '.cds-gutters [aria-label="Previous"]', click: true, rest: 700 },
]

export function ArtifactsDoc() {
  return (
    <>
      <Section title="Artifacts">
        <Specimen caption="Drawn seven times, for device sizes from Desktop to Mobile.">
          <DemoCursor steps={ARTIFACT_DEMO} className="p-6 md:p-8">
            {/* As tall as its tallest size (the square phablet stage), so
                the figure keeps one height while it is resized and nothing
                below it on the page moves. */}
            <Resizable
              label="Artifact width"
              sizes={[
                ["Desktop"],
                ["Laptop", 740],
                ["Tablet", 640],
                ["Phablet", 540],
                ["Mobile", 400],
              ]}
              className="flex min-h-[640px] flex-col justify-center"
            >
              <Artifact />
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section title="Marginalia">
        <Specimen caption="Marginalia sits two columns wide in each gutter, and in one row on mobile.">
          <DemoCursor steps={GUTTERS_DEMO} className="p-6 md:p-8">
            {/* As tall as the page is at its narrowest, so the figure keeps
                one height while it is resized; the wide page, which is
                shorter, sits in the middle of it. */}
            <Resizable
              label="Page width"
              min={390}
              sizes={[["Desktop"], ["Mobile", 640]]}
              className="flex min-h-[992px] flex-col justify-center"
            >
              <Gutters />
            </Resizable>
          </DemoCursor>
        </Specimen>
        <Specimen caption="Thirteen types of card, from a menu to a prompt.">
          <DemoCursor steps={MARGINALIA_DEMO} className="p-6 md:p-8">
            <Marginalia />
          </DemoCursor>
        </Specimen>
        <Specimen
          caption="Support for headings outside cards, inside, or not at all."
          className="p-6 md:p-8"
        >
          <Headings />
        </Specimen>
      </Section>
    </>
  )
}
