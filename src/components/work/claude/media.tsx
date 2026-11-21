import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb"

// The film strip at the top of the Overview tab: short clips of the finished
// site, streamed from Mux (HLS only: there are no MP4 files). Chrome and Safari
// play HLS natively; a browser that cannot gets Mux's animated WebP instead.
// A strip can hold still pictures too (the Anthropic overview's), from a URL.

type Clip = {
  /** Mux playback id. */
  id: string
  /** Width over height. */
  ratio: number
  label: string
}

type Still = {
  /** The picture's URL, on an image host that takes a `w` width parameter. */
  src: string
  /** Width over height. */
  ratio: number
  label: string
}

/** One tile of a strip: a clip or a still picture. */
export type StripItem = Clip | Still

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

// The tile's own box, as tall as the strip, as wide as its ratio makes it.
const TILE =
  "relative h-64 shrink-0 overflow-hidden rounded-[20px] bg-card outline outline-1 -outline-offset-1 outline-border md:h-96"

/** A still picture, at the widths its tile can be drawn at. */
function StillTile({ picture }: { picture: Still }) {
  const sized = (w: number) => `${picture.src}?w=${w}&auto=format`
  return (
    <li className={TILE} style={{ aspectRatio: picture.ratio }}>
      <img
        src={sized(1280)}
        srcSet={[640, 1280, 1920].map((w) => `${sized(w)} ${w}w`).join(", ")}
        // As wide as the tile: 384px tall from 768px, 256px below.
        sizes={`(min-width: 768px) ${Math.round(picture.ratio * 384)}px, ${Math.round(picture.ratio * 256)}px`}
        alt={picture.label}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="size-full object-cover"
      />
    </li>
  )
}

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
    <li className={TILE} style={{ aspectRatio: clip.ratio }}>
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
            draggable={false}
            className="size-full object-cover"
          />
        </picture>
      )}
    </li>
  )
}

// The strip's own slow drift, in pixels per second, and how long it leaves the
// visitor alone after they scroll, drag or tap it, in milliseconds.
const DRIFT = 24
const HOLD = 4000

/**
 * A row of clips that runs to the page's edges, with a credit under it: the
 * clips are the studio's, from its own case study.
 *
 * The row drifts sideways on its own, scrolls by touch or trackpad, and can be
 * grabbed with the mouse and thrown. It is endless both ways: whenever the
 * row has moved off centre, a clip that is out of sight on the long side moves
 * to the other end, and the row scrolls by that clip's width in the same
 * commit, so nothing on screen moves. The drift stops under the mouse, while
 * the keyboard is inside the row and for a while after any touch, wheel or
 * drag, and never runs for a visitor who asked for reduced motion.
 */
export function MediaStrip({
  items = CLIPS,
}: {
  /** The strip's clips and pictures; the Claude docs' own by default. */
  items?: Array<StripItem>
} = {}) {
  const strip = useRef<HTMLUListElement>(null)
  const [clips, setClips] = useState(items)
  // Where the drift has got to. Kept here, not read back each frame: a browser
  // may round scrollLeft, and a fraction of a pixel a frame would round away.
  const position = useRef(0)
  // How far to scroll back once a clip has moved from one end to the other.
  const owed = useRef(0)

  useLayoutEffect(() => {
    const row = strip.current
    if (!row || !owed.current) return
    row.scrollLeft -= owed.current
    position.current -= owed.current
    owed.current = 0
  }, [clips])

  useEffect(() => {
    const row = strip.current
    if (!row) return
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // Keeps clips waiting on both sides: one move per call, and only of a
    // clip that is out of sight.
    const balance = () => {
      const tiles = row.children
      const max = row.scrollWidth - row.clientWidth
      if (owed.current || max <= 0 || tiles.length < 2) return
      const view = row.getBoundingClientRect()
      const first = tiles[0].getBoundingClientRect()
      const last = tiles[tiles.length - 1].getBoundingClientRect()
      // A clip's width plus the gap after (or before) it.
      const head = tiles[1].getBoundingClientRect().left - first.left
      const tail =
        last.right - tiles[tiles.length - 2].getBoundingClientRect().right
      if (row.scrollLeft > (max + head) / 2 && first.right < view.left - 1) {
        owed.current = head
        setClips(([clip, ...rest]) => [...rest, clip])
      } else if (
        row.scrollLeft < (max - tail) / 2 &&
        last.left > view.right + 1
      ) {
        owed.current = -tail
        setClips((all) => [all[all.length - 1], ...all.slice(0, -1)])
      }
    }
    // Several moves, a frame apart, until the row is centred again.
    const rebalance = () => {
      balance()
      if (owed.current) requestAnimationFrame(rebalance)
    }

    let frame = 0
    let last = 0
    let moving = false
    let hovering = false
    // The mouse has hold of the row, or has just thrown it.
    let held = false
    let stillUntil = 0
    const hold = () => {
      stillUntil = performance.now() + HOLD
    }

    const step = (now: number) => {
      frame = requestAnimationFrame(step)
      const elapsed = Math.min(now - last, 50)
      last = now
      const max = row.scrollWidth - row.clientWidth
      if (
        hovering ||
        held ||
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
      balance()
    }

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      moving = false
      if (!entry.isIntersecting || reduced) return
      last = performance.now()
      frame = requestAnimationFrame(step)
    })
    observer.observe(row)

    // Grab and throw, with the mouse. Touch and trackpads scroll the row
    // themselves.
    let pressed = false
    let dragging = false
    let lastX = 0
    let lastTime = 0
    let velocity = 0
    let glide = 0
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      if (e.target instanceof Element && e.target.closest("button")) return
      cancelAnimationFrame(glide)
      pressed = true
      dragging = false
      held = true
      lastX = e.clientX
      lastTime = e.timeStamp
      velocity = 0
    }
    const move = (e: PointerEvent) => {
      if (!pressed) return
      const dx = e.clientX - lastX
      if (!dragging) {
        if (Math.abs(dx) < 4) return
        dragging = true
        row.setPointerCapture(e.pointerId)
        row.dataset.dragging = ""
      }
      const dt = Math.max(e.timeStamp - lastTime, 1)
      velocity = 0.8 * (dx / dt) + 0.2 * velocity
      lastX = e.clientX
      lastTime = e.timeStamp
      row.scrollLeft -= dx
      balance()
    }
    const release = () => {
      held = false
      hold()
    }
    const up = (e: PointerEvent) => {
      if (!pressed) return
      pressed = false
      if (!dragging) return release()
      delete row.dataset.dragging
      // The click that follows a drag is swallowed (below); after that, clicks
      // count again.
      setTimeout(() => {
        dragging = false
      })
      // Let go while still: nothing to throw.
      if (reduced || e.timeStamp - lastTime > 80) return release()
      let before = performance.now()
      const coast = (now: number) => {
        const dt = Math.min(now - before, 50)
        before = now
        row.scrollLeft -= velocity * dt
        velocity *= Math.pow(0.95, dt / 16.7)
        balance()
        if (Math.abs(velocity) > 0.02) glide = requestAnimationFrame(coast)
        else release()
      }
      glide = requestAnimationFrame(coast)
    }
    const click = (e: MouseEvent) => {
      if (!dragging) return
      e.preventDefault()
      e.stopPropagation()
    }

    // After a scroll the row did not make itself (touch, trackpad), centre it
    // once the scroll has come to rest; moving clips mid-fling would stop it.
    let settle = 0
    const scrolled = () => {
      if (moving || held) return
      clearTimeout(settle)
      settle = window.setTimeout(rebalance, 150)
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
    row.addEventListener("pointerdown", down)
    row.addEventListener("pointermove", move)
    row.addEventListener("pointerup", up)
    row.addEventListener("pointercancel", up)
    row.addEventListener("click", click, true)
    row.addEventListener("scroll", scrolled, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(glide)
      clearTimeout(settle)
      observer.disconnect()
      for (const type of taken) row.removeEventListener(type, hold)
      row.removeEventListener("pointerenter", enter)
      row.removeEventListener("pointerleave", leave)
      row.removeEventListener("pointerdown", down)
      row.removeEventListener("pointermove", move)
      row.removeEventListener("pointerup", up)
      row.removeEventListener("pointercancel", up)
      row.removeEventListener("click", click, true)
      row.removeEventListener("scroll", scrolled)
    }
  }, [])

  return (
    <figure className="mb-12 flex flex-col gap-3">
      {/* No scroll snapping: it would fight the drift. */}
      <ul
        ref={strip}
        aria-label="Clips of the finished site"
        className="bleed scrollbar-hide flex cursor-grab gap-3 overflow-x-auto select-none data-[dragging]:cursor-grabbing"
      >
        {clips.map((item) =>
          "id" in item ? (
            <ClipTile key={item.id} clip={item} />
          ) : (
            <StillTile key={item.src} picture={item} />
          )
        )}
      </ul>
      <figcaption className="text-xs text-muted-foreground">
        Videos from{" "}
        <a
          className="underline decoration-dotted hover:text-tint hover:decoration-solid"
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
