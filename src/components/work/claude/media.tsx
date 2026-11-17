import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb"

// The film strip at the top of the Overview tab: short clips of the finished
// site, streamed from Mux (HLS only: there are no MP4 files). Chrome and Safari
// play HLS natively; a browser that cannot gets Mux's animated WebP instead.

type Clip = {
  /** Mux playback id. */
  id: string
  /** Width over height. */
  ratio: number
  label: string
}

const CLIPS: Array<Clip> = [
  {
    id: "JH7L315NR8Mi6SR02ROb2ceyJ02IA1eiUN5MhZXPozKcQ",
    ratio: 1,
    label: "Animation of nodes orbiting the Claude logo",
  },
  {
    id: "HlqIABnn7Ep3C822n025ZWcch3xAELze02akBBHh2Z2OY",
    ratio: 205 / 256,
    label: "The Claude home page and Claude Code page on a phone",
  },
  {
    id: "3YSvLlMDelxWYozn2OCAimIRsiDQQesnkA2lO56zHnw",
    ratio: 4 / 5,
    label: "Book pages with notes in their margins",
  },
  {
    id: "YKYyV7jlcmAyZxd2T00L7glvC0102mY6oBfemNFE4cR8DI",
    ratio: 9 / 16,
    label: "Marginalia layouts in the Figma file",
  },
  {
    id: "nDpPrhENdWP9gyxeApPK9wkA9yOEeSB02CQn73tXcaQk",
    ratio: 512 / 341,
    label: "The home page hero animation on a laptop",
  },
  {
    id: "i3xt2kiChcK7P9VPCXc00pyd6hLdHb48DjMtW2kKX8zg",
    ratio: 1,
    label: "The prompt box, generated code and prompt carousels",
  },
  {
    id: "mkRZ00eREWJYkTL011m7PN1N7dW6SIGeCAN3ycjKfKkA00",
    ratio: 16 / 9,
    label: "A scroll through the design system's Figma file",
  },
]

const stream = (id: string) =>
  `https://stream.mux.com/${id}.m3u8?min_resolution=720p`
const still = (id: string) =>
  `https://image.mux.com/${id}/thumbnail.webp?width=640&time=1`
const animated = (id: string) =>
  `https://image.mux.com/${id}/animated.webp?width=640&fps=15`

// The site's hover wave is for its own chrome, not for a button on a video.
const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

function ClipTile({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement>(null)
  // "video" plays the stream; "image" is the fallback for a browser without HLS.
  const [mode, setMode] = useState<"video" | "image">("video")
  const [playing, setPlaying] = useState(false)
  // Set once the visitor uses the button, so scrolling no longer overrides them.
  const held = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (!video.canPlayType("application/vnd.apple.mpegurl")) {
      setMode("image")
      return
    }
    video.src = stream(clip.id)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Play only while most of the clip is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (held.current) return
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.6 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [clip.id])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    held.current = true
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <li
      className="relative h-64 shrink-0 overflow-hidden rounded-[20px] bg-card outline outline-1 -outline-offset-1 outline-border md:h-96"
      style={{ aspectRatio: clip.ratio }}
    >
      {mode === "video" ? (
        <>
          <video
            ref={ref}
            aria-label={clip.label}
            poster={still(clip.id)}
            crossOrigin="anonymous"
            preload="none"
            muted
            loop
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="size-full object-cover"
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
            className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            {...quiet}
          >
            {playing ? (
              <TbPlayerPauseFilled aria-hidden className="size-3.5" />
            ) : (
              <TbPlayerPlayFilled aria-hidden className="size-3.5" />
            )}
          </button>
        </>
      ) : (
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={still(clip.id)}
          />
          <img
            src={animated(clip.id)}
            alt={clip.label}
            loading="lazy"
            className="size-full object-cover"
          />
        </picture>
      )}
    </li>
  )
}

// The strip's own slow drift, in pixels per second, and how long it leaves the
// visitor alone after they scroll or tap it, in milliseconds.
const DRIFT = 24
const HOLD = 4000

/**
 * A row of clips that drifts sideways on its own (and scrolls by hand) and runs
 * to the page's edges, with a credit under it: the clips are the studio's,
 * from its own case study.
 *
 * The drift loops: once the first clip has left on the left it moves to the
 * end of the row, and the row scrolls back by that clip's width in the same
 * commit, so nothing on screen moves. The drift stops under the mouse, while
 * the keyboard is inside the row and for a while after a touch or wheel, and
 * never runs for a visitor who asked for reduced motion.
 */
export function MediaStrip() {
  const strip = useRef<HTMLUListElement>(null)
  const [clips, setClips] = useState(CLIPS)
  // Where the drift has got to. Kept here, not read back each frame: a browser
  // may round scrollLeft, and a fraction of a pixel a frame would round away.
  const position = useRef(0)
  // The distance to scroll back once the first clip has moved to the end.
  const owed = useRef(0)

  useLayoutEffect(() => {
    if (!strip.current || !owed.current) return
    position.current -= owed.current
    strip.current.scrollLeft = position.current
    owed.current = 0
  }, [clips])

  useEffect(() => {
    const row = strip.current
    if (!row) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let last = 0
    let moving = false
    let hovering = false
    let stillUntil = 0

    const step = (now: number) => {
      frame = requestAnimationFrame(step)
      const elapsed = Math.min(now - last, 50)
      last = now
      const max = row.scrollWidth - row.clientWidth
      if (
        hovering ||
        now < stillUntil ||
        max <= 0 ||
        owed.current ||
        row.contains(document.activeElement)
      ) {
        moving = false
        return
      }
      // Start from wherever the visitor left the row.
      if (!moving) position.current = row.scrollLeft
      moving = true
      position.current = Math.min(
        position.current + (DRIFT * elapsed) / 1000,
        max
      )
      row.scrollLeft = position.current

      // The first clip is out of sight: send it to the end of the row.
      const [first, second] = row.children
      if (
        first.getBoundingClientRect().right <
        row.getBoundingClientRect().left - 1
      ) {
        owed.current =
          second.getBoundingClientRect().left -
          first.getBoundingClientRect().left
        setClips(([head, ...rest]) => [...rest, head])
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      moving = false
      if (!entry.isIntersecting) return
      last = performance.now()
      frame = requestAnimationFrame(step)
    })
    observer.observe(row)

    const hold = () => {
      stillUntil = performance.now() + HOLD
    }
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true
    }
    const leave = () => {
      hovering = false
    }
    const taken = ["wheel", "touchstart", "touchmove", "pointerdown"]
    for (const type of taken)
      row.addEventListener(type, hold, { passive: true })
    row.addEventListener("pointerenter", enter)
    row.addEventListener("pointerleave", leave)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      for (const type of taken) row.removeEventListener(type, hold)
      row.removeEventListener("pointerenter", enter)
      row.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <figure className="mb-12 flex flex-col gap-3">
      {/* No scroll snapping: it would fight the drift. */}
      <ul
        ref={strip}
        aria-label="Clips of the finished site"
        className="-mx-6 scrollbar-hide flex gap-3 overflow-x-auto px-6 md:-mx-12 md:px-12"
      >
        {clips.map((clip) => (
          <ClipTile key={clip.id} clip={clip} />
        ))}
      </ul>
      <figcaption className="text-xs text-muted-foreground">
        Videos from{" "}
        <a
          className="underline decoration-dotted hover:text-blue hover:decoration-solid"
          href="https://dbco.online/"
          target="_blank"
          rel="noreferrer"
        >
          Design Business Company
        </a>
      </figcaption>
    </figure>
  )
}
