import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  TbArrowsExchange,
  TbBolt,
  TbChartBar,
  TbDots,
  TbFileDownload,
  TbMinus,
  TbPencil,
  TbPlus,
  TbUsersGroup,
} from "react-icons/tb"
import { Deck } from "@/components/work/claude/deck"
import { Logo } from "@/components/work/claude/pages/artifacts"
import { ProofLogo } from "@/components/work/claude/pages/proof"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { Button, CarouselUi } from "@/components/work/claude/specimens"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { cn } from "@/lib/utils"
import type { IconType } from "react-icons"

// What the three plan pages share (the "Plans: Max Plan", "Plans: Teams",
// and "Plans: Enterprise" frames on the Figma file's Templates page): the
// hero, the list with marginalia in its gutters, the artifact with a caption
// under it, the row of proof cards, and the FAQ. Each page's own words are in
// its own file. The styles are `.cds-plan-*` in src/claude-templates/plans.css.

export const ART = "/work/claude/illustrations"
export const LOGOS = "/work/claude/logos"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

// What the Team and Enterprise pages both say, in the file's words: the three
// challenges of their first section, and what the artifact's Engineering tab
// is about.
export const CHALLENGES = [
  [
    TbBolt,
    "Get work done faster",
    "Cut project timelines from days to hours, with 25–100% productivity gains that free up employees for more strategic work.",
  ],
  [
    TbUsersGroup,
    "Expand what your teams can do",
    "Give every department the tools they need to tackle complex challenges beyond their usual expertise.",
  ],
  [
    TbChartBar,
    "Scale your institutional knowledge",
    "Turn your organization’s expertise into something every team can access, so quality stays consistent as you grow.",
  ],
] as const

export const ENGINEERING = [
  "Convert project requirements into technical specifications",
  "Design system architecture and component interactions",
  "Troubleshoot errors and runtime issues",
  "Identify code optimizations and performance improvements",
]

/**
 * The hero: the plan's name, a line about it, and its buttons, beside an
 * illustration. On a phone the illustration is small, above the name.
 */
export function PlanHero({
  title,
  lead,
  art,
  children,
}: {
  title: string
  lead: string
  /** An illustration's file name, without its extension. */
  art: string
  /** The buttons. */
  children: React.ReactNode
}) {
  return (
    <div className="cds-plan-hero">
      <div>
        <h3>{title}</h3>
        <p>{lead}</p>
        <div className="cds-plan-actions">{children}</div>
      </div>
      <img src={`${ART}/${art}.svg`} alt="" />
    </div>
  )
}

// How far it is from one card of a row to the next, and how far the row
// scrolls.
const reach = (el: HTMLElement | null) => {
  const [first, second] = el?.children ?? []
  if (
    !el ||
    !(first instanceof HTMLElement) ||
    !(second instanceof HTMLElement)
  )
    return null
  return {
    el,
    stride: second.offsetLeft - first.offsetLeft,
    max: el.scrollWidth - el.clientWidth,
  }
}

/**
 * A row of cards over the carousel's controls. Where the cards do not all
 * fit, the row scrolls sideways and snaps to a card; the arrows go a card at
 * a time and come round again, with a bullet for each place the row stops.
 * Where they all fit there is nothing to step through, and the controls are
 * left off. `proofs` is a row of proof cards, which brings the system's own
 * widths for them; `cards` is a row of marginalia.
 */
export function PlanCarousel({
  kind,
  className,
  children,
}: {
  kind: "proofs" | "cards"
  className?: string
  children: React.ReactNode
}) {
  const row = useRef<HTMLDivElement>(null)
  const [stops, setStops] = useState(1)
  const [current, setCurrent] = useState(0)
  const [end, setEnd] = useState(false)

  useEffect(() => {
    const el = row.current
    if (!el) return
    const measure = () => {
      const at = reach(el)
      if (!at || at.stride <= 0) return
      const count = at.max <= 1 ? 1 : Math.ceil((at.max - 1) / at.stride) + 1
      const last = at.max > 1 && at.max - at.el.scrollLeft <= 1
      setStops(count)
      setEnd(last)
      setCurrent(
        last
          ? count - 1
          : Math.min(count - 1, Math.round(at.el.scrollLeft / at.stride))
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
    const at = reach(row.current)
    if (!at) return
    const next = (current + by + stops) % stops
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    at.el.scrollTo({
      left: Math.min(next * at.stride, at.max),
      behavior: still ? "auto" : "smooth",
    })
  }

  return (
    <div
      className={cn(
        "cds-plan-carousel",
        kind === "proofs" ? "cds-proof-carousel" : "cds-plan-cards",
        className
      )}
      data-still={stops < 2 ? "" : undefined}
    >
      <div
        ref={row}
        className={kind === "proofs" ? "cds-proofs" : undefined}
        data-end={end || undefined}
      >
        {children}
      </div>
      <CarouselUi count={stops} current={current} onStep={step} />
    </div>
  )
}

/** A customer's proof: its logo over a quote and who said it, or a figure. */
export type PlanProof = {
  logo: [file: string, name: string, width: number, height: number]
} & ({ quote: string; by: string } | { stat: string; note: string })

export function ProofCard({ proof }: { proof: PlanProof }) {
  return (
    <div className="cds-proof">
      <ProofLogo logo={proof.logo} />
      {"quote" in proof ? (
        <div className="cds-proof-body">
          <p>&ldquo;{proof.quote}&rdquo;</p>
          <small>{proof.by}</small>
        </div>
      ) : (
        <div className="cds-proof-body" data-stat>
          <span className="cds-proof-stat">{proof.stat}</span>
          <small>{proof.note}</small>
        </div>
      )}
    </div>
  )
}

/** A list of features: an icon and a title beside a few lines about it. */
export function PlanList({
  items,
}: {
  items: ReadonlyArray<
    readonly [icon: IconType, title: string, text: React.ReactNode]
  >
}) {
  return (
    <div className="cds-plan-list">
      {items.map(([Icon, title, text]) => (
        <div key={title} className="cds-plan-item">
          <h4>
            <Icon aria-hidden />
            {title}
          </h4>
          <p>{text}</p>
        </div>
      ))}
    </div>
  )
}

// A batch of marginalia in a gutter: a deck of cards, the current one on
// top, over the carousel's controls (`Deck`).
function Batch({ cards }: { cards: Array<React.ReactNode> }) {
  if (cards.length < 2) return cards[0] ?? null
  return <Deck className="cds-plan-batch" cards={cards} />
}

/**
 * A section's content with marginalia in its gutters. Wide, the content
 * keeps to the middle and the cards take the columns at either side, the
 * left one set lower than the right; several cards on one side are a batch,
 * one showing at a time. On a phone the cards leave the gutters for one row
 * under the content that scrolls sideways.
 */
export function PlanMargins({
  left = [],
  right = [],
  children,
}: {
  left?: Array<React.ReactNode>
  right?: Array<React.ReactNode>
  children: React.ReactNode
}) {
  return (
    <div className="cds-plan-margins">
      <div className="cds-plan-margin" data-side="left">
        <Batch cards={left} />
      </div>
      <div>{children}</div>
      <div className="cds-plan-margin" data-side="right">
        <Batch cards={right} />
      </div>
      <PlanCarousel kind="cards">
        {[...left, ...right].map((card, i) => (
          <Fragment key={i}>{card}</Fragment>
        ))}
      </PlanCarousel>
    </div>
  )
}

/** The marginalia card for a file to download. */
export function PdfCard() {
  return (
    <div className="cds-margin">
      <div className="cds-margin-card">
        <div className="cds-margin-head">
          <TbFileDownload aria-hidden />
          Download a PDF
        </div>
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
  )
}

/** The marginalia card for a connector: its logo, what it does, and a button. */
export function ConnectorCard({ action }: { action: string }) {
  return (
    <div className="cds-margin">
      <div className="cds-margin-card">
        <div className="cds-margin-head">Connectors</div>
        <div className="cds-margin-caption">
          <img
            className="cds-margin-logo cds-plan-logo-cloudflare"
            src={`${LOGOS}/cloudflare.svg`}
            alt="Cloudflare"
          />
          <p>
            Manage Workers deployments, D1 databases, R2 storage, and KV stores
            directly through Claude. Access real-time logs, configure security
            rules, monitor performance metrics, and deploy applications using
            Cloudflare’s edge infrastructure, all through natural language
            commands for streamlined development workflows.
          </p>
        </div>
        <div>
          <Button size="small" variant="tertiary">
            {action}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * The card behind the connector's in its batch: the component's own sample,
 * with the caption the file's Marginalia component gives it.
 */
export function WebinarCard() {
  return (
    <div className="cds-margin">
      <div className="cds-margin-card">
        <Logo name="asana" />
        <p>
          Interact with your Asana workspace to reference tasks, assign work,
          update project status, track team progress, and ensure projects remain
          on track
        </p>
        <div>
          <Button size="small" variant="tertiary">
            Watch webinar
          </Button>
        </div>
      </div>
    </div>
  )
}

/** The prompt behind a page's own in its batch: the component's sample. */
export const SAMPLE_PROMPT =
  "Hey Claude, help me forecast the upcoming year so I can make some informed plans."

export type Tone = "plum" | "clay" | "cactus" | "sky" | "rose"

// The artifact's one example, as every plan page shows it.
const PROMPT =
  "I want to create a website for my portfolio based on this design. It will be built with Shopify so that I can eventually add a store to it."

/**
 * The artifact viewer with a caption under it: tabs over a stage, in the
 * page's own color, and beside a headline what the current tab is about.
 * The file has the one example and the first tab's caption, so every tab
 * shows that example, and a tab the file has no words for shows bars where
 * its caption would be.
 *
 * It is the `Artifact` of pages/artifacts.tsx with a page's own tabs and
 * color: the tabs that do not fit move into an overflow menu behind a "more"
 * button, worked out from the tabs' own widths in the same way (measured
 * once with all of them laid out, and again when the fonts have loaded).
 */
export function PlanArtifact({
  tabs,
  tone,
  note = false,
  title,
  children,
}: {
  tabs: Array<string>
  tone: Tone
  /** The note beside the tabs, pointing at the stage. */
  note?: boolean
  /** The first tab's headline, where it is not the tab's name. */
  title?: string
  /** The first tab's caption. */
  children: React.ReactNode
}) {
  const [tab, setTab] = useState(0)
  // Narrow, the stage shows one side at a time.
  const [view, setView] = useState<"result" | "prompt">("result")

  // The room the tabs have: the row less the note.
  const room = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const track = useDismiss(open, () => setOpen(false))
  // How many tabs fit. Not known yet: every tab is laid out, to be measured.
  const [fit, setFit] = useState<number | null>(null)
  const widths = useRef<{
    tabs: Array<number>
    more: number
    track: number
    dots: number
  } | null>(null)

  const count = tabs.length
  const unmeasured = fit === null
  useLayoutEffect(() => {
    const el = room.current
    const row = track.current
    if (!el || !row) return
    if (unmeasured) {
      const all = [...row.querySelectorAll<HTMLElement>('[role="tab"]')]
      const more = row.querySelector<HTMLElement>("[aria-haspopup]")
      if (all.length !== count || !more) return
      const box = getComputedStyle(row)
      const button = getComputedStyle(more)
      widths.current = {
        tabs: all.map((t) => t.offsetWidth),
        more: more.offsetWidth,
        track: parseFloat(box.paddingLeft) + parseFloat(box.paddingRight),
        // What the dots add to a tab that also carries a name.
        dots:
          more.offsetWidth -
          parseFloat(button.paddingLeft) -
          parseFloat(button.paddingRight) +
          (parseFloat(button.columnGap) || 0),
      }
    }
    const measure = () => {
      const w = widths.current
      if (!w) return
      const need = (shown: number) =>
        w.track +
        w.tabs.slice(0, shown).reduce((sum, width) => sum + width, 0) +
        (shown === count ? 0 : tab >= shown ? w.tabs[tab] + w.dots : w.more)
      let shown = count
      while (shown > 0 && need(shown) > el.clientWidth) shown--
      setFit(shown)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [unmeasured, tab, track, count])

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

  const shown = fit ?? count
  const rest = tabs.slice(shown)

  return (
    <div className="cds-plan-showcase">
      <div
        className="cds-artifact cds-plan-artifact"
        data-view={view}
        data-tone={tone}
      >
        <div className="cds-plan-artifact-top">
          <div ref={room}>
            <div
              ref={track}
              className="cds-tabs"
              role="tablist"
              data-measuring={fit === null ? "" : undefined}
            >
              {tabs.slice(0, shown).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  className="cds-tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
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
                  aria-selected={tab >= shown}
                  aria-expanded={open}
                  aria-label={tab >= shown ? undefined : "More"}
                  onClick={() => setOpen(!open)}
                  {...quiet}
                >
                  {tab >= shown && tabs[tab]}
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
                        setTab(shown + i)
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
          </div>
          {note && (
            <div className="cds-plan-note">
              <img src={`${ART}/note-arrow.svg`} alt="" />
              <div>
                <span className="cds-micro">
                  <TbPencil aria-hidden />
                  Note
                </span>
                Interact with the data—hover and toggle views to uncover
                patterns
              </div>
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
              <header>Prompt</header>
              <p>{PROMPT}</p>
            </div>
            <div className="cds-artifact-card">
              <header>Attachments</header>
              <div className="cds-artifact-files">
                {[0, 1].map((i) => (
                  <div key={i}>
                    <span>
                      <b>Lecture #1</b>
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
                  <li>
                    Studies both overt behavior and internal mental states
                  </li>
                  <li>Examines both humans and animals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cds-plan-about">
        <h4>
          {tab === 0 ? (
            (title ?? tabs[0])
          ) : title ? (
            <Bar w="72%" h={20} />
          ) : (
            tabs[tab]
          )}
        </h4>
        <div>{tab === 0 ? children : <Lines count={3} />}</div>
      </div>
    </div>
  )
}

/**
 * The FAQ: the system's accordion, one question open at a time. A question
 * the file gives no answer to opens on bars.
 */
export function PlanFaq({
  items,
}: {
  items: ReadonlyArray<readonly [question: string, answer?: string]>
}) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="cds-accordion">
      {items.map(([question, answer], i) => (
        <div key={question} className="cds-accordion-item">
          <button
            type="button"
            className="cds-accordion-head"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            {...quiet}
          >
            {question}
            {open === i ? <TbMinus aria-hidden /> : <TbPlus aria-hidden />}
          </button>
          {open === i && (
            <div className="cds-accordion-body">
              {answer ?? <Lines count={3} />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
