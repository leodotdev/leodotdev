import { DocHeader, Section, Spec, Specimen } from "@/components/work/claude/ui"

// The quotes and figures are the ones in the Figma file's own specimens.

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
      <DocHeader group="Patterns" title="Proof">
        How customers speak on the site: pull quotes, inline quotes, proof
        cards, testimonials and the facts beside a customer story.
      </DocHeader>

      <Section
        title="Quotes"
        description="A pull quote sets a line in the display serif between two rules. An inline quote sits in running content, hanging off a rule on its left."
      >
        <Specimen className="flex flex-col gap-12 p-6 md:p-8">
          <figure className="cds-pullquote m-0">
            <blockquote>
              &ldquo;Claude has consistently demonstrated a remarkable capacity
              for reasoning and provides well-balanced answers&rdquo;
            </blockquote>
            <figcaption className="cds-attribution items-center">
              Aarash Heydari
              <span>Infrastructure engineer, Perplexity</span>
            </figcaption>
          </figure>

          <blockquote className="cds-quote-inline">
            <p>
              &ldquo;We&rsquo;re automating the mundane. 80% of Sales work today
              is manual, laborious, data work. In the era of AI, humans can
              focus on truly human, creative work, and we can leave the data
              work in the hands of AI.&rdquo;
            </p>
            <footer>Matthew Quan, Enterprise Growth Lead, Clay</footer>
          </blockquote>
        </Specimen>
        <Spec>
          Pull quote: Headline 2 (44/56) with 96px above and below and 48px to
          the name. Inline quote: serif 20/32, 32px from its rule, with a 15/24
          attribution.
        </Spec>
      </Section>

      <Section
        title="Proof cards and testimonial"
        description="A proof card pairs a customer's logo with either a short quote or one large figure; several sit side by side or in a carousel. The testimonial blurb gives one customer a full row. Customer names stand in for their logos here."
      >
        <Specimen className="flex flex-col gap-12 p-6 md:p-8">
          <div className="cds-proofs">
            <div className="cds-proof">
              <div className="cds-proof-logo">Replit</div>
              <div className="cds-proof-body">
                &ldquo;Claude&rsquo;s deep code understanding aligns perfectly
                with our mission to democratize programming.&rdquo;
                <small>Amjad Masad, CEO, Replit</small>
              </div>
            </div>
            <div className="cds-proof">
              <div className="cds-proof-logo">Augment Code</div>
              <div className="cds-proof-body">
                <span className="cds-proof-stat">85%</span>
                <small>reduction in debugging time using Claude</small>
              </div>
            </div>
          </div>

          <div className="cds-testimonial">
            <div>
              <div className="cds-proof-logo">Intercom</div>
              <div className="flex flex-col gap-8">
                <div className="cds-body-1">
                  &ldquo;With Claude, we&rsquo;re not just automating customer
                  service&mdash;we&rsquo;re elevating it to truly human quality.
                  This lets support teams think more strategically about
                  customer experience and what makes interactions genuinely
                  valuable.&rdquo;
                </div>
                <div className="cds-attribution">
                  Fergal Reid
                  <span>VP of AI at Intercom</span>
                </div>
              </div>
            </div>
          </div>
        </Specimen>
        <Spec>
          Proof card: 12/32/16/32 padding, a 64px logo row, 48px to the body; a
          quote is 15/24 and a figure is the serif at 72/80, weight 300.
          Testimonial: 32px above and below, quote in Body 1 (20/32).
        </Spec>
      </Section>

      <Section
        title="Customer story details"
        description="The facts about a customer and two or three results, shown beside their story."
      >
        <Specimen className="p-6 md:p-8">
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
        </Specimen>
        <Spec>
          Facts are 12/18 with a 123px label column; results are serif 25/32
          over a 12/18 line.
        </Spec>
      </Section>
    </>
  )
}
