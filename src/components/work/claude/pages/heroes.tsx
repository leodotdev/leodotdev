import { TbChartDots3, TbDatabase, TbStack2 } from "react-icons/tb"
import { Button } from "@/components/work/claude/specimens"
import { DocHeader, Section, Spec, Specimen } from "@/components/work/claude/ui"

// The hero's own illustration, exported from the Figma file as an SVG.
const ABACUS = "/work/claude/illustrations/hand-abacus.svg"
const LEAD =
  "Claude helps universities maintain academic integrity while incorporating AI tools in education, with Anthropic’s commitment to safety."
const FEATURE =
  "Connect essential data sources like S&P Global, Daloopa, and internal systems in one interface. Every data point links directly to its source, for instant verification."

function Copy() {
  return (
    <div className="cds-hero-copy">
      <p className="cds-hero-lead m-0">{LEAD}</p>
      <Button size="large">Speak with our Education team</Button>
    </div>
  )
}

const Illustration = () => (
  <img src={ABACUS} alt="A hand moving the beads of an abacus" />
)

export function HeroesDoc() {
  return (
    <>
      <DocHeader group="Patterns" title="Heroes and features">
        How a page opens, and how it lists what a product does. The heroes
        resize with their box, so narrowing the window shows the smaller
        breakpoints.
      </DocHeader>

      <Section
        title="Page heroes"
        description="Three layouts for the same content: Stagger splits the headline left and right over the illustration, 2 Columns sets copy beside it, and 1 Column centres everything."
      >
        <Specimen>
          <div className="cds-hero cds-hero-stagger">
            <h3>
              <span>Navigating AI in</span>
              <span>education together</span>
            </h3>
            <div>
              <Illustration />
              <Copy />
            </div>
          </div>
        </Specimen>
        <Specimen>
          <div className="cds-hero">
            <div className="cds-hero-columns">
              <div className="cds-hero-copy">
                <h3>Navigating AI in education together</h3>
                <Copy />
              </div>
              <Illustration />
            </div>
          </div>
        </Specimen>
        <Specimen>
          <div className="cds-hero">
            <div className="cds-hero-center">
              <h3>Navigating AI in education together</h3>
              <div className="cds-hero-copy !items-center">
                <p className="cds-hero-lead m-0">{LEAD}</p>
                <Button size="large">Speak with our Education team</Button>
              </div>
              <Illustration />
            </div>
          </div>
        </Specimen>
        <Spec>
          At the 1920px desktop frame: the Stagger headline is the serif at
          126/110, Regular; the other two use Display 1 (72/80, Medium). The
          lead is the sans at 23/36 and the illustration is 459px or 591px.
        </Spec>
      </Section>

      <Section
        title="Feature highlights"
        description="A product showcase component that emphasizes key functionality through an icon, a serif title and a short paragraph. Features stand in ruled columns with the icon above, or run across the page with the icon beside the title."
      >
        <Specimen className="flex flex-col gap-10 p-6 md:p-8">
          <div className="cds-features">
            <div className="cds-feature" data-icon="pictogram">
              <TbStack2 aria-hidden />
              <div>
                <div className="cds-card-title">Unified intelligence</div>
                <p>{FEATURE}</p>
              </div>
            </div>
            <div className="cds-feature">
              <TbDatabase aria-hidden />
              <div>
                <div className="cds-card-title">Unified intelligence</div>
                <p>{FEATURE}</p>
              </div>
            </div>
            <div className="cds-feature">
              <TbChartDots3 aria-hidden />
              <div>
                <div className="cds-card-title">Unified intelligence</div>
                <p>{FEATURE}</p>
              </div>
            </div>
          </div>
          <div className="cds-feature-inline">
            <div>
              <h4>
                <TbDatabase aria-hidden />
                Unified intelligence
              </h4>
              <p>{FEATURE}</p>
            </div>
          </div>
        </Specimen>
        <Spec>
          Icon above: 12/32/24/32 padding, a 64px pictogram or 32px icon, 48px
          to a 19/24 title, 15/24 text. Icon inline: 32px above and below, a
          25/32 title, 17/28 text.
        </Spec>
      </Section>
    </>
  )
}
