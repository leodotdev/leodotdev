import { useEffect, useRef, useState } from "react"
import {
  TbArrowRight,
  TbBolt,
  TbCheck,
  TbCircleCheckFilled,
  TbMessages,
  TbPencil,
  TbPrompt,
  TbRoute,
} from "react-icons/tb"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import { ProofLogo } from "@/components/work/claude/pages/proof"
import { Button, CarouselUi, Switch } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The API template (the "API (Desktop)" frame on the Figma file's Templates
// page), built from the organisms the other tabs document: the site
// navigation, the section header, proof cards in their carousel, feature
// highlights, a marginalia card, the switch, the text input, and the footer.
// Its words are the file's. What is new here is what the page adds around
// them: the hero, the two ways to start, the models' prices, the list of
// tools, the Console's prompt improver, and the newsletter card.

const ART = "/work/claude/illustrations"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

/** A customer's logo: its file, its name, and its own size. */
type Mark = [file: string, name: string, width: number, height: number]

// The file's four proof cards carry one sample quote under four logos.
const QUOTE =
  "Claude helped us reduce analysis time by 60% while uncovering insights we never would have found on our own."
const QUOTE_BY = "First McLastname, CTO, Workato"
const CUSTOMERS: Array<Mark> = [
  ["intercom-left", "Intercom", 141, 23],
  ["stubhub", "StubHub", 107, 48],
  ["brex", "Brex", 116, 30],
  ["workato", "Workato", 162, 24],
]

const DOCS = "Prompting guides and developer docs"

const PLANS = [
  {
    name: "Build on your own",
    lead: "Launch your own generative AI solution with:",
    items: [
      "Access to all Claude models",
      "Usage-based tiers",
      "Automatically increasing rate limits",
      "Simple pay-as-you-go pricing",
      "Self-serve deployment on workbench",
      DOCS,
    ],
    action: "Start building",
  },
  {
    name: "Get extra support",
    lead: "Need custom rate limits or hands-on help? Contact our sales team for:",
    items: [
      "Anthropic-supported onboarding",
      "Custom rate limits",
      "Billing via monthly invoices",
      "Prompting support",
      "Deployment support",
    ],
    action: "Contact sales",
  },
] as const

/** What something costs: its name and its price. */
type Rate = [label: string, price: string]

type Model = {
  name: string
  about: string
  /** One price, or one for each size of prompt. */
  input: string | Array<Rate>
  output: string | Array<Rate>
  /** Writing to the cache and reading from it, for each size of prompt. */
  caching: Array<{ size?: string; rates: Array<Rate> }>
}

// A size keeps to one line, so a narrow card breaks the label before it.
const UP_TO_200K = "≤ 200K tokens"
const OVER_200K = "> 200K tokens"

const MODELS: Array<Model> = [
  {
    name: "Opus 4.1",
    about: "Most intelligent model for complex tasks",
    input: "$15 / MTok",
    output: "$75 / MTok",
    caching: [
      {
        rates: [
          ["Write", "$18.75 / MTok"],
          ["Read", "$1.50 / MTok"],
        ],
      },
    ],
  },
  {
    name: "Sonnet 4",
    about: "Optimal balance of intelligence, cost, and speed",
    input: [
      [`Prompts ${UP_TO_200K}`, "$3 / MTok"],
      [`Prompts ${OVER_200K}`, "$6 / MTok"],
    ],
    output: [
      [`Prompts ${UP_TO_200K}`, "$15 / MTok"],
      [`Prompts ${OVER_200K}`, "$22.50 / MTok"],
    ],
    caching: [
      {
        size: UP_TO_200K,
        rates: [
          ["Write", "$3.75 / MTok"],
          ["Read", "$0.30 / MTok"],
        ],
      },
      {
        size: OVER_200K,
        rates: [
          ["Write", "$7.50 / MTok"],
          ["Read", "$0.60 / MTok"],
        ],
      },
    ],
  },
  {
    name: "Haiku 3.5",
    about: "Fastest, most cost-effective model",
    input: "$0.80 / MTok",
    output: "$4 / MTok",
    caching: [
      {
        rates: [
          ["Write", "$1 / MTok"],
          ["Read", "$0.08 / MTok"],
        ],
      },
    ],
  },
]

const TOOLS = [
  [
    "Prompt caching",
    "Give Claude more background knowledge and example outputs to reduce costs and latency.",
  ],
  [
    "Web search",
    "Augment Claude’s knowledge with current, real-world data from across the web.",
  ],
  [
    "Tool use",
    "Allow Claude to interact with external tools and APIs so it can perform a wider range of tasks.",
  ],
  [
    "Batch processing",
    "Process large volumes of requests asynchronously and save 50% on costs.",
  ],
  [
    "MCP connector",
    "Connect Claude to any remote MCP server without writing client code.",
  ],
  [
    "Code execution",
    "Run Python code, create visualizations, and analyze data directly within API calls.",
  ],
  [
    "Citations",
    "Get detailed references to the exact sentences and passages Claude uses to generate responses, leading to more verifiable, trustworthy outputs.",
  ],
  [
    "Files API",
    "Upload documents once and reference them repeatedly across conversations.",
  ],
] as const

// The prompt improver, as the file's picture of the Console has it: the
// prompt it was given, what to improve, and the prompt it wrote.
const EXISTING_PROMPT = `Classify all customer support tickets into the most relevant category.

Here is the list of categories to choose from:
{{CATEGORY_LIST}}

Here is the content of the support ticket:
{{TICKET_CONTENT}}`

const IMPROVED_PROMPT = `You are an AI assistant specialized in classifying customer support tickets. Your task is to analyze the content of a given ticket and assign it to the most appropriate category from a predefined list. You will also provide reasoning for your classification decision.

First, let's review the available categories:
<category_list>
{{CATEGORY_LIST}}
</category_list>

Now, here is the content of the support ticket you need to classify:

<ticket_content>
{{TICKET_CONTENT}}
</ticket_content>

Please follow these steps to complete the task:

Carefully read and analyze the ticket content.
Consider how the content relates to each of the available categories.
Choose the most appropriate category for the ticket.
Provide a detailed explanation of your reasoning process.

Use the following structure for your response:
<classification_analysis>
In this section, break down your thought process:

Quote the most relevant parts of the ticket content.
List each category and note how it relates to the ticket content.
For each category, provide arguments for and against classifying the ticket into that category.
Rank the top 3 most likely categories.
</classification_analysis>

<classification>
<category>Your chosen category goes here</category>
<reasoning>A concise summary of your reasoning for choosing this category</reasoning>
</classification>
Remember to be thorough in your analysis and clear in your explanation. Your goal is to provide an accurate classification with well-supported reasoning.`

const USES = [
  [
    TbPrompt,
    "Coding",
    "Claude models are constantly improving on coding, math, and reasoning. Our latest model, Claude Opus 4.1, can complete complex engineering tasks to solve problems that would typically take a full day of engineering work.",
    true,
  ],
  [
    TbRoute,
    "Agents",
    "Claude offers superior instruction following, tool selection, error correction, and advanced reasoning for customer-facing agents and complex AI workflows.",
    true,
  ],
  [
    TbBolt,
    "Productivity",
    "Claude can extract relevant information from business emails and documents, categorize and summarize survey responses, and wrangle reams of text with high speed and accuracy.",
    false,
  ],
  [
    TbMessages,
    "Customer support",
    "Claude can handle ticket triage, on-demand complex inquiries using rich context awareness, and multi-step support workflows—all with a casual tone and conversational responses.",
    true,
  ],
] as const

/**
 * The customers' quotes under the hero: the system's proof cards in their
 * carousel, with this page's logos and words. The row scrolls sideways and
 * snaps to a card; the arrows go a card at a time and come round again.
 */
function Quotes() {
  const row = useRef<HTMLDivElement>(null)
  const [stops, setStops] = useState(1)
  const [current, setCurrent] = useState(0)
  const [end, setEnd] = useState(false)

  // How far it is from one card to the next, and how far the row scrolls.
  const reach = () => {
    const el = row.current
    const [first, second] = el?.children ?? []
    if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement))
      return null
    return {
      el: el!,
      stride: second.offsetLeft - first.offsetLeft,
      max: el!.scrollWidth - el!.clientWidth,
    }
  }

  useEffect(() => {
    const el = row.current
    if (!el) return
    const measure = () => {
      const at = reach()
      if (!at || at.stride <= 0) return
      const count = at.max <= 1 ? 1 : Math.ceil((at.max - 1) / at.stride) + 1
      const last = at.max > 1 && at.max - at.el.scrollLeft <= 1
      setStops(count)
      setEnd(last)
      setCurrent(
        last
          ? count - 1
          : Math.min(count - 1, Math.round(at.el.scrollLeft / at.stride))
      )
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.addEventListener("scroll", measure, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", measure)
    }
  }, [])

  const step = (by: 1 | -1) => {
    const at = reach()
    if (!at) return
    const next = (current + by + stops) % stops
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    at.el.scrollTo({
      left: Math.min(next * at.stride, at.max),
      behavior: still ? "auto" : "smooth",
    })
  }

  return (
    <div className="cds-proof-carousel">
      <div ref={row} className="cds-proofs" data-end={end || undefined}>
        {CUSTOMERS.map((logo) => (
          <div key={logo[0]} className="cds-proof">
            <ProofLogo logo={logo} />
            <div className="cds-proof-body">
              <p>&ldquo;{QUOTE}&rdquo;</p>
              <small>{QUOTE_BY}</small>
            </div>
          </div>
        ))}
      </div>
      <CarouselUi count={stops} current={current} onStep={step} />
    </div>
  )
}

/** One ruled block of a model's card: a price, or a price for each size. */
function Price({
  label,
  price,
}: {
  label: string
  price: string | Array<Rate>
}) {
  if (typeof price === "string")
    return (
      <div className="cds-api-rates">
        <div className="cds-api-rate" data-size="large">
          <span>{label}</span>
          <b>{price}</b>
        </div>
      </div>
    )
  return (
    <div className="cds-api-rates">
      <span>{label}</span>
      {price.map(([size, amount]) => (
        <div key={size} className="cds-api-rate" data-size="large">
          <small>{size}</small>
          <b>{amount}</b>
        </div>
      ))}
    </div>
  )
}

/** A model's card: its name, what it is for, and its prices. */
function ModelCard({ model }: { model: Model }) {
  return (
    <div className="cds-api-model">
      <header>
        <h4>{model.name}</h4>
        <p>{model.about}</p>
      </header>
      <Price label="Input" price={model.input} />
      <Price label="Output" price={model.output} />
      <div className="cds-api-rates">
        <span>Prompt caching</span>
        {model.caching.map(({ size, rates }) => (
          <div key={size ?? "all"} className="cds-api-cache">
            {size && <small>{size}</small>}
            {rates.map(([label, amount]) => (
              <div key={label} className="cds-api-rate">
                <small>{label}</small>
                <b>{amount}</b>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The page. Each section wears a theme of its own, as on the site: Ivory and
 * White by turns, over the Dark 3 call to start and footer. On the site's
 * dark mode they are Dark 3 and Dark 2.
 */
function Api() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Platform", "API Overview"]} />
        <div className="cds-api-hero">
          <div>
            <h3>Build on the Claude Developer Platform</h3>
            <p>
              Use our API to create new user experiences, products, and ways to
              work with the most advanced AI models on the market.
            </p>
            <div className="cds-api-actions">
              <Button size="large" icon="none">
                Start building
              </Button>
              <Button size="large" variant="secondary" icon="none">
                See developer docs
              </Button>
            </div>
          </div>
          <img src={`${ART}/hand-head-node.svg`} alt="" />
        </div>
        <div className="cds-api-proofs">
          <Quotes />
        </div>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Choose how to get started"
          subtitle={null}
          pictogram={`${ART}/object-stairs.svg`}
          actions={null}
        />
        <div className="cds-api-plans">
          {PLANS.map((plan) => (
            <div key={plan.name} className="cds-api-plan">
              <h4>{plan.name}</h4>
              <p>{plan.lead}</p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>
                    <TbCheck aria-hidden />
                    {item === DOCS ? (
                      <a href="#" className="cds-link" {...quiet}>
                        {item}
                      </a>
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
              <Button size="large" icon="none">
                {plan.action}
              </Button>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Claude models"
          subtitle="Right-sized for any task, our models offer the best combination of speed and performance."
          pictogram={`${ART}/object-sprout.svg`}
          actions={
            <>
              <Button size="large" icon="none">
                Start building
              </Button>
              <Button size="large" variant="tertiary" icon="none">
                Learn more
              </Button>
            </>
          }
        />
        <div className="cds-api-pricing">
          <div className="cds-api-models">
            {MODELS.map((model) => (
              <ModelCard key={model.name} model={model} />
            ))}
          </div>
          <div className="cds-api-promo">
            <p>
              Save 50% with batch processing.{" "}
              <a href="#" className="cds-api-more" {...quiet}>
                Learn more
              </a>
            </p>
            <Switch>Batch processing</Switch>
          </div>
          <p className="cds-api-footnote">
            Prompt caching pricing reflects 5-minute TTL. Learn about{" "}
            <a href="#" className="cds-link" {...quiet}>
              extended prompt caching
            </a>
            .
          </p>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <div className="cds-api-tools-header">
          <Header
            size="p1"
            title="Do more with built-in tools"
            subtitle={null}
            pictogram={`${ART}/node-pie-chart.svg`}
            actions={
              <Button size="large" icon="none">
                See developer docs
              </Button>
            }
          />
        </div>
        <div className="cds-api-tools">
          <ul>
            {TOOLS.map(([name, text]) => (
              <li key={name}>
                <TbCircleCheckFilled aria-hidden />
                <div>
                  <h4>{name}</h4>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
          {/* The marginalia card: beside the list's last row where the page
              has a margin wide enough, under the list where it has not. */}
          <div className="cds-margin cds-api-doc">
            <div className="cds-margin-card">
              <div className="cds-margin-head">Developer doc</div>
              <p>Explore Claude’s advanced features and capabilities.</p>
              <div>
                <Button size="small" variant="tertiary" icon="none">
                  Read more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-3"]}>
        <Header
          size="p1"
          title="Get to production faster with the Claude Console"
          subtitle="Integrate Claude’s powerful AI capabilities into your apps and deliver production-grade solutions faster."
          pictogram={`${ART}/hand-bolt.svg`}
          actions={null}
        />
        <div className="cds-api-console">
          <div className="cds-api-note">
            <svg viewBox="0 0 56 56" fill="none" aria-hidden>
              <path d="M3 8c27 0 49 20 49 46M9 3 3 8l6 5" />
            </svg>
            <div>
              <small>
                <TbPencil aria-hidden />
                Note
              </small>
              <p>Try interacting with this artifact</p>
            </div>
          </div>
          {/* The Console's prompt improver. The file has a picture of it
              here; this is the same thing in type, on a plain tile. */}
          <div className="cds-api-screen">
            <div className="cds-api-view">
              <Button size="small" variant="tertiary" icon="leading">
                View prompt
              </Button>
            </div>
            <div className="cds-api-prompts">
              <div className="cds-api-panel">
                <b>Existing prompt</b>
                <pre>{EXISTING_PROMPT}</pre>
              </div>
              <div className="cds-api-panel">
                <b>What would you like to improve?</b>
                <p>Please include a rationale for the classification.</p>
              </div>
            </div>
            <pre className="cds-api-panel">{IMPROVED_PROMPT}</pre>
          </div>
          <div className="cds-api-about">
            <h4>Built for developers</h4>
            <div>
              <p>Build, test, and iterate on your deployment:</p>
              <ul>
                <li>Automatically generate or improve existing prompts</li>
                <li>Evaluate model responses against real-world scenarios</li>
                <li>Build faster with pre-built cookbooks and guides</li>
              </ul>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-2"]}>
        <Header
          size="p1"
          title="Use cases for Claude"
          subtitle={null}
          pictogram={`${ART}/hand-shapes.svg`}
          actions={null}
        />
        <div className="cds-api-uses">
          {USES.map(([Icon, title, text, more]) => (
            <div key={title} className="cds-feature">
              <Icon aria-hidden />
              <div>
                <div className="cds-card-title">{title}</div>
                <p>{text}</p>
                {more && (
                  <div>
                    <Button size="small" variant="tertiary" icon="none">
                      Learn more
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["dark-3", "dark-3"]}>
        <div className="cds-api-start">
          <div>
            <h3>Start building</h3>
            <div className="cds-api-actions">
              <Button size="large" icon="none">
                See pricing
              </Button>
              <Button size="large" variant="secondary" icon="none">
                Contact sales
              </Button>
            </div>
          </div>
          <div className="cds-api-news">
            <img src={`${ART}/object-mailbox.svg`} alt="" />
            <h4>Get the developer newsletter</h4>
            <p>
              Product updates, how-tos, community spotlights, and more.
              Delivered monthly to your inbox.
            </p>
            <label
              className="cds-input"
              data-size="larger"
              data-trailing="button"
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              <button
                type="button"
                className="cds-btn"
                data-variant="primary"
                data-icon="only"
                aria-label="Subscribe"
                {...quiet}
              >
                <TbArrowRight aria-hidden />
              </button>
            </label>
            <small>
              By subscribing, you agree to receive Claude marketing emails and
              agree to the{" "}
              <a href="#" className="cds-link" {...quiet}>
                Privacy Policy
              </a>
              . You can unsubscribe any time.
            </small>
          </div>
        </div>
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <div className="cds-api-rule" />
        <Footer />
      </TemplateBlock>
    </>
  )
}

// The page's own things for the demo cursor, wide and again at a phone's
// width. The scrolling and resizing around them are the template figure's
// (`around` in template.tsx), which also leaves the site's header alone.
const API_DEMO: Array<DemoStep> = [
  { on: ".cds-api-hero .cds-btn", text: "Start building", rest: 900 },
  { on: ".cds-api-hero .cds-btn", text: "See developer docs", rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-api-hero .cds-btn", text: "Start building", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function ApiDoc() {
  return (
    <Section>
      <TemplateFigure steps={API_DEMO}>
        <Api />
      </TemplateFigure>
    </Section>
  )
}
