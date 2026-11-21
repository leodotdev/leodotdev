import { useState } from "react"
import {
  TbArrowsExchange,
  TbBook2,
  TbCircleCheckFilled,
  TbPaperclip,
  TbPencil,
  TbPrompt,
  TbRobot,
  TbWorld,
} from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import { ProofLogo } from "@/components/work/claude/pages/proof"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import {
  ART,
  Features,
  Gutters,
  Hero,
  LOGOS,
  LogoWall,
  Segments,
  quiet,
} from "@/components/work/claude/pages/templates/solutions-b"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type {
  Feature,
  Logo,
} from "@/components/work/claude/pages/templates/solutions-b"

// The Solutions: Financial Services template (the frame of that name on the
// Figma file's Templates page): a two-column hero over the customers' logos,
// the list of uses with marginalia in the gutters, the partners' logos, the
// artifact, two long quotes, and a webinar. The words are the file's.

// The file's wall has an eighth cell, Jump Trading, whose logo is empty
// there; it is left out.
const CUSTOMERS: Array<Logo> = [
  ["visa", "Visa"],
  ["aig", "AIG"],
  ["bci", "BCI"],
  ["bridgewater-wall", "Bridgewater"],
  ["commonwealth-bank", "Commonwealth Bank of Australia"],
  ["francisco-partners", "Francisco Partners"],
  ["norges-bank", "Norges Bank"],
]

const LAYER: Array<Feature> = [
  [
    TbBook2,
    "Unified intelligence",
    "Connect essential data sources like S&P Global, Daloopa, and internal systems in one interface. Every data point links directly to its source, for instant verification.",
  ],
  [
    TbWorld,
    "Made for enterprise",
    "Get guided onboarding and enterprise-grade security. By default, we will not use your inputs or outputs from our commercial products to train our models.",
  ],
  [
    TbRobot,
    "Native workflows",
    "Manage demanding financial workloads and accelerate work with expanded usage and capabilities, like research and agentic search.",
  ],
]

const USES: Array<Feature> = [
  [
    TbCircleCheckFilled,
    "Due diligence and research",
    "Accelerate due diligence from weeks to days. Claude synthesizes data across all your sources, catches footnotes that matter, and builds audit trails that survive compliance reviews.",
  ],
  [
    TbCircleCheckFilled,
    "Benchmarking",
    "Compare performance and valuation metrics across peer groups with portfolio companies to identify a superior opportunity.",
  ],
  [
    TbCircleCheckFilled,
    "Financial analysis and modeling",
    "Generate sophisticated models with full audit trails.",
  ],
  [
    TbCircleCheckFilled,
    "Memo and pitch deck generation",
    "Create comprehensive investment materials with data-driven insights.",
  ],
  [
    TbCircleCheckFilled,
    "Portfolio management",
    "Monitor positions across portfolios and track performance against benchmarks with real-time insights.",
  ],
]

const STATS = [
  [
    "norges-bank-left",
    "Norges Bank",
    "20%",
    "Productivity gains (equivalent to 213K hours) across portfolio management and risk departments",
  ],
  [
    "aig-left",
    "AIG",
    "90%",
    "Data accuracy improvement (up from 75%) in underwriting decisions",
  ],
] as const

const PARTNERS: Array<Logo> = [
  ["aws", "AWS"],
  ["box-wall", "Box"],
  ["daloopa", "Daloopa"],
  ["databricks", "Databricks"],
  ["deloitte-wall", "Deloitte"],
  ["factset", "FactSet"],
  ["google-cloud-wall", "Google Cloud"],
  ["kpmg", "KPMG"],
  ["morningstar", "Morningstar"],
  ["palantir", "Palantir"],
  ["pitchbook", "PitchBook"],
  ["pwc", "PwC"],
  ["sp-global", "S&P Global"],
  ["slalom", "Slalom"],
  ["snowflake-wall", "Snowflake"],
  ["tribe-ai", "Tribe AI"],
  ["turing", "Turing"],
]

const PROMPT =
  "I want to create a website for my portfolio based on this design. It will be built with Shopify so that I can eventually add a store to it."

const ABOUT =
  "Integrate Claude's powerful AI capabilities into your apps and deliver production-grade solutions faster. Automate underwriting decisions, streamline compliance workflows, and build sophisticated trading algorithms with Claude."

// The two quotes, each under its customer's logo (the file's left-aligned
// cut, in the logo's own box).
const QUOTES = [
  {
    logo: ["aig-left", "AIG", 222, 64],
    quote:
      "Our partnership with Anthropic will fundamentally transform how we approach underwriting at scale. With the incorporation of Claude’s advanced capabilities into our underwriting process, we have been able to compress the timeline to review business by more than 5x in our early rollouts while simultaneously improving our data accuracy from 75% to over 90%. This collaboration is about propelling growth and providing our underwriters the tools to make better decisions at an accelerated pace, ultimately driving our ability to serve more clients with greater insight.",
    by: "Peter Zaffino, CEO at AIG",
  },
  {
    logo: ["visa-left", "Visa", 222, 64],
    quote:
      "We see AI agents as the next evolution of commerce—autonomous systems that can predict, suggest, and find the products and services consumers need. This means AI that can find the best price for ‘that dress’ or can make everyday purchases on your behalf at the right time. This is only possible with a secure foundation at the base built on consent, privacy, transparency, and security. We are delighted that Anthropic is a key partner of Visa to make this dream a reality and shares our values and principles around responsible data usage (and we trust Claude to underpin this vision). Because when AI is moving money, safety and trust are non-negotiable.",
    by: "Rajat Taneja, President, Technology at Visa",
  },
] satisfies Array<{
  logo: [file: string, name: string, width: number, height: number]
  quote: string
  by: string
}>

/**
 * The artifact as this page has it: three tabs of its own over the stage,
 * a prompt and its attachments beside the study guide they produced. The
 * file draws the one view, so every tab shows it. Narrow, the stage shows
 * one side at a time and a button switches.
 */
function Artifact() {
  const [view, setView] = useState<"result" | "prompt">("result")
  return (
    <div className="cds-artifact cds-solb-artifact" data-view={view}>
      <Segments
        label="Products"
        tabs={[["API"], ["Claude Code"], ["Enterprise"]]}
      />
      <div className="cds-artifact-stage">
        <button
          type="button"
          className="cds-artifact-toggle"
          onClick={() => setView(view === "result" ? "prompt" : "result")}
          {...quiet}
        >
          <TbArrowsExchange aria-hidden />
          {view === "result" ? "View prompt" : "View result"}
        </button>

        <div className="cds-artifact-side">
          <div className="cds-artifact-card">
            <header>
              <TbPrompt aria-hidden />
              Prompt
            </header>
            <p>{PROMPT}</p>
          </div>
          <div className="cds-artifact-card">
            <header>
              <TbPaperclip aria-hidden />
              Attachments
            </header>
            <div className="cds-artifact-files">
              {[0, 1].map((i) => (
                <div key={i}>
                  <span>
                    <b>Lecture #1</b>
                    <small>1,113 lines</small>
                  </span>
                  <i>PDF</i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cds-artifact-sheet">
          <div>
            <h4>Psychology 101: Comprehensive Study Guide</h4>
            <h5>Introduction to Psychology</h5>
            <h6>Definition and Core Concepts</h6>
            <div>
              <p>
                Psychology: The scientific study of behavior and mental
                processes.
              </p>
              <p>Key Components:</p>
              <ul>
                <li>Behavior: Observable actions of humans and animals</li>
                <li>
                  Mental processes: Internal, subjective experiences such as
                  thoughts, feelings, perceptions, memories, and dreams
                </li>
              </ul>
              <p>Important Characteristics of Psychology:</p>
              <ul>
                <li>It is a science using empirical methods</li>
                <li>Studies both overt behavior and internal mental states</li>
                <li>Examines both humans and animals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The page. Ivory and White by turns, as in the file, over the Dark 3
 * footer; on the site's dark mode, Dark 3 and Dark 2.
 */
function SolutionsFinancialServices() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Solutions", "Financial services"]} />
        <Hero
          title="Transform financial services with Claude"
          lead="Claude helps leading financial institutions across banking, insurance, asset management, and fintech transform how they serve markets and manage risk."
          action="Contact sales"
          art="hero-stairs"
        />
        <div className="cds-solb-under-hero">
          <LogoWall logos={CUSTOMERS} />
        </div>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p2"
          title="The first unified intelligence layer for institutional finance"
          subtitle="The Financial Analysis Solution combines cutting-edge AI with deep financial data infrastructure and enterprise-grade security."
          pictogram={`${ART}/object-piggy-bank.svg`}
          actions={null}
        />
        <Features items={LAYER} />
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Using the Financial Analysis Solution"
          subtitle="Claude transforms every stage of your financial workflow. Here’s how teams are using it to generate alpha faster."
          pictogram={`${ART}/node-pie-chart.svg`}
          actions={null}
        />
        <Gutters
          rows={USES}
          ink
          low
          cards={
            <>
              {/* The file stacks three connector cards here, two of them
                  placeholders; the one it shows is drawn. */}
              <div className="cds-margin" data-gutter="left">
                <div className="cds-margin-card">
                  <div className="cds-margin-head">Connectors</div>
                  <div className="cds-margin-caption">
                    <img
                      className="cds-margin-logo"
                      src={`${LOGOS}/stripe-left.svg`}
                      alt="Stripe"
                    />
                    <p>
                      The Stripe Model Context Protocol server defines a set of
                      tools that AI agents can use to interact with the Stripe
                      API and search our knowledge base (including documentation
                      and support articles).
                    </p>
                  </div>
                  <div>
                    <Button size="small" variant="tertiary">
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>
              <div className="cds-margin" data-gutter="right">
                <div className="cds-margin-card">
                  <div>
                    {STATS.map(([file, name, figure, note]) => (
                      <div key={file} className="cds-margin-stat">
                        <img
                          className="cds-margin-logo"
                          src={`${LOGOS}/${file}.svg`}
                          alt={name}
                        />
                        <b>{figure}</b>
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          }
        />
        <div className="cds-solb-ecosystem">
          <Header
            size="p4"
            title="The AI ecosystem for financial services"
            subtitle="Claude can work alongside you in your most important tools."
            pictogram={null}
            actions={
              <Button size="large" icon="none">
                MCP directory
              </Button>
            }
          />
          <LogoWall logos={PARTNERS} per={6} rule={false} />
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="More solutions for financial services"
          subtitle={null}
          pictogram={`${ART}/hand-link.svg`}
          actions={null}
        />
        <div className="cds-solb-solutions">
          <Artifact />
          {/* The designers' note beside the stage, in the page's margin. */}
          <div className="cds-solb-note">
            <img src={`${ART}/note-arrow.svg`} alt="" />
            <small>
              <TbPencil aria-hidden />
              Note
            </small>
            <p>
              Interact with the data—hover and toggle views to uncover patterns
            </p>
          </div>
        </div>
        <div className="cds-solb-about">
          <h4>Claude API</h4>
          <p>{ABOUT}</p>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-3"]}>
        <div className="cds-solb-proofs">
          {QUOTES.map(({ logo, quote, by }) => (
            <div key={by} className="cds-proof">
              <ProofLogo logo={logo} />
              <div className="cds-proof-body">
                <p>&ldquo;{quote}&rdquo;</p>
                <small>{by}</small>
              </div>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-2"]}>
        <Header
          size="p1"
          title="From insight to alpha, faster than ever"
          subtitle="See how Claude transforms workflows, from due diligence and research to financial analysis."
          pictogram={`${ART}/node-pencil.svg`}
          actions={
            <Button size="large" icon="none">
              Contact sales
            </Button>
          }
        />
        <div className="cds-card-video-wrap cds-solb-video">
          <div className="cds-card-video">
            {/* The film's still: a dark tile, as in the file. */}
            <div className="cds-card-video-media" aria-hidden />
            <div className="cds-card-video-body">
              <span className="cds-meta-link">
                <TbPaperclip aria-hidden />
                Webinar
              </span>
              <div className="cds-card-title">
                How NBIM transformed the world’s largest sovereign wealth fund
                with agentic AI
              </div>
              <Button variant="tertiary" icon="none">
                Register and watch
              </Button>
            </div>
          </div>
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
const SOLUTIONS_FINANCIAL_SERVICES_DEMO: Array<DemoStep> = [
  { on: ".cds-solb-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-solb-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function SolutionsFinancialServicesDoc() {
  return (
    <Section>
      <TemplateFigure steps={SOLUTIONS_FINANCIAL_SERVICES_DEMO}>
        <SolutionsFinancialServices />
      </TemplateFigure>
    </Section>
  )
}
