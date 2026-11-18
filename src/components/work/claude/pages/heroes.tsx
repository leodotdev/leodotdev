import { TbChartDots3, TbDatabase, TbStack2 } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

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

// What the demo cursor tries on a hero: its one button, with a rest on the
// illustration between presses.
const HERO_DEMO: Array<DemoStep> = [
  { on: ".cds-btn", click: true, rest: 800 },
  { on: "img", rest: 2200 },
]

export function HeroesDoc() {
  return (
    <>
      <Section>
        <Specimen>
          <DemoCursor steps={HERO_DEMO}>
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
          </DemoCursor>
        </Specimen>
        <Specimen>
          <DemoCursor steps={HERO_DEMO}>
            <div className="cds-hero">
              <div className="cds-hero-columns">
                <div className="cds-hero-copy">
                  <h3>Navigating AI in education together</h3>
                  <Copy />
                </div>
                <Illustration />
              </div>
            </div>
          </DemoCursor>
        </Specimen>
        <Specimen>
          <DemoCursor steps={HERO_DEMO}>
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
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

export function FeaturesDoc() {
  return (
    <>
      <Section>
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
      </Section>
    </>
  )
}
