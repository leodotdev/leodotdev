import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { glideTo } from "@/lib/glide"

/** Space kept between two marks, in px, however close their chapters are. */
const GAP = 14
/** The same, with the map open and every mark's name showing beside it. */
const OPEN_GAP = 24
/** Room kept above the marks under the bar, and under them at the foot. */
const MARGIN = 24

/**
 * The chapters of a group's page, as a minimap down the window's right edge
 * (Leo, 2026-11-20: the "Edge minimap" of the layouts he was shown; the bar
 * above holds only the tabs). Each chapter is a short mark, placed by where
 * the chapter falls on the page, as a scrollbar marks what a search found:
 * the stretch from the first chapter's top to the last one's foot is laid
 * along the window's height under the bar, and marks closer than `GAP` are
 * spread apart. The chapter being read has the longer mark, in the text
 * color. A mark's name shows beside it under the pointer or on focus;
 * the current one's shows while the page scrolls, and always where the
 * window leaves the room for it (from 1280px). Under the pointer, or with
 * a mark focused from the keyboard, the map opens (Leo, 2026-11-20: "it
 * should show all the chapters when I'm over it using it"): every name
 * shows, and the marks spread to `OPEN_GAP` apart so the names have room.
 * A mark glides the page to its chapter. The marks show once the bar is held at the top of the
 * window, while the chapters are being read, and fade away above that. The
 * styles are `.chapter-*` in src/styles.css.
 */
export function ChapterNav({
  group,
}: {
  /** A group of a system's docs: its chapters, by slug and title. */
  group: {
    slug: string
    name: string
    docs: ReadonlyArray<{ slug: string; title: string }>
  }
}) {
  // The chapter being read: the last one whose top has passed a line a little
  // below the bar, or the last chapter once the page is at its end (a short
  // one never gets that high); and whether the bar is held at the top of the
  // window. Measured once a frame while scrolling.
  const [reading, setReading] = useState<string | null>(null)
  const [stuck, setStuck] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  useEffect(() => {
    let frame = 0
    let idle = 0
    const measure = () => {
      frame = 0
      let found: string | null = null
      const page = document.documentElement
      const atEnd = window.innerHeight + window.scrollY >= page.scrollHeight - 2
      const bar = document.querySelector("[data-docs-bar]")
      const box = bar?.getBoundingClientRect()
      const line = (box?.height ?? 81) + 81
      for (const el of document.querySelectorAll("article[data-chapter]")) {
        if (!atEnd && el.getBoundingClientRect().top > line) break
        found = el.id
      }
      setReading(found)
      setStuck(!!box && box.top <= 1)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    const onScroll = () => {
      queue()
      setScrolling(true)
      clearTimeout(idle)
      idle = window.setTimeout(() => setScrolling(false), 1000)
    }
    queue()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(idle)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", queue)
    }
  }, [group.slug])

  // Where each mark goes: the track runs from under the bar to the window's
  // foot. Measured again whenever the page or the window changes size (the
  // figures take their heights after the page is first drawn).
  const [track, setTrack] = useState<{
    top: number
    length: number
    shut: Array<number>
    open: Array<number>
  }>({ top: 0, length: 0, shut: [], open: [] })
  const last = useRef("")
  useLayoutEffect(() => {
    let frame = 0
    const place = () => {
      frame = 0
      const chapters = Array.from(
        document.querySelectorAll<HTMLElement>("article[data-chapter]")
      )
      const bar = document.querySelector("[data-docs-bar]")
      if (!chapters.length || !bar) return
      const top = bar.getBoundingClientRect().height + MARGIN
      const length = Math.max(0, window.innerHeight - top - MARGIN)
      const at = (el: HTMLElement) =>
        el.getBoundingClientRect().top + window.scrollY
      const start = at(chapters[0])
      const final = chapters[chapters.length - 1]
      const end = at(final) + final.offsetHeight
      const span = Math.max(1, end - start)
      const marks = chapters.map((el) => ((at(el) - start) / span) * length)
      const shut = spread(marks, GAP, length)
      const open = spread(marks, OPEN_GAP, length)
      const key = `${Math.round(top)}:${shut.join(",")}:${open.join(",")}`
      if (key === last.current) return
      last.current = key
      setTrack({ top, length: Math.round(length), shut, open })
    }
    const queue = () => {
      frame ||= requestAnimationFrame(place)
    }
    place()
    const sizes = new ResizeObserver(queue)
    const main = document.querySelector("article[data-chapter]")?.parentElement
    if (main) sizes.observe(main)
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      sizes.disconnect()
      window.removeEventListener("resize", queue)
    }
  }, [group.slug])

  // A mark glides the page to its chapter: quickly, but so the way there
  // shows. The address gets the chapter's hash once it has arrived (set
  // first, the router would jump there at once). A click with a modifier key
  // keeps its browser meaning.
  const visit = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    const chapter = document.getElementById(slug)
    if (!chapter) return
    e.preventDefault()
    const margin = parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0
    const top = chapter.getBoundingClientRect().top + window.scrollY - margin
    void glideTo(top).then(() =>
      window.history.replaceState(window.history.state, "", `#${slug}`)
    )
  }

  const index = Math.max(
    0,
    group.docs.findIndex((doc) => doc.slug === reading)
  )

  return (
    <nav
      aria-label={`${group.name} chapters`}
      className="chapter-map"
      data-no-wave
      data-shown={stuck || undefined}
      data-scrolling={scrolling || undefined}
      inert={!stuck}
      style={{ top: track.top, height: track.length }}
    >
      {group.docs.map((doc, i) => (
        <a
          key={doc.slug}
          href={`#${doc.slug}`}
          className="chapter-mark"
          aria-current={i === index ? "location" : undefined}
          style={
            {
              "--y": `${track.shut.at(i) ?? 0}px`,
              "--y-open": `${track.open.at(i) ?? 0}px`,
            } as React.CSSProperties
          }
          onClick={(e) => visit(e, doc.slug)}
        >
          <span className="chapter-mark-name">{doc.title}</span>
          <span aria-hidden className="chapter-tick" />
        </a>
      ))}
    </nav>
  )
}

/**
 * Marks at least `gap` apart: those that sit too close are pushed down, and
 * drawn back up from the track's foot if that pushed the last past it. A
 * track too short for them all at `gap` spaces them evenly instead.
 */
function spread(marks: Array<number>, gap: number, length: number) {
  const out = [...marks]
  if (out.length > 1 && (out.length - 1) * gap > length)
    return out.map((_, i) => Math.round((i * length) / (out.length - 1)))
  for (let i = 1; i < out.length; i++)
    out[i] = Math.max(out[i], out[i - 1] + gap)
  for (let i = out.length - 1; i >= 0; i--) {
    const room = length - (out.length - 1 - i) * gap
    out[i] = Math.max(0, Math.min(out[i], room))
  }
  return out.map(Math.round)
}
