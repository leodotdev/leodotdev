import { TbChartDots3, TbDatabase, TbStack2 } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import {
  SkeletonCopy,
  SkeletonHeader,
  SkeletonImage,
  SkeletonPage,
} from "@/components/work/claude/skeleton"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type { FigureNote } from "@/components/work/claude/figure-notes"

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
// illustration, and then the page at a tablet's width and a phone's, where
// the hero stacks, and back. Each hero has notes of its own: its name on
// the file's Page Heroes boards and what those boards draw (`first` once the
// button is pressed, `narrow` once the page is a phone's width).
const heroDemo = (first: FigureNote, narrow?: FigureNote): Array<DemoStep> => [
  { on: ".cds-btn", click: true, rest: 800, note: first },
  { on: "img", rest: 1400 },
  { on: ".cds-resize-grip", nth: 1, drag: 700 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 390,
    ...(narrow && { note: narrow }),
  },
  { on: ".cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const STAGGER_DEMO = heroDemo(
  {
    kind: "concept",
    title: "Hero: Stagger",
    text: "The file’s name for this hero. Its headline is two lines, each placed on its own.",
    on: "h3",
  },
  {
    kind: "concept",
    title: "Four widths",
    text: "The file draws it at each: Desktop, Laptop, Tablet, and Mobile.",
    on: ".cds-hero",
  }
)

const COLUMNS_DEMO = heroDemo({
  kind: "concept",
  title: "Hero: 2 Columns",
  text: "Headline, copy, and button in one column; the illustration in the other.",
  on: ".cds-hero-columns",
})

const CENTER_DEMO = heroDemo({
  kind: "concept",
  title: "Hero: 1 Column",
  text: "Drawn three times in the file: over a wide picture, a smaller one, and none.",
  on: ".cds-hero-center",
})

/**
 * A hero where it is used: at the top of a page, under the site's header.
 * The page is the figure, edge to edge, and narrows with it; everything on
 * it but the hero is a skeleton. The figure is one height, a window's: the
 * page under the hero runs off its bottom.
 */
function HeroFigure({
  steps,
  children,
}: {
  steps: Array<DemoStep>
  children: React.ReactNode
}) {
  return (
    <Specimen figure>
      {/* No padding: the page fills the figure. */}
      <DemoCursor steps={steps}>
        <Resizable
          label="Page width"
          min={390}
          bleed
          sizes={[["Desktop"], ["Tablet", 719], ["Mobile", 560]]}
          className="min-h-[840px] sm:h-[840px]"
        >
          <SkeletonPage>{children}</SkeletonPage>
        </Resizable>
      </DemoCursor>
    </Specimen>
  )
}

export function HeroesDoc() {
  return (
    <>
      <Section>
        <HeroFigure steps={STAGGER_DEMO}>
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
        </HeroFigure>
        <HeroFigure steps={COLUMNS_DEMO}>
          <div className="cds-hero">
            <div className="cds-hero-columns">
              <div className="cds-hero-copy">
                <h3>Navigating AI in education together</h3>
                <Copy />
              </div>
              <Illustration />
            </div>
          </div>
        </HeroFigure>
        <HeroFigure steps={CENTER_DEMO}>
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
        </HeroFigure>
      </Section>
    </>
  )
}

export function FeaturesDoc() {
  return (
    <>
      <Section caption="One feature had to read long or short, with its icon above or inline.">
        <Specimen figure>
          {/* A section of a page, from further down it: a skeleton of the
              section's opening, the features for real in the page's
              margins, and the next section starting under them. */}
          <div>
            <Resizable
              label="Page width"
              min={390}
              bleed
              sizes={[["Desktop"], ["Mobile", 624]]}
              className="min-h-[900px] sm:h-[900px]"
            >
              <SkeletonPage
                nav={false}
                rest={
                  <>
                    <SkeletonHeader line />
                    <SkeletonImage />
                  </>
                }
              >
                {/* As on a Solutions page: the section opens with its
                    headline at the left and its text at the right, over
                    the features. */}
                <div className="cds-skel-slot flex flex-col gap-10">
                  <SkeletonCopy />
                  <div className="cds-features">
                    <div className="cds-feature" data-icon="pictogram">
                      <TbStack2 aria-hidden />
                      <div>
                        <div className="cds-card-title">
                          Unified intelligence
                        </div>
                        <p>{FEATURE}</p>
                      </div>
                    </div>
                    <div className="cds-feature">
                      <TbDatabase aria-hidden />
                      <div>
                        <div className="cds-card-title">
                          Unified intelligence
                        </div>
                        <p>{FEATURE}</p>
                      </div>
                    </div>
                    <div className="cds-feature">
                      <TbChartDots3 aria-hidden />
                      <div>
                        <div className="cds-card-title">
                          Unified intelligence
                        </div>
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
                </div>
              </SkeletonPage>
            </Resizable>
          </div>
        </Specimen>
      </Section>
    </>
  )
}
