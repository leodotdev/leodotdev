import { useCallback, useEffect, useRef, useState } from "react"
import { TbChevronDown, TbInfoCircle, TbX } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { cn } from "@/lib/utils"

// The top of a long piece on Anthropic.com, as the Figma file's "Article
// Hero", "Analysis Metadata", and "Analysis Table of contents" sections have
// it (Organisms page, "Article-related organisms"): the headline and its two
// buttons, the picture, the piece's metadata, and its contents. The styles
// are `.ads-art-*`, `.ads-meta*`, and `.ads-toc*` in
// src/anthropic/organisms-article.css. The sample words are the file's own.

/** The file's sample piece: its two-part headline. */
export const TITLE: [string, string] = [
  "Introducing Anthropic Interviewer:",
  "What 1,250 professionals told us about working with AI",
]

/** The file's sample contents, in order. */
export const CHAPTERS = [
  "Introduction",
  "Method",
  "Results",
  "Looking forward",
  "Conclusions and limitations",
  "Contributions and acknowledgements",
  "Citation",
  "Appendix",
  "Sharing your perspective: FAQ",
]

/** The hero's picture, from the file (its credit is the file's own). */
export const ART = {
  src: "/work/anthropic/organisms-article/interviewer.webp",
  alt: "Engraved studies of a head in profile, dotted with colored circles",
  credit: "Illustration by Olenka Malarecka",
}

const AUTHORS = [
  "Kunal Handa",
  "Michael Stern",
  "Saffron Huang",
  "Jerry Hong",
  "Esin Durmus",
  "Miles McCain",
  "Grace Yun",
  "AJ Alt",
  "Thomas Millar",
  "Alex Tamkin",
  "Jane Leibrock",
  "Stuart Ritchie",
  "Deep Ganguli",
]

const PILLAR =
  "We have identified five conditions for a future world in which we have achieved our mission. We will annually publish our progress toward these five pillars, and where there is more work to do."

/** One line of a piece's metadata: a label and what goes beside it. */
export type MetaItem = {
  label: string
  /** A single value. */
  value?: string
  /** A list of values, such as topics or authors. */
  list?: Array<string>
  /** The piece's share links. */
  share?: boolean
  /** A note the label's info button opens. */
  tip?: string
}

/** The file's "Analysis metadata list": every kind of line it has. */
export const META: Array<MetaItem> = [
  { label: "Share", share: true },
  { label: "Team", value: "Societal Impacts" },
  { label: "Published", value: "Jan. 12, 2026" },
  {
    label: "Topics",
    list: ["Alignment", "Interpretability", "Societal Impacts"],
  },
  {
    label: "Mission pillar",
    value: "The technical problems of AI Safety are solved",
    tip: PILLAR,
  },
  { label: "Authors", list: AUTHORS },
]

/**
 * The hero's metadata, as the file's "Analysis hero" variants have it: the
 * date, then the piece's category (News) or team (Team), its topics, its
 * authors, and its mission pillar. The widest hero lists all five; under the
 * picture a desktop's or tablet's has the first four, a phone's the first
 * two.
 */
export const heroMeta = (
  type: "news" | "team",
  size: HeroSize
): Array<MetaItem> => {
  const items: Array<MetaItem> = [
    { label: "Published", value: "Jan. 12, 2026" },
    { label: type === "news" ? "Category" : "Team", value: "Societal Impacts" },
    {
      label: "Topics",
      list: ["Alignment", "Interpretability", "Societal Impacts"],
    },
    { label: "Authors", list: AUTHORS },
    {
      label: "Mission pillar",
      value: "The technical problems of AI Safety are solved",
      tip: PILLAR,
    },
  ]
  return size === "xxl" ? items : items.slice(0, size === "xs" ? 2 : 4)
}

const number = (i: number) => String(i + 1).padStart(2, "0")

/**
 * The piece's contents: a numbered row per part, ruled above. The part in
 * view (`current`) is marked; a row takes the reader to its part.
 */
export function TableOfContents({
  chapters = CHAPTERS,
  current,
  onPick,
  className,
}: {
  chapters?: Array<string>
  current?: number
  onPick?: (index: number) => void
  className?: string
}) {
  return (
    <nav
      aria-label="Contents"
      className={cn("ads-toc", className)}
      data-marking={current === undefined ? undefined : ""}
    >
      <ol>
        {chapters.map((name, i) => (
          <li key={name}>
            <button
              type="button"
              className="ads-toc-row"
              aria-current={i === current ? "location" : undefined}
              onClick={() => onPick?.(i)}
              {...quiet}
            >
              <span className="ads-toc-num">{number(i)}</span>
              <span>{name}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * The contents folded into a bar under the site's header, as every hero
 * narrower than the widest has them: the part in view, and a chevron that
 * opens the whole list.
 */
export function ContentsBar({
  chapters = CHAPTERS,
  current = 0,
  onPick,
}: {
  chapters?: Array<string>
  current?: number
  onPick?: (index: number) => void
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)
  return (
    <div ref={ref} className="ads-toc-bar" data-open={open ? "" : undefined}>
      <button
        type="button"
        className="ads-toc-bar-toggle"
        aria-expanded={open}
        onClick={() => setOpen((now) => !now)}
        {...quiet}
      >
        <span className="ads-toc-num">{number(current)}</span>
        <span>{chapters[current]}</span>
        <TbChevronDown aria-hidden />
      </button>
      {open && (
        <TableOfContents
          chapters={chapters}
          current={current}
          className="ads-toc-bar-list"
          onPick={(i) => {
            setOpen(false)
            onPick?.(i)
          }}
        />
      )}
    </div>
  )
}

/**
 * The info button beside a label, and the note it opens: on hover, or on a
 * press, which keeps it open until its close button or a press elsewhere.
 */
function MetaTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)
  return (
    <span
      className="ads-meta-tip"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="ads-meta-info"
        aria-label="About this label"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        {...quiet}
      >
        <TbInfoCircle aria-hidden />
      </button>
      {open && (
        <div ref={ref} role="tooltip" className="ads-meta-tooltip">
          <span className="ads-caption-1">{text}</span>
          <button
            type="button"
            className="ads-meta-tooltip-close"
            aria-label="Close"
            onClick={close}
            {...quiet}
          >
            <TbX aria-hidden />
          </button>
        </div>
      )}
    </span>
  )
}

// The share links' marks, exported from the file. They are drawn as masks
// so they take the theme's colors (`.ads-meta-share`).
const SHARE = [
  { name: "Share on Instagram", icon: "instagram" },
  { name: "Share on LinkedIn", icon: "linkedin" },
  { name: "Share on Facebook", icon: "facebook" },
  { name: "Share on X", icon: "x" },
]

function MetaRow({ item, show }: { item: MetaItem; show: number }) {
  const [more, setMore] = useState(false)
  const list = item.list ?? []
  const shown = more ? list : list.slice(0, show)
  return (
    <div className="ads-meta-row">
      <dt>
        <span>{item.label}</span>
        {item.tip && <MetaTip text={item.tip} />}
      </dt>
      <dd data-share={item.share ? "" : undefined}>
        {item.share &&
          SHARE.map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              className="ads-meta-share"
              aria-label={name}
              style={
                {
                  "--icon": `url(/work/anthropic/organisms-article/share-${icon}.svg)`,
                } as React.CSSProperties
              }
              {...quiet}
            />
          ))}
        {item.value}
        {shown.map((value) => (
          <span key={value}>{value}</span>
        ))}
        {list.length > shown.length && (
          <button
            type="button"
            className="ads-meta-more"
            onClick={() => setMore(true)}
            {...quiet}
          >
            See more…
          </button>
        )}
      </dd>
    </div>
  )
}

/**
 * A piece's metadata. As a list (`list`) each line has its label beside its
 * value, ruled above; as a row (`row`) each line is a column, its label over
 * its value, as under the picture of a narrower hero, where a long list shows
 * its first two and "See more…".
 */
export function AnalysisMetadata({
  items = META,
  layout = "list",
  className,
}: {
  items?: Array<MetaItem>
  layout?: "list" | "row"
  className?: string
}) {
  return (
    <dl className={cn("ads-art-meta", className)} data-layout={layout}>
      {items.map((item) => (
        <MetaRow
          key={`${item.label}-${layout}`}
          item={item}
          show={layout === "row" ? 2 : 7}
        />
      ))}
    </dl>
  )
}

/** The widths the hero changes at: the file's device sizes it follows. */
export type HeroSize = "xxl" | "lg" | "md" | "xs"

export const heroSize = (width: number): HeroSize =>
  width >= 960 ? "xxl" : width >= 720 ? "lg" : width >= 560 ? "md" : "xs"

/**
 * The hero of a long piece: the headline (in the News type its second part
 * in the serif; in the Team type all in the sans), its two buttons, the
 * picture with its credit, and the metadata. At the widest size (`xxl`)
 * the contents run down the left beside the picture, the metadata down the
 * right, and the piece's text (`children`) starts under the picture with
 * the contents still beside it; narrower, the metadata lines up under the
 * picture, and the contents are left to a `ContentsBar` above. On a desktop
 * News keeps its picture narrower than the page; Team's runs its width.
 */
export function ArticleHero({
  type = "news",
  title = TITLE,
  size = "xxl",
  toc,
  meta = heroMeta(type, size),
  children,
}: {
  type?: "news" | "team"
  title?: [string, string]
  size?: HeroSize
  /** The contents, shown at the widest size. */
  toc?: React.ReactNode
  meta?: Array<MetaItem>
  children?: React.ReactNode
}) {
  return (
    <article className="ads-art-hero" data-size={size} data-type={type}>
      <header className="ads-art-head">
        <h1 className="ads-art-title">
          <span className="ads-heading-3">{title[0]}</span>{" "}
          <span
            className={
              type === "news" ? "ads-heading-3-serif" : "ads-heading-3"
            }
          >
            {title[1]}
          </span>
        </h1>
        <div className="ads-art-ctas">
          <Button variant="tertiary" icon="trailing">
            Download PDF
          </Button>
          <Button variant="tertiary" icon="trailing">
            Listen to this article
          </Button>
        </div>
      </header>
      {size === "xxl" && toc && <aside className="ads-art-toc">{toc}</aside>}
      <figure className="ads-art-media">
        <img src={ART.src} alt={ART.alt} draggable={false} />
        <figcaption className="ads-caption-2">{ART.credit}</figcaption>
      </figure>
      <div className="ads-art-info">
        <AnalysisMetadata
          items={meta}
          layout={size === "xxl" || size === "xs" ? "list" : "row"}
        />
      </div>
      {children && <div className="ads-art-body">{children}</div>}
    </article>
  )
}

/**
 * The site's header as a skeleton, laid out as the file's is: at the widest,
 * four menus at the left, the logo in the middle, and two menus and three
 * round buttons at the right; narrower, the logo at the left and one menu
 * and two buttons; on a phone the logo is the mark.
 */
export function ArticleNav({ size }: { size: HeroSize }) {
  const wide = size === "xxl" || size === "lg"
  return (
    <div className="ads-art-nav" data-wide={wide ? "" : undefined} aria-hidden>
      {wide && (
        <span className="ads-art-nav-side">
          {[44, 72, 58, 96].map((w) => (
            <Bar key={w} w={w} h={22} className="cds-skel-outline" />
          ))}
        </span>
      )}
      <Bar w={size === "xs" ? 26 : 112} h={16} r={3} />
      <span className="ads-art-nav-side" data-end>
        {wide && <Bar w={76} h={22} className="cds-skel-outline" />}
        <Bar w={80} h={22} className="cds-skel-outline" />
        {wide && <Bar w={22} h={22} className="cds-skel-outline" />}
        <Bar w={22} h={22} className="cds-skel-outline" />
        <Bar w={22} h={22} className="cds-skel-outline" />
      </span>
    </div>
  )
}

/**
 * The piece's text after the hero, as a skeleton: the opening paragraph,
 * ruled at the left (the file's own words), then each part of the contents,
 * marked `data-chapter` so the contents can follow it.
 */
export function ArticleBodySkeleton({
  chapters = CHAPTERS,
}: {
  chapters?: Array<string>
}) {
  return (
    <div className="ads-art-text-skel">
      <p className="ads-art-lede ads-body-1-serif">
        We’re launching a new tool, Anthropic Interviewer, to help understand
        people’s perspectives on AI. In this research post, we introduce the
        tool, describe a test of it on a sample of professionals, and discuss
        our early findings.
      </p>
      {chapters.map((name, i) => (
        <section key={name} data-chapter={i} aria-label={name}>
          <Bar w={`${36 + ((i * 17) % 30)}%`} h={20} />
          <Lines count={5} last="48%" />
          {i % 3 === 1 && <span className="cds-skel ads-art-skel-figure" />}
          <Lines count={4} last="70%" />
        </section>
      ))}
    </div>
  )
}

// Where an element is in a box that scrolls, in the box's own (unscaled)
// pixels: a docs figure is drawn smaller than it is laid out.
const topOf = (box: HTMLElement, el: Element) => {
  const scale =
    box.getBoundingClientRect().height / (box.offsetHeight || 1) || 1
  return (
    (el.getBoundingClientRect().top - box.getBoundingClientRect().top) / scale +
    box.scrollTop
  )
}

/**
 * Follows which part of a piece is in view in a box that scrolls: the last
 * part whose top has passed a line a quarter of the way down the box (below
 * any bar stuck at its top). Also gives a way to go to a part, which stops
 * with the part's top a little under that bar.
 */
export function useChapterInView(
  scroller: React.RefObject<HTMLElement | null>,
  /** The height of what is stuck at the top of the box, if anything. */
  offset = 0
) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const box = scroller.current
    if (!box) return
    let frame = 0
    const measure = () => {
      frame = 0
      const line = box.scrollTop + offset + 24 + box.clientHeight / 4
      let found = 0
      box.querySelectorAll("[data-chapter]").forEach((el, i) => {
        if (topOf(box, el) <= line) found = i
      })
      // At the very bottom the last part is the one being read.
      if (box.scrollTop + box.clientHeight >= box.scrollHeight - 2)
        found = box.querySelectorAll("[data-chapter]").length - 1
      setCurrent(found)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    box.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      box.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [scroller, offset])

  const go = (index: number) => {
    const box = scroller.current
    const el = box?.querySelector(`[data-chapter="${index}"]`)
    if (!box || !el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    box.scrollTo({
      top: topOf(box, el) - offset - 24,
      behavior: reduce.matches ? "auto" : "smooth",
    })
  }

  return { current, go }
}

/** The hero's size, from the width of the page it is on. */
export function useHeroSize(page: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<HeroSize>("xxl")
  useEffect(() => {
    const el = page.current
    if (!el) return
    // The width as laid out, which a scaled figure does not change.
    const observer = new ResizeObserver(([entry]) =>
      setSize(heroSize(entry.contentRect.width))
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [page])
  return size
}

/**
 * The top of a long piece on its page, in a window that scrolls: the site's
 * header (a skeleton), the hero, and the piece's text (a skeleton) under it.
 * The contents follow the part in view, beside the text at the widest size
 * and in the bar under the header otherwise, and take the reader to a part.
 */
export function ArticlePage({ type = "news" }: { type?: "news" | "team" }) {
  const page = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const size = useHeroSize(page)
  const { current, go } = useChapterInView(scroller, size === "xxl" ? 0 : 44)
  return (
    <div ref={page} className="ads-art-page" data-size={size}>
      <div ref={scroller} className="ads-art-scroll">
        <ArticleNav size={size} />
        {size !== "xxl" && <ContentsBar current={current} onPick={go} />}
        <ArticleHero
          type={type}
          size={size}
          toc={<TableOfContents current={current} onPick={go} />}
        >
          <ArticleBodySkeleton />
        </ArticleHero>
      </div>
    </div>
  )
}
