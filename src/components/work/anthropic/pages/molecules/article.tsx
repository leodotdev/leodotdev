import { useCallback, useEffect, useId, useRef, useState } from "react"
import {
  TbArrowRight,
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandX,
} from "react-icons/tb"
import { PlayButton, quiet } from "@/components/work/anthropic/specimens"
import { onMenuKeys } from "@/components/work/anthropic/pages/molecules/menu"
import { ChevronIcon } from "@/components/work/anthropic/pages/organisms-site/icons"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { useDismiss } from "@/components/work/claude/use-dismiss"

// The molecules of an analysis (a long research piece): its metadata rows,
// the subnav that holds its contents, and the video frame. Exported for the
// organisms and templates.

/** What an Analysis metadata row's value is: the file's Value variants. */
export type MetaValue = "mono" | "sans" | "list" | "share" | "link" | "toc"

// The file's own sample of a list value.
const NAMES = [
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

const SHARE = [
  ["Instagram", TbBrandInstagram],
  ["LinkedIn", TbBrandLinkedin],
  ["Facebook", TbBrandFacebook],
  ["X", TbBrandX],
] as const

// The links are for show: none goes anywhere.
const stay = (e: React.MouseEvent) => e.preventDefault()

/**
 * One row of an analysis's metadata: a label and its value under a rule,
 * side by side or one over the other. A table of contents row is a number
 * and a label.
 */
export function AnalysisMetadata({
  value = "mono",
  direction = "horizontal",
  label = value === "share" ? "Share" : "Label",
  number = "01",
  children,
}: {
  value?: MetaValue
  direction?: "horizontal" | "vertical"
  label?: string
  /** A table of contents row's number. */
  number?: string
  /** The value, in place of the file's sample. */
  children?: React.ReactNode
}) {
  // A link keeps its arrow round words of its own ("Read post"); any other
  // value is replaced whole.
  const shown =
    value === "link" ? (
      <a href="#visit" className="ads-meta-link" onClick={stay} {...quiet}>
        {children ?? "Visit"}
        <TbArrowRight aria-hidden />
      </a>
    ) : (
      (children ??
      (value === "list"
        ? NAMES.map((name) => <span key={name}>{name}</span>)
        : value === "share"
          ? SHARE.map(([name, Icon]) => (
              <a
                key={name}
                href="#share"
                className="ads-meta-icon"
                aria-label={`Share on ${name}`}
                onClick={stay}
                {...quiet}
              >
                <Icon aria-hidden />
              </a>
            ))
          : "Value"))
    )
  return (
    <div className="ads-meta" data-value={value} data-direction={direction}>
      {value === "toc" ? (
        <>
          <span className="ads-meta-num">{number}</span>
          <span>{label}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <span className="ads-meta-value">{shown}</span>
        </>
      )}
    </div>
  )
}

/** The file's sample analysis's sections. */
export const SECTIONS = [
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

const num = (i: number) => String(i + 1).padStart(2, "0")

/**
 * The subnav, as anthropic.com's analyses have it (read from the site on
 * 2026-11-19): a 48px bar holding the section being read, its number in
 * mono, and a chevron. Pressed, it grows the whole contents down over the
 * page, one table of contents row each, the current one's number dark;
 * picking one goes there. The arrow keys move through the list, Escape and
 * a press outside close it.
 */
export function ArticleSubnav({
  sections = SECTIONS,
  current,
  onPick,
}: {
  sections?: Array<string>
  current: number
  onPick?: (index: number) => void
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)
  const bar = useRef<HTMLButtonElement>(null)
  const list = useId()
  // Opened from the keyboard, the current section takes the focus.
  const fromKeys = useRef(false)
  const focusCurrent = (el: HTMLDivElement | null) => {
    if (el && fromKeys.current) {
      fromKeys.current = false
      ;[...el.querySelectorAll<HTMLElement>('[role="menuitem"]')]
        .at(current)
        ?.focus()
    }
  }

  return (
    <nav
      ref={ref}
      className="ads-subnav"
      aria-label="Contents"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation()
          setOpen(false)
          bar.current?.focus()
        } else if (e.key === "Tab" && open) setOpen(false)
      }}
    >
      <button
        ref={bar}
        type="button"
        className="ads-subnav-bar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? list : undefined}
        onClick={(e) => {
          fromKeys.current = !open && e.isTrusted && e.detail === 0
          setOpen(!open)
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault()
            fromKeys.current = true
            setOpen(true)
          }
        }}
        {...quiet}
      >
        <span className="ads-subnav-label">
          <span className="ads-subnav-num">{num(current)}</span>
          {/* Keyed, so a new section's name comes in afresh. */}
          <span key={current} className="ads-subnav-name">
            {sections[current]}
          </span>
        </span>
        <ChevronIcon className="ads-subnav-caret" />
      </button>
      {open && (
        <div
          ref={focusCurrent}
          id={list}
          role="menu"
          aria-label="Contents"
          className="ads-subnav-list"
          onKeyDown={onMenuKeys}
        >
          {sections.map((name, i) => (
            <button
              key={name}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className="ads-subnav-item"
              aria-current={i === current || undefined}
              data-col={0}
              data-row={i}
              onClick={(e) => {
                setOpen(false)
                onPick?.(i)
                if (e.isTrusted && e.detail === 0)
                  bar.current?.focus({ preventScroll: true })
              }}
              {...quiet}
            >
              <span
                className="ads-meta"
                data-value="toc"
                data-direction="horizontal"
              >
                <span className="ads-meta-num">{num(i)}</span>
                <span>{name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

/**
 * A skeleton of the site's header as an analysis has it: the four menus at
 * the left, the wordmark in the middle, and Company, Try Claude, and three
 * small buttons at the right. From a tablet down the wordmark moves to the
 * left with Try Claude and two buttons across from it; a phone's has the
 * mark in place of the wordmark.
 */
function HeaderSkeleton() {
  return (
    <div className="ads-article-head" aria-hidden>
      <div className="ads-article-wide">
        {[52, 96, 76, 118].map((w) => (
          <Bar key={w} w={w} h={28} r={999} className="cds-skel-outline" />
        ))}
      </div>
      <Bar w={140} h={20} r={2} className="ads-article-logo cds-skel-solid" />
      <div>
        <Bar
          w={104}
          h={28}
          r={999}
          className="ads-article-wide cds-skel-outline"
        />
        <Bar w={108} h={28} r={999} className="cds-skel-outline" />
        <Bar
          w={28}
          h={28}
          r={8}
          className="ads-article-wide cds-skel-outline"
        />
        <Bar w={28} h={28} r={8} className="cds-skel-outline" />
        <Bar w={28} h={28} r={8} className="cds-skel-outline" />
      </div>
    </div>
  )
}

// How each section of the skeleton analysis is drawn: its paragraphs'
// lengths, and whether a figure card comes first.
const BODY: Array<{ card?: boolean; paragraphs: Array<number> }> = [
  { paragraphs: [5, 4, 6] },
  { card: true, paragraphs: [4, 5] },
  { paragraphs: [6, 3, 5, 4] },
  { paragraphs: [4, 5] },
  { card: true, paragraphs: [5, 3] },
  { paragraphs: [3, 4] },
  { paragraphs: [2] },
  { paragraphs: [4, 4] },
  { paragraphs: [3, 5, 3] },
]

/**
 * An analysis as a page in a window of its own, which scrolls inside the
 * figure: the header, the subnav held at the top of the window, and the
 * piece, a skeleton. The subnav names the section being read: the last one
 * whose top has passed under it. Picking a section scrolls the window to it.
 */
export function SubnavArticle() {
  const win = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const el = win.current
    if (!el) return
    let frame = 0
    const measure = () => {
      frame = 0
      const nav = el.querySelector<HTMLElement>(".ads-subnav")
      const line = el.scrollTop + (nav?.offsetHeight ?? 0) + 8
      const parts = [
        ...el.querySelectorAll<HTMLElement>(".ads-article-section"),
      ]
      let found = 0
      parts.forEach((part, i) => {
        if (part.offsetTop <= line) found = i
      })
      // At the very end, the last section, though its top may never reach
      // the bar.
      if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2)
        found = parts.length - 1
      setCurrent(found)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure)
    }
    measure()
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("scroll", onScroll)
    }
  }, [])

  const goTo = (i: number) => {
    const el = win.current
    const part = el?.querySelectorAll<HTMLElement>(".ads-article-section")[i]
    const nav = el?.querySelector<HTMLElement>(".ads-subnav")
    if (!el || !part) return
    // The window alone scrolls: `scrollIntoView` would move the docs' page
    // too.
    el.scrollTo({
      top: part.offsetTop - (nav?.offsetHeight ?? 0) + 1,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    })
  }

  return (
    <div ref={win} className="ads-article-window">
      <div className="ads-article">
        <HeaderSkeleton />
        <ArticleSubnav current={current} onPick={goTo} />
        <div className="ads-article-body" aria-hidden>
          {BODY.map((section, i) => (
            <section key={i} className="ads-article-section">
              <Bar w={`${36 + ((i * 17) % 30)}%`} h={22} r={4} />
              {section.card && <Bar w="100%" h={220} r={16} />}
              {section.paragraphs.map((lines, p) => (
                <Lines
                  key={p}
                  count={lines}
                  last={`${48 + (((i + p) * 13) % 40)}%`}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

// The clip the Video plays: the studio's own screen recording of the
// redesigned anthropic.com design system (one of the overview strip's
// clips, src/components/work/anthropic/media.ts), streamed from Mux.
const CLIP = "aWbQkQ9FnFk2xYIF9hlfBsNRTiABi1hAGZ1wbfdD94Y"

/**
 * Video: a 16:9 frame with rounded corners, as anthropic.com covers a video
 * (read from the site on 2026-11-20): a picture over it, with the Play
 * Button in its middle, 56px in a narrow frame, 64px, and 84px in a wide
 * one. Pressed, the cover goes and the video plays; pressed again, it stops
 * and the cover comes back. Where the browser streams HLS itself (Safari)
 * it is the clip; elsewhere the clip's moving picture from Mux, as in the
 * overview's strip.
 */
export function Video({
  src = "/work/anthropic/molecules/video.webp",
  alt = "",
  clip = CLIP,
}: {
  src?: string
  alt?: string
  /** The Mux playback id of what it plays. */
  clip?: string
}) {
  // What is playing, if anything: the stream itself, or (in a browser that
  // cannot stream HLS) its moving picture. Decided when play is pressed.
  const [playing, setPlaying] = useState<"stream" | "picture" | null>(null)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (playing === "stream") video.current?.play().catch(() => {})
  }, [playing])
  const start = () =>
    setPlaying(
      document
        .createElement("video")
        .canPlayType("application/vnd.apple.mpegurl")
        ? "stream"
        : "picture"
    )
  return (
    <div className="ads-video" data-playing={playing ? "" : undefined}>
      {playing ? (
        <button
          type="button"
          className="ads-video-player"
          aria-label="Stop the video"
          onClick={() => setPlaying(null)}
          {...quiet}
        >
          {playing === "stream" ? (
            <video
              ref={video}
              src={`https://stream.mux.com/${clip}.m3u8?min_resolution=720p`}
              poster={`https://image.mux.com/${clip}/thumbnail.webp?width=1280&time=1`}
              crossOrigin="anonymous"
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={`https://image.mux.com/${clip}/animated.webp?width=960&fps=15`}
              alt=""
              decoding="async"
            />
          )}
        </button>
      ) : (
        <div className="ads-video-cover">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
          <PlayButton label="Play the video" onClick={start} />
        </div>
      )}
    </div>
  )
}
