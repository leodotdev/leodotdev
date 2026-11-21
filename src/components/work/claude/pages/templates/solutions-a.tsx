import { useEffect, useRef, useState } from "react"
import { TbArrowsExchange, TbPaperclip, TbPrompt } from "react-icons/tb"
import { LinkCard } from "@/components/work/claude/pages/cards"
import { ProofLogo } from "@/components/work/claude/pages/proof"
import { Button, CarouselUi } from "@/components/work/claude/specimens"

// What the three Solutions templates share (AI Agents, Coding, and Customer
// Support, on the Figma file's Templates page). The pages are made of the
// same few things in different orders: a hero over a wall of customer logos,
// an artifact with a list beside its title, quotes from customers, and a row
// of link cards. Each page's own words and order are in its own file; the
// styles are `.cds-sola-*` in src/claude-templates/solutions-a.css.

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

export const ART = "/work/claude/illustrations"

/** A customer's logo: its file in public/work/claude/logos, and its own size. */
export type Brand = [file: string, name: string, width: number, height: number]

// The logos these pages use, exported from the file. Most are drawn at their
// own size; a few older files are the whole 279 by 64 box of the logo wall,
// with the logo in its middle.
export const BRANDS = {
  amazonQ: ["amazon-q", "Amazon Q", 51, 56],
  asapp: ["asapp", "ASAPP", 279, 64],
  assembled: ["assembled", "Assembled", 150, 20],
  augmentCode: ["augment-code", "Augment Code", 191, 26],
  bito: ["bito", "Bito", 88, 36],
  block: ["block", "Block", 128, 28],
  cognition: ["cognition", "Cognition", 143, 34],
  coinbase: ["coinbase", "Coinbase", 136, 24],
  cursor: ["cursor", "Cursor", 120, 20],
  decagon: ["decagon", "Decagon", 279, 64],
  doordash: ["doordash", "DoorDash", 169, 20],
  factory: ["factory", "Factory", 163.2, 24],
  githubCopilot: ["github-copilot", "GitHub Copilot", 180, 23],
  gitlab: ["gitlab", "GitLab", 280, 64],
  intercom: ["intercom-left", "Intercom", 141, 23],
  intuit: ["intuit", "Intuit TurboTax", 108.75, 30],
  kodif: ["kodif", "Kodif", 104, 20],
  lyft: ["lyft", "Lyft", 47, 34],
  replit: ["replit", "Replit", 127, 32],
  skTelecom: ["sk-telecom", "SK Telecom", 112, 44],
  sourcegraph: ["sourcegraph", "Sourcegraph", 185, 26],
  usf: ["usf", "University of San Francisco", 279, 64],
  vercel: ["vercel", "Vercel", 120, 24],
  windsurf: ["windsurf", "Windsurf", 145, 20],
} satisfies Record<string, Brand>

/** A row of buttons: a hero's, under its lead. */
export function Actions({ children }: { children: React.ReactNode }) {
  return <div className="cds-sola-actions">{children}</div>
}

/**
 * The hero and what stands under it, down to the logo wall, in the page's
 * margins. On a phone `phone="left"` sets a centered hero to the left, as
 * the file's mobile frame has it.
 */
export function HeroBlock({
  phone,
  children,
}: {
  phone?: "left"
  children: React.ReactNode
}) {
  return (
    <div className="cds-sola-hero" data-phone={phone}>
      {children}
    </div>
  )
}

/**
 * The centered hero: a pictogram, the headline, a lead, and the page's
 * buttons. It is the system's one-column hero with the picture on top.
 */
export function CenterHero({
  pictogram,
  title,
  lead,
  children,
}: {
  pictogram: string
  title: string
  lead: string
  children: React.ReactNode
}) {
  return (
    <div className="cds-hero">
      <div className="cds-hero-center">
        <img src={pictogram} alt="" />
        <h3>{title}</h3>
        <div className="cds-hero-copy">
          <p className="cds-hero-lead">{lead}</p>
          <Actions>{children}</Actions>
        </div>
      </div>
    </div>
  )
}

/**
 * The logo wall with a page's own customers, five to a row or four. Each
 * logo keeps its own size in a cell of the wall, as the file's atom does.
 */
export function LogoWall({
  brands,
  per = 5,
  rule = true,
}: {
  brands: Array<Brand>
  per?: 4 | 5
  /** The rule above the wall. */
  rule?: boolean
}) {
  return (
    <div
      className="cds-logo-wall cds-sola-wall"
      data-per={per}
      data-rule={rule ? undefined : "none"}
    >
      <div>
        {brands.map(([file, name, width, height]) => (
          <span
            key={file}
            style={{ "--cds-sola-w": width } as React.CSSProperties}
          >
            <img
              src={`/work/claude/logos/${file}.svg`}
              alt={name}
              width={width}
              height={height}
              loading="lazy"
              draggable={false}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

/** A customer's logo at the size a marginalia card draws it. */
export function MarginLogo({
  brand: [file, name, width, height],
}: {
  brand: Brand
}) {
  // A card's logo box is 139 wide where the wall's is 222.
  const scale = 139 / 222
  return (
    <span className="cds-margin-logo cds-sola-mlogo">
      <img
        src={`/work/claude/logos/${file}.svg`}
        alt={name}
        width={Math.round(width * scale)}
        height={Math.round(height * scale)}
        draggable={false}
      />
    </span>
  )
}

// How far it is from one item of a row to the next, and how far the row
// scrolls.
function reach(el: HTMLElement | null) {
  const [first, second] = el?.children ?? []
  if (!el || !(first instanceof HTMLElement)) return null
  return {
    el,
    stride:
      second instanceof HTMLElement ? second.offsetLeft - first.offsetLeft : 0,
    max: el.scrollWidth - el.clientWidth,
  }
}

/**
 * A row that scrolls sideways under a carousel's controls: where it stops,
 * which stop it is at, whether it is at its end, and a way to step along it
 * and round again. `row` goes on the scrolling element.
 */
export function useRail() {
  const row = useRef<HTMLDivElement>(null)
  const [stops, setStops] = useState(1)
  const [current, setCurrent] = useState(0)
  const [end, setEnd] = useState(false)

  useEffect(() => {
    const el = row.current
    if (!el) return
    const measure = () => {
      const at = reach(el)
      if (!at) return
      const count =
        at.max <= 1 || at.stride <= 0
          ? 1
          : Math.ceil((at.max - 1) / at.stride) + 1
      const last = at.max > 1 && at.max - at.el.scrollLeft <= 1
      setStops(count)
      setEnd(last)
      setCurrent(
        count === 1
          ? 0
          : last
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
    if (!at || stops < 2) return
    const next = (current + by + stops) % stops
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    at.el.scrollTo({
      left: Math.min(next * at.stride, at.max),
      behavior: still ? "auto" : "smooth",
    })
  }

  return { row, stops, current, end, step }
}

/** A quote for a proof card, under the customer's logo if it has one. */
export type Quote = { brand?: Brand; quote: string; by: string }

/**
 * The proof cards in their carousel, with a page's own quotes (the docs'
 * `Proofs` carries the file's sample cards). Three show at a time, fewer as
 * the page narrows; the arrows go a card at a time and come round again.
 */
export function ProofRail({ quotes }: { quotes: Array<Quote> }) {
  const { row, stops, current, end, step } = useRail()
  return (
    <div className="cds-proof-carousel cds-sola-proofs">
      <div ref={row} className="cds-proofs" data-end={end || undefined}>
        {quotes.map(({ brand, quote, by }) => (
          <div
            key={by}
            className="cds-proof"
            data-bare={brand ? undefined : ""}
          >
            {brand && <ProofLogo logo={brand} />}
            <div className="cds-proof-body">
              <p>&ldquo;{quote}&rdquo;</p>
              <small>{by}</small>
            </div>
          </div>
        ))}
      </div>
      <CarouselUi count={stops} current={current} onStep={step} />
    </div>
  )
}

/** The testimonial blurb: a customer's logo beside a quote and its name. */
export function Testimonial({
  brand: [file, brand, width, height],
  quote,
  name,
  role,
}: {
  brand: Brand
  quote: string
  name: string
  role: string
}) {
  return (
    <div className="cds-testimonial">
      <div>
        <div className="cds-testimonial-logo">
          <img
            src={`/work/claude/logos/${file}.svg`}
            alt={brand}
            width={width}
            height={height}
            draggable={false}
          />
        </div>
        <figure>
          <blockquote>&ldquo;{quote}&rdquo;</blockquote>
          <figcaption className="cds-attribution">
            {name}
            <span>{role}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

/**
 * The artifact as these pages show it: the viewer's stage without its tabs,
 * on a color of the page's own. On the left a prompt and its attachments,
 * on the right the artifact they made; in a narrow box one side at a time,
 * with a button to switch. The file fills every one with the same example.
 */
export function Stage({ tone }: { tone: "plum" | "olive" | "oat" }) {
  // Narrow, the stage shows one side at a time.
  const [view, setView] = useState<"result" | "prompt">("result")
  return (
    <div
      className="cds-artifact cds-sola-stage"
      data-view={view}
      data-tone={tone}
    >
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
            <p>
              I want to create a website for my portfolio based on this design.
              It will be built with Shopify so that I can eventually add a store
              to it.
            </p>
          </div>
          <div className="cds-artifact-card">
            <header>
              <TbPaperclip aria-hidden />
              Attachments
            </header>
            <div className="cds-artifact-files">
              {[1, 2].map((file) => (
                <div key={file}>
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

/** What an artifact is about: a title beside a list. */
export function About({
  title,
  items,
  small = false,
}: {
  title: string
  items: ReadonlyArray<string>
  /** The list in the smaller body size. */
  small?: boolean
}) {
  return (
    <div className="cds-sola-about" data-small={small ? "" : undefined}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/** The row of three link cards a page ends on. */
export function LinkCards({
  cards,
}: {
  cards: ReadonlyArray<readonly [title: string, kind: string]>
}) {
  return (
    <div className="cds-card-links cds-sola-cards">
      {cards.map(([title, kind]) => (
        <LinkCard key={title} title={title} kind={kind} />
      ))}
    </div>
  )
}

/** A header's or a hero's two usual buttons. */
export function StartAndContact() {
  return (
    <>
      <Button size="large" icon="none">
        Start building
      </Button>
      <Button size="large" variant="secondary" icon="none">
        Contact sales
      </Button>
    </>
  )
}
