import { useEffect, useRef, useState } from "react"
import { TbArrowRight, TbPlayerPause, TbPlayerPlay } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { ArticleText } from "./article"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Claude Narrator (the Figma file's Organisms page, "Article-related
// organisms"): the voice picker and the audio player that float over an
// article. There is no sound here: the player runs a silent timeline of the
// file's length (6:12).

const clock = (seconds: number) => {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

/**
 * The narrator: the voice it reads in, over the player (pause or play, the
 * progress along its bar, and the time). The bar is a slider: it can be
 * pressed or dragged to a place, and moved with the arrow keys (five
 * seconds), Home, and End. Playing runs on the clock until the end.
 */
export function ClaudeNarrator({
  voice = "Buttery",
  duration = 372,
}: {
  voice?: string
  /** The reading's length, in seconds. */
  duration?: number
}) {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const now = useRef(0)
  const track = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)

  const seek = (to: number) => {
    const t = Math.max(0, Math.min(duration, to))
    now.current = t
    setTime(t)
  }

  // The clock, while it plays.
  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const timer = window.setInterval(() => {
      const at = performance.now()
      const next = Math.min(duration, now.current + (at - last) / 1000)
      last = at
      now.current = next
      setTime(next)
      if (next >= duration) setPlaying(false)
    }, 200)
    return () => window.clearInterval(timer)
  }, [playing, duration])

  // The demo cursor drags the bar's thumb with `demo-drag` events carrying
  // the time to go to. They stop here, so the figure's own grips (which
  // listen for them on the figure) are not moved too.
  useEffect(() => {
    const el = thumb.current
    if (!el) return
    const onDemo = (e: Event) => {
      e.stopPropagation()
      const value = (e as CustomEvent<number>).detail
      if (typeof value === "number") seek(value)
    }
    el.addEventListener("demo-drag", onDemo)
    return () => el.removeEventListener("demo-drag", onDemo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  const fromPointer = (e: React.PointerEvent) => {
    const box = track.current?.getBoundingClientRect()
    if (!box || box.width === 0) return
    seek(((e.clientX - box.left) / box.width) * duration)
  }

  const share = (time / duration) * 100

  return (
    <div className="ads-narrator">
      <div className="ads-narrator-bar">
        <Button variant="tertiary" size="small" icon="trailing">
          Voice: {voice}
        </Button>
        <Button
          variant="tertiary"
          size="small"
          icon="only"
          glyph={<TbArrowRight aria-hidden />}
          aria-label="Close"
        />
      </div>
      <div className="ads-narrator-player">
        <button
          type="button"
          className="ads-narrator-play"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => {
            // From the end it starts again at the top.
            if (!playing && now.current >= duration) seek(0)
            setPlaying(!playing)
          }}
          {...quiet}
        >
          {playing ? (
            <TbPlayerPause aria-hidden />
          ) : (
            <TbPlayerPlay aria-hidden />
          )}
        </button>
        <div
          ref={track}
          className="ads-narrator-track"
          onPointerDown={(e) => {
            if (e.button !== 0) return
            e.currentTarget.setPointerCapture(e.pointerId)
            fromPointer(e)
            thumb.current?.focus({ preventScroll: true })
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e)
          }}
        >
          <span className="ads-narrator-line">
            <span style={{ width: `${share}%` }} />
          </span>
          <span
            ref={thumb}
            className="ads-narrator-thumb"
            role="slider"
            tabIndex={0}
            aria-label="Position"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${clock(time)} of ${clock(duration)}`}
            style={{ left: `${share}%` }}
            onKeyDown={(e) => {
              const to =
                e.key === "ArrowRight" || e.key === "ArrowUp"
                  ? time + 5
                  : e.key === "ArrowLeft" || e.key === "ArrowDown"
                    ? time - 5
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? duration
                        : null
              if (to === null) return
              e.preventDefault()
              seek(to)
            }}
          />
        </div>
        <span className="ads-narrator-time">
          {clock(time)}
          <span>/</span>
          {clock(duration)}
        </span>
      </div>
    </div>
  )
}

// What the demo cursor does: it plays, moves the bar on, pauses, narrows
// the figure until the narrator runs across the foot of the page, plays
// and pauses there, and lets the figure out again. Its notes are the
// "Claude Narrator" component's sample words and its boards.
const NARRATOR_DEMO: Array<DemoStep> = [
  {
    on: ".ads-narrator-play",
    click: true,
    rest: 2600,
    note: {
      kind: "concept",
      title: "Voice",
      on: ".ads-narrator-bar",
      text: "The file’s sample reads “Voice: Buttery.”",
    },
  },
  {
    on: ".ads-narrator-thumb",
    drag: 200,
    rest: 1600,
    note: {
      kind: "concept",
      title: "Audio Player",
      on: ".ads-narrator-player",
      text: "A named part of the component. In the file it stands at 5:23 of 6:12.",
    },
  },
  { on: ".ads-narrator-play", click: true, rest: 900 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 390,
    note: {
      kind: "concept",
      title: "Mobile XS",
      on: ".ads-narrator",
      text: "The file draws it on a phone in a board of its own, named “Audio Player.”",
    },
  },
  { on: ".ads-narrator-play", click: true, rest: 2400 },
  { on: ".ads-narrator-play", click: true, rest: 600 },
  { on: ".ads-narrator-thumb", drag: 0, rest: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function NarratorDoc() {
  return (
    <Section caption="A voice picker over an audio player, which sits at the corner of the article, and across its foot on a phone.">
      <Specimen figure>
        <DemoCursor steps={NARRATOR_DEMO}>
          <Resizable
            label="Article width"
            min={390}
            sizes={[["Desktop"], ["Mobile", 600]]}
            className="min-h-[560px] sm:h-[560px]"
          >
            <div className="ads-om-page ads-narrator-page">
              <div className="ads-om-article">
                <ArticleText count={5} />
                <ArticleText count={6} />
                <ArticleText count={4} />
                <ArticleText count={6} />
              </div>
              <ClaudeNarrator />
            </div>
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}
