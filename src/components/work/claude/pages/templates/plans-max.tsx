import {
  TbBriefcase,
  TbCircleCheckFilled,
  TbGitPullRequestClosed,
  TbUsers,
} from "react-icons/tb"
import { PromptCard } from "@/components/work/claude/pages/artifacts"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import {
  ART,
  PdfCard,
  PlanArtifact,
  PlanHero,
  PlanList,
  PlanMargins,
  SAMPLE_PROMPT,
} from "@/components/work/claude/pages/templates/plans"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Max plan's page (the "Plans: Max Plan" frame on the Figma file's
// Templates page), built from the organisms the other tabs document and the
// pieces the three plan pages share (plans.tsx). Its words are the file's.
// What is its own: the banner under the hero and the two pricing cards.

const FEATURES = [
  [
    TbGitPullRequestClosed,
    "Tackle complex projects",
    "Handle sophisticated, multi-dimensional challenges—the kind that require a true thinking partner.",
  ],
  [
    TbBriefcase,
    "Do real work well",
    "Launch features, complete analyses, publish content, and more with Claude.",
  ],
  [
    TbUsers,
    "Claude works alongside you",
    "Claude shows its thinking, seeks clarification, and collaborates thoughtfully.",
  ],
] as const

// A link in the file's copy: for show, like every link on the page.
const link = (text: string) => (
  <a href="#" className="cds-link">
    {text}
  </a>
)

const REASONS = [
  [
    TbCircleCheckFilled,
    "Protected company data",
    "With up to 20x more usage per session, you can finally pursue every thread, explore every possibility, and complete ambitious projects.",
  ],
  [
    TbCircleCheckFilled,
    "More room for Claude’s best features",
    <>
      Run multiple {link("research")} sessions daily. Build complex{" "}
      {link("artifacts")} iteratively. Pull context from all your integrated{" "}
      {link("tools")} freely.
    </>,
  ],
  [
    TbCircleCheckFilled,
    "Access to the latest and greatest",
    "New features and models often launch on Max first. You’ll get Claude Opus 4.1, Sonnet 4, and other updates before they expand to other plans.",
  ],
] as const

const PLANS = [
  [
    "Max 5x",
    "node-sprout",
    "$100",
    "Great for frequent users who work with Claude on a variety of tasks, with 5x more usage per session than Pro.",
  ],
  [
    "Max 20x",
    "node-tree",
    "$200",
    "Perfect for daily users who collaborate often with Claude for most tasks with, 20x more usage per session than Pro.",
  ],
] as const

/**
 * The page. Its sections are White and Ivory by turns under an Ivory hero,
 * over the Dark 3 footer; on the site's dark mode they are Dark 2 and Dark 3.
 */
function PlansMax() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Plans", "Max"]} />
        <PlanHero
          title="The Max plan"
          lead="The Max plan combines Claude desktop and mobile apps and Claude Code in one subscription, with up to 20x more usage per session than Pro. That’s a lot of deep work potential."
          art="node-plant-wide"
        >
          <Button size="large" icon="none">
            Get started
          </Button>
          <Button size="large" variant="secondary" icon="none">
            See pricing
          </Button>
        </PlanHero>
        <div className="cds-plan-hero-more">
          <div className="cds-plan-banner">
            <h4>
              People are using Claude to{" "}
              <span>develop Amazon ad testing strategies</span>
            </h4>
            <div className="cds-plan-downloads">
              <span>Download the desktop app:</span>
              {["macOS", "Windows", "Windows (arm64)"].map((name) => (
                <Button key={name} variant="tertiary" icon="none">
                  {name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p2"
          title="A thought partner for your most ambitious work"
          subtitle="Enable every team to spark new ideas, achieve more, and collaborate better."
          pictogram={`${ART}/hand-shapes.svg`}
          actions={null}
        />
        <div className="cds-features cds-plan-features">
          {FEATURES.map(([Icon, title, text]) => (
            <div key={title} className="cds-feature">
              <Icon aria-hidden />
              <div>
                <div className="cds-card-title">{title}</div>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="One plan for all your work"
          subtitle={null}
          pictogram={`${ART}/hand-link.svg`}
          actions={null}
        />
        <PlanArtifact
          tabs={["Founders", "Developers", "Marketers", "Sales", "Analytics"]}
          tone="plum"
          note
        >
          <p>
            Use Claude apps for strategic planning, the prototype with Claude
            Code—even without coding experience.
          </p>
        </PlanArtifact>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p2"
          title="Why people choose Max"
          subtitle="Some use it all for Claude apps—writing, research, analysis. Others live in Claude Code. Most discover they need both."
          pictogram={`${ART}/node-magnifier.svg`}
          actions={null}
        />
        <PlanMargins
          left={[<PdfCard />]}
          right={[
            <PromptCard>
              I&rsquo;m trying to position my product in a crowded market
              without sounding like everyone else. Walk me through developing
              differentiation that&rsquo;s both authentic and strategic.
            </PromptCard>,
            <PromptCard>{SAMPLE_PROMPT}</PromptCard>,
          ]}
        >
          <PlanList items={REASONS} />
        </PlanMargins>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Choose your Max plan"
          subtitle={null}
          pictogram={`${ART}/object-sprout.svg`}
          actions={null}
        />
        <div className="cds-plan-prices">
          <div>
            {PLANS.map(([name, art, price, text]) => (
              <div key={name} className="cds-plan-price">
                <img src={`${ART}/${art}.svg`} alt="" />
                <h4>{name}</h4>
                <div>
                  <strong>{price}</strong>
                  <small>Per person billed monthly</small>
                </div>
                <p>{text}</p>
                <Button size="large" icon="none">
                  Sign up
                </Button>
              </div>
            ))}
          </div>
          <p>
            Additional {link("usage limits")} apply. Prices shown don’t include
            applicable tax.
          </p>
        </div>
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
const PLANS_MAX_DEMO: Array<DemoStep> = [
  { on: ".cds-plan-hero .cds-btn", text: "Get started", rest: 900 },
  { on: ".cds-plan-hero .cds-btn", text: "See pricing", rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-plan-hero .cds-btn", text: "Get started", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function PlansMaxDoc() {
  return (
    <Section>
      <TemplateFigure steps={PLANS_MAX_DEMO}>
        <PlansMax />
      </TemplateFigure>
    </Section>
  )
}
