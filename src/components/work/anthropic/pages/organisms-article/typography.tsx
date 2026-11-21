import { useCallback, useState } from "react"
import { TbX } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { cn } from "@/lib/utils"

// A long piece's text on Anthropic.com, from the Figma file's "Typography"
// section of article-related organisms (Organisms page): its two quotes
// (the "Spotlight quote" and "Blockquote" components), citations, footnotes
// and links, with the file's editorial text styles (Drop Cap 1–3 and Small
// Caps 1–3) and its sample words. The styles are `.ads-lr-*` in
// src/anthropic/organisms-article.css.

/** The file's sample paragraphs. */
export const PARAGRAPHS = {
  millions:
    "Millions of people now use AI every day. As a company developing AI systems, we want to know how and why they’re doing so, and how it affects them. In part, this is because we want to use people’s feedback to develop better products—but it’s also because understanding people’s interactions with AI is one of the great sociological questions of our time.",
  recently:
    "We recently designed a tool to investigate patterns of AI use while protecting our users’ privacy. It enabled us to analyze changing patterns of AI use across the economy. But the tool only allowed us to understand what was happening within conversations with Claude. What about what comes afterwards? How are people actually using Claude’s outputs? How do they feel about it? What do they imagine the role of AI to be in their future?",
  project:
    "Such a project would require us to run many hundreds of interviews. Here, we enlisted AI to help us do so. We built an interview tool called Anthropic Interviewer. Powered by Claude, Anthropic Interviewer runs detailed interviews automatically at unprecedented scale, feeding its results back to human researchers for analysis.",
}

export const QUOTE =
  "“Time to go zooooom! Chase dog then run away. Sleeps on my human’s head. Mew for food at 4am. Get video posted to internet for chasing red dot. Tuxedo cats always looking dapper.”"

const FOOTNOTE =
  "We started work with Claude Sonnet 3.6 because it was Anthropic’s most advanced model at the time we began this research."

const RISKS = {
  title: "More about “risks”…",
  text: "The potential harms AI could cause—from misalignment and misuse to unintended failures and societal disruption.",
}

/**
 * A paragraph that opens with a drop cap and its first words in small caps:
 * the file's Drop Cap and Small Caps styles come in three sizes, one pair
 * for each body size (`.ads-drop-cap-*` and `.ads-small-caps-*`, in
 * src/anthropic/foundations.css).
 */
export function DropCapParagraph({
  size = 2,
  lead,
  children,
}: {
  size?: 1 | 2 | 3
  /** The words after the drop cap that are set in small caps. */
  lead: string
  children: React.ReactNode
}) {
  return (
    <p className={cn(`ads-body-${size}-serif`, "ads-lr-drop")} data-size={size}>
      <span className={`ads-drop-cap-${size}`} aria-hidden>
        {lead[0]}
      </span>
      <span className={`ads-small-caps-${size}`}>
        <span className="sr-only">{lead[0]}</span>
        {lead.slice(1)}
      </span>
      {children}
    </p>
  )
}

/**
 * The spotlight quote: centered, in the serif, over the name of who said it
 * and their role. Two sizes, Large and Medium.
 */
export function SpotlightQuote({
  size = "large",
  text = QUOTE,
  name = "First McLastname (optional)",
  role = "Role (optional)",
}: {
  size?: "large" | "medium"
  text?: string
  name?: string
  role?: string
}) {
  return (
    <figure className="ads-lr-spotlight" data-size={size}>
      <blockquote
        className={
          size === "large" ? "ads-heading-3-serif" : "ads-heading-4-serif"
        }
      >
        {text}
      </blockquote>
      <figcaption className="ads-caption-2">
        <span>{name}</span>
        <span>{role}</span>
      </figcaption>
    </figure>
  )
}

/**
 * The blockquote: ruled at the left, in the serif, over its citation. Two
 * sizes, Large and Small.
 */
export function Blockquote({
  size = "large",
  text = QUOTE,
  cite = "Cited Author’s Name",
  title = "Title",
}: {
  size?: "large" | "small"
  text?: string
  cite?: string
  title?: string
}) {
  return (
    <figure className="ads-lr-blockquote" data-size={size}>
      <blockquote
        className={size === "large" ? "ads-body-1-serif" : "ads-body-3-serif"}
      >
        {text}
      </blockquote>
      <figcaption className="ads-caption-2">
        {cite}, <span>{title}</span>
      </figcaption>
    </figure>
  )
}

/** A link in the text: underlined, in the text's own color. */
export function TextLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="ads-lr-link"
      onClick={(e) => e.preventDefault()}
      {...quiet}
    >
      {children}
    </a>
  )
}

/**
 * A link that explains its term: a card opens from it, on hover or a press,
 * with the term's definition and a button to read more.
 */
export function Citation({
  title = RISKS.title,
  text = RISKS.text,
  children,
}: {
  title?: string
  text?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)
  return (
    <span
      className="ads-lr-pop-anchor"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="ads-lr-link ads-lr-citation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        {...quiet}
      >
        {children}
      </button>
      {open && (
        <span ref={ref} role="dialog" className="ads-lr-card" data-kind="cite">
          <span className="ads-lr-card-head">
            <span className="ads-heading-6 ads-lr-card-title">{title}</span>
            <button
              type="button"
              className="ads-lr-card-close"
              aria-label="Close"
              onClick={close}
              {...quiet}
            >
              <TbX aria-hidden />
            </button>
          </span>
          <span className="ads-caption-1 ads-lr-card-text">{text}</span>
          <Button variant="tertiary" size="small" icon="trailing">
            View more
          </Button>
        </span>
      )}
    </span>
  )
}

/**
 * A footnote's marker. Inline, it only points to the note printed under the
 * paragraph (`FootnoteNote`); contextual, a press opens the note beside it.
 */
export function Footnote({
  n = 1,
  text = FOOTNOTE,
  contextual = false,
}: {
  n?: number
  text?: string
  contextual?: boolean
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)
  const label = String(n).padStart(2, "0")
  if (!contextual) return <sup className="ads-lr-mark">{label}</sup>
  return (
    <span className="ads-lr-pop-anchor">
      <button
        type="button"
        className="ads-lr-mark"
        aria-label={`Footnote ${n}`}
        aria-expanded={open}
        onClick={() => setOpen((now) => !now)}
        {...quiet}
      >
        {label}
      </button>
      {open && (
        <span ref={ref} role="note" className="ads-lr-card" data-kind="note">
          <span className="ads-lr-card-head">
            <span className="ads-caption-2-mono ads-lr-card-num">{label}</span>
            <span className="ads-caption-1 ads-lr-card-text">{text}</span>
            <button
              type="button"
              className="ads-lr-card-close"
              aria-label="Close"
              onClick={close}
              {...quiet}
            >
              <TbX aria-hidden />
            </button>
          </span>
        </span>
      )}
    </span>
  )
}

/** An inline footnote's note, printed under its paragraph. */
export function FootnoteNote({
  n = 1,
  text = FOOTNOTE,
}: {
  n?: number
  text?: string
}) {
  return (
    <p className="ads-lr-note">
      <span className="ads-caption-2-mono">{String(n).padStart(2, "0")}</span>
      <span className="ads-caption-1">{text}</span>
    </p>
  )
}

/** A bulleted list, each point opening with a sentence in bold. */
export function LeadList({
  items,
}: {
  items: Array<[lead: string, rest: string]>
}) {
  return (
    <ul className="ads-lr-list">
      {items.map(([lead, rest]) => (
        <li key={lead}>
          <strong>{lead}</strong> {rest}
        </li>
      ))}
    </ul>
  )
}

/** The file's sample findings, as a list. */
export const FINDINGS: Array<[string, string]> = [
  [
    "In our sample, people are optimistic about the role AI plays in their work.",
    "Positive sentiments characterized the majority of topics discussed. However, a small number of topics such as educational integration, artist displacement, and security concerns, came with more pessimistic outlooks.",
  ],
  [
    "People from the general workforce want to preserve tasks that define their professional identity while delegating routine work to AI.",
    "They envision futures where routine tasks are automated and their role shifts to overseeing AI systems.",
  ],
]

/**
 * The text of a long piece: the serif body, Body 1 as in the file's pieces,
 * with room between paragraphs. `size` is the body size, 1 to 3.
 */
export function ArticleText({
  size = 1,
  className,
  children,
}: {
  size?: 1 | 2 | 3
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(`ads-body-${size}-serif`, "ads-lr", className)}>
      {children}
    </div>
  )
}

/**
 * A stretch of a long piece with everything its text can hold: a part's
 * heading, a paragraph opening with a drop cap, links, a citation, both
 * kinds of footnote, a list, and the two quotes.
 */
export function LongRead() {
  return (
    <ArticleText>
      <h2 className="ads-heading-4">Introduction</h2>
      <DropCapParagraph size={1} lead="Millions of people">
        {PARAGRAPHS.millions.slice("Millions of people".length)}
      </DropCapParagraph>
      <p>
        We recently designed <TextLink>a tool</TextLink> to investigate patterns
        of AI use while protecting our users’ privacy. It enabled us to analyze
        changing patterns of AI use <TextLink>across the economy</TextLink>. But
        the tool only allowed us to understand what was happening within
        conversations with Claude.
      </p>
      <SpotlightQuote size="medium" />
      <p>
        To test <Citation>Anthropic Interviewer</Citation>, we had it run 1,250
        interviews with professionals—the general workforce (N=1,000),
        scientists (N=125), and creatives (N=125)—about their views on AI.
        Briefly, here are some examples of what we found:
      </p>
      <LeadList items={FINDINGS} />
      <h3 className="ads-heading-5">Method</h3>
      <p>
        Such a project would require us to run many hundreds of interviews.
        Here, we enlisted AI to help us do so. We built an interview tool called
        Anthropic Interviewer.
        <Footnote n={1} contextual />
      </p>
      <Blockquote size="small" />
    </ArticleText>
  )
}
