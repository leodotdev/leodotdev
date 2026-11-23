import { useEffect, useRef, useState } from "react"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import {
  SkeletonAside,
  SkeletonBody,
  SkeletonCarouselUi,
  SkeletonContext,
  SkeletonHeader,
  SkeletonHeroEnd,
  SkeletonImage,
} from "@/components/work/claude/skeleton"
import { CarouselUi } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The quotes and figures are the ones in the Figma file's own specimens, and
// the customers' logos were exported from it (public/work/claude/logos/).

/** A customer's logo at its own size, set at the left of the logo's box. */
type Logo = [file: string, name: string, width: number, height: number]

type Proof = { logo: Logo } & (
  { quote: string; by: string } | { stat: string; note: string }
)

const AUGMENT: Proof = {
  logo: ["augment-code", "Augment Code", 191, 26],
  stat: "85%",
  note: "reduction in debugging time using Claude",
}

// The four cards of the file's carousel, the statistic twice as it is there.
const PROOFS: Array<Proof> = [
  {
    logo: ["replit", "Replit", 127, 32],
    quote:
      "Claude’s deep code understanding aligns perfectly with our mission to democratize programming.",
    by: "Amjad Masad, CEO, Replit",
  },
  AUGMENT,
  {
    logo: ["windsurf", "Windsurf", 145, 20],
    quote:
      "With Claude, we’re creating development experiences that feel intuitive and intelligent.",
    by: "Neil Reddy, CEO, Windsurf",
  },
  AUGMENT,
]

export function ProofLogo({
  logo: [file, name, width, height],
}: {
  logo: Logo
}) {
  return (
    <div className="cds-proof-logo">
      <img
        src={`/work/claude/logos/${file}.svg`}
        alt={name}
        width={width}
        height={height}
        draggable={false}
      />
    </div>
  )
}

/**
 * The proof cards in their carousel. Wide, three or four show at a time; as
 * it narrows two, and on a phone one, with the next peeking in from the side
 * under a fade (the widths are container queries in src/claude-ds.css). The
 * row scrolls sideways and snaps to a card; the arrows go a card at a time
 * and come round again, and there is a bullet for each place the row stops.
 */
export function Proofs() {
  const row = useRef<HTMLDivElement>(null)
  const [stops, setStops] = useState(1)
  const [current, setCurrent] = useState(0)
  const [end, setEnd] = useState(false)

  // How far it is from one card to the next, and how far the row scrolls.
  const reach = () => {
    const el = row.current
    const [first, second] = el?.children ?? []
    if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement))
      return null
    return {
      el: el!,
      stride: second.offsetLeft - first.offsetLeft,
      max: el!.scrollWidth - el!.clientWidth,
    }
  }

  useEffect(() => {
    const measure = () => {
      const at = reach()
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
    const el = row.current
    if (!el) return
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
    const at = reach()
    if (!at) return
    const next = (current + by + stops) % stops
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    at.el.scrollTo({
      left: Math.min(next * at.stride, at.max),
      behavior: still ? "auto" : "smooth",
    })
  }

  return (
    <div className="cds-proof-carousel">
      <div ref={row} className="cds-proofs" data-end={end || undefined}>
        {PROOFS.map((proof, i) => (
          <div key={i} className="cds-proof">
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
        ))}
      </div>
      <CarouselUi count={stops} current={current} onStep={step} />
    </div>
  )
}

// What the demo cursor does on the proof cards: it goes to the next card,
// narrows the figure to a phone's width, where one card shows and the next
// peeks in, goes through the cards there and round to the first, and lets
// the figure out again. The notes are the file's descriptions of its two
// carousels of proof cards, and of the Carousel organism.
const next = '.cds-carousel-ui [aria-label="Next"]'
const PROOF_DEMO: Array<DemoStep> = [
  {
    on: next,
    click: true,
    rest: 900,
    note: {
      kind: "concept",
      title: "Desktop carousel",
      text: "“A carousel showing 3-4 Social Proof organisms at a time.”",
      on: ".cds-proofs",
    },
  },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 390,
    note: {
      kind: "concept",
      title: "Mobile carousel",
      text: "One card “is highlighted at a time with the next item peeking”; a gradient fade softens the overflow.",
      on: ".cds-proofs",
    },
  },
  {
    on: next,
    click: true,
    rest: 700,
    note: {
      kind: "concept",
      title: "Controls",
      text: "The Carousel organism’s own: “directional controls and pagination indicators.”",
      on: ".cds-carousel-ui",
    },
  },
  { on: next, click: true, rest: 700 },
  { on: next, click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

// And on the testimonial: it narrows it until the logo goes above the
// quote, and lets it out again. The notes are the Testimonial Blurb's own
// properties and variants in the file.
const TESTIMONIAL_DEMO: Array<DemoStep> = [
  {
    on: ".cds-testimonial blockquote",
    idle: true,
    rest: 900,
    note: {
      kind: "concept",
      title: "Logo",
      text: "The component has two switches: Show Logo and CTA.",
      on: ".cds-testimonial-logo",
    },
  },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 390,
    note: {
      kind: "concept",
      title: "Mobile",
      text: "The second of its two variants: a column, where Desktop is a row.",
      on: ".cds-testimonial > div",
    },
  },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const FACTS = [
  ["Industry:", "Software"],
  ["Company size:", "400+"],
  ["Product:", "AI Platform"],
  ["Partner:", "Amazon Web Service"],
  ["Location:", "United States"],
]

export function ProofDoc() {
  return (
    <>
      <Section
        title="Quotes"
        caption="Two quotes: a prominent blockquote and a subtle inline one."
      >
        {/* Each kind of quote in a figure of its own. */}
        <Specimen figure className="p-6 md:p-8">
          <SkeletonContext
            // In a customer's story: between two parts of its body.
            before={<SkeletonBody />}
            after={<SkeletonAside />}
          >
            <figure className="cds-pullquote m-0">
              <blockquote>
                &ldquo;Claude has consistently demonstrated a remarkable
                capacity for reasoning and provides well-balanced answers&rdquo;
              </blockquote>
              <figcaption className="cds-attribution items-center">
                Aarash Heydari
                <span>Infrastructure engineer, Perplexity</span>
              </figcaption>
            </figure>
          </SkeletonContext>
        </Specimen>
        <Specimen figure className="p-6 md:p-8">
          {/* In the running text of a customer's story, between two
              paragraphs. */}
          <SkeletonBody>
            <blockquote className="cds-quote-inline">
              <p>
                &ldquo;We&rsquo;re automating the mundane. 80% of Sales work
                today is manual, laborious, data work. In the era of AI, humans
                can focus on truly human, creative work, and we can leave the
                data work in the hands of AI.&rdquo;
              </p>
              <footer>Matthew Quan, Enterprise Growth Lead, Clay</footer>
            </blockquote>
          </SkeletonBody>
        </Specimen>
      </Section>

      <Section
        title="Proof Cards & Testimonial"
        caption="A credibility-building component that showcases customer testimonials, usage statistics, and partner logos to demonstrate product value and trustworthiness. Client testimonials with company branding and attribution, in adaptable layout formats."
      >
        <Specimen figure>
          <DemoCursor
            steps={PROOF_DEMO}
            className="p-6 [--cds-figure-pad:24px] md:p-8 md:[--cds-figure-pad:32px]"
          >
            {/* As tall as the cards at their tallest, a phone's, so the
                figure keeps one height while it is resized. */}
            <Resizable
              label="Carousel width"
              min={390}
              sizes={[["Desktop"], ["Tablet", 831], ["Mobile", 543]]}
              className="flex min-h-[872px] flex-col justify-center sm:h-[872px]"
            >
              <SkeletonContext
                // As on the Claude Code page: straight after the hero.
                before={<SkeletonHeroEnd />}
                after={<SkeletonHeader line />}
              >
                <Proofs />
              </SkeletonContext>
            </Resizable>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={TESTIMONIAL_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Testimonial width"
              min={390}
              sizes={[["Desktop"], ["Mobile", 700]]}
              className="flex min-h-[768px] flex-col justify-center sm:h-[768px]"
            >
              <SkeletonContext
                // As on a Solutions page: under a one-line heading, over
                // the carousel's controls and the next section.
                before={<SkeletonHeader pictogram={false} />}
                after={
                  <>
                    <SkeletonCarouselUi />
                    <SkeletonHeader />
                  </>
                }
              >
                <div className="cds-testimonial">
                  <div>
                    <div className="cds-testimonial-logo">
                      <img
                        src="/work/claude/logos/intercom-left.svg"
                        alt="Intercom"
                        width={141}
                        height={23}
                        draggable={false}
                      />
                    </div>
                    <figure>
                      <blockquote>
                        &ldquo;With Claude, we&rsquo;re not just automating
                        customer service&mdash;we&rsquo;re elevating it to truly
                        human quality. This lets support teams think more
                        strategically about customer experience and what makes
                        interactions genuinely valuable.&rdquo;
                      </blockquote>
                      <figcaption className="cds-attribution">
                        Fergal Reid
                        <span>VP of AI at Intercom</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </SkeletonContext>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Customer Story Details"
        caption="A customer story carries one, two, or three statistics."
      >
        <Specimen figure className="p-6 md:p-8">
          <SkeletonContext
            // At the top of a customer's story: under its headline and
            // picture, over the story itself.
            before={
              <>
                <SkeletonHeader pictogram={false} line />
                <SkeletonImage />
              </>
            }
            after={<SkeletonBody />}
          >
            <div className="cds-meta">
              <div>
                <dl>
                  {FACTS.map(([term, value]) => [
                    <dt key={term}>{term}</dt>,
                    <dd key={`${term}-value`}>{value}</dd>,
                  ])}
                </dl>
              </div>
              <div>
                <strong>2x faster</strong>
                <small>response times with Claude 3.5 Sonnet</small>
              </div>
              <div>
                <strong>2x more accurate</strong>
                <small>advanced problem solving with Claude 3 Opus</small>
              </div>
            </div>
          </SkeletonContext>
        </Specimen>
      </Section>
    </>
  )
}
