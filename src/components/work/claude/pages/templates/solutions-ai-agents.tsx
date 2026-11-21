import { TbCode, TbHandStop, TbLock, TbPencil } from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  ART,
  About,
  Actions,
  BRANDS,
  HeroBlock,
  LinkCards,
  LogoWall,
  MarginLogo,
  Stage,
  StartAndContact,
  Testimonial,
  useRail,
} from "@/components/work/claude/pages/templates/solutions-a"
import { Button, CarouselUi } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type { Brand } from "@/components/work/claude/pages/templates/solutions-a"

// The Solutions: AI Agents template (the "Solutions: AI agents" frame on the
// Figma file's Templates page). Its hero is the staggered one; under it come
// three features with marginalia in the page's margins, the artifact, two
// testimonials, and a row of link cards. Its words are the file's.

const WALL: Array<Brand> = [
  BRANDS.factory,
  BRANDS.skTelecom,
  BRANDS.windsurf,
  BRANDS.amazonQ,
  BRANDS.githubCopilot,
  BRANDS.replit,
  BRANDS.augmentCode,
  BRANDS.bito,
  BRANDS.intercom,
  BRANDS.cursor,
]

const FEATURES = [
  [
    TbCode,
    "Best model for AI agents",
    "Claude outperforms other models in AI agent scenarios from customer support to coding.",
  ],
  [
    TbHandStop,
    "AI agents with a human touch",
    "Claude’s conversational style leads to true collaboration between AI agents and users.",
  ],
  [
    TbLock,
    "AI that protects your brand",
    "Claude ranks highest on honesty, jailbreak resistance, and brand safety.",
  ],
] as const

const BUILD = [
  "Build agents and workflows with the Anthropic API",
  "Test and refine prompts in the Workbench",
  "Build frontier capabilities into your agents",
  "Empower any developer to build AI agents",
]

const CARDS = [
  ["See how other companies are building AI agents with Claude", "Case study"],
  ["Building effective agents", "Engineering at Anthropic"],
  ["Learn how to get started with Anthropic API and Claude", "Developer doc"],
] as const

/**
 * The features, with a marginalia card in the margin at each side: the one
 * on the right level with the list's top, the one on the left further down.
 * On a phone the cards leave the margins for a row under the list, which
 * scrolls sideways over the carousel's controls.
 */
function Features() {
  const { row, stops, current, step } = useRail()
  return (
    <div className="cds-sola-gutters">
      <div className="cds-sola-list">
        {FEATURES.map(([Icon, title, text]) => (
          <div key={title} className="cds-feature-inline">
            <div>
              <h4>
                <Icon aria-hidden />
                {title}
              </h4>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cds-sola-gutter-cards">
        <div ref={row}>
          <div className="cds-margin" data-side="left">
            <div className="cds-margin-card">
              <div className="cds-margin-head">Building effective agents</div>
              <div className="cds-margin-media" data-type="pictogram">
                <img
                  className="cds-art"
                  src={`${ART}/object-token.svg`}
                  alt=""
                />
              </div>
              <div>
                <Button size="small" variant="tertiary" icon="none">
                  Read more
                </Button>
              </div>
            </div>
          </div>
          <div className="cds-margin" data-side="right">
            <div className="cds-margin-card">
              <div className="cds-margin-stat">
                <MarginLogo brand={BRANDS.factory} />
                <b>3x</b>
                Reduction in code churn
              </div>
            </div>
          </div>
        </div>
        <CarouselUi count={stops} current={current} onStep={step} />
      </div>
    </div>
  )
}

/**
 * The page. Its sections are Ivory and White by turns, over the Dark 3
 * footer; on the site's dark mode they are Dark 3 and Dark 2.
 */
function SolutionsAiAgents() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Solutions", "AI agents"]} />
        <HeroBlock>
          <div className="cds-hero cds-hero-stagger">
            <h3>
              <span>Make AI agents</span>
              <span>your unfair advantage</span>
            </h3>
            <div>
              <img src={`${ART}/hand-node-web.svg`} alt="" />
              <div className="cds-hero-copy">
                <p className="cds-hero-lead">
                  With Claude, you can build AI agents that plan, act, and
                  collaborate more effectively.
                </p>
                <Actions>
                  <StartAndContact />
                </Actions>
              </div>
            </div>
          </div>
          <LogoWall brands={WALL} />
        </HeroBlock>
      </TemplateBlock>

      <TemplateSection
        theme={["white", "dark-2"]}
        className="cds-sola-phone-left"
      >
        <Header
          size="p1"
          title="Powerful, collaborative, and safe AI agents"
          subtitle="Opus 4.1, our newest model, delivers superior reasoning, human-quality responses, and brand safety."
          pictogram={`${ART}/hand-link.svg`}
          actions={null}
        />
        <Features />
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Build AI agents with the Anthropic API"
          subtitle="Integrate Claude’s powerful AI capabilities into your apps and deliver production-grade agents faster."
          pictogram={`${ART}/object-code-check.svg`}
          actions={null}
        />
        <div className="cds-sola-artifact">
          {/* The file sets this note in the margin beside the artifact. */}
          <div className="cds-sola-note">
            <small>
              <TbPencil aria-hidden />
              Note
            </small>
            Interact with the data—hover and toggle views to uncover patterns
          </div>
          <Stage tone="plum" />
          <About title="Deliver more effective AI agents" items={BUILD} small />
        </div>
        <div className="cds-sola-promo">
          {/* The picture the file has here: Claude Code in a terminal. */}
          <div className="cds-sola-tile" aria-hidden />
          <div>
            <h4>Collaborate with Claude on coding tasks</h4>
            <p>
              Claude Code is an agentic tool where developers work with Claude
              directly from their terminal—delegating tasks from code migrations
              to bug fixes.
            </p>
            <Button variant="secondary" icon="none">
              Learn more
            </Button>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="See why industry leaders choose Claude"
          subtitle={null}
          pictogram={`${ART}/hand-eye.svg`}
          actions={
            <>
              <Button size="large" icon="none">
                Start building
              </Button>
              <Button size="large" variant="secondary" icon="none">
                See customer stories
              </Button>
            </>
          }
        />
        <div className="cds-sola-quotes">
          <Testimonial
            brand={BRANDS.intercom}
            quote="With Claude, we’re not just automating customer service—we’re elevating it to truly human quality. This lets support teams think more strategically about customer experience and what makes interactions genuinely valuable."
            name="Fergal Reid"
            role="VP of AI"
          />
          <Testimonial
            brand={BRANDS.factory}
            quote="The Claude model family is best-in-class for agentic engineering tasks. Claude outperformed comparable models by a fair margin across a variety of our internally-developed benchmarks for software engineering."
            name="Eno Reyes"
            role="CTO and Co-Founder"
          />
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Everything you need to succeed with Claude"
          subtitle={null}
          pictogram={`${ART}/node-line-chart.svg`}
          actions={
            <Button size="large" icon="none">
              Start building
            </Button>
          }
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
const SOLUTIONS_AI_AGENTS_DEMO: Array<DemoStep> = [
  { on: ".cds-sola-hero .cds-btn", rest: 900 },
  { on: ".cds-sola-hero .cds-btn", nth: 1, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-sola-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function SolutionsAiAgentsDoc() {
  return (
    <Section>
      <TemplateFigure steps={SOLUTIONS_AI_AGENTS_DEMO}>
        <SolutionsAiAgents />
      </TemplateFigure>
    </Section>
  )
}
