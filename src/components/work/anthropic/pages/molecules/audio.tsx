import { useEffect, useRef, useState } from "react"
import { TbPlayerPause, TbPlayerPlay, TbVolume } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"

// The Audio Player molecule. There is no sound: playing runs the timeline
// alone, so the playhead moves and the time counts up as they would.

const clock = (s: number) => {
  const whole = Math.floor(s)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

/**
 * The player: a title and the time over the play button and the playbar.
 * Version 1 is the file's podcast player; version 2 (its Claude state)
 * reads an article aloud, with the voice beside the time. The layout
 * follows the player's own width: narrow, the time goes under the title.
 *
 * Play and pause run a silent timeline. The bar is a slider: a press or a
 * drag on it moves the playhead, and so do the arrow keys (five seconds a
 * press), Home, and End.
 */
export function AudioPlayer({
  version = 1,
  title = version === 1 ? "Audio for the podcast" : "Listen to this article...",
  start = 154,
  length = 1335,
}: {
  version?: 1 | 2
  title?: string
  /** Where the playhead starts, in seconds: the file's 2:34. */
  start?: number
  /** The length, in seconds: the file's 22:15. */
  length?: number
}) {
  const [at, setAt] = useState(start)
  const [playing, setPlaying] = useState(false)
  const [dragging, setDragging] = useState(false)

  // Where the playhead is, for the timeline's clock to read.
  const now = useRef(at)
  useEffect(() => {
    now.current = at
  }, [at])

  // The timeline runs in real time while playing, and stops at the end.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (time: number) => {
      const next = Math.min(length, now.current + (time - last) / 1000)
      last = time
      setAt(next)
      if (next >= length) setPlaying(false)
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, length])

  const bar = useRef<HTMLDivElement>(null)
  const seekTo = (clientX: number) => {
    const el = bar.current
    if (!el) return
    const box = el.getBoundingClientRect()
    const part = Math.min(1, Math.max(0, (clientX - box.left) / box.width))
    setAt(part * length)
  }

  const time = (
    <span className="ads-audio-time">
      <span>{clock(at)}</span>
      <span>/</span>
      <span>{clock(length)}</span>
    </span>
  )

  return (
    <div className="ads-audio" data-version={version}>
      <div className="ads-audio-card">
        <div className="ads-audio-head">
          <span className="ads-audio-title">{title}</span>
          {version === 2 ? (
            <span className="ads-audio-side">
              <Button
                variant="secondary"
                size="small"
                icon="trailing"
                glyph={<TbVolume aria-hidden />}
                className="ads-audio-voice"
              >
                Voice: Buttery
              </Button>
              {time}
            </span>
          ) : (
            time
          )}
        </div>
        <div className="ads-audio-play-row">
          <button
            type="button"
            className="ads-audio-play"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (!playing && at >= length) setAt(0)
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
            ref={bar}
            className="ads-audio-bar"
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(length)}
            aria-valuenow={Math.round(at)}
            aria-valuetext={`${clock(at)} of ${clock(length)}`}
            data-dragging={dragging || undefined}
            onPointerDown={(e) => {
              if (e.button !== 0) return
              e.currentTarget.setPointerCapture(e.pointerId)
              setDragging(true)
              seekTo(e.clientX)
            }}
            onPointerMove={(e) => {
              if (dragging) seekTo(e.clientX)
            }}
            onPointerUp={() => setDragging(false)}
            // A press already moved the playhead; a click with no press
            // before it (the demo cursor's) moves it here.
            onClick={(e) => seekTo(e.clientX)}
            onPointerCancel={() => setDragging(false)}
            onKeyDown={(e) => {
              const to =
                e.key === "ArrowRight" || e.key === "ArrowUp"
                  ? at + 5
                  : e.key === "ArrowLeft" || e.key === "ArrowDown"
                    ? at - 5
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? length
                        : null
              if (to === null) return
              e.preventDefault()
              setAt(Math.min(length, Math.max(0, to)))
            }}
            {...quiet}
          >
            <div className="ads-audio-track">
              <div
                className="ads-audio-progress"
                style={{ width: `${(at / length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
