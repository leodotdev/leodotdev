import { TbMessageDots, TbSparkles, TbStopwatch } from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  ART,
  About,
  BRANDS,
  CenterHero,
  HeroBlock,
  LinkCards,
  LogoWall,
  ProofRail,
  Stage,
  StartAndContact,
} from "@/components/work/claude/pages/templates/solutions-a"
import { Button } from "@/components/work/claude/specimens"
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

// The Solutions: Customer Support template (the "Solutions: Customer
// Support" frame on the Figma file's Templates page). Its hero is the
// centered one, over the logo wall; under it come three features, the
// artifact, what customers say, and a row of link cards. Its words are the
// file's.

const WALL: Array<Brand> = [
  BRANDS.assembled,
  BRANDS.usf,
  BRANDS.coinbase,
  BRANDS.asapp,
  BRANDS.decagon,
  BRANDS.lyft,
  BRANDS.doordash,
  BRANDS.skTelecom,
  BRANDS.intuit,
  BRANDS.kodif,
]

const FEATURES = [
  [TbSparkles, "Help customers faster with intelligent conversation routing"],
  [
    TbMessageDots,
    "Deliver personalized responses in any language, across any channel",
  ],
  [
    TbStopwatch,
    "Cut resolution times and support costs while increasing customer satisfaction",
  ],
] as const

const PLATFORM = [
  "Build faster with pre-built cookbooks and guides",
  "Improve and evaluate your prompts with the Workbench",
  "Optimize for intelligence and cost with prompt caching",
]

const QUOTES: Array<Quote> = [
  {
    brand: BRANDS.intercom,
    quote:
      "With Claude, we’re not just automating customer service—we’re elevating it to truly human quality. This lets support teams think more strategically about customer experience and what makes interactions genuinely valuable.",
    by: "Fergal Reid, VP of AI",
  },
  {
    brand: BRANDS.intuit,
    quote:
      "Anthropic provides exceptional support, giving us direct access to expert researchers who help us get the most out of Claude. Our close partnership has been instrumental in pushing output quality for our customers.",
    by: "Nhung Ho, Vice President of AI",
  },
  {
    brand: BRANDS.assembled,
    quote:
      "Claude performed so well that we’re reevaluating our entire model infrastructure. The reasoning capabilities are significantly better, and the conversational tone feels much more natural even out of the box.",
    by: "John Wang, Co-founder",
  },
]

const CARDS = [
  ["Learn how to get started with our API", "Developer doc"],
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
function SolutionsCustomerSupport() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Solutions", "Customer support"]} />
        <HeroBlock phone="left">
          <CenterHero
            pictogram={`${ART}/hand-nodes.svg`}
            title="Build AI support agents with a more human touch"
            lead="With enhanced reasoning and a human-like tone, Claude uses your internal knowledge to take relevant action across systems and tools."
          >
            <StartAndContact />
          </CenterHero>
          <LogoWall brands={WALL} />
        </HeroBlock>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p2"
          title="Transform support experiences with Claude"
          subtitle="Claude listens carefully, follows instructions precisely, and thinks through complex problems."
          pictogram={`${ART}/hand-link.svg`}
          actions={null}
        />
        <div className="cds-features">
          {FEATURES.map(([Icon, title]) => (
            <div key={title} className="cds-feature">
              <Icon aria-hidden />
              <div>
                <div className="cds-card-title">{title}</div>
              </div>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p2"
          title="Get to production faster with the Claude Developer Platform"
          subtitle="One platform to build, test, and iterate on your AI deployment."
          pictogram={`${ART}/object-code-terminal.svg`}
          actions={null}
        />
        <div className="cds-sola-artifact">
          <Stage tone="oat" />
          <About title="Built for developers" items={PLATFORM} />
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p3"
          title="See why customer experience teams choose Claude"
          subtitle={null}
          pictogram={`${ART}/object-dialogue.svg`}
          actions={null}
        />
        <ProofRail quotes={QUOTES} />
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Everything you need to succeed with Claude"
          subtitle="See how Claude transforms workflows, from due diligence and research to financial analysis."
          pictogram={`${ART}/node-line-chart.svg`}
          actions={
            <Button size="large" icon="none">
              Contact sales
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
const SOLUTIONS_CUSTOMER_SUPPORT_DEMO: Array<DemoStep> = [
  { on: ".cds-sola-hero .cds-btn", rest: 900 },
  { on: ".cds-sola-hero .cds-btn", nth: 1, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-sola-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function SolutionsCustomerSupportDoc() {
  return (
    <Section>
      <TemplateFigure steps={SOLUTIONS_CUSTOMER_SUPPORT_DEMO}>
        <SolutionsCustomerSupport />
      </TemplateFigure>
    </Section>
  )
}
