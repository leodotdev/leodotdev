import { useRef } from "react"
import { TbArrowLeft, TbArrowRight } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { Button } from "@/components/work/anthropic/specimens"
import { ArticleContext } from "./article"
import { two, useSnapRow } from "./scroll"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Quote Card and Quote Carousel (the Figma file's Organisms page, "Article-
// related organisms"). The quote, name, and title are the file's own sample;
// the Replit logo is its "Proof: Logo" (public/work/anthropic/organisms-media/).

export type Quote = {
  quote: string
  name: string
  title: string
  /** The customer's logo: its file, name, and width at the logo's height. */
  logo?: [src: string, name: string, width: number]
}

export const SAMPLE_QUOTE: Quote = {
  quote:
    "Replit reports improved precision and dramatic advancements for complex changes across multiple files.",
  name: "Bradley Silicani",
  title: "COO, Anrok",
  logo: ["/work/anthropic/organisms-media/replit.svg", "Replit", 83],
}

/**
 * A quote in a card: the customer's logo over a rule, the quote in serif,
 * and who said it. It takes its colors from the theme it sits in; the logo
 * is drawn dark on light and turns over on the dark themes (`ads-art`).
 */
export function QuoteCard({ quote = SAMPLE_QUOTE }: { quote?: Quote }) {
  return (
    <figure className="ads-quote-card">
      {quote.logo && (
        <div className="ads-quote-card-logo">
          <img
            className="ads-art"
            src={quote.logo[0]}
            alt={quote.logo[1]}
            width={quote.logo[2]}
            height={21}
            draggable={false}
          />
        </div>
      )}
      <blockquote className="ads-body-3-serif">&ldquo;{quote.quote}</blockquote>
      <figcaption className="ads-caption-2">
        {quote.name}
        <br />
        {quote.title}
      </figcaption>
    </figure>
  )
}

/**
 * The file's "Pagination": a small arrow button each side of a count in
 * mono ("01 / 12").
 */
export function Pagination({
  current,
  count,
  onStep,
}: {
  current: number
  count: number
  onStep: (by: 1 | -1) => void
}) {
  return (
    <div className="ads-quote-pagination">
      <Button
        variant="tertiary"
        size="small"
        icon="only"
        glyph={<TbArrowLeft aria-hidden />}
        aria-label="Previous"
        onClick={() => onStep(-1)}
      />
      <span className="ads-caption-2-mono" aria-live="polite">
        {two(current + 1)} / {two(count)}
      </span>
      <Button
        variant="tertiary"
        size="small"
        icon="only"
        glyph={<TbArrowRight aria-hidden />}
        aria-label="Next"
        onClick={() => onStep(1)}
      />
    </div>
  )
}

// Twelve cards, as the file's count has it.
const QUOTES = Array.from({ length: 12 }, () => SAMPLE_QUOTE)

/**
 * Quote cards in a row (the file's two variants, Device=Desktop and
 * Device=Mobile): on desktop two show side by side; on a phone one, with the
 * next peeking in. The row scrolls sideways and snaps to a card, can be
 * dragged, and the arrows go a card at a time and come round again. The
 * count is of the card leading the row.
 */
export function QuoteCarousel({ quotes = QUOTES }: { quotes?: Array<Quote> }) {
  const row = useRef<HTMLDivElement>(null)
  const { current, step } = useSnapRow(row)
  return (
    <div className="ads-quote-carousel">
      <div ref={row} className="ads-quote-row">
        {quotes.map((quote, i) => (
          <QuoteCard key={i} quote={quote} />
        ))}
      </div>
      <Pagination current={current} count={quotes.length} onStep={step} />
    </div>
  )
}

// What the demo cursor does on the carousel: it goes on two cards, narrows
// the figure to a phone's width, where one card shows and the next peeks
// in, goes on and back there, and lets the figure out again.
const next = '.ads-quote-pagination [aria-label="Next"]'
const CAROUSEL_DEMO: Array<DemoStep> = [
  { on: next, click: true, rest: 800 },
  { on: next, click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: next, click: true, rest: 800 },
  {
    on: '.ads-quote-pagination [aria-label="Previous"]',
    click: true,
    rest: 900,
  },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function QuotesDoc() {
  return (
    <>
      <Section
        title="Quote Card"
        caption="A logo over a rule, the quote in serif, and who said it. The file sets the card on four of the five themes."
      >
        <Specimen figure className="flex justify-center p-8 md:p-12">
          <div className="w-full max-w-[286px]">
            <QuoteCard />
          </div>
        </Specimen>
      </Section>

      <Section
        title="Quote Carousel"
        caption="Quote cards in a row over arrows and a count, in two variants: Desktop shows two cards, Mobile one with the next peeking in."
      >
        <Specimen figure>
          <DemoCursor steps={CAROUSEL_DEMO}>
            <Resizable
              label="Carousel width"
              min={390}
              sizes={[["Desktop"], ["Mobile", 600]]}
              className="flex min-h-[760px] flex-col justify-center sm:h-[760px]"
            >
              <ArticleContext>
                <QuoteCarousel />
              </ArticleContext>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
