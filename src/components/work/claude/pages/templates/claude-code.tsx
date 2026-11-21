import { useEffect, useRef, useState } from "react"
import {
  TbArrowRight,
  TbBulb,
  TbChevronRight,
  TbCode,
  TbListCheck,
  TbMapPin,
  TbMessageCircle,
  TbMinus,
  TbPlayerPlayFilled,
  TbPlus,
  TbSettings,
  TbUsers,
} from "react-icons/tb"
import { Deck } from "@/components/work/claude/deck"
import { ClipboardCopy, LinkCard } from "@/components/work/claude/pages/cards"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import { ProofLogo } from "@/components/work/claude/pages/proof"
import { Button, CarouselUi } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { IconType } from "react-icons"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Claude Code template (the "Claude Code" frame on the Figma file's
// Templates page), built from the organisms the other tabs document: the
// site navigation, the section header, tabs, proof cards, marginalia, the
// testimonial, the accordion, link cards, the clipboard command, and the
// footer. Its words are the file's. What is new here is what the page adds
// around them: the hero and its terminal, the feature list between two
// margins of cards, the logo tile, the session beside its copy, the plans,
// and the closing section. Its styles are `.cds-cc-*` in
// src/claude-templates/claude-code.css.

const ART = "/work/claude/illustrations"
const LOGOS = "/work/claude/logos"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const COMMAND = "npm install -g @anthropic-ai/claude-code"

/** A customer's logo: its file in public/work/claude/logos, and its size. */
type Logo = [file: string, name: string, width: number, height: number]

// The four proof cards. The file gives all four the same sample quote, under
// four customers' logos.
const PROOFS: Array<Logo> = [
  ["intercom-left", "Intercom", 141, 23],
  ["stubhub-left", "StubHub", 222, 64],
  ["brex-left", "Brex", 222, 64],
  ["workato-left", "Workato", 222, 64],
]
const QUOTE =
  "Claude helped us reduce analysis time by 60% while uncovering insights we never would have found on our own."
const QUOTED = "First McLastname, CTO, Workato"

const FEATURES = [
  [
    TbBulb,
    "Powerful intelligence",
    [
      "Uses agentic search to understand your entire codebase without manual context selection",
      "Makes coordinated changes across multiple files",
      "Optimized specifically for code understanding and generation with Claude Opus 4.1",
    ],
  ],
  [
    TbMapPin,
    "Works where you work",
    [
      "Lives right inside your terminal—no context switching",
      "Integrates with VS Code / JetBrains IDEs",
      "Uses your test suites and build systems",
    ],
  ],
  [
    TbSettings,
    "You’re in control",
    [
      "Never modifies your files without explicit approval",
      "Adapts to your coding standards and patterns",
      "Configurable: Build on the SDK or run on GitHub Actions",
    ],
  ],
] as const

// The tile's logos, in the file's order: each the whole 279 by 64 box of
// the system's logo wall, with the logo in its middle.
const TOOLS = [
  ["doordash-wall", "DoorDash"],
  ["sk-telecom-wall", "SK Telecom"],
  ["intuit-wall", "Intuit TurboTax"],
  ["kodif-wall", "Kodif"],
  ["assembled-wall", "Assembled"],
  ["intercom", "Intercom"],
  ["coinbase-wall", "Coinbase"],
  ["asapp", "ASAPP"],
  ["decagon", "Decagon"],
  ["lyft-wall", "Lyft"],
  ["vercel-wall", "Vercel"],
  ["google-cloud-wall", "Google Cloud"],
  ["cursor-wall", "Cursor"],
  ["github-copilot-wall", "GitHub Copilot"],
  ["replit-wall", "Replit"],
] as const

type Tab = readonly [label: string, Icon?: IconType]

const EXAMPLES: ReadonlyArray<Tab> = [["Example 1"], ["Example 2"]]
const TASKS: ReadonlyArray<Tab> = [
  ["Onboarding", TbMessageCircle],
  ["Triage issues", TbListCheck],
  ["Refactor code", TbCode],
]
const BUYERS: ReadonlyArray<Tab> = [
  ["Individual", TbMessageCircle],
  ["Team & Enterprise", TbUsers],
]

// The mark before the session's list. The variation selector after it keeps
// it a glyph of the type, where a browser would draw an emoji.
const RECORD = "\u23FA\uFE0E"

// The session's list of things to do: one done, one under way, two to come.
const TODOS = [
  ["done", "  ⎿  ☒ Research codebase"],
  ["now", "     ☐ Evaluate possible optimizations"],
  ["next", "     ☐ Recommend best approach"],
  ["next", "     ☐ Implement selected approach"],
] as const

const USES = [
  [
    "Code onboarding",
    "Claude Code maps and explains entire codebases in a few seconds. It uses agentic search to understand project structure and dependencies without you having to manually select context files.",
  ],
  [
    "Turn issues into PRs",
    "Stop bouncing between tools. Claude Code integrates with GitHub, GitLab, and your command line tools to handle the entire workflow—reading issues, writing code, running tests, and submitting PRs—all from your terminal while you grab coffee.",
  ],
  [
    "Make powerful edits",
    "Claude Code’s understanding of your codebase and dependencies enables it to make powerful, multi-file edits that actually work.",
  ],
] as const

const VOICES: Array<{ logo: Logo; quote: string; name: string; role: string }> =
  [
    {
      logo: ["ramp-left", "Ramp", 124, 33],
      quote:
        "Claude Code has dramatically accelerated our team’s coding efficiency. I can now write EDA code in a notebook—pulling data, training a model, and evaluating it with basic metrics—and then ask Claude to convert that into a Metaflow pipeline. This process saves 1-2 days of routine (and often boring!) work per model.",
      name: "Anton Biryukov",
      role: "Staff Software Engineer",
    },
    {
      logo: ["intercom-left", "Intercom", 141, 23],
      quote:
        "Claude Code marks a threshold moment for AI in software development. At Intercom, it enables us to build applications we wouldn’t have had bandwidth for—from AI labeling tools to ROI calculators for our Sales team. Its ability to handle complex, multi-step tasks sets it apart from alternatives. Claude Code is fundamentally changing what’s possible for our engineering teams.",
      name: "Fergal Reid",
      role: "VP of AI",
    },
  ]

const PLANS = [
  [
    "node-plant",
    "Pro",
    "Claude Code is included in your Pro plan. Perfect for short coding sprints in smaller codebases with Claude Sonnet 4.",
    "$17",
    "Per month with annual subscription discount ($200 billed up front). $20 if billed monthly.",
  ],
  [
    "node-tree",
    "Max 5x",
    "Claude Code is included in your Max plan. Great value for everyday use in larger codebases with access to both Claude Sonnet 4 and Claude Opus 4.1.",
    "$100",
    "Per person billed monthly",
  ],
  [
    "node-tree",
    "Max 20x",
    "Even more Claude Code included in your Max plan. Great value for power users with the most access to Claude Opus 4.1.",
    "$200",
    "Per person billed monthly",
  ],
] as const

// The file answers only the first question; the rest are shown closed.
const QUESTIONS = [
  "How do I get started with Claude?",
  "What kinds of tasks can Claude Code handle?",
  "How does Claude Code work with my existing tools?",
  "Is Claude Code secure?",
  "Which models does Claude Code use?",
  "What are the system requirements to run Claude Code?",
  "How much does Claude Code cost?",
  "How can I enable my organization to use Claude Code?",
]
const ANSWER =
  "There are two ways to access Claude Code: with your Claude Pro or Max subscription, or with an Anthropic Console account. In both cases, you can download Claude Code using these instructions and then sign in with your respective Claude or Console account."

const RUNDOWN = [
  ["Claude Code documentation", "Developer doc"],
  ["Claude Code tutorials", "Developer doc"],
  ["How Anthropic teams use Claude Code", "Case study"],
] as const

/** How far it is from one card of a row to the next, and how far it scrolls. */
function reach(el: HTMLElement) {
  const [first, second] = el.children
  if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement))
    return null
  const stride = second.offsetLeft - first.offsetLeft
  const max = el.scrollWidth - el.clientWidth
  return stride > 0 && max > 1 ? { stride, max } : null
}

/**
 * A row of cards that scrolls sideways and snaps to a card: how many places
 * it stops at, which one it is on, whether that is its end, and a way to go
 * a card along and round again. A row with nothing to scroll has one stop.
 */
function useStops() {
  const row = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState({ stops: 1, current: 0, end: false })

  useEffect(() => {
    const el = row.current
    if (!el) return
    const measure = () => {
      const to = reach(el)
      const stops = to ? Math.ceil((to.max - 1) / to.stride) + 1 : 1
      const end = !!to && to.max - el.scrollLeft <= 1
      const current = !to
        ? 0
        : end
          ? stops - 1
          : Math.min(stops - 1, Math.round(el.scrollLeft / to.stride))
      setAt((was) =>
        was.stops === stops && was.current === current && was.end === end
          ? was
          : { stops, current, end }
      )
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.addEventListener("scroll", measure, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", measure)
    }
  }, [])

  const step = (by: 1 | -1) => {
    const el = row.current
    const to = el && reach(el)
    if (!el || !to) return
    const next = (at.current + by + at.stops) % at.stops
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollTo({
      left: Math.min(next * to.stride, to.max),
      behavior: still ? "auto" : "smooth",
    })
  }

  return { row, step, ...at }
}

/** The system's tabs, with a page's own names; the first is the current one. */
function TabRow({
  tabs,
  size = "medium",
}: {
  tabs: ReadonlyArray<Tab>
  size?: "medium" | "large"
}) {
  const [current, setCurrent] = useState(0)
  return (
    <div className="cds-tabs cds-cc-tabs" data-size={size} role="tablist">
      {tabs.map(([label, Icon], i) => (
        <button
          key={label}
          type="button"
          role="tab"
          className="cds-tab"
          aria-selected={current === i}
          data-icon={Icon ? "" : undefined}
          onClick={() => setCurrent(i)}
          {...quiet}
        >
          {Icon && <Icon aria-hidden />}
          {label}
        </button>
      ))}
    </div>
  )
}

/** The hero's terminal: a window on a Clay tile, drawn in type. */
function Terminal() {
  return (
    <div className="cds-cc-stage" aria-hidden>
      <div className="cds-cc-window">
        <div>
          <i />
          <i />
          <i />
        </div>
        <div>
          <pre>
            <b>✻</b>
            {" Welcome to "}
            <b>Claude Code</b>
            {
              "!\n\nwhile(curious) {\n     question_everything();\n     dig_deeper();\n     connect_dots(unexpected);\n\n     if (stuck) {\n          "
            }
            <b>keep_thinking();</b>
            {"\n     }\n}\n"}
            <b>✻ Simmering…</b>
          </pre>
          <span>&gt;</span>
        </div>
      </div>
    </div>
  )
}

/** The system's proof cards in their carousel, with the page's own four. */
function Proofs() {
  const { row, stops, current, end, step } = useStops()
  return (
    <div className="cds-cc-proofs">
      <div className="cds-proof-carousel">
        <div ref={row} className="cds-proofs" data-end={end || undefined}>
          {PROOFS.map((logo) => (
            <div key={logo[0]} className="cds-proof">
              <ProofLogo logo={logo} />
              <div className="cds-proof-body">
                <p>&ldquo;{QUOTE}&rdquo;</p>
                <small>{QUOTED}</small>
              </div>
            </div>
          ))}
        </div>
        <CarouselUi count={stops} current={current} onStep={step} />
      </div>
    </div>
  )
}

/**
 * A column of the page with marginalia at its sides. Wide, the right-hand
 * card stands level with the column's top and the left-hand one further
 * down; several on the left are a deck, the current one on top, over the
 * carousel's controls (`Deck`). On a phone the cards leave the margins for
 * one row under the column that scrolls sideways, and the controls step
 * along the row.
 *
 * The left-hand cards are drawn twice for that, in the margin and in the
 * row, and the page's styles show one of the two: the row also holds the
 * right-hand card and comes round again, which a deck does not.
 */
function Margins({
  left,
  right,
  children,
}: {
  left: Array<React.ReactNode>
  right: React.ReactNode
  children: React.ReactNode
}) {
  const { row, stops, current, step } = useStops()
  return (
    <div className="cds-cc-margins">
      <div className="cds-cc-margins-main">{children}</div>
      <div className="cds-cc-margins-left">
        {left.length > 1 ? <Deck cards={left} /> : left[0]}
      </div>
      <div className="cds-cc-margins-cards">
        <div ref={row} className="cds-cc-margins-row">
          {left.map((card, i) => (
            <div key={i} data-side="left">
              {card}
            </div>
          ))}
          <div data-side="right">{right}</div>
        </div>
        {stops > 1 && (
          <CarouselUi
            count={stops}
            current={current}
            onStep={step}
            size="small"
          />
        )}
      </div>
    </div>
  )
}

/** A marginalia card with one statistic under a customer's logo. */
function StatCard({
  logo,
  name,
  stat,
  children,
}: {
  logo: string
  name: string
  stat: string
  children: string
}) {
  return (
    <div className="cds-margin">
      <div className="cds-margin-card">
        <div className="cds-margin-stat">
          <img
            className="cds-margin-logo"
            src={`${LOGOS}/${logo}.svg`}
            alt={name}
          />
          <b>{stat}</b>
          {children}
        </div>
      </div>
    </div>
  )
}

/** A marginalia card for a customer's story: its logo, a line, and a way in. */
function StoryCard({
  logo,
  name,
  own = false,
  children,
}: {
  logo: string
  name: string
  /** The logo's file is the logo alone, not the system's 139 by 40 box. */
  own?: boolean
  children: string
}) {
  return (
    <div className="cds-margin">
      <div className="cds-margin-card">
        <img
          className="cds-margin-logo"
          data-own={own ? "" : undefined}
          src={`${LOGOS}/${logo}.svg`}
          alt={name}
        />
        <p>{children}</p>
        <div>
          <Button size="small" variant="tertiary">
            Read story
          </Button>
        </div>
      </div>
    </div>
  )
}

/** A session in the terminal, drawn in type: a prompt and the list it made. */
function Session() {
  return (
    <div className="cds-cc-session" aria-hidden>
      <p data-box>
        <b>✻</b> Welcome to Claude Code!
      </p>
      <p>
        &gt; Refactor the permission request components to share common UI
        elements and behavior.
      </p>
      <div>
        <p>
          <span data-tone="done">{RECORD}</span> <strong>Update Todos</strong>
        </p>
        {TODOS.map(([tone, line]) => (
          <p key={line} data-tone={tone}>
            {line}
          </p>
        ))}
      </div>
      <p>
        <b>✶ Brewing…</b>{" "}
        <span data-tone="next">(1s · ↑ 0 tokens · esc to interrupt)</span>
      </p>
    </div>
  )
}

/** "Install Node.js 18+, then run:" over the command that copies itself. */
function Install() {
  return (
    <div className="cds-cc-install">
      <p>
        Install{" "}
        <a className="cds-link" href="#" {...quiet}>
          Node.js 18+
        </a>
        , then run:
      </p>
      <ClipboardCopy command={COMMAND} />
    </div>
  )
}

/** The questions, in the system's accordion. */
function Questions() {
  const [open, setOpen] = useState(true)
  return (
    <div className="cds-accordion">
      {QUESTIONS.map((question, i) => (
        <div key={question} className="cds-accordion-item">
          {i === 0 ? (
            <button
              type="button"
              className="cds-accordion-head"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              {...quiet}
            >
              {question}
              {open ? <TbMinus aria-hidden /> : <TbPlus aria-hidden />}
            </button>
          ) : (
            <div className="cds-accordion-head">
              {question}
              <TbPlus aria-hidden />
            </div>
          )}
          {i === 0 && open && (
            <div className="cds-accordion-body">{ANSWER}</div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * The page. Its sections wear Ivory and White by turns, as in the file, over
 * a dark closing section and the Dark 3 footer. On the site's dark mode they
 * are Dark 3 and Dark 2.
 */
function ClaudeCode() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Claude Code"]} />
        <div className="cds-cc-hero">
          <div>
            <span className="cds-cc-tag">
              <i>✽</i>
              Doodling...
            </span>
            <h3>
              Built for
              <span>
                <TbChevronRight aria-hidden />
                develop
                <i aria-hidden>|</i>
              </span>
            </h3>
            <p>
              Unleash Claude’s raw power directly in your terminal. Search
              million-line codebases instantly. Turn hours-long workflows into a
              single command. Your tools. Your workflow. Your codebase, evolving
              at thought speed.
            </p>
            <div className="cds-cc-cta">
              <Button size="large" icon="none">
                Try Claude Code on Max
              </Button>
              <Button size="large" variant="secondary" icon="none">
                See pricing
              </Button>
            </div>
          </div>
          <Terminal />
        </div>
        <Proofs />
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Deep coding at terminal velocity"
          subtitle="Claude Code embeds Claude Opus 4.1—the same model our researchers and engineers use—right in your terminal. It has deep codebase awareness and the ability to edit files and run commands directly in your environment."
          pictogram={`${ART}/object-code-magnifier.svg`}
          actions={null}
        />
        <div className="cds-cc-demo">
          <TabRow tabs={EXAMPLES} />
          {/* The film the file plays here: a plain tile in its place. */}
          <div className="cds-cc-media" aria-hidden />
        </div>
        <Margins
          left={[
            <StatCard
              key="rakuten"
              logo="rakuten-left"
              name="Rakuten"
              stat="99.9%"
            >
              Accuracy on complex code modifications
            </StatCard>,
          ]}
          right={
            <div className="cds-margin">
              <div className="cds-margin-card">
                <div className="cds-margin-head">Introducing Claude Code</div>
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
                <p>
                  See Claude Code in action—from concept to commit in one
                  seamless workflow.
                </p>
              </div>
            </div>
          }
        >
          {FEATURES.map(([Icon, title, points]) => (
            <div key={title} className="cds-cc-feature">
              <h4>
                <Icon aria-hidden />
                {title}
              </h4>
              <ul>
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </Margins>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        {/* Set here, not as a `Header`: on a phone this one stands at the
            left. */}
        <div className="cds-cc-lead">
          <h3 className="cds-headline-2">Works with your IDEs</h3>
          <p className="cds-body-1">
            Claude works directly in VS Code and JetBrains, seeing your entire
            codebase instead of just isolated snippets. It understands your
            project structure and existing patterns, making suggestions that
            actually fit and presenting them directly in your code files. No
            copying and pasting, just building.
          </p>
        </div>
        <div className="cds-cc-tools">
          <div className="cds-cc-wall">
            {TOOLS.map(([file, name]) => (
              <img
                key={file}
                src={`${LOGOS}/${file}.svg`}
                alt={name}
                width={279}
                height={64}
                loading="lazy"
              />
            ))}
          </div>
          <div>
            <h4>Connects with your favorite command line tools</h4>
            <p>
              Your terminal is where real work happens. Claude Code connects
              with the tools that power development—deployment, databases,
              monitoring, version control. Rather than adding another interface
              to juggle, it enhances your existing stack. Less
              context-switching.
            </p>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p2"
          title="What could you do with Claude Code?"
          subtitle={null}
          pictogram={`${ART}/object-toolbox.svg`}
          actions={null}
        />
        <div className="cds-cc-uses">
          <TabRow tabs={TASKS} />
          <div>
            <Session />
            <div className="cds-cc-uses-copy">
              <Install />
              {USES.map(([title, text]) => (
                <div key={title} className="cds-cc-use">
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cds-cc-voices">
          <Header
            size="p3"
            title="What developers are saying"
            subtitle={null}
            pictogram={null}
            actions={null}
          />
          <div>
            {VOICES.map(({ logo: [file, brand, width, height], ...voice }) => (
              <div key={file} className="cds-testimonial">
                <div>
                  <div className="cds-testimonial-logo">
                    <img
                      src={`${LOGOS}/${file}.svg`}
                      alt={brand}
                      width={width}
                      height={height}
                      draggable={false}
                    />
                  </div>
                  <figure>
                    <blockquote>&ldquo;{voice.quote}&rdquo;</blockquote>
                    <figcaption className="cds-attribution">
                      {voice.name}
                      <span>{voice.role}</span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Get started with Claude Code"
          subtitle={null}
          pictogram={`${ART}/object-sprout.svg`}
          actions={<TabRow tabs={BUYERS} size="large" />}
        />
        <div className="cds-cc-plans">
          {PLANS.map(([art, name, text, price, terms]) => (
            <div key={name} className="cds-cc-plan">
              <div>
                <img src={`${ART}/${art}.svg`} alt="" />
                <h4>{name}</h4>
                <p>{text}</p>
              </div>
              <div>
                <strong>{price}</strong>
                <small>{terms}</small>
              </div>
              <Button size="large" icon="none">
                Try Claude
              </Button>
            </div>
          ))}
        </div>
        <p className="cds-cc-note">
          Additional{" "}
          <a className="cds-link" href="#" {...quiet}>
            usage limits
          </a>{" "}
          apply. Prices shown do not include applicable tax.
        </p>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="FAQ"
          subtitle={null}
          pictogram={null}
          actions={null}
        />
        <Margins
          left={[
            <StoryCard key="stubhub" logo="stubhub-left" name="StubHub">
              StubHub transforms live event ticketing with Claude
            </StoryCard>,
            <StoryCard key="ramp" logo="ramp-left" name="Ramp" own>
              {"How Ramp's engineering operates at hyperspeed with Claude Code"}
            </StoryCard>,
          ]}
          right={
            <StatCard logo="cred-left" name="CRED" stat="2x">
              Faster execution speed for delivering features and fixes
            </StatCard>
          }
        >
          <Questions />
        </Margins>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]} className="cds-cc-rundown">
        <Header
          size="p1"
          title="Get the technical rundown"
          subtitle={null}
          pictogram={`${ART}/node-web.svg`}
          actions={null}
        />
        <div className="cds-card-links">
          {RUNDOWN.map(([title, kind]) => (
            <LinkCard key={title} title={title} kind={kind} />
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["dark-3", "dark-2"]}>
        <div className="cds-cc-close">
          <div>
            <h3 className="cds-headline-1">
              Create what’s exciting. Maintain what’s essential.
            </h3>
            <Install />
          </div>
          <div className="cds-cc-news">
            <img src={`${ART}/object-mailbox.svg`} alt="" />
            <h4>Get the developer newsletter</h4>
            <p>
              Product updates, how-tos, community spotlights, and more.
              Delivered monthly to your inbox.
            </p>
            <label
              className="cds-input"
              data-size="larger"
              data-trailing="button"
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              <button
                type="button"
                className="cds-btn"
                data-variant="primary"
                data-icon="only"
                aria-label="Subscribe"
                {...quiet}
              >
                <TbArrowRight aria-hidden />
              </button>
            </label>
            <small>
              By subscribing, you agree to receive Claude marketing emails and
              agree to the{" "}
              <a className="cds-link" href="#" {...quiet}>
                Privacy Policy
              </a>
              . You can unsubscribe any time.
            </small>
          </div>
        </div>
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]} className="cds-cc-foot">
        <Footer />
      </TemplateBlock>
    </>
  )
}

// The page's own things for the demo cursor, wide and again at a phone's
// width. The scrolling and resizing around them are the template figure's
// (`around` in template.tsx), which also leaves the site's header alone.
const CLAUDE_CODE_DEMO: Array<DemoStep> = [
  { on: ".cds-cc-cta .cds-btn", text: "Try Claude Code on Max", rest: 900 },
  { on: ".cds-cc-cta .cds-btn", text: "See pricing", rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-cc-cta .cds-btn", text: "Try Claude Code on Max", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function ClaudeCodeDoc() {
  return (
    <Section>
      <TemplateFigure steps={CLAUDE_CODE_DEMO}>
        <ClaudeCode />
      </TemplateFigure>
    </Section>
  )
}
