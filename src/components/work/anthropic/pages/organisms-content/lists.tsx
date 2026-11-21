import { useState } from "react"
import { TbArrowRight } from "react-icons/tb"
import { Button } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { cn } from "@/lib/utils"
import {
  ART,
  MenuTopicDate,
  SkelHeading,
  SkelText,
  TinyMore,
  stay,
} from "./shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// List Item, News Item & Related List: rows of posts and links. They follow
// the file's "List Item Card" (four states), "News Item Large" and "News
// Thumbnail Item" (six styles), and the "Constellation Panel" its Related
// List section shows in an article's margin.

const TITLE = "Preparing for AI’s Economics impact: exploring policy responses"
const SUMMARY =
  "The article title indicates it presents a mathematical framework for understanding transformer circuits, which is a core topic in AI interpretability research focused on understanding the internal mechanisms of neural networks."

/**
 * The file's "List Item Card": a topic and a date over a post's title. Under
 * the pointer the card darkens and an arrow follows the title ("Hover
 * Card"); its more button opens a summary and a button to the post
 * ("Expanded"), and turns into a cross that closes it.
 */
export function ListItem({
  tag = "Research",
  date = "Jan. 01, 2026",
  title = TITLE,
  summary = SUMMARY,
  action = "View research",
  more = true,
  className,
}: {
  tag?: string
  date?: string | null
  title?: string
  summary?: string
  action?: string
  /** The file's "Show More Button". */
  more?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn("ads-list-item", className)}
      data-open={open ? "" : undefined}
    >
      <div className="ads-list-item-head">
        <span>{tag}</span>
        {date && <span>{date}</span>}
        {more && <TinyMore open={open} onClick={() => setOpen(!open)} />}
      </div>
      <a className="ads-list-item-title" {...stay}>
        {title}
        <TbArrowRight aria-hidden />
      </a>
      {open && (
        <div className="ads-list-item-summary">
          <p>{summary}</p>
          <div>
            <Button size="small">{action}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

const INDEX = "Economic Index"
const INDEX_TEXT =
  "Claude helps parents tackle the endless list—meal plans, permission slips, homework questions, and logistics—so they can focus on being present instead of just keeping up."

/**
 * The file's "News Item Large": a wide picture beside a post's topic, date,
 * headline, text, and button. `flip` puts the picture on the right. Narrow,
 * the topic and date go above the picture and the rest under it, as the
 * file's mobile variant has them.
 */
export function NewsItem({ flip = false }: { flip?: boolean }) {
  return (
    <article className="ads-news" data-flip={flip ? "" : undefined}>
      <img
        className="ads-news-media"
        src={`${ART}/economic-index.webp`}
        alt=""
        width={1020}
        height={575}
      />
      <MenuTopicDate className="ads-news-meta" />
      <div className="ads-news-body">
        <a className="ads-news-title" {...stay}>
          {INDEX}
        </a>
        <p>{INDEX_TEXT}</p>
        <div>
          <Button variant="secondary" size="small">
            Read more
          </Button>
        </div>
      </div>
    </article>
  )
}

const STORY =
  "ServiceNow chooses Claude to power customer apps and increase internal productivity"
const STORY_TEXT =
  "Anthropic's response to the Secretary of War and advice to customers."

/**
 * The file's "News Thumbnail Item", in four of its six styles: "Default"
 * (a square picture at the left), "Default Smaller Thumb", "Image Right"
 * (with a line of text under the headline), and "Text only". Narrow, the
 * two with a picture at either side become the file's "Mobile Image Left"
 * and "Mobile Image Right": the topic and date above, a small picture
 * beside the headline.
 */
export function NewsThumb({
  style = "default",
}: {
  style?: "default" | "smaller" | "right" | "text"
}) {
  const media = style !== "text" && (
    <img
      className="ads-thumb-media"
      src={`${ART}/servicenow.webp`}
      alt=""
      width={144}
      height={144}
    />
  )
  return (
    <article className="ads-thumb" data-style={style}>
      {style !== "right" && media}
      <MenuTopicDate className="ads-thumb-meta" />
      <div className="ads-thumb-text">
        <a className="ads-thumb-title" {...stay}>
          {STORY}
        </a>
        {style === "right" && <p>{STORY_TEXT}</p>}
      </div>
      {style === "right" && media}
    </article>
  )
}

// The constellation's seven posts: where each sits, from the diagram's top
// left corner, and its picture.
const NODES = [
  [73.16, 0],
  [21.95, 29.26],
  [0, 82.31],
  [59.44, 74.99],
  [111.57, 47.55],
  [171.93, 42.98],
  [227.71, 21.95],
] as const

/** The posts connected to this one, drawn as a constellation. */
export function Constellation({ className }: { className?: string }) {
  return (
    <div className={cn("ads-constellation", className)} aria-hidden>
      <img
        className="ads-constellation-lines ads-art"
        src={`${ART}/constellation-lines.svg`}
        alt=""
      />
      {NODES.map(([x, y], i) => (
        <img
          key={i}
          className="ads-constellation-node"
          style={{ left: x, top: y }}
          src={`${ART}/node-${i + 1}.webp`}
          alt=""
        />
      ))}
    </div>
  )
}

/**
 * The file's Related List ("Constellation Panel"): "More on" the article's
 * topic, the constellation of its connections, the first of them as a list
 * item, and a button to see them all.
 */
export function RelatedList({ topic = "Topic name" }: { topic?: string }) {
  return (
    <aside className="ads-related">
      <p className="ads-related-head">
        More on “<span>{topic}</span>”...
      </p>
      <Constellation />
      <div className="ads-related-list">
        <ListItem
          date={null}
          more={false}
          title="The hidden cost of helpfulness: Sycophancy in production models"
        />
        <Button
          variant="tertiary"
          size="small"
          icon="trailing"
          className="w-full"
        >
          {"See all {n} connections"}
        </Button>
      </div>
    </aside>
  )
}

// The cursor rests in the empty middle, then looks over each card: the one
// under it darkens and its title takes the arrow. It opens the second's
// summary, reads it, and closes it with the cross.
const LIST_DEMO: Array<DemoStep> = [
  { on: ".ads-list-items", at: [0.5, 1.12], idle: true, rest: 900 },
  { on: ".ads-list-item", nth: 0, at: [0.6, 0.62], rest: 900 },
  { on: ".ads-list-item", nth: 1, at: [0.6, 0.62], rest: 700 },
  { on: ".ads-list-item .ads-tiny-more", nth: 1, click: "open", rest: 600 },
  { on: ".ads-list-item-summary", rest: 1600 },
  { on: ".ads-list-item .ads-tiny-more", nth: 1, click: "close", rest: 600 },
  { on: ".ads-list-item", nth: 2, at: [0.6, 0.62], rest: 900 },
]

// It narrows the news items to a tablet's width, where picture and text take
// half each, then until they stack, as on a phone, and lets them out again.
const NEWS_DEMO: Array<DemoStep> = [
  { on: ".ads-news-title", nth: 0, rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 800, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 420 },
  { on: ".ads-news-title", nth: 0, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const THUMB_DEMO: Array<DemoStep> = [
  { on: ".ads-thumb-title", nth: 0, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 480 },
  { on: ".cds-resize-grip", nth: 1, drag: 380 },
  { on: ".ads-thumb-title", nth: 2, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const RELATED_DEMO: Array<DemoStep> = [
  { on: ".ads-related .ads-list-item", at: [0.6, 0.6], rest: 1000 },
  { on: ".ads-related .ads-btn", rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 560 },
  { on: ".ads-related .ads-list-item", at: [0.6, 0.6], rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function ListsDoc() {
  return (
    <>
      <Section
        title="List Item"
        caption="Four states: Idle, Hover Card, Hover See More, and Expanded. The more button opens a summary of the post and a button to it."
      >
        <Specimen figure>
          <DemoCursor
            steps={LIST_DEMO}
            className="flex justify-center px-6 py-20 md:px-8"
          >
            <div className="ads-list-items">
              <ListItem />
              <ListItem title="How Claude learned to forget: Memory degradation at scale" />
              <ListItem title="Can language models detect their own hallucinations?" />
            </div>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="News Item"
        caption="A large item with its picture on either side, and a thumbnail item in six styles, from text only to a picture at the left or right."
      >
        <Specimen figure>
          <DemoCursor steps={NEWS_DEMO} className="p-6 md:p-8">
            <Resizable
              label="News width"
              sizes={[["Desktop"], ["Tablet", 959], ["Mobile", 639]]}
              className="min-h-[1300px] sm:h-[1300px]"
            >
              <div className="ads-oc-c flex flex-col gap-16">
                <NewsItem />
                <NewsItem flip />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={THUMB_DEMO} className="p-6 md:p-8">
            <Resizable
              label="News width"
              sizes={[["Desktop"], ["Mobile", 479]]}
              className="flex min-h-[880px] flex-col items-center justify-center sm:h-[880px]"
            >
              <div className="ads-oc-c ads-thumbs">
                <NewsThumb />
                <NewsThumb style="smaller" />
                <NewsThumb style="right" />
                <NewsThumb style="text" />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Related List"
        caption="“More on” the article’s topic sits beside its text: the posts it connects to, as a constellation, and the first of them as a list item."
      >
        <Specimen figure>
          <DemoCursor steps={RELATED_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Article width"
              sizes={[["Desktop"], ["Mobile", 639]]}
              className="min-h-[1000px] sm:h-[1000px]"
            >
              <div className="ads-oc-c">
                <div className="ads-rel-article">
                  <SkelHeading line={false} />
                  <SkelText count={5} />
                  <SkelText count={4} />
                  <RelatedList />
                  <SkelText count={6} />
                  <SkelText count={4} />
                </div>
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
