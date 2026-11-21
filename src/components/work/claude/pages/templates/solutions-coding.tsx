import { Footer, Header } from "@/components/work/claude/pages/headers"
import { Playhead } from "@/components/work/claude/pages/media"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  ART,
  About,
  BRANDS,
  CenterHero,
  HeroBlock,
  LinkCards,
  LogoWall,
  MarginLogo,
  ProofRail,
  Stage,
  StartAndContact,
  Testimonial,
} from "@/components/work/claude/pages/templates/solutions-a"
import { Button, CarouselUi } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type {
  Brand,
  Quote,
} from "@/components/work/claude/pages/templates/solutions-a"

// The Solutions: Coding template (the "Solutions: Coding" frame on the Figma
// file's Templates page). Its hero is the centered one, over a film, three
// figures, and the logo wall; under it come two ways to write code with
// Claude, what developers say, the artifact, a testimonial with a marginalia
// card beside it, and a row of link cards. Its words are the file's.

const WALL: Array<Brand> = [
  BRANDS.augmentCode,
  BRANDS.gitlab,
  BRANDS.vercel,
  BRANDS.githubCopilot,
  BRANDS.cursor,
  BRANDS.sourcegraph,
  BRANDS.replit,
  BRANDS.cognition,
]

const STATS = [
  ["74.5%", "Claude Opus 4.1 leads on SWE-bench Verified"],
  ["Hours", "Length of dev tasks completed in one pass with Claude Code"],
  ["95%", "Reduction in time to run tests for enterprise software customer"],
] as const

const QUOTES: Array<Quote> = [
  {
    quote:
      "Just taught my fiancée how to use claude to write code that automates dumb tasks that have been making her work life miserable for months. She went from being downtrodden and skeptical to dancing around the room in about 15 minutes. END USER PROGRAMMING IS NOW.",
    by: "Kasey, @kaseyklimes",
  },
  {
    quote:
      "Claude Sonnet 3.5 is utterly cracked for coding. This thing refactors like a monster. Not a single mistake, total understanding of every detail and intricacy. Just teleported my code forward in time, so many bloating functions cleaned up. It optimizes code so well. This is crazy.",
    by: "Nicolas Martel, @ryunuck",
  },
  {
    quote:
      "Some interesting data on how Anthropic's Sonnet 3.5 seems to remain by far the most capable LLM for coding. Every single leading GenAI-powered IDE (Cursor, Windsurf, Zed, Copilot etc) favor this model. A good question: how is Claude so much better for code generation?",
    by: "Gergely Orosz, @GergelyOrosz",
  },
]

const PLATFORM = [
  "Customize how Claude fits into your solution with our API",
  "Improve and evaluate your prompts in the Workbench",
  "Build frontier intelligence into your applications",
  "Turn anyone into an AI developer with rich docs and tooling",
]

const CARDS = [
  ["Learn how to use Claude and our API", "Developer doc"],
  ["Start building with our customer support quickstart", "Quickstart"],
  [
    "See how other companies are powering customer support agents with Claude",
    "Case study",
  ],
] as const

/**
 * The page. Its sections are Ivory and White by turns, over the Dark 3
 * footer; on the site's dark mode they are Dark 3 and Dark 2.
 */
function SolutionsCoding() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Solutions", "Coding"]} />
        <HeroBlock>
          <CenterHero
            pictogram={`${ART}/object-bulb.svg`}
            title="The best AI for developers"
            lead="Claude is the not-so-secret advantage for world class engineering teams and software companies."
          >
            <StartAndContact />
          </CenterHero>
          <div className="cds-sola-content">
            <div className="cds-video cds-sola-film">
              <Playhead />
            </div>
            <div className="cds-sola-stats">
              {STATS.map(([figure, note]) => (
                <div key={figure}>
                  <b>{figure}</b>
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
          <LogoWall brands={WALL} per={4} rule={false} />
        </HeroBlock>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Write code with Claude"
          subtitle="Get complete insight into your codebase and accelerate exceptional software."
          pictogram={`${ART}/object-code-terminal.svg`}
          actions={null}
        />
        <div className="cds-sola-pair">
          <div>
            <Stage tone="plum" />
            <div className="cds-sola-copy">
              <h4>Scale coding impact, not overhead</h4>
              <p>
                Write, test, and debug complex software with Claude, analyze
                codebases with expert-level reasoning via GitHub integration,
                delegate development tasks through computer use, and fast-track
                smarter engineering decisions in a shared workspace.
              </p>
            </div>
          </div>
          <div>
            {/* The picture the file has here: Claude Code in a terminal. */}
            <div className="cds-sola-tile" aria-hidden />
            <div className="cds-sola-copy">
              <h4>Explore agentic coding with Claude Code</h4>
              <p>
                Claude Code embeds Claude Opus 4.1 right in your terminal, with
                deep codebase awareness and the ability to edit files and run
                commands directly in your environment.
              </p>
              <Button size="small" variant="tertiary">
                Learn more
              </Button>
            </div>
          </div>
        </div>
        <div className="cds-sola-sub">
          <Header
            size="p3"
            title="Developers love Claude"
            subtitle={null}
            pictogram={null}
            actions={null}
          />
          <ProofRail quotes={QUOTES} />
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Build products with the Claude Developer Platform"
          subtitle="Integrate Claude’s powerful AI capabilities into your apps and deliver production-grade solutions faster."
          pictogram={`${ART}/hand-shapes.svg`}
          actions={null}
        />
        <div className="cds-sola-artifact">
          <Stage tone="olive" />
          <About title="Deliver amazing AI experiences" items={PLATFORM} />
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p3"
          title="See why companies choose Claude"
          subtitle={null}
          pictogram={null}
          actions={null}
        />
        <div className="cds-sola-aside">
          {/* The file's carousel holds this one testimonial, so its controls
              have nowhere to go. */}
          <div>
            <Testimonial
              brand={BRANDS.windsurf}
              quote="In our benchmark for junior developers, Claude Opus 4.1 shows roughly the same performance leap as the jump from Sonnet 3.7 to Sonnet 4. Opus 4.1 delivers a one standard deviation improvement over Opus 4. Very excited for our users to feel this difference."
              name="Jeff Wang"
              role="CEO of Windsurf"
            />
            <CarouselUi count={1} current={0} onStep={() => {}} />
          </div>
          <div className="cds-margin">
            <div className="cds-margin-card">
              <div className="cds-margin-head">Featured customers</div>
              <div>
                <div className="cds-margin-stat">
                  <MarginLogo brand={BRANDS.replit} />
                  <b>100K+</b>
                  Applications deployed on Google Cloud Run
                </div>
                <div className="cds-margin-stat">
                  <MarginLogo brand={BRANDS.block} />
                  <b>75%</b>
                  Increase in complex problem-solving sessions for Max users
                </div>
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Get the technical rundown"
          subtitle={null}
          pictogram={`${ART}/node-line-chart.svg`}
          actions={null}
        />
        <LinkCards cards={CARDS} />
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <Footer />
      </TemplateBlock>
    </>
  )
}

// The page's own things for the demo cursor, wide and again at a phone's
// width. The scrolling and resizing around them are the template figure's
// (`around` in template.tsx), which also leaves the site's header alone.
const SOLUTIONS_CODING_DEMO: Array<DemoStep> = [
  { on: ".cds-sola-hero .cds-btn", rest: 900 },
  { on: ".cds-sola-hero .cds-playhead", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-sola-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function SolutionsCodingDoc() {
  return (
    <Section>
      <TemplateFigure steps={SOLUTIONS_CODING_DEMO}>
        <SolutionsCoding />
      </TemplateFigure>
    </Section>
  )
}
