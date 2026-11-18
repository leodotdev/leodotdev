import { Section, Specimen } from "@/components/work/claude/ui"

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
      <Section
        title="Quotes"
        description="A pull quote between two rules, and an inline quote hanging off one."
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
      </Section>

      <Section
        title="Proof Cards & Testimonial"
        description="A customer's logo with a short quote or one large figure. Names stand in for logos here."
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
      </Section>

      <Section
        title="Customer Story Details"
        description="The facts and results shown beside a customer's story."
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
      </Section>
    </>
  )
}
