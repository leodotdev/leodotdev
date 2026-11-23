import { useEffect, useRef, useState } from "react"
import { TbPlayerPause, TbPlayerPlay } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { ArticleContext, FigCaption, ROBODOG } from "./article"
import { two } from "./scroll"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Media Carousel and Video Playlist (the Figma file's Organisms page,
// "Article-related organisms"). There are no real videos here: the first
// picture is the still the file shows in both (exported from it,
// public/work/anthropic/organisms-media/still.webp), and the others are
// plain fields of the system's secondary colors standing in for theirs.

/** A picture or video of a carousel or playlist: the file's still, or a tint. */
export type Slide = "still" | "sky" | "olive" | "clay" | "heather" | "cactus"

/** One 16:9 picture: the still, or a field of one of the secondary colors. */
export function Media({ slide }: { slide: Slide }) {
  return slide === "still" ? (
    <img
      className="ads-om-media"
      src="/work/anthropic/organisms-media/still.webp"
      alt=""
      width={1509}
      height={850}
      draggable={false}
    />
  ) : (
    <span
      className="ads-om-media"
      style={{ background: `var(--ads-${slide})` }}
      aria-hidden
    />
  )
}

/** The file's "Play Button": a white tile with a play mark, over a video. */
export function PlayButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="ads-video-play"
      aria-label="Play"
      onClick={onClick}
      {...quiet}
    >
      <TbPlayerPlay aria-hidden />
    </button>
  )
}

const TABS = ["Tab One", "Two", "Three", "Four", "Five"]
const CAROUSEL_SLIDES: Array<Slide> = [
  "still",
  "sky",
  "olive",
  "clay",
  "heather",
]

/**
 * A row of tabs over a picture or video, and its numbered caption ("fig.01")
 * under it. A tab slides its picture in; the picture can also be dragged or
 * swiped to the next one, and the arrow keys move along the tabs.
 */
export function MediaCarousel({
  tabs = TABS,
  slides = CAROUSEL_SLIDES,
  caption = ROBODOG,
}: {
  tabs?: Array<string>
  slides?: Array<Slide>
  caption?: string
}) {
  const [current, setCurrent] = useState(0)
  // How far the picture is being dragged, in its own pixels.
  const [pull, setPull] = useState<number | null>(null)
  const frame = useRef<HTMLDivElement>(null)
  const from = useRef<{ x: number; id: number; scale: number } | null>(null)
  const tabRow = useRef<HTMLDivElement>(null)
  const last = slides.length - 1

  const pick = (i: number, focus = false) => {
    const to = Math.max(0, Math.min(last, i))
    setCurrent(to)
    if (focus) tabRow.current?.querySelectorAll("button")[to]?.focus()
  }

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !frame.current) return
    const el = frame.current
    from.current = {
      x: e.clientX,
      id: e.pointerId,
      scale: el.getBoundingClientRect().width / (el.offsetWidth || 1) || 1,
    }
  }
  const onMove = (e: React.PointerEvent) => {
    const start = from.current
    if (!start || e.pointerId !== start.id) return
    const dx = (e.clientX - start.x) / start.scale
    if (pull === null && Math.abs(dx) < 4) return
    if (pull === null) frame.current?.setPointerCapture(e.pointerId)
    // Past either end the picture gives a little, and no more.
    const end = (current === 0 && dx > 0) || (current === last && dx < 0)
    setPull(end ? dx / 4 : dx)
  }
  const onUp = (e: React.PointerEvent) => {
    const start = from.current
    if (!start || e.pointerId !== start.id) return
    from.current = null
    const width = frame.current?.offsetWidth ?? 1
    if (pull !== null && Math.abs(pull) > width * 0.18)
      pick(current + (pull < 0 ? 1 : -1))
    setPull(null)
  }

  return (
    <div className="ads-media-carousel">
      <div
        ref={tabRow}
        className="ads-media-tabs"
        role="tablist"
        aria-label="Media"
      >
        {tabs.map((tab, i) => (
          <Button
            key={tab}
            role="tab"
            size="small"
            variant={i === current ? "primary" : "secondary"}
            aria-selected={i === current}
            tabIndex={i === current ? 0 : -1}
            onClick={() => pick(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") pick(i + 1, true)
              if (e.key === "ArrowLeft") pick(i - 1, true)
            }}
          >
            {tab}
          </Button>
        ))}
      </div>
      <div
        ref={frame}
        className="ads-media-frame"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="ads-media-track"
          data-dragging={pull === null ? undefined : ""}
          style={{
            transform: `translateX(calc(${-current * 100}% + ${pull ?? 0}px))`,
          }}
        >
          {slides.map((slide, i) => (
            <div key={i} role="tabpanel" aria-hidden={i !== current}>
              <Media slide={slide} />
            </div>
          ))}
        </div>
      </div>
      <FigCaption label={`fig.${two(current + 1)}`}>{caption}</FigCaption>
    </div>
  )
}

const PLAYLIST_SLIDES: Array<Slide> = ["still", "cactus", "clay", "heather"]
// How long a demo plays before the next one starts, as a playlist runs on.
const RUN = 8000

/**
 * A video beside its playlist, which goes under it on a phone. A demo in the
 * list plays it; the one playing is Active (the file's three states:
 * Active, Inactive, and Hover, whose names are the file's sample words).
 * Pressing the playing one, or the video, pauses it. A playing demo hands
 * on to the next when it is done.
 */
export function VideoPlaylist({
  label = "Optional label here and it can span a line or two if it requires it",
  slides = PLAYLIST_SLIDES,
}: {
  label?: string
  slides?: Array<Slide>
}) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)

  // A silent run: the picture stays still, and after a while the next demo
  // takes over.
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(
      () => setCurrent((now) => (now + 1) % slides.length),
      RUN
    )
    return () => window.clearTimeout(timer)
  }, [playing, current, slides.length])

  const press = (i: number) => {
    if (i === current) return setPlaying((now) => !now)
    setCurrent(i)
    setPlaying(true)
  }

  return (
    <div className="ads-playlist">
      <div className="ads-playlist-video" data-playing={playing || undefined}>
        <Media slide={slides[current]} />
        {playing ? (
          <button
            type="button"
            className="ads-playlist-pause"
            aria-label="Pause"
            onClick={() => setPlaying(false)}
            {...quiet}
          />
        ) : (
          <PlayButton onClick={() => setPlaying(true)} />
        )}
      </div>
      <div className="ads-playlist-side">
        {label && <p className="ads-body-3">{label}</p>}
        <ol className="ads-playlist-items">
          {slides.map((_, i) => {
            const active = i === current
            return (
              <li key={i}>
                <button
                  type="button"
                  className="ads-playlist-item"
                  data-active={active || undefined}
                  aria-current={active || undefined}
                  aria-label={`Demo ${i + 1}, ${active && playing ? "pause" : "play"}`}
                  onClick={() => press(i)}
                  {...quiet}
                >
                  <span className="ads-playlist-count">{two(i + 1)}</span>
                  <span className="ads-playlist-title">
                    {active ? (
                      "Active"
                    ) : (
                      <>
                        <span data-word="inactive">Inactive</span>
                        <span data-word="hover">Hover</span>
                      </>
                    )}{" "}
                    demo name
                  </span>
                  {active && playing ? (
                    <TbPlayerPause aria-hidden />
                  ) : (
                    <TbPlayerPlay aria-hidden />
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

// What the demo cursor does: it goes along the tabs and back to the first.
const tab = ".ads-media-tabs .ads-btn"
// Its notes are the file's: the caption's sample label, and the
// component's one property.
const CAROUSEL_DEMO: Array<DemoStep> = [
  {
    on: tab,
    text: "Three",
    click: true,
    rest: 1400,
    note: {
      kind: "concept",
      title: "Tabs",
      on: ".ads-media-tabs",
      text: "Five in the file: “Tab One,” then Two, Three, Four, and Five.",
    },
  },
  { on: tab, text: "Four", click: true, rest: 1400 },
  {
    on: tab,
    text: "Tab One",
    click: true,
    rest: 1800,
    note: {
      kind: "concept",
      title: "Caption Padding",
      on: ".ads-fig-caption",
      text: "The component’s only property, with one value: “A lot.” The file’s caption is numbered “fig.01.”",
    },
  },
]

// And on the playlist: it plays the video, picks another demo, pauses it,
// narrows the figure until the list goes under the video, plays the last
// demo there, and lets the figure out again.
const item = ".ads-playlist-item"
const PLAYLIST_DEMO: Array<DemoStep> = [
  {
    on: ".ads-video-play",
    click: true,
    rest: 1400,
    note: {
      kind: "concept",
      title: "Playlist Item",
      on: ".ads-playlist-items",
      text: "Three states, and the file’s sample rows are named for theirs: Active, Hover, and Inactive demo name.",
    },
  },
  { on: item, nth: 1, click: true, rest: 1400 },
  { on: item, nth: 1, click: true, rest: 1000 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 420,
    note: {
      kind: "concept",
      title: "Two widths",
      on: ".ads-playlist",
      text: "The file draws the playlist at Desktop LG and at Mobile XS.",
    },
  },
  { on: item, nth: 3, click: true, rest: 1400 },
  { on: item, nth: 0, click: true, rest: 1000 },
  { on: item, nth: 0, click: true, rest: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function MediaDoc() {
  return (
    <>
      <Section
        title="Media Carousel"
        caption="Five tabs over a picture or video, with a numbered caption under it."
      >
        <Specimen figure>
          <DemoCursor steps={CAROUSEL_DEMO}>
            <ArticleContext>
              <MediaCarousel />
            </ArticleContext>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Video Playlist"
        caption="A video beside a list of demos, each item Active, Inactive, or Hover, under an optional label that “can span a line or two if it requires it.”"
      >
        <Specimen figure>
          <DemoCursor steps={PLAYLIST_DEMO}>
            <Resizable
              label="Playlist width"
              min={390}
              sizes={[["Desktop"], ["Mobile", 760]]}
              className="flex min-h-[920px] flex-col justify-center sm:h-[920px]"
            >
              <ArticleContext wide>
                <VideoPlaylist />
              </ArticleContext>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
