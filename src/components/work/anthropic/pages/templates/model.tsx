import { useState } from "react"
import { TbArrowRight } from "react-icons/tb"
import {
  PageBlock,
  PageSection,
  TemplateFigure,
} from "@/components/work/anthropic/template"
import {
  Accordion,
  LatestUpdates,
} from "@/components/work/anthropic/pages/organisms-content"
import { QuoteCarousel } from "@/components/work/anthropic/pages/organisms-media"
import { TextLink } from "@/components/work/anthropic/pages/organisms-article/typography"
import {
  Footer,
  SiteNavigation,
} from "@/components/work/anthropic/pages/organisms-site"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Model template (the Claude Sonnet page, 13166:45359, in the "Cleaned
// up" section of the Figma file's "Reskinned pages"): a model's own page.
// Its hero is the model's wordmark over a line and two buttons; its body is
// one column of reading, the latest updates first, then availability and
// pricing, use cases, the benchmarks (which the file pastes in as a
// picture, built here as a table), trust and safety, customers' quotes,
// and the questions people ask; "See Claude in Action" offers three
// prompts; the footer closes it. The words are the file's; the wordmark was
// exported from it (public/work/anthropic/templates/model/).

const ART = "/work/anthropic/templates/model"

/**
 * The model's wordmark, "Claude Sonnet": the words take the text color (an
 * exported outline used as a mask), the spark keeps its Clay.
 */
function Wordmark() {
  return (
    <h1 className="ads-model-logo" aria-label="Claude Sonnet">
      <span
        className="ads-model-logo-word"
        style={
          { "--logo": `url(${ART}/sonnet-word.svg)` } as React.CSSProperties
        }
      />
      <img src={`${ART}/sonnet-spark.svg`} alt="" draggable={false} />
    </h1>
  )
}

const MODELS = ["Sonnet 5.5", "Sonnet 5", "Opus 5.5", "GPT-6 Sol"]

/** A score, and a note on it (a footnote's number, or the effort it ran at). */
type Score = string | [score: string, mark: string]
type Benchmark = {
  area: string
  test: string
  /** The test's footnote, if it has one. */
  note?: string
  /** One score per model, a pair where the file gives two. */
  scores: Array<Score | Array<[string, string]>>
  /** Which model scored best. */
  best: number
}

const BENCHMARKS: Array<Benchmark> = [
  {
    area: "Agentic coding",
    test: "Terminal-Bench 4.0",
    scores: ["70.6%", "10.3%", ["66.4%", "1"], "—"],
    best: 0,
  },
  {
    area: "Agentic coding",
    test: "FrontierCode 1.1 (Main)",
    scores: [
      [
        ["46.2%", "Max²"],
        ["52.1%", "Xhigh"],
      ],
      "42.4%",
      "54.4%",
      "49.3%",
    ],
    best: 2,
  },
  {
    area: "Agentic coding",
    test: "CursorBench 4.0",
    scores: ["55.5%", "34.1%", "57.8%", "—"],
    best: 2,
  },
  {
    area: "Knowledge work",
    test: "GDPval-AA v2.1",
    note: "3",
    scores: ["1844", "1449", "1846", ["1487", "4"]],
    best: 2,
  },
  {
    area: "Knowledge work",
    test: "AA-Briefcase v1.1",
    note: "3",
    scores: ["1811", "1359", "1822", ["1483", "4"]],
    best: 2,
  },
  {
    area: "Multidisciplinary reasoning",
    test: "Humanity’s Last Exam (with tools)",
    scores: ["64.5%", "54.9%", "67.7%", "—"],
    best: 2,
  },
  {
    area: "Computer use",
    test: "OSWorld 2.1 (partial)",
    scores: ["80.1%", "57.0%", "81.8%", "—"],
    best: 2,
  },
  {
    area: "Visual chart recognition",
    test: "Chartography (no tools)",
    scores: ["61.6%", "15.6%", "64.4%", ["53.6%", "4"]],
    best: 2,
  },
]

const FOOTNOTES = [
  "Terminal-Bench 4.0 results are reported for Claude Opus 5.5 at Xhigh effort which represents the model’s highest score.",
  "Sonnet 5.5 scores lower at Max effort than at Xhigh. FrontierCode evaluates whether a code change could be merged without human edits. It penalizes out-of-scope changes, even if they are high-quality or helpful. At Max effort, Sonnet 5.5 more often ran Claude Code’s code-review skill, which splits the review across many subagents, and in two cases Cognition examined, this led to a timeout or to extra edits beyond the task’s scope, and therefore to a lower score.",
  "Artificial Analysis ran GDPval-AA and AA-Briefcase on a pre-release deployment of Sonnet 5.5 on the Claude Platform, which we found to have a bug that could degrade responses to requests that use structured outputs. We expect the effect on Sonnet 5.5’s scores, if any, to be small and to understate its performance. That bug has since been fixed.",
  "OpenAI recently fixed a bug that degraded image understanding in GPT-6 Sol. Official AA-Briefcase v1.1 and GDPval-AA v2.1 scores from Artificial Analysis, and Chartography scores from Surge AI, may not have been updated yet to reflect the latest version of the model. Artificial Analysis does not expect major impacts to AA-Briefcase v1.1 and GDPval-AA v2.1. Internal testing of Chartography suggests its score was not impacted.",
]

const SUPERSCRIPT: Record<string, string> = {
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
}

function ScoreCell({ score }: { score: Score }) {
  if (typeof score === "string") return <>{score}</>
  const [value, mark] = score
  return (
    <>
      {value}
      {SUPERSCRIPT[mark] ?? <small>{mark}</small>}
    </>
  )
}

/**
 * The benchmarks: a row per test, a column per model, each row's best
 * score set bold on a fill. The model the page is about is outlined; a
 * model's name outlines its column instead, to compare it.
 */
function Benchmarks() {
  const [picked, setPicked] = useState(0)
  return (
    <div className="ads-model-bench">
      <div className="ads-model-bench-scroll">
        <table>
          <thead>
            <tr>
              <td />
              {MODELS.map((model, i) => (
                <th
                  key={model}
                  scope="col"
                  data-picked={picked === i || undefined}
                >
                  <button
                    type="button"
                    aria-pressed={picked === i}
                    onClick={() => setPicked(i)}
                    {...quiet}
                  >
                    {model}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BENCHMARKS.map((row) => (
              <tr key={row.test}>
                <th scope="row">
                  <b>{row.area}</b>
                  <span>
                    {row.test}
                    {row.note && SUPERSCRIPT[row.note]}
                  </span>
                </th>
                {row.scores.map((score, i) => (
                  <td
                    key={i}
                    data-best={row.best === i || undefined}
                    data-picked={picked === i || undefined}
                  >
                    {Array.isArray(score) && Array.isArray(score[0]) ? (
                      (score as Array<[string, string]>).map(([value, at]) => (
                        <span key={value} className="ads-model-bench-pair">
                          {value}
                          <small>{at}</small>
                        </span>
                      ))
                    ) : (
                      <ScoreCell score={score as Score} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ads-model-bench-notes ads-caption-1">
        <p>
          For details on how we run our evaluations, see the Sonnet 5.5 System
          Card.
        </p>
        <ol>
          {FOOTNOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/** A heading and the paragraphs under it, as the file's text column has them. */
function Block({
  title,
  level = 2,
  children,
}: {
  title: string
  level?: 2 | 3
  children?: React.ReactNode
}) {
  const Heading = level === 2 ? "h2" : "h3"
  return (
    <div className="ads-model-block" data-level={level}>
      <Heading className={level === 2 ? "ads-heading-4" : "ads-heading-5"}>
        {title}
      </Heading>
      {children}
    </div>
  )
}

const USES = [
  [
    "Coding",
    "Sonnet 5.5 delivers exceptional coding performance across the entire software development lifecycle. It gets up to speed on a codebase quickly, scopes changes before it starts, and keeps edits small enough to review. It’s built for everyday development like building features, fixing bugs, and reviewing code.",
  ],
  [
    "Agents",
    "Sonnet 5.5 takes on well-defined agent tasks that need reliable execution, like investigation, review, and drafting. It’s the strongest Sonnet yet on long-horizon tasks, and it needs far fewer tokens than Sonnet 5, making it practical to run repeatedly.",
  ],
  [
    "Design and visual work",
    "Sonnet 5.5 is tasteful, with a strong eye for design. It adds polish to user interfaces, creates clearly structured diagrams and user flows, and follows templates to build slides that need minimal editing.",
  ],
  [
    "Enterprise workflows",
    "Sonnet 5.5 brings improvements across knowledge work and office tasks, from analysis to documents and slides. Its writing is clearer and more direct, so drafts need less cleanup.",
  ],
]

// The file's two questions. It writes no answer under the first, which it
// draws closed; this one is the page's own line on when to use the model.
const QUESTIONS = [
  {
    title: "When should I use Claude Sonnet 5?",
    text: "Sonnet 5.5 is a faster, lower-cost complement to Opus 5.5. It excels at well-scoped everyday tasks across coding, agents, and knowledge work.",
  },
  {
    title: "How much does it cost to use Claude Sonnet 5?",
    text: "Pricing depends on how you want to use Sonnet 5. To learn more, check out our pricing page.",
  },
]

const PROMPTS = [
  [
    "Coding",
    "What should I look for when reviewing a Pull Request for a Python web app?",
  ],
  [
    "Writing",
    "Create a 3-month editorial calendar template for a weekly newsletter",
  ],
  ["Students", "What’s an effective study schedule template for final exams?"],
]

/** One of "See Claude in Action": a kind of task, a prompt, and a send button. */
function PromptCard({ kind, prompt }: { kind: string; prompt: string }) {
  return (
    <div className="ads-model-prompt">
      <div className="ads-model-prompt-text">
        <span className="ads-caption-1">{kind}</span>
        <p className="ads-body-2-serif">{prompt}</p>
      </div>
      <div className="ads-model-prompt-controls">
        <button
          type="button"
          className="ads-model-send"
          aria-label={`Ask Claude: ${prompt}`}
          {...quiet}
        >
          <TbArrowRight aria-hidden />
        </button>
      </div>
    </div>
  )
}

/**
 * The page. The hero and body are on Ivory and "See Claude in Action" on
 * Ivory Medium, over the Slate footer; on the Slate dot they are all Slate.
 */
function Model() {
  return (
    <>
      <PageBlock theme={["ivory", "slate"]}>
        <SiteNavigation />
        <div className="ads-model-hero">
          <Wordmark />
          <p className="ads-body-1-serif">
            AI will have a vast impact on the world. Anthropic is a public
            benefit corporation dedicated to securing its benefits and
            mitigating its risks.
          </p>
          <div className="ads-model-ctas">
            <Button>Try Claude</Button>
            <Button variant="secondary">Get API access</Button>
          </div>
        </div>
      </PageBlock>
      <PageBlock theme={["ivory", "slate"]} className="ads-model-body">
        <div className="ads-model-col">
          <LatestUpdates />
          <div className="ads-model-text ads-body-3-serif">
            <Block title="Availability and pricing">
              <p>
                Anyone can chat with Claude using Sonnet 5.5 on Claude.ai,
                available on web, iOS, and Android.
              </p>
              <p>
                For developers interested in building agents, Sonnet 5.5 is
                available on the Claude Platform natively, and in Amazon Web
                Services, Google Cloud, and Microsoft Foundry.
              </p>
              <p>
                Pricing for Sonnet 5.5 will cost up to an estimated 30% less to
                run than Sonnet 5 for typical workloads billed by token.
              </p>
              <p>
                Sonnet 5.5 is priced at $2 per million input tokens and $10 per
                million output tokens, with up to 90% cost savings with{" "}
                <TextLink>prompt caching</TextLink> and 50% cost savings with{" "}
                <TextLink>batch processing</TextLink>. To learn more, check out
                our <TextLink>pricing page</TextLink>. To get started, simply
                use <code className="ads-model-code">claude-sonnet-5-5</code>{" "}
                via the <TextLink>Claude API</TextLink>.
              </p>
              <p>
                For workloads that need to run in the US, US-only inference is
                available at 1.1x pricing for input and output tokens.{" "}
                <TextLink>Learn more</TextLink>.
              </p>
            </Block>
            <Block title="Use cases">
              <p>
                Sonnet 5.5 is a faster, lower-cost complement to Opus 5.5. It
                excels at well-scoped everyday tasks across coding, agents, and
                knowledge work.
              </p>
              <p>
                API users have fine-grained control over the model’s thinking
                effort. Popular use cases include:
              </p>
            </Block>
            {USES.map(([title, text]) => (
              <Block key={title} title={title} level={3}>
                <p>{text}</p>
              </Block>
            ))}
            <Block title="Benchmarks">
              <p>
                Sonnet 5.5 delivers strong results across the benchmarks that
                matter most for real-world deployment, from coding, and
                knowledge work to computer use.
              </p>
            </Block>
          </div>
          <Benchmarks />
          <div className="ads-model-text ads-body-3-serif">
            <Block title="Trust & safety">
              <p>
                We’ve tested and evaluated Sonnet 5.5 against our standards for
                safety, security, and reliability. The accompanying{" "}
                <TextLink>system card</TextLink> covers safety results in depth.
              </p>
            </Block>
            <Block title="Hear from our customers" />
          </div>
          <div className="ads-model-quotes">
            <QuoteCarousel />
          </div>
          <div className="ads-model-faq">
            <Block title="Frequently Asked Questions" />
            <Accordion items={QUESTIONS} initial={1} />
          </div>
        </div>
      </PageBlock>
      <PageSection
        theme={["ivory-medium", "slate"]}
        className="ads-model-action"
      >
        <h2 className="ads-heading-3">See Claude in Action</h2>
        <div className="ads-model-prompts">
          {PROMPTS.map(([kind, prompt]) => (
            <PromptCard key={kind} kind={kind} prompt={prompt} />
          ))}
        </div>
      </PageSection>
      <div>
        <Footer />
      </div>
    </>
  )
}

// Wide, the cursor looks at the hero's buttons and loads more updates; down
// at the benchmarks it outlines Opus 5.5's column to compare, then Sonnet
// 5.5's again; it steps through the quotes, opens the first question, and
// rests on a prompt. Narrow, it looks at the hero's buttons again.
const MODEL_DEMO: Array<DemoStep> = [
  { on: ".ads-model-ctas .ads-btn", text: "Try Claude", rest: 800 },
  { on: ".ads-model-ctas .ads-btn", text: "Get API access", rest: 700 },
  { on: ".ads-updates > .ads-btn", click: true, rest: 800 },
  { on: ".cds-tpl-thumb", drag: 45 },
  {
    on: ".ads-model-bench thead button",
    text: "Opus 5.5",
    click: true,
    rest: 1200,
  },
  {
    on: ".ads-model-bench thead button",
    text: "Sonnet 5.5",
    click: true,
    rest: 800,
  },
  { on: ".cds-tpl-thumb", drag: 72 },
  { on: '.ads-model-quotes [aria-label="Next"]', click: true, rest: 900 },
  { on: ".ads-model-faq .ads-accordion-row", nth: 0, click: true, rest: 1000 },
  { on: ".cds-tpl-thumb", drag: 88 },
  { on: ".ads-model-send", nth: 1, rest: 900 },
  { on: ".cds-tpl-thumb", drag: 0 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".ads-model-ctas .ads-btn", text: "Try Claude", rest: 900 },
]

export function ModelDoc() {
  return (
    <Section>
      <TemplateFigure steps={MODEL_DEMO}>
        <Model />
      </TemplateFigure>
    </Section>
  )
}
