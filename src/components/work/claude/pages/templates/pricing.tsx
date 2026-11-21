import { useState } from "react"
import { TbCheck } from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import { Button, Switch } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Pricing template (the three "Pricing" frames on the Figma file's
// Templates page, which are the three tabs of one page): the site
// navigation, a section header with the tabs under its headline, and the
// footer, around what each tab shows. Individual and Team & Enterprise are
// plan cards; API is the models' prices, the tools', the service tiers, and
// the older models. The words and prices are the file's.

const ART = "/work/claude/illustrations"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const TABS = ["Individual", "Team & Enterprise", "API"] as const
type Tab = (typeof TABS)[number]

type Seat = [name: string, price: string, gets: string, terms: string]

type Plan = {
  /** Its pictogram, a file in the illustrations folder. */
  art: string
  name: string
  about: string
  /** The button's label. */
  cta: string
  /** One price and its terms, over the button. */
  price?: [amount: string, terms: string]
  /** A price for each kind of seat, under the button. */
  seats?: Array<Seat>
  /** The line over the features: the plan they add to. */
  lead?: string
  features: Array<string>
  /** The plan the page points at: a blue line around it and a shadow. */
  accent?: true
}

const INDIVIDUAL: Array<Plan> = [
  {
    art: "node-sprout",
    name: "Free",
    about: "Try Claude",
    cta: "Try Claude",
    price: ["$0", "Free for everyone"],
    features: [
      "Chat on web, iOS, and Android",
      "Generate code and visualize data",
      "Write, edit, and create content",
      "Analyze text and images",
      "Ability to search the web",
    ],
  },
  {
    art: "node-plant",
    name: "Pro",
    about: "For everyday productivity",
    cta: "Try Claude",
    price: [
      "$17",
      "Per month with annual subscription discount ($200 billed up front). $20 if billed monthly.",
    ],
    lead: "Everything in Free, plus:",
    features: [
      "More usage*",
      "Access Claude Code directly in your terminal",
      "Access to unlimited Projects to organize chats and documents",
      "Access to Research",
      "Connect Google Workspace email, calendar, and docs",
      "Connect any context or tool through Integrations with remote MCP",
      "Extended thinking for complex work",
      "Ability to use more Claude models",
    ],
  },
  {
    art: "node-tree-sky",
    name: "Max",
    about: "Get the most out of Claude",
    cta: "Try Claude",
    price: ["From $100", "Per person billed monthly"],
    lead: "Everything in Pro, plus:",
    features: [
      "Choose 5x or 20x more usage than Pro*",
      "Higher output limits for all tasks",
      "Early access to advanced Claude features",
      "Priority access at high traffic times",
    ],
    accent: true,
  },
]

const TEAMS: Array<Plan> = [
  {
    art: "hand-share",
    name: "Team",
    about: "For collaboration across organizations",
    cta: "Create a Team plan",
    seats: [
      [
        "Standard seat",
        "$25",
        "Chat, projects, and more",
        "Per person / month with annual subscription discount. Minimum 5 members. $30 if billed monthly.",
      ],
      [
        "Premium seat",
        "$150",
        "Includes Claude Code",
        "Per person / month with annual subscription discount. Minimum 5 members.",
      ],
    ],
    lead: "Almost everything in Pro, plus:",
    features: [
      "More usage*",
      "Central billing and administration",
      "Early access to collaboration features",
      "Claude Code available with premium seat",
    ],
  },
  {
    art: "object-skyline",
    name: "Enterprise",
    about: "For businesses operating at scale",
    cta: "Contact sales",
    lead: "Everything in Team, plus:",
    // The file's list says three of these twice; each is here once.
    features: [
      "More usage*",
      "Enhanced context window",
      "Single sign-on (SSO) and domain capture",
      "Role-based access with fine-grained permissioning",
      "System for Cross-domain Identity Management (SCIM)",
      "Audit logs",
      "Google Docs cataloging",
      "Compliance API for observability and monitoring",
      "Claude Code available with premium seat",
    ],
  },
]

type Point = [name: string, text: string]

const EDUCATION: Array<Point> = [
  [
    "Student and faculty access",
    "Comprehensive access for all university members at discounted rates",
  ],
  [
    "Academic research and learning mode",
    "Dedicated API credits and educational features for student learning",
  ],
  [
    "Training and enablement",
    "Resources for successful adoption across your institution",
  ],
]

const TIERS: Array<Point> = [
  [
    "Priority",
    "When time, availability, and predictable pricing are most important",
  ],
  ["Standard", "Default tier for both piloting and scaling everyday use cases"],
  [
    "Batch",
    "For asynchronous workloads that can be processed together for better efficiency",
  ],
]

type Row = [label: string, price: string]

type Model = {
  name: string
  about?: string
  /** One price, or one for each size of prompt. */
  input: string | Array<Row>
  output: string | Array<Row>
  /** Prompt caching: a write and a read, for each size of prompt. */
  caching: Array<[write: string, read: string, when?: string]>
}

const UP_TO_200K = "Prompts ≤ 200K tokens"
const OVER_200K = "Prompts > 200K tokens"

const LATEST: Array<Model> = [
  {
    name: "Opus 4.1",
    about: "Most intelligent model for complex tasks",
    input: "$15 / MTok",
    output: "$75 / MTok",
    caching: [["$18.75 / MTok", "$1.50 / MTok"]],
  },
  {
    name: "Sonnet 4",
    about: "Optimal balance of intelligence, cost, and speed",
    input: [
      [UP_TO_200K, "$3 / MTok"],
      [OVER_200K, "$6 / MTok"],
    ],
    output: [
      [UP_TO_200K, "$15 / MTok"],
      [OVER_200K, "$22.50 / MTok"],
    ],
    caching: [
      ["$3.75 / MTok", "$0.30 / MTok", "≤ 200K tokens"],
      ["$7.50 / MTok", "$0.60 / MTok", "> 200K tokens"],
    ],
  },
  {
    name: "Haiku 3.5",
    about: "Fastest, most cost-effective model",
    input: "$0.80 / MTok",
    output: "$4 / MTok",
    caching: [["$1 / MTok", "$0.08 / MTok"]],
  },
]

const LEGACY: Array<Model> = [
  {
    name: "Opus 4.1",
    input: "$15 / MTok",
    output: "$75 / MTok",
    caching: [["$18.75 / MTok", "$1.50 / MTok"]],
  },
  {
    name: "Opus 3",
    input: "$15 / MTok",
    output: "$75 / MTok",
    caching: [["$18.75 / MTok", "$1.50 / MTok"]],
  },
  {
    name: "Sonnet 3.7",
    input: "$3 / MTok",
    output: "$15 / MTok",
    caching: [["$3.75 / MTok", "$0.30 / MTok"]],
  },
  {
    name: "Haiku 3",
    input: "$0.25 / MTok",
    output: "$1.25 / MTok",
    caching: [["$0.30 / MTok", "$0.03 / MTok"]],
  },
]

// The tools: a name, what it does, and what is charged for.
const TOOLS = [
  [
    "Web search",
    "Give Claude access to the latest information from the web. Doesn’t include input and output tokens required to process requests.",
    "Cost",
    "$10 / 1K searches",
  ],
  [
    "Code execution",
    "Run Python code in a sandboxed environment for advanced data analysis. 50 free hours of usage daily per organization.",
    "Additional hours",
    "$0.05 per hour per container",
  ],
] as const

/** A label on the left and its price on the right. */
function PriceRow({ row: [label, price] }: { row: Row }) {
  return (
    <div className="cds-pricing-row">
      <span>{label}</span>
      <b>{price}</b>
    </div>
  )
}

/**
 * A plan's card. Its three parts (the plan and its price, the button, and
 * what the plan includes) line up with the other cards' in the row.
 */
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className="cds-pricing-card cds-pricing-plan"
      data-accent={plan.accent ? "" : undefined}
    >
      <div className="cds-pricing-name">
        <img src={`${ART}/${plan.art}.svg`} alt="" />
        <h4 className="cds-headline-4">{plan.name}</h4>
        <p>{plan.about}</p>
        {plan.price && (
          <div className="cds-pricing-price">
            <b>{plan.price[0]}</b>
            <small>{plan.price[1]}</small>
          </div>
        )}
      </div>
      <Button size="large" icon="none">
        {plan.cta}
      </Button>
      <div className="cds-pricing-rest">
        {plan.seats?.map(([name, price, gets, terms]) => (
          <div key={name} className="cds-pricing-seat">
            <div className="cds-pricing-row">
              <b>{name}</b>
              <b>{price}</b>
            </div>
            <span>{gets}</span>
            <small>{terms}</small>
          </div>
        ))}
        <div className="cds-pricing-features">
          {plan.lead && <b>{plan.lead}</b>}
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>
                <TbCheck aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** A model's card: what its input, output, and prompt caching cost. */
function ModelCard({ model }: { model: Model }) {
  return (
    <div className="cds-pricing-card">
      <div className="cds-pricing-name">
        <h4 className="cds-headline-4">{model.name}</h4>
        {model.about && <p>{model.about}</p>}
      </div>
      <div>
        {(["Input", "Output"] as const).map((label) => {
          const price = label === "Input" ? model.input : model.output
          return (
            <div key={label} className="cds-pricing-block">
              {typeof price === "string" ? (
                <PriceRow row={[label, price]} />
              ) : (
                <>
                  <span>{label}</span>
                  <div className="cds-pricing-sizes">
                    {price.map((row) => (
                      <PriceRow key={row[0]} row={row} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
        <div className="cds-pricing-block">
          <span>Prompt caching</span>
          {model.caching.map(([write, read, when]) => (
            <div key={when ?? ""} className="cds-pricing-cache">
              {when && <span>{when}</span>}
              <PriceRow row={["Write", write]} />
              <PriceRow row={["Read", read]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** The line under the plans. */
function UsageNote() {
  return (
    <p className="cds-pricing-note">
      Additional <a href="#">usage limits</a> apply. Prices shown don’t include
      applicable tax.
    </p>
  )
}

/**
 * What stands under a row of model cards: the batch discount with its
 * switch, and a line about prompt caching. The switch turns, and leaves the
 * prices as they are: the file gives no batch prices.
 */
function Batch() {
  return (
    <>
      <div className="cds-pricing-promo">
        <span>
          Save 50% with batch processing. <a href="#">Learn more</a>
        </span>
        <Switch>Batch processing</Switch>
      </div>
      <p className="cds-pricing-note">
        Prompt caching pricing reflects 5-minute TTL. Learn about{" "}
        <a href="#">extended prompt caching</a>.
      </p>
    </>
  )
}

/**
 * A wide card on the theme's third background: a section header on the
 * left, a short list on the right, each item ticked or not.
 */
function Feature({
  title,
  subtitle,
  pictogram,
  actions,
  points,
  ticked = false,
}: {
  title: string
  subtitle: string
  pictogram: string
  actions: React.ReactNode
  points: Array<Point>
  ticked?: boolean
}) {
  return (
    <div className="cds-pricing-feature">
      <Header
        size="p3"
        align="left"
        title={title}
        subtitle={subtitle}
        pictogram={`${ART}/${pictogram}.svg`}
        actions={actions}
      />
      <ul>
        {points.map(([name, text]) => (
          <li key={name}>
            {ticked && <TbCheck aria-hidden />}
            <div>
              <h4 className="cds-headline-6">{name}</h4>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Every section of the page is Ivory, as in the file, with no line between
// them but the ones the API tab rules above its headings.
const theme: ["ivory", "dark-3"] = ["ivory", "dark-3"]
const section = "cds-pricing-section"
const ruled = "cds-pricing-section cds-pricing-ruled"

function Individual() {
  return (
    <TemplateSection theme={theme} className={section}>
      <div className="cds-pricing-cards">
        {INDIVIDUAL.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
      <UsageNote />
    </TemplateSection>
  )
}

function Teams() {
  return (
    <>
      <TemplateSection theme={theme} className={section}>
        <div className="cds-pricing-cards" data-count="2">
          {TEAMS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
        <UsageNote />
      </TemplateSection>

      <TemplateSection theme={theme} className={section}>
        <Feature
          title="Education plan"
          subtitle="Get a comprehensive university-wide plan for an institution, including its students, faculty, and staff."
          pictogram="object-column"
          actions={
            <Button size="large" variant="secondary" icon="none">
              Learn more
            </Button>
          }
          points={EDUCATION}
          ticked
        />
      </TemplateSection>
    </>
  )
}

function Api() {
  return (
    <>
      <TemplateSection theme={theme} className={ruled}>
        <div className="cds-pricing-head">
          <h4 className="cds-headline-2">Latest models</h4>
          <div>
            <Button size="large" variant="tertiary" icon="none">
              Contact sales
            </Button>
            <Button size="large" icon="none">
              Start building
            </Button>
          </div>
        </div>
        <div className="cds-pricing-cards">
          {LATEST.map((model) => (
            <ModelCard key={model.name} model={model} />
          ))}
        </div>
        <Batch />
      </TemplateSection>

      <TemplateSection theme={theme} className={ruled}>
        <div className="cds-pricing-cards">
          <Header
            size="p2"
            align="left"
            title="Pricing for tools"
            subtitle="Get even more out of Claude with advanced features and capabilities."
            pictogram={null}
            actions={
              <Button size="large" variant="secondary" icon="none">
                Learn more
              </Button>
            }
          />
          {TOOLS.map(([name, text, label, price]) => (
            <div key={name} className="cds-pricing-card">
              <div className="cds-pricing-name">
                <h4 className="cds-headline-4">{name}</h4>
                <p>{text}</p>
              </div>
              <div className="cds-pricing-cost">
                <small>{label}</small>
                <b>{price}</b>
              </div>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={theme} className={section}>
        <Feature
          title="Service tiers"
          subtitle="Balance availability, performance, and predictable costs based on your needs."
          pictogram="object-shapes"
          actions={
            <>
              <Button size="large" icon="none">
                Learn more
              </Button>
              <Button size="large" variant="secondary" icon="none">
                Contact sales
              </Button>
            </>
          }
          points={TIERS}
        />
      </TemplateSection>

      <TemplateSection theme={theme} className={ruled}>
        <div className="cds-pricing-head">
          <h4 className="cds-headline-2">Legacy models</h4>
          <Button size="large" variant="tertiary" icon="none">
            Learn more
          </Button>
        </div>
        <div className="cds-pricing-cards" data-count="4">
          {LEGACY.map((model) => (
            <ModelCard key={model.name} model={model} />
          ))}
        </div>
        <Batch />
      </TemplateSection>
    </>
  )
}

/**
 * The page: the header and its tabs, the tab's own sections, and the Dark 3
 * footer. It is Ivory throughout, and Dark 3 on the site's dark mode.
 */
function Pricing() {
  const [tab, setTab] = useState<Tab>("Individual")
  return (
    <>
      <TemplateBlock theme={theme}>
        <SiteNavigation crumbs={["Pricing"]} />
        <div className="cds-pricing-hero">
          <Header
            size="p1"
            title="Pricing"
            subtitle={null}
            pictogram={null}
            // The tabs stand where a header's buttons do.
            actions={
              <div className="cds-tabs" data-size="large" role="tablist">
                {TABS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    className="cds-tab"
                    aria-selected={tab === name}
                    onClick={() => setTab(name)}
                    {...quiet}
                  >
                    {name}
                  </button>
                ))}
              </div>
            }
          />
        </div>
      </TemplateBlock>

      {tab === "Individual" && <Individual />}
      {tab === "Team & Enterprise" && <Teams />}
      {tab === "API" && <Api />}

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <Footer />
      </TemplateBlock>
    </>
  )
}

const tabs = ".cds-pricing-hero .cds-tab"

// The page's own things for the demo cursor, wide and again at a phone's
// width. The scrolling and resizing around them are the template figure's
// (`around` in template.tsx), which also leaves the site's header alone.
const PRICING_DEMO: Array<DemoStep> = [
  { on: tabs, text: "Team & Enterprise", click: true, rest: 600 },
  { on: ".cds-pricing-plan .cds-btn", text: "Create a Team plan", rest: 900 },
  { on: tabs, text: "API", click: true, rest: 600 },
  { on: ".cds-pricing-head .cds-btn", text: "Start building", rest: 900 },
  { on: tabs, text: "Individual", click: true, rest: 600 },
  { on: ".cds-pricing-plan .cds-btn", nth: 1, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: tabs, text: "Individual", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function PricingDoc() {
  return (
    <Section>
      <TemplateFigure steps={PRICING_DEMO}>
        <Pricing />
      </TemplateFigure>
    </Section>
  )
}
