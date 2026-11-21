import { useState } from "react"
import {
  AnalysisMetadata,
  ArticlePage,
  TableOfContents,
} from "@/components/work/anthropic/pages/organisms-article/hero"
import {
  FlyoutForm,
  FormDropdown,
  FormLink,
  InterestForm,
} from "@/components/work/anthropic/pages/organisms-article/form"
import {
  StatItem,
  Stats,
} from "@/components/work/anthropic/pages/organisms-article/stats"
import {
  ArticleText,
  Blockquote,
  Citation,
  DropCapParagraph,
  Footnote,
  FootnoteNote,
  LongRead,
  PARAGRAPHS,
  SpotlightQuote,
  TextLink,
} from "@/components/work/anthropic/pages/organisms-article/typography"
import { Button } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { Cell, Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type {
  StatSize,
  StatType,
} from "@/components/work/anthropic/pages/organisms-article/stats"

// The organisms article chapters of the Anthropic.com docs: each chapter's slug
// (as listed in ../docs.ts) and the component that draws it. The organisms
// themselves are in ./organisms-article/, exported for the templates to use.

/**
 * A stretch of a piece's text as a skeleton, with something real in it: the
 * column a long piece's text keeps to, lines before and after.
 */
function InText({
  before = 2,
  after = 1,
  children,
}: {
  before?: number
  after?: number
  children: React.ReactNode
}) {
  return (
    <div className="ads-lr-page">
      <div className="ads-lr-column">
        {Array.from({ length: before }, (_, i) => (
          <Lines key={`b${i}`} count={4} last={i % 2 ? "54%" : "72%"} />
        ))}
        {children}
        {Array.from({ length: after }, (_, i) => (
          <Lines key={`a${i}`} count={4} last="64%" />
        ))}
      </div>
    </div>
  )
}

// What the demo cursor tries on the hero, which it keeps in view: a button,
// a part in the contents, and the mission pillar's note; then the page at a
// desktop's width, where the contents fold into the bar (opened and shut)
// and the metadata lines up under the picture (its authors shown in full),
// a tablet's, and a phone's.
const HERO_DEMO: Array<DemoStep> = [
  { on: ".ads-art-ctas .ads-btn", nth: 0, rest: 700 },
  { on: ".ads-art-toc .ads-toc-row", text: "05", rest: 700 },
  { on: ".ads-meta-info", rest: 2200 },
  { on: ".cds-resize-grip", nth: 1, drag: 800, rest: 600 },
  { on: ".ads-toc-bar-toggle", click: "open", rest: 1200 },
  { on: ".ads-toc-bar-toggle", click: "close", rest: 300 },
  { on: ".ads-meta-more", click: true, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 640, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 420, rest: 1600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

// The Team hero's cursor only narrows it, through the same widths.
const TEAM_DEMO: Array<DemoStep> = [
  { on: ".ads-art-ctas .ads-btn", nth: 1, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 800, rest: 1400 },
  { on: ".cds-resize-grip", nth: 1, drag: 640, rest: 1400 },
  { on: ".cds-resize-grip", nth: 1, drag: 420, rest: 1600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

// What the demo cursor does with the contents of a piece: goes to three
// parts beside the text, then at a desktop's width and a phone's picks
// parts from the bar they fold into, and goes back to the top.
const TOC_DEMO: Array<DemoStep> = [
  { on: ".ads-toc-row", text: "03", click: true, rest: 900 },
  { on: ".ads-toc-row", text: "06", click: true, rest: 1400 },
  { on: ".ads-toc-row", text: "02", click: true, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 800 },
  { on: ".ads-toc-bar-toggle", click: "open", rest: 600 },
  { on: ".ads-toc-bar .ads-toc-row", text: "04", click: true, rest: 1400 },
  { on: ".cds-resize-grip", nth: 1, drag: 420 },
  { on: ".ads-toc-bar-toggle", click: "open", rest: 600 },
  { on: ".ads-toc-bar .ads-toc-row", text: "07", click: true, rest: 1400 },
  { on: ".ads-art-scroll", scroll: 0, rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

/** The sizes the article's figures name: the file's devices it follows. */
const ARTICLE_SIZES: Array<[string, number?]> = [
  ["Desktop XXL"],
  ["Desktop LG", 959],
  ["Tablet MD", 719],
  ["Mobile XS", 559],
]

/**
 * The top of a piece in a window, as a figure the grips narrow. A hero's
 * figure (`whole`) is tall enough to show all of the widest hero, metadata
 * and all, as the file's frames do.
 */
function ArticleFigure({
  steps,
  type,
  whole = false,
}: {
  steps: Array<DemoStep>
  type?: "news" | "team"
  whole?: boolean
}) {
  return (
    <Specimen figure>
      <DemoCursor steps={steps}>
        <Resizable
          label="Page width"
          min={360}
          bleed
          sizes={ARTICLE_SIZES}
          className={
            whole ? "h-[640px] sm:h-[900px]" : "h-[640px] sm:h-[780px]"
          }
        >
          <ArticlePage type={type} />
        </Resizable>
      </DemoCursor>
    </Specimen>
  )
}

const META_DEMO: Array<DemoStep> = [
  { on: ".ads-toc-row", text: "02", click: true },
  { on: ".ads-toc-row", text: "05", click: true },
  { on: ".ads-meta-info", rest: 2200 },
  { on: ".ads-meta-more", click: true, rest: 1200 },
  { on: ".ads-toc-row", text: "01", click: true, rest: 800 },
]

/** The contents beside the metadata list, a part marked as in view. */
function MetaAndContents() {
  const [current, setCurrent] = useState(0)
  return (
    <div className="ads-art-pair">
      <AnalysisMetadata />
      <TableOfContents current={current} onPick={setCurrent} />
    </div>
  )
}

function ArticleDoc() {
  return (
    <>
      <Section
        title="Article Hero"
        caption="Two types: News, half its headline in the serif and its picture narrower, and Team, all sans, its picture the page’s width. At the widest the contents run down the left and the metadata down the right; narrower, the contents fold into a bar under the header and the metadata lines up under the picture."
      >
        <ArticleFigure steps={HERO_DEMO} type="news" whole />
        <ArticleFigure steps={TEAM_DEMO} type="team" whole />
      </Section>
      <Section
        title="Analysis Metadata & Table of Contents"
        caption="Each line of metadata pairs a label with a value, a list, or share links, and a label can carry a note. The contents number each part and mark the one being read, beside the text at the widest size and in the bar under the header narrower."
      >
        <Specimen figure>
          <DemoCursor steps={META_DEMO} className="p-6 md:p-10">
            <MetaAndContents />
          </DemoCursor>
        </Specimen>
        <ArticleFigure steps={TOC_DEMO} />
      </Section>
    </>
  )
}

const TYPE_DEMO: Array<DemoStep> = [
  { on: ".ads-lr-citation", rest: 2400 },
  { on: ".ads-lr-link:not(.ads-lr-citation)", rest: 600 },
  { on: "button.ads-lr-mark", click: "open", rest: 600 },
  { on: ".ads-lr-card-close", click: true, rest: 400 },
  { on: ".ads-lr-page", scroll: 100 },
  { on: ".ads-lr-page", scroll: 0, rest: 800 },
]

const CITE_DEMO: Array<DemoStep> = [
  { on: ".ads-lr-citation", rest: 2400 },
  { on: ".ads-lr-link:not(.ads-lr-citation)", rest: 600 },
  { on: "button.ads-lr-mark", click: "open", rest: 2000 },
  { on: ".ads-lr-card-close", click: true, rest: 600 },
]

function ArticleTypographyDoc() {
  return (
    <>
      <Section
        title="In a Long Read"
        caption="A stretch of a piece in the serif: a drop cap, links, a citation, a footnote, a list, and both quotes."
      >
        <Specimen figure>
          <DemoCursor steps={TYPE_DEMO}>
            <Resizable
              label="Page width"
              min={360}
              bleed
              sizes={[["Desktop"], ["Mobile", 559]]}
              className="h-[640px] sm:h-[720px]"
            >
              <div className="ads-lr-page" data-scrolls>
                <div className="ads-lr-column">
                  <LongRead />
                </div>
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
      <Section
        title="Drop Caps & Small Caps"
        caption="The file’s editorial styles: three drop caps and three small caps, a pair for each body size."
      >
        <Specimen
          figure
          className="grid gap-8 p-6 md:grid-cols-3 md:gap-10 md:p-10"
        >
          {([1, 2, 3] as const).map((size) => (
            <Cell key={size} label={`Body ${size}`} className="!block">
              <DropCapParagraph size={size} lead="Millions of people">
                {PARAGRAPHS.millions.slice("Millions of people".length)}
              </DropCapParagraph>
            </Cell>
          ))}
        </Specimen>
      </Section>
      <Section
        title="Spotlight Quote & Blockquote"
        caption="The spotlight quote, Large or Medium, centered over a name and a role. The blockquote, Large or Small, ruled at the left over its citation."
      >
        <Specimen figure className="grid gap-10 p-6 md:grid-cols-2 md:p-10">
          <Cell label="Spotlight quote, Large" className="!block">
            <SpotlightQuote size="large" />
          </Cell>
          <Cell label="Spotlight quote, Medium" className="!block">
            <SpotlightQuote size="medium" />
          </Cell>
          <Cell label="Blockquote, Large" className="!block">
            <Blockquote size="large" />
          </Cell>
          <Cell label="Blockquote, Small" className="!block">
            <Blockquote size="small" />
          </Cell>
        </Specimen>
      </Section>
      <Section
        title="Citation, Footnote & Link"
        caption="A link can open a card about its term. A footnote prints under its paragraph, or opens beside its marker."
      >
        <Specimen figure>
          <DemoCursor steps={CITE_DEMO} className="px-6 py-10 md:py-14">
            <ArticleText className="ads-lr-narrow">
              <p>
                To test <Citation>Anthropic Interviewer</Citation>, we had it
                run 1,250 interviews with professionals—the general workforce
                (N=1,000), scientists (N=125), and creatives (N=125)—about their
                views on AI. We’re publicly releasing all interview data from
                this initial test (with participant consent) for researchers to
                explore.
              </p>
              <div>
                <p>
                  To test Anthropic Interviewer,
                  <Footnote n={1} /> we had it run 1,250 interviews with
                  professionals. Briefly, here are some examples of what we
                  found:
                </p>
                <FootnoteNote n={1} />
              </div>
              <p>
                If we want a comprehensive picture of AI’s changing role in
                people’s lives, and to center humans in the development of
                models, we need to ask people <TextLink>directly</TextLink>.
                <Footnote n={2} contextual />
              </p>
            </ArticleText>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

const STAT_TYPES: Array<[StatType, string]> = [
  ["center", "Center"],
  ["left", "Left"],
  ["single", "Single"],
]
const STAT_SIZES: Array<[StatSize, string]> = [
  ["medium", "Medium"],
  ["large", "Large"],
]

const STATS_DEMO: Array<DemoStep> = [
  { on: ".ads-stats .ads-btn", nth: 1, click: true, rest: 600 },
  { on: ".ads-stats .ads-btn", nth: 1, click: true, rest: 900 },
  { on: ".ads-stats .ads-btn", nth: 0, click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 400 },
  { on: ".ads-stats .ads-btn", nth: 1, click: true, rest: 900 },
  { on: ".ads-stats .ads-btn", nth: 1, click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

function StatsDoc() {
  return (
    <>
      <Section
        title="Stat Item"
        caption="Three types, Center, Left, and Single, each Medium or Large: a figure over its description and caption, or beside them."
      >
        <Specimen
          figure
          className="grid gap-x-8 gap-y-10 p-6 md:grid-cols-2 md:p-10"
        >
          {STAT_TYPES.map(([type, typeName]) =>
            STAT_SIZES.map(([size, sizeName]) => (
              <Cell
                key={`${size}-${type}`}
                label={`${typeName}, ${sizeName}`}
                className="!block"
              >
                <StatItem type={type} size={size} />
              </Cell>
            ))
          )}
        </Specimen>
      </Section>
      <Section
        title="Stats"
        caption="In a piece’s text, stats turn in pages, two at a time and one on a phone, with pagination under them. A single stat stands alone."
      >
        <Specimen figure>
          <DemoCursor steps={STATS_DEMO}>
            <Resizable
              label="Page width"
              min={360}
              bleed
              sizes={[["Desktop"], ["Mobile", 479]]}
              className="min-h-[760px] sm:h-[760px]"
            >
              <InText before={2} after={1}>
                <Stats />
                <Lines count={4} last="58%" />
                <div className="ads-stats-single">
                  <StatItem type="single" />
                </div>
              </InText>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

const FORM_DEMO: Array<DemoStep> = [
  { on: ".ads-input:not(.ads-select)", nth: 0, type: "Ada" },
  { on: ".ads-input:not(.ads-select)", nth: 1, type: "Lovelace" },
  { on: ".ads-input:not(.ads-select)", nth: 2, type: "ada@example.com" },
  { on: ".ads-select", nth: 0, click: "open", rest: 600 },
  { on: '[role="option"]', text: "Option 2", click: true },
  // The labels: the first four are the radios', the next four the boxes'.
  { on: ".ads-form .ads-choice", nth: 1, click: true },
  { on: ".ads-form .ads-choice", nth: 4, click: true },
  { on: ".ads-form .ads-choice", nth: 6, click: true },
  { on: ".ads-form .ads-btn[type='submit']", click: true, rest: 800 },
  { on: ".ads-form .ads-choice", nth: 4, click: true },
  { on: ".ads-form .ads-choice", nth: 6, click: true, rest: 600 },
]

const PLACES_DEMO: Array<DemoStep> = [
  { on: ".ads-form-dropdown-button", click: "open", rest: 600 },
  { on: ".ads-input:not(.ads-select)", nth: 0, type: "Ada" },
  { on: ".ads-lr-page", scroll: 60 },
  { on: ".ads-lr-page", scroll: 0, rest: 600 },
  { on: ".ads-form-dropdown-button", click: "close", rest: 1200 },
]

const FLYOUT_DEMO: Array<DemoStep> = [
  { on: ".ads-form-flyout .ads-input:not(.ads-select)", nth: 0, type: "Ada" },
  {
    on: ".ads-form-flyout .ads-input:not(.ads-select)",
    nth: 2,
    type: "ada@example.com",
  },
  { on: ".ads-form-flyout-head .ads-btn", click: true, rest: 600 },
  { on: ".ads-form-open", click: true, rest: 1400 },
]

/** The flyout over a piece, with the button in the text that opens it. */
function FlyoutFigure() {
  const [open, setOpen] = useState(true)
  return (
    <div className="ads-form-stage">
      <InText before={2} after={3}>
        <div>
          <Button
            variant="secondary"
            size="large"
            className="ads-form-open"
            onClick={() => setOpen(true)}
          >
            Subscribe
          </Button>
        </div>
      </InText>
      <FlyoutForm open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function FormDoc() {
  return (
    <>
      <Section
        title="Fields"
        caption="A work in progress in the file: required fields, some with a hint under the label, two dropdowns, radios and checkboxes, a note, and a button to send."
      >
        <Specimen figure>
          <DemoCursor
            steps={FORM_DEMO}
            className="flex justify-center px-6 py-10 md:py-14"
          >
            <InterestForm className="ads-form-solo" />
          </DemoCursor>
        </Specimen>
      </Section>
      <Section
        title="In a Long Read"
        caption="The file places the form in a piece’s text, behind a button that leads away or one that opens it underneath, and in a panel from the side."
      >
        <Specimen figure>
          <DemoCursor steps={PLACES_DEMO}>
            <div className="h-[560px] sm:h-[640px]">
              <div className="ads-lr-page" data-scrolls>
                <div className="ads-lr-column">
                  <Lines count={4} last="72%" />
                  <FormDropdown />
                  <Lines count={4} last="58%" />
                  <div>
                    <FormLink />
                  </div>
                  <Lines count={4} last="66%" />
                  <Bar w="40%" h={20} />
                  <Lines count={5} last="48%" />
                </div>
              </div>
            </div>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={FLYOUT_DEMO}>
            <div className="h-[640px] sm:h-[720px]">
              <FlyoutFigure />
            </div>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

export const ORGANISMS_ARTICLE: Record<string, () => React.ReactNode> = {
  article: ArticleDoc,
  "article-typography": ArticleTypographyDoc,
  stats: StatsDoc,
  form: FormDoc,
}
