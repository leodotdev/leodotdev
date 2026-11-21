import { TbPlayerPlayFilled, TbSparkles } from "react-icons/tb"
import { LinkCard } from "@/components/work/claude/pages/cards"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { Deck } from "@/components/work/claude/deck"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Customer Story template (the "Customer story" frame on the Figma
// file's Templates page): one customer's story, told between the organisms
// the other tabs document. The site navigation, the section header, the
// story's details, both quotes, a marginalia card, link cards, and the
// footer. Its words are the file's. What is new here is only what the page
// adds around them: the customer's logo on a tile, the story's two columns,
// and the stack of featured stories.

const ART = "/work/claude/illustrations"
const LOGOS = "/work/claude/logos"
const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const FACTS = [
  ["Industry:", "Software"],
  ["Company size:", "Large"],
  ["Product:", "AI Platform"],
  ["Partner:", "Amazon Web Service"],
  ["Location:", "United States"],
] as const

const RESULTS = [
  ["2x faster", "response times with Claude 3.5 Sonnet"],
  ["2x more accurate", "advanced problem solving with Claude 3 Opus"],
] as const

const GAINS = [
  "2x faster response times with Claude 3.5 Sonnet",
  "2x more accurate results with Claude 3 Opus",
  "<3 seconds for Claude 3 Haiku to read dense research",
]

// The stack's three cards, the one on top first. The file gives all three
// the same story.
const FEATURED = ["Creator stories", "Featured Story", "Featured Story"]
const FEATURE =
  "From trip planning to content strategy—one Brooklyn creator's Claude workflow."

const RELATED = [
  "Gradient Labs transforms financial services customer support with Claude",
  "Circleback transforms meetings into structured insights with Claude",
  "Tines transforms workflow automation with Claude in Amazon Bedrock",
  "StubHub transforms live event ticketing with Claude",
]

/**
 * The featured stories: a deck of marginalia cards, the current one on top
 * and the next leaning out from behind it, over the carousel's controls
 * (`Deck`).
 */
function Featured() {
  return (
    <Deck
      className="cds-story-stack"
      cards={FEATURED.map((label, i) => (
        <div key={i} className="cds-margin">
          <div className="cds-margin-card">
            <div className="cds-margin-head">
              <TbSparkles aria-hidden />
              {label}
            </div>
            <div className="cds-margin-media" data-type="video">
              <button
                type="button"
                className="cds-play"
                aria-label="Play"
                {...quiet}
              >
                <TbPlayerPlayFilled aria-hidden />
              </button>
            </div>
            <p>{FEATURE}</p>
          </div>
        </div>
      ))}
    />
  )
}

/**
 * The page. The hero is on Ivory, the story itself on White, and the related
 * stories on Ivory again, over the Dark 3 footer. On the site's dark mode
 * they are Dark 3 and Dark 2.
 */
function CustomerStory() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation
          crumbs={["Customer stories", "Perplexity"]}
          more="From Claude"
        />
        <div className="cds-story-hero">
          <Header
            size="p1"
            title="Perplexity delivers factual and relevant answers with Claude"
            subtitle={null}
            pictogram={null}
            actions={
              <>
                <Button size="large" icon="none">
                  Try Claude
                </Button>
                <Button size="large" variant="secondary" icon="none">
                  Contact sales
                </Button>
              </>
            }
          />
          <div className="cds-story-lead">
            <div className="cds-story-brand">
              <img
                src={`${LOGOS}/perplexity.svg`}
                alt="Perplexity"
                width={105}
                height={22}
                draggable={false}
              />
            </div>
            <div className="cds-meta">
              <div>
                <dl>
                  {FACTS.map(([term, value]) => [
                    <dt key={term}>{term}</dt>,
                    <dd key={`${term}-value`}>{value}</dd>,
                  ])}
                </dl>
              </div>
              {RESULTS.map(([figure, note]) => (
                <div key={figure}>
                  <strong>{figure}</strong>
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <div className="cds-story-copy">
          <h4 className="cds-headline-4">
            <img src={`${ART}/hand-shapes.svg`} alt="" />
            The problem
          </h4>
          <div className="cds-story-text">
            <p className="cds-body-1">
              Perplexity, a conversational answer engine, uses the Claude model
              family to deliver factual and relevant search results to users. By
              employing various models—Claude 3.5 Sonnet, Claude 3 Opus, and
              Claude 3 Haiku—Perplexity optimizes cost, performance, and
              accuracy for both its free and paid users.
            </p>
            <div>
              <h5 className="cds-headline-5">Claude helps Perplexity to:</h5>
              <ul>
                {GAINS.map((gain) => (
                  <li key={gain}>{gain}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="cds-headline-5">
                Using Claude to help generate answers
              </h5>
              <p className="cds-body-1">
                Perplexity is on a mission to change the way that we seek and
                discover information online using generative artificial
                intelligence. Founded in 2022, the startup integrates LLMs with
                information on the internet to provide users with comprehensive
                and contextually relevant answers to their queries. These
                responses include citations to help users verify the factuality
                of the chatbot’s sourcing.
              </p>
            </div>
            <blockquote className="cds-quote-inline">
              <p>
                “We’re automating the mundane. 80% of Sales work today is
                manual, laborious, data work. In the era of AI, humans can focus
                on truly human, creative work, and we can leave the data work in
                the hands of AI.”
              </p>
              <footer>Matthew Quan, Enterprise Growth Lead, Clay</footer>
            </blockquote>
          </div>
        </div>

        {/* The photograph the file has here: a plain tile stands in for it. */}
        <div className="cds-story-picture" aria-hidden />

        <div className="cds-story-copy">
          <h4 className="cds-headline-4">
            <img src={`${ART}/hand-bolt.svg`} alt="" />
            The solution
          </h4>
          <div className="cds-story-text" data-close>
            <p className="cds-body-1">
              Claude models play different roles across a variety of use cases.
              Perplexity uses Claude 3 Haiku, the fastest and most
              cost-effective model for its intelligence category, in its free
              tier. Haiku can read a data-dense research paper with charts and
              graphs in less than 3 seconds—allowing Perplexity to offer a
              high-quality experience for free users without affecting financial
              sustainability.
            </p>
            <p className="cds-body-1">
              For paid users, Perplexity offers a choice between Claude 3 Opus
              and Claude 3.5 Sonnet. These models cater to users who require the
              most advanced reasoning capabilities and desire top performance.
              Claude 3 Opus outperforms its peers on most of the common
              evaluation benchmarks for AI systems and is 2x more accurate than
              Claude 2.1. Claude 3.5 Sonnet offers similar intelligence and is
              2x faster than Claude 3 Opus—this performance boost, combined with
              its cost-effective pricing, makes Claude 3.5 Sonnet ideal for
              complex, context-sensitive tasks. By offering these advanced
              models, Perplexity provides paid users with a more premium
              experience.
            </p>
          </div>
        </div>

        <figure className="cds-pullquote m-0">
          <blockquote>
            “Claude has consistently demonstrated a remarkable capacity for
            reasoning and provides well-balanced answers”
          </blockquote>
          <figcaption className="cds-attribution items-center">
            Aarash Heydari
            <span>Infrastructure engineer, Perplexity</span>
          </figcaption>
        </figure>

        <div className="cds-story-copy">
          <Featured />
          <div className="cds-story-text" data-close>
            <h5 className="cds-headline-5">Looking to the future</h5>
            <p className="cds-body-1">
              Using the family of Claude models, Perplexity can continue to
              provide users with a search experience that is accurate,
              comprehensive, and trustworthy. “Our goal is to consistently
              deliver an exceptional question-answering service to our users,”
              says Heydari. “By integrating Anthropic’s most advanced Claude
              models with our RAG system, we’ve found a winning formula that
              helps us meet the needs of our free and paid users.”
            </p>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Related stories"
          subtitle={null}
          pictogram={`${ART}/object-book.svg`}
          actions={null}
        />
        <div className="cds-card-links cds-story-related">
          {RELATED.map((title) => (
            <LinkCard key={title} title={title} kind="Customer story" />
          ))}
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
const CUSTOMER_STORY_DEMO: Array<DemoStep> = [
  { on: ".cds-story-hero .cds-btn", text: "Try Claude", rest: 900 },
  { on: ".cds-story-hero .cds-btn", text: "Contact sales", rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-story-hero .cds-btn", text: "Try Claude", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function CustomerStoryDoc() {
  return (
    <Section>
      <TemplateFigure steps={CUSTOMER_STORY_DEMO}>
        <CustomerStory />
      </TemplateFigure>
    </Section>
  )
}
