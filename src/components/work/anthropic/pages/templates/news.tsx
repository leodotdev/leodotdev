import { useState } from "react"
import { TbArrowRight } from "react-icons/tb"
import {
  PageBlock,
  PageSection,
  TemplateFigure,
} from "@/components/work/anthropic/template"
import {
  MenuTopicDate,
  Table,
} from "@/components/work/anthropic/pages/organisms-content"
import {
  Footer,
  HeroCarousel,
  Prefooter,
  SiteNavigation,
} from "@/components/work/anthropic/pages/organisms-site"
import {
  Button,
  PlayButton,
  quiet,
} from "@/components/work/anthropic/specimens"
import { useTemplateDark } from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The News template (the "Desktop XXL - [1920]" frame of the Figma file's
// "Reskinned pages", 13284:5098): the newsroom's front page. Under the site
// navigation, "Latest news" lays its posts out in three columns, the lead
// post in the wide middle one; "Features" is the hero carousel; "All news"
// is the table of every post with its filters; and the media prefooter and
// the footer close it. The words and pictures are the file's (the pictures
// in public/work/anthropic/templates/news/). The file's hidden "More News"
// strip is left out.

const ART = "/work/anthropic/templates/news"

type Post = {
  topic: string
  date: string
  title: string
  text: string
  /** The post's picture, if it has one, and whether it is a video. */
  image?: string
  /** The lead post's larger title and text, and its smaller play button. */
  lead?: boolean
}

// The three columns of "Latest news", top to bottom, as the file has them.
const COLUMNS: Array<Array<Post>> = [
  [
    {
      topic: "Features",
      date: "Sep. 22, 2026",
      title: "The Situation Report",
      text: "A rare strain of Ebola, with no confirmed vaccine, is spreading through the east of the Democratic Republic of Congo. World health organizations are using Claude to move as fast as possible to combat it.",
    },
    {
      topic: "Announcements",
      date: "Sept 22, 2026",
      title: "Introducing Claude Opus 5.5",
      text: "Opus 5.5 performs at the level of Claude Fable 5.1 on most work and costs 40% less to run than Opus 5.",
      image: `${ART}/opus.webp`,
    },
  ],
  [
    {
      topic: "Announcements",
      date: "Sep. 01, 2026",
      title: "Introducing Claude Sonnet 5.5",
      text: "A clear upgrade over Sonnet 5 that runs 30% faster and costs up to 30% less for most work.",
      image: `${ART}/sonnet.webp`,
      lead: true,
    },
  ],
  [
    {
      topic: "Announcements",
      date: "Sept. 01, 2026",
      title: "Introducing Claude Fable 5.1 and Claude Mythos 5.1",
      text: "Our most advanced models for coding and knowledge work. Their research capabilities also offer an early glimpse of how AI models will contribute to scientific progress.",
      image: `${ART}/fable.webp`,
    },
    {
      topic: "Announcements",
      date: "Sept 10, 2026",
      title: "Detecting and countering misuse of AI: September 2026",
      text: "Over the past eight months, our Threat Intelligence team identified and disrupted operations in which threat actors tried to use Claude for malicious activity. In this report, we share case studies from those operations and describe how malicious use of Claude has evolved since our previous threat reports in 2025.",
    },
  ],
]

/**
 * One of the file's "Asset" posts: the more button, topic, and date, then
 * its picture with a play button over it (the posts with videos), its title,
 * and its text.
 */
function NewsPost({ post }: { post: Post }) {
  return (
    <article className="ads-news-post" data-lead={post.lead || undefined}>
      <MenuTopicDate tag={post.topic} date={post.date} />
      {post.image && (
        <div className="ads-news-post-media">
          <img src={post.image} alt="" loading="lazy" draggable={false} />
          <PlayButton size={post.lead ? "small" : "large"} />
        </div>
      )}
      <div className="ads-news-text">
        <a
          href="#"
          className={post.lead ? "ads-heading-3" : "ads-heading-6"}
          {...quiet}
        >
          {post.title}
        </a>
        <p className={post.lead ? "ads-body-3" : "ads-caption-1"}>
          {post.text}
        </p>
      </div>
    </article>
  )
}

/** A strip's label over a rule ("Latest news", "Features"), and a date. */
function Banner({ label, date }: { label: string; date?: string }) {
  return (
    <div className="ads-news-banner ads-caption-1">
      <b>{label}</b>
      {date && <span>{date}</span>}
    </div>
  )
}

// The tabs over "All news": the file's three medium buttons edge to edge,
// the current one Primary.
const KINDS = ["All", "Product", "Company"]

function Kinds() {
  const [current, setCurrent] = useState(0)
  return (
    <div className="ads-btn-group ads-news-kinds" role="tablist">
      {KINDS.map((kind, i) => (
        <Button
          key={kind}
          role="tab"
          aria-selected={current === i}
          variant={current === i ? "primary" : "secondary"}
          onClick={() => setCurrent(i)}
        >
          {kind}
        </Button>
      ))}
    </div>
  )
}

/**
 * The page. All of it is on Ivory, over the Slate prefooter and footer; on
 * the Slate dot the page is Slate too.
 */
function News() {
  const dark = useTemplateDark()
  return (
    <>
      <PageBlock theme={["ivory", "slate"]}>
        <SiteNavigation />
        <div className="ads-news-hero">
          <section className="ads-news-latest">
            <Banner label="Latest news" date="Oct. 08, 2026" />
            <div className="ads-news-grid">
              {COLUMNS.map((column, i) => (
                <div key={i} className="ads-news-column">
                  {column.map((post) => (
                    <NewsPost key={post.title} post={post} />
                  ))}
                </div>
              ))}
            </div>
          </section>
          <section className="ads-news-features">
            <Banner label="Features" />
            <HeroCarousel theme={dark ? "slate" : "ivory"} />
          </section>
        </div>
      </PageBlock>
      <PageSection theme={["ivory", "slate"]} className="ads-news-all">
        <div className="ads-news-all-head">
          <h2 className="ads-heading-2">All news</h2>
          <Kinds />
        </div>
        <Table />
        <div className="ads-news-more">
          <Button
            variant="secondary"
            size="large"
            icon="trailing"
            glyph={<TbArrowRight aria-hidden />}
          >
            See more
          </Button>
        </div>
      </PageSection>
      <div>
        <Prefooter variant="media" />
        <Footer />
      </div>
    </>
  )
}

// Wide, the cursor looks at the lead post and the posts beside it, steps
// the features carousel on, then goes down to the table: picks the tabs,
// opens a row's related articles, and searches. Narrow, it looks at the
// first post with a video.
const NEWS_DEMO: Array<DemoStep> = [
  { on: ".ads-news-post[data-lead] .ads-play", rest: 800 },
  { on: ".ads-news-text a", text: "Introducing Claude Fable", rest: 700 },
  { on: ".ads-news-text a", text: "The Situation Report", rest: 700 },
  { on: ".ads-hero-carousel-next", click: true, rest: 1000 },
  { on: ".cds-tpl-thumb", drag: 42 },
  { on: ".ads-news-kinds .ads-btn", text: "Product", click: true, rest: 600 },
  { on: ".ads-news-kinds .ads-btn", text: "All", click: true, rest: 500 },
  { on: ".ads-row-more .ads-tiny-more", nth: 3, click: true, rest: 1200 },
  { on: ".ads-search", type: "Project", rest: 1200 },
  { on: ".cds-tpl-thumb", drag: 0 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".ads-news-post .ads-play", rest: 900 },
]

export function NewsDoc() {
  return (
    <Section>
      <TemplateFigure steps={NEWS_DEMO}>
        <News />
      </TemplateFigure>
    </Section>
  )
}
